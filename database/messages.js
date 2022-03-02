const Sequelize = require("sequelize");
const connection = require("../database/database");

const messages = connection.define("messages", {
    roomname:{type:Sequelize.STRING, allowNull:false},
    username:{type: Sequelize.STRING, allowNull:false},
    messages:{type: Sequelize.TEXT, allowNull:false}

})

messages.sync({force:false});
module.exports = messages;