const User = require("./model");

const create = async (body) => User.create(body)

module.exports = {create}