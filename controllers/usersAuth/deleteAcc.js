const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

const deleteAcc = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));

        await User.deleteOne({_id: verToken._id});

        ws.send(JSON.stringify({
            handler: 'user',
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

module.exports = deleteAcc;