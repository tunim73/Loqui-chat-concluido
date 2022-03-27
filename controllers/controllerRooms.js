const rooms = require("../database/rooms");
const controllerBD = require("./controllerBD");
const usersInRooms = require("../database/usersInRoom");



module.exports = {

    async auxSelectedRoom(roomname, username) 
    {

        const room = await controllerBD.seachRoomName(roomname);

        if (room == undefined) //room não localizada
        {
            return undefined;
        } 
        
        else 
        { // room localizada

            const inRoom = await controllerBD.searchUsersInRoom(roomname, username);
            
            if(inRoom != undefined) 
            { //Usuário já esteve nessa room antes
                data = ({
                    roomname: room.roomname,
                    username,
                });
                             
                return data;
                
            }
            else if(room.limit == "private" && inRoom.length >=2) 
            { //impede o usuário de entrar numa sala privada 
                return false;
            }
            else 
            {   //usuario nunca entrou nessa room, pode entrar, pois é do tipo grupo ou global
                //atrele usuário a sala e retorne
                await this.auxUsersInRoom(roomname,username); 
                data = ({
                    roomname: room.roomname,
                    username,
                });
                
                             
                return data;
            }
           
        }
        
    },

    async auxCreateRoom(roomname, limit, username){

        const room = await controllerBD.seachRoomName(roomname);

        if(room != undefined)
        {
            return false
        }
        else if(limit=="private")
        {
            return limit; //TALVEZ AQUI EU POSSA FAZER ALGUMA COISA LOGO, 
            //MELHOR DO QUE A FORMA ATUAL DE SOLICITAR O NOME DO INDIVIDUO por uma tela e tals
        }
        else 
        {
            rooms.create({
                roomname,
                limit,
            }).then(async ()=>{
                await this.auxUsersInRoom(roomname, username);
                return true;
            }).catch(()=>{
                return "200"
            });   


        }
    },

    async auxConfirmacaoContato(roomname, limit, username, convidadoPrivado){

        const user = await controllerBD.searchUsername(convidadoPrivado);
        
        if(user == undefined)
        {
            return undefined;
        }
        else 
        {
            rooms.create({
                roomname,
                limit,
            }).then(async ()=>{

                await this.auxUsersInRoom(roomname,username);
                await this.auxUsersInRoom(roomname,convidadoPrivado); 
                
                return true;
            }).catch(()=>{
                return "201";
            })

           


        }







       



    },

    async auxUsersInRoom(roomname, username){

        usersInRooms.create({
            roomname,
            username,
            socketId: "socket.id"
        }).then(() => {
            console.log(`
            --------------------------------------
            Mais um para o usersInRooms
            room: ${roomname} user: ${username}
            --------------------------------------`)
        });
    }


}