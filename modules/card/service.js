const Card = require("./model");

const create = async (body) => Card.create(body);

const getAllCards = async (id) => Card.find({ owner: id });

const findCardbyId = async (id) => Card.findById(id);

const findAndUpdateCard = async (id, body) => Card.findByIdAndUpdate(id, body, { new: true });

const findAndDeleteCard = async (id) => Card.findByIdAndDelete(id);

module.exports = { create, getAllCards, findCardbyId, findAndUpdateCard, findAndDeleteCard };
