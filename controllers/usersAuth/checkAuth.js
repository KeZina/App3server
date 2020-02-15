const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

const checkAuth = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));
        const user = await User.findById(verToken._id);

        if(user) {
            if(user.hash){
                ws.send(JSON.stringify({
                    handler: 'user',
                    type: 'auth', 
                    auth: {
                        temp: false,
                        perm: true
                    }, 
                    name: user.name
                }))
            } else if(!user.hash) {
                ws.send(JSON.stringify({
                    handler: 'user',
                    type: 'auth', 
                    auth: {
                        temp: true,
                        perm: false
                    }, 
                    name: user.name
                }))
            }
        } else if(!user) {
            ws.send(JSON.stringify({
                handler: 'user',
                type: 'auth', 
                auth: {
                    temp: false,
                    perm: false
                }
            }))
        } else throw new Error();

    } catch(e) {
        console.log(e);
        
        ws.send(JSON.stringify({
            handler: 'user',
            type: 'auth', 
            auth: {
                temp: false,
                perm: false
            }, 
            message: e.message
        }))
    }
}

module.exports = checkAuth;