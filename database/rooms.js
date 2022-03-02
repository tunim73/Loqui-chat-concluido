const Sequelize = require("sequelize");
const connection = require("../database/database");

const rooms = connection.define("rooms", {
    roomname:{type:Sequelize.STRING, allowNull:false},
    limit:{type: Sequelize.STRING, allowNull:false},
})

rooms.sync({force:false});

module.exports = rooms;