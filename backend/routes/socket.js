const io = require("socket.io");
const { joinRoom, exitRoom } = require("../services/rooms");
const socket = io({ cors: { origin: "*" } });

socket.on("connection", (client) => {
    const roomId = client.handshake.query.roomId;
    const isJoined = joinRoom(roomId, client.id);
    
    if (!isJoined) {
        client.disconnect();
    }
    else {
        client.join(roomId);
        client.emit('joined');

        client.on('disconnect', () => {
            exitRoom(roomId, client.id);
            console.log('client exited :', client.id)
        })
    }
});

module.exports = socket;
