// Dashboard Page Script
let currentUser = null;
let userVehicles = [];
let allRefuelRecords = [];

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', async () => {
  AuthModule.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '../index.html';
      return;
    }

    currentUser = user;
    
    // Set data e hora imediatamente (sem aguardar)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('refuel-date').value = today;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('refuel-time').value = `${hours}:${minutes}`;
    
    // Carregar tudo em paralelo
    UtilsModule.showLoading(true);
    
    try {
      await Promise.all([
        loadUserData(),
        loadVehicles(),
        loadRecentRefuels()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      UtilsModule.showNotification('Erro ao carregar dados', 'error');
    } finally {
      UtilsModule.showLoading(false);
    }
  });
});

// Carregar dados do usuário (não bloqueia)
window.loadUserData = async function() {
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    if (userData) {
      document.getElementById('user-name').textContent = userData.fullName.split(' ')[0];
    }
  } catch (err) {
    console.error('Erro ao carregar dados do usuário:', err);
  }
}

// Carregar veículos do usuário (otimizado)
window.loadVehicles = async function() {
  try {
    const result = await VehicleModule.getUserVehicles(currentUser.uid);

    if (result.success) {
      userVehicles = result.vehicles;

      const select = document.getElementById('vehicle-select');
      select.innerHTML = '';

      if (userVehicles.length === 0) {
        select.innerHTML = '<option value="">Nenhum veículo cadastrado</option>';
        document.getElementById('total-vehicles').textContent = '0';
      } else {
        userVehicles.forEach(vehicle => {
          const option = document.createElement('option');
          option.value = vehicle.id;
          option.textContent = `${vehicle.licensePlate} - ${vehicle.model}`;
          select.appendChild(option);
        });

        document.getElementById('total-vehicles').textContent = userVehicles.length;
        
        // Calcular estatísticas
        await updateStats();
      }
    }
  } catch (err) {
    console.error('Erro ao carregar veículos:', err);
  }
}

// Atualizar estatísticas
window.updateStats = async function() {
  if (userVehicles.length === 0) return;

  // Obter último abastecimento
  const result = await RefuelModule.getUserRefuelHistory(currentUser.uid, 1);
  
  if (result.success && result.records.length > 0) {
    const lastRefuel = result.records[0];
    document.getElementById('last-refuel').textContent = UtilsModule.formatDate(lastRefuel.date);
  }

  // Calcular estatísticas do mês
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthRecords = result.records.filter(r => new Date(r.date) >= monthStart);
  
  const totalLiters = monthRecords.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = monthRecords.reduce((sum, r) => sum + r.cost, 0);

  document.getElementById('liters-month').textContent = UtilsModule.formatNumber(totalLiters, 0);
  document.getElementById('cost-month').textContent = UtilsModule.formatCurrency(totalCost);
}

// Carregar abastecimentos recentes
window.loadRecentRefuels = async function() {
  const result = await RefuelModule.getUserRefuelHistory(currentUser.uid, 5);

  const container = document.getElementById('recent-refuels');
  container.innerHTML = '';

  if (result.success && result.records.length > 0) {
    result.records.forEach(record => {
      const vehicle = userVehicles.find(v => v.id === record.vehicleId);
      
      const div = document.createElement('div');
      div.className = 'bg-slate-700 rounded-lg p-3 hover:bg-slate-600 transition cursor-pointer';
      div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="text-white font-semibold">${vehicle?.licensePlate || 'Veículo'}</p>
            <p class="text-slate-400 text-xs">${UtilsModule.formatDateTime(record.date)}</p>
          </div>
          <span class="text-green-400 font-bold">${record.liters}L</span>
        </div>
        <p class="text-slate-300 text-sm">${UtilsModule.formatCurrency(record.cost)}</p>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p class="text-slate-400 text-sm">Nenhum abastecimento registrado</p>';
  }
}

// Handle Refuel Submit - Otimizado
window.handleRefuelSubmit = async function(event) {
  event.preventDefault();

  const vehicleId = document.getElementById('vehicle-select').value;
  const km = document.getElementById('refuel-km').value;
  const liters = document.getElementById('refuel-liters').value;
  const date = document.getElementById('refuel-date').value;
  const time = document.getElementById('refuel-time').value;
  const cost = document.getElementById('refuel-cost').value;
  const fuelType = document.getElementById('refuel-type').value;
  const location = document.getElementById('refuel-location').value;
  const notes = document.getElementById('refuel-notes').value;

  if (!vehicleId) {
    UtilsModule.showNotification('Por favor, selecione um veículo', 'warning');
    return;
  }

  UtilsModule.showLoading(true);

  const refuelData = {
    km, liters, date, time, cost: cost || 0, fuelType, location, notes
  };

  const result = await RefuelModule.recordRefuel(vehicleId, currentUser.uid, refuelData);

  if (result.success) {
    UtilsModule.showNotification('Abastecimento registrado com sucesso!', 'success');
    
    // Limpar formulário imediatamente
    resetForm();
    UtilsModule.showLoading(false);
    
    // Atualizar UI e enviar email em background (não bloqueia)
    const vehicle = userVehicles.find(v => v.id === vehicleId);
    const userData = (await db.collection('users').doc(currentUser.uid).get()).data();

    // Executar em paralelo, mas não esperar
    Promise.all([
      generateRefuelPDF(vehicle, userData, refuelData, result.recordId).catch(err => console.error('PDF error:', err)),
      EmailModule.sendRefuelEmail(userData, vehicle, {
        ...refuelData,
        date: new Date(`${date}T${time}`)
      }).catch(err => console.error('Email error:', err))
    ]).then(() => {
      // Atualizar listagem após tudo completar
      loadRecentRefuels();
      updateStats();
    });
    
  } else {
    UtilsModule.showLoading(false);
    UtilsModule.showNotification('Erro ao registrar abastecimento: ' + result.error, 'error');
  }
}

// Reset Form
window.resetForm = function() {
  document.getElementById('refuel-km').value = '';
  document.getElementById('refuel-liters').value = '';
  document.getElementById('refuel-cost').value = '';
  document.getElementById('refuel-location').value = '';
  document.getElementById('refuel-notes').value = '';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('refuel-date').value = today;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('refuel-time').value = `${hours}:${minutes}`;
}

// Handle Logout
window.handleLogout = async function() {
  UtilsModule.showLoading(true);
  
  const result = await AuthModule.logout();

  if (result.success) {
    UtilsModule.showNotification('Logout realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  }

  UtilsModule.showLoading(false);
}

// Função auxiliar de navegação
window.navigateTo = function(page) {
  window.location.href = page;
}

// Gerar PDF do abastecimento
window.generateRefuelPDF = async function(vehicle, userData, refuelData, recordId) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cores
    const primaryColor = [30, 41, 59]; // Slate-800
    const secondaryColor = [100, 116, 139]; // Slate-400
    const accentColor = [59, 130, 246]; // Blue-500

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('FleetFuel', 15, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Sistema de Gestão de Abastecimento de Frota', 15, 28);

    // Informações principais
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Comprovante de Abastecimento', 15, 50);

    // Linha separadora
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(15, 52, 195, 52);

    // Informações do usuário e veículo
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...primaryColor);

    const yStart = 60;
    const lineHeight = 7;

    // Coluna 1
    doc.text('Empresa:', 15, yStart);
    doc.setFont(undefined, 'bold');
    doc.text(userData.company || 'N/A', 50, yStart);

    doc.setFont(undefined, 'normal');
    doc.text('Motorista:', 15, yStart + lineHeight);
    doc.setFont(undefined, 'bold');
    doc.text(userData.fullName, 50, yStart + lineHeight);

    doc.setFont(undefined, 'normal');
    doc.text('Email:', 15, yStart + lineHeight * 2);
    doc.setFont(undefined, 'bold');
    doc.text(userData.email, 50, yStart + lineHeight * 2);

    // Coluna 2
    doc.setFont(undefined, 'normal');
    doc.text('Placa do Veículo:', 120, yStart);
    doc.setFont(undefined, 'bold');
    doc.text(vehicle.licensePlate, 155, yStart);

    doc.setFont(undefined, 'normal');
    doc.text('Modelo:', 120, yStart + lineHeight);
    doc.setFont(undefined, 'bold');
    doc.text(vehicle.model, 155, yStart + lineHeight);

    doc.setFont(undefined, 'normal');
    doc.text('Capacidade:', 120, yStart + lineHeight * 2);
    doc.setFont(undefined, 'bold');
    doc.text(`${vehicle.capacity}L`, 155, yStart + lineHeight * 2);

    // Informações do abastecimento
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Dados do Abastecimento', 15, yStart + lineHeight * 4);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const dataStart = yStart + lineHeight * 5.5;

    const dataFields = [
      { label: 'Data:', value: refuelData.date, x: 15 },
      { label: 'Hora:', value: refuelData.time, x: 80 },
      { label: 'Quilometragem:', value: `${refuelData.km} km`, x: 145 },
      { label: 'Litros:', value: `${refuelData.liters}L`, x: 15, y: lineHeight },
      { label: 'Tipo Combustível:', value: refuelData.fuelType, x: 80, y: lineHeight },
      { label: 'Custo:', value: `R$ ${parseFloat(refuelData.cost).toFixed(2)}`, x: 145, y: lineHeight },
      { label: 'Localização:', value: refuelData.location || 'N/A', x: 15, y: lineHeight * 2, fullWidth: true },
      { label: 'Notas:', value: refuelData.notes || 'N/A', x: 15, y: lineHeight * 3, fullWidth: true }
    ];

    dataFields.forEach(field => {
      const y = dataStart + (field.y || 0);
      doc.setFont(undefined, 'bold');
      doc.text(field.label, field.x, y);
      doc.setFont(undefined, 'normal');
      doc.text(field.value.toString(), field.x + 35, y);
    });

    // Footer
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(8);
    const pageHeight = doc.internal.pageSize.height;
    doc.text(
      `ID do Registro: ${recordId || 'N/A'} | Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      15,
      pageHeight - 10
    );

    // Salvar PDF
    const fileName = `abastecimento_${vehicle.licensePlate}_${refuelData.date}.pdf`;
    doc.save(fileName);

    console.log('✅ PDF gerado com sucesso:', fileName);
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    UtilsModule.showNotification('Erro ao gerar PDF', 'error');
  }
}
