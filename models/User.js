const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            requried: true,
            unique: true,
        },
        password: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
    },
    { timestamps: { createdAt: 'created_at' } }
);

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
