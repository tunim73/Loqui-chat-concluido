const Sequelize = require("sequelize");
const connection = new Sequelize("cadastro","root", "987456", {
    host:"localhost",
    dialect:"mysql"
} )

connection.authenticate().then(()=>{
    console.log("Conexão com o banco sucedida");
})

module.exports = connection;