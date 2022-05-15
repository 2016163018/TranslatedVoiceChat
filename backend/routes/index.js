const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(_, res) {
  res.sendFile(path.join(__dirname + '/../../frontend/dist/index.html'));
});

module.exports = router;
