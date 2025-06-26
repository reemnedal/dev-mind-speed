const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const gameRoutes = require('./routes/game.routes');
app.use(gameRoutes);

app.get('/', (req, res) => {
  res.send('Dev Mind Speed API is running');
});

module.exports = app;
