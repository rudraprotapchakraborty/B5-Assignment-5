const Wallet = require('./wallet.model');
const Transaction = require('../transaction/transaction.model');
const User = require('../user/user.model');

exports.getMyWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  res.json(wallet);
};

// Add money (user can add money to their own wallet)
exports.addMoney = async (req, res) => {
  const amount = parseFloat(req.body.amount);
  if (amount<=0) return res.status(400).json({ message: "Amount must be positive" });

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet || wallet.isBlocked) return res.status(403).json({ message: "Wallet is blocked" });
  wallet.balance += amount;
  await wallet.save();

  // Track txn
  await Transaction.create({ type: 'add_money', to: req.user._id, amount });

  res.json({ message: "Money added successfully", balance: wallet.balance });
};

// Withdraw (user)
exports.withdraw = async (req, res) => {
  const amount = parseFloat(req.body.amount);
  if (amount<=0) return res.status(400).json({ message: "Amount must be positive" });

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet || wallet.isBlocked) return res.status(403).json({ message: "Wallet is blocked" });
  if(wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({ type: 'withdraw', from: req.user._id, amount });
  res.json({ message: "Withdrawal successful", balance: wallet.balance });
};

// Send Money to another user
exports.sendMoney = async (req, res) => {
  const amount = parseFloat(req.body.amount);
  const { receiverPhone } = req.body;
  if (amount<=0) return res.status(400).json({ message: "Amount must be positive" });

  // Find receiver
  const receiver = await User.findOne({ phone: receiverPhone, role: 'user' });
  if(!receiver) return res.status(404).json({ message: "Receiver not found" });
  
  // Self transfer
  if(receiver._id.equals(req.user._id)) return res.status(400).json({ message: "Cannot send money to self" });

  // Both wallets (sender and receiver)
  const senderWallet = await Wallet.findOne({ user: req.user._id });
  if(!senderWallet || senderWallet.isBlocked) return res.status(403).json({ message: "Your wallet is blocked" });

  // Blocked recipient
  const receiverWallet = await Wallet.findOne({ user: receiver._id });
  if(receiverWallet.isBlocked) return res.status(403).json({ message: "Target wallet is blocked" });

  if(senderWallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  const [tx1, tx2] = await Promise.all([
    senderWallet.save(),
    receiverWallet.save(),
    Transaction.create({ type: "send_money", from: req.user._id, to: receiver._id, amount })
  ]);
  res.json({ message: `Sent ${amount} to ${receiver.phone}. Your balance: ${senderWallet.balance}` });
};

// Get Transaction history
exports.getMyTransactions = async (req, res) => {
  // Show all transactions where user is involved
  const txns = await Transaction.find({
    $or: [{ from: req.user._id }, { to: req.user._id }],
  }).sort({ createdAt: -1 });
  res.json(txns);
};
