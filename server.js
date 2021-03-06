const { http, io, app, express } = require("./https")
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const session = require("express-session");
const messages = require("./database/messages");
const controllerBD = require("./controllers/controllerBD");

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
app.use("/", routes);


io.on("connection", (socket) => {

    console.log("Conexão feita com Sucesso");

    socket.on("selected_room", async (data, callback) => {

        socket.join(data.roomname);

        try {
            const inRoom = await controllerBD.searchUsersInRoom(data.roomname, data.username);

            inRoom.socketId = socket.id;
            inRoom.save();
        }
        catch
        {
            console.log(`
            -------------------------
            ERRO COM inRomm em Server
            -------------------------`);
        }



        const message = await controllerBD.searchMessages(data.roomname);

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

    socket.on("message", (data) => {

        const inRoom = controllerBD.searchUsersInRoom(data.roomname, data.username);

        if (inRoom != undefined) {

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





http.listen(3000, () => {
    console.log("Servidor aberto na porta 3000");
})