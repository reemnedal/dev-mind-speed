const express = require('express');
const router = express.Router();
const { startGame } = require('../controllers/startGame.controller');
const { submitAnswer } = require('../controllers/submitAnswer.controller');
const { endGame } = require('../controllers/endGame.controller');

router.post('/game/start', startGame);
router.post('/game/:game_id/submit', submitAnswer);
router.post('/game/:game_id/end', endGame);

module.exports = router;
