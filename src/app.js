const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Digital Wallet API Running!'));

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/wallet', require('./modules/wallet/wallet.routes'));
app.use('/api/agent', require('./modules/agent/agent.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));

// Error handler
const errorHandler = require('./utils/errorHandler');
app.use(errorHandler);

module.exports = app;
