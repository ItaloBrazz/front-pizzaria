document.addEventListener("DOMContentLoaded", async () => {
  const pizzaForm = document.getElementById("pizzaForm");
  const pizzasList = document.getElementById("pizzasList");
  const API_URL = "https://back-pizzaria.onrender.com/api/pizzas";

  try {
    const user = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "admin") {
      window.location.href = "login.html";
      return;
    }

    // Carregar pizzas existentes
    await carregarPizzas();

    // Cadastrar nova pizza
    pizzaForm.addEventListener("submit", handleSubmitPizza);
  } catch (error) {
    console.error("Erro na inicialização:", error);
    showError("Erro ao carregar o painel administrativo");
  }

  async function carregarPizzas() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no servidor");
      }

      const pizzas = await response.json();
      renderPizzas(pizzas);
    } catch (error) {
      console.error("Erro ao carregar pizzas:", error);
      showError(error.message || "Erro ao carregar pizzas");
      throw error;
    }
  }

  function renderPizzas(pizzas) {
    if (!pizzas || pizzas.length === 0) {
      pizzasList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-pizza-slice"></i>
                <p>Nenhuma pizza cadastrada</p>
                <button class="btn btn-primary" onclick="document.getElementById('pizzaForm').scrollIntoView()">
                    <i clas s="fas fa-plus"></i> Cadastrar Pizza
                </button>
            </div>
        `;
      return;
    }

    pizzasList.innerHTML = pizzas
      .map(
        (pizza) => `
        <div class="pizza-card">
            <div class="pizza-image" style="background-image: url('${
              pizza.imagem ||
              "https://via.placeholder.com/300x180?text=Sem+Imagem"
            }')">
                <span class="pizza-badge">${pizza.tamanho}</span>
            </div>
            <div class="pizza-content">
                <div class="pizza-header">
                    <h3 class="pizza-title">${pizza.nome}</h3>
                    <span class="pizza-price">R$ ${pizza.preco.toFixed(
                      2
                    )}</span>
                </div>
                <p class="pizza-size"><i class="fas fa-ruler-combined"></i> ${
                  pizza.tamanho
                }</p>
                <p class="pizza-ingredients">${pizza.ingredientes}</p>
                <div class="pizza-actions">
                    <button class="btn btn-edit" data-id="${pizza.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-delete" data-id="${pizza.id}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        </div>
    `
      )
      .join("");

    // Adiciona eventos aos botões
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        editarPizza(e.target.closest("button").dataset.id)
      );
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        excluirPizza(e.target.closest("button").dataset.id)
      );
    });
  }

  async function handleSubmitPizza(e) {
    e.preventDefault();

    const pizza = {
      nome: document.getElementById("pizzaNome").value.trim(),
      ingredientes: document.getElementById("pizzaIngredientes").value.trim(),
      preco: parseFloat(document.getElementById("pizzaPreco").value),
      tamanho: document.getElementById("pizzaTamanho").value.trim(),
      imagem: document.getElementById("pizzaImagem").value.trim() || null,
    };

    // Validação básica
    if (
      !pizza.nome ||
      !pizza.ingredientes ||
      isNaN(pizza.preco) ||
      !pizza.tamanho
    ) {
      showError("Preencha todos os campos obrigatórios corretamente");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(pizza),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar pizza");
      }

      const novaPizza = await response.json();
      showSuccess("Pizza cadastrada com sucesso!");
      pizzaForm.reset();
      await carregarPizzas(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao cadastrar pizza:", error);
      showError(error.message || "Erro ao cadastrar pizza");
    }
  }

  async function editarPizza(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao carregar pizza");
      }

      const pizza = await response.json();

      // Preenche o formulário com os dados da pizza
      document.getElementById("pizzaNome").value = pizza.nome;
      document.getElementById("pizzaIngredientes").value = pizza.ingredientes;
      document.getElementById("pizzaPreco").value = pizza.preco;
      document.getElementById("pizzaTamanho").value = pizza.tamanho;
      document.getElementById("pizzaImagem").value = pizza.imagem || "";

      // Atualiza o preview da imagem
      const preview = document.getElementById("imagePreview");
      if (pizza.imagem) {
        preview.innerHTML = `<img src="${pizza.imagem}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">`;
      } else {
        preview.innerHTML =
          '<div class="preview-text">Nenhuma imagem selecionada</div>';
      }

      // Rola até o formulário
      document
        .getElementById("pizzaForm")
        .scrollIntoView({ behavior: "smooth" });

      // Altera o botão para "Atualizar"
      const submitBtn = document.querySelector(
        '#pizzaForm button[type="submit"]'
      );
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Pizza';
      submitBtn.dataset.editingId = id;

      // Remove o evento antigo e adiciona o novo
      submitBtn.replaceWith(submitBtn.cloneNode(true));
      document
        .querySelector('#pizzaForm button[type="submit"]')
        .addEventListener("click", handleUpdatePizza);
    } catch (error) {
      console.error("Erro ao editar pizza:", error);
      showError(error.message || "Erro ao editar pizza");
    }
  }

  async function handleUpdatePizza(e) {
    e.preventDefault();

    const id = e.target.dataset.editingId;
    const pizza = {
      nome: document.getElementById("pizzaNome").value.trim(),
      ingredientes: document.getElementById("pizzaIngredientes").value.trim(),
      preco: parseFloat(document.getElementById("pizzaPreco").value),
      tamanho: document.getElementById("pizzaTamanho").value.trim(),
      imagem: document.getElementById("pizzaImagem").value.trim() || null,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(pizza),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar pizza");
      }

      showSuccess("Pizza atualizada com sucesso!");
      pizzaForm.reset();

      // Restaura o botão para "Cadastrar"
      const submitBtn = document.querySelector(
        '#pizzaForm button[type="submit"]'
      );
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Cadastrar Pizza';
      submitBtn.removeAttribute("data-editing-id");

      // Remove o evento de atualização e adiciona o de cadastro novamente
      submitBtn.replaceWith(submitBtn.cloneNode(true));
      document
        .querySelector('#pizzaForm button[type="submit"]')
        .addEventListener("click", handleSubmitPizza);

      await carregarPizzas();
    } catch (error) {
      console.error("Erro ao atualizar pizza:", error);
      showError(error.message || "Erro ao atualizar pizza");
    }
  }

  async function excluirPizza(id) {
    if (!confirm("Tem certeza que deseja excluir esta pizza?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir pizza");
      }

      showSuccess("Pizza excluída com sucesso!");
      await carregarPizzas();
    } catch (error) {
      console.error("Erro ao excluir pizza:", error);
      showError(error.message || "Erro ao excluir pizza");
    }
  }

  function showError(message) {
    alert(`Erro: ${message}`);
  }

  function showSuccess(message) {
    alert(`Sucesso: ${message}`);
  }
});
