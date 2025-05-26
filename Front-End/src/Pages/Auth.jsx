import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Services/Api";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    confirmaSenha: "",
  });
  const [erro, setErro] = useState("");
  const successMsg = "Cadastro Realizado com sucesso!";
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setIsLoading(true);

    // Validações
    if (!formData.email || !formData.senha) {
      setErro("E-mail e senha são obrigatórios");
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.senha !== formData.confirmaSenha) {
      setErro("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { email: formData.email, password: formData.senha }
        : {
            email: formData.email,
            password: formData.senha,
            confirmpassword: formData.confirmaSenha,
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Verifica se a resposta é JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Resposta inválida do servidor");
      }

      const data = await response.json();

      console.log(`${isLogin ? "Login" : "Cadastro"} bem-sucedido!`, data);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        navigate("/stock");
      } else {
        // Limpa os campos após cadastro
        setFormData({
          email: "",
          senha: "",
          confirmaSenha: "",
        });
        setIsLogin(true);
        setErro(successMsg);
      }
    } catch (error) {
      console.error("Erro completo:", error);
      setErro(error.message || "Erro ao processar a requisição");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Login" : "Cadastro"}
        </h2>

        {erro &&
          (erro === successMsg ? (
            <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-md">
              {erro}
            </div>
          ) : (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
              {erro}
            </div>
          ))}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="senha" className="block text-gray-700 mb-2">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            name="senha"
            placeholder="Sua senha"
            value={formData.senha}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label htmlFor="confirmaSenha" className="block text-gray-700 mb-2">
              Confirme a Senha
            </label>
            <input
              id="confirmaSenha"
              type="password"
              name="confirmaSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmaSenha}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white p-3 rounded font-medium transition-colors ${
            isLogin
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processando...
            </span>
          ) : isLogin ? (
            "Entrar"
          ) : (
            "Cadastrar"
          )}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErro("");
            }}
            className={`font-medium ${
              isLogin ? "text-green-600" : "text-blue-600"
            } hover:underline`}
            disabled={isLoading}
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;
