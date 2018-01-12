const fs = require('fs');
require('dotenv').config();

console.log("building config...")
let config = {
    "development": {
        "database": "down2game",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "username": "postgres",
        "password": process.env.DEV_PASS
      },
      "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "postgres"
      },
      "production": {
        "username": process.env.PROD_USER,
        "password": process.env.PROD_PASS,
        "database": process.env.DATABASE,
        "host": "ec2-23-23-150-141.compute-1.amazonaws.com",
        "dialect": "postgres"
    }
};

let json = JSON.stringify(config);
fs.writeFile('config/config.json', json, 'utf8', function() {
  console.log("config.json successfully built!")
});
