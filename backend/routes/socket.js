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
    console.log(message);
    socket.to(roomId).emit("receiveMessage", { id: client.id, message });
  });

  client.on("disconnect", () => {
    exitRoom(roomId, client.id);
    console.log("client exited :", client.id);
  });

  client.join(roomId);
  client.emit("joined");
});

module.exports = socket;
