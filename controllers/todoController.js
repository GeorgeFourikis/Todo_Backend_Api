const router = require("express").Router();
const { client } = require("../configurations/db");
const { authorize } = require("../middleware/auth");

//get all todos from the user using user_id
router.get("/", authorize, async (req, res) => {
  let prepareData = {};
  try {
    const { user_id } = req.headers;
    // get all Todos for specific user_id
    const userTodos = await client.query(
      `select * from todos where user_id = '${user_id}'`
    );
    const user = await client.query(
      `select user_email from users where user_id = '${user_id}'`
    );
    prepareData["todos"] = userTodos.rows;
    prepareData["user"] = user.rows;
    res.json(prepareData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//create a todo
router.post("/new", authorize, async (req, res) => {
  try {
    const { description, user_id } = req.body;
    const newTodo = await client.query(
      "INSERT INTO todos (user_id, todo_description) VALUES ($1, $2) RETURNING *",
      [user_id, description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo
router.put("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.headers;
    const { description, status } = req.body;
    const updateTodo = await client.query(
      `UPDATE todos SET todo_description = '${description}', todo_status = '${status}'  WHERE todo_id = '${id}' AND user_id = '${user_id}' RETURNING *`
    );

    if (updateTodo.rows.length === 0) {
      return res.json("This todo is not yours");
    }

    res.json("Todo was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo
router.delete("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.headers;
    const deleteTodo = await client.query(
      `DELETE FROM todos WHERE todo_id = '${id}' AND user_id = '${user_id}' RETURNING *`
    );

    res.json(`Todo was deleted, ${deleteTodo.rows}`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
