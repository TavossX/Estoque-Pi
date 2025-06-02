import React from "react";

const DownloadButton = () => {
  const handleExport = () => {
    window.open("http://localhost:5000/api/produtos/exportar/excel", "_blank");
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center justify-between gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 text-black dark:text-white bg-white dark:bg-black border border-transparent dark:border-white/30 hover:border-white/60 hover:bg-gradient-to-b hover:from-white/20 hover:via-white/30 hover:to-white/40 dark:hover:from-white/10 dark:hover:via-white/20 dark:hover:to-white/30 hover:shadow-md active:translate-y-0.5"
    >
      <svg
        viewBox="0 0 256 256"
        height="24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="text-black dark:text-white"
      >
        <path d="M74.34 85.66a8 8 0 0 1 11.32-11.32L120 108.69V24a8 8 0 0 1 16 0v84.69l34.34-34.35a8 8 0 0 1 11.32 11.32l-48 48a8 8 0 0 1-11.32 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a4 4 0 0 1 2.83 1.17L111 145a24 24 0 0 0 34 0l23.8-23.8a4 4 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16m-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12" />
      </svg>
      Exportar Excel
    </button>
  );
};

export default DownloadButton;
