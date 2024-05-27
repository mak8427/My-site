document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body;
    const button = this;
    const icon = button.querySelector('i');
    const isDarkMode = body.classList.contains('dark-mode');

    if (isDarkMode) {
        body.classList.replace('dark-mode', 'light-mode');
        icon.className = 'fas fa-sun';
        button.innerHTML = '<i class="fas fa-sun"></i> Switch to Dark Mode';
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        icon.className = 'fas fa-moon';

