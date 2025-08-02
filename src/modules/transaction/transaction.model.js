const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['add_money', 'withdraw', 'send_money', 'cash_in', 'cash_out', 'commission'],
    required: true
  },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed', 'reversed'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
