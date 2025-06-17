import { useState } from "react";

export default function FormularioProduto({
  nomeProduto,
  setNomeProduto,
  quantidade,
  setQuantidade,
  preco,
  setPreco,
  corredor,
  setCorredor,
  prateleira,
  setPrateleira,
  categoria,
  setCategoria,
  categorias,
  handleAdicionarProduto,
  busca,
  setBusca,
}) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleSalvar = () => {
    handleAdicionarProduto();
    setMostrarModal(false);
  };

  return (
    <div className="mb-4">
      {/* Campo de busca */}

      <div className="flex justify-between flex-col mb-4 gap-4">
        {/* Botão que abre o modal */}
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-green-700 text-white px-4 py-2 w-[20%] rounded hover:bg-green-600"
        >
          + Adicionar Produto
        </button>
        <input
          type="text"
          placeholder="🔍 Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Adicionar Produto
            </h2>

            <div className="flex gap-2 flex-wrap mb-4">
              <input
                type="text"
                placeholder="Nome do produto"
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value)}
                className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                min="0"
              />
              <input
                type="number"
                placeholder="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                min="0"
                step="0.01"
              />
            </div>
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Localização
            </h2>
            <div className="flex gap-2 flex-wrap mb-4">
              <input
                type="text"
                placeholder="Corredor"
                value={corredor}
                onChange={(e) => setCorredor(e.target.value)}
                className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                min="0"
                step="0.01"
              />
              <input
                type="text"
                placeholder="Prateleira"
                value={prateleira}
                onChange={(e) => setPrateleira(e.target.value)}
                className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                min="0"
                step="0.01"
              />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border p-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvar}
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
