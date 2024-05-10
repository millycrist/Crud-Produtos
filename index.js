const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/nomeDoSeuBanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

const produtoSchema = new mongoose.Schema({
  nome: String,
  preco: Number
});
const Produto = mongoose.model('Produto', produtoSchema);

// Rotas CRUD
// Criar um produto
app.post('/produtos', async (req, res) => {
  try {
    const novoProduto = await Produto.create(req.body);
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ler todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ler um produto por ID
app.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }
    res.send(produto);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Atualizar um produto por ID
app.put('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }
    res.send(produto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar um produto por ID
app.delete('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).send('Produto não encontrado');
    }
    res.send(produto);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
