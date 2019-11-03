const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'Google User ID is required']
    },
    givenName: {
        type: String,
        required: [true, 'Given (first) name is required']
    },
    familyName: {
        type: String,
        required: [true, 'Family (last) name is required']
    }
});

module.exports = userSchema;