const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  game_id: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  question: { type: String, required: true },
  correct_answer: { type: Number, required: true },
  player_answer: Number,
  is_correct: Boolean,
  time_asked: { type: Date, default: Date.now },
  time_answered: Date,
  time_taken: Number
});

module.exports = mongoose.model('Question', QuestionSchema);
