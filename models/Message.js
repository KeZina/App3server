const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
})

// messageSchema.methods.addUrl = function() {
//     this.url = this._id;
// }

module.exports = model('Message', messageSchema);