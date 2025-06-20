import React from "react";

const ModalGrafico = ({ show, onClose, children, title }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative dark:bg-gray-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-2xl font-bold"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalGrafico;
