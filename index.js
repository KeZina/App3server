const express = require('express');
const http = require ('http');
const config = require('config');
const multer = require('multer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const User = require('./models/User');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

// const upload = multer();
// const app = express();
const server = http.createServer();
const wss = new WebSocket.Server({server});

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(upload.none());

// const users = new Set();

const createTemp = async (form, ws) => {
    try {
        const {name} = form;
        const nameIsTaken = await User.findOne({name});

        if(nameIsTaken) {
            ws.send(JSON.stringify({
                type: "create", 
                auth: {
                    temp: false,
                    perm: false
                }, 
                message: "name is already exists"
            }));
        } else if(!nameIsTaken) {
            const user = new User({
                name,
                token: ''
            })
            user.addToken();

            ws.send(JSON.stringify({
                type: "create", 
                auth: {
                    temp: true,
                    perm: false
                }, 
                name: user.name,
                token: user.token
            }))


        } else throw new Error();
    } catch(e) {
        console.log(e);
    }
}

const createPerm = async (form, ws) => {
    try {
        const {name, password} = form;
        const nameIsTaken = await User.findOne({name});

        if(nameIsTaken) {
            ws.send(JSON.stringify({
                type: "create", 
                auth: {
                    temp: false,
                    perm: false
                }, 
                message: "name is already exists"
            }));
        } else if(!nameIsTaken) {
            const user = new User({
                name,
                token: ''
            })
            await user.addHash(password);
            await user.addToken();

            ws.send(JSON.stringify({
                type: "create", 
                auth: {
                    temp: false,
                    perm: true
                },
                name: user.name,
                token: user.token
            }))
        } else throw new Error();
    } catch(e) {
        console.log(e);
    }
}

const login = async (form, ws) => {
    try {
        const {name, password} = form;
        const user = await User.findOne({name});

        if(user) {
            const hash = await user.compareHash(password);
            if(hash) {
                await user.addToken();
                ws.send(JSON.stringify({
                    type: "login",
                    auth: {
                        temp: false,
                        perm: true
                    },
                    name: user.name,
                    token: user.token
                }))
            } else if(!hash){
                ws.send(JSON.stringify({
                    type: 'login', 
                    auth: {
                        temp: false,
                        perm: false
                    }
                }))
            } else {
                throw new Error();
            }
        } else if(!user) {
            ws.send(JSON.stringify({
                type: 'login', 
                auth: {
                    temp: false,
                    perm: false
                }
            }))
        } else {
            throw new Error();
        }
    } catch(e) {
        console.log(e);
    }
}

const logout = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));

        if(data.authType === 'temp') {
            await User.deleteOne({_id: verToken._id});
        } else if(data.authType === 'perm') {
            await User.updateOne({_id: verToken._id}, {token: ""});
        }

        ws.send(JSON.stringify({
            type: 'auth',
            auth: {
                temp: false,
                perm: false
            }
        }))
    } catch(e) {
        console.log(e);
    }
}

const deleteAcc = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));

        await User.deleteOne({_id: verToken._id});

        ws.send(JSON.stringify({
            type: 'auth',
            auth: {
                temp: false,
                perm: false
            }
        }))
    } catch(e) {
        console.log(e)
    }
}

const checkAuth = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));
        const user = await User.findById(verToken._id);

        if(user) {
            if(user.hash){
                ws.send(JSON.stringify({
                    type: "auth", 
                    auth: {
                        temp: false,
                        perm: true
                    }, 
                    name: user.name
                }))
            } else if(!user.hash) {
                ws.send(JSON.stringify({
                    type: "auth", 
                    auth: {
                        temp: true,
                        perm: false
                    }, 
                    name: user.name
                }))
            }
        } else if(!user) {
            ws.send(JSON.stringify({
                type: 'auth', 
                auth: {
                    temp: false,
                    perm: false
                }
            }))
        } else throw new Error();

    } catch(e) {
        console.log(e);
        if(e.message === 'jwt expired') {
            ws.send(JSON.stringify({
                type: "auth", 
                auth: {
                    temp: false,
                    perm: false
                }, 
                message: e.message
            }))
        }
    }
}

wss.on('connection', ws => {
    console.log('connect')
    ws.on('message', message => {
        const data = JSON.parse(message);

        switch(data.type) {
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
        }
    })

    ws.send(JSON.stringify('hi from websocket :>'));
    // ws.on('error', error => console.log(error))
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