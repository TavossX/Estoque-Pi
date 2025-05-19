import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/Api";
import Header from "./Header";
import Categorias from "./Categoria"
import FormularioProduto from "./FormularioProduto";
import ProdutoItem from "./ProdutoItem";
import ResumoEstoque from "./ResumoEstoque";
import ListaProdutos from "./ListaProdutos";
import axios from "axios";
import ModalEditarProduto from "./components/ModalEditarProduto";


function Stock() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  console.log(categorias);
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

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/produtos/${id}`);
  
      // Atualiza a lista de produtos removendo o excluído
      setProdutos(produtos.filter(produto => produto._id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir o produto.");
    }
  };

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setMostrarModalEditar(true);
  };
  
  const handleSalvarEdicao = async (produtoAtualizado) => {
    try {
      await axios.put(`http://localhost:5000/api/produtos/${produtoAtualizado._id}`, produtoAtualizado);
      fetchProdutos(); // atualiza lista
      setMostrarModalEditar(false);
      setProdutoEditando(null);
    } catch (err) {
      console.error("Erro ao salvar produto editado:", err);
    }
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
        <Header onLogout={handleLogout} />
        {loading && <p className="text-blue-600">Carregando...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <ResumoEstoque produtos={produtos} />
        <Categorias
          categorias={categorias}
          novaCategoria={novaCategoria}
          setNovaCategoria={setNovaCategoria}
          handleAdicionarCategoria={handleAdicionarCategoria}
        />
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
      </div>
    </div>
  );
  
}

export default Stock;