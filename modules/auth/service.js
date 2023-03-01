const { User, Session } = require("./model");

const create = async (body) => User.create(body);

const findUser = async (id) => User.findById(id);

const getbyKey = async (key) => User.findOne(key);

const updateById = async (id, body) => User.findByIdAndUpdate(id, body, { new: true });

const createSession = async (uid) => Session.create({uid});

const findSession = async (id) => Session.findById(id);

const deleteSession = async (id) => Session.findByIdAndDelete(id);

module.exports = { create, findUser, getbyKey, updateById, createSession, findSession, deleteSession };
