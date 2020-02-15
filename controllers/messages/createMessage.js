const Message = require('../../models/Message');

const createMessage = async (data, ws) => {
    try {
        const {content, date, sender} = data;

        const message = new Message({
            content,
            date,
            sender
        })
        await message.save();

        ws.send(JSON.stringify({
            handler: 'message',
            type: 'createMessage',
            content: {id: message._id, content, date, sender},
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