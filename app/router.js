const express = require('express');
const cardController = require('./controllers/cardController');
const router = express.Router();

const listController = require('./controllers/listController');
const labelController = require('./controllers/labelController');

// list
router.get('/lists', listController.getLists);
router.get('/lists/:id', listController.getOneList);
router.post('/lists', listController.createList);
router.patch('/lists/:id', listController.updateList);
router.delete('/lists/:id', listController.deleteList);

// card
router.get('/cards', cardController.getCards);
router.get('/cards/:id', cardController.getOneCard);
router.get('/lists/:id/cards', cardController.cardsOfOneList);
router.post('/cards', cardController.createCard);
router.patch('/cards/:id', cardController.updateCard);
router.delete('/cards/:id', cardController.deleteCard);

//labels
router.get('/labels', labelController.show);
router.post('/labels', labelController.add);
router.post('/cards/:id/label', labelController.associateCard);
router.patch('/labels/:id', labelController.update);
router.delete('/labels/:id', labelController.delete);
router.delete('/cards/:card_id/label/:label_id', labelController.unassociateCard);

module.exports = router;