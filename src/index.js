const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

// gameInfo object

const gameInfo = {
  lives: 10,
  answers: [
    { word: "piano", hint: "A black and white instrument" },
    { word: "watch", hint: "Something you wear on your wrist" },
    { word: "clock", hint: "Something that tells the time" },
    { word: "lamp", hint: "Something that gives you light" },
    { word: "notebook", hint: "Something you write in" },
    { word: "telephone", hint: "Something you can talk to someone on" },
    { word: "coffee", hint: "A hot drink that wakes you up" },
    { word: "kettle", hint: "Something that makes water really hot" },
    { word: "computer", hint: "A machine you use to go on the internet" },
    { word: "birthday", hint: "A celebration people have each year" }
  ]
};

let randomIndex;
let selectedWord;
let wrongLetters = [];

const answerWord = document.getElementById("answer-word");
const hint = document.getElementById("clue");
const alphabetButtons = document.getElementById("buttons");
const livesAvailable = document.getElementById("mylives");
livesAvailable.textContent = gameInfo.lives;
const incorrect = document.getElementById("wrong-letters");
const myStickman = document.getElementById("stickman");
const context = myStickman.getContext("2d");

const canvas = () => {
  context.beginPath();
  context.strokeStyle = "#ead2d5";
  context.lineWidth = 5;
};

const head = () => {
  context.beginPath();
  context.arc(60, 40, 20, 0, Math.PI * 2, true);
  context.stroke();
};

const hangmanDrawing = {
  leftLeg: () => draw(60, 100, 30, 120),
  rightLeg: () => draw(60, 100, 90, 120),
  leftArm: () => draw(60, 70, 30, 80),
  rightArm: () => draw(60, 70, 90, 80),
  torso: () => draw(60, 58, 60, 100),
  head: () => head(),
  frame4: () => draw(60, 0, 60, 20),
  frame3: () => draw(0, 0, 60, 0),
  frame2: () => draw(0, 150, 0, 0),
  frame1: () => draw(0, 150, 123, 150)
};

let keys = Object.keys(hangmanDrawing);

const draw = (startX, startY, endX, endY) => {
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
};

const generateRandomIndex = () => {
  randomIndex = Math.floor(Math.random() * gameInfo.answers.length);
};

const newGame = () => {
  generateRandomIndex();
  selectedWord = gameInfo.answers[randomIndex].word;
  canvas();
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const resetGame = () => {
  window.location.reload("Refresh");
  newGame();
  clearCanvas();
};

const getHint = () => {
  hint.textContent = gameInfo.answers[randomIndex].hint;
};

const punchSound = () => {
  var audio = new Audio("./src/PUNCH.mp3");
  audio.loop = false;
  audio.play();
};

const screamSound = () => {
  var audio = new Audio("./src/SCREAM.mp3");
  audio.loop = false;
  audio.play();
};

document.getElementById("reset").addEventListener("click", resetGame);
document.getElementById("hint").addEventListener("click", getHint);
newGame();

const checkAnswer = (event) => {
  let guessedLetter = event.target.textContent;

  if (selectedWord.includes(guessedLetter)) {
    for (let counter = 0; counter < selectedWord.length; counter++) {
      if (selectedWord[counter] === guessedLetter) {
        let answerLetter = document.getElementById("answerLetter_" + counter);
        answerLetter.innerHTML = guessedLetter;
      }
      console.log(selectedWord[counter]);
    }
    console.log("Correct");
  } else {
    if (gameInfo.lives > 1) {
      gameInfo.lives--;
      hangmanDrawing[keys[gameInfo.lives]]();
      punchSound();
      livesAvailable.textContent = gameInfo.lives;
      wrongLetters.push(guessedLetter);
      incorrect.textContent = wrongLetters;
    } else {
      hangmanDrawing[keys[0]]();
      answerWord.innerHTML = "Game Over! Click New Game to start again.";
      livesAvailable.textContent = 0;
      screamSound();
      alphabetButtons.remove();
      hint.remove();
    }
  }
};

alphabet.forEach((letter) => {
  const letterButton = document.createElement("button");
  letterButton.textContent = letter;
  letterButton.addEventListener("click", checkAnswer);
  alphabetButtons.appendChild(letterButton);
});

let wordLetters = document.createElement("ul");
wordLetters.setAttribute("id", "my-word");
answerWord.appendChild(wordLetters);

for (var i = 0; i < selectedWord.length; i++) {
  let letter = document.createElement("li");
  letter.setAttribute("id", "answerLetter_" + i);
  letter.innerHTML = "_";
  wordLetters.appendChild(letter);
}
