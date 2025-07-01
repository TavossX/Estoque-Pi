import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/Api";
import Header from "./Header";
import Categorias from "./Categoria";
import FormularioProduto from "./FormularioProduto";
import ResumoEstoque from "./ResumoEstoque";
import ListaProdutos from "./ListaProdutos";
import DashBoard from "./Dashboard"; // Cuidado: seu Dashboard é um componente separado, não o próprio Stock
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
  // Adicione o estado para a ordenação aqui no componente pai (Stock)
  const [ordem, setOrdem] = useState("nome"); // Padrão A-Z pelo nome

  const [abaAtiva, setAbaAtiva] = useState("produtos");
  const [mostrarCheckModal, setMostrarCheckModal] = useState(false);

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Estados para editar categoria
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mostrarModalEditarCategoria, setMostrarModalEditarCategoria] =
    useState(false);
  const [nomeCategoriaEditada, setNomeCategoriaEditada] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setLoading(false);
    setShowContent(true);

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

        // Certifique-se de que a categoria em produtos é um objeto com 'nome'
        // Se a API retornar apenas o ID da categoria no produto, você precisará "popular"
        // o objeto categoria aqui para que p.categoria.nome funcione no filtro e ordenação.
        const produtosComCategoriaCompleta = produtosData.map((p) => ({
          ...p,
          categoria: categoriasData.find((cat) => cat._id === p.categoria) || {
            _id: p.categoria,
            nome: "Desconhecida",
          },
        }));

        setProdutos(produtosComCategoriaCompleta);
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
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

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
      // Refaz a "população" da categoria após buscar produtos novamente
      const produtosComCategoriaCompleta = produtosData.map((p) => ({
        ...p,
        categoria: categorias.find((cat) => cat._id === p.categoria) || {
          _id: p.categoria,
          nome: "Desconhecida",
        },
      }));
      setProdutos(produtosComCategoriaCompleta);
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
      // Quando uma nova categoria é adicionada, é bom re-buscar os produtos
      // caso o produto.categoria precise do objeto completo
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert(`Erro ao adicionar categoria: ${error.message}`);
    }
  };

  // Abrir modal edição categoria
  const handleEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setNomeCategoriaEditada(categoria.nome);
    setMostrarModalEditarCategoria(true);
  };

  // Salvar edição categoria
  const handleSalvarEdicaoCategoria = async () => {
    if (!nomeCategoriaEditada.trim()) {
      alert("O nome da categoria não pode ser vazio");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/categorias/${categoriaEditando._id}`, {
        nome: nomeCategoriaEditada.trim(),
      });
      setCategorias((prev) =>
        prev.map((cat) =>
          cat._id === categoriaEditando._id
            ? { ...cat, nome: nomeCategoriaEditada.trim() }
            : cat
        )
      );
      setMostrarModalEditarCategoria(false);
      setCategoriaEditando(null);
      setNomeCategoriaEditada("");
      // Re-busca produtos caso alguma categoria editada afete produtos
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar categoria editada:", error);
      alert("Erro ao salvar a categoria editada.");
    }
  };

  // Exclusão categoria
  const handleExcluirCategoria = async (id) => {
    const categoriaEmUso = produtos.some(
      (produto) => produto.categoria._id === id
    ); // Use _id da categoria

    if (categoriaEmUso) {
      alert(
        "Não é possível excluir esta categoria pois há produtos associados a ela."
      );
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/categorias/${id}`);
      setCategorias(categorias.filter((cat) => cat._id !== id));
      // Não precisa fetchProdutos aqui, pois se a categoria foi excluída, não há produtos vinculados
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir a categoria.");
    }
  };

  // Adicionar produto
  const handleAdicionarProduto = async () => {
    const token = localStorage.getItem("token");

    if (
      !nomeProduto.trim() ||
      quantidade === "" ||
      preco === "" ||
      !categoria
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const novoProduto = {
      nome: nomeProduto.trim(),
      quantidade: parseInt(quantidade, 10),
      preco: parseFloat(preco),
      localizacao: {
        corredor: corredor.trim(),
        prateleira: prateleira.trim(),
      },
      categoria, // Aqui você está passando apenas o ID da categoria
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
        throw new Error(
          errorData.message ||
            errorData.erro ||
            errorData.msg ||
            `Erro ${res.status}`
        );
      }

      const produtoCriado = await res.json();

      if (!produtoCriado?.nome) {
        throw new Error("Resposta da API inválida");
      }

      // Após criar o produto, re-busque a lista de produtos para garantir
      // que o novo produto venha com a categoria "populada" corretamente
      fetchProdutos();

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

  // --- LÓGICA DE FILTRO E ORDENAÇÃO PRINCIPAL ---
  const produtosFiltrados = produtos.filter((p) => {
    const searchTerm = busca.toLowerCase();
    const categoriaNome = p.categoria?.nome?.toLowerCase() || ""; // Acessa o nome da categoria com segurança
    const corredorLower = p.localizacao?.corredor?.toLowerCase() || ""; // Acessa corredor com segurança
    const prateleiraLower = p.localizacao?.prateleira?.toLowerCase() || ""; // Acessa prateleira com segurança

    return (
      p.nome.toLowerCase().includes(searchTerm) ||
      categoriaNome.includes(searchTerm) ||
      corredorLower.includes(searchTerm) ||
      prateleiraLower.includes(searchTerm)
      // Adicione mais campos para busca se necessário, ex: String(p.quantidade).includes(searchTerm)
    );
  });

  const ordenarProdutos = (lista) => {
    return [...lista].sort((a, b) => {
      switch (ordem) {
        case "nome":
          return a.nome.localeCompare(b.nome);
        case "preco":
          return b.preco - a.preco;
        case "quantidade":
          return b.quantidade - a.quantidade;
        case "categoria":
          // Garante que o nome da categoria existe antes de comparar
          return (a.categoria?.nome || "").localeCompare(
            b.categoria?.nome || ""
          );
        default:
          return 0;
      }
    });
  };

  const produtosOrdenadosEFiltrados = ordenarProdutos(produtosFiltrados);
  // --- FIM DA LÓGICA DE FILTRO E ORDENAÇÃO PRINCIPAL ---

  // Busca nome da categoria pelo id (ainda útil para outros lugares)
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
    <div
      className={`transition-opacity duration-700 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="grid grid-cols-[0.2fr_1fr] grid-rows-3 bg-blue-100 dark:bg-gray-800">
        <div className="row-start-2 ml-24">
          <DashBoard // Cuidado aqui: DashBoard não deve ser o próprio Stock
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
                  // Passe as props de busca e ordenação para FormularioProduto
                  busca={busca}
                  setBusca={setBusca}
                  ordem={ordem} // Passa o estado de ordenação
                  setOrdem={setOrdem} // Passa a função para atualizar a ordenação
                />

                <ListaProdutos
                  // Passe a lista de produtos JÁ filtrada e ordenada
                  produtos={produtosOrdenadosEFiltrados}
                  handleEditar={handleEditar}
                  handleExcluir={handleExcluir}
                  getNomeCategoria={getNomeCategoria}
                  // Remova 'busca' daqui, ListaProdutos não precisa filtrar, só exibir
                  // busca={busca} // <-- Remova esta linha
                />
              </>
            )}

            {abaAtiva === "categorias" && (
              <Categorias
                categorias={categorias}
                novaCategoria={novaCategoria}
                setNovaCategoria={setNovaCategoria}
                handleAdicionarCategoria={handleAdicionarCategoria}
                handleEditarCategoria={handleEditarCategoria}
                handleExcluirCategoria={handleExcluirCategoria}
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

            {mostrarModalEditarCategoria && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-96">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    Editar Categoria
                  </h2>
                  <input
                    type="text"
                    value={nomeCategoriaEditada}
                    onChange={(e) => setNomeCategoriaEditada(e.target.value)}
                    className="w-full border p-2 rounded mb-4 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setMostrarModalEditarCategoria(false)}
                      className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSalvarEdicaoCategoria}
                      className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mostrarCheckModal && (
              <CheckStockModal
                produtos={produtos}
                onClose={() => setMostrarCheckModal(false)}
                onSave={salvarProdutos}
                atualizarLista={fetchProdutos}
                alterarEstoque={alterarEstoque}
                deletarProduto={handleExcluir}
                getNomeCategoria={getNomeCategoria}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock;
