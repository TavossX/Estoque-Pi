import ThemeChange from "./ThemeChange";
import DownloadButton from "./DownloadButton";
import logo from "../Assets/Logo.png";
import CheckStockButton from "./CheckStockButton";

export default function Header({ onLogout, abrirCheckStock }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <img
        src={logo}
        alt="Logo"
        className="h-11 max-w-[500px] object-contain"
      />
      <div className="flex gap-2">
        <CheckStockButton abrirModal={abrirCheckStock} />
        <DownloadButton />
        <ThemeChange />
      </div>
    </div>
  );
}
