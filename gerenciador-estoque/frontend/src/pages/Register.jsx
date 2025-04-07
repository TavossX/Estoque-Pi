import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Cadastro</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Cadastrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Já tem conta? <Link className="text-blue-500" to="/">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
const handleRegister = async () => {
  try {
    await axios.post("http://localhost:3000/register", {
      nome,
      email,
      senha,
    });

    alert("Usuário registrado com sucesso!");
  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("Erro ao registrar");
  }
};

