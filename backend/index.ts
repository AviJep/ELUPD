import express from 'express';
import db from './db';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== API endpoints =====
app.get('/api/provinces', (req, res) => {
  const stmt = db.prepare('SELECT * FROM provinces');
  const rows = stmt.all();
  res.json(rows);
});

app.post('/api/provinces', (req, res) => {
  const { name, municipalities = 0, barangays = 0, status = 'active' } = req.body;
  const stmt = db.prepare(
    'INSERT INTO provinces (name, municipalities, barangays, status) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(name, municipalities, barangays, status);
  res.json({ id: info.lastInsertRowid });
});

// additional endpoints can be added here

// choose a non-conflicting default port
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});