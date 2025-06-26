const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  difficulty: { type: Number, required: true },
  time_started: { type: Date, default: Date.now },
  time_ended: Date,
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  current_score: {
    correct: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  best_score: {
    question_id: { type: Schema.Types.ObjectId, ref: 'Question' },
    question: String,
    answer: Number,
    time_taken: Number
  },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Game', GameSchema);
