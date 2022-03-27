/* TEORIAS




*/
/* Ideias a implmentar

//Ideia: Na Router selectedRoom, podemos separar as verificações em funções 
auxiliares de acordo com o limit. MODELAR MELHOR A IDEIA AQUI: Podemos passar algum tipo de numero de verificação do front
para para identificar por onde to recebendo as informações, de qual formulário;

//torcar de login para e mail 

//Ideia: organizar o contariner que possui os chats que o usuário está, ao entrar na rota room

+++++++
//Questão para mudar, tirar a gambiarrar do number. Mudando as associações de sala no server.
+++++++
*/













/*
Trechos úteis 


<%{%>
                <script>
                    console.log(`
            ----------------------
            username2 ${username2}
            ----------------------
            `)

                </script    
            
            <%}%>


    try{
        if (roomname == '-1') {
            res.redirect("/room");
        } else {
    
            const room = await controllerBD.seachRoomName(roomname);
    
            if (room == undefined) {
                res.render("NotRoom");
    
            } else { // room exists
                const inRoom = await controllerBD.searchUsersInRoom(roomname, username);
    
                if (room.limit == "group" || room.limit == "global") {
    
    
                    if (inRoom != undefined) {// CASE 01
                        number = 1;
                        /*usuário já esteve nessa room
                          atualize seu id e da um join para room
                          redirectMain(number);
    
                        } else {//CASE 02
                            number = 2;
        
                            /*usuário nunca esteve nessa room group
                                então da join e anexe no userIroom
                            redirectMain(number);
                        }
        
        
        
                    } else { //room.limit == private
        
        
                        if (inRoom != undefined) { //CASE 03
                            /*usuário esteve nessa private room 
                            atualize seu id e da um join para room
                            number = 3;
                            redirectMain(number);
        
                        } else {
                            /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                              room privada, caso tenha menos de duas pessoas, usuário pode entrar 
        
                            if (inRoom.length >= 2) {
        
                                //não pode entrar, chat privado
                                res.render("thataprivateroom")
        
        
                            } else { //CASE 04
                                number = 4;
                                /*usuário nunca esteve nessa room private, mas ele pode entrar
                                então da join e anexe no userIroom
                                redirectMain(number);
                            }
                        }
        
                    }
        
        
                    function redirectMain(number) {
                        req.session.room = {
                            roomname: inRoom.roomname,
                            username: inRoom.username,
                            number
                        }
        
                        res.redirect("/main");
        
                    }
    
        
                }
        
        
        
        
            }
    
    
    
        }catch{
            
        }

        */