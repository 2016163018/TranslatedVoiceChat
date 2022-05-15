const randomString = require("randomstring");

const rooms = {};

const createRoom = () => {
  const roomId = randomString.generate(8);
  Object.assign(rooms, { roomId: {} });

  return roomId;
};

module.exports = { createRoom };
