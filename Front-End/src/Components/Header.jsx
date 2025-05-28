import ThemeChange from "./ThemeChange";
import DownloadButton from "./DownloadButton";

export default function Header({ onLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold dark:text-white">Gestão de Estoque</h1>
      <div className="flex gap-2">
        <DownloadButton />
        <button
          onClick={onLogout}
          className="border px-4 py-1 items-center rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white flex"
        >
          <i className="bx bx-exit text-xl"></i>
          Sair
        </button>
        <ThemeChange />
      </div>
    </div>
  );
}
