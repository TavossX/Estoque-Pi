// src/Components/Stock.jsx
import { useNavigate } from "react-router-dom";

function Stock() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token do localStorage e redireciona para a tela de login
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Página de Gerenciamento de Estoque</h1>
      <p>Aqui você pode gerenciar seus produtos no estoque.</p>

      {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
}

export default Stock;
