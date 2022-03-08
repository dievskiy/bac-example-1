const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, './.env'),
});

module.exports = {
    DB_URI: process.env.DB_URI,
    appPort: process.env.APP_PORT,
    jwtSecret: process.env.JWT_SECRET,
    saltLength: 10
};