import React, { useEffect, useState } from "react";

const ModalEditarProduto = ({ produto, categorias, onClose, onSalvar }) => {
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState(0);
  const [corredor, setCorredor] = useState("");
  const [prateleira, setPrateleira] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setQuantidade(produto.quantidade);
      setPreco(produto.preco);
      setCorredor(produto.localizacao?.corredor || "");
      setPrateleira(produto.localizacao?.prateleira || "");
      setCategoria(produto.categoria._id || produto.categoria);
    }
  }, [produto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const atualizado = {
      ...produto,
      nome,
      quantidade: Number(quantidade),
      preco: Number(preco),
      localizacao: {
        corredor,
        prateleira,
      },
      categoria,
    };
    onSalvar(atualizado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Editar Produto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border p-2 w-full rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="border p-2 w-full rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="border p-2 w-full rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            step="0.01"
            required
          />
          <input
            type="text"
            placeholder="Corredor"
            value={corredor}
            onChange={(e) => setCorredor(e.target.value)}
            className="border p-2 w-full rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            step="0.01"
            required
          />
          <input
            type="text"
            placeholder="Prateleira"
            value={prateleira}
            onChange={(e) => setPrateleira(e.target.value)}
            className="border p-2 w-full rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            step="0.01"
            required
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border p-2 w-full rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nome}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProduto;
