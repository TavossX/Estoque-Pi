import React from "react";

const DownloadButton = () => {
  const handleExport = () => {
    window.open("http://localhost:5000/api/produtos/exportar/excel", "_blank");
  };

  return (
    <button
      onClick={handleExport}
      className="relative h-[45px] w-[95px] bg-[#ffff] text-black border px-4 rounded-[5px] overflow-hidden group focus:outline-none"
    >
      <div className="absolute inset-0 transition-transform duration-300 ease-in-out transform -translate-y-[45px] group-hover:translate-y-0">
        <div className="h-[45px] w-full flex items-center justify-center text-white text-[13px] font-semibold transition-opacity duration-300 group-hover:opacity-0">
          Export Excel
        </div>
        <div className="h-[45px] fill-black w-full flex items-center justify-center text-white">
          <svg
            className="h-[25px] w-[25px] fill-black transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus:animate-heartbeat"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479 6.908l-4-4h3v-4h2v4h3l-4 4z" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default DownloadButton;
