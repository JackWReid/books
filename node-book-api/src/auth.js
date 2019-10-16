import basicAuth from 'express-basic-auth';

require('dotenv').config();

const auth = basicAuth({
  users: {
    [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD,
  },
});

export default auth;
