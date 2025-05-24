import { useState } from "react";

export function NovaTarefa({ tasks, setTasks }) {
  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState("");

  const handleClick = () => {
    setEditando(true);
    setDescricao("");
  };

  const handleChange = (e) => setDescricao(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && descricao.trim()) {
      const maxId = tasks.length ? Math.max(...tasks.map((t) => t.id)) : 0;
      setTasks([
        ...tasks,
        {
          id: maxId + 1,
          title: descricao.trim(),
          completed: false,
        },
      ]);
      setEditando(false);
      setDescricao("");
    }
    if (e.key === "Escape") {
      setEditando(false);
      setDescricao("");
    }
  };

  if (editando) {
    return (
      <div className="fixed top-28 right-6 z-50 flex items-center gap-2 bg-white p-2 rounded shadow-lg">
        <input
          autoFocus
          type="text"
          className="border border-red-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
          placeholder="Digite a descrição e pressione Enter"
          value={descricao}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="text-red-700 hover:text-red-900 font-bold px-2"
          onClick={() => setEditando(false)}
          title="Cancelar"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-28 right-6 bg-black/70 text-white rounded-full p-4 shadow-lg hover:bg-black/90 transition-colors flex items-center justify-center text-2xl z-50"
      aria-label="Nova tarefa"
      title="Nova tarefa"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}