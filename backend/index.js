const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

// ─── API Endpoints ──────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Prisma/Node.js' });
});

// Get all LGUs with their related status and projects
app.get('/api/lgus', async (req, res) => {
  try {
    const lgus = await prisma.lGUDirectory.findMany({
      include: {
        clup_progress: true,
        pdpfp_status: true,
        housing_projects: true,
      },
    });
    res.json(lgus);
  } catch (error) {
    console.error('Failed to fetch LGUs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Simple reset database endpoint
app.post('/api/reset-db', async (req, res) => {
  try {
    res.json({ status: 'ok', message: 'Use node prisma/seed.js to reset data' });
  } catch (error) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 NIR Backend (Prisma) listening on http://localhost:${port}`);
});
