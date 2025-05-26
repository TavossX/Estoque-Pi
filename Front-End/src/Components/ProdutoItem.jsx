export default function ProdutoItem({
  item,
  handleEditar,
  handleExcluir,
  getNomeCategoria,
}) {
  return (
    <div className="bg-gray-50 text-white p-4 rounded shadow-sm flex justify-between items-center dark:bg-gray-800 text-white">
      <div>
        <p className="font-bold text-black dark:text-white">{item.nome}</p>
        <p className="text-sm text-gray-600 dark:text-white">
          Quantidade: {item.quantidade} | Preço: R${" "}
          {item.preco?.toFixed(2) || "0.00"} | Categoria:{" "}
          {getNomeCategoria(item.categoria._id)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleEditar(item)}
          className="px-3 py-1 bg-green-500 hover:bg-blue-600 text-white text-sm rounded"
        >
          <i className="bx bx-info-circle"></i>
        </button>
        <button
          onClick={() => handleEditar(item)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
        >
          <i className="bx bx-edit"></i>
        </button>
        <button
          onClick={() => handleExcluir(item._id)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
        >
          <i className="bx bx-trash"></i>
        </button>
      </div>
    </div>
  );
}
