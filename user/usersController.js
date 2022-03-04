const express = require("express");
const users = require("../database/users");
const rooms = require("../database/rooms");
const router = express.Router();
const bcrypt = require("bcrypt");
const usersInRoom = require("../database/usersInRoom");
//const auth = require("../middlewares/auth");
const middlewares = require("../middlewares/auth");
const session = require("express-session");
const usersInRooms = require("../database/usersInRoom");


//Login
router.get("/", (req, res) => {

    if (req.session.user != undefined) {
        res.redirect("/room");
    } else {
        res.render("login");
    }

})


router.post("/authenticate", (req, res) => {

    const password = req.body.password;
    const username = req.body.username;

    users.findAll().then(us => {
        let i;
        for (i = 0; i < us.length; i++) {
            if (us[i].username == username) {
                break;
            }
        }

        if (us[i] != undefined) {

            //password validate
            let correct = bcrypt.compareSync(password, us[i].password);

            if (correct) {
                req.session.user = {
                    userid: us[i].id,
                    username: us[i].username,
                }
                res.redirect("/room");

            } else { res.redirect("/"); }
        } else { res.redirect("/"); }
    })

})

//Register

router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    //Verificando se já tem usernames e emails no banco de dados!

    users.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {

            users.findOne({ where: { username: username } }).then(user => {

                if (user == undefined) {
                    users.findOne({ where: { username: username } }).then(user => {

                        let salt = bcrypt.genSaltSync(10);
                        let hash = bcrypt.hashSync(password, salt);

                        users.create({
                            username: username,
                            email: email,
                            password: hash,

                        }).then(() => {
                            console.log("Usuário cadastrado!"
                            )
                        })
                        res.render("accountCreated", {
                            username: username
                        });
                    })
                }
                else {
                    res.redirect("/register");
                }
            })
        }

        else {
            res.redirect("/register");
        }

    });

});

//logout

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

//room 

router.post("/createRoom", (req, res) => {

    const limit = req.body.limit;
    const roomname = req.body.roomname;
    const username = req.body.username;


    console.log(`
            ------------------------------------------------
            Username 01: ${username} | Roomname: ${roomname} 
            ------------------------------------------------`
    );


    rooms.findOne({ where: { roomname: roomname } }).then(room => {

        if (room != undefined) {
            res.render("roomAlreadyCreated");
        } else {

            if (limit == "private") {

                req.session.room = {
                    username,
                    roomname,
                    limit
                }

                res.redirect("/createPrivate");
            } else {

                rooms.create({
                    roomname: roomname,
                    limit: limit,
                }).then(() => {

                    req.session.room = {
                        roomname,
                        number: 2,
                        username
                    }
                    res.redirect("/createdroom")
                })
            }
        }
    })


});

router.get("/createPrivate", middlewares, (req, res) => {

    res.render("roomPrivate");

})

router.post("/confirmacaoContato", middlewares, (req, res) => {

    let username = req.session.room.username;
    let roomname = req.session.room.roomname;
    let limit = req.session.room.limit;
    const username2 = req.body.username2;

    users.findAll({ where: { username: username2 } }).then(user => {
        let i;

        for (i = 0; i < user.length; i++) {
            if (user[i].username == username2)
                break;
        }

        if (user[i] == undefined) {
            res.render("usuarionaoexiste")
        } else {

            req.session.room = {
                roomname,
                number: '4',
                username,
            }
            rooms.create({
                roomname: roomname,
                limit: limit,
            })
            usersInRoom.create({
                roomname: roomname,
                username: username2,
                socketId: "socket.id"
            }).then(() => {
                console.log("ATRELACAO FEITA COM SUCESSO com usuario 2 ");
            })
            res.redirect("/createdroom")
        }
    })

})

router.get("/createdroom", (req, res) => {
    res.render("roomCreated");

})

router.post("/selectedroom", (req, res) => {

    const username = req.body.username;
    const roomname = req.body.select_room;

    let number;
    console.log(` 
    ----------------------------------------------------------------------------
    ROOM ${roomname}
    ----------------------------------------------------------------------------
    
    `)

    if (roomname == '-1') {
        res.redirect("/room");
    } else {


        rooms.findOne({ where: { roomname: roomname } }).then(room => {

            if (room == undefined) {
                res.render("NotRoom")

            } else { // room exists
                const verificaRooms = usersInRoom.findAll({ where: { roomname: roomname } });

                if (room.limit == "group" || room.limit == "global") {

                    verificaRooms.then(inRoom => {
                        let local = false, i;
                        for (i = 0; i < inRoom.length; i++) {
                            if (inRoom[i].username == username) {
                                local = true; break;
                            }
                        }

                        if (local) {// CASE 01
                            number = 1;
                            /*usuário já esteve nessa room
                              atualize seu id e da um join para room*/
                            redirectMain(number);

                        } else {//CASE 02
                            number = 2;

                            /*usuário nunca esteve nessa room group
                                então da join e anexe no userIroom*/
                            redirectMain(number);
                        }
                    });

                    //PRIVADO
                } else { //room.limit == private

                    verificaRooms.then(inRoom => {

                        let local0 = false, i;

                        for (i = 0; i < inRoom.length; i++) {
                            if (inRoom[i].username == username) {
                                local0 = true; break;
                            }
                        }

                        if (local0) { //CASE 03
                            /*usuário esteve nessa private room 
                         atualize seu id e da um join para room*/
                            number = 3;
                            redirectMain(number);

                        } else {
                            /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                              room privada, caso tenha menos de duas pessoas, usuário pode entrar */

                            if (inRoom.length >= 2) {

                                //não pode entrar, chat privado
                                res.render("thataprivateroom")


                            } else { //CASE 04
                                number = 4;
                                /*usuário nunca esteve nessa room private, mas ele pode entrar
                                então da join e anexe no userIroom*/
                                redirectMain(number);
                            }
                        }
                    })
                }
            }
        })

        function redirectMain(number) {

            req.session.room = {
                roomname: roomname,
                number: number,
                username: username
            }


            res.redirect("/main");
        }

    }





})

router.get("/room", middlewares, (req, res) => {

    let username = req.session.user.username;

    const room = usersInRooms.findAll({ where: { username: username } })
    room.then(room0 => {

        const sala = rooms.findAll();
        sala.then(room1 => {
            res.render("room", {

                username: username,
                room1: room1,
                room0: room0,

            })
        })

    })






})

router.get("/main", middlewares, (req, res) => {

    let roomname = req.session.room.roomname;
    let number = req.session.room.number;
    let username = req.session.room.username;

    console.log(`
            --------------------------------------------------------------------------------
            Username: ${username} | Roomname: ${roomname} | Number: ${number}
            --------------------------------------------------------------------------------`
    );

    res.render("main", {
        username: username,
        roomname: roomname,
        number: number
    })

})

router.get("/global", middlewares, (req, res) => {
    let username = req.session.user.username
    const roomsGlobais = rooms.findAll({ where: { limit: "global" } })
    roomsGlobais.then(roomsglobal => {

        res.render("globaisdisponiveis", {
            username,
            room0: roomsglobal
        })

    })


})





module.exports = router;