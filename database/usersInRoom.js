const Sequelize = require("sequelize");
const connection = require("../database/database");

const usersInRooms = connection.define("user", {
    roomname:{type:Sequelize.STRING, allowNull:false},
    username:{type: Sequelize.STRING, allowNull:false},
    socketId:{type:Sequelize.STRING, allowNull:false}
})

usersInRooms.sync({force:false});

module.exports = usersInRooms;