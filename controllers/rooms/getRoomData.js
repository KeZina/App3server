const Room = require('../../models/Room');

const getRoomData = async (data, ws) => {
    try {
        const {url} = data;

        const room = await Room.findById(url);

        if(room) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'getRoomData',
                name: room.name,
                url,
                success: true
            }))
        } else if(!room) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'getRoomData',
                success: false
            }))
        }
    } catch(e) {
        console.log(e);
    }
}

module.exports = getRoomData;