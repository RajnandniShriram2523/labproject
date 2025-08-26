let adminmodel=require("../models/admincurdmodel.js");
const SECRET_KEY = process.env.JWT_SECRET || "Rajnandni@123";
let bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

exports.homepage = (req, res) => {
  res.send("home page");
}

exports.saveAdmin = async (req, res) => {
  try {
    let { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username & Password required" });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // save admin with role
    let result = await adminmodel.addAdmin(username, hashedPassword, role || 'admin');

    return res.status(201).json({ message: "Admin created successfully", result });
  } catch (err) {
    console.error("Error saving admin:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.adminLogin = async (req, res) => {
  try {
    let { username, password } = req.body;
    console.log("Request creds:", username, password);

    const admin = await adminmodel.adminLogin(username);

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.admin_password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin.admin_id, role: admin.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: admin.role,
      username: admin.admin_name,
    });

  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
