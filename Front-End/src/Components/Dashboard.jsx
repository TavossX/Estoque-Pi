import React from "react";

const DashBoard = ({ onLogout, setAbaAtiva, abaAtiva }) => {
  return (
    <div className="card flex items-center w-60 h-full bg-white p-5 shadow-xl shadow-blue-400/50 rounded-xl dark:bg-black">
      <ul className="w-full flex flex-col gap-6">
        {/* PRODUTOS */}
        <li className="flex-center cursor-pointer w-full whitespace-nowrap">
          <button
            onClick={() => setAbaAtiva("produtos")}
            className={`flex size-full gap-4 p-4 font-semibold rounded-xl bg-cover transition-all ease-linear
              ${
                abaAtiva === "produtos"
                  ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                  : "hover:bg-purple-600 hover:shadow-inner text-gray-900 dark:text-gray-100"
              }`}
          >
            {/* Ícone Produtos */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            Produtos
          </button>
        </li>

        {/* CATEGORIAS */}
        <li className="flex-center cursor-pointer max-h-[490px] whitespace-nowrap overflow-y-auto">
          <button
            onClick={() => setAbaAtiva("categorias")}
            className={`flex size-full gap-4 p-4 font-semibold rounded-xl  bg-cover transition-all ease-linear
              ${
                abaAtiva === "categorias"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                  : "hover:bg-blue-500 hover:shadow-inner text-gray-900 dark:text-gray-100"
              }`}
          >
            {/* Ícone Categorias */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6Z"
              />
            </svg>
            Categorias
          </button>
        </li>

        {/* SAIR */}
        <li className="flex-center cursor-pointer w-full whitespace-nowrap">
          <button
            onClick={onLogout}
            className="flex size-full gap-4 p-4 font-semibold rounded-xl bg-cover transition-all ease-linear
              text-gray-900 dark:text-gray-100 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="size-6"
            >
              <path d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z" />
              <path d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z" />
            </svg>
            Sair
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashBoard;
