import React from "react";
export default function CheckStockModal({
  produtos,
  onClose,
  onSave,
  getNomeCategoria,
}) {
  const [produtosLocais, setProdutosLocais] = React.useState([]);

  React.useEffect(() => {
    setProdutosLocais(produtos);
  }, [produtos]);

  function alterarQuantidade(id, novaQtd) {
    setProdutosLocais((old) =>
      old.map((p) =>
        p._id === id ? { ...p, quantidade: novaQtd < 0 ? 0 : novaQtd } : p
      )
    );
  }

  function deletarProdutoLocal(id) {
    setProdutosLocais((old) => old.filter((p) => p._id !== id));
  }

  function salvarAlteracoes() {
    onSave(produtosLocais);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh] relative">
        {/* Cabeçalho fixo */}
        <header className="p-6 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Conferir Estoque
          </h2>
        </header>

        {/* Lista rolável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
          {produtosLocais.length > 0 ? (
            produtosLocais.map((produto) => (
              <div
                key={produto._id}
                className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded shadow"
              >
                <div>
                  <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-400">
                    {produto.nome}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Quantidade: {produto.quantidade} | Preço: R${" "}
                    {produto.preco?.toFixed(2) || "0.00"}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Corredor: {produto.localizacao?.corredor || "-"} |
                    Prateleira: {produto.localizacao?.prateleira || "-"}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Categoria: {getNomeCategoria(produto.categoria._id)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      alterarQuantidade(produto._id, produto.quantidade - 1)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-black dark:text-white">
                    {produto.quantidade}
                  </span>
                  <button
                    onClick={() =>
                      alterarQuantidade(produto._id, produto.quantidade + 1)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => deletarProdutoLocal(produto._id)}
                    className="bg-gray-700 hover:bg-gray-900 text-white px-3 py-1 rounded"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Nenhum produto encontrado.
            </p>
          )}
        </div>

        {/* Rodapé fixo com botões */}
        <footer className="p-6 border-t border-gray-300 dark:border-gray-700 flex justify-end gap-4 bg-white dark:bg-gray-900">
          <button
            onClick={salvarAlteracoes}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition duration-200"
          >
            Fechar
          </button>
        </footer>

        {/* Botão fechar no canto superior direito fixo */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
