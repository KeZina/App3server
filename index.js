const http = require ('http');
const config = require('config');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const createTemp = require('./controllers/usersAuth/createTemp');
const createPerm = require('./controllers/usersAuth/createPerm');
const login = require('./controllers/usersAuth/login');
const logout = require('./controllers/usersAuth/logout');
const deleteAcc = require('./controllers/usersAuth/deleteAcc');
const checkAuth = require('./controllers/usersAuth/checkAuth');

const createRoom = require('./controllers/rooms/createRoom');
const deleteRoom = require('./controllers/rooms/deleteRoom');
const getRoomList = require('./controllers/rooms/getRoomList');
const getRoom = require('./controllers/rooms/getRoom');

const createMessage = require('./controllers/messages/createMessage');
const getMessage = require('./controllers/messages/getMessages');

const counter = require('./controllers/counter');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

const server = http.createServer();
const wss = new WebSocket.Server({server});

wss.on('connection', ws => {
    console.log('connect');

    ws.on('message', async message => {
        const data = JSON.parse(message);
        const sendToAll = (handler, type, amount) => wss.clients.forEach(client => client.send(JSON.stringify({
            handler,
            type,
            amount
        })));

        switch(data.type) {
            // user cases
            case 'createTemp':
                await createTemp(data, ws);
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'createPerm':
                await createPerm(data, ws);
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'login':
                await login(data, ws);
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'logout':
                await logout(data, ws);
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'deleteAcc':
                await deleteAcc(data,ws);
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return

            case 'checkAuth':
                await checkAuth(data, ws);
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            // room cases
            case 'createRoom':
                await createRoom(data, ws);
                // sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'getRoomList':
                await getRoomList(ws);
                return;

            case 'getRoom':
                await getRoom(data, ws);
                // sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return

            case 'deleteRoom':
                await deleteRoom(data, ws);
                // sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            // message cases
            case 'createMessage':
                await createMessage(data, ws);
                // sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'getMessage':
                await getMessage(data, ws);
                // sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;
        }
    })
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
        server.close(e);
    }
}

start();