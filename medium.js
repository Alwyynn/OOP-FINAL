const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const timerProgress = document.getElementById("timer");
const pauseButton = document.getElementById("pauseButton");
const modal = document.getElementById("myModal");
const restartButton = document.getElementById("restartButton");
const quitButton = document.getElementById("quitButton");
const closeSpan = document.getElementsByClassName("close")[0];
const resumeButton = document.getElementById("resumeButton");
const livesText = document.getElementById("lives");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [
  {
    question: "What is the sum of the first 20 terms of the arithmetic sequence where the first term is 2 and the common difference is 3?",
    choice1: "290",
    choice2: "400",
    choice3: "420",
    choice4: "460",
    answer: 3
  },
  {
    question: "How many different ways can you arrange the letters of the word 'DISCRETE'?",
    choice1: "5,040",
    choice2: "20,160",
    choice3: "40,320",
    choice4: "80,640",
    answer: 2
  },
  {
    question: "In a simple graph with 10 vertices and 15 edges, what is the sum of the degrees of all vertices?",
    choice1: "15",
    choice2: "20",
    choice3: "30",
    choice4: "60",
    answer: 4
  },
  {
    question: "How many subsets does a set with 8 elements have?",
    choice1: "64",
    choice2: "128",
    choice3: "256",
    choice4: "512",
    answer: 3
  },
  {
    question: "What is the minimum number of colors needed to color a complete graph with 5 vertices (K5)?",
    choice1: "2",
    choice2: "3",
    choice3: "4",
    choice4: "5",
    answer: 4
  },
  {
    question: "A force of 50 N moves an object 5 meters in the direction of the force. What is the work done?",
    choice1: "200 J",
    choice2: "250 J",
    choice3: "300 J",
    choice4: "350 J",
    answer: 2
  },
  {
    question: "What is the frequency of a wave with a wavelength of 2 meters traveling at a speed of 10 meters per second?",
    choice1: "2.5 Hz",
    choice2: "5 Hz",
    choice3: "10 Hz",
    choice4: "20 Hz",
    answer: 2
  },
  {
    question: "Which of the following particles has the highest mass?",
    choice1: "Electron",
    choice2: "Proton",
    choice3: "Neutron",
    choice4: "Photon",
    answer: 3
  },
  {
    question: "According to Newton’s second law of motion, what is the acceleration of a 10 kg object when a force of 60 N is applied to it?",
    choice1: "4 m/s²",
    choice2: "5 m/s²",
    choice3: "6 m/s²",
    choice4: "7 m/s²",
    answer: 3
  },
  {
    question: "What is the escape velocity from the surface of Earth, ignoring air resistance?",
    choice1: "7.9 km/s",
    choice2: "11.2 km/s",
    choice3: "15.6 km/s",
    choice4: "20.5 km/s",
    answer: 2
  }
];
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
const TIME_LIMIT = 10;
let timerInterval;
let timeLeft = TIME_LIMIT;

function startGame() {
  questionCounter = 0;
  score = 0;
  lives = 5;
  availableQuestions = [...questions];
  getNewQuestion();
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS || lives === 0) {
    localStorage.setItem("mostRecentScoreMedium", score);
    return window.location.assign("mediumend.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;

  resetTimer();
  startTimer();
}

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    } else {
      handleIncorrectAnswer(selectedAnswer);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      const correctChoice = document.querySelector(`.choice-text[data-number="${currentQuestion.answer}"]`);
      correctChoice.parentElement.classList.remove("correct"); // Remove correct class after timeout
      getNewQuestion();
    }, 1000);
  });
});

function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const progress = (timeLeft / TIME_LIMIT) * 100;
    timerProgress.style.width = progress + "%";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_LIMIT;
  const progress = (timeLeft / TIME_LIMIT) * 100;
  timerProgress.style.width = progress + "%";
}

function handleTimeUp() {
  decrementLives();
  const correctChoice = document.querySelector(
    `.choice-text[data-number="${currentQuestion.answer}"]`
  );
  correctChoice.parentElement.classList.add("correct");

  setTimeout(() => {
    correctChoice.parentElement.classList.remove("correct");
    getNewQuestion();
  }, 1000);
}

function handleIncorrectAnswer(selectedAnswer) {
  decrementLives();
  const correctChoice = document.querySelector(
    `.choice-text[data-number="${currentQuestion.answer}"]`
  );
  correctChoice.parentElement.classList.add("correct");
  const selectedChoice = document.querySelector(
    `.choice-text[data-number="${selectedAnswer}"]`
  );
  selectedChoice.parentElement.classList.add("incorrect");

  setTimeout(() => {
    selectedChoice.parentElement.classList.remove("incorrect");
    correctChoice.parentElement.classList.remove("correct");
  }, 1000);
}

function decrementLives() {
  lives--;
  livesText.innerText = lives;
  if (lives <= 0) {
    localStorage.setItem("mostRecentScoreMedium", score);
    return window.location.assign("mediumend.html");
  }
}

pauseButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  modal.style.display = "block";
});

restartButton.addEventListener("click", () => {
  window.location.reload();
});

quitButton.addEventListener("click", () => {
  window.location.href = "index.html"; // Replace with your homepage URL
});

resumeButton.addEventListener("click", () => {
  modal.style.display = "none";
  startTimer();
});

closeSpan.onclick = () => {
  modal.style.display = "none";
};

startGame();