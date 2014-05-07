/* the goal of this file is to create a type of object which will take in a date
   and output several manipulations of that date
*/

// birthdate is number of milliseconds since Jan 1 1970
function Birthday(birthdate) {
	this.birthdate = birthdate;
	this.trillion = 1000000000000;
};

Birthday.prototype.getBirthdate = function() {
	return this.birthdate;
};

// same as getBirthdate, but returns date object instead of milliseconds value
Birthday.prototype.getBirthdateFormatted = function() {
	return (new Date(this.birthdate));
};

Birthday.prototype.ageInSeconds = function() {
	return (Math.floor((Date.now() - this.birthdate) / 1000));
};

// for now I'm trusting that numbers like 1,2,3,4 are being passed
// general function allows me to calculate billion second birthdays for any multiple of 1 billion
Birthday.prototype.getBillion = function(xBillion) {
	if (xBillion === undefined) {
		var xBillion = 1;
	}
	return {
		billionDate: (new Date(this.birthdate + this.trillion * xBillion)),
		billionCount: xBillion
	};
};

// calculates the next up-coming billion-second birthday and which billion it will be
Birthday.prototype.getNextBillion = function() {
	var nextBillion = Math.ceil((Date.now() - this.birthdate) / this.trillion);
	return {
		nextBillionDate: new Date(this.birthdate + this.trillion * nextBillion),
		nextBillionCount: nextBillion
	};
};
