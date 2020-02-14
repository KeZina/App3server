const Room = require('../../models/Room');

const createRoom = async(data, ws) => {
    try {
        const {name} = data;
        const nameIsTaken = await Room.findOne({name});

        if(nameIsTaken) {
            ws.send(JSON.stringify({
                type: "",
                message: "name is already exists"
            }))
        } else if (!nameIsTaken) {
            const room = new Room({
                name
            })
            await room.save();

            ws.send(JSON.stringify({
                type: "",
                name,
                // url ???
            }))
        }
    } catch(e) {
        console.log(e); 
    }

}

module.exports = createRoom;