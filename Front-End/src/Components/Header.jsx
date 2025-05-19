export default function Header({ onLogout }) {
    return (
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Gestão de Estoque</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.open("http://localhost:5000/api/produtos/exportar/excel", "_blank")}
            className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
          >
            Exportar Excel
          </button>
          <button
            onClick={onLogout}
            className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }
  