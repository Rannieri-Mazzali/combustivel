// Simple Local Storage Module - Sem Firebase
const StorageModule = {
  // Chaves de armazenamento
  KEYS: {
    VEHICLES: 'silvercontrol_vehicles',
    REFUELS: 'silvercontrol_refuels',
    DEPOTS: 'silvercontrol_depots',
    DEPOT_RECORDS: 'silvercontrol_depot_records',
    APP_DATA: 'silvercontrol_app_data'
  },

  // Inicializar dados
  init() {
    if (!localStorage.getItem(this.KEYS.APP_DATA)) {
      localStorage.setItem(this.KEYS.APP_DATA, JSON.stringify({
        initialized: true,
        createdAt: new Date().toISOString()
      }));
    }
    if (!localStorage.getItem(this.KEYS.VEHICLES)) {
      localStorage.setItem(this.KEYS.VEHICLES, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.REFUELS)) {
      localStorage.setItem(this.KEYS.REFUELS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.DEPOTS)) {
      localStorage.setItem(this.KEYS.DEPOTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.DEPOT_RECORDS)) {
      localStorage.setItem(this.KEYS.DEPOT_RECORDS, JSON.stringify([]));
    }
    console.log('Storage inicializado');
  },

  // Gerar ID único
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // ===== VEÍCULOS =====
  addVehicle(licensePlate, model, year, capacity) {
    try {
      const vehicles = this.getVehicles();
      
      // Validar
      if (!licensePlate || licensePlate.trim().length < 6) {
        return { success: false, error: 'Placa do veículo inválida (mínimo 6 caracteres)' };
      }
      if (!model || model.trim().length < 2) {
        return { success: false, error: 'Modelo do veículo inválido' };
      }
      if (!year || year < 2000 || year > 2100) {
        return { success: false, error: 'Ano do veículo inválido (2000-2100)' };
      }
      if (!capacity || capacity <= 0) {
        return { success: false, error: 'Capacidade do tanque inválida' };
      }

      // Verificar se já existe
      const exists = vehicles.some(v => v.licensePlate.toUpperCase() === licensePlate.trim().toUpperCase());
      if (exists) {
        return { success: false, error: 'Veículo com essa placa já cadastrado' };
      }

      const vehicle = {
        id: this.generateId(),
        licensePlate: licensePlate.trim().toUpperCase(),
        model: model.trim(),
        year: parseInt(year),
        capacity: parseFloat(capacity),
        createdAt: new Date().toISOString(),
        totalRefueled: 0,
        lastRefuel: null,
        active: true
      };

      vehicles.push(vehicle);
      localStorage.setItem(this.KEYS.VEHICLES, JSON.stringify(vehicles));
      
      console.log('Veículo adicionado:', vehicle);
      return { success: true, vehicleId: vehicle.id, vehicle: vehicle };
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      return { success: false, error: error.message };
    }
  },

  getVehicles() {
    try {
      const data = localStorage.getItem(this.KEYS.VEHICLES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao obter veículos:', error);
      return [];
    }
  },

  getVehicle(vehicleId) {
    const vehicles = this.getVehicles();
    return vehicles.find(v => v.id === vehicleId);
  },

  updateVehicle(vehicleId, updates) {
    try {
      const vehicles = this.getVehicles();
      const index = vehicles.findIndex(v => v.id === vehicleId);
      
      if (index === -1) {
        return { success: false, error: 'Veículo não encontrado' };
      }

      vehicles[index] = { ...vehicles[index], ...updates };
      localStorage.setItem(this.KEYS.VEHICLES, JSON.stringify(vehicles));
      
      return { success: true, vehicle: vehicles[index] };
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      return { success: false, error: error.message };
    }
  },

  deleteVehicle(vehicleId) {
    try {
      const vehicles = this.getVehicles();
      const filtered = vehicles.filter(v => v.id !== vehicleId);
      localStorage.setItem(this.KEYS.VEHICLES, JSON.stringify(filtered));
      
      // Remover abastecimentos relacionados
      const refuels = this.getRefuels();
      const refuelsFiltered = refuels.filter(r => r.vehicleId !== vehicleId);
      localStorage.setItem(this.KEYS.REFUELS, JSON.stringify(refuelsFiltered));
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      return { success: false, error: error.message };
    }
  },

  // ===== ABASTECIMENTOS =====
  addRefuel(vehicleId, data) {
    try {
      const vehicles = this.getVehicles();
      const vehicle = vehicles.find(v => v.id === vehicleId);
      
      if (!vehicle) {
        return { success: false, error: 'Veículo não encontrado' };
      }

      const refuel = {
        id: this.generateId(),
        vehicleId: vehicleId,
        km: parseFloat(data.km),
        liters: parseFloat(data.liters),
        date: data.date,
        time: data.time,
        cost: parseFloat(data.cost) || 0,
        fuelType: data.fuelType || 'Diesel',
        location: data.location || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
      };

      const refuels = this.getRefuels();
      refuels.push(refuel);
      localStorage.setItem(this.KEYS.REFUELS, JSON.stringify(refuels));

      // Atualizar veículo
      vehicle.totalRefueled = parseFloat(vehicle.totalRefueled || 0) + refuel.liters;
      vehicle.lastRefuel = new Date().toISOString();
      this.updateVehicle(vehicleId, vehicle);

      console.log('Abastecimento adicionado:', refuel);
      return { success: true, recordId: refuel.id, refuel: refuel };
    } catch (error) {
      console.error('Erro ao adicionar abastecimento:', error);
      return { success: false, error: error.message };
    }
  },

  getRefuels() {
    try {
      const data = localStorage.getItem(this.KEYS.REFUELS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao obter abastecimentos:', error);
      return [];
    }
  },

  getVehicleRefuelHistory(vehicleId, limit = 50) {
    const refuels = this.getRefuels();
    return refuels
      .filter(r => r.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  getAllRefuelHistory(limit = 100) {
    const refuels = this.getRefuels();
    return refuels
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  deleteRefuel(refuelId) {
    try {
      const refuels = this.getRefuels();
      const refuel = refuels.find(r => r.id === refuelId);
      
      if (!refuel) {
        return { success: false, error: 'Abastecimento não encontrado' };
      }

      // Atualizar veículo
      const vehicle = this.getVehicle(refuel.vehicleId);
      if (vehicle) {
        vehicle.totalRefueled = Math.max(0, vehicle.totalRefueled - refuel.liters);
        this.updateVehicle(refuel.vehicleId, vehicle);
      }

      const filtered = refuels.filter(r => r.id !== refuelId);
      localStorage.setItem(this.KEYS.REFUELS, JSON.stringify(filtered));
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar abastecimento:', error);
      return { success: false, error: error.message };
    }
  },

  // Exportar dados como JSON
  exportData() {
    return {
      vehicles: this.getVehicles(),
      refuels: this.getRefuels(),
      exportedAt: new Date().toISOString()
    };
  },

  // ===== DEPÓSITOS DE COMBUSTÍVEL =====
  saveDepot(depot) {
    try {
      const depots = this.getDepots();
      const index = depots.findIndex(d => d.userId === depot.userId);
      
      if (index === -1) {
        depots.push(depot);
      } else {
        depots[index] = depot;
      }
      
      localStorage.setItem(this.KEYS.DEPOTS, JSON.stringify(depots));
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar depósito:', error);
      return { success: false, error: error.message };
    }
  },

  getDepots() {
    try {
      const data = localStorage.getItem(this.KEYS.DEPOTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao obter depósitos:', error);
      return [];
    }
  },

  getDepot(userId) {
    const depots = this.getDepots();
    return depots.find(d => d.userId === userId);
  },

  addDepotRecord(record) {
    try {
      const records = this.getDepotRecords();
      const newRecord = {
        id: this.generateId(),
        ...record
      };
      records.push(newRecord);
      localStorage.setItem(this.KEYS.DEPOT_RECORDS, JSON.stringify(records));
      return { success: true, recordId: newRecord.id };
    } catch (error) {
      console.error('Erro ao adicionar registro de depósito:', error);
      return { success: false, error: error.message };
    }
  },

  getDepotRecords(userId = null, limit = 100) {
    try {
      const data = localStorage.getItem(this.KEYS.DEPOT_RECORDS);
      let records = data ? JSON.parse(data) : [];
      
      if (userId) {
        records = records.filter(r => r.userId === userId);
      }
      
      return records.slice(-limit).reverse();
    } catch (error) {
      console.error('Erro ao obter registros de depósito:', error);
      return [];
    }
  },

  getDepotHistory(userId, limit = 30) {
    return this.getDepotRecords(userId, limit);
  },

  // Limpar todos os dados
  clearAll() {
    localStorage.removeItem(this.KEYS.VEHICLES);
    localStorage.removeItem(this.KEYS.REFUELS);
    localStorage.removeItem(this.KEYS.APP_DATA);
    console.log('Todos os dados removidos');
  }
};

// Inicializar ao carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => StorageModule.init());
} else {
  StorageModule.init();
}

// Exportar para uso global
window.StorageModule = StorageModule;
