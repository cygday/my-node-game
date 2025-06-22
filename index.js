const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

let secretNumber = generateNumber();

function generateNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

app.get('/', (req, res) => {
});

app.post('/guess', (req, res) => {
    const { guess } = req.body;

if (!guess || typeof guess !== 'number' )
{
    return res.status(400).json({ message: 'plese provide a valid number' });
}

if (guess === secretNumber) {
    const oldNumber = secretNumber;
    secretNumber = generateNumber(); //reset the game
    return res.json ({ message : ' correct the number was  ${oldNumber} . new game started' });
} else if (guess < secretNumber) {
    return res.json({ message: 'too low, try again' });
} else {
    return res.json({ message: ' too high. try again' });
}
});

app.listen(port, () => {
    console.log('game server running at http://localhost:${port}');
});