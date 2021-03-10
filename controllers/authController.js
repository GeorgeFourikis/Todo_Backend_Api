const router = require("express").Router();
const bcrypt = require("bcrypt");
const { client } = require("../configurations/db");
const { authorize } = require("../middleware/auth");
const { jwtGenerator } = require("../configurations/jwt");

//authorization
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await client.query(
      `SELECT * FROM users WHERE user_email = '${email}'`
    );

    if (user.rows.length > 0) {
      return res.status(401).json("User exists, try different email");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await client.query(
      `INSERT INTO users (user_email, user_password) VALUES ('${email}', '${bcryptPassword}') RETURNING *`
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error, could not register User.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user_id = "";
  try {
    const user = await client.query(
      `SELECT * FROM users WHERE user_email = '${email}'`
    );
    if (user) {
      user_id = user.rows[0].user_id;
    }

    const validatePassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validatePassword) {
      return res.status(401).json("Wrong Password");
    }

    if (user.rows.length === 0) {
      return res.status(401).json("Wrong Useremail");
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken, user_id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error, could not Login");
  }
});

router.post("/verifyToken", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
