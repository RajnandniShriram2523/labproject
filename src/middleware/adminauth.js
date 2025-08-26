const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET ; 

// ✅ Verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(403).json({ message: "Token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // store user info in request
    next();
  });
};

// ✅ Verify Admin Role
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { verifyToken, verifyAdmin };