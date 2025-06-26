const mongoose = require('mongoose');
const Game = require('../models/game.model');
const Question = require('../models/question.model');

exports.endGame = async (req, res) => {
  try {
    const { game_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(game_id)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    const game = await Game.findById(game_id).populate('player');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

if (game.status === 'ended') {
  const allQuestions = await Question.find({ game_id });

  let totalTime = 0;
  let bestQuestion = null;

  const history = allQuestions.map(q => {
    if (q.time_taken) {
      totalTime += q.time_taken;

      if (q.is_correct && (!bestQuestion || q.time_taken < bestQuestion.time_taken)) {
        bestQuestion = {
          question: q.question,
          answer: q.correct_answer,
          time_taken: q.time_taken
        };
      }
    }

    return {
      question: q.question,
      player_answer: q.player_answer ?? null,
      correct_answer: q.correct_answer,
      time_taken: q.time_taken ?? null
    };
  });

  const { correct, total } = game.current_score;
  const percentage = total === 0 ? 0 : Number(((correct / total) * 100).toFixed(2));
  const player = game.player;

  if (total > 0) {
    const totalScore = (player.average_score || 0) * (player.total_games - 1) + percentage;
    player.average_score = Number((totalScore / player.total_games).toFixed(2));
    await player.save();
  }

  return res.status(200).json({
    game_id: game._id,
    name: game.player.name,
    difficulty: game.difficulty,
    current_score: `${percentage}%`,
    average_score: `${player.average_score}%`,
    total_time_spent: totalTime,
    best_score: bestQuestion ?? {},
    history
  });
}

    const allQuestions = await Question.find({ game_id });

    let totalTime = 0;
    let bestQuestion = null;

    const history = allQuestions.map(q => {
      if (q.time_taken) {
        totalTime += q.time_taken;

    if (q.is_correct && (!bestQuestion || q.time_taken < bestQuestion.time_taken)) {
          bestQuestion = {
            question: q.question,
            answer: q.correct_answer,
            time_taken: q.time_taken
          };
        }
      }

      return {
        question: q.question,
        player_answer: q.player_answer ?? null,
        correct_answer: q.correct_answer,
        time_taken: q.time_taken ?? null
      };
    });

    game.status = 'ended';
    game.time_ended = new Date();
    await game.save();

    const { correct, total } = game.current_score;
    const percentage = total === 0 ? 0 : Number(((correct / total) * 100).toFixed(2));
    const player = game.player;

    if (total > 0) {
    const totalScore = (player.average_score || 0) * (player.total_games - 1) + percentage;
    player.average_score = Number((totalScore / player.total_games).toFixed(2));
    await player.save();
    }

    res.status(200).json({
      game_id: game._id,
      name: game.player.name,
      difficulty: game.difficulty,
      current_score: `${percentage}%`,
      average_score: `${player.average_score}%`,
      total_time_spent: totalTime,
      best_score: bestQuestion ?? {},
      history
    });

  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
