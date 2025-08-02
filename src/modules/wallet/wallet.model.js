const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: parseFloat(process.env.START_BALANCE) || 50 },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
