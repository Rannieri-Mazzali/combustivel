// Vehicles Page Script
let currentUser = null;
let userVehicles = [];

// Inicializar página de veículos
document.addEventListener('DOMContentLoaded', async () => {
  AuthModule.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '../index.html';
      return;
    }

    currentUser = user;
    
    // Carregar dados em paralelo para mais velocidade
    Promise.all([
      loadUserData(),
      loadVehicles()
    ]).catch(err => console.error('Erro ao carregar dados:', err));
  });
});

// Carregar dados do usuário (sem bloquear)
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

// Carregar e exibir veículos
async function loadVehicles() {
  UtilsModule.showLoading(true);

  const result = await VehicleModule.getUserVehicles(currentUser.uid);

  if (result.success) {
    userVehicles = result.vehicles;
    displayVehicles();
  } else {
    UtilsModule.showNotification('Erro ao carregar veículos: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Exibir veículos na tela
function displayVehicles() {
  const container = document.getElementById('vehicles-container');
  container.innerHTML = '';

  if (userVehicles.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700 text-center col-span-full">
        <p class="text-slate-400 text-lg mb-4">Nenhum veículo cadastrado</p>
        <p class="text-slate-500">Use o formulário ao lado para adicionar um novo veículo</p>
      </div>
    `;
    return;
  }

  userVehicles.forEach(vehicle => {
    const div = document.createElement('div');
    div.className = 'bg-slate-800 rounded-lg shadow-2xl p-6 border border-slate-700 hover:border-blue-500 transition';
    div.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-2xl font-bold text-white">${vehicle.licensePlate}</h3>
          <p class="text-slate-400">${vehicle.model} - ${vehicle.year}</p>
        </div>
        <div class="text-right">
          <span class="px-3 py-1 bg-green-600 rounded-full text-sm text-white font-semibold">
            Ativo
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p class="text-slate-400 text-sm">Capacidade do Tanque</p>
          <p class="text-white text-lg font-semibold">${vehicle.capacity} L</p>
        </div>
        <div>
          <p class="text-slate-400 text-sm">Total Abastecido</p>
          <p class="text-white text-lg font-semibold">${vehicle.totalRefueled} L</p>
        </div>
        <div>
          <p class="text-slate-400 text-sm">Último Abastecimento</p>
          <p class="text-white text-lg font-semibold">
            ${vehicle.lastRefuel ? UtilsModule.formatDate(vehicle.lastRefuel) : 'Nenhum'}
          </p>
        </div>
        <div>
          <p class="text-slate-400 text-sm">Data de Cadastro</p>
          <p class="text-white text-lg font-semibold">${UtilsModule.formatDate(vehicle.createdAt)}</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button 
          onclick="openEditVehicleModal('${vehicle.id}', '${vehicle.model}', ${vehicle.capacity})"
          class="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          ✏️ Editar
        </button>
        <button 
          onclick="deleteVehicle('${vehicle.id}', '${vehicle.licensePlate}')"
          class="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
        >
          🗑️ Deletar
        </button>
        <button 
          onclick="viewVehicleHistory('${vehicle.id}')"
          class="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
        >
          📊 Histórico
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Handle Add Vehicle - Otimizado com validações robustas
async function handleAddVehicle(event) {
  event.preventDefault();

  const plate = document.getElementById('vehicle-plate').value.trim();
  const model = document.getElementById('vehicle-model').value.trim();
  const year = document.getElementById('vehicle-year').value.trim();
  const capacity = document.getElementById('vehicle-capacity').value.trim();

  // Validações mais robustas
  if (!plate || plate.length < 6) {
    UtilsModule.showNotification('Placa deve ter no mínimo 6 caracteres', 'error');
    return;
  }

  if (!model || model.length < 2) {
    UtilsModule.showNotification('Modelo do veículo inválido', 'error');
    return;
  }

  if (!year || year < 2000 || year > 2100) {
    UtilsModule.showNotification('Ano deve estar entre 2000 e 2100', 'error');
    return;
  }

  if (!capacity || parseFloat(capacity) <= 0) {
    UtilsModule.showNotification('Capacidade deve ser maior que zero', 'error');
    return;
  }

  UtilsModule.showLoading(true);

  const result = await VehicleModule.addVehicle(plate, model, parseInt(year), parseFloat(capacity), currentUser.uid);

  if (result.success) {
    UtilsModule.showNotification('Veículo adicionado com sucesso!', 'success');
    
    // Adicionar veículo à lista local sem recarregar do servidor
    userVehicles.unshift(result.vehicle);
    displayVehicles();
    
    // Limpar formulário
    document.getElementById('vehicle-plate').value = '';
    document.getElementById('vehicle-model').value = '';
    document.getElementById('vehicle-year').value = '';
    document.getElementById('vehicle-capacity').value = '';

    UtilsModule.showLoading(false);
  } else {
    UtilsModule.showLoading(false);
    UtilsModule.showNotification('Erro ao adicionar veículo: ' + result.error, 'error');
  }
}

// Abrir modal de edição
function openEditVehicleModal(vehicleId, model, capacity) {
  document.getElementById('edit-vehicle-id').value = vehicleId;
  document.getElementById('edit-vehicle-model').value = model;
  document.getElementById('edit-vehicle-capacity').value = capacity;

  document.getElementById('edit-vehicle-modal').classList.remove('hidden');
}

// Fechar modal
function closeEditVehicleModal() {
  document.getElementById('edit-vehicle-modal').classList.add('hidden');
}

// Salvar edição de veículo - Otimizado
async function saveVehicleEdit(event) {
  event.preventDefault();

  const vehicleId = document.getElementById('edit-vehicle-id').value;
  const model = document.getElementById('edit-vehicle-model').value;
  const capacity = parseFloat(document.getElementById('edit-vehicle-capacity').value);

  UtilsModule.showLoading(true);

  const result = await VehicleModule.updateVehicle(vehicleId, { model, capacity });

  if (result.success) {
    UtilsModule.showNotification('Veículo atualizado com sucesso!', 'success');
    
    // Atualizar veículo na lista local
    const vehicleIndex = userVehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex !== -1) {
      userVehicles[vehicleIndex].model = model;
      userVehicles[vehicleIndex].capacity = capacity;
      displayVehicles();
    }
    
    closeEditVehicleModal();
    UtilsModule.showLoading(false);
  } else {
    UtilsModule.showLoading(false);
    UtilsModule.showNotification('Erro ao atualizar veículo: ' + result.error, 'error');
  }
}

// Deletar veículo - Otimizado
async function deleteVehicle(vehicleId, licensePlate) {
  if (confirm(`Tem certeza que deseja deletar o veículo ${licensePlate}? Esta ação não pode ser desfeita.`)) {
    UtilsModule.showLoading(true);

    const result = await VehicleModule.deactivateVehicle(vehicleId);

    if (result.success) {
      UtilsModule.showNotification('Veículo deletado com sucesso!', 'success');
      
      // Remover veículo da lista local
      userVehicles = userVehicles.filter(v => v.id !== vehicleId);
      displayVehicles();
      
      UtilsModule.showLoading(false);
    } else {
      UtilsModule.showLoading(false);
      UtilsModule.showNotification('Erro ao deletar veículo: ' + result.error, 'error');
    }
  }
}

// Ver histórico do veículo
function viewVehicleHistory(vehicleId) {
  window.location.href = `history.html?vehicle=${vehicleId}`;
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
