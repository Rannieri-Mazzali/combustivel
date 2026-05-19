// History Page Script
let currentUser = null;
let userVehicles = [];
let allRecords = [];
let filteredRecords = [];
let currentPage = 1;
const recordsPerPage = 10;

// Inicializar página de histórico
document.addEventListener('DOMContentLoaded', async () => {
  AuthModule.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '../index.html';
      return;
    }

    currentUser = user;
    
    // Carregar dados em paralelo
    UtilsModule.showLoading(true);
    try {
      await Promise.all([
        loadUserData(),
        loadVehicles(),
        loadHistory()
      ]);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      UtilsModule.showNotification('Erro ao carregar dados', 'error');
    } finally {
      UtilsModule.showLoading(false);
    }
  });
});

// Carregar dados do usuário (não bloqueia)
async function loadUserData() {
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

// Carregar veículos (não bloqueia)
async function loadVehicles() {
  try {
    const result = await VehicleModule.getUserVehicles(currentUser.uid);

    if (result.success) {
      userVehicles = result.vehicles;

      const select = document.getElementById('filter-vehicle');
      select.innerHTML = '<option value="">Todos os veículos</option>';

      userVehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.licensePlate} - ${vehicle.model}`;
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Erro ao carregar veículos:', err);
  }
}

// Carregar histórico
async function loadHistory() {
  UtilsModule.showLoading(true);

  const result = await RefuelModule.getUserRefuelHistory(currentUser.uid, 1000);

  if (result.success) {
    allRecords = result.records;
    filteredRecords = allRecords;
    currentPage = 1;
    displayRecords();
    updateSummary();
  }

  UtilsModule.showLoading(false);
}

// Aplicar filtros
function applyFilters() {
  const vehicleFilter = document.getElementById('filter-vehicle').value;
  const dateStart = document.getElementById('filter-date-start').value;
  const dateEnd = document.getElementById('filter-date-end').value;

  filteredRecords = allRecords.filter(record => {
    const vehicleMatch = !vehicleFilter || record.vehicleId === vehicleFilter;
    
    let dateMatch = true;
    if (dateStart) {
      dateMatch = dateMatch && new Date(record.date) >= new Date(dateStart);
    }
    if (dateEnd) {
      const endDate = new Date(dateEnd);
      endDate.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && new Date(record.date) <= endDate;
    }

    return vehicleMatch && dateMatch;
  });

  currentPage = 1;
  displayRecords();
  updateSummary();
}

// Exibir registros na tabela
function displayRecords() {
  const tbody = document.getElementById('refuel-table-body');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const pageRecords = filteredRecords.slice(start, end);

  if (pageRecords.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-6 py-8 text-center text-slate-400">
          Nenhum registro encontrado
        </td>
      </tr>
    `;
    return;
  }

  pageRecords.forEach(record => {
    const vehicle = userVehicles.find(v => v.id === record.vehicleId);
    
    const row = document.createElement('tr');
    row.className = 'border-b border-slate-700 hover:bg-slate-700 transition';
    row.innerHTML = `
      <td class="px-6 py-4 font-semibold text-white">${vehicle?.licensePlate || 'N/A'}</td>
      <td class="px-6 py-4 text-slate-300">${UtilsModule.formatDateTime(record.date)}</td>
      <td class="px-6 py-4 text-right text-slate-300">${UtilsModule.formatNumber(record.km, 2)}</td>
      <td class="px-6 py-4 text-right text-slate-300">${UtilsModule.formatNumber(record.liters, 2)}</td>
      <td class="px-6 py-4 text-right text-green-400 font-semibold">${UtilsModule.formatCurrency(record.cost)}</td>
      <td class="px-6 py-4 text-slate-300">
        <span class="px-3 py-1 bg-blue-600 rounded-full text-xs">${record.fuelType}</span>
      </td>
      <td class="px-6 py-4 text-slate-300">${record.location || '-'}</td>
      <td class="px-6 py-4 text-center">
        <button onclick="openEditModal('${record.id}')" class="text-blue-400 hover:text-blue-300 mr-3">✏️ Editar</button>
        <button onclick="deleteRecord('${record.id}')" class="text-red-400 hover:text-red-300">🗑️ Deletar</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  updatePagination();
}

// Atualizar informações de paginação
function updatePagination() {
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage + 1;
  const end = Math.min(currentPage * recordsPerPage, filteredRecords.length);

  document.getElementById('pagination-info').textContent = 
    `Exibindo ${start} a ${end} de ${filteredRecords.length} registros (Página ${currentPage} de ${totalPages})`;
}

// Próxima página
function nextPage() {
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayRecords();
    window.scrollTo(0, 0);
  }
}

// Página anterior
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayRecords();
    window.scrollTo(0, 0);
  }
}

// Abrir modal de edição
function openEditModal(recordId) {
  const record = allRecords.find(r => r.id === recordId);
  
  document.getElementById('edit-record-id').value = recordId;
  document.getElementById('edit-km').value = record.km;
  document.getElementById('edit-liters').value = record.liters;
  document.getElementById('edit-cost').value = record.cost;

  document.getElementById('edit-modal').classList.remove('hidden');
}

// Fechar modal
function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

// Salvar edição
async function saveEdit(event) {
  event.preventDefault();

  const recordId = document.getElementById('edit-record-id').value;
  const km = parseFloat(document.getElementById('edit-km').value);
  const liters = parseFloat(document.getElementById('edit-liters').value);
  const cost = parseFloat(document.getElementById('edit-cost').value);

  UtilsModule.showLoading(true);

  const result = await RefuelModule.updateRefuelRecord(recordId, { km, liters, cost });

  if (result.success) {
    UtilsModule.showNotification('Registro atualizado com sucesso!', 'success');
    closeEditModal();
    await loadHistory();
  } else {
    UtilsModule.showNotification('Erro ao atualizar registro: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Deletar registro
async function deleteRecord(recordId) {
  if (confirm('Tem certeza que deseja deletar este registro?')) {
    UtilsModule.showLoading(true);

    const result = await RefuelModule.deleteRefuelRecord(recordId);

    if (result.success) {
      UtilsModule.showNotification('Registro deletado com sucesso!', 'success');
      await loadHistory();
    } else {
      UtilsModule.showNotification('Erro ao deletar registro: ' + result.error, 'error');
    }

    UtilsModule.showLoading(false);
  }
}

// Atualizar sumário
function updateSummary() {
  const totalRecords = filteredRecords.length;
  const totalLiters = filteredRecords.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = filteredRecords.reduce((sum, r) => sum + r.cost, 0);
  const averagePerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;

  document.getElementById('summary-total').textContent = totalRecords;
  document.getElementById('summary-liters').textContent = UtilsModule.formatNumber(totalLiters, 0);
  document.getElementById('summary-cost').textContent = UtilsModule.formatCurrency(totalCost);
  document.getElementById('summary-average').textContent = UtilsModule.formatCurrency(averagePerLiter);
}

// Exportar para CSV
function exportToCSV() {
  if (filteredRecords.length === 0) {
    UtilsModule.showNotification('Nenhum registro para exportar', 'warning');
    return;
  }

  const data = filteredRecords.map(record => {
    const vehicle = userVehicles.find(v => v.id === record.vehicleId);
    return {
      'Placa': vehicle?.licensePlate || 'N/A',
      'Data': UtilsModule.formatDateTime(record.date),
      'KM': record.km,
      'Litros': record.liters,
      'Custo': record.cost,
      'Tipo': record.fuelType,
      'Local': record.location || '-',
      'Observações': record.notes || '-'
    };
  });

  UtilsModule.exportToCSV(data, 'abastecimentos.csv');
  UtilsModule.showNotification('Arquivo exportado com sucesso!', 'success');
}

// Enviar relatório por email
async function sendReport() {
  if (filteredRecords.length === 0) {
    UtilsModule.showNotification('Nenhum registro para enviar', 'warning');
    return;
  }

  UtilsModule.showLoading(true);

  const userData = (await db.collection('users').doc(currentUser.uid).get()).data();
  
  const result = await EmailModule.sendDailyReport(userData, filteredRecords);

  if (result.success) {
    UtilsModule.showNotification('Relatório enviado com sucesso!', 'success');
  } else {
    UtilsModule.showNotification('Erro ao enviar relatório: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Handle Logout
async function handleLogout() {
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
function navigateTo(page) {
  window.location.href = page;
}
