const io = require("socket.io");
const socket = io({ cors: { origin: "*" } });

socket.on("connection", (client) => {
  client.emit('chat', "hello");
});

module.exports = socket;
