const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
})

userSchema.methods.addToken = function() {
    this.token = jwt.sign(
        {
            _id: this._id
        },
        config.get('jwtSecret'),
        {
            expiresIn: '12h'
        }
    )
    
    this.save();
}

module.exports = model('User', userSchema);