export default function FormularioProduto({ nomeProduto, setNomeProduto, quantidade, setQuantidade, preco, setPreco, categoria, setCategoria, categorias, handleAdicionarProduto, busca, setBusca }) {
    return (
      <div className="mb-4">
        <p className="mb-2 font-medium">Adicionar Produtos</p>
        <div className="flex gap-2 flex-wrap mb-4">
          <input
            type="text"
            placeholder="Nome do produto"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="border p-2 rounded flex-1"
            min="0"
          />
          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="border p-2 rounded flex-1"
            min="0"
            step="0.01"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.nome}</option>
            ))}
          </select>
          <button
            onClick={handleAdicionarProduto}
            className="bg-purple-700 text-white px-4 rounded"
          >
            + Adicionar Produto
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border p-2 rounded flex-1"
          />
        </div>
      </div>
    );
  }
  