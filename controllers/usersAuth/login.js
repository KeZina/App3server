const User = require('../../models/User');

const login = async (data, ws) => {
    try {
        const {name, password} = data;
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

module.exports = login;