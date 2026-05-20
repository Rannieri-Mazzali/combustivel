// Refuel Management Module - Otimizado
const RefuelModule = {
  // Registrar novo abastecimento (otimizado com batch)
  async recordRefuel(vehicleId, userId, data) {
    try {
      const refuelData = {
        vehicleId: vehicleId,
        userId: userId,
        km: parseFloat(data.km),
        liters: parseFloat(data.liters),
        date: new Date(data.date),
        time: data.time,
        cost: parseFloat(data.cost) || 0,
        fuelType: data.fuelType || 'Diesel',
        location: data.location || '',
        notes: data.notes || '',
        createdAt: new Date(),
        emailSent: false
      };

      // Usar batch para operações mais rápidas
      const batch = db.batch();
      
      // Adicionar novo registro de abastecimento
      const refuelRef = db.collection('refuel_records').doc();
      batch.set(refuelRef, refuelData);
      
      // Atualizar referência no usuário
      const userRef = db.collection('users').doc(userId);
      batch.update(userRef, {
        refuel_records: firebase.firestore.FieldValue.arrayUnion(refuelRef.id)
      });
      
      // Atualizar veículo com último abastecimento
      const vehicleRef = db.collection('vehicles').doc(vehicleId);
      batch.update(vehicleRef, {
        lastRefuel: new Date(),
        totalRefueled: firebase.firestore.FieldValue.increment(parseFloat(data.liters))
      });
      
      // Executar batch
      await batch.commit();

      return { success: true, recordId: refuelRef.id };
    } catch (error) {
      console.error('Erro ao registrar abastecimento:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter histórico de abastecimentos de um veículo
  async getVehicleRefuelHistory(vehicleId, limit = 50) {
    try {
      const snapshot = await db.collection('refuel_records')
        .where('vehicleId', '==', vehicleId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const records = [];
      snapshot.forEach(doc => {
        records.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate()
        });
      });

      return { success: true, records: records };
    } catch (error) {
      console.error('Erro ao obter histórico:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter histórico de abastecimentos do usuário
  async getUserRefuelHistory(userId, limit = 100) {
    try {
      const snapshot = await db.collection('refuel_records')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const records = [];
      snapshot.forEach(doc => {
        records.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate()
        });
      });

      return { success: true, records: records };
    } catch (error) {
      console.error('Erro ao obter histórico do usuário:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter estatísticas de abastecimento
  async getRefuelStats(vehicleId) {
    try {
      const snapshot = await db.collection('refuel_records')
        .where('vehicleId', '==', vehicleId)
        .get();

      let totalLiters = 0;
      let totalCost = 0;
      let totalRecords = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        totalLiters += data.liters;
        totalCost += data.cost;
        totalRecords++;
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
    try {
      await db.collection('refuel_records').doc(recordId).delete();
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar registro:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Editar registro de abastecimento
  async updateRefuelRecord(recordId, data) {
    try {
      await db.collection('refuel_records').doc(recordId).update(data);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar registro:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Exportar para uso global
window.RefuelModule = RefuelModule;
