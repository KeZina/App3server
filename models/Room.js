const { Schema, model } = require('mongoose');
// const jwt = require('jsonwebtoken');
// const config = require('config');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // token: {
    //     type: String,
    //     required: true
    // },
    url: {
        type: String,
        required: true
    }
})

roomSchema.methods.addUrl = function() {
    this.url = this._id;
}

// roomSchema.methods.addToken = async function() {
//     this.token = jwt.sign(
//         {
//             _id: this._id
//         },
//         config.get('jwtSecret')
//     )
    
//     await this.save();
// }

module.exports = model('Room', roomSchema);