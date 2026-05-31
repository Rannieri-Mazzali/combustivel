// Authentication Module - Sem Firebase (não necessário, app sem login)
const AuthModule = {
  // Retornar usuário default (sem autenticação)
  async getCurrentUser() {
    return { uid: 'default', name: 'Usuário' };
  },

  // Callback simulado (sempre 'logado')
  onAuthStateChanged(callback) {
    callback({ uid: 'default', name: 'Usuário' });
  },

  // Logout simulado
  async logout() {
    return { success: true };
  }
};

// Exportar para uso global
window.AuthModule = AuthModule;
