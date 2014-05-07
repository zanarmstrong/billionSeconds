var formatTime = d3.time.format("%b %d, %Y at %X");
var countdown = d3.select("#countdown");
var future = d3.select("#future");


var myBirthday = new Birthday(Date.now() - 700000000000);
console.log(myBirthday.getBirthdate(), myBirthday.getBillion(), myBirthday.getBillion(2), myBirthday.getNextBillion());


// inspired by http://bl.ocks.org/mbostock/9843633
// calculates dates one billion seconds ago
function tick() {
	var billionsecondsago = new Date(Date.now() - 1000000000000);

	countdown.text("If you were born on " +
		formatTime(billionsecondsago) +
		" you'd be a billion seconds old right now.");


	future.text(
		"You were born on " +
		formatTime(myBirthday.getBirthdateFormatted()) +
		" so your Billion second birthday will be " +
		formatTime(myBirthday.getNextBillion().nextBillionDate) + 
		". You're currently " + 
		d3.format(",")(myBirthday.ageInSeconds()) + 
		" billion seconds old.");
	setTimeout(tick, 1000 - billionsecondsago % 1000);
};
tick();
