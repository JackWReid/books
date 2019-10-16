import express from 'express';
const router = express.Router();
import { adminRequired } from '../auth/helpers';

router.get('/', adminRequired, function(request, response) {
  handleResponse(response, 200, 'success');
});

function handleResponse(response, code, statusMessage) {
  response.status(code).json({status: statusMessage});
}

export default router;
