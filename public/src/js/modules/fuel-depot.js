// Fuel Depot Management Module - Depósito de Combustível
const FuelDepotModule = {
  // Adicionar combustível ao depósito
  async addFuelToDepot(userId, fuelType, liters, notes = '') {
    try {
      const depotData = {
        userId: userId,
        fuelType: fuelType || 'Diesel',
        liters: parseFloat(liters),
        notes: notes,
        addedAt: new Date(),
        addedBy: userId,
        status: 'active'
      };

      // Usar batch para operações mais rápidas
      const batch = db.batch();
      
      // Adicionar novo registro de combustível
      const depotRef = db.collection('fuel_depot_records').doc();
      batch.set(depotRef, depotData);
      
      // Atualizar totais no depósito
      const userDepotRef = db.collection('fuel_depot').doc(userId);
      const userDepotDoc = await db.collection('fuel_depot').doc(userId).get();
      
      if (userDepotDoc.exists) {
        const currentData = userDepotDoc.data();
        batch.update(userDepotRef, {
          totalLiters: firebase.firestore.FieldValue.increment(parseFloat(liters)),
          lastUpdate: new Date(),
          lastAddedBy: userId
        });
      } else {
        batch.set(userDepotRef, {
          userId: userId,
          totalLiters: parseFloat(liters),
          capacity: 5000, // Capacidade padrão de 5000 litros
          lastUpdate: new Date(),
          createdAt: new Date(),
          lastAddedBy: userId
        });
      }
      
      // Executar batch
      await batch.commit();

      return { success: true, recordId: depotRef.id };
    } catch (error) {
      console.error('Erro ao adicionar combustível:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter dados do depósito do usuário
  async getUserDepotData(userId) {
    try {
      const doc = await db.collection('fuel_depot').doc(userId).get();

      if (!doc.exists) {
        // Criar novo depósito se não existe
        await db.collection('fuel_depot').doc(userId).set({
          userId: userId,
          totalLiters: 0,
          capacity: 5000,
          lastUpdate: new Date(),
          createdAt: new Date()
        });
        
        return {
          success: true,
          depot: {
            userId: userId,
            totalLiters: 0,
            capacity: 5000,
            lastUpdate: new Date(),
            createdAt: new Date()
          }
        };
      }

      return {
        success: true,
        depot: {
          id: doc.id,
          ...doc.data()
        }
      };
    } catch (error) {
      console.error('Erro ao obter dados do depósito:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Atualizar capacidade do depósito
  async updateDepotCapacity(userId, capacity) {
    try {
      await db.collection('fuel_depot').doc(userId).update({
        capacity: parseFloat(capacity),
        lastUpdate: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar capacidade:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Obter histórico de adições ao depósito
  async getDepotHistory(userId, limit = 50) {
    try {
      const snapshot = await db.collection('fuel_depot_records')
        .where('userId', '==', userId)
        .orderBy('addedAt', 'desc')
        .limit(limit)
        .get();

      const records = [];
      snapshot.forEach(doc => {
        records.push({
          id: doc.id,
          ...doc.data(),
          addedAt: doc.data().addedAt.toDate()
        });
      });

      return { success: true, records: records };
    } catch (error) {
      console.error('Erro ao obter histórico do depósito:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Calcular gasto de combustível (retirada)
  async useFuelFromDepot(userId, liters, reason = '') {
    try {
      const depotData = {
        userId: userId,
        type: 'withdrawal',
        liters: parseFloat(liters),
        reason: reason,
        withdrawnAt: new Date(),
        status: 'active'
      };

      const batch = db.batch();
      
      // Adicionar registro de retirada
      const recordRef = db.collection('fuel_depot_records').doc();
      batch.set(recordRef, depotData);
      
      // Atualizar totais
      const userDepotRef = db.collection('fuel_depot').doc(userId);
      batch.update(userDepotRef, {
        totalLiters: firebase.firestore.FieldValue.increment(-parseFloat(liters)),
        lastUpdate: new Date()
      });
      
      await batch.commit();

      return { success: true, recordId: recordRef.id };
    } catch (error) {
      console.error('Erro ao retirar combustível:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Exportar para uso global
window.FuelDepotModule = FuelDepotModule;
