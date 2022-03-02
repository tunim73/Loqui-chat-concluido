

const { http, io, app, express } = require("./https")
const bodyParser = require("body-parser");
const users = require("./database/users");
const usersController = require("./user/usersController");
const session = require("express-session");
const middlewares = require("./middlewares/auth");
const rooms = require("./database/rooms");
const usersInRoom = require("./database/usersInRoom");
const messages = require("./database/messages");

//session

app.use(session({
    secret: "tchurusbangos",
    cookie: { maxAge: 30000000 }
}))


//template engine 
app.set("view engine", "ejs");

//static files
app.use(express.static("public"));

//body parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//routes 
app.use("/", usersController);


//Principal socket 
/*
app.get("/main", middlewares,(req,res)=>{
    users.findOne({where:{username:req.session.user.user}}).then(user=>{
        let username = user.username;
        res.render("main", {username:username});
        console.log(username+" se conectou!");
    })
})
*/



io.on("connection", (socket) => {

    console.log("Conexão feita com Sucesso")


    socket.on("selected_room", (data, callback) => {

        socket.join(data.roomname);

        const verificaRooms = usersInRoom.findAll({ where: { roomname: data.roomname } });


        verificaRooms.then(inRoom => {

            let i;
            for (i = 0; i < inRoom.length; i++) {
                if (inRoom[i].username == data.username) {
                    break;
                }
            }


            switch (data.number) {

                case '1': //GRUPO
                    /*usuário já esteve nessa room
                      atualize seu id e da um join para room*/
                    inRoom[i].socketId = socket.id;
                    console.log("ID atualizado - Grupo");
                    break;

                case '2': //GRUPO
                    /*usuário nunca esteve nessa room group
                        então da join e anexe no userIroom*/
                    usersInRoom.create({
                        roomname: data.roomname,
                        username: data.username,
                        socketId: socket.id
                    }).then(() => {
                        console.log("ATRELACAO FEITA COM SUCESSO");
                    })
                    break;

                case '3':
                    /*usuário esteve nessa private room 
                 atualize seu id e da um join para room*/
                    console.log("ID atualizado - Privado");
                    inRoom[i].socketId = socket.id;

                    break;

                case '4':
                    /*usuário nunca esteve nessa room private, mas ele pode entrar
                    então da join e anexe no userIroom*/
                    usersInRoom.create({
                        roomname: data.roomname,
                        username: data.username,
                        socketId: socket.id
                    }).then(() => {
                        console.log("ATRELACAO FEITA COM SUCESSO");
                    })

                    break;

                default: console.log("NÃO DEVERIA TA AQUI"); break;
            }

        })










        messages.findAll({ where: { roomname: data.roomname } }).then(message => {

            let list = [];
            for (let i = 0; i < message.length; i++) {

                const data = ({
                    roomname: message[i].roomname,
                    username: message[i].username,
                    msg: message[i].messages
                })

                list.push(data);

            }

            callback(list);
        })



    })


    socket.on("message", (data) => {


        console.log(`
        --------------------------------------------------------------------------------
        Username: ${data.username} | Roomname: ${data.roomname}
        --------------------------------------------------------------------------------`
        );




        usersInRoom.findAll({ where: { roomname: data.roomname } }).then(inRoom => {
            let local;
            for (let i = 0; i < inRoom.length; i++) {
                if (inRoom[i].username == data.username) {
                    local = true;
                }
            }
            if (local) {

                messages.create({
                    roomname: data.roomname,
                    username: data.username,
                    messages: data.msg
                })

                io.to(data.roomname).emit("showmessage", data)
            } else {
                console.log("Voce nao deveria estar nessa sala")
            }
        })



    })







})













































http.listen(3000, () => {
    console.log("Servidor aberto na porta 3000");
})