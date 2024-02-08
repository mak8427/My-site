function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
document.getElementById('mode-switcher').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});