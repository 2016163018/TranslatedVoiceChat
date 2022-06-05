const randomString = require("randomstring");

const MAX_NUMBER = 2;
const rooms = {};

const createRoom = () => {
  const roomId = randomString.generate(4);
  Object.assign(rooms, { [roomId]: {} });

  return roomId;
};

const joinRoom = (roomId, socketId, locale) => {
  if (!rooms.hasOwnProperty(roomId) || rooms[roomId].length >= MAX_NUMBER) {
    return false
  }
  rooms[roomId][socketId] = locale;

  return true;
}

const exitRoom = (roomId, socketId) => {
  if (!rooms.hasOwnProperty(roomId)) {
    return;
  }
  delete rooms[roomId][socketId];
}

const getOpponentId = (roomId, socketId) => {
  const id = Object.keys(rooms[roomId]).filter(id => id !== socketId)[0];

  if (!id) {
    return false;
  } else {
    return id;
  }
}

const getLocale = (roomId, socketId) => rooms[roomId][socketId];

module.exports = { createRoom, joinRoom, exitRoom, getOpponentId, getLocale };
