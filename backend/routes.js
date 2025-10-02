import { Router } from 'express';
import sql from './bd.js';

const router = Router();



router.get('/fornecedores', async (req, res) => {
  try {
    const fornecedores = await sql`SELECT * FROM fornecedores ORDER BY id_fornecedor ASC`;
    res.json(fornecedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/fornecedores', async (req, res) => {
  const { nome, cnpj, telefone, endereco } = req.body;
  try {
    const [novo] = await sql`
      INSERT INTO fornecedores (nome, cnpj, telefone, endereco)
      VALUES (${nome}, ${cnpj}, ${telefone}, ${endereco})
      RETURNING *`;
    res.json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/fornecedores/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, telefone, endereco } = req.body;
  try {
    const [atualizado] = await sql`
      UPDATE fornecedores
      SET nome=${nome}, cnpj=${cnpj}, telefone=${telefone}, endereco=${endereco}
      WHERE id_fornecedor=${id}
      RETURNING *`;
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/fornecedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM fornecedores WHERE id_fornecedor=${id}`;
    res.json({ message: "Fornecedor removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/produtos', async (req, res) => {
  try {
    const produtos = await sql`SELECT * FROM produtos ORDER BY id_produto ASC`;
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/produtos', async (req, res) => {
  const { nome, descricao, quantidade, categoria, preco } = req.body;
  try {
    const [novo] = await sql`
      INSERT INTO produtos (nome, descricao, quantidade, categoria, preco)
      VALUES (${nome}, ${descricao}, ${quantidade}, ${categoria}, ${preco})
      RETURNING *`;
    res.json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, quantidade, categoria, preco } = req.body;
  try {
    const [atualizado] = await sql`
      UPDATE produtos
      SET nome=${nome}, descricao=${descricao}, quantidade=${quantidade}, categoria=${categoria}, preco=${preco}
      WHERE id_produto=${id}
      RETURNING *`;
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM produtos WHERE id_produto=${id}`;
    res.json({ message: "Produto removido" });
  } catch (err) {
    if (err.message.includes("violates foreign key")) {
      return res.status(400).json({ error: "Não é possível deletar produto que possui entradas." });
    }
    res.status(500).json({ error: err.message });
  }
});



router.get('/entradas', async (req, res) => {
  try {
    const entradas = await sql`
      SELECT e.id_entrada, e.data, e.quantidade, f.nome AS fornecedor, p.nome AS produto
      FROM entradas e
      JOIN fornecedores f ON f.id_fornecedor = e.id_fornecedor
      JOIN produtos p ON p.id_produto = e.id_produto
      ORDER BY e.id_entrada ASC`;
    res.json(entradas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/entradas', async (req, res) => {
  const { data, quantidade, id_fornecedor, id_produto } = req.body;
  try {
    const [nova] = await sql`
      INSERT INTO entradas (data, quantidade, id_fornecedor, id_produto)
      VALUES (${data}, ${quantidade}, ${id_fornecedor}, ${id_produto})
      RETURNING *`;
    res.json(nova);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
