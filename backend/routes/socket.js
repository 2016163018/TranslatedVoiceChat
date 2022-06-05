const io = require("socket.io");
const { joinRoom, exitRoom, getOpponentId, getLocale } = require("../services/rooms");
const { getTranslate } = require("../services/translate");
const socket = io({ cors: { origin: "*" } });

socket.on("connection", (client) => {
  const roomId = client.handshake.query.roomId;
  const locale = client.handshake.query?.locale.split('-')[0] ?? null;
  const isJoined = joinRoom(roomId, client.id, locale);

  if (!isJoined || !roomId) {
    client.disconnect();
    return;
  }

  client.on("sendMessage", async ({text}) => {
    const opponent = getOpponentId(roomId, client.id);
    const sourceLocale = getLocale(roomId, client.id);
    const targetLocale = getLocale(roomId, opponent);

    if (!targetLocale || sourceLocale == targetLocale) {
      socket.to(roomId).emit("receiveMessage", { id: client.id, text, sourceLocale, targetLocale });
    } else {
      const translatedText = await getTranslate(text, sourceLocale, targetLocale);
      socket.to(roomId).emit("receiveMessage", { id: client.id, text, sourceLocale, targetLocale, translatedText });
    }
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
