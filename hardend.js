const usernameHard = document.getElementById('usernameHard');
const saveScoreBtnHard = document.getElementById('SaveScoreBtnHard'); // Corrected ID
const finalScoreHard = document.getElementById('FinalScoreHard'); // Corrected ID
let mostRecentScoreHard = localStorage.getItem('mostRecentScoreHard') || 0; // Set default if null
let highScoresHard = JSON.parse(localStorage.getItem('highScoresHard')) || [];

// Check if the elements exist before manipulating them
if (finalScoreHard) {
    // Display final score
    finalScoreHard.innerText = `You Scored ${mostRecentScoreHard}/100`;
}

if (usernameHard && saveScoreBtnHard) {
    // Enable save button when username is entered
    usernameHard.addEventListener('keyup', () => {
        saveScoreBtnHard.disabled = !usernameHard.value;
    });
}

// Save high score function
function saveHighScoreHard(e) {
    e.preventDefault();
    
    if (saveScoreBtnHard.disabled) {
        // Prevent saving if the button is disabled
        return;
    }

    const score = {
        score: mostRecentScoreHard,
        name: usernameHard.value,
    };
    highScoresHard.push(score);
    highScoresHard.sort((a, b) => b.score - a.score);

    localStorage.setItem('highScoresHard', JSON.stringify(highScoresHard));

    if (mostRecentScoreHard === '100') {
        alert("Congratulations! You got a perfect score!");
    }

    // Disable the save button after saving
    saveScoreBtnHard.disabled = true;
    // Disable the text box after saving
    usernameHard.disabled = true;
}

if (saveScoreBtnHard) {
    // Attach click event listener to save button
    saveScoreBtnHard.addEventListener('click', saveHighScoreHard);
}