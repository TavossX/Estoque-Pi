// backend/index.js ou server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco
mongoose.connect("mongodb://localhost:27017/Estoque", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model do Usuário
const Usuario = mongoose.model("Usuario", {
  nome: String,
  email: String,
  senha: String,
});

// Rota de registro
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validações opcionais...

  try {
    const usuario = await Usuario.create({ nome, email, senha });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
