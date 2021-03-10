const jwt = require("jsonwebtoken");

//middleware will continue if the token is inside the local storage
const authorize = (req, res, next) => {
  const token = req.header("jwt_token");

  // return if there is no token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = {
  authorize,
};
