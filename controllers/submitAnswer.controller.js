const mongoose = require('mongoose');
const Player = require('../models/player.model');
const Game = require('../models/game.model');
const Question = require('../models/question.model');
const { generateMathQuestion } = require('../utils/generateMathQuestion');

exports.submitAnswer= async (req, res) => {
  try {
    const { game_id } = req.params;
    const { answer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(game_id)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    if (typeof answer !== 'number') {
      return res.status(400).json({ message: 'Answer must be a number' });
    }

    const game = await Game.findById(game_id).populate('player');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.status === 'ended') {
      return res.status(400).json({ message: 'This game has already ended' });
    }

     const lastQuestion = await Question.findOne({
      game_id: game._id,
      player_answer: { $exists: false }
    }).sort({ time_asked: -1 });

    if (!lastQuestion) {
      return res.status(400).json({ message: 'No active question found for this game.' });
    }

     const now = new Date();

     const previousQuestion = await Question.findOne({
      game_id: game._id,
      _id: { $ne: lastQuestion._id },
      time_answered: { $exists: true }
    }).sort({ time_answered: -1 });

    const baseTime = previousQuestion?.time_answered || game.time_started;
    const time_taken = Math.round((now - baseTime) / 1000);

    const is_correct = Number(answer.toFixed(2)) === Number(lastQuestion.correct_answer.toFixed(2));
    lastQuestion.player_answer = answer;
    lastQuestion.is_correct = is_correct;
    lastQuestion.time_answered = now;
    lastQuestion.time_taken = time_taken;
    await lastQuestion.save();

    if (is_correct) game.current_score.correct += 1;
    game.current_score.total += 1;
    await game.save();

    const { question, answer: newAnswer } = generateMathQuestion(game.difficulty);
    const nextQuestion = await Question.create({
      game_id: game._id,
      question,
      correct_answer: newAnswer,
      time_asked: new Date()
    });

    game.questions.push(nextQuestion._id);
    await game.save();
    const ratio = game.current_score.total === 0
  ? 0
  : Number(((game.current_score.correct / game.current_score.total) * 100).toFixed(2));
    return res.status(200).json({
      result: is_correct
        ? `Good job ${game.player.name}, your answer is correct!`
        : `Sorry ${game.player.name}, your answer is incorrect.`,
      time_taken:  time_taken +"s" ,
      next_question: {
        submit_url: `/game/${game._id}/submit`,
        question: nextQuestion.question
      },

     current_score: ratio +"%"


    });
  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
