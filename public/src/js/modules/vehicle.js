// Vehicle Management Module - Sem Firebase
const VehicleModule = {
  // Cadastrar novo veículo
  async addVehicle(licensePlate, model, year, capacity, userId) {
    return StorageModule.addVehicle(licensePlate, model, year, capacity);
  },

  // Obter todos os veículos
  async getUserVehicles(userId) {
    try {
      const vehicles = StorageModule.getVehicles();
      return { success: true, vehicles: vehicles };
    } catch (error) {
      console.error('Erro ao obter veículos:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter um veículo específico
  async getVehicle(vehicleId) {
    try {
      const vehicle = StorageModule.getVehicle(vehicleId);
      if (!vehicle) {
        return { success: false, error: 'Veículo não encontrado' };
      }
      return { success: true, vehicle: vehicle };
    } catch (error) {
      console.error('Erro ao obter veículo:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Atualizar veículo
  async updateVehicle(vehicleId, updates) {
    return StorageModule.updateVehicle(vehicleId, updates);
  },

  // Deletar veículo
  async deleteVehicle(vehicleId) {
    return StorageModule.deleteVehicle(vehicleId);
  }
};

// Exportar para uso global
window.VehicleModule = VehicleModule;
