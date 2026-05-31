// Dashboard Page Script - Sem Firebase
let currentUser = { uid: 'default', name: 'Usuário' };
let userVehicles = [];
let allRefuelRecords = [];

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Set data e hora imediatamente (sem aguardar)
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('refuel-date');
    if (dateField) dateField.value = today;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeField = document.getElementById('refuel-time');
    if (timeField) timeField.value = `${hours}:${minutes}`;
    
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

// Carregar dados do usuário
window.loadUserData = async function() {
  try {
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
      userNameEl.textContent = 'SilverControl';
    }
  } catch (err) {
    console.error('Erro ao carregar dados do usuário:', err);
  }
}

// Carregar veículos do usuário
window.loadVehicles = async function() {
  try {
    const result = await VehicleModule.getUserVehicles(currentUser.uid);

    if (result.success) {
      userVehicles = result.vehicles;

      const select = document.getElementById('vehicle-select');
      if (!select) return;
      
      select.innerHTML = '';

      if (userVehicles.length === 0) {
        select.innerHTML = '<option value="">Nenhum veículo cadastrado</option>';
        const totalEl = document.getElementById('total-vehicles');
        if (totalEl) totalEl.textContent = '0';
      } else {
        userVehicles.forEach(vehicle => {
          const option = document.createElement('option');
          option.value = vehicle.id;
          option.textContent = `${vehicle.licensePlate} - ${vehicle.model}`;
          select.appendChild(option);
        });

        const totalEl = document.getElementById('total-vehicles');
        if (totalEl) totalEl.textContent = userVehicles.length;
        
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
  const result = await RefuelModule.getUserRefuelHistory(currentUser.uid, 50);
  
  if (result.success && result.records.length > 0) {
    const lastRefuel = result.records[0];
    const lastRefuelEl = document.getElementById('last-refuel');
    if (lastRefuelEl) {
      lastRefuelEl.textContent = UtilsModule.formatDate(lastRefuel.date);
    }
  }

  // Calcular estatísticas do mês
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthRecords = result.records.filter(r => new Date(r.date) >= monthStart);
  
  const totalLiters = monthRecords.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = monthRecords.reduce((sum, r) => sum + r.cost, 0);

  const litersEl = document.getElementById('liters-month');
  const costEl = document.getElementById('cost-month');
  if (litersEl) litersEl.textContent = UtilsModule.formatNumber(totalLiters, 0);
  if (costEl) costEl.textContent = UtilsModule.formatCurrency(totalCost);
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

// Handle Refuel Submit
window.handleRefuelSubmit = async function(event) {
  event.preventDefault();

  const vehicleId = document.getElementById('vehicle-select').value;
  const km = document.getElementById('refuel-km').value;
  const liters = document.getElementById('refuel-liters').value;
  const date = document.getElementById('refuel-date').value;
  const time = document.getElementById('refuel-time').value;
  const cost = document.getElementById('refuel-cost').value;
  const fuelType = document.getElementById('refuel-type')?.value || 'Diesel';
  const location = document.getElementById('refuel-location')?.value || '';
  const notes = document.getElementById('refuel-notes')?.value || '';

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
    
    // Limpar formulário
    resetForm();
    
    // Atualizar listagem
    setTimeout(() => {
      loadRecentRefuels();
      updateStats();
      UtilsModule.showLoading(false);
    }, 500);
    
  } else {
    UtilsModule.showLoading(false);
    UtilsModule.showNotification('Erro ao registrar abastecimento: ' + result.error, 'error');
  }
}

// Limpar formulário
window.resetForm = function() {
  document.getElementById('vehicle-select').value = '';
  document.getElementById('refuel-km').value = '';
  document.getElementById('refuel-liters').value = '';
  document.getElementById('refuel-cost').value = '';
  const locEl = document.getElementById('refuel-location');
  const notesEl = document.getElementById('refuel-notes');
  if (locEl) locEl.value = '';
  if (notesEl) notesEl.value = '';
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('refuel-date').value = today;
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('refuel-time').value = `${hours}:${minutes}`;
}

// Navegar para outras páginas
window.navigateTo = function(page) {
  window.location.href = page;
}

// Logout
window.handleLogout = async function() {
  UtilsModule.showNotification('Saindo do app...', 'info');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 500);
}
