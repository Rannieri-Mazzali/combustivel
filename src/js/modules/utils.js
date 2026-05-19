// Utility Functions Module
const UtilsModule = {
  // Formatar data para formato brasileiro
  formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  // Formatar data e hora
  formatDateTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  },

  // Formatar moeda para Real
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  // Formatar número com 2 casas decimais
  formatNumber(value, decimals = 2) {
    return parseFloat(value).toFixed(decimals);
  },

  // Validar email
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validar força de senha
  validatePassword(password) {
    return password.length >= 6;
  },

  // Mostrar notificação (toast)
  showNotification(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  // Mostrar loading
  showLoading(show = true) {
    let loader = document.getElementById('global-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'global-loader';
      loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
      loader.innerHTML = `
        <div class="bg-white rounded-lg p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p class="mt-4 text-gray-700 font-semibold">Carregando...</p>
        </div>
      `;
      document.body.appendChild(loader);
    }

    if (show) {
      loader.classList.remove('hidden');
    } else {
      loader.classList.add('hidden');
    }
  },

  // Validar formulário
  validateForm(formData, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];

      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = `${field} é obrigatório`;
      }

      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field} deve ter no mínimo ${rule.minLength} caracteres`;
      }

      if (rule.type === 'email' && value && !this.validateEmail(value)) {
        errors[field] = 'Email inválido';
      }

      if (rule.type === 'number' && value && isNaN(value)) {
        errors[field] = `${field} deve ser um número`;
      }

      if (rule.min && parseFloat(value) < rule.min) {
        errors[field] = `${field} deve ser maior que ${rule.min}`;
      }
    }

    return { valid: Object.keys(errors).length === 0, errors };
  },

  // Obter parâmetro da URL
  getUrlParam(param) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  },

  // Exportar dados para CSV
  exportToCSV(data, filename) {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.csv';
    a.click();
  },

  // Formatar placa de veículo
  formatLicensePlate(plate) {
    return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
};
