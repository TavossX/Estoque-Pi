// components/ResumoEstoque.jsx
import React, { useState } from "react";
import Chart from "react-apexcharts";
import Modal from "./ModalGrafico"; // Ajuste o caminho se necessário

export default function ResumoEstoque({ produtos }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter((p) => p.quantidade <= 5).length;
  const unidadesEstoque = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  // --- Funções para gerar dados do gráfico ---

  const getProdutoOptions = () => {
    return {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: ["Total de Produtos"],
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      title: {
        text: "Visão Geral dos Produtos",
        align: "left",
      },
    };
  };

  const getProdutoSeries = () => {
    return [
      {
        name: "Produtos",
        data: [totalProdutos],
      },
    ];
  };

  const getEstoqueBaixoOptions = () => {
    return {
      chart: {
        id: "estoque-baixo-donut",
      },
      labels: ["Em Estoque Normal", "Em Estoque Baixo"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      title: {
        text: "Produtos com Estoque Baixo",
        align: "left",
      },
    };
  };

  const getEstoqueBaixoSeries = () => {
    const estoqueNormal = totalProdutos - estoqueBaixo;
    return [estoqueNormal, estoqueBaixo];
  };

  const getUnidadesEstoqueOptions = () => {
    // Para este gráfico, vamos mostrar a quantidade de cada produto individualmente, se houver dados suficientes.
    // Ou uma visão geral por tipo de produto, se você tiver essa categoria.
    // Por simplicidade, farei um gráfico de barras com os 5 produtos com mais unidades.
    const sortedProducts = [...produtos].sort(
      (a, b) => b.quantidade - a.quantidade
    );
    const top5Products = sortedProducts.slice(0, 5);

    return {
      chart: {
        id: "unidades-estoque-bar",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: top5Products.map((p) => p.nome || `Produto ${p.id}`), // Assumindo que seu produto tem 'nome' ou 'id'
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          distributed: true, // Cores diferentes para cada barra
        },
      },
      title: {
        text: "Top 5 Produtos por Unidades em Estoque",
        align: "left",
      },
    };
  };

  const getUnidadesEstoqueSeries = () => {
    const sortedProducts = [...produtos].sort(
      (a, b) => b.quantidade - a.quantidade
    );
    const top5Products = sortedProducts.slice(0, 5);

    return [
      {
        name: "Unidades",
        data: top5Products.map((p) => p.quantidade),
      },
    ];
  };

  // --- Funções para abrir o modal ---

  const openModal = (type) => {
    let content;
    let title = "";
    switch (type) {
      case "totalProdutos":
        content = (
          <Chart
            options={getProdutoOptions()}
            series={getProdutoSeries()}
            type="bar"
            height={250}
          />
        );
        title = "Gráfico: Total de Produtos";
        break;
      case "estoqueBaixo":
        content = (
          <Chart
            options={getEstoqueBaixoOptions()}
            series={getEstoqueBaixoSeries()}
            type="donut"
            height={250}
          />
        );
        title = "Gráfico: Produtos com Estoque Baixo";
        break;
      case "unidadesEstoque":
        content = (
          <Chart
            options={getUnidadesEstoqueOptions()}
            series={getUnidadesEstoqueSeries()}
            type="bar"
            height={250}
          />
        );
        title = "Gráfico: Unidades de Estoque";
        break;
      default:
        content = <p>Nenhum gráfico disponível.</p>;
        break;
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
          onClick={() => openModal("totalProdutos")}
        >
          <p>Total de Produtos</p>
          <h2 className="text-2xl font-bold">{totalProdutos}</h2>
        </div>
        <div
          className="bg-orange-500 text-white p-4 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors"
          onClick={() => openModal("estoqueBaixo")}
        >
          <p>Estoque Baixo</p>
          <h2 className="text-2xl font-bold">{estoqueBaixo}</h2>
        </div>
        <div
          className="bg-green-600 text-white p-4 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
          onClick={() => openModal("unidadesEstoque")}
        >
          <p>Unidades de Estoque</p>
          <h2 className="text-2xl font-bold">{unidadesEstoque}</h2>
        </div>
      </div>

      <Modal show={showModal} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </>
  );
}
