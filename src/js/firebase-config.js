// Firebase Configuration - Simplificado e Funcional
// IMPORTANTE: Substitua com suas credenciais reais do Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCJhVWJJKJ_H1z-KX_uV-YXz1234567890",
  authDomain: "fleetfuel-app.firebaseapp.com",
  projectId: "fleetfuel-app",
  storageBucket: "fleetfuel-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

let db, auth;
let firebaseReady = false;

// Inicializar Firebase quando os scripts carregarem
function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK não carregou');
      return;
    }

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Initialize Firestore e Auth
    db = firebase.firestore();
    auth = firebase.auth();

    // Ativar persistência offline
    db.enablePersistence().catch(() => {
      // Persistência já ativa ou não disponível
    });

    firebaseReady = true;
    console.log('Firebase inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error.message);
  }
}

// Inicializar quando documento estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

