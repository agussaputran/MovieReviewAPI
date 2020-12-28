const db = require("knex")({
  client: "mysql",
  connection: {
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
  },
});
db.raw('SELECT "Database connected!" message')
  .then((result) => {
    console.log(result[0][0].message);
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = db;
