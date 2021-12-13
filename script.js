


const rogi = document.querySelectorAll(".wipe-enter");

observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      entry.target.style.animation = `anim1 2s ${entry.target.dataset.delay} forwards ease-out`;
    } else {
      entry.target.style.animation = "none";
    }
  });
});

rogi.forEach((image) => {
  observer.observe(image);
});



$(document).ready(documentReady);

function documentReady()
{

	var characterCollection 	= ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "Y", "Z"];

	var currentText 			= $(".effect-text-container h1").text();

	var currentTextCollection 	= new Array();

	var characterCount			= 0;

	var characterSpeed			= 500;

	pushCurrentTextChrachters();

	function pushCurrentTextChrachters () {

		for(var i = 0; i < currentText.length; i++)
		{

			var currentCharacter = currentText.slice(i, i+1);

			currentTextCollection.push(currentCharacter);

		}

	}

	var characterCountIncreaseInterval = setInterval(characterCountIncrease, characterSpeed);

	function characterCountIncrease () {

		if (characterCount == currentTextCollection.length)
		{

			clearInterval(characterCountIncreaseInterval);

			clearInterval(setRandomTextInterval);

		}

		characterCount++;

	}

	function getRandomText () {

		var result = "";

		if(characterCount == 0)
		{

			for(var i = 0; i < currentTextCollection.length; i++)
			{

				var randomCharacter = characterCollection[ Math.floor( Math.random() * characterCollection.length ) ];

				result += randomCharacter;

			}

		}
		else
		{

			result = currentText.slice(0, characterCount);

			for(var i = 0; i < currentTextCollection.length - characterCount; i++)
			{

				var randomCharacter = characterCollection[ Math.floor( Math.random() * characterCollection.length ) ];

				result += randomCharacter;

			}

		}

		return result;

	}

	var setRandomTextInterval = setInterval(setRandomText, 50);

	function setRandomText () {

		console.log(getRandomText());

		$(".effect-text-container h1").text(getRandomText());

	}

}



