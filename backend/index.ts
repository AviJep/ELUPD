import express from 'express';
import db, { resetDatabase } from './db';

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

// municipalities
app.get('/api/municipalities', (req, res) => {
  const stmt = db.prepare('SELECT * FROM municipalities');
  res.json(stmt.all());
});
app.post('/api/municipalities', (req, res) => {
  const { name, province_id, barangays = 0, status = 'active', lastUpdate = null } = req.body;
  const stmt = db.prepare(
    'INSERT INTO municipalities (name, province_id, barangays, status, lastUpdate) VALUES (?, ?, ?, ?, ?)'  
  );
  const info = stmt.run(name, province_id, barangays, status, lastUpdate);
  res.json({ id: info.lastInsertRowid });
});

// barangays
app.get('/api/barangays', (req, res) => {
  const stmt = db.prepare('SELECT * FROM barangays');
  res.json(stmt.all());
});
app.post('/api/barangays', (req, res) => {
  const { name, municipality_id, province_id, population = 0, status = 'active' } = req.body;
  const stmt = db.prepare(
    'INSERT INTO barangays (name, municipality_id, province_id, population, status) VALUES (?, ?, ?, ?, ?)'  
  );
  const info = stmt.run(name, municipality_id, province_id, population, status);
  res.json({ id: info.lastInsertRowid });
});

// compliance records
app.get('/api/compliance', (req, res) => {
  const stmt = db.prepare('SELECT * FROM compliance_records');
  res.json(stmt.all());
});
app.post('/api/compliance', (req, res) => {
  const { municipality_id = null, province_id = null, reportDate = null, status = null, officer = null } = req.body;
  const stmt = db.prepare(
    'INSERT INTO compliance_records (municipality_id, province_id, reportDate, status, officer) VALUES (?, ?, ?, ?, ?)'  
  );
  const info = stmt.run(municipality_id, province_id, reportDate, status, officer);
  res.json({ id: info.lastInsertRowid });
});

// archived records
app.get('/api/archives', (req, res) => {
  const stmt = db.prepare('SELECT * FROM archived_records');
  res.json(stmt.all());
});
app.post('/api/archives', (req, res) => {
  const { municipality, province, records = 0, archivedDate = null, reason = '' } = req.body;
  const stmt = db.prepare(
    'INSERT INTO archived_records (municipality, province, records, archivedDate, reason) VALUES (?, ?, ?, ?, ?)'  
  );
  const info = stmt.run(municipality, province, records, archivedDate, reason);
  res.json({ id: info.lastInsertRowid });
});

// system logs
app.get('/api/logs', (req, res) => {
  const stmt = db.prepare('SELECT * FROM system_logs ORDER BY timestamp DESC');
  res.json(stmt.all());
});
app.post('/api/logs', (req, res) => {
  const { timestamp = new Date().toISOString(), user = '', action = '', module = '', status = '', details = '' } = req.body;
  const stmt = db.prepare(
    'INSERT INTO system_logs (timestamp, user, action, module, status, details) VALUES (?, ?, ?, ?, ?, ?)'  
  );
  const info = stmt.run(timestamp, user, action, module, status, details);
  res.json({ id: info.lastInsertRowid });
});

// endpoint to reset / clear all database data
app.post('/api/reset-db', (req, res) => {
  try {
    resetDatabase();
    res.json({ status: 'ok', message: 'Database cleared' });
  } catch (err) {
    console.error('Failed to reset database', err);
    res.status(500).json({ status: 'error', message: 'Failed to reset database' });
  }
});

// choose a non-conflicting default port
const port = process.env.PORT || 3001;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
  console.log(`
You can access this API from other devices on the same network at:
  http://${getLocalIp()}:${port}
`);
});

function getLocalIp() {
  const os = require("os");
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
