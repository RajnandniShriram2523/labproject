  const jwt = require("jsonwebtoken");

  exports.verifyToken1 = (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res.status(403).json({ status: "error", message: "No token provided" });
      }

      // Expect: "Bearer <token>"
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(403).json({ status: "error", message: "Token missing in header" });
      }

      jwt.verify(token, process.env.JWT_SECRET || "your_secret_key", (err, decoded) => {
        if (err) {
          return res.status(401).json({ status: "error", message: "Unauthorized: Invalid token" });
        }

        req.user = decoded; // decoded will contain { id, role, ... }
        next(); // ✅ continue to controller
      });
    } catch (err) {
      console.error("verifyToken1 error:", err);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };
