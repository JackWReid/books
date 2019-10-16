const environment = process.env.NODE_ENV;
const config = require('../../knexfile.js')[environment || 'development'];

const connection = require('knex')(config);

export default connection;
