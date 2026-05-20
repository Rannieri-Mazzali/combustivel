// Firebase Configuration - Otimizado para Performance
// Para produção, atualize com suas credenciais reais

const firebaseConfig = {
  apiKey: "AIzaSyDo_Demo_Key_For_Testing",
  authDomain: "fleetfuel-demo.firebaseapp.com",
  projectId: "fleetfuel-demo",
  storageBucket: "fleetfuel-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let db, auth;
let demoUserEmail = "demo@fleetfuel.local";
let demoUserPassword = "demo123456";
let firebaseReady = false;

// Esperar Firebase estar pronto
function waitForFirebase() {
  return new Promise((resolve) => {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
      resolve();
      return;
    }
    setTimeout(() => waitForFirebase().then(resolve), 100);
  });
}

try {
  // Aguardar Firebase carregar
  waitForFirebase().then(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Initialize Firestore com otimizações
    db = firebase.firestore();
    auth = firebase.auth();

    // Modo desenvolvimento - otimizado para velocidade
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      db.settings({ 
        experimentalForceLongPolling: false,
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });
    }

    // Habilitar cache offline para melhor performance
    db.enablePersistence().catch((err) => {
      // Silenciosamente ignorar erros de persistência
    });

    // Auto-login com usuário demo (não bloqueia carregamento da página)
    auth.signInWithEmailAndPassword(demoUserEmail, demoUserPassword)
      .catch(async (error) => {
        // Se não existe, cria o usuário demo
        if (error.code === 'auth/user-not-found') {
          try {
            const userCredential = await auth.createUserWithEmailAndPassword(demoUserEmail, demoUserPassword);
            const user = userCredential.user;

            // Criar documento do usuário no Firestore
            await db.collection('users').doc(user.uid).set({
              fullName: "Usuário Demo",
              email: demoUserEmail,
              company: "FleetFuel Demo",
              createdAt: new Date(),
              vehicles: [],
              refuel_records: []
            });
          } catch (createError) {
            // Erro ao criar usuário
          }
        }
      })
      .finally(() => {
        firebaseReady = true;
      });

  });

} catch (error) {
  console.error('Erro ao inicializar Firebase:', error.message);
}

