const express = require("express");
const users = require("../database/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const middlewares = require("../middlewares/auth");
const controllerBD = require("../controllers/controllerBD");
const controllerRooms = require("../controllers/controllerRooms");


//login

router.post("/authenticate", async (req, res) => {

    const password = req.body.password.trim();
    const username = req.body.username.trim();

    const user = await controllerBD.searchUsername(username);

    if (user != undefined) {

        //password validate
        const correct = bcrypt.compareSync(password, user.password);

        if (correct) {

            req.session.user = {
                id: user.id,
                username: user.username,
            }
            res.redirect("/room");

        } else { res.redirect("/"); }

    } else { res.redirect("/") }

    //modificar esses elses para informar o problema em questão.

})

//Register

router.post("/register", async (req, res) => {

    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const username = req.body.username.trim();

    const userUsername = await controllerBD.searchUsername(username);
    const userEmail = await controllerBD.searchEmail(email);

    if (userEmail == undefined && userUsername == undefined) {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        users.create({
            username: username,
            email: email,
            password: hash,

        }).then(() => {
            console.log("Usuário cadastrado!");
        });

        res.render("accountCreated", {
            username
        });

    } else {
        console.log("Nickname ou e-mail já cadastrado");
        res.redirect("/register");
        //retirar esse redirect, e colocar uma mensagam dizendo o problema
    }

});


router.post("/createRoom", middlewares, async (req, res) => {

    const username = req.session.user.username;
    const roomname = req.body.roomname.trim();
    const limit = req.body.limit.trim();

    const room = await controllerRooms.auxCreateRoom(roomname, limit);

    try {

        if (room == false) {
            res.render("roomAlreadyCreated");
        }
        else if (limit == "private") {
            req.session.room = {
                username,
                roomname,
                limit
            };

            res.redirect("/createPrivate");

        }
        else {
            req.session.room = {
                roomname,
                number: 2,
                username
            };
            res.redirect("/createdroom");

        }
    }
    catch
    {
        console.log("!?!?!? ERRO - CREATE ROOM !?!?!?");
    }




})

router.post("/confirmacaoContato", middlewares, async (req, res) => {

    const username = req.session.room.username;
    const roomname = req.session.room.roomname;
    const limit = req.session.room.limit;

    const convidadoPrivado = req.body.username2.trim();

    try {
        const user = await controllerRooms.auxConfirmacaoContato(roomname, limit, convidadoPrivado);

        if (user == false) {
            res.render("usuarionaoexiste")
        }
        else {

            req.session.room = {
                roomname,
                number: '4',
                username,
            }
            res.redirect("/createdroom");
        }
    }
    catch
    {
        console.log("!?!?!? ERRO - CONFIMACAO CONTATO!?!?!?");
    }


})

router.post("/selectedroom", middlewares, async (req, res) => {

    const roomname = req.body.select_room.trim();
    const username = req.session.user.username;

    if (roomname == "-1") {
        res.redirect("/room");
    }
    else {

        try {
            const data = await controllerRooms.auxSelectedRoom(roomname, username);

            if (data == undefined) {
                res.render("NotRoom");
            }
            else if (data.number == 5) {
                res.render("thataprivateroom");
            }
            else {
                req.session.room = {
                    roomname: data.roomname,
                    username: data.username,
                    number: data.number
                }

                res.redirect("/main");
            }
        }
        catch
        {
            console.log("!?!?!? ERRO - SELECTED ROOM !?!?!?");
        }



    }












})


//Login
router.get("/", (req, res) => {

    if (req.session.user != undefined) {
        res.redirect("/room");
    } else {
        res.render("login");
    }

});
//Logout
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/createPrivate", (req, res) => {
    res.render("roomPrivate");
})

router.get("/createdroom", (req, res) => {
    res.render("roomCreated");
})


router.get("/room", middlewares, async (req, res) => {

    const username = req.session.user.username;
    const room0 = await controllerBD.searchAllusernameUsersInRoom(username);

    res.render("room", {

        username,
        room0,
    })

})

router.get("/main", middlewares, (req, res) => {

    const roomname = req.session.room.roomname;
    const number = req.session.room.number;
    const username = req.session.room.username;

    res.render("main", {
        username,
        roomname,
        number
    })

})

router.get("/global", middlewares, async (req, res) => {

    const username = req.session.user.username;
    const room0 = await controllerBD.searchLimits("global");

    res.render("globaisdisponiveis", {
        username,
        room0
    });

})






module.exports = router;