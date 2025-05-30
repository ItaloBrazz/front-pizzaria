document.addEventListener('DOMContentLoaded', () => {
  const pizzasContainer = document.getElementById('pizzas-container');
  const pedidoModal = document.getElementById('pedidoModal');
  const closeModal = document.querySelector('.close-modal');
  const pedidoForm = document.getElementById('pedidoForm');
  const totalPedido = document.getElementById('totalPedido');
  const quantidadeInput = document.getElementById('quantidade');
  
  let pizzaSelecionada = null;
  let precoPizza = 0;

  // Carregar pizzas
  async function carregarPizzas() {
    try {
      const response = await fetch('https://back-pizzaria.onrender.com/api/pizzas');
      const pizzas = await response.json();
      
      pizzasContainer.innerHTML = '';
      
      pizzas.forEach(pizza => {
        const pizzaCard = document.createElement('div');
        pizzaCard.className = 'pizza-card';
        pizzaCard.innerHTML = `
          <img src="${pizza.imagem || 'https://via.placeholder.com/300x200?text=Pizza'}" alt="${pizza.nome}" class="pizza-img">
          <div class="pizza-info">
            <h3>${pizza.nome}</h3>
            <p>${pizza.ingredientes}</p>
            <br>
            <h1>${pizza.tamanho}</h1>
            <p class="pizza-price">R$ ${pizza.preco.toFixed(2)}</p>
            <button class="btn btn-pedir" data-id="${pizza.id}" data-preco="${pizza.preco}">Fazer Pedido</button>
          </div>
        `;
        pizzasContainer.appendChild(pizzaCard);
      });

      // Adicionar eventos aos botões
      document.querySelectorAll('.btn-pedir').forEach(btn => {
        btn.addEventListener('click', (e) => {
          pizzaSelecionada = e.target.dataset.id;
          precoPizza = parseFloat(e.target.dataset.preco);
          document.getElementById('pizzaId').value = pizzaSelecionada;
          atualizarTotal();
          pedidoModal.style.display = 'block';
        });
      });

    } catch (error) {
      console.error('Erro ao carregar pizzas:', error);
      pizzasContainer.innerHTML = '<p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
    }
  }

  // Atualizar total do pedido
  function atualizarTotal() {
    const quantidade = parseInt(quantidadeInput.value) || 1;
    totalPedido.textContent = (quantidade * precoPizza).toFixed(2);
  }

  // Fazer pedido
  pedidoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pedido = {
      pizzaId: pizzaSelecionada,
      quantidade: parseInt(quantidadeInput.value),
      enderecoEntrega: document.getElementById('endereco').value
    };

    try {
      const response = await fetch('https://back-pizzaria.onrender.com/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        alert('Pedido realizado com sucesso!');
        pedidoModal.style.display = 'none';
        pedidoForm.reset();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer pedido');
      }
    } catch (error) {
      alert(error.message);
    }
  });

  // Event listeners
  closeModal.addEventListener('click', () => {
    pedidoModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === pedidoModal) {
      pedidoModal.style.display = 'none';
    }
  });

  quantidadeInput.addEventListener('change', atualizarTotal);
  quantidadeInput.addEventListener('input', atualizarTotal);

  // Inicializar
  carregarPizzas();
});
