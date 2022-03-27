const users = require("../database/users");
const rooms = require("../database/rooms");
const usersInRooms = require("../database/usersInRoom");
const messages = require("../database/messages");

module.exports = {
    //user
    async searchUsername(username) {
        return await users.findOne({ where: { username } });
    },

    async searchEmail(email) {
        return await users.findOne({ where: { email } });
    },
    //room
    async seachRoomName(roomname) {
        return await rooms.findOne({ where: { roomname } });
    },

    async searchLimits(limit) {
        return await rooms.findAll({ where: { limit } });
    },

    //user in room
    async searchUsersInRoom(roomname, username) {
        return await usersInRooms.findOne({ where: { roomname, username } });
    },

    async searchAllusernameUsersInRoom(username) {
        return await usersInRooms.findAll({ where: { username } });
    },

    async searchMessages(roomname) {
        return await messages.findAll({ where: { roomname } });
    }

}




