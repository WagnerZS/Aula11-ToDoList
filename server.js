import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 3001;

const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: 'https://WagnerZS.github.io'
}));
app.use(express.json());

// Schema e Model
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});
const Task = mongoose.model('produtos', taskSchema);

// Conexão com o MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro ao conectar:', err));

// GET /tasks - retorna todas as tarefas, mais recentes primeiro
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ _id: -1 }); // Mais recente primeiro
  res.json(tasks);
});

// POST /tasks - adiciona uma nova tarefa
app.post('/tasks', async (req, res) => {
  const task = { ...req.body };
  delete task._id; // Remove o _id se vier do frontend
  const newTask = await Task.create(task);
  res.json(newTask);
});

// PATCH /tasks/:id - atualiza um produto (ex: marcar como completa)
app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const updatedTask = await Task.findByIdAndUpdate(id, update, { new: true });
  if (!updatedTask) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  res.json(updatedTask);
});

// DELETE /tasks/:id - deleta uma tarefa pelo _id
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ status: 'deleted', id });
});

app.listen(PORT, '0.0.0.0', () => {
  //console.log(`Server running on http://localhost:${PORT}`);
});