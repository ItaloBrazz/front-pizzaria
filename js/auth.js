const API_URL = 'https://back-pizzaria.onrender.com/api';
const PUBLIC_PAGES = ['login.html', 'register.html'];

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!token && !PUBLIC_PAGES.includes(currentPage)) {
    window.location.href = 'login.html';
    return;
  }

  carregarHeader();

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

      if (data.usuario.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
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

// Carregar header com base na role do usuário
function carregarHeader() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const role = usuario?.role || 'user';

  const headerHTML = `
    <header>
      <div class="container">
        <div class="logo-wrapper">
          <i class="fas fa-pizza-slice logo-icon"></i>
          <h1>Pizzaria Delícia</h1>
        </div>
        <nav>
          <ul>
            <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li>
            <li><a href="pizzas.html"><i class="fas fa-utensils"></i> Cardápio</a></li>
            <li><a href="pedidos.html" class="active"><i class="fas fa-receipt"></i> ${role === 'admin' ? 'Todos os Pedidos' : 'Meus Pedidos'}</a></li>
            ${role === 'admin' ? '<li><a href="admin.html"><i class="fas fa-tools"></i> Painel Admin</a></li>' : ''}
            <li><a href="#" id="logout"><i class="fas fa-sign-out-alt"></i> Sair</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  const headerDiv = document.getElementById('header');
  if (headerDiv) {
    headerDiv.innerHTML = headerHTML;
    document.getElementById('logout')?.addEventListener('click', logout);
  }
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

// Força da senha
function checkPasswordStrength(password) {
  const strengthContainer = document.querySelector('.password-strength');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.querySelector('.strength-text');

  // Reset
  strengthContainer.className = 'password-strength';

  let strength = 0;
  if (password.length > 0) strength += 1;
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

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

  strengthContainer.classList.add(`password-${strengthLevel}`);
  strengthText.textContent = text;

  strengthBars.forEach((bar, index) => {
    bar.style.opacity = index < strength ? '1' : '0.2';
  });
}
