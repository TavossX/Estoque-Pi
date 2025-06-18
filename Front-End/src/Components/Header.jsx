import ThemeChange from "./ThemeChange";
import DownloadButton from "./DownloadButton";

export default function Header({ onLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold dark:text-white">Stock360</h1>
      <div className="flex gap-2">
        <DownloadButton />
        <ThemeChange />
      </div>
    </div>
  );
}
