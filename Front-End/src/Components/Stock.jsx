import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/Api";

function Stock() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nomeProduto, setNomeProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");

  const [novaCategoria, setNovaCategoria] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [resProdutos, resCategorias] = await Promise.all([
          fetch(`${API_URL}/api/produtos`, {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          fetch(`${API_URL}/api/categorias`, {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
        ]);

        if (resProdutos.status === 401 || resCategorias.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const contentTypeProdutos = resProdutos.headers.get("content-type");
        const contentTypeCategorias = resCategorias.headers.get("content-type");

        if (!contentTypeProdutos?.includes("application/json") || 
            !contentTypeCategorias?.includes("application/json")) {
          throw new Error("Resposta não é JSON");
        }

        const produtosData = await resProdutos.json();
        const categoriasData = await resCategorias.json();

        if (!Array.isArray(produtosData) || !Array.isArray(categoriasData)) {
          throw new Error("Dados recebidos em formato inválido");
        }

        setProdutos(produtosData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Erro ao carregar os dados:", err);
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAdicionarCategoria = async () => {
    const token = localStorage.getItem("token");
    if (!novaCategoria.trim()) {
      alert("Por favor, insira um nome para a categoria");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome: novaCategoria.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${res.status}`);
      }

      const categoriaCriada = await res.json();
      
      if (!categoriaCriada?.nome) {
        throw new Error("Resposta da API inválida");
      }

      setCategorias(prev => [...prev, categoriaCriada]);
      setNovaCategoria("");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert(`Erro ao adicionar categoria: ${error.message}`);
    }
  };

  const handleAdicionarProduto = async () => {
    const token = localStorage.getItem("token");
    
    if (!nomeProduto.trim() || !quantidade || !preco || !categoria) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const novoProduto = {
      nome: nomeProduto.trim(),
      quantidade: Number(quantidade),
      preco: Number(preco),
      categoria,
    };

    try {
      const res = await fetch(`${API_URL}/api/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(novoProduto),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${res.status}`);
      }

      const produtoCriado = await res.json();
      
      if (!produtoCriado?.nome) {
        throw new Error("Resposta da API inválida");
      }

      setProdutos(prev => [...prev, produtoCriado]);
      setNomeProduto("");
      setQuantidade("");
      setPreco("");
      setCategoria("");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert(`Erro ao adicionar produto: ${error.message}`);
    }
  };

  const handleImportCSV = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/importar/csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Erro ao importar CSV");
      }

      alert("Importação CSV concluída");
      window.location.reload(); // ou refaça a chamada da API aqui
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao importar CSV");
    }
  };

  const handleImportExcel = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/importar/excel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Erro ao importar Excel");
      }

      alert("Importação Excel concluída");
      window.location.reload();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao importar Excel");
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const getNomeCategoria = (categoriaId) => {
    const categoriaEncontrada = categorias.find(cat => cat._id === categoriaId);
    return categoriaEncontrada ? categoriaEncontrada.nome : "Desconhecida";
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center py-10">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-6xl">
          {/* Topo */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Gestão de Estoque</h1>
            <div className="flex gap-2">
              {/* Exportar CSV */}
              <button
                onClick={() => window.open("http://localhost:5000/api/produtos/exportar/csv", "_blank")}
                className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
              >
                Exportar CSV
              </button>

              {/* Exportar Excel */}
              <button
                onClick={() => window.open("http://localhost:5000/api/produtos/exportar/excel", "_blank")}
                className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
              >
                Exportar Excel
              </button>

              {/* Importar CSV */}
              <label className="border px-4 py-1 rounded text-sm hover:bg-gray-100 cursor-pointer">
                Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleImportCSV}
                />
              </label>

              {/* Importar Excel */}
              <label className="border px-4 py-1 rounded text-sm hover:bg-gray-100 cursor-pointer">
                Importar Excel
                <input
                  type="file"
                  accept=".xlsx"
                  hidden
                  onChange={handleImportExcel}
                />
              </label>

              {/* Botão Sair */}
              <button
                onClick={handleLogout}
                className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          </div>

        {loading && <p className="text-blue-600">Carregando...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <p>Total de Produtos</p>
            <h2 className="text-2xl font-bold">{produtos.length}</h2>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-lg">
            <p>Estoque Baixo</p>
            <h2 className="text-2xl font-bold">{produtos.filter(p => p.quantidade <= 5).length}</h2>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-lg">
            <p>Unidades de Estoque</p>
            <h2 className="text-2xl font-bold">{produtos.reduce((acc, p) => acc + p.quantidade, 0)}</h2>
          </div>
        </div>

        {/* Adicionar Categoria */}
        <div className="flex justify-between items-start gap-6 mb-6 flex-wrap">
          <div className="flex-1">
            <p className="mb-2 font-medium">Adicionar Categoria</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleAdicionarCategoria}
                className="bg-purple-700 text-white px-4 rounded w-[40%]"
              >
                Nova Categoria
              </button>
            </div>
          </div>
          <div className="flex-1">
            <p className="mb-2 font-medium">Categorias Existentes</p>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <span key={cat._id} className="bg-gray-100 px-4 py-3 rounded text-sm">
                  {cat.nome}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Adicionar Produto */}
        <div className="mb-4">
          <p className="mb-2 font-medium">Adicionar Produtos</p>
          <div className="flex gap-2 flex-wrap mb-4">
            <input
              type="text"
              placeholder="Nome do produto"
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="border p-2 rounded flex-1"
              min="0"
            />
            <input
              type="number"
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="border p-2 rounded flex-1"
              min="0"
              step="0.01"
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="border p-2 rounded flex-1"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.nome}</option>
              ))}
            </select>
            <button
              onClick={handleAdicionarProduto}
              className="bg-purple-700 text-white px-4 rounded"
            >
              + Adicionar Produto
            </button>
          </div>

          {/* Buscar Produto */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="🔍 Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border p-2 rounded flex-1"
            />
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="space-y-4">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((item) => (
              <div key={item._id} className="bg-gray-50 p-4 rounded shadow-sm flex justify-between items-start">
                <div>
                  <p className="font-bold">{item.nome}</p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantidade} | 
                    Preço: R$ {item.preco?.toFixed(2) || '0.00'} | 
                    Categoria: {getNomeCategoria(item.categoria)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              {busca ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stock;