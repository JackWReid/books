const express = require('express');
const router = express.Router();

router.get('/', function(request, response) {
  response.json({ message: 'Buukks API - see docs at http://github.com/JackWReid/buukksapi' });
});

router.get('/ping', function(request, response) {
  const timeNow = new Date().toString();
  response.json({ message: `Buukks API ping, current time: ${timeNow}` });
});

module.exports = router;
