const { client } = require("./db");

const runInitialQueries = () => {
  // connect to the DB
  client.connect();

  client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"', (err, res) => {
    if (err) throw new Error("could not inject extension query in Postgres");

    console.log(
      `Injecting query to verify that uuid-ossp extension exists. Done`
    );
  });

  client.query(
    `CREATE TABLE if not exists public.todos
(
    todo_id uuid DEFAULT uuid_generate_v4 (),
    todo_description text not null,
    todo_status bool not null default false,
    user_id uuid 
)`,
    (err, res) => {
      if (err) throw new Error("could not create table TODOS");

      console.log(`Injecting query to create TODOS table. Done`);
    }
  );

  client.query(
    `create table if not exists public.users
(
    user_id uuid default uuid_generate_v4 (),
    user_email text not null,
    user_password text not null
)
`,
    (err, res) => {
      if (err) throw new Error("could not create table USERS");

      console.log(`Injecting query to create USERS table. Done`);
    }
  );
};

module.exports = { runInitialQueries };
