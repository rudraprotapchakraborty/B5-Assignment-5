const User = require('../user/user.model');
const Wallet = require('../wallet/wallet.model');
const Transaction = require('../transaction/transaction.model');

// Cash-in: agent adds money to a user's wallet
exports.cashIn = async (req, res) => {
  const { phone, amount } = req.body;
  const amt = parseFloat(amount);
  if(!phone || !amt || amt<=0) return res.status(400).json({message:'Valid phone and positive amount required'});
  const user = await User.findOne({ phone, role: 'user' });
  if(!user) return res.status(404).json({message: 'User not found'});
  const wallet = await Wallet.findOne({ user: user._id });
  if(wallet.isBlocked) return res.status(403).json({message:'Wallet is blocked'});
  wallet.balance += amt;
  await wallet.save();

  // Record transaction (show commission as 1% agent bonus)
  const commission = amt * 0.01;
  await Transaction.create({ type: "cash_in", from: req.user._id, to: user._id, amount: amt, commission });
  
  res.json({ message: `Added ${amt} to ${user.phone}'s wallet (Commission granted: ${commission.toFixed(2)})` });
};

// Cash-out: agent withdraws from a user's wallet (deducts from user, hands cash to user)
exports.cashOut = async (req, res) => {
  const { phone, amount } = req.body;
  const amt = parseFloat(amount);
  if(!phone || !amt || amt<=0) return res.status(400).json({message:'Valid phone and positive amount required'});
  const user = await User.findOne({ phone, role: 'user' });
  if(!user) return res.status(404).json({ message: 'User not found' });
  const wallet = await Wallet.findOne({ user: user._id });
  if(wallet.isBlocked) return res.status(403).json({message:'Wallet is blocked'});
  if(wallet.balance < amt) return res.status(400).json({ message: 'Insufficient balance' });
  wallet.balance -= amt;
  await wallet.save();

  // Commission 1% for agent
  const commission = amt * 0.01;
  await Transaction.create({ type: 'cash_out', from: user._id, to: req.user._id, amount: amt, commission });

  res.json({ message: `Cash-out completed. Commission earned: ${commission.toFixed(2)}` });
};

// Agent: view own commission history (optional)
exports.commissionHistory = async (req, res) => {
  const txns = await Transaction.find({ 
    $or: [{ from: req.user._id }, { to: req.user._id }],
    commission: { $gt: 0 }
  }).sort({ createdAt: -1 });

  res.json({ count: txns.length, commissions: txns });
};
