const Message = require('../../models/Message');

const getMessage = async (data, ws) => {
    try {
        const data = await Message.find({});

        const content = data.map(item => {
            return {id: item._id, content: item.content, date: item.date, sender: item.sender};
        })

        ws.send(JSON.stringify({
            handler: 'message',
            type: 'getMessage',
            content,
            success: true
        }))
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'message',
            type: 'getMessage',
            message: e,
            success: false
        }))
    }

}

module.exports = getMessage;