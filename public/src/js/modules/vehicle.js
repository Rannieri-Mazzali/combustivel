// Vehicle Management Module
const VehicleModule = {
  // Cadastrar novo veículo (otimizado com batch)
  async addVehicle(licensePlate, model, year, capacity, userId) {
    try {
      // Validações rigorosas
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

      const vehicleData = {
        licensePlate: licensePlate.trim().toUpperCase(),
        model: model.trim(),
        year: parseInt(year),
        capacity: parseFloat(capacity),
        userId: userId,
        createdAt: new Date(),
        totalRefueled: 0,
        lastRefuel: null,
        active: true
      };

      // Usar batch para operações mais rápidas
      const batch = db.batch();
      
      // Adicionar novo veículo
      const vehicleRef = db.collection('vehicles').doc();
      batch.set(vehicleRef, vehicleData);
      
      // Garantir que o documento do usuário existe e atualizar veículos
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        // Usuário existe, adicionar veículo ao array
        batch.update(userRef, {
          vehicles: firebase.firestore.FieldValue.arrayUnion(vehicleRef.id),
          lastVehicleAdded: new Date()
        });
      } else {
        // Criar documento do usuário se não existir
        batch.set(userRef, {
          userId: userId,
          vehicles: [vehicleRef.id],
          lastVehicleAdded: new Date(),
          createdAt: new Date()
        }, { merge: true });
      }
      
      // Executar batch
      await batch.commit();

      // Retornar o veículo criado com ID
      return { 
        success: true, 
        vehicleId: vehicleRef.id,
        vehicle: {
          id: vehicleRef.id,
          ...vehicleData
        }
      };
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error.message);
      return { success: false, error: error.message || 'Erro desconhecido ao adicionar veículo' };
    }
  },

  // Obter todos os veículos do usuário
  async getUserVehicles(userId) {
    try {
      const snapshot = await db.collection('vehicles')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      const vehicles = [];
      snapshot.forEach(doc => {
        vehicles.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, vehicles: vehicles };
    } catch (error) {
      console.error('Erro ao obter veículos:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter detalhes de um veículo específico
  async getVehicleDetails(vehicleId) {
    try {
      const doc = await db.collection('vehicles').doc(vehicleId).get();

      if (!doc.exists) {
        return { success: false, error: 'Veículo não encontrado' };
      }

      return { success: true, vehicle: { id: doc.id, ...doc.data() } };
    } catch (error) {
      console.error('Erro ao obter detalhes do veículo:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Atualizar dados do veículo
  async updateVehicle(vehicleId, data) {
    try {
      await db.collection('vehicles').doc(vehicleId).update(data);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Desativar veículo
  async deactivateVehicle(vehicleId) {
    try {
      await db.collection('vehicles').doc(vehicleId).update({
        active: false,
        deactivatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao desativar veículo:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Exportar para uso global
window.VehicleModule = VehicleModule;
