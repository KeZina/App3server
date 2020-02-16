const counter = {
    usersInSite: new Set(),
    usersInRooms: new Map(),
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
            if(this.usersInRooms.has(roomUrl)) {
                if(!this.usersInRooms.get(roomUrl).includes(user)) {
                    this.usersInRooms.set(roomUrl, [...this.usersInRooms.get(roomUrl), user])
                }
            } else if(!this.usersInRooms.has(roomUrl)) {
                this.usersInRooms.set(roomUrl, [user])
            }

    },
    removeUsersInRooms: function(roomUrl, user) {
        this.usersInRooms.delete(roomUrl, [user]);
    },
    getUsersInRooms: function() {
        // return this.usersInRooms;
        return Array.from(this.usersInRooms.entries());
    }
}


module.exports = counter;