const Player = require('../models/player.model');
const Game = require('../models/game.model');
const Question = require('../models/question.model');
const mongoose = require('mongoose');
const { generateMathQuestion } = require('../utils/generateMathQuestion');

    exports.startGame = async (req, res) => {
      try {
        const { name, difficulty } = req.body;

    const nameRegex = /^[a-zA-Z0-9 ]{2,30}$/;
    if (!name || !nameRegex.test(name) || typeof difficulty !== 'number' || difficulty < 1 || difficulty > 4) {
      return res.status(400).json({ message: 'Invalid input: name must be 2-30 characters (letters/numbers only), and difficulty must be a number between 1 and 4.' });
    }

    let player = await Player.findOne({ name });
    if (!player) {
      player = await Player.create({ name, total_games: 0, average_score: 0, games_played: [] });
    }

    const game = new Game({
      player: player._id,
      difficulty,
      time_started: new Date()
    });

    await game.save();

    const { question, answer } = generateMathQuestion(difficulty);

    const newQuestion = new Question({
      game_id: game._id,
      question,
      correct_answer: answer,
      time_asked: new Date()
    });

    await newQuestion.save();

    game.questions.push(newQuestion._id);
    await game.save();

    player.games_played.push(game._id);
    player.total_games += 1;
    await player.save();

    res.status(201).json({
    message: `Hello ${name}, find your submit API URL below.`,
    submit_url: `/game/${game._id}/submit`,
    question,
    time_started: game.time_started.toLocaleString()
    });

  } catch (err) {
    console.error('Error starting game:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
