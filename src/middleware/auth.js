const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function requireManager(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = { signToken, requireAuth, requireManager, requireAdmin };
