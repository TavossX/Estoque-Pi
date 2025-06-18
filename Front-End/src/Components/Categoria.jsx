import CategoriaItem from "./CategoriaItem"; // Importe corretamente

export default function Categorias({
  categorias,
  novaCategoria,
  setNovaCategoria,
  handleAdicionarCategoria,
  handleEditarCategoria,
  handleExcluirCategoria,
}) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      <div>
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
            className="bg-purple-700 text-white px-4 rounded hover:bg-purple-800"
          >
            Nova Categoria
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 font-medium dark:text-white">
          Categorias Existentes
        </p>
        <div className="flex flex-col gap-2">
          {categorias.map((cat) => (
            <CategoriaItem
              key={cat._id}
              categoria={cat}
              handleEditar={handleEditarCategoria}
              handleExcluir={handleExcluirCategoria}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
