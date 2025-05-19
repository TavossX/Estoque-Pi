export default function ResumoEstoque({ produtos }) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <p>Total de Produtos</p>
          <h2 className="text-2xl font-bold">{produtos.length}</h2>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg">
          <p>Estoque Baixo</p>
          <h2 className="text-2xl font-bold">{produtos.filter(p => p.quantidade <= 5).length}</h2>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <p>Unidades de Estoque</p>
          <h2 className="text-2xl font-bold">{produtos.reduce((acc, p) => acc + p.quantidade, 0)}</h2>
        </div>
      </div>
    );
  }