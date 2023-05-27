const router = require('express').Router();
const cardsController = require('../controllers/cards');

router.get('/cards', cardsController.getCards);

router.post('/cards', cardsController.createCard);

router.delete('/cards/:cardId', cardsController.removeCard);

router.put('/cards/:cardId/likes', cardsController.cardLike);

router.delete('/cards/:cardId/likes', cardsController.cardDislike);

module.exports = router;
