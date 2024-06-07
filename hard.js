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
    question: "In how many ways can you arrange the letters of the word 'MATHEMATICS'?",
    choice1: "10! (factorial)",
    choice2: "11! (factorial)",
    choice3: "12! (factorial)",
    choice4: "13! (factorial)",
    answer: 3,
    explanation: "The word 'MATHEMATICS' has 11 letters, but there are repeating letters. So, the correct answer is 12! (factorial)."
  },
  {
    question: "What is the result of 5 factorial (5!)?",
    choice1: "15",
    choice2: "120",
    choice3: "25",
    choice4: "720",
    answer: 2,
    explanation: "The factorial of 5 (5!) is calculated as 5 × 4 × 3 × 2 × 1, which equals 120."
  },
  {
    question: "Which of the following is NOT a fundamental component of digital logic design?",
    choice1: "Flip-flop",
    choice2: "Transistor",
    choice3: "Capacitor",
    choice4: "Gate",
    answer: 3,
    explanation: "Digital logic design primarily involves components such as transistors, gates (e.g., AND, OR, NOT), and flip-flops, but capacitors are not typically considered fundamental components in this context."
  },
  {
    question: "Which law in Boolean algebra states that the complement of the sum of two variables is equal to the product of their complements?",
    choice1: "Identity law",
    choice2: "De Morgan's law",
    choice3: "Commutative law",
    choice4: "Distributive law",
    answer: 2,
    explanation: "De Morgan's law states that the complement of the sum of two variables is equal to the product of their complements, expressed as ¬(A + B) = ¬A ⋅ ¬B."
  },
  {
    question: "What is the SI unit of electric charge?",
    choice1: "Ampere (A)",
    choice2: "Volt (V)",
    choice3: "Coulomb (C)",
    choice4: "Ohm (Ω)",
    answer: 3,
    explanation: "The SI unit of electric charge is the coulomb (C), named after the French physicist Charles-Augustin de Coulomb."
  },
  {
    question: "Which law in physics states that for every action, there is an equal and opposite reaction?",
    choice1: "Newton's first law",
    choice2: "Newton's second law",
    choice3: "Newton's third law",
    choice4: "Law of gravitation",
    answer: 3,
    explanation: "Newton's third law of motion states that for every action, there is an equal and opposite reaction. This law is fundamental in understanding forces and motion."
  },
  {
    question: "What is the formula to calculate the velocity of an object given its displacement and time taken?",
    choice1: "v = d / t",
    choice2: "v = d * t",
    choice3: "v = t / d",
    choice4: "v = d + t",
    answer: 1,
    explanation: "The formula to calculate velocity (v) is given by dividing the displacement (d) by the time taken (t)."
  },
  {
    question: "Which theorem in discrete mathematics states that any integer greater than 1 can be written as a unique product of prime numbers?",
    choice1: "Fundamental theorem of arithmetic",
    choice2: "Euler's theorem",
    choice3: "Fermat's little theorem",
    choice4: "Chinese remainder theorem",
    answer: 1,
    explanation: "The fundamental theorem of arithmetic states that any integer greater than 1 can be written uniquely as a product of prime numbers, up to the order of the factors."
  },
  {
    question: "Which programming language is commonly used for low-level programming and embedded systems?",
    choice1: "Java",
    choice2: "Python",
    choice3: "C",
    choice4: "JavaScript",
    answer: 3,
    explanation: "C is commonly used for low-level programming and embedded systems due to its efficiency, close-to-hardware features, and portability."
  },
  {
    question: "In digital electronics, what does the term 'clock frequency' refer to?",
    choice1: "The speed at which data is transmitted over a network",
    choice2: "The frequency of the clock signal used to synchronize operations in a digital system",
    choice3: "The frequency of the power supply in a digital circuit",
    choice4: "The frequency at which a microprocessor operates",
    answer: 2,
    explanation: "In digital electronics, the clock frequency refers to the frequency of the clock signal, which is used to synchronize various operations within a digital system."
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
  lives = 3;
  availableQuestions = [...questions];
  getNewQuestion();
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS || lives === 0) {
    localStorage.setItem("mostRecentScoreHard", score);
    return window.location.assign("hardend.html");
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
    localStorage.setItem("mostRecentScoreHard", score);
    return window.location.assign("Hardend.html");
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