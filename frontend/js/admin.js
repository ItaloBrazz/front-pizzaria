document.addEventListener('DOMContentLoaded', async () => {
    const pizzaForm = document.getElementById('pizzaForm');
    const pizzasList = document.getElementById('pizzasList');
    const API_URL = 'http://localhost:3001/api/pizzas';

    try {
        const user = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');
        
        if (!user || !token || user.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }

        // Carregar pizzas existentes
        await carregarPizzas();

        // Cadastrar nova pizza
        pizzaForm.addEventListener('submit', handleSubmitPizza);

    } catch (error) {
        console.error('Erro na inicialização:', error);
        showError('Erro ao carregar o painel administrativo');
    }

    async function carregarPizzas() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no servidor');
            }
            
            const pizzas = await response.json();
            renderPizzas(pizzas);
            
        } catch (error) {
            console.error('Erro ao carregar pizzas:', error);
            showError(error.message || 'Erro ao carregar pizzas');
            throw error;
        }
    }

    function renderPizzas(pizzas) {
        if (!pizzas || pizzas.length === 0) {
            pizzasList.innerHTML = '<p class="no-pizzas">Nenhuma pizza cadastrada</p>';
            return;
        }

        pizzasList.innerHTML = pizzas.map(pizza => `
            <div class="pizza-item" data-id="${pizza.id}">
                <div class="pizza-info">
                    <h3>${pizza.nome}</h3>
                    <p><strong>Ingredientes:</strong> ${pizza.ingredientes}</p>
                    <p><strong>Preço:</strong> R$ ${pizza.preco.toFixed(2)}</p>
                    ${pizza.imagem ? `<img src="${pizza.imagem}" alt="${pizza.nome}" class="pizza-img">` : ''}
                </div>
                <div class="pizza-actions">
                    <button class="btn btn-edit" data-id="${pizza.id}">Editar</button>
                    <button class="btn btn-delete" data-id="${pizza.id}">Excluir</button>
                </div>
            </div>
        `).join('');

        // Adiciona eventos aos botões
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => editarPizza(e.target.dataset.id));
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => excluirPizza(e.target.dataset.id));
        });
    }

    async function handleSubmitPizza(e) {
        e.preventDefault();
        
        const pizza = {
            nome: document.getElementById('pizzaNome').value.trim(),
            ingredientes: document.getElementById('pizzaIngredientes').value.trim(),
            preco: parseFloat(document.getElementById('pizzaPreco').value),
            tamanho: document.getElementById('pizzaTamanho').value.trim(),
            imagem: document.getElementById('pizzaImagem').value.trim() || null
        };

        // Validação básica
        if (!pizza.nome || !pizza.ingredientes || isNaN(pizza.preco) || !pizza.tamanho) {
            showError('Preencha todos os campos obrigatórios corretamente');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(pizza)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar pizza');
            }

            const novaPizza = await response.json();
            showSuccess('Pizza cadastrada com sucesso!');
            pizzaForm.reset();
            await carregarPizzas(); // Recarrega a lista
            
        } catch (error) {
            console.error('Erro ao cadastrar pizza:', error);
            showError(error.message || 'Erro ao cadastrar pizza');
        }
    }

    async function editarPizza(id) {
        try {
            // Implemente a lógica de edição aqui
            alert(`Edição da pizza ${id} será implementada`);
            // Você pode abrir um modal ou outra página para edição
        } catch (error) {
            console.error('Erro ao editar pizza:', error);
            showError('Erro ao editar pizza');
        }
    }

    async function excluirPizza(id) {
        if (!confirm('Tem certeza que deseja excluir esta pizza?')) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir pizza');
            }

            showSuccess('Pizza excluída com sucesso!');
            await carregarPizzas();
            
        } catch (error) {
            console.error('Erro ao excluir pizza:', error);
            showError(error.message || 'Erro ao excluir pizza');
        }
    }

    function showError(message) {
        alert(`Erro: ${message}`);
    }

    function showSuccess(message) {
        alert(`Sucesso: ${message}`);
    }
});