import { useState } from "react";

export function LimparLista({ setTasks }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setTasks([]);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-black/70 text-white rounded-full w-12 h-12 aspect-square shadow-lg hover:bg-black/90 transition-colors flex items-center justify-center z-50"
        aria-label="Limpar lista"
        title="Limpar lista"
      >
        {/* Ícone igual ao FundoLixeira */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3"
          />
        </svg>
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <span className="mb-4 text-lg text-red-700 font-semibold">
              Tem certeza que deseja limpar a lista?
            </span>
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
              >
                Sim
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}