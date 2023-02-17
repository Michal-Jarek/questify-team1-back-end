const bcryp = require("bcryptjs");

const authService = require("./service");

const register = async (req, res) => {
  const { email, password } = req.body;
  const salt = bcryp.genSaltSync(10);
  const hashedPassword = bcryp.hashSync(password, salt);

  try {
    const user = await authService.create({ email, password: hashedPassword });

    return res
      .status(201)
      .json({ email: user.email, id: user.id });
  } catch {
    return res.status(409).json({ message: "Email in use" });
  }
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

module.exports = { register, login, logout };
