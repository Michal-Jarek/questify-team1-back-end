const express = require("express");

const cardController = require("../modules/card/controller");
const { auth } = require("../modules/auth/middleware");
const {
  validateData,
  validateDataForEditing,
} = require("../modules/card/middleware");

const router = express.Router();

router.get("/", auth, cardController.getAllCards);

router.post("/", auth, validateData, cardController.createCard);

router.patch("/:cardId", auth, validateDataForEditing, cardController.editCard);

router.patch("/:cardId/complete", auth, cardController.checkCardComplete);

router.delete("/:cardId", auth, cardController.deleteCard);

module.exports = router;
