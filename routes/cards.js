const router = require('express').Router();
const cardsController = require('../controllers/cards');

router.get('', cardsController.getCards);

router.post('', cardsController.createCard);

router.delete('/:cardId', cardsController.removeCard);

router.put('/:cardId/likes', cardsController.cardLike);

router.delete('/:cardId/likes', cardsController.cardDislike);

module.exports = router;
