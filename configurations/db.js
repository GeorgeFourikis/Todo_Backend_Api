const { Client } = require("pg");

// programmatically configure the Client
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "0999",
  port: 5432,
});

module.exports = { client };
