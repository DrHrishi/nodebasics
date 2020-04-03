const express = require('express');
const {
    addRoles, getAllRoles
} = require('../controllers/role.controller');
const { requireSignin } = require('../controllers/auth');
const router = express.Router();

router.post('/addroles', requireSignin, addRoles);
router.get('/getroles', getAllRoles);

module.exports = router;
