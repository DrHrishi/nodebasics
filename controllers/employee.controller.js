const Employee = require('../models/employee');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.createEmployee = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,
        async (err, fields, files) => {
            if (err) { return res.status(400).json({ error: "photo could not uploaded" }) }
            let emp = req.body;

            emp = _.extend(emp, fields)
            const employeeExist = await Employee.findOne({ email: emp.email })
            if (employeeExist) return res.status(403).json({ error: "Email is taken" });

            const employee = await new Employee(emp);

            if (files.photo) {
                employee.photo.data = fs.readFileSync(files.photo.path);
                employee.photo.contentType = files.photo.type
            }
            employee.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json(employee);
            })
        })
}

exports.employeeById = (req, res, next, id) => {
    Employee.findById(id)
        .exec((err, employee) => {
            if (err || !employee) {
                res.status(400).json({ error: 'Employee not found' });
            }
            req.profile = employee;
            next()
        })
}

exports.allEmployees = (req, res) => {
    Employee.find((err, employees) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.json({ status: 'success', employees: employees })
    }).select("name email mobile created")
}

exports.getEmployee = (req, res) => {
    return res.json(req.profile)
}

exports.updateEmployee = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,
        async (err, fields, files) => {
            if (err) { return res.status(400).json({ error: "photo could not uploaded" }) }
            let emp = req.body;
            emp = _.extend(emp, fields)

            let employee = await Employee.findOne({ _id: emp._id })
            if (!employee) return res.status(403).json({ error: "Employee Not found" });
            employee = _.extend(employee, emp)
            if (files.photo) {
                employee.photo.data = fs.readFileSync(files.photo.path);
                employee.photo.contentType = files.photo.type
            }

            employee.updated = Date.now()
            employee.save((err, update) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                update.photo = null;
                res.json(update);
            })
        })
}

exports.employeePhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("contentType", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next();
}


exports.removeEmployee = (req, res) => {
    let employee = req.profile;
    employee.remove((err, employee) => {
        if (err) return res.status(400).json({ error: err });
    });
    return res.json({ message: 'employee deleted successfully' })
}

