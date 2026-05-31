// App Config - Sem Firebase, apenas localStorage
// Versão Simplificada e Funcional

const AppConfig = {
  // Inicializar app
  init() {
    console.log('App inicializado com sucesso');
    // Dados armazenados em localStorage
  },

  // Verificar autenticação
  isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
  },

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearCurrentUser() {
    localStorage.removeItem('currentUser');
  }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  AppConfig.init();
});

window.AppConfig = AppConfig;
