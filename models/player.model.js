const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  name: { type: String, required: true, unique: true },
  games_played: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  average_score: Number,
  total_games: Number
});

module.exports = mongoose.model('Player', PlayerSchema);
