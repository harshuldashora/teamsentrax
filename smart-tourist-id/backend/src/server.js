require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

// load ABI into backend/abi after compile
const ABI_DIR = path.join(__dirname, '..', 'abi');
if (!fs.existsSync(ABI_DIR)) fs.mkdirSync(ABI_DIR, { recursive: true });

const app = express();
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
