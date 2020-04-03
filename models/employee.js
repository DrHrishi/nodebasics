const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
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
    mobile: {
        type: Number,
        trim: true,
        required: true
    },
    dob: {
        type: Date,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    role: [{ role: String }],
    created: {
        type: Date,
        default: Date.now()
    },
    updated: Date,
})


module.exports = mongoose.model("Employee", employeeSchema);