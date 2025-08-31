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
        const menuLinks = document.querySelectorAll('.menu-links a');
        menuLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Theme toggle functionality
    const themeToggleButton = document.getElementById('themeToggleButton');
    const body = document.body;

    // Apply saved theme from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || !savedTheme) {
        body.classList.add('dark-theme');
        themeToggleButton.textContent = '🌙';
    } else {
        themeToggleButton.textContent = '☀';
    }

    // Toggle theme on button click
    themeToggleButton.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const isDarkMode = body.classList.contains('dark-theme');
        themeToggleButton.textContent = isDarkMode ? '🌙' : '☀';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Event listeners for buttons and links
    const downloadCvButton = document.querySelector('.btn-color-2');
    if(downloadCvButton) {
        downloadCvButton.addEventListener('click', () => {
            window.open('./assets/CV_old.pdf');
        });
    }

    const contactInfoButton = document.querySelector('.btn-color-1');
    if(contactInfoButton) {
        contactInfoButton.addEventListener('click', () => {
            location.href = '#contact';
        });
    }

    const linkedinIcon = document.querySelector('.icon[alt="My LinkedIn profile"]');
    if(linkedinIcon) {
        linkedinIcon.addEventListener('click', () => {
            location.href = 'https://www.linkedin.com/in/davide-mattioli-605ab41b3/';
        });
    }

    const githubIcon = document.querySelector('.icon[alt="My Github profile"]');
    if(githubIcon) {
        githubIcon.addEventListener('click', () => {
            location.href = 'https://github.com/mak8427';
        });
    }

    const arrowIcons = document.querySelectorAll('.arrow');
    arrowIcons.forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-href');
            if(target) {
                location.href = target;
            }
        });
    });
});