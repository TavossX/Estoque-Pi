const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true },
  preco: { type: Number, required: true },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  dataEntrada: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Produto", ProdutoSchema);
