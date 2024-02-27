document.addEventListener('DOMContentLoaded', (event) => {
    // Function to toggle menu (if applicable)
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
        function toggleMenu() {
            menu.classList.toggle("open");
            icon.classList.toggle("open");
        }
        icon.addEventListener('click', toggleMenu);
    }

    // Theme toggle functionality
    const themeToggleButton = document.getElementById('themeToggleButton');

    // Function to apply theme to .details-container and .color-container
    function applyThemeClasses(isDark) {
        const detailsContainers = document.querySelectorAll('.details-container');
        const colorContainers = document.querySelectorAll('.color-container');
        const paragraphs = document.querySelectorAll('p');
        const links = document.querySelectorAll('a');
        const buttons = document.querySelectorAll('.btn');
        const btnColor1Elements = document.querySelectorAll('.btn-color-1');
        const btnColor2Elements = document.querySelectorAll('.btn-color-2');
        const experienceSubTitleElements = document.querySelectorAll('.experience-sub-title');
        experienceSubTitleElements.forEach(element => isDark ? element.classList.add('dark-theme') : element.classList.remove('dark-theme'));
        btnColor1Elements.forEach(element => isDark ? element.classList.add('dark-theme') : element.classList.remove('dark-theme'));
        btnColor2Elements.forEach(element => isDark ? element.classList.add('dark-theme') : element.classList.remove('dark-theme'));
        buttons.forEach(button => isDark ? button.classList.add('dark-theme') : button.classList.remove('dark-theme'));
        links.forEach(link => isDark ? link.classList.add('dark-theme') : link.classList.remove('dark-theme'));
        paragraphs.forEach(paragraph => isDark ? paragraph.classList.add('dark-theme') : paragraph.classList.remove('dark-theme'));
        detailsContainers.forEach(container => isDark ? container.classList.add('details-container-dark') : container.classList.remove('details-container-dark'));
        colorContainers.forEach(container => isDark ? container.classList.add('color-container-dark') : container.classList.remove('color-container-dark'));
    }

    // Apply saved theme from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    const isDarkTheme = savedTheme === 'dark' || !savedTheme; // Default to dark theme if no saved theme
    if (isDarkTheme) {
        document.body.style.backgroundColor = '#1D1E22';
        document.body.style.color = 'white';
        themeToggleButton.textContent = '🌙';
    } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        themeToggleButton.textContent = '☀';
    }
    applyThemeClasses(isDarkTheme);

    // Toggle theme on button click
    themeToggleButton.addEventListener('click', function() {
        const isDarkMode = document.body.style.backgroundColor === 'rgb(29, 30, 34)' || document.body.style.backgroundColor === '#1d1e22';
        const newThemeIsDark = !isDarkMode;
        document.body.style.backgroundColor = newThemeIsDark ? '#1D1E22' : 'white';
        document.body.style.color = newThemeIsDark ? 'white' : 'black';
        themeToggleButton.textContent = newThemeIsDark ? '🌙' : '☀';
        localStorage.setItem('theme', newThemeIsDark ? 'dark' : 'light');
        applyThemeClasses(newThemeIsDark);
    });
});