export default function CheckStockButton({ abrirModal }) {
  return (
    <button
      onClick={abrirModal}
      className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded shadow"
    >
      Check Stock
    </button>
  );
}
