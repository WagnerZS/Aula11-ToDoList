import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { NovaTarefa } from "./NovaTarefa";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  const handleToggle = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTasks(reordered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-red-700 text-lg">Carregando tarefas...</span>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto mt-8 pb-24">
      <div className="relative">
        <NovaTarefa
          onAdd={(descricao) => {
            setTasks((prev) => {
              const maxId = prev.length ? Math.max(...prev.map((t) => t.id)) : 0;
              return [
                ...prev,
                {
                  id: maxId + 1,
                  title: descricao,
                  completed: false,
                },
              ];
            });
          }}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul
                className="bg-white rounded-lg shadow-lg divide-y divide-gray-400 border-2 border-red-700 overflow-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, idx) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={idx}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center px-4 py-3 transition-colors ${
                          task.completed ? "bg-gray-100" : ""
                        } ${snapshot.isDragging ? "bg-red-100" : ""}`}
                        style={{
                          ...(task.completed && idx === 0
                            ? { borderTopLeftRadius: "0", borderTopRightRadius: "0" }
                            : {}),
                          ...(task.completed && idx === tasks.length - 1
                            ? { borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }
                            : {}),
                          ...provided.draggableProps.style,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggle(task.id)}
                          className="mr-3 accent-red-700"
                        />
                        <div className="flex-1 flex flex-col">
                          <span
                            className={`font-semibold ${
                              task.completed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            Tarefa {task.id}
                          </span>
                          <span
                            className={`text-sm ${
                              task.completed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </section>
  );
}