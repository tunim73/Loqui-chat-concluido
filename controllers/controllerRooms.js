const rooms = require("../database/rooms");
const controllerBD = require("./controllerBD");
const usersInRooms = require("../database/usersInRoom");



module.exports = {

    async auxSelectedRoom(roomname, username) 
    {

        const room = await controllerBD.seachRoomName(roomname);

        if (room == undefined) 
        {
            return undefined;
            //res.render("NotRoom");

        } 
        
        else 
        { // room exists

            const inRoom = await controllerBD.searchUsersInRoom(roomname, username);
            

            if (room.limit == "group" || room.limit == "global") 
            {

                if (inRoom != undefined) 
                {// CASE 01
                    
                    number = 1;
                    /*usuário já esteve nessa room
                      atualize seu id e da um join para room*/

                } 
                
                else 
                {//CASE 02
                    number = 2;

                    /*usuário nunca esteve nessa room group
                        então da join e anexe no userIroom*/
                }



            } 
            else 
            { //room.limit == private


                if (inRoom != undefined) 
                { //CASE 03
                    /*usuário esteve nessa private room 
                    atualize seu id e da um join para room*/
                    number = 3;

                } 

                else 
                {
                    /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                      room privada, caso tenha menos de duas pessoas, usuário pode entrar */

                    if (inRoom.length >= 2) 
                    {
                        number=5;
                    } 
                    else 
                    { //CASE 04
                        number = 4;
                        /*usuário nunca esteve nessa room private, mas ele pode entrar
                        então da join e anexe no userIroom*/
                    }
                }

            }

            data = ({
                roomname: room.roomname,
                username,
                number
            });
                         
            return data;
           
        }




    },

    async auxCreateRoom(roomname,limit){

        const room = await controllerBD.seachRoomName(roomname);

        if(room != undefined)
        {
            return false
        }
        else if(limit=="private")
        {
            return limit; //TALVEZ AQUI EU POSSA FAZER ALGUMA COISA LOGO, 
            //MELHOR DO QUE A FORMA ATUAL DE SOLICITAR O NOME DO INDIVIDUO
        }
        else 
        {
            rooms.create({
                roomname,
                limit,
            }).then(()=>{
                return true;
            }).catch(()=>{
                return "200"
            });   
        }
    },

    async auxConfirmacaoContato(roomname, limit, convidadoPrivado){

        const user = controllerBD.searchUsername(convidadoPrivado);
        
        if(user == undefined)
        {
            return false;
        }
        else 
        {
            rooms.create({
                roomname: roomname,
                limit: limit,
            });
            usersInRooms.create({
                roomname: roomname,
                username: convidadoPrivado,
                socketId: "socket.id"
            }).then(() => {
                console.log("ATRELACAO FEITA COM SUCESSO com usuario 2 ");
            });

            return true;


        }







       



    }







}