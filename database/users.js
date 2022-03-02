const Sequelize = require("sequelize");
const connection = require("./database");

const users = connection.define("cadastros", {
    username:{type:Sequelize.STRING, allowNull:false},
    email:{type: Sequelize.STRING, allowNull:false},
    password:{type: Sequelize.STRING, allowNull:false},
})


users.sync({force:false});

module.exports = users;