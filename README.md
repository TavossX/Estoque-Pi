
# 🧾 Sistema de Gerenciamento de Produtos — Projeto Integrador

Projeto Integrador da **Fatec Jahu** desenvolvido com Node.js, Express, MongoDB e React. Este sistema permite o **cadastro, listagem, edição, remoção e importação/exportação de produtos**, com categorização e interface moderna.

---

## 📦 Tecnologias Utilizadas

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (upload de arquivos)
- `json2csv` e `xlsx` (importação/exportação)
- JWT (autenticação)

**Frontend (em desenvolvimento):**
- React.js
- Tailwind CSS
- Axios

---

## 🔧 Funcionalidades

- ✅ Cadastro de produtos com categoria
- ✅ Listagem de produtos (com categorias populadas)
- ✅ Atualização e exclusão de produtos
- ✅ Autenticação JWT
- ✅ Importação de arquivos `.csv` e `.xlsx`
- ✅ Exportação de dados para `.csv` e `.xlsx`
- ✅ Organização de uploads em pasta separada

---

## 📁 Estrutura de Pastas (Backend)

```
├── models/
│   ├── Produto.js
│   └── Categoria.js
├── routes/
│   └── produtos.js
├── uploads/         # Arquivos enviados temporariamente
├── public/          # Arquivos gerados para download
├── server.js        # Inicialização do servidor
```

---

## 📥 Importação de Arquivos

Você pode importar produtos usando arquivos `.csv` ou `.xlsx` com os seguintes campos:

**CSV/Excel esperado:**

| nome           | quantidade | preco   | categoriaId                        |
|----------------|------------|---------|------------------------------------|
| Produto Teste  | 10         | 99.99   | 6628c896c765f270d08a9ef2           |

> **Atenção**: o campo `categoriaId` deve ser um ID válido de uma categoria cadastrada no sistema.

---

## 🔓 Rotas Principais

- `POST /api/produtos` – Criar produto  
- `GET /api/produtos` – Listar produtos  
- `PUT /api/produtos/:id` – Atualizar produto  
- `DELETE /api/produtos/:id` – Remover produto  
- `POST /api/produtos/importar/csv` – Importar CSV  
- `POST /api/produtos/importar/excel` – Importar Excel  
- `GET /api/produtos/exportar/csv` – Exportar CSV  
- `GET /api/produtos/exportar/excel` – Exportar Excel  

---

## ▶️ Como rodar o projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/TavossX/Estoque-Pi
   cd seu-repo
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o MongoDB**
   - Crie um banco chamado `Estoque` localmente (ou edite o URI).
   - Crie categorias manualmente ou via script/código.

4. **Inicie o servidor**
   ```bash
   npm start
   ```

---

## 🎓 Sobre

Este projeto foi desenvolvido como parte do **Projeto Integrador** do curso de **Desenvolvimento de Software Multiplataforma** da [Fatec Jahu](https://fatecjahu.edu.br/), com o objetivo de aplicar conceitos de desenvolvimento web fullstack e boas práticas de programação.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

---

## 🧑‍💻 Autor

**Otavio Martins Ficho**  
Desenvolvedor Fullstack | Fatec Jahu  
[LinkedIn](https://www.linkedin.com/in/otavio-martins2004/?originalSubdomain=br) · [GitHub](https://github.com/TavossX)
