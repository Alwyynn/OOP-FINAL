// Save this as difficulty.js
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const popupInstructions = document.getElementById('popup-instructions');
    const closePopupBtn = document.getElementById('close-popup');
    const difficultyButtons = document.querySelectorAll('.btn');

    difficultyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const href = button.getAttribute('data-href');
            const instructions = button.getAttribute('data-instructions');
            popupInstructions.textContent = instructions;
            popup.style.display = 'flex';
            closePopupBtn.addEventListener('click', () => {
                popup.style.display = 'none';
                window.location.href = href;
            }, { once: true });
        });
    });

    closePopupBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });
});