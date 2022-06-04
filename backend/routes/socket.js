const io = require("socket.io");
const { joinRoom, exitRoom } = require("../services/rooms");
const socket = io({ cors: { origin: "*" } });

socket.on("connection", (client) => {
  const roomId = client.handshake.query.roomId;
  const isJoined = joinRoom(roomId, client.id);

  if (!isJoined || !roomId) {
    client.disconnect();
    return;
  }

  client.on("sendMessage", (message) => {
    socket.to(roomId).emit("receiveMessage", { id: client.id, ...message });
  });

  client.on("sendSDP", (description) => {
    client.broadcast.to(roomId).emit('receiveSDP', description);
  })

  client.on("sendICE", (candidate) => {
    client.broadcast.to(roomId).emit('sendICE', candidate);
  })

  client.on("disconnect", () => {
    exitRoom(roomId, client.id);
    console.log("client exited :", client.id);
  });

  client.join(roomId);
  client.emit("joined");
  client.broadcast.to(roomId).emit('joinNew');

  client.on('callNeeded', () => {
    client.broadcast.to(roomId).emit('callNeeded');
    setTimeout(() => {
      client.broadcast.to(roomId).emit('callNeeded');
    }, 1000);
  })
});

module.exports = socket;
