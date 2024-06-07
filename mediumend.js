const usernameMedium = document.getElementById('usernameMedium');
const saveScoreBtnMedium = document.getElementById('SaveScoreBtnMedium'); // Corrected ID
const finalScoreMedium = document.getElementById('FinalScoreMedium'); // Corrected ID
let mostRecentScoreMedium = localStorage.getItem('mostRecentScoreMedium') || 0; // Set default if null
let highScoresMedium = JSON.parse(localStorage.getItem('highScoresMedium')) || [];

// Check if the elements exist before manipulating them
if (finalScoreMedium) {
    // Display final score
    finalScoreMedium.innerText = `You Scored ${mostRecentScoreMedium}/100`;
}

if (usernameMedium && saveScoreBtnMedium) {
    // Enable save button when username is entered
    usernameMedium.addEventListener('keyup', () => {
        saveScoreBtnMedium.disabled = !usernameMedium.value;
    });
}

// Save high score function
function saveHighScoreMedium(e) {
    e.preventDefault();
    
    if (saveScoreBtnMedium.disabled) {
        // Prevent saving if the button is disabled
        return;
    }

    const score = {
        score: mostRecentScoreMedium,
        name: usernameMedium.value,
    };
    highScoresMedium.push(score);
    highScoresMedium.sort((a, b) => b.score - a.score);

    localStorage.setItem('highScoresMedium', JSON.stringify(highScoresMedium));

    if (mostRecentScoreMedium === '100') {
        alert("Congratulations! You got a perfect score!");
    }

    // Disable the save button after saving
    saveScoreBtnMedium.disabled = true;
    // Disable the text box after saving
    usernameMedium.disabled = true;
}

if (saveScoreBtnMedium) {
    // Attach click event listener to save button
    saveScoreBtnMedium.addEventListener('click', saveHighScoreMedium);
}