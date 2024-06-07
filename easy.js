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
    question: "What does CPU stand for?",
    choice1: "Central Processing Unit",
    choice2: "Computer Processing Unit",
    choice3: "Central Power Unit",
    choice4: "Computer Power Unit",
    answer: 1
  },
  {
    question: "Which programming language is commonly used for building web applications?",
    choice1: "Java",
    choice2: "C++",
    choice3: "Python",
    choice4: "JavaScript",
    answer: 4
  },
  {
    question: "What does the acronym 'RAM' stand for in computing?",
    choice1: "Random Access Memory",
    choice2: "Read-Only Memory",
    choice3: "Random Algorithmic Memory",
    choice4: "Remote Access Mechanism",
    answer: 1
  },
  {
    question: "What is the main purpose of a compiler?",
    choice1: "To convert high-level programming languages to machine code",
    choice2: "To execute machine instructions",
    choice3: "To debug programs",
    choice4: "To optimize computer memory",
    answer: 1
  },
  {
    question: "Which data structure follows the Last In, First Out (LIFO) principle?",
    choice1: "Queue",
    choice2: "Stack",
    choice3: "Linked List",
    choice4: "Tree",
    answer: 2
  },
  {
    question: "What is the role of an Ethernet cable in computer networking?",
    choice1: "Transmitting data wirelessly",
    choice2: "Connecting devices to the internet",
    choice3: "Establishing wired connections between devices",
    choice4: "Providing power to devices",
    answer: 3
  },
  {
    question: "Which programming paradigm focuses on breaking down problems into smaller, manageable parts?",
    choice1: "Object-Oriented Programming",
    choice2: "Functional Programming",
    choice3: "Procedural Programming",
    choice4: "Modular Programming",
    answer: 4
  },
  {
    question: "What does the term 'IP address' stand for in networking?",
    choice1: "Internet Protocol Address",
    choice2: "Internal Protocol Address",
    choice3: "Internet Provider Address",
    choice4: "International Protocol Address",
    answer: 1
  },
  {
    question: "Which of the following is 'NOT' a type of computer memory?",
    choice1: "ROM (Read-Only Memory)",
    choice2: "RAM (Random Access Memory)",
    choice3: "CPM (Central Processing Memory)",
    choice4: "Cache Memory",
    answer: 3
  },
  {
    question: "Which programming language is often used for system administration, network programming, and web development?",
    choice1: "C#",
    choice2: "Ruby",
    choice3: "Perl",
    choice4: "Swift",
    answer: 3
  }
];
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
const TIME_LIMIT = 15;
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
    localStorage.setItem("mostRecentScoreEasy", score);
    return window.location.assign("easyend.html");
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
    localStorage.setItem("mostRecentScoreEasy", score);
    return window.location.assign("easyend.html");
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