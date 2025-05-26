import { useEffect, useRef, useState } from "react";
import { FundoLixeira } from "./FundoLixeira";

const API_URL = 'https://mercado-6kjn.onrender.com/tasks';

export function TaskList({ tasks, setTasks, tempTask, setTempTask }) {
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);
  const [swipingId, setSwipingId] = useState(null);
  const [swipeX, setSwipeX] = useState({});
  const inputRef = useRef(null);

  // Carrega as tarefas do arquivo local ao iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line
  }, [setTasks]);

  // Swipe-to-delete handlers
  const touchStartX = useRef({});

  const handleTouchStart = (e, _id) => {
    setSwipingId(_id);
    touchStartX.current[_id] = e.touches ? e.touches[0].clientX : e.clientX;
    setSwipeX((prev) => ({ ...prev, [_id]: 0 }));
  };

  const handleTouchMove = (e, _id) => {
    if (swipingId !== _id) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = Math.min(0, clientX - touchStartX.current[_id]);
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2; // 20%
    setSwipeX((prev) => ({
      ...prev,
      [_id]: Math.max(deltaX, maxSwipe),
    }));
  };

  const handleTouchEnd = (_id, e) => {
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2;
    let clientX;
    if (e && e.changedTouches && e.changedTouches[0]) {
      clientX = e.changedTouches[0].clientX;
    } else {
      clientX = touchStartX.current[_id]; // fallback
    }
    const deltaX = Math.min(0, clientX - touchStartX.current[_id]);
    if (deltaX <= maxSwipe + 5) {
      handleDeleteTask(_id);
    }
    setSwipingId(null);
    setSwipeX((prev) => ({ ...prev, [_id]: 0 }));
  };

  const handleMouseDown = (e, _id) => {
    if (e.button !== 0) return; // apenas botão esquerdo
    setSwipingId(_id);
    touchStartX.current[_id] = e.clientX;
    setSwipeX((prev) => ({ ...prev, [_id]: 0 }));
  };

  const handleMouseMove = (e, _id) => {
    if (swipingId !== _id) return;
    const clientX = e.clientX;
    const deltaX = Math.min(0, clientX - touchStartX.current[_id]);
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2;
    setSwipeX((prev) => ({
      ...prev,
      [_id]: Math.max(deltaX, maxSwipe),
    }));
  };

  const handleMouseUp = (_id, e) => {
    const width = listRef.current?.offsetWidth || 1;
    const maxSwipe = -width * 0.2;
    const clientX = e ? e.clientX : touchStartX.current[_id];
    const deltaX = Math.min(0, clientX - touchStartX.current[_id]);
    if (deltaX <= maxSwipe + 5) {
      handleDeleteTask(_id);
    }
    setSwipingId(null);
    setSwipeX((prev) => ({ ...prev, [_id]: 0 }));
  };

  const handleToggle = async (_id) => {
    // Atualiza visualmente no frontend imediatamente
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === _id ? { ...task, completed: !task.completed } : task
      )
    );
    // Envia para o backend (não espera resposta)
    fetch(API_URL + '/' + _id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !tasks.find(t => t._id === _id).completed }),
    });
  };

  const handleDeleteTask = async (_id) => {
    // Remove visualmente no frontend imediatamente
    setTasks((prev) => prev.filter((t) => t._id !== _id));
    // Envia para o backend (não espera resposta)
    fetch(API_URL + '/' + _id, {
      method: 'DELETE',
    });
  };

  const handleAddTask = async (task) => {
    // Remove _id se existir (por segurança)
    const { _id, ...taskWithoutId } = task;
    // Cria uma tarefa temporária para feedback instantâneo
    const tempTask = { ...taskWithoutId, isTemp: true, _id: Math.random().toString(36).slice(2) };
    setTasks((prev) => [tempTask, ...prev]);
    setTempTask(null);

    // Envia para o backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskWithoutId),
    });
    const newTask = await response.json();
    // Substitui a tarefa temporária pela definitiva do backend
    setTasks((prev) => [newTask, ...prev.filter(t => t._id !== tempTask._id)]);
  };

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

  // Atualização automática das tarefas a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(API_URL)
        .then(res => res.json())
        .then(serverTasks => {
          setTasks(prev => {
            // Mantém as tarefas temporárias (isTemp)
            const tempTasks = prev.filter(t => t.isTemp);
            // Remove duplicatas (caso id já exista no server)
            const filteredServerTasks = serverTasks.filter(
              st => !tempTasks.some(tt => tt.id === st.id)
            );
            // Junta: temporárias no topo, depois as do servidor
            return [...tempTasks, ...filteredServerTasks];
          });
        });
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [setTasks]);

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
              const isSwiping = swipingId === task._id && (swipeX[task._id] || 0) !== 0;
              const translateX = isSwiping ? swipeX[task._id] || 0 : 0;

              return (
                <li
                  key={task._id || idx}
                  className={`relative select-none transition-colors overflow-hidden ${
                    task.completed ? "bg-gray-100" : ""
                  }`}
                  style={{
                    transition: "none",
                  }}
                  onTouchStart={(e) => handleTouchStart(e, task._id)}
                  onMouseDown={(e) => handleMouseDown(e, task._id)}
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
                        onChange={() => handleToggle(task._id)}
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
                              prev.map(t => t._id === task._id ? { ...t, title: e.target.value } : t)
                            );
                          }}
                          onKeyDown={async e => {
                            if (e.key === "Enter" && task.title.trim()) {
                              // Remove a tarefa temporária e limpa o input imediatamente (UX instantânea)
                              const tempId = task._id;
                              setTasks(prev => prev.filter(t => t._id !== tempId));
                              setTempTask(null);

                              // Envia para o backend e adiciona a tarefa definitiva quando chegar a resposta
                              const { _id, ...taskWithoutId } = task;
                              const response = await fetch(API_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(taskWithoutId),
                              });
                              const newTask = await response.json();
                              setTasks(prev => [newTask, ...prev]);
                            }
                            if (e.key === "Escape") {
                              setTasks(prev => prev.filter(t => t._id !== task._id));
                              setTempTask(null);
                            }
                          }}
                          onBlur={() => {
                            if (!task.title.trim()) {
                              setTasks(prev => prev.filter(t => t._id !== task._id));
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