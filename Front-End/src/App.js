import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stock from "./Components/Stock";
import Auth from "./Pages/Auth.jsx";
import "boxicons/css/boxicons.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/stock" element={<Stock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
