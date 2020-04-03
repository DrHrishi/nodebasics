const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .exec((err, user) => {
            if (err || !user) {
                res.status(400).json({ error: 'user not found' });
            }
            req.profile = user;
            next()
        })
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized) return res.status(403).json({ error: 'user is not authorized to perform this action' });
}
exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        res.json(users)
    }).select("name email updated created")

}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.hashed_password = undefined;
    return res.json(req.profile)
}

exports.updateUser = (req, res, next) => {
    console.log("inusercntrl")
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,
        (err, fields, files) => {
            if (err) { return res.status(400).json({ error: "photo could not uploaded" }) }
            let user = req.profile;
            user = _.extend(user, fields)
            user.uploaded = Date.now();

            if (files.photo) {
                user.photo.data = fs.readFileSync(files.photo.path);
                user.photo.contentType = files.photo.type
            }
            user.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                user.hashed_password = undefined;
                user.salt = undefined;
                res.json(user);
            })
        })
}

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("contentType", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next();
}


exports.removeUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) return res.status(400).json({ error: err });
    });
    return res.json({ message: 'user deleted successfully' })
}

