# 🧠 Dev Mind Speed – Math Game API

A simple math-based game API built with **Node.js**, **Express**, and **MongoDB**. Players can start a game, solve generated math questions, and end the game to view their performance statistics.

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone  https://github.com/reemnedal/dev-mind-speed.git
cd dev-mind-speed
```

### 2. Dependencies I used 
```bash
npm init -y
npm install express mongoose cors
npm install --save-dev nodemon
npm install dotenv
npm install --save-dev jest
npm install --save-dev supertest
npm install --save-dev mongodb-memory-server
```

### 3. Run the Application
```bash
npm run dev
```

## 🧪 Testing

This project uses **Jest** and **Supertest** for automated API testing. Tests run against an in-memory MongoDB instance using **mongodb-memory-server**.

To run tests:
```bash
npm test
```

## 📮 API Endpoints

### 🎮 1. Start Game
**Endpoint:** `POST /game/start`

**Request Body:**
```json
{
  "name": "Reem",
  "difficulty": 3
}
```

**Rules:**
- `name`: String between 2-30 characters (letters and numbers only, no symbols allowed)
- `difficulty`: Number from 1 to 4
- Players can reuse the same name for multiple games - all games are tracked

**Response:**
```json
{
    "message": "Hello Reem, find your submit API URL below.",
    "submit_url": "/game/685d9d04778490aafabe8f00/submit",
    "question": "129 + 388 * 906 + 4",
    "time_started": "6/26/2025, 10:18:28 PM"
}
```

### 📝 2. Submit Answer
**Endpoint:** `POST /game/:game_id/submit`

**Request Body:**
```json
{
  "answer": 351661
}
```

**Rules:**
- `answer`: Must be a number
- Cannot submit after game is ended

**Correct Answer Response:**
```json
{
    "result": "Good job Reem, your answer is correct!",
    "time_taken": "205s",
    "next_question": {
        "submit_url": "/game/685d9d04778490aafabe8f00/submit",
        "question": "916 / 731 - 639 / 453"
    },
    "current_score": "100%"
}
```

**Wrong Answer Response:**
```json
{
    "result": "Sorry Reem, your answer is incorrect.",
    "time_taken": "33s",
    "next_question": {
        "submit_url": "/game/685d9d04778490aafabe8f00/submit",
        "question": "500 / 938 - 629 * 202"
    },
    "current_score": "50%"
}
```

### 🏁 3. End Game
**Endpoint:** `GET /game/:game_id/end`

**Response:**
```json
{
    "game_id": "685d9d04778490aafabe8f00",
    "name": "Reem",
    "difficulty": 3,
    "current_score": "50%",
    "average_score": "50%",
    "total_time_spent": 238,
    "best_score": {
        "question": "129 + 388 * 906 + 4",
        "answer": 351661,
        "time_taken": 205
    },
    "history": [
        {
            "question": "129 + 388 * 906 + 4",
            "player_answer": 351661,
            "correct_answer": 351661,
            "time_taken": 205
        },
        {
            "question": "916 / 731 - 639 / 453",
            "player_answer": 55,
            "correct_answer": -0.16,
            "time_taken": 33
        },
        {
            "question": "500 / 938 - 629 * 202",
            "player_answer": null,
            "correct_answer": -127057.47,
            "time_taken": null
        }
    ]
}
```

## 🎯 Game Flow

1. **Start Game**: Player provides name and difficulty level to begin
2. **Solve Questions**: Player submits numerical answers to generated math questions
3. **Continue Playing**: After each answer, player receives the next question
4. **End Game**: Player can end the game at any time using the game ID
5. **View Results**: Final statistics include current score, average score across all games, and detailed history

## 🔧 Features

- **Multiple Games per Player**: Same name can be used for multiple games with complete history tracking
- **Difficulty Levels**: 4 different difficulty levels (1-4) for varied challenge
- **Real-time Scoring**: Instant feedback with current score percentage
- **Performance Analytics**: Average score calculation across all games
- **Input Validation**: Secure validation for all inputs and game states

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library for API testing
- **MongoDB Memory Server** - In-memory database for testing

 
## 🚦 Getting Started

1. Follow the setup instructions above
2. Start the server with `npm run dev`
3. Use Postman or any API client to test the endpoints
4. Begin with the `/game/start` endpoint to create your first game!

---
 
