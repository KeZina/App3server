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
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(upload.none());

// const users = new Set();

const create = async (form, ws) => {
    try {
        const {name} = form;
        const isNameTaken = await User.findOne({name});

        if(isNameTaken) {
            ws.send(JSON.stringify({
                type: "create", 
                auth: {
                    temp: false,
                    perm: false
                }, 
                message: "name is already exists"
            }));
        } else if(!isNameTaken) {
            const user = new User({
                name,
                token: ''
            })
            await user.addToken();

            ws.send(JSON.stringify({
                type: "create", 
                auth: {
                    temp: true,
                    perm: false
                }, 
                token: user.token,
                name: user.name
            }))
        } else throw new Error();
    } catch(e) {
        console.log(e);
    }
}

const checkAuth = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));
        const user = await User.findById(verToken._id);

        if(user) {
            ws.send(JSON.stringify({
                type: "auth", 
                auth: {
                    temp: true,
                    perm: false
                }, 
                name: user.name
            }))
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

wss.on('connection', ws => {
    console.log('connect')
    ws.on('message', message => {
        const data = JSON.parse(message);

        switch(data.type) {
            case 'form':
                create(data, ws);
                return;
            case 'checkAuth':
                checkAuth(data, ws);
                return;
            case 'logout':
                logout(data, ws);
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