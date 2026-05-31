// Refuel Management Module - Sem Firebase
const RefuelModule = {
  // Registrar novo abastecimento
  async recordRefuel(vehicleId, userId, data) {
    return StorageModule.addRefuel(vehicleId, data);
  },

  // Obter histórico de abastecimentos de um veículo
  async getVehicleRefuelHistory(vehicleId, limit = 50) {
    try {
      const records = StorageModule.getVehicleRefuelHistory(vehicleId, limit);
      return { success: true, records: records };
    } catch (error) {
      console.error('Erro ao obter histórico:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter histórico de abastecimentos do usuário
  async getUserRefuelHistory(userId, limit = 100) {
    try {
      const records = StorageModule.getAllRefuelHistory(limit);
      return { success: true, records: records };
    } catch (error) {
      console.error('Erro ao obter histórico do usuário:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter estatísticas de abastecimento
  async getRefuelStats(vehicleId) {
    try {
      const records = StorageModule.getVehicleRefuelHistory(vehicleId, 1000);
      let totalLiters = 0;
      let totalCost = 0;
      const totalRecords = records.length;

      records.forEach(record => {
        totalLiters += record.liters;
        totalCost += record.cost;
      });

      const averagePerRefuel = totalRecords > 0 ? totalLiters / totalRecords : 0;

      return {
        success: true,
        stats: {
          totalLiters: totalLiters,
          totalCost: totalCost,
          totalRecords: totalRecords,
          averagePerRefuel: averagePerRefuel
        }
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Deletar registro de abastecimento
  async deleteRefuelRecord(recordId) {
    return StorageModule.deleteRefuel(recordId);
  }
};

// Exportar para uso global
window.RefuelModule = RefuelModule;
