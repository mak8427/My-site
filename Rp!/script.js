document.getElementById('theme-toggle').addEventListener('click', function () {
    const body = document.body;
    const button = this;
    const icon = button.getElementsByTagName('i')[0];
    const isDarkMode = body.classList.contains('dark-mode');

    if (isDarkMode) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        icon.className = 'fas fa-sun';
        button.innerHTML = '<i class="fas fa-sun"></i> Switch to Dark Mode';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        icon.className = 'fas fa-moon';
        button.innerHTML = '<i class="fas fa-moon"></i> Switch to Light Mode';
    }
});


// Typing effect for the heading
const heading = document.getElementById('animated-heading');
const headingText = ' Roleplay Wikis'; // The text to be animated
let i = 0;

function typeWriter() {
    if (i < headingText.length) {
        heading.textContent += headingText.charAt(i);
        i++;
        setTimeout(typeWriter, 150); // Adjust typing speed
    }
}

document.addEventListener('DOMContentLoaded', typeWriter); // Start typing effect once the DOM is fully loaded
