const express = require("express");
const router = express.Router();
const { createRoom } = require("../services/rooms");

router.get("/new", function (_, res) {
  const roomId = createRoom();

  res.json({ roomId });
});

module.exports = router;
