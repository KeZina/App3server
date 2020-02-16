const counter = {
    usersInSite: new Set(),
    roomsInSite: [],
    usersInRoom: [],
    addUsersInSite: function(user){
        this.usersInSite.add(user);
        console.log(this.usersInSite)
    },
    removeUsersInSite: function(user){
        this.usersInSite.delete(user);
        console.log(this.usersInSite);
    },
    addRoomsInSite: function(room){
        roomsInSite++;
    },
    removeRoomsInSite: function(room){
        roomsInSite--;
    },
    addUsersInRoom: function(user){
        usersInRoom++;
    },
    removeUsersInRoom: function(user){
        usersInRoom--;
    }
}

module.exports = counter;