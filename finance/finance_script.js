const themeToggleButton = document.getElementById('themeToggleButton');

// Function to update the button icon based on the current theme
function updateThemeIcon() {
    if (document.body.classList.contains('dark-theme')) {
        themeToggleButton.textContent = '☀️'; // Show sun icon for light mode
    } else {
        themeToggleButton.textContent = '🌙'; // Show moon icon for dark mode
    }
}

// Initialize the correct icon on page load
updateThemeIcon();

// Event listener for the theme toggle button
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    updateThemeIcon();
});