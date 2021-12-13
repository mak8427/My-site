const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const square = entry.target.querySelector('.chad');

    if (entry.isIntersecting) {
      square.classList.add('giga-chad');
	  return; // if we added the class, exit the function
    }

    // We're not intersecting, so remove the class!
    square.classList.remove('giga-chad');
  });
});

observer.observe(document.querySelector('.chad-div'));
