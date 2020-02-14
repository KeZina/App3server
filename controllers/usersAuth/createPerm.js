const User = require('../../models/User');

const createPerm = async (data, ws) => {
    try {
        const {name, password} = data;
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

module.exports = createPerm;