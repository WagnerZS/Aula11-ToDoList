import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TaskList } from "./components/TaskList";
import { BotaoInicio } from "./components/BotaoInicio";
import { NovaTarefa } from "./components/NovaTarefa"; // importe aqui
import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TaskList tasks={tasks} setTasks={setTasks} />
      </main>
      <NovaTarefa tasks={tasks} setTasks={setTasks} />
      <BotaoInicio />
      <Footer />
    </div>
  );
}

export default App;
