// Login Page Script
let currentUser = null;

// Inicializar autenticação
AuthModule.onAuthStateChanged(user => {
  if (user) {
    window.location.href = 'dashboard.html';
  }
});

// Mostrar formulário de login
function showLoginForm() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('forgot-password-form').classList.add('hidden');
}

// Mostrar formulário de registro
function showRegisterForm() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
  document.getElementById('forgot-password-form').classList.add('hidden');
}

// Mostrar formulário de recuperação de senha
function showForgotPasswordForm() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('forgot-password-form').classList.remove('hidden');
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  UtilsModule.showLoading(true);

  const result = await AuthModule.login(email, password);

  if (result.success) {
    UtilsModule.showNotification('Login realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } else {
    UtilsModule.showNotification('Erro: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById('register-fullname').value;
  const company = document.getElementById('register-company').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-password-confirm').value;

  // Validações
  if (!UtilsModule.validateEmail(email)) {
    UtilsModule.showNotification('Email inválido', 'error');
    return;
  }

  if (!UtilsModule.validatePassword(password)) {
    UtilsModule.showNotification('Senha deve ter no mínimo 6 caracteres', 'error');
    return;
  }

  if (password !== passwordConfirm) {
    UtilsModule.showNotification('As senhas não coincidem', 'error');
    return;
  }

  UtilsModule.showLoading(true);

  const result = await AuthModule.register(email, password, fullName, company);

  if (result.success) {
    UtilsModule.showNotification('Conta criada com sucesso! Faça login para continuar.', 'success');
    setTimeout(() => {
      showLoginForm();
      document.getElementById('register-fullname').value = '';
      document.getElementById('register-company').value = '';
      document.getElementById('register-email').value = '';
      document.getElementById('register-password').value = '';
      document.getElementById('register-password-confirm').value = '';
    }, 1000);
  } else {
    UtilsModule.showNotification('Erro: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Handle Reset Password
async function handleResetPassword(event) {
  event.preventDefault();

  const email = document.getElementById('reset-email').value;

  UtilsModule.showLoading(true);

  const result = await AuthModule.resetPassword(email);

  if (result.success) {
    UtilsModule.showNotification('Email de recuperação enviado com sucesso!', 'success');
    setTimeout(() => {
      showLoginForm();
      document.getElementById('reset-email').value = '';
    }, 1000);
  } else {
    UtilsModule.showNotification('Erro: ' + result.error, 'error');
  }

  UtilsModule.showLoading(false);
}

// Função auxiliar de navegação
function navigateTo(page) {
  window.location.href = page;
}

// Set today's date on password reset form
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
});
