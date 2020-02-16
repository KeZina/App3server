const Room = require('../../models/Room')

const createMessage = async (data, ws) => {
    try {
        const {content, date, sender, url} = data;

        const room = await Room.findById(url);
        await room.addMessage(content, date, sender);

        ws.send(JSON.stringify({
            handler: 'message',
            type: 'createMessage',
            content: {id: room._id, content, date, sender},
            success: true
        }))
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'message',
            type: 'createMessage',
            message: e,
            success: false
        }))
    }

}

module.exports = createMessage;