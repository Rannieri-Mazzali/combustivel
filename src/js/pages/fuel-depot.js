// Fuel Depot Page Script
let currentUser = null;
let depotData = null;
let depotHistory = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  AuthModule.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '../index.html';
      return;
    }

    currentUser = user;
    
    // Load data in parallel
    Promise.all([
      loadUserData(),
      loadDepotData(),
      loadDepotHistory()
    ]).catch(err => console.error('Erro ao carregar dados:', err));

    // Update display every 2 seconds
    setInterval(updateDepotDisplay, 2000);
  });
});

// Load user data
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

// Load depot data
window.loadDepotData = async function() {
  UtilsModule.showLoading(true);

  const result = await FuelDepotModule.getUserDepotData(currentUser.uid);

  if (result.success) {
    depotData = result.depot;
    updateDepotDisplay();
  } else {
    UtilsModule.showNotification('Erro ao carregar depósito: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Update depot visual
window.updateDepotDisplay = function() {
  if (!depotData) return;

  const percentage = (depotData.totalLiters / depotData.capacity) * 100;
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  // Update tank level
  const fuelLevel = document.getElementById('fuel-level');
  if (fuelLevel) {
    fuelLevel.style.height = safePercentage + '%';
    fuelLevel.style.backgroundColor = getFuelColor(safePercentage);
  }

  // Update percentage text
  const percentageText = document.getElementById('fuel-percentage');
  if (percentageText) {
    percentageText.textContent = safePercentage.toFixed(1) + '%';
  }

  // Update liters text
  const litersText = document.getElementById('fuel-liters');
  if (litersText) {
    litersText.textContent = depotData.totalLiters.toFixed(2) + ' L';
  }

  // Update capacity text
  const capacityText = document.getElementById('fuel-capacity');
  if (capacityText) {
    capacityText.textContent = 'Capacidade: ' + depotData.capacity.toFixed(0) + ' L';
  }

  // Update remaining capacity
  const remainingText = document.getElementById('fuel-remaining');
  if (remainingText) {
    const remaining = depotData.capacity - depotData.totalLiters;
    remainingText.textContent = 'Espaço: ' + remaining.toFixed(2) + ' L';
  }
}

// Get color based on fuel level
window.getFuelColor = function(percentage) {
  if (percentage > 75) {
    return '#10b981'; // Green
  } else if (percentage > 50) {
    return '#3b82f6'; // Blue
  } else if (percentage > 25) {
    return '#f59e0b'; // Amber
  } else {
    return '#ef4444'; // Red
  }
}

// Load depot history
window.loadDepotHistory = async function() {
  const result = await FuelDepotModule.getDepotHistory(currentUser.uid, 30);

  if (result.success) {
    depotHistory = result.records;
    displayDepotHistory();
  }
}

// Display depot history
window.displayDepotHistory = function() {
  const container = document.getElementById('history-container');
  container.innerHTML = '';

  if (depotHistory.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <p>Nenhum registro de combustível ainda</p>
      </div>
    `;
    return;
  }

  depotHistory.forEach(record => {
    const div = document.createElement('div');
    div.className = 'bg-slate-700 p-4 rounded-lg border border-slate-600 flex justify-between items-center';
    
    const isWithdrawal = record.type === 'withdrawal';
    const sign = isWithdrawal ? '-' : '+';
    const color = isWithdrawal ? 'text-red-400' : 'text-green-400';
    
    div.innerHTML = `
      <div>
        <p class="text-white font-semibold">${isWithdrawal ? 'Retirada' : 'Adição'}</p>
        <p class="text-slate-400 text-sm">${UtilsModule.formatDateTime(record.addedAt || record.withdrawnAt)}</p>
        ${record.reason ? `<p class="text-slate-400 text-sm">${record.reason}</p>` : ''}
      </div>
      <div class="text-right">
        <p class="text-xl font-bold ${color}">${sign} ${record.liters.toFixed(2)} L</p>
      </div>
    `;
    
    container.appendChild(div);
  });
}

// Handle add fuel
window.handleAddFuel = async function(event) {
  event.preventDefault();

  const fuelType = document.getElementById('fuel-type').value;
  const liters = parseFloat(document.getElementById('fuel-liters-input').value);
  const notes = document.getElementById('fuel-notes').value;

  if (liters <= 0) {
    UtilsModule.showNotification('Quantidade deve ser maior que zero', 'error');
    return;
  }

  if (!depotData) {
    UtilsModule.showNotification('Depósito não inicializado', 'error');
    return;
  }

  if (depotData.totalLiters + liters > depotData.capacity) {
    UtilsModule.showNotification(`Capacidade máxima do depósito é ${depotData.capacity}L. Espaço disponível: ${(depotData.capacity - depotData.totalLiters).toFixed(2)}L`, 'error');
    return;
  }

  UtilsModule.showLoading(true);

  const result = await FuelDepotModule.addFuelToDepot(currentUser.uid, fuelType, liters, notes);

  if (result.success) {
    UtilsModule.showNotification('Combustível adicionado com sucesso!', 'success');
    
    // Reload depot data
    await loadDepotData();
    await loadDepotHistory();
    
    // Clear form
    document.getElementById('fuel-type').value = 'Diesel';
    document.getElementById('fuel-liters-input').value = '';
    document.getElementById('fuel-notes').value = '';

    UtilsModule.showLoading(false);
  } else {
    UtilsModule.showLoading(false);
    UtilsModule.showNotification('Erro ao adicionar combustível: ' + result.error, 'error');
  }
}

// Handle capacity update
window.handleCapacityUpdate = async function(event) {
  event.preventDefault();

  const newCapacity = parseFloat(document.getElementById('new-capacity').value);

  if (newCapacity <= 0) {
    UtilsModule.showNotification('Capacidade deve ser maior que zero', 'error');
    return;
  }

  if (newCapacity < depotData.totalLiters) {
    UtilsModule.showNotification(`Capacidade não pode ser menor que combustível atual (${depotData.totalLiters.toFixed(2)}L)`, 'error');
    return;
  }

  UtilsModule.showLoading(true);

  const result = await FuelDepotModule.updateDepotCapacity(currentUser.uid, newCapacity);

  if (result.success) {
    UtilsModule.showNotification('Capacidade atualizada com sucesso!', 'success');
    
    // Update local data and display
    depotData.capacity = newCapacity;
    updateDepotDisplay();
    
    // Close modal
    closeCapacityModal();
    UtilsModule.showLoading(false);
  } else {
    UtilsModule.showLoading(false);
    UtilsModule.showNotification('Erro ao atualizar capacidade: ' + result.error, 'error');
  }
}

// Modal functions
window.openCapacityModal = function() {
  document.getElementById('capacity-modal').classList.remove('hidden');
  document.getElementById('new-capacity').value = depotData.capacity;
}

window.closeCapacityModal = function() {
  document.getElementById('capacity-modal').classList.add('hidden');
}

// Handle logout
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

// Navigation helper
window.navigateTo = function(page) {
  window.location.href = page;
}
