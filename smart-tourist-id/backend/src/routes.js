const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const { aesEncryptPlaintext, rsaEncryptKey, generateRsaKeyPair, rsaDecryptKey, aesDecrypt } = require('./crypto');
const { storeAudit } = require('./eventListener');

const abiPath = path.join(__dirname, '..', 'abi', 'TouristID.json');
const ABI = fs.existsSync(abiPath) ? JSON.parse(fs.readFileSync(abiPath)) : null;

let provider, wallet, contract;

function initBlockchain(rpcUrl, privateKey, contractAddress){
  provider = new ethers.JsonRpcProvider(rpcUrl);
  wallet = new ethers.Wallet(privateKey, provider);
  if (ABI && contractAddress) contract = new ethers.Contract(contractAddress, ABI, wallet);
}

// In-memory RSA keys for simplicity (persist this in production)
const { publicKeyPem, privateKeyPem } = generateRsaKeyPair(2048);
console.log("Authority public key (PEM) preview:\n", publicKeyPem.slice(0, 200), "...");

router.post('/create', async (req, res) => {
  if (!contract) return res.status(500).send('contract not configured');
  try {
    const tourist = req.body;
    const plaintext = JSON.stringify(tourist);
    const { ciphertext, iv, tag, key } = aesEncryptPlaintext(plaintext);
    // blob = iv || tag || ciphertext
    const blob = Buffer.concat([iv, tag, ciphertext]);
    const encKey = rsaEncryptKey(publicKeyPem, key);

    const expiry = Math.floor(Date.now()/1000) + (tourist.durationDays || 7) * 24 * 3600;
    const initialScore = tourist.initialScore || 50;

    const tx = await contract.createRecord(blob, encKey, expiry, initialScore);
    const rcpt = await tx.wait?.();
    storeAudit( (await contract._idCounter?.()) || null, 'create', wallet.address, null, tx.hash ?? tx.transactionHash );
    res.json({ success: true, txHash: tx.hash ?? tx.transactionHash });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/update-score', async (req, res) => {
  if (!contract) return res.status(500).send('contract not configured');
  try {
    const { id, newScore } = req.body;
    const tx = await contract.updateScore(id, newScore);
    await tx.wait?.();
    storeAudit(id, 'updateScore', wallet.address, null, tx.hash ?? tx.transactionHash);
    res.json({ success: true, txHash: tx.hash ?? tx.transactionHash });
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

router.post('/request-emergency', async (req, res) => {
  if (!contract) return res.status(500).send('contract not configured');
  try {
    const { id, reason } = req.body;
    const tx = await contract.requestEmergencyAccess(id, reason);
    await tx.wait?.();
    storeAudit(id, 'requestEmergency', wallet.address, reason, tx.hash ?? tx.transactionHash);
    res.json({ success: true, txHash: tx.hash ?? tx.transactionHash });
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

router.get('/meta/:id', async (req, res) => {
  if (!contract) return res.status(500).send('contract not configured');
  try {
    const id = Number(req.params.id);
    const meta = await contract.getMeta(id);
    res.json({ meta });
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

// helper to init blockchain
router.post('/init', (req, res) => {
  const { rpcUrl, privateKey, contractAddress } = req.body;
  initBlockchain(rpcUrl, privateKey, contractAddress);
  res.json({ success: true });
});

module.exports = router;
