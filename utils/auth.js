const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } catch (err) {
    console.error("Something went wrong with the auth middleware:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
