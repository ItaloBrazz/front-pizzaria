document.addEventListener('DOMContentLoaded', () => {
    const destaquesContainer = document.getElementById('destaques');
    const API_URL = 'https://back-pizzaria.onrender.com/api/pizzas'; // URL da sua API

    // Função para criar um card de pizza
    function criarCardPizza(pizza) {
        return `
            <div class="pizza-card">
                <img src="${pizza.imagem || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'}" 
                     alt="${pizza.nome}" 
                     class="pizza-img">
                <div class="pizza-info">
                    <h3>${pizza.nome}</h3>
                    <p>${formatarIngredientes(pizza.ingredientes)}</p>
                    <div class="pizza-footer">
                        <span class="pizza-price">R$ ${pizza.preco.toFixed(2)}</span>
                        <a href="pizzas.html?id=${pizza.id}" class="btn btn-ver">Ver Mais</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Formatar ingredientes para exibição
    function formatarIngredientes(ingredientes) {
        return ingredientes.split(',').slice(0, 3).join(', ') + '...';
    }

    // Carregar pizzas em destaque
    async function carregarPizzasDestaque() {
        try {
            // Mostrar estado de carregamento
            destaquesContainer.innerHTML = '<div class="loader">Carregando as melhores pizzas...</div>';

            // Fazer requisição à API
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error('Não foi possível carregar o cardápio');
            }

            const pizzas = await response.json();

            // Limpar container
            destaquesContainer.innerHTML = '';

            // Selecionar 4 pizzas aleatórias para destaque
            const pizzasDestaque = selecionarDestaques(pizzas, 4);

            if (pizzasDestaque.length === 0) {
                destaquesContainer.innerHTML = '<p class="sem-pizzas">Nenhuma pizza disponível no momento</p>';
                return;
            }

            // Adicionar pizzas ao container
            pizzasDestaque.forEach(pizza => {
                destaquesContainer.innerHTML += criarCardPizza(pizza);
            });

        } catch (error) {
            console.error('Erro:', error);
            mostraErroCarregamento();
        }
    }

    // Selecionar pizzas aleatórias para destaque
    function selecionarDestaques(pizzas, quantidade) {
        // Embaralha o array e pega os primeiros itens
        return [...pizzas].sort(() => 0.5 - Math.random()).slice(0, quantidade);
    }

    // Mostrar mensagem de erro
    function mostraErroCarregamento() {
        destaquesContainer.innerHTML = `
            <div class="error-message">
                <p>Ocorreu um erro ao carregar nosso cardápio.</p>
                <button class="btn btn-tentar-novamente">Tentar Novamente</button>
            </div>
        `;

        document.querySelector('.btn-tentar-novamente')?.addEventListener('click', carregarPizzasDestaque);
    }


    carregarPizzasDestaque();
});