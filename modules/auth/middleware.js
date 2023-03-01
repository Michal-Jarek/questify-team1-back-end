const Joi = require("joi");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const { User, Session } = require("./model");

const secret = process.env.JTW_ACCESS_SECRET;

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const sidSchema = Joi.object({
  sid: Joi.string().required(),
});

const validateData = (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  req.body = value;
  next();
};

const validateSid = (req, res, next) => {
  const { error, value } = sidSchema.validate(req.body);
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
  new JwtStrategy(params, async (payload, done) => {
    try {
      const user = await User.findById(payload.uid);
      const session = await Session.findById(payload.sid);
      return done(null, { user, session });
    } catch (err) {
      return done(err, false);
    }
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, data) => {
    // rome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
    if (!data.user || !data.session || error) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = data.user;
    req.session = data.session;
    next();
  })(req, res, next);
};

module.exports = { validateData, validateSid, auth };
