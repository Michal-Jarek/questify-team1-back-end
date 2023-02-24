const User = require("./model");

const create = async (body) => User.create(body);

const getbyKey = async (key) => User.findOne(key);

const updateById = async (id, body) => User.findByIdAndUpdate(id, body, { new: true });

module.exports = { create, getbyKey, updateById };
