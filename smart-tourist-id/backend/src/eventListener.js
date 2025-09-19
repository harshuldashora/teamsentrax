const db = require('./db');

function storeAudit(recordId, action, who, reason, txHash){
  const ts = Math.floor(Date.now()/1000);
  const stmt = db.prepare('INSERT INTO audits (recordId, action, who, reason, txHash, ts) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(recordId, action, who, reason || null, txHash || null, ts);
}

module.exports = { storeAudit };
