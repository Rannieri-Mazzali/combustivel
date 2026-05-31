// Fuel Depot Management Module - LocalStorage (sem Firebase)
const FuelDepotModule = {
  async getUserDepotData(userId) {
    try {
      const depots = StorageModule.getDepots();
      let depot = depots.find(d => d.userId === userId);

      if (!depot) {
        depot = {
          userId: userId,
          totalLiters: 0,
          capacity: 5000,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        StorageModule.saveDepot(depot);
      }

      return { success: true, depot };
    } catch (error) {
      console.error('Erro ao obter dados do depósito:', error);
      return { success: false, error: error.message };
    }
  },

  async getDepotHistory(userId, limit = 30) {
    try {
      const records = StorageModule.getDepotHistory(userId, limit);
      return { success: true, records };
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return { success: false, error: error.message };
    }
  },

  async addFuelToDepot(userId, fuelType, liters, notes = '') {
    try {
      const depots = StorageModule.getDepots();
      let depot = depots.find(d => d.userId === userId);

      if (!depot) {
        depot = {
          userId: userId,
          totalLiters: 0,
          capacity: 5000,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
      }

      const litersNum = parseFloat(liters);
      if (!Number.isFinite(litersNum) || litersNum <= 0) {
        return { success: false, error: 'Quantidade inválida' };
      }

      if (depot.totalLiters + litersNum > depot.capacity) {
        return { success: false, error: 'Quantidade ultrapassa a capacidade do depósito' };
      }

      depot.totalLiters = depot.totalLiters + litersNum;
      depot.lastUpdated = new Date().toISOString();

      StorageModule.saveDepot(depot);
      StorageModule.addDepotRecord({
        userId,
        type: 'add',
        fuelType: fuelType || 'Diesel',
        liters: litersNum,
        notes: notes || '',
        addedAt: new Date().toISOString()
      });

      return { success: true, depot };
    } catch (error) {
      console.error('Erro ao adicionar combustível:', error);
      return { success: false, error: error.message };
    }
  },

  async updateDepotCapacity(userId, newCapacity) {
    try {
      const depots = StorageModule.getDepots();
      let depot = depots.find(d => d.userId === userId);

      if (!depot) {
        depot = {
          userId: userId,
          totalLiters: 0,
          capacity: 5000,
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
      }

      const capNum = parseFloat(newCapacity);
      if (!Number.isFinite(capNum) || capNum <= 0) {
        return { success: false, error: 'Capacidade inválida' };
      }
      if (capNum < depot.totalLiters) {
        return { success: false, error: 'Nova capacidade é menor que o volume atual' };
      }

      depot.capacity = capNum;
      depot.lastUpdated = new Date().toISOString();

      StorageModule.saveDepot(depot);
      return { success: true, depot };
    } catch (error) {
      console.error('Erro ao atualizar capacidade:', error);
      return { success: false, error: error.message };
    }
  }
};

window.FuelDepotModule = FuelDepotModule;


