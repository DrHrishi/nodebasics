const Role = require('../models/role');

exports.getAllRoles = (req, res) => {
    Role.find((err, roles) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        return res.json({ status: 'success', roles })
    }).select("role")
}

exports.addRoles = (req, res) => {
    if (req.body) {
        console.log(req.body.roles);
        if (req.body.roles) {
            let roles = req.body.roles.map(x => new Role({ role: x.role }))
            try {
                Role.insertMany(roles, { ordered: false }, (err, resp) => {
                    console.log(resp);
                    if (err) {
                        res.status(200).json({ success: true, status: `${err.result.nInserted} rocords inserted` })
                    } else {
                        res.status(200).json({ success: true, status: 'All records inserted' })
                    }
                })
            } catch (error) {
                res.status(200).json({ success: false, status: "error while saving" })
            }
        }
    } else {
        res.status(400).json({ success: false, message: "ssse" })
    }

}
