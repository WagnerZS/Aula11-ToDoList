import { useEffect, useRef, useState } from "react";
import { FundoLixeira } from "./FundoLixeira";

// Importe o arquivo JSON com as tarefas iniciais
import listaCompra from "../dataBase/listaCompra.json";

export function TaskList({ tasks, setTasks, tempTask, setTempTask }) {
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);
  const [swipingId, setSwipingId] = useState(null);
  const [swipeX, setSwipeX] = useState({});
  const inputRef = useRef(null);

  // Carrega as tarefas do arquivo local ao iniciar
  useEffect(() => {
    setTasks(listaCompra);
    setLoading(false);
    // eslint-disable-next-line
  }, [setTasks]);

  // Swipe-to-delete handlers
  const touchStartX = useRef({});

  const handleTouchStart = (e, id) => {
    setSwipingId(id);
    touchStartX.current[id] = e.touches ? e.touches[0].clientX : e.clientX;
    setSwipeX((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleTouchMove = (e, id) => {
    if (swipingId !== id) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = Math.min(0, clientX - touchStartX.current[id]);
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2; // 20%
    setSwipeX((prev) => ({
      ...prev,
      [id]: Math.max(deltaX, maxSwipe),
    }));
  };

  const handleTouchEnd = (id, e) => {
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2;
    let clientX;
    if (e && e.changedTouches && e.changedTouches[0]) {
      clientX = e.changedTouches[0].clientX;
    } else {
      clientX = touchStartX.current[id]; // fallback
    }
    const deltaX = Math.min(0, clientX - touchStartX.current[id]);
    if (deltaX <= maxSwipe + 5) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
    setSwipingId(null);
    setSwipeX((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleMouseDown = (e, id) => {
    if (e.button !== 0) return; // apenas botão esquerdo
    setSwipingId(id);
    touchStartX.current[id] = e.clientX;
    setSwipeX((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleMouseMove = (e, id) => {
    if (swipingId !== id) return;
    const clientX = e.clientX;
    const deltaX = Math.min(0, clientX - touchStartX.current[id]);
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2;
    setSwipeX((prev) => ({
      ...prev,
      [id]: Math.max(deltaX, maxSwipe),
    }));
  };

  const handleMouseUp = (id, e) => {
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2;
    const clientX = e ? e.clientX : touchStartX.current[id];
    const deltaX = Math.min(0, clientX - touchStartX.current[id]);
    if (deltaX <= maxSwipe + 5) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
    setSwipingId(null);
    setSwipeX((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleToggle = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Adicione listeners globais para mouse
  useEffect(() => {
    if (swipingId === null) return;

    const handleMove = (e) => {
      if (swipingId === null) return;
      // Mouse move
      if (e.type === "mousemove") {
        handleMouseMove(e, swipingId);
      }
      // Touch move
      if (e.type === "touchmove") {
        handleTouchMove(e, swipingId);
      }
    };

    const handleUp = (e) => {
      if (swipingId === null) return;
      if (e.type === "mouseup") {
        handleMouseUp(swipingId, e);
      }
      if (e.type === "touchend") {
        handleTouchEnd(swipingId, e);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [swipingId]);

  useEffect(() => {
    if (tempTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTask]);

  // Após qualquer alteração nas tarefas:
  useEffect(() => {
    if (!loading) {
      // Filtra tarefas definitivas (sem isTemp)
      const definitiveTasks = tasks.filter(t => !t.isTemp);
      fetch('https://glorious-adventure-7vjq4p6vwgvc4r-3001.app.github.dev/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(definitiveTasks),
      });
    }
  }, [tasks, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-red-700 text-lg">Carregando tarefas...</span>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto mt-4 sm:mt-8 pb-24 px-2 sm:px-0">
      <div className="relative">
        {tasks.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <span className="text-red-700 text-lg font-semibold">Lista vazia</span>
          </div>
        ) : (
          <ul
            className="bg-white rounded-lg shadow-lg divide-y divide-gray-400 border-2 border-red-700 overflow-hidden"
            ref={listRef}
          >
            {tasks.map((task, idx) => {
              const isSwiping = swipingId === task.id && (swipeX[task.id] || 0) !== 0;
              const translateX = isSwiping ? swipeX[task.id] || 0 : 0;

              return (
                <li
                  key={idx}
                  className={`relative select-none transition-colors overflow-hidden ${
                    task.completed ? "bg-gray-100" : ""
                  }`}
                  style={{
                    transition: "none",
                  }}
                  onTouchStart={(e) => handleTouchStart(e, task.id)}
                  onMouseDown={(e) => handleMouseDown(e, task.id)}
                >
                  {/* Fundo da lixeira */}
                  {isSwiping && (
                    <FundoLixeira width={Math.abs(translateX)} />
                  )}
                  {/* Conteúdo da tarefa */}
                  <div
                    className="flex-1 flex flex-col z-10 px-2 py-3 sm:px-4 bg-transparent"
                    style={{
                      transform: `translateX(${isSwiping ? translateX : 0}px)`,
                      transition: isSwiping ? "none" : "transform 0.2s",
                    }}
                  >
                    <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task.id)}
                        className="mr-2 sm:mr-3 accent-red-700"
                      />
                      {task.isTemp ? (
                        <input
                          ref={inputRef}
                          className="flex-1 px-2 py-1 border rounded outline-none text-sm sm:text-base"
                          value={task.title}
                          maxLength={50}
                          onChange={e => {
                            setTempTask({ ...task, title: e.target.value });
                            setTasks(prev =>
                              prev.map(t => t.id === task.id ? { ...t, title: e.target.value } : t)
                            );
                          }}
                          onKeyDown={e => {
                            if (e.key === "Enter" && task.title.trim()) {
                              setTasks(prev =>
                                prev.map(t =>
                                  t.id === task.id
                                    ? { ...t, isTemp: undefined }
                                    : t
                                )
                              );
                              setTempTask(null);
                            }
                            if (e.key === "Escape") {
                              setTasks(prev => prev.filter(t => t.id !== task.id));
                              setTempTask(null);
                            }
                          }}
                          onBlur={() => {
                            if (!task.title.trim()) {
                              setTasks(prev => prev.filter(t => t.id !== task.id));
                              setTempTask(null);
                            }
                          }}
                          placeholder="Digite a nova tarefa..."
                        />
                      ) : (
                        <span
                          className={`break-words whitespace-pre-line text-sm sm:text-base w-full block ${task.completed ? "line-through text-gray-400" : ""}`}
                          style={{ wordBreak: "break-word" }}
                        >
                          {task.title}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}