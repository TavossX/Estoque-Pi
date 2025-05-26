export default function Categorias({
  categorias,
  novaCategoria,
  setNovaCategoria,
  handleAdicionarCategoria,
}) {
  return (
    <div className="flex justify-between items-start gap-6 mb-6 flex-wrap">
      <div className="flex-1">
        <p className="mb-2 font-medium dark:text-white">Adicionar Categoria</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            className="border p-2 rounded w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleAdicionarCategoria}
            className="bg-purple-700 text-white px-4 rounded w-[40%] hover:bg-purple-800"
          >
            Nova Categoria
          </button>
        </div>
      </div>
      <div className="flex-1">
        <p className="mb-2 font-medium dark:text-white">
          Categorias Existentes
        </p>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <span
              key={cat._id}
              className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded text-sm dark:text-white"
            >
              {cat.nome}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
