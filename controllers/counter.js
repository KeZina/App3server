const counter = {
    usersInSite: new Set(),
    usersInRooms: {},
    addUsersInSite: function(user) {
        this.usersInSite.add(user);
    },
    removeUsersInSite: function(user) {
        this.usersInSite.delete(user);
    },
    getUsersInSite: function() {
        return Array.from(this.usersInSite);
    },
    addUsersInRooms: function(roomUrl, user) {
        if(this.usersInRooms[roomUrl]) {
            if(this.usersInRooms[roomUrl].includes(user)){
                return;
            }
            this.usersInRooms[roomUrl].push(user);
        } else if(!this.usersInRooms[roomUrl]) {
            this.usersInRooms[roomUrl] = [];
            this.usersInRooms[roomUrl].push(user);
        }
    },
    removeUsersInRooms: function(roomUrl, user) {
        let usersList = this.usersInRooms[roomUrl].filter(item => item !== user);
        this.usersInRooms[roomUrl] = usersList;
    },
    getUsersInRooms: function() {
        return this.usersInRooms;
    }
}


module.exports = counter;