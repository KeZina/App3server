const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

roomSchema.methods.addUrl = function() {
    this.url = this._id;
}

module.exports = model('Room', roomSchema);