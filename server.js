import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'https://glorious-adventure-7vjq4p6vwgvc4r-5173.app.github.dev'
}));
app.use(express.json());

app.get('/tasks', (req, res) => {
  const data = fs.readFileSync('./src/dataBase/listaCompra.json', 'utf-8');
  res.json(JSON.parse(data));
});

// Agora o POST simplesmente sobrescreve o arquivo com as tarefas recebidas, sem id
app.post('/tasks', (req, res) => {
  const incomingTasks = req.body;
  fs.writeFileSync('./src/dataBase/listaCompra.json', JSON.stringify(incomingTasks, null, 2));
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});