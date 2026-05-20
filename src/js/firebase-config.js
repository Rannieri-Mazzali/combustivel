// Firebase Configuration - Modular SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDo_Demo_Key_For_Testing",
  authDomain: "fleetfuel-demo.firebaseapp.com",
  projectId: "fleetfuel-demo",
  storageBucket: "fleetfuel-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Habilitar cache offline
enableIndexedDbPersistence(db).catch((err) => {
  // Silenciosamente ignorar erros
});

let demoUserEmail = "demo@fleetfuel.local";
let demoUserPassword = "demo123456";
let firebaseReady = false;

// Auto-login com usuário demo
const initializeDemo = async () => {
  try {
    await signInWithEmailAndPassword(auth, demoUserEmail, demoUserPassword);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, demoUserEmail, demoUserPassword);
        const user = userCredential.user;
        // Usuário criado com sucesso
      } catch (createError) {
        // Erro ao criar usuário
      }
    }
  } finally {
    firebaseReady = true;
  }
};

initializeDemo();

// Exportar para uso global
window.db = db;
window.auth = auth;
window.onAuthStateChanged = onAuthStateChanged;
window.signOut = signOut;
window.firebaseReady = firebaseReady;

