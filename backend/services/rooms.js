const randomString = require("randomstring");

const MAX_NUMBER = 2;
const rooms = {};

const createRoom = () => {
  const roomId = randomString.generate(8);
  Object.assign(rooms, { [roomId]: [] });

  return roomId;
};

const joinRoom = (roomId, socketId) => {
  if (!rooms.hasOwnProperty(roomId) || rooms[roomId].length >= MAX_NUMBER) {
    return false
  }
  rooms[roomId].push(socketId);

  return true;
}

const exitRoom = (roomId, socketId) => {
  if (!rooms.hasOwnProperty(roomId)) {
    return;
  }
  rooms[roomId] = rooms[roomId].filter(id => id !== socketId);
}

setInterval(() => console.log(rooms), 10000);

module.exports = { createRoom, joinRoom, exitRoom };
