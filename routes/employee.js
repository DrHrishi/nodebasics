const express = require('express');
const {
    employeeById, allEmployees, getEmployee, updateEmployee,
    employeePhoto, removeEmployee, createEmployee
} = require('../controllers/employee.controller');
const { requireSignin } = require('../controllers/auth');
const router = express.Router();

router.post('/create/employees',requireSignin, createEmployee);
router.get('/employees/all', allEmployees);
router.get('/employee/:employeeId', requireSignin, getEmployee);
router.put('/employee', requireSignin, updateEmployee);
router.delete('/employee/:employeeId', requireSignin, removeEmployee);
router.get('/employee/photo/:employeeId', employeePhoto);
router.param('employeeId', employeeById)

module.exports = router;
