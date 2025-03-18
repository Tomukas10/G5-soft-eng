// References the plus/minus buttons and the temperature's numerical display.
const plusBtn = document.getElementById('plus-btn');
const minusBtn = document.getElementById('minus-btn');
const tempDisplay = document.querySelector('.temp');

// Recognizes the value identified as '.temp' as a numerical value to be changed.
let temperature = parseInt(tempDisplay.textContent);

// Ensures the user cannot change the temperature above thirty degrees or below 10 degrees.
const minTemp = 10;
const maxTemp = 30;

// Once the temperature exceeds specified values, the corresponding button(s) will be disabled.
function updateButtons() 
{
    plusBtn.disabled = temperature >= maxTemp;
    minusBtn.disabled = temperature <= minTemp;
}

// Decreases  the temperature displayed once the button is clicked.
minusBtn.addEventListener('click', () => 
{
    if (temperature > minTemp)
	{
		// The temperature will decrease only so long as it is above the minimum value.
        temperature--;
        tempDisplay.textContent = temperature;
		updateButtons();
    }
});

// Increases the temperature displayed once the button is clicked.
plusBtn.addEventListener('click', () => 
{
    if (temperature < maxTemp) 
	{
		// The temperature will increase only so long as it is below the maximum value.
        temperature++;
        tempDisplay.textContent = temperature;
		updateButtons();
    }
});
