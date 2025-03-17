const express = require("express");
const Produto = require("../models/Produto");
const router = express.Router();

router.get("/", async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

router.post("/", async (req, res) => {
  const { nome, categoria, quantidade } = req.body;
  const novoProduto = new Produto({ nome, categoria, quantidade });
  await novoProduto.save();
  res.json(novoProduto);
});

router.delete("/:id", async (req, res) => {
  await Produto.findByIdAndDelete(req.params.id);
  res.json({ message: "Produto deletado" });
});

module.exports = router;
