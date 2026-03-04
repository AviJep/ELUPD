import Database from 'better-sqlite3';
import path from 'path';

// create/open sqlite database in project folder
const dbPath = path.join(__dirname, 'data.sqlite');
const db = new Database(dbPath);

// initialize required tables if not exists
function init() {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS provinces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      municipalities INTEGER DEFAULT 0,
      barangays INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS municipalities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      province_id INTEGER NOT NULL,
      barangays INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      lastUpdate TEXT,
      FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS barangays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      municipality_id INTEGER NOT NULL,
      province_id INTEGER NOT NULL,
      population INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE CASCADE,
      FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS compliance_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      municipality_id INTEGER,
      province_id INTEGER,
      reportDate TEXT,
      status TEXT,
      officer TEXT,
      FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
      FOREIGN KEY (province_id) REFERENCES provinces(id)
    );

    CREATE TABLE IF NOT EXISTS archived_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      municipality TEXT,
      province TEXT,
      records INTEGER,
      archivedDate TEXT,
      reason TEXT
    );

    CREATE TABLE IF NOT EXISTS system_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      user TEXT,
      action TEXT,
      module TEXT,
      status TEXT,
      details TEXT
    );
  `);
}

init();

export default db;
