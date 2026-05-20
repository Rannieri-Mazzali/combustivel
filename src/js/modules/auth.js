// Authentication Module
const AuthModule = {
  // Registrar novo usuário
  async register(email, password, fullName, company) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Salvar dados adicionais do usuário no Firestore
      await db.collection('users').doc(user.uid).set({
        fullName: fullName,
        email: email,
        company: company,
        createdAt: new Date(),
        vehicles: [],
        refuel_records: []
      });

      return { success: true, user: user };
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Login de usuário
  async login(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Verificar se usuário está autenticado
  getCurrentUser() {
    return auth.currentUser;
  },

  // Escutar mudanças de autenticação
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },

  // Enviar email de recuperação de senha
  async resetPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true, message: 'Email de recuperação enviado' };
    } catch (error) {
      console.error('Erro ao enviar email:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Exportar para uso global
window.AuthModule = AuthModule;
