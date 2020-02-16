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
const getRoom = require('./controllers/rooms/getRoom');

const createMessage = require('./controllers/messages/createMessage');
const getMessage = require('./controllers/messages/getMessages');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

const server = http.createServer();
const wss = new WebSocket.Server({server});

const usersInSite = [];


wss.on('connection', ws => {
    console.log('connect');

    ws.on('message', message => {
        const data = JSON.parse(message);

        switch(data.type) {
            // user cases
            case 'createTemp':
                createTemp(data, ws);
                return;
            case 'createPerm':
                createPerm(data, ws);
                return;
            case 'login':
                login(data, ws);
                return;
            case 'logout':
                logout(data, ws);
                return;
            case 'deleteAcc':
                deleteAcc(data,ws);
                return
            case 'checkAuth':
                checkAuth(data, ws);
                return;
            // room cases
            case 'createRoom':
                createRoom(data, ws);
                return
            case 'getRoom':
                getRoom(data,ws);
                return
            case 'deleteRoom':
                deleteRoom(data, ws);
                return;
            // message cases
            case 'createMessage':
                createMessage(data, ws);
                return;
            case 'getMessage':
                getMessage(data, ws);
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