import React from "react";
import LoaderTruck from "./LoaderTruck";
import LoaderBall from "./LoaderBall";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      {/* Container principal para o conteúdo centralizado (seu caminhão) */}
      <div className="flex flex-col items-center justify-center">
        {/* Seu componente LoaderTruck (o caminhão) */}
        <LoaderTruck />
        <LoaderBall />
      </div>
      <img
        src="/logo-loading.png" // Use o caminho correto para a sua logo
        alt="Stock360 Logo"
        className="absolute bottom-4 right-4 w-60 h-auto" // w-16 para tamanho pequeno, bottom-4 e right-4 para posicionamento
      />
    </div>
  );
}

export default LoadingScreen;
