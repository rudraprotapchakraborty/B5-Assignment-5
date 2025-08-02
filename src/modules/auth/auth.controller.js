const User = require('../user/user.model');
const Wallet = require('../wallet/wallet.model');
const generateJWT = require('../../utils/generateJWT');

// Register User or Agent
exports.register = async (req, res) => {
  const { name, phone, password, role } = req.body;
  if(!['user','agent'].includes(role)) return res.status(400).json({ message: 'Role must be user or agent.' });
  // Check if already exists
  const exists = await User.findOne({ phone });
  if(exists) return res.status(400).json({ message: "Phone already registered" });

  const user = await User.create({ name, phone, password, role, isApproved: role === 'user' ? true : false });
  // Create wallet:
  const wallet = await Wallet.create({ user: user._id });
  res.status(201).json({ message: "Registered successfully", user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
};

// Login
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  if (!(await user.matchPassword(password))) return res.status(400).json({ message: "Invalid credentials" });
  if (!user.isApproved) return res.status(403).json({ message: "Your account is not approved yet." });
  const token = generateJWT(user._id, user.role);
  res.json({ token, role: user.role });
};
