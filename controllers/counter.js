const counter = {
    usersInSite: new Set(),
    roomsInSite: new Set(),
    usersInRoom: [],
    addUsersInSite: function(user){
        this.usersInSite.add(user);
    },
    removeUsersInSite: function(user){
        this.usersInSite.delete(user);
    },
    getUsersInSite: function(){
        return Array.from(this.usersInSite);
    },
    addRoomsInSite: function(room){
        this.roomsInSite.add(room);
    },
    removeRoomsInSite: function(room){
        this.roomsInSite.delete(room);
    },
    getRoomsInSite: function(){
        return Array.from(this.roomsInSite);
    },
    addUsersInRoom: function(user){
        usersInRoom++;
    },
    removeUsersInRoom: function(user){
        usersInRoom--;
    }
}


module.exports = counter;