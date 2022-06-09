const {chat, user, profile} = require("../../models");
const jwt   = require("jsonwebtoken");
const {Op}  = require("sequelize");
require('dotenv').config();

let connectedUser = {}
const socketIo  = (io) => {
    let userCount   = 0;


    io.use((socket, next) => {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            next();
        }else {
            next(new Error("Not Authorized"));
        }
    });


    // listen connection event
    io.on('connection', (socket) => {
        userCount++;

        console.log('Client with id ' + socket.id + ' is connect');
        console.log('Clients : ' + userCount);

        const userId            = socket.handshake.query.id;
        connectedUser[userId]   = socket.id;

        // create event custom for load admin contact
        socket.on('load admin contact', async () =>{
            try {
                const adminContact  = await user.findOne({
                    where   : {
                        status  : 'seller'
                    },
                    include : [
                        {
                            model   : profile,
                            as      : 'profile',
                            attributes  : {
                                exclude : ['createdAt', 'updateAt', 'idUser']
                            }
                        },
                        {
                            model       : chat,
                            as          : 'senderMessage',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'idSender', 'idRecipient']
                            }
                        },
                        {
                            model       : chat,
                            as          : 'recipientMessage',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'idSender', 'idRecipient']
                            }
                        }
                    ],
                    attributes  : {
                        exclude : ['createdAt', 'updateAt', 'password']
                    }
                });
                // console.log(myImage);
                socket.emit("admin contact", adminContact);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("load customer contacts", async () =>{
            try {
                let customerContacts = await user.findAll({
                    where   : {
                        status  : 'buyer'
                    },
                    include : [
                        {
                            model       : profile,
                            as          : 'profile',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'idUser']
                            }
                        },
                        {
                            model       : chat,
                            as          : 'senderMessage',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'idSender', 'idRecipient']
                            }
                        },
                        {
                            model       : chat,
                            as          : 'recipientMessage',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'idSender', 'idRecipient']
                            }
                        }
                    ],
                    attributes  : {
                        exclude : ['createdAt', 'updatedAt', 'password']
                    }
                });

                customerContacts = JSON.parse(JSON.stringify(customerContacts));
                customerContacts = customerContacts.map(item => ({
                    ...item,
                    image   : item.profile?.image === 'my-image' ? 'https://th.bing.com/th/id/OIP.DqNnP_C9pVGwHzH8-2iB1gAAAA?pid=ImgDet&rs=1' : process.env.PATH_FILE + item.profile?.image
                }));

                socket.emit("customer contacts", customerContacts);


            } catch (error) {
                console.log(error);
            }
        });


        socket.on("load messages", async (payload) => {
            try {
                const token     = socket.handshake.auth.token
                const TOKEN_KEY = process.env.SECRET_KEY;
                const verified  = jwt.verify(token, TOKEN_KEY);

                const idRecipient   = payload;
                const idSender      = verified;

                const data  = await chat.findAll({
                    where   : {
                        idSender    : {
                            [Op.or] : [idRecipient, idSender]
                        },
                        idRecipient : {
                            [Op.or] : [idRecipient, idSender]
                        }
                    },
                    include : [
                        {
                            model       : user,
                            as          : 'recipient',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'password']
                            }
                        },
                        {
                            model       : user,
                            as          : 'sender',
                            attributes  : {
                                exclude : ['createdAt', 'updatedAt', 'password']
                            }
                        }
                    ],
                    order       : [['createdAt', 'ASC']],
                    attributes  : {
                        exclude : ['createdAt', 'updatedAt', 'idRecipient', 'idSender']
                    }
                });
                socket.emit("messages", data);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on("send message", async (payload) => {
            try {
                const token     = socket.handshake.auth.token

                const TOKEN_KEY = process.env.SECRET_KEY;
                const verified  = jwt.verify(token, TOKEN_KEY);
                const idSender      = verified;
                const {message, idRecipient}   = payload;

                await chat.create({
                    message,
                    idRecipient,
                    idSender
                });

                io.to(socket.id).to(connectedUser[idRecipient]).emit("new message", idRecipient);

            } catch (error) {
                console.log(error);
            }
        });

        socket.on('disconnect', (reason) => {
            userCount--;

            console.log('id client : ' + socket.id + ' is disconnect, because : ' + reason)
        });
    });
}

module.exports = socketIo;