import React, { useState } from "react";
import Chart from "react-apexcharts";
import Modal from "./ModalGrafico";

export default function ResumoEstoque({ produtos }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter((p) => p.quantidade <= 5).length;
  const unidadesEstoque = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  // Gráfico 1: Estoque Baixo
  const getEstoqueBaixoOptions = () => ({
    chart: { id: "estoque-baixo-donut" },
    labels: ["Estoque Normal", "Estoque Baixo"],
    legend: { position: "bottom" },
    tooltip: { y: { formatter: (val) => `${val} produtos` } },
  });

  const getEstoqueBaixoSeries = () => {
    const estoqueNormal = totalProdutos - estoqueBaixo;
    return [estoqueNormal, estoqueBaixo];
  };

  // Gráfico 2: Top Produtos (barras coloridas)
  const getTopProdutosData = () => {
    const topProdutos = [...produtos]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    return {
      options: {
        chart: { id: "top-produtos-bar" },
        xaxis: {
          categories: topProdutos.map((p) => p.nome),
          labels: { show: false },
        },
        plotOptions: {
          bar: {
            distributed: true,
          },
        },
        colors: [
          "#4F46E5",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#3B82F6",
          "#10B981",
          "#E11D48",
          "#8B5CF6",
          "#EC4899",
          "#14B8A6",
        ],
        tooltip: { y: { formatter: (val) => `${val} unidades` } },
        legend: { show: false },
      },
      series: [
        {
          name: "Unidades",
          data: topProdutos.map((p) => p.quantidade),
        },
      ],
    };
  };

  // Modal
  const openModal = (type) => {
    let content;
    let title = "";
    let chartHeight = 280;

    switch (type) {
      case "estoqueBaixo":
        content = (
          <Chart
            options={getEstoqueBaixoOptions()}
            series={getEstoqueBaixoSeries()}
            type="donut"
            height={chartHeight}
          />
        );
        title = "Gráfico: Produtos com Estoque Baixo";
        break;

      case "topProdutos":
        const topData = getTopProdutosData();
        content = (
          <Chart
            options={topData.options}
            series={topData.series}
            type="bar"
            height={chartHeight + 40}
          />
        );
        title = "Gráfico: Top 10 Produtos com Mais Unidades";
        break;

      default:
        content = <p>Nenhum gráfico disponível para esta opção.</p>;
        title = "Informação";
    }

    setModalContent(content);
    setModalTitle(title);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
    setModalTitle("");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-blue-600 text-white p-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={() => openModal("topProdutos")}
        >
          <p className="text-xl font-semibold">Total de Produtos</p>
          <h2 className="text-2xl font-bold">{totalProdutos}</h2>
        </div>

        <div
          className="bg-orange-500 text-white p-4 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
          onClick={() => openModal("estoqueBaixo")}
        >
          <p className="text-xl font-semibold">Estoque Baixo</p>
          <h2 className="text-2xl font-bold">{estoqueBaixo}</h2>
        </div>

        <div
          className="bg-green-600 text-white p-4 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
          onClick={() => openModal("unidadesEstoque")}
        >
          <p className="text-xl font-semibold">Unidades de Estoque</p>
          <h2 className="text-2xl font-bold">{unidadesEstoque}</h2>
        </div>
      </div>

      <Modal show={showModal} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </>
  );
}
