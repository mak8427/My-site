// Theme toggle functionality
const themeToggleButton = document.getElementById('themeToggleButton');

function updateThemeIcon() {
    if (document.body.classList.contains('dark-theme')) {
        themeToggleButton.textContent = '☀️';
    } else {
        themeToggleButton.textContent = '🌙';
    }
}

updateThemeIcon();

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    updateThemeIcon();
});

// Back button functionality
const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    window.history.back();
});
