const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

themeToggleButton.addEventListener('click', function() {
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        themeToggleButton.textContent = 'Switch to Dark Mode';
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggleButton.textContent = 'Switch to Light Mode';
    }
});

// Initialize the button
