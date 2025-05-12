const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");
const Categoria = require("../models/Categoria");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
const multer = require("multer");
const xlsx = require("xlsx");
const os = require("os");

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

// Exportar para CSV
const downloadDirectory = path.join(os.homedir(), "Downloads"); // Usa o diretório do usuário no sistema

router.get("/exportar/csv", async (req, res) => {
  try {
    const produtos = await Produto.find().populate("categoria");

    // Formatando os dados
    const produtosFormatados = produtos.map((produto) => ({
      nome: produto.nome,
      quantidade: produto.quantidade,
      preco: produto.preco,
      categoria: produto.categoria ? produto.categoria.nome : "Sem Categoria", // Exemplo de exportação do nome da categoria
    }));

    // Convertendo os produtos para formato CSV
    const produtosCSV = new Parser().parse(produtosFormatados);

    // Salvando o arquivo CSV no diretório de downloads do usuário
    const filePath = path.join(downloadDirectory, "produtos.csv");
    fs.writeFileSync(filePath, produtosCSV);

    // Enviando o arquivo para download
    res.download(filePath, "produtos.csv", (err) => {
      if (err) {
        console.log("Erro ao enviar arquivo:", err);
        res.status(500).send("Erro ao enviar o arquivo");
      }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Importar CSV
router.post("/importar/csv", upload.single("file"), (req, res) => {
  const filePath = path.join(__dirname, "..", req.file.path);

  const produtos = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Verificar se a categoria existe antes de adicionar
      if (row.categoriaId) {
        produtos.push({
          nome: row.nome,
          quantidade: parseInt(row.quantidade),
          preco: parseFloat(row.preco),
          categoria: row.categoriaId, // Categoria é o ID
        });
      }
    })
    .on("end", async () => {
      try {
        // Salvar os produtos no banco
        await Produto.insertMany(produtos);
        res.status(200).json({ msg: "Produtos importados com sucesso!" });
      } catch (err) {
        res
          .status(500)
          .json({ erro: "Erro ao importar produtos: " + err.message });
      }
    })
    .on("error", (err) => {
      res
        .status(500)
        .json({ erro: "Erro ao ler o arquivo CSV: " + err.message });
    });
});

// Exportar para Excel
router.get("/exportar/excel", async (req, res) => {
  try {
    const produtos = await Produto.find().populate("categoria");

    // Convertendo os produtos para um formato adequado para o Excel
    const ws = xlsx.utils.json_to_sheet(produtos);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Produtos");

    // Criando o arquivo Excel
    const filePath = path.join(__dirname, "..", "public", "produtos.xlsx");
    xlsx.writeFile(wb, filePath);

    // Enviando o arquivo para download
    res.download(filePath, "produtos.xlsx", (err) => {
      if (err) {
        console.log("Erro ao enviar arquivo:", err);
        res.status(500).send("Erro ao enviar o arquivo");
      }
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Importar Excel
router.post("/importar/excel", upload.single("file"), (req, res) => {
  const filePath = path.join(__dirname, "..", req.file.path);
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);

  const produtos = data.map((row) => ({
    nome: row.nome,
    quantidade: parseInt(row.quantidade),
    preco: parseFloat(row.preco),
    categoria: row.categoriaId,
  }));

  Produto.insertMany(produtos)
    .then(() =>
      res.status(200).json({ msg: "Produtos importados com sucesso!" })
    )
    .catch((err) => res.status(500).json({ erro: err.message }));
});

module.exports = router;
