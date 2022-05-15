const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(_, res) {
  res.sendFile(path.join(__dirname + '/../frontend/dist/index.html'));
});

// app.use(express.static(path.join(__dirname, '../frontend/static')));

module.exports = router;
