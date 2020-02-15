const Room = require('../../models/Room');

const getRoom = async (data, ws) => {
    try {
        const {url} = data;

        const room = await Room.findById(url);

        if(room) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'getRoom',
                name: room.name,
                url,
                success: true
            }))
        } else if(!room) {
            throw new Error('Wrong url');
        }
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'createRoom',
            message: e,
            success: false
        }))
    }
}

module.exports = getRoom;