const User = require('../user/user.model');
const Wallet = require('../wallet/wallet.model');
const Transaction = require('../transaction/transaction.model');

// View all users/agents
exports.listUsers = async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('-password');
  res.json(users);
};

// View all wallets
exports.listWallets = async (req, res) => {
  const wallets = await Wallet.find().populate('user', 'name phone role');
  res.json(wallets);
};

// View all transactions
exports.listTransactions = async (req, res) => {
  const txns = await Transaction.find().sort({ createdAt: -1 }).populate('from to', 'name phone role');
  res.json(txns);
};

// Block/unblock wallet
exports.blockWallet = async (req, res) => {
  const { id } = req.params;
  const wallet = await Wallet.findById(id);
  if(!wallet) return res.status(404).json({ message: "Wallet not found" });
  wallet.isBlocked = true;
  await wallet.save();
  res.json({ message: "Wallet blocked" });
};
exports.unblockWallet = async (req, res) => {
  const { id } = req.params;
  const wallet = await Wallet.findById(id);
  if(!wallet) return res.status(404).json({ message: "Wallet not found" });
  wallet.isBlocked = false;
  await wallet.save();
  res.json({ message: "Wallet unblocked" });
};

// Approve/suspend agents
exports.approveAgent = async (req, res) => {
  const { id } = req.params;
  const agent = await User.findOne({ _id: id, role: 'agent' });
  if(!agent) return res.status(404).json({ message: 'Agent not found' });
  agent.isApproved = true;
  await agent.save();
  res.json({ message: 'Agent approved' });
};
exports.suspendAgent = async (req, res) => {
  const { id } = req.params;
  const agent = await User.findOne({ _id: id, role: 'agent' });
  if(!agent) return res.status(404).json({ message: 'Agent not found' });
  agent.isApproved = false;
  await agent.save();
  res.json({ message: 'Agent suspended' });
};
