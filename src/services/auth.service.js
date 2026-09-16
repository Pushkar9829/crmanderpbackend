const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const { signToken } = require("../middleware/auth");

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = signToken(user);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}

function me(user) {
  return user;
}

module.exports = { login, me };
