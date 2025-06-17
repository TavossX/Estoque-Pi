const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");
const Categoria = require("../models/Categoria");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const multer = require("multer");
const xlsx = require("xlsx");
const os = require("os");
const { Parser } = require("json2csv");

// Configuração do multer para upload de arquivos
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
});

// Criar produto
router.post("/", async (req, res) => {
  try {
    const { categoria } = req.body;

    const categoriaExiste = await Categoria.findById(categoria);
    if (!categoriaExiste) {
      return res
        .status(400)
        .json({ erro: "Categoria inválida ou não encontrada." });
    }

    const novoProduto = new Produto(req.body);
    const produtoSalvo = await novoProduto.save();
    res.status(201).json(produtoSalvo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Listar produtos
router.get("/", async (req, res) => {
  try {
    const produtos = await Produto.find().populate("categoria");
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Buscar por ID
router.get("/:id", async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto)
      return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar
router.put("/:id", async (req, res) => {
  try {
    const { categoria } = req.body;

    if (categoria) {
      const categoriaExiste = await Categoria.findById(categoria);
      if (!categoriaExiste) {
        return res
          .status(400)
          .json({ erro: "Categoria inválida ou não encontrada." });
      }
    }

    const produtoAtualizado = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(produtoAtualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Deletar
router.delete("/:id", async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ msg: "Produto deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Exportar para Excel
const XLSX = require("xlsx");

router.get("/exportar/excel", async (req, res) => {
  try {
    const produtos = await Produto.find().populate("categoria");

    // Formatando os dados para o Excel
    const dadosFormatados = produtos.map((produto, index) => ({
      "Nome do Produto": produto.nome,
      "Quantidade em Estoque": produto.quantidade,
      "Preço Unitário": produto.preco,
      Corredor: produto.localizacao?.corredor || "-", // Ajuste aqui
      Prateleira: produto.localizacao?.prateleira || "-", // Ajuste aqui
      Categoria: produto.categoria ? produto.categoria.nome : "Sem Categoria",
      "Valor Total em Estoque": {
        f: `C${index + 2}*B${index + 2}`,
        t: "n",
        z: '"R$"#,##0.00',
      },
    }));

    const ws = XLSX.utils.json_to_sheet(dadosFormatados);

    // Definir largura das colunas
    ws["!cols"] = [
      { wch: 30 }, // Nome do Produto
      { wch: 20 }, // Quantidade
      { wch: 15 }, // Preço
      { wch: 15 }, // Corredor
      { wch: 15 }, // Prateleira
      { wch: 25 }, // Categoria
      { wch: 25 }, // Valor Total
    ];

    // Estilo do cabeçalho
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center" },
    };

    // Aplicar estilo ao cabeçalho
    const numColunas = Object.keys(dadosFormatados[0]).length;
    for (let col = 0; col < numColunas; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (ws[cellRef]) ws[cellRef].s = headerStyle;
    }

    // Formatar colunas numéricas
    const moneyFormat = '"R$"#,##0.00';
    for (let i = 0; i < produtos.length; i++) {
      const linha = i + 2;
      ["C", "G"].forEach((col) => {
        const cellRef = `${col}${linha}`;
        if (ws[cellRef]) ws[cellRef].z = moneyFormat;
      });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "buffer",
      bookSST: true,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="Estoque.xlsx"');
    res.send(excelBuffer);
  } catch (err) {
    console.error("Erro na exportação para Excel:", err);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
