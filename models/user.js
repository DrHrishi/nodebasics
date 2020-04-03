const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now()
    },
    updated: Date,
})

// virtualField
userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        //generate timestamp with npms uuid pack
        this.salt = uuidv1()
        // encrypt password
        this.hashed_password = this.encryptPassword(password)

    })
    .get(function () { return this._password })

// Adding methods
userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
        } catch (error) {
            return '';
        }
    }
}

module.exports = mongoose.model("user", userSchema);