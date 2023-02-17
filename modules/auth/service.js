const User = require("../userModel");

const create = async (body) => User.create(body)

module.exports = {create}