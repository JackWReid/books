import express from 'express';
const router = express.Router();

router.get('/', function(request, response) {
  response.json({
    message: 'buukks backend, see docs at http://github.com/JackWReid/buukks-backend',
    docs: 'http://github.com/JackWReid/buukks-backend',
    current_time: new Date().toString(),
  });
});

export default router;
