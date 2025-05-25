import { useRef } from "react";

export function NovaTarefa({ tempTask, setTempTask, setTasks }) {

  const handleAddClick = () => {
    if (tempTask) return; // já existe uma tarefa temporária
    const newTask = {
      id: `temp-${Date.now()}`,
      title: "",
      completed: false,
      isTemp: true,
    };
    setTempTask(newTask);
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <button
      onClick={handleAddClick}
      disabled={!!tempTask}
      className="bg-black/70 text-white rounded-full w-12 h-12 aspect-square shadow-lg hover:bg-black/90 transition-colors flex items-center justify-center z-50"
      aria-label="Nova tarefa"
      title="Nova tarefa"
    >
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
          d="M12 5v14m7-7H5"
        />
      </svg>
    </button>
  );
}