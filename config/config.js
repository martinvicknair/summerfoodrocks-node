const fs = require('fs');

module.exports = {
  development: {
    username: 'root',
    password: '1236',
    database: 'sfrio_db',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    mapkey: process.env.GOOGLE_MAPS_API_KEY,
    dialect: 'mysql'
    // dialectOptions: {
    //   ssl: {
    //     ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
    //   }
    // }
  }
};
