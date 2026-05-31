// Email Module - Simplificado (sem dependência externa)
// Registra ações no console e localStorage para auditoria

const EmailModule = {
  // Simular envio de email (registra no log)
  async sendRefuelEmail(userData, vehicleData, refuelData) {
    try {
      const refuelRecord = {
        user: userData.fullName,
        vehicle: vehicleData.licensePlate,
        liters: refuelData.liters,
        cost: refuelData.cost,
        date: refuelData.date,
        timestamp: new Date().toISOString()
      };

      // Registrar no console para auditoria
      console.log('Abastecimento registrado:', refuelRecord);
      
      // Salvar no localStorage para histórico
      const history = JSON.parse(localStorage.getItem('emailHistory') || '[]');
      history.push(refuelRecord);
      localStorage.setItem('emailHistory', JSON.stringify(history));

      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar email:', error);
      return { success: false, error: error.message };
    }
  },

  // Enviar relatório diário
  async sendDailyReport(userData, records) {
    try {
      console.log('Relatório do dia:', {
        user: userData.fullName,
        records: records.length,
        totalLiters: records.reduce((sum, r) => sum + r.liters, 0)
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      return { success: false, error: error.message };
    }
  }
};

// Exportar para uso global
window.EmailModule = EmailModule;
