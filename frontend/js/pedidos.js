document.addEventListener('DOMContentLoaded', () => {
    const pedidosContainer = document.getElementById('pedidos-container');
    const API_URL = 'http://localhost:3001/api/pedidos/meus-pedidos';

    // Função para formatar data
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Função para carregar pedidos
    async function carregarPedidos() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar pedidos');
            }

            const pedidos = await response.json();

            if (pedidos.length === 0) {
                pedidosContainer.innerHTML = `
                    <div class="sem-pedidos">
                        <p>Você ainda não fez nenhum pedido.</p>
                        <a href="pizzas.html">Ver cardápio</a>
                    </div>
                `;
                return;
            }

            pedidosContainer.innerHTML = pedidos.map(pedido => `
                <div class="pedido-card">
                    <div class="pedido-header">
                        <h3>Pedido #${pedido.id}</h3>
                        <span class="pedido-status status-${pedido.status.toLowerCase()}">${pedido.status}</span>
                    </div>
                    <div class="pedido-body">
                        <div class="pedido-info">
                            <strong>Data:</strong>
                            <p>${formatarData(pedido.createdAt)}</p>
                        </div>
                        <div class="pedido-info">
                            <strong>Endereço:</strong>
                            <p>${pedido.enderecoEntrega}</p>
                        </div>
                        <div class="pedido-pizza">
                            <h4>${pedido.Pizza.nome}</h4>
                            <p>${pedido.Pizza.ingredientes}</p>
                            <p><strong>Quantidade:</strong> ${pedido.quantidade}</p>
                        </div>
                        <div class="pedido-total">
                            Total: R$ ${pedido.total.toFixed(2)}
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Erro:', error);
            pedidosContainer.innerHTML = `
                <div class="sem-pedidos">
                    <p>Ocorreu um erro ao carregar seus pedidos.</p>
                    <button onclick="window.location.reload()">Tentar novamente</button>
                </div>
            `;
        }
    }

    // Iniciar carregamento
    carregarPedidos();

    // Logout
    document.getElementById('logout')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    });
});