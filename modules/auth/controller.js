const bcryp = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();

const authService = require("./service");

const accessSecret = process.env.JTW_ACCESS_SECRET;
const refreshSecret = process.env.JTW_REFRESH_SECRET;

const register = async (req, res) => {
  const { email, password } = req.body;
  const salt = bcryp.genSaltSync(10);
  const hashedPassword = bcryp.hashSync(password, salt);

  try {
    const user = await authService.create({ email, password: hashedPassword });
    const session = await authService.createSession(user.id);

    const accessToken = jwt.sign(
      { uid: user.id, sid: session.id },
      accessSecret,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { uid: user.id, sid: session.id },
      refreshSecret,
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({
      accessToken,
      refreshToken,
      sid: session.id,
      userData: { email: user.email, id: user.id },
    });
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
  const session = await authService.createSession(user.id);

  const accessToken = jwt.sign(
    { uid: user.id, sid: session.id },
    accessSecret,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = jwt.sign(
    { uid: user.id, sid: session.id },
    refreshSecret,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    accessToken,
    refreshToken,
    sid: session.id,
    userData: { email, id: user.id },
  });
};

const logout = async (req, res) => {
  await authService.deleteSession(req.session.id);
  return res.sendStatus(204);
};

const refresh = async (req, res) => {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!isValidObjectId(req.body.sid)) {
    return res.status(400).json({
      message: "Bad request. Invalid session Id",
    });
  }

  const activeSession = await authService.findSession(req.body.sid);
  if (!activeSession) {
    return res.status(404).json({ message: "Invalid session" });
  }

  const reqToken = authorizationHeader.replace("Bearer ", "");
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(reqToken, refreshSecret);
  } catch (err) {
    await authService.deleteSession(req.body.sid);
    return res.status(401).json({ message: "Not authorized" });
  }

  const user = await authService.findUser(decodedToken.uid);
  const session = await authService.findSession(decodedToken.sid);
  if (!user) {
    return res.status(404).json({ message: "Invalid user" });
  }
  if (!session) {
    return res.status(404).json({ message: "Invalid session" });
  }
  await authService.deleteSession(session.id);
  const newSession = await authService.createSession(user.id);

  const newAccessToken = jwt.sign(
    { uid: user.id, sid: newSession.id },
    accessSecret,
    {
      expiresIn: "1h",
    }
  );

  const newRefreshToken = jwt.sign(
    { uid: user.id, sid: newSession.id },
    refreshSecret,
    {
      expiresIn: "1d",
    }
  );

  return res.status(200).json({
    newAccessToken,
    newRefreshToken,
    newSid: newSession.id,
  });
};

module.exports = { register, login, logout, refresh };
