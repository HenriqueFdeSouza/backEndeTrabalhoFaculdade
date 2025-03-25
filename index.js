const express = require("express");
const cors = require("cors");
const Parse = require("parse/node");

Parse.initialize(
  "WDOggm5R4qPBWtQn3q891YSAzBqElBERSP8VjUsc",
  "DYDVLfBts9SJWQ2f6uORiX7S93bVlVdQbQBzngVL",
);
Parse.serverURL = "https://parseapi.back4app.com/";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.post("/produtos", async (req, res) => {
  const Produto = Parse.Object.extend("Produtos");
  const produto = new Produto();

  produto.set("nome", req.body.nome);
  produto.set("preco", req.body.preco);

  try {
    await produto.save();
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/produtos", async (req, res) => {
  const Produto = Parse.Object.extend("Produtos");
  const query = new Parse.Query(Produto);

  try {
    const results = await query.find();
    res.json(
      results.map((p) => ({
        id: p.id,
        nome: p.get("nome"),
        preco: p.get("preco"),
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um produto
app.put("/produtos/:id", async (req, res) => {
  const Produto = Parse.Object.extend("Produtos");
  const query = new Parse.Query(Produto);

  try {
    const produto = await query.get(req.params.id);
    produto.set("nome", req.body.nome);
    produto.set("preco", req.body.preco);
    await produto.save();
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar um produto
app.delete("/produtos/:id", async (req, res) => {
  const Produto = Parse.Object.extend("Produtos");
  const query = new Parse.Query(Produto);

  try {
    const produto = await query.get(req.params.id);
    await produto.destroy();
    res.json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
