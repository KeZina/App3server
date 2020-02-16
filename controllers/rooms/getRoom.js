const Room = require('../../models/Room');


// FIX THIS
const getRoom = async (data, ws) => {
    try {
        const room = await Room.findById(data.url);

        if(room) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'getRoom',
                name: room.name,
                url: data.url,
                success: true
            }))
        } else if(!room) {
            throw new Error('Wrong url');
        }
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'getRoom',
            message: e,
            success: false
        }))
    }
}

module.exports = getRoom;