document.addEventListener('DOMContentLoaded', (event) => {
    function toggleMenu() {
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        menu.classList.toggle("open");
        icon.classList.toggle("open");
    }

    let darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
        });
    } else {
        console.log("Element with id 'dark-mode-toggle' not found");
    }
});
