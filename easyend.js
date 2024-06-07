const usernameEasy = document.getElementById('usernameEasy');
const saveScoreBtnEasy = document.getElementById('SaveScoreBtnEasy'); // Corrected ID
const finalScoreEasy = document.getElementById('FinalScoreEasy'); // Corrected ID
let mostRecentScoreEasy = localStorage.getItem('mostRecentScoreEasy') || 0; // Set default if null
let highScoresEasy = JSON.parse(localStorage.getItem('highScoresEasy')) || [];

// Check if the elements exist before manipulating them
if (finalScoreEasy) {
    // Display final score
    finalScoreEasy.innerText = `You Scored ${mostRecentScoreEasy}/100`;
}

if (usernameEasy && saveScoreBtnEasy) {
    // Enable save button when username is entered
    usernameEasy.addEventListener('keyup', () => {
        saveScoreBtnEasy.disabled = !usernameEasy.value;
    });
}

// Save high score function
function saveHighScoreEasy(e) {
    e.preventDefault();
    
    if (saveScoreBtnEasy.disabled) {
        // Prevent saving if the button is disabled
        return;
    }

    const score = {
        score: mostRecentScoreEasy,
        name: usernameEasy.value,
    };
    highScoresEasy.push(score);
    highScoresEasy.sort((a, b) => b.score - a.score);

    localStorage.setItem('highScoresEasy', JSON.stringify(highScoresEasy));

    if (mostRecentScoreEasy === '100') {
        alert("Congratulations! You got a perfect score!");
    }

    // Disable the save button after saving
    saveScoreBtnEasy.disabled = true;
    // Disable the text box after saving
    usernameEasy.disabled = true;
}

if (saveScoreBtnEasy) {
    // Attach click event listener to save button
    saveScoreBtnEasy.addEventListener('click', saveHighScoreEasy);
}