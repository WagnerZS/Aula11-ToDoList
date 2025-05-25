import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TaskList } from "./components/TaskList";
import { BotaoInicio } from "./components/BotaoInicio";
import { NovaTarefa } from "./components/NovaTarefa";
import { useState } from "react";
import { LimparLista } from "./components/LimparLista";

function App() {
  const [tasks, setTasks] = useState([]);
  const [tempTask, setTempTask] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="fixed right-6 bottom-35 flex flex-col items-end gap-2 z-50">
        <LimparLista setTasks={setTasks} />
        <NovaTarefa tempTask={tempTask} setTempTask={setTempTask} setTasks={setTasks} />
        <BotaoInicio />
      </div>
      <TaskList tasks={tasks} setTasks={setTasks} tempTask={tempTask} setTempTask={setTempTask} />
      <Footer />
    </div>
  );
}

export default App;
