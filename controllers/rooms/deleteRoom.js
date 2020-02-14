const Room = require('../../models/Room');

const deleteRoom = (data, ws) => {
    const {name} = data;

    await Room.deleteOne({name});

    ws.send(JSON.stringify({
        type: "",
    }))
}

module.exports = deleteRoom;