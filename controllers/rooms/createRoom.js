const Room = require('../../models/Room');

const createRoom = async (data, ws) => {
    try {
        const {name} = data;
        const nameIsTaken = await Room.findOne({name});

        if(nameIsTaken) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'createRoom',
                success: false,
                message: 'name is already exists'
            }))
        } else if (!nameIsTaken) {
            const room = new Room({
                name,
                // token: '',
                url: ''
            })

            room.addUrl();
            await room.save();
            // await room.addToken();

            ws.send(JSON.stringify({
                handler: 'room',
                type: 'createRoom',
                success: true,
                name,
                token: room.token,
                url: room.url
            }))
        }
    } catch(e) {
        console.log(e); 
    }

}

module.exports = createRoom;