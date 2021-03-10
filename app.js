require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3030;
const { runInitialQueries } = require("./configurations/db_scripts");
// run scripts before proceeding
runInitialQueries();

app.use(cors());
app.use(express.json());

//here insert the routes
app.use("/auth", require("./controllers/authController"));
app.use("/todos", require("./controllers/todoController"));

app.listen(port, (err) => {
  if (err) throw new Error("Server cannot be invoked...");

  console.log(`Server is running i port ${port}`);
});
