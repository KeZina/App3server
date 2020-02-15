const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

const logout = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));

        if(data.authType === 'temp') {
            await User.deleteOne({_id: verToken._id});
        } else if(data.authType === 'perm') {
            await User.updateOne({_id: verToken._id}, {token: ""});
        }

        ws.send(JSON.stringify({
            handler: 'user',
            type: 'auth',
            auth: {
                temp: false,
                perm: false
            }
        }))
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'user',
            type: 'auth', 
            auth: {
                temp: false,
                perm: false
            }, 
            message: e
        }))
    }
}

module.exports = logout;