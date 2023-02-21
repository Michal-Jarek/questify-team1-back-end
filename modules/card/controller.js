const { ObjectID } = require("mongodb");
const { isValidObjectId } = require("mongoose");
const cardService = require("./service");

const getAllCards = async (req, res) => {
  const userId = req.user.id;
  const cards = await cardService.getAllCards(userId);
  return res.status(200).json({ cards });
};

const createCard = async (req, res) => {
  const owner = req.user.id;
  const { title, difficulty, date, time, category, type } = req.body;

  const card = await cardService.create({
    title,
    difficulty,
    date,
    time,
    category,
    type,
    owner,
  });

  return res.status(201).json({ card });
};

const editCard = async (req, res) => {
  const ownerId = req.user.id;
  const cardId = req.params.cardId;
  const { title, difficulty, date, time, category, type } = req.body;

  if (!isValidObjectId(cardId)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }


  if (!title && !difficulty && !date && !time && !category && !type) {
    return res.status(400).json({ message: "missing fields" });
  }

  const findCard = await cardService.findCardbyId(cardId);

  if (!findCard || findCard.owner != ownerId) {
    return res.status(400).json({ message: "Invalid card id" });
  }

  const card = await cardService.findAndUpdateCard(cardId, {
    title,
    difficulty,
    date,
    time,
    category,
    type,
  });

  return res.status(200).json({ card });
};

const checkCardComplete = async (req, res) => {
  const ownerId = req.user.id;
  const cardId = req.params.cardId;

  if (!isValidObjectId(cardId)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }

  const findCard = await cardService.findCardbyId(cardId);

  if (!findCard || findCard.owner != ownerId) {
    return res.status(400).json({ message: "Invalid card id" });
  }
  const status = findCard.status === "complete" ? "incomplete" : "complete";

  const card = await cardService.findAndUpdateCard(cardId, { status });

  return res.status(200).json({ card });
};

const deleteCard = async (req, res) => {
  const ownerId = req.user.id;
  const cardId = req.params.cardId;

  if (!isValidObjectId(cardId)) {
    return res.status(400).json({
      message:
        "Bad Request. Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }

  const findCard = await cardService.findCardbyId(cardId);

  if (!findCard || findCard.owner != ownerId) {
    return res.status(400).json({ message: "Invalid card id" });
  }

  await cardService.findAndDeleteCard(cardId);

  return res.sendStatus(204);
};

module.exports = {
  getAllCards,
  createCard,
  editCard,
  checkCardComplete,
  deleteCard,
};
