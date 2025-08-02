const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');
const auth = require('../../middlewares/authMiddleware');
const role = require('../../middlewares/roleMiddleware');

router.get('/users', auth, role('admin'), controller.listUsers);
router.get('/wallets', auth, role('admin'), controller.listWallets);
router.get('/transactions', auth, role('admin'), controller.listTransactions);

router.patch('/wallets/block/:id', auth, role('admin'), controller.blockWallet);
router.patch('/wallets/unblock/:id', auth, role('admin'), controller.unblockWallet);

router.patch('/agents/approve/:id', auth, role('admin'), controller.approveAgent);
router.patch('/agents/suspend/:id', auth, role('admin'), controller.suspendAgent);

module.exports = router;
