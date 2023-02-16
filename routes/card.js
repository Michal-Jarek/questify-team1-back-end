const express = require('express');

const cardController = require("../modules/card/controller")

const router = express.Router();

router.get('/', cardController.getAllCards);

router.post('/', cardController.createCard);

router.patch('/:cardId', cardController.editCard);

router.patch('/:cardId/complete', cardController.checkCardComplete);

router.delete('/:cardId', cardController.deleteCard);

module.exports = router;
