const bcryp = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authService = require("./service");

const secretKey = process.env.JTW_SECRET;

const register = async (req, res) => {
  const { email, password } = req.body;
  const salt = bcryp.genSaltSync(10);
  const hashedPassword = bcryp.hashSync(password, salt);

  try {
    const user = await authService.create({ email, password: hashedPassword });
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
    await authService.updateById(user.id, { token });

    return res
      .status(201)
      .json({ token, user: { email: user.email, id: user.id } });
  } catch {
    return res.status(409).json({ message: "Email in use" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.getbyKey({ email });

  if (!(user && bcryp.compareSync(password, user.password))) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
  await authService.updateById(user.id, { token });

  return res.status(200).json({ token, user: { email, id: user.id } });
};

const logout = async (req, res) => {
  await authService.updateById(req.user.id, { token: null });
  return res.sendStatus(204);
};

module.exports = { register, login, logout };
