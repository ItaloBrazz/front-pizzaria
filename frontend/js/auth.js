const API_URL = 'http://localhost:3001/api';

const PUBLIC_PAGES = ['login.html', 'register.html'];

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!token && !PUBLIC_PAGES.includes(currentPage)) {
    window.location.href = 'login.html';
    return;
  }

  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// Login
async function login(email, senha) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.location.href = 'index.html';
    } else {
      throw new Error(data.error || 'Login falhou');
    }
  } catch (error) {
    alert(error.message);
  }
}

// Registrar novo usuário
async function register(nome, email, senha) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      if (data.usuario.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      throw new Error(data.error || 'Erro no registro');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert(error.message);
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

// Formulário de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    login(email, senha);
  });
}

// Formulário de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    register(nome, email, senha);
  });
}

  function checkPasswordStrength(password) {
    const strengthContainer = document.querySelector('.password-strength');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Reset classes
    strengthContainer.className = 'password-strength';
    
    // Calcular força
    let strength = 0;
    
    // Verificar comprimento
    if (password.length > 0) strength += 1;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Verificar caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    // Verificar números
    if (/\d/.test(password)) strength += 1;
    
    // Verificar maiúsculas e minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    // Determinar nível de força (0-5)
    let strengthLevel = 'weak';
    let text = 'Fraca';
    
    if (strength >= 4) {
      strengthLevel = 'strong';
      text = 'Forte';
    } else if (strength >= 2) {
      strengthLevel = 'medium';
      text = 'Média';
    }
    
    if (strength >= 5) {
      strengthLevel = 'very-strong';
      text = 'Muito forte';
    }
    
    // Aplicar classes
    strengthContainer.classList.add(`password-${strengthLevel}`);
    strengthText.textContent = text;
    
    // Ativar as barras correspondentes
    strengthBars.forEach((bar, index) => {
      if (index < strength) {
        bar.style.opacity = '1';
      } else {
        bar.style.opacity = '0.2';
      }
    });
  }