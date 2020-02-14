const User = require('../../models/User')

const createTemp = async (data, ws) => {
    try {
        const {name} = data;
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
            await user.addToken();

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

module.exports = createTemp;