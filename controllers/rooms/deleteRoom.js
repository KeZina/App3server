const Room = require('../../models/Room');

const deleteRoom = async (data, ws) => {
    try {
        const {url} = data;

        await Room.deleteOne({url});

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'deleteRoom',
        }))
    } catch(e) {
        console.log(e)
    }

}

module.exports = deleteRoom;