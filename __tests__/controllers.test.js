const mongoose = require('mongoose');
const { startGame } = require('../controllers/startGame.controller'); // عدل حسب مسارك
const { submitAnswer } = require('../controllers/submitAnswer.controller');
const { endGame } = require('../controllers/endGame.controller');

const Player = require('../models/player.model');
const Game = require('../models/game.model');
const Question = require('../models/question.model');

// Setup in-memory MongoDB for tests
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Player.deleteMany({});
  await Game.deleteMany({});
  await Question.deleteMany({});
});

describe('Game API Controllers', () => {

  describe('startGame', () => {
    it('should reject invalid name or difficulty', async () => {
      const req = { body: { name: 'x', difficulty: 10 } };
      const res = mockResponse();

      await startGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Invalid input')
      }));
    });

    it('should create new player and game on valid input', async () => {
      const req = { body: { name: 'Tester', difficulty: 2 } };
      const res = mockResponse();

      await startGame(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Hello Tester'),
        submit_url: expect.any(String),
        question: expect.any(String),
        time_started: expect.any(String)
      }));

      const player = await Player.findOne({ name: 'Tester' });
      expect(player).not.toBeNull();
      expect(player.total_games).toBe(1);
    });
  });

  describe('submitAnswer', () => {
    it('should reject invalid game_id', async () => {
      const req = { params: { game_id: 'invalidid' }, body: { answer: 5 } };
      const res = mockResponse();

      await submitAnswer(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Invalid game ID')
      }));
    });

    it('should reject non-number answer', async () => {
      const game = await createTestGame();
      const req = { params: { game_id: game._id.toString() }, body: { answer: "notnumber" } };
      const res = mockResponse();

      await submitAnswer(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Answer must be a number')
      }));
    });

    // يمكنك إضافة المزيد من الاختبارات مع تحضير بيانات أكثر تعقيدًا
  });

  describe('endGame', () => {
    it('should return 400 for invalid game_id', async () => {
      const req = { params: { game_id: '123' } };
      const res = mockResponse();

      await endGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if game not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const req = { params: { game_id: id.toString() } };
      const res = mockResponse();

      await endGame(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should end game and return stats', async () => {
      const game = await createTestGame();

      const req = { params: { game_id: game._id.toString() } };
      const res = mockResponse();

      await endGame(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: expect.any(String),
        difficulty: expect.any(Number),
        current_score: expect.any(String),
        average_score: expect.any(String),
        total_time_spent: expect.any(Number),
        best_score: expect.any(Object),
        history: expect.any(Array)
      }));
    });
  });

});

  function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

async function createTestGame() {
   const player = await Player.create({
    name: 'TestPlayer',
    total_games: 1,
    average_score: 0,
    games_played: []
  });

   const game = await Game.create({
    player: player._id,
    difficulty: 2,
    time_started: new Date(),
    status: 'active',
    current_score: { correct: 0, total: 0 },
    questions: []
  });

  // create a question without answer
  const question = await Question.create({
    game_id: game._id,
    question: '2 + 2',
    correct_answer: 4,
    time_asked: new Date()
  });

  game.questions.push(question._id);
  await game.save();

  player.games_played.push(game._id);
  await player.save();

  return game;
}
