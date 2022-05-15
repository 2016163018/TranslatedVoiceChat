const io = require("socket.io");
const socket = io({ cors: { origin: "*" } });

socket.on("connection", (client) => {
    
});

module.exports = socket;
