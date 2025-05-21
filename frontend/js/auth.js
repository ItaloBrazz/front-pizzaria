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