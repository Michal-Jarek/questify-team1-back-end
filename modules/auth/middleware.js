const Joi = require("joi");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const User = require("./model");

const secret = process.env.JTW_SECRET;

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const validateData = (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(params, (payload, done) => {
    User.findById(payload.id, (err, user) => {
      if (err) return done(err, false);
      if (user) return done(null, user);
      return done(null, false);
    });
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user.token || error) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { validateData, auth };
