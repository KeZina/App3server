const Room = require('../../models/Room')

// const createMessage = async (data, ws) => {
//     try {
//         const {content, date, sender, url} = data;

//         const room = await Room.findById(url);
//         await room.addMessage(content, date, sender);



//         // ws.send(JSON.stringify({
//         //     handler: 'message',
//         //     type: 'createMessage',
//         //     content: {id: room._id, content, date, sender},
//         //     success: true
//         // }))
//     } catch(e) {
//         console.log(e);

//         ws.send(JSON.stringify({
//             handler: 'message',
//             type: 'createMessage',
//             message: e,
//             success: false
//         }))
//     }

// }

const createMessage = {
    messages: [],
    addMessage: async function(data){
        try {
            const {content, date, sender, roomUrl} = data;

            const room = await Room.findById(roomUrl);
            await room.addMessage(content, date, sender);

            this.messages = room.messages;
        } catch(e) {
            console.log(e);
        }
    },
    getMessage: function(){
        return this.messages;
    }
}


module.exports = createMessage;