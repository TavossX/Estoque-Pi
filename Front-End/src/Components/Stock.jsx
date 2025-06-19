import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/Api";
import Header from "./Header";
import Categorias from "./Categoria";
import FormularioProduto from "./FormularioProduto";
import ResumoEstoque from "./ResumoEstoque";
import ListaProdutos from "./ListaProdutos";
import DashBoard from "./Dashboard";
import ModalEditarProduto from "./ModalEditarProduto";
import axios from "axios";
import CheckStockModal from "./CheckStockModal";

function Stock() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nomeProduto, setNomeProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [corredor, setCorredor] = useState("");
  const [prateleira, setPrateleira] = useState("");
  const [categoria, setCategoria] = useState("");

  const [novaCategoria, setNovaCategoria] = useState("");
  const [busca, setBusca] = useState("");

  const [abaAtiva, setAbaAtiva] = useState("produtos");
  const [mostrarCheckModal, setMostrarCheckModal] = useState(false);

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

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
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/api/categorias`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (resProdutos.status === 401 || resCategorias.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const contentTypeProdutos = resProdutos.headers.get("content-type");
        const contentTypeCategorias = resCategorias.headers.get("content-type");

        if (
          !contentTypeProdutos?.includes("application/json") ||
          !contentTypeCategorias?.includes("application/json")
        ) {
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Exclusão produto
  const handleExcluir = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/api/produtos/${id}`);
      setProdutos(produtos.filter((produto) => produto._id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir o produto.");
    }
  };

  // Edição produto
  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setMostrarModalEditar(true);
  };

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/produtos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const produtosData = await res.json();
      setProdutos(produtosData);
    } catch (err) {
      console.error("Erro ao atualizar lista de produtos:", err);
    }
  };

  // Alterar estoque local e na API
  const alterarEstoque = async (id, novaQtd) => {
    try {
      await axios.put(`${API_URL}/api/produtos/${id}`, { quantidade: novaQtd });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  // Salvar edição produto
  const handleSalvarEdicao = async (produtoAtualizado) => {
    try {
      await axios.put(
        `${API_URL}/api/produtos/${produtoAtualizado._id}`,
        produtoAtualizado
      );
      fetchProdutos();
      setMostrarModalEditar(false);
      setProdutoEditando(null);
    } catch (err) {
      console.error("Erro ao salvar produto editado:", err);
    }
  };

  // Adicionar categoria
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
          Authorization: `Bearer ${token}`,
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

      setCategorias((prev) => [...prev, categoriaCriada]);
      setNovaCategoria("");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert(`Erro ao adicionar categoria: ${error.message}`);
    }
  };

  // Adicionar produto
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
      localizacao: {
        corredor: corredor.trim(),
        prateleira: prateleira.trim(),
      },
      categoria,
    };

    try {
      const res = await fetch(`${API_URL}/api/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      setProdutos((prev) => [...prev, produtoCriado]);
      setNomeProduto("");
      setQuantidade("");
      setPreco("");
      setCorredor("");
      setPrateleira("");
      setCategoria("");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert(`Erro ao adicionar produto: ${error.message}`);
    }
  };

  // Filtrar produtos pela busca
  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Busca nome da categoria pelo id
  const getNomeCategoria = (categoriaId) => {
    const categoriaEncontrada = categorias.find(
      (cat) => cat._id === categoriaId
    );
    return categoriaEncontrada ? categoriaEncontrada.nome : "Desconhecida";
  };

  // Função para salvar os produtos alterados no modal CheckStockModal
  const salvarProdutos = (produtosAtualizados) => {
    setProdutos(produtosAtualizados);
    setMostrarCheckModal(false);
  };

  return (
    <div className="grid grid-cols-[0.2fr_1fr] grid-rows-3 bg-blue-100 dark:bg-gray-800">
      <div className="row-start-2 ml-24">
        <DashBoard
          onLogout={handleLogout}
          setAbaAtiva={setAbaAtiva}
          abaAtiva={abaAtiva}
        />
      </div>
      <div className="min-h-screen row-span-3 col-start-2 bg-blue-100 flex dark:bg-gray-800 ml-24">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-xl shadow-blue-400/50 my-10 shadow-sm mx-4 max-w-6xl w-full dark:bg-black">
          <Header abrirCheckStock={() => setMostrarCheckModal(true)} />

          {loading && <p className="text-blue-600">Carregando...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <ResumoEstoque produtos={produtos} />

          {abaAtiva === "produtos" && (
            <>
              <FormularioProduto
                nomeProduto={nomeProduto}
                setNomeProduto={setNomeProduto}
                quantidade={quantidade}
                setQuantidade={setQuantidade}
                preco={preco}
                setPreco={setPreco}
                categoria={categoria}
                setCategoria={setCategoria}
                categorias={categorias}
                corredor={corredor}
                setCorredor={setCorredor}
                prateleira={prateleira}
                setPrateleira={setPrateleira}
                handleAdicionarProduto={handleAdicionarProduto}
                busca={busca}
                setBusca={setBusca}
              />

              <ListaProdutos
                produtos={produtosFiltrados}
                handleEditar={handleEditar}
                handleExcluir={handleExcluir}
                getNomeCategoria={getNomeCategoria}
                busca={busca}
              />
            </>
          )}

          {abaAtiva === "categorias" && (
            <Categorias
              categorias={categorias}
              novaCategoria={novaCategoria}
              setNovaCategoria={setNovaCategoria}
              handleAdicionarCategoria={handleAdicionarCategoria}
            />
          )}

          {mostrarModalEditar && (
            <ModalEditarProduto
              produto={produtoEditando}
              categorias={categorias}
              onClose={() => setMostrarModalEditar(false)}
              onSalvar={handleSalvarEdicao}
            />
          )}

          {mostrarCheckModal && (
            <CheckStockModal
              produtos={produtos}
              onClose={() => setMostrarCheckModal(false)}
              onSave={salvarProdutos} // <-- Passa a prop onSave
              atualizarLista={fetchProdutos}
              alterarEstoque={alterarEstoque}
              deletarProduto={handleExcluir}
              getNomeCategoria={getNomeCategoria}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Stock;
