const express = require('express');
const router = express.Router();
const controller = require('./agent.controller');
const auth = require('../../middlewares/authMiddleware');
const role = require('../../middlewares/roleMiddleware');

router.post('/cash-in', auth, role('agent'), controller.cashIn);
router.post('/cash-out', auth, role('agent'), controller.cashOut);
router.get('/commission', auth, role('agent'), controller.commissionHistory);

module.exports = router;
