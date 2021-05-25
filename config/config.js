const fs = require('fs');

module.exports = {
  development: {
    username: 'root',
    password: '1236',
    database: 'sfrio_db',
    // username: 'sfrnode_dbuser',
    // password: '!ciBer1414sfr',
    // database: 'sfrnode_db',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
      }
    }
  }
};
