import ProdutoItem from "./ProdutoItem";

export default function ListaProdutos({
  produtos,
  handleEditar,
  handleExcluir,
  getNomeCategoria,
  busca,
}) {
  return (
    <div className="space-y-4">
      {produtos.length > 0 ? (
        produtos.map((item) => (
          <ProdutoItem
            key={item._id}
            item={item}
            handleEditar={handleEditar}
            handleExcluir={handleExcluir}
            getNomeCategoria={getNomeCategoria}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">
          {busca ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
        </p>
      )}
    </div>
  );
}
