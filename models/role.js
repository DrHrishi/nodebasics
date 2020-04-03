const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
})

module.exports = mongoose.model("Role", roleSchema);