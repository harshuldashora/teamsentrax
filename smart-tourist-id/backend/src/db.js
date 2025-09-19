const Database = require('better-sqlite3');
const db = new Database('backend_data.db');

// init tables
db.prepare(`CREATE TABLE IF NOT EXISTS audits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recordId INTEGER,
  action TEXT,
  who TEXT,
  reason TEXT,
  txHash TEXT,
  ts INTEGER
)`).run();

module.exports = db;
