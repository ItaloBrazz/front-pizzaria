# 🍕 Pizzaria App

Front-end completo para gerenciamento de pizzaria, incluindo controle de pedidos, administração de produtos, gerenciamento de estoque e painel para clientes e funcionários.

## 🚀 Funcionalidades

- Cadastro de pizzas, sabores e tamanhos  
- Gerenciamento de pedidos com status (em preparo, pronto, entregue)  
- Interface para clientes realizarem pedidos online  
- Painel administrativo para funcionarios.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML, CSS, JS
- **Backend:** Node.js + Express + Js
- **Banco de Dados:** PostgreSQL  
- **Outros:** Postman, Insomnia, Sequelize (ORM)

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/ItaloBrazz/pizzaria-deli.git
cd pizzaria-deli
```

Instale as dependências:

```bash
# Backend
cd backend
npm install
```

Configure as variáveis de ambiente criando um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
JWT_SECRET=sua_chave_secreta
PORT=3001
```

Execute as migrações e inicie o servidor:

```bash
# Dentro da pasta backend
npm run dev
```

E para o frontend:

```bash
# Dentro da pasta frontend
Inicie o Live Server
```

## 📂 Estrutura do Projeto

```
pizzaria-deli/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── css/
│   │   ├── js/
│   │   └── index.html
├
└── README.md
```

## 🧑‍🍳 Contribuindo

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir uma issue ou enviar um pull request com melhorias.

Desenvolvido por Ítalo Braz.
