// Email Module - Integração com API Gratuita
// Usando EmailJS (gratuito, sem autenticação necessária na primeira configuração)

const EmailModule = {
  // Inicializar EmailJS
  init() {
    // Você precisa se registrar em https://www.emailjs.com/
    // ID de serviço: seu_service_id
    // ID de template: seu_template_id
    emailjs.init("seu_public_key_aqui"); // Obtido no dashboard do EmailJS
  },

  // Enviar email com dados de abastecimento
  async sendRefuelEmail(userData, vehicleData, refuelData) {
    try {
      const templateParams = {
        to_email: "rannieri.mazzali@outlook.com", // Email fixo como solicitado
        user_name: userData.fullName,
        user_email: userData.email,
        company: userData.company,
        vehicle_plate: vehicleData.licensePlate,
        vehicle_model: vehicleData.model,
        km: refuelData.km,
        liters: refuelData.liters,
        date: new Date(refuelData.date).toLocaleDateString('pt-BR'),
        time: refuelData.time,
        cost: refuelData.cost,
        fuel_type: refuelData.fuelType,
        location: refuelData.location,
        notes: refuelData.notes
      };

      const response = await emailjs.send(
        "seu_service_id", // Configurar no EmailJS
        "seu_template_id", // Configurar no EmailJS
        templateParams
      );

      console.log('Email enviado com sucesso:', response);
      return { success: true, messageId: response.status };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }
  },

  // Enviar relatório diário
  async sendDailyReport(userData, records) {
    try {
      const templateParams = {
        to_email: "rannieri.mazzali@outlook.com",
        user_name: userData.fullName,
        report_date: new Date().toLocaleDateString('pt-BR'),
        total_records: records.length,
        total_liters: records.reduce((sum, r) => sum + r.liters, 0),
        total_cost: records.reduce((sum, r) => sum + r.cost, 0),
        records_json: JSON.stringify(records, null, 2)
      };

      const response = await emailjs.send(
        "seu_service_id",
        "seu_template_relatorio_id",
        templateParams
      );

      console.log('Relatório enviado:', response);
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      return { success: false, error: error.message };
    }
  }
};

// Inicializar quando o documento carregar
document.addEventListener('DOMContentLoaded', () => {
  EmailModule.init();
});
