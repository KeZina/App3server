const Room = require('../../models/Room');

const deleteRoom = async (data, ws) => {
    try {
        const {url} = data;

        await Room.deleteOne({url});

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'deleteRoom',
            success: true
        }))
    } catch(e) {
        console.log(e)

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'deleteRoom',
            message: e,
            success: false
        }))
    }

}

module.exports = deleteRoom;