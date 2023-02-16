require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: process.env.PORT,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0
})

module.exports = pool;