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
          className="flex items-center justify-between gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-black dark:text-white bg-white dark:bg-black border border-transparent dark:border-white/30 hover:border-white/60 hover:bg-gradient-to-b hover:from-white/20 hover:via-white/30 hover:to-white/40 dark:hover:from-white/10 dark:hover:via-white/20 dark:hover:to-white/30 hover:shadow-md active:translate-y-0.5"
        >
          <i className="bx bx-exit text-lg"></i>
          Sair
        </button>

        <ThemeChange />
      </div>
    </div>
  );
}
