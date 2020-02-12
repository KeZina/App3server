const http = require ('http');
const config = require('config');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

const server = http.createServer();
const wss = new WebSocket.Server({server});

wss.on('connection', ws => {
    ws.on('message', message => {
        ws.send(message);
    })

    ws.send('hi from websocket :>');
})

const start = async () => {
    try {
        await mongoose.connect(
            dbUrl,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
        server.listen(port);

        console.log(`connection success on port ${port}`)

    } catch(e) {
        console.log(`connection error, ${e}`)
        server.close(e)
    }
}

start();