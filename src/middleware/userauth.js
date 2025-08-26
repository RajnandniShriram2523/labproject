const jwt = require("jsonwebtoken");

exports.verifyToken1= (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ msg: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "your_secret_key", (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized" });
    req.user = decoded;
    next();
  });
};
