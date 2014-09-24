"use strict";

// set variables and arrays for date selector for your birthday
var startingValue = 1983;
var userUpdated = false;

var monthNumberName = {
	0: 'Jan',
	1: 'Feb',
	2: 'Mar',
	3: 'Apr',
	4: 'May',
	5: 'Jun',
	6: 'Jul',
	7: 'Aug',
	8: 'Sep',
	9: 'Oct',
	10: 'Nov',
	11: 'Dec'
}

var yourBirthdayDate = {}
var yourBirthday = new Birthday();

// formatting date function (w/ out D3)
function formatDateTime(date) {
	function formatSeconds(date) {
		x = date.getSeconds();
		if (x < 10) {
			return '0' + x;
		} else {
			return x
		};
	}
	var formatted = monthNumberName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes() + ':' + formatSeconds(date);
	return formatted
}

// get document width
var docWidth = document.body.clientWidth;

// ticks inspired by http://bl.ocks.org/mbostock/9843633
function tick() {
	var billionsecondsago = new Date(Date.now() - 1000000000000);
	document.getElementById('billionSecondsAgo').innerHTML = formatDateTime(billionsecondsago);
	setTimeout(tick, 1000 - billionsecondsago % 1000);
};
tick();

////////////////////

// set up month selector
d3.select('#monthSelect')
	.selectAll("text")
	.data(new Array(12))
	.enter()
	.append("text")
		.text(function(d, i) {
			return monthNumberName[i]
		})
		.attr("x", function(d, i) {
			return docWidth / 2 + docWidth * .8 / 12 * (i - 5.5)
		})
		.attr("y", '15px')
		.attr("class", "unselected")
		.on("click", function(d, k) {
			console.log(k)
			yourBirthdayDate.month = k;
			d3.select("#monthSelect")
				.selectAll("text")
				.attr("class", function(data, i) {
					if (k == i) {
						return "selected"
					} else {
						return "unselected"
					}
				})
			updateBirthday();
		})

// and day selector 
d3.select('#daySelect')
	.selectAll("text")
	.data(new Array(31))
	.enter()
	.append("text")
		.text(function(d, i) {
			return i + 1;
		})
		.attr("x", function(d, i) {
			return docWidth / 2 + docWidth * .8 / 31 * (i - 14.5)
		})
		.attr("y", '15px')
		.attr("class", "unselected")
		.on("click", function(d, k) {
			yourBirthdayDate.day = k + 1;
			d3.select("#daySelect")
				.selectAll("text")
				.attr("class", function(data, i) {
					if (k == i) {
						return "selected"
					} else {
						return "unselected"
					}
				})
			updateBirthday();
		})

// set up year selector

var sliderMargin = {top: 0, right: docWidth * .1, bottom: 0, left:  docWidth * .1},
    sliderWidth = docWidth - sliderMargin.left - sliderMargin.right,
    sliderHeight = 100 - sliderMargin.bottom - sliderMargin.top;

// sets scale for slider
var x = d3.scale.linear()
    .domain([1900, 2014])
    .range([0, sliderWidth])
    .clamp(true);

// defines brush
var brush = d3.svg.brush()
    .x(x)
    .extent([startingValue, startingValue])
    .on("brush", brushed);

console.log(sliderMargin, sliderWidth, sliderHeight)

var svg = d3.select("#yearSelect").append("svg")
    .attr("width", sliderWidth + sliderMargin.left + sliderMargin.right)
    .attr("height", sliderHeight + sliderMargin.top + sliderMargin.bottom)
  .append("g")
  // classic transform to position g
    .attr("transform", "translate(" + sliderMargin.left + "," + sliderMargin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    // put in middle of screen
    .attr("transform", "translate(0," + sliderHeight / 2 + ")")
    // inroduce axis
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) {console.log(d);
       	return d; })
      .tickSize(0)
      .tickPadding(12)
      .tickValues([1900, 2014]))
  .select(".domain")
  .select(function() {console.log(this); return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", sliderHeight);

var handle = slider.append("g")
    .attr("class", "handle")
    .attr("stroke", 'gray')

handle.append("path")
    .attr("transform", "translate(0," + sliderHeight / 2 + ")")
    .attr("d", "M 0 -20 V 20")

handle.append('text')
  .text(startingValue)
  .attr("transform", "translate(" + (-18) + " ," + (sliderHeight / 2 - 25) + ")");

slider
    .call(brush.event)

function brushed() {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
  	console.log(d3.event.sourceEvent.type)
  	handle.attr("stroke", "white");
    value = x.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("transform", "translate(" + x(value) + ",0)");
  handle.select('text').text(Math.floor(value))
  yourBirthdayDate.year = Math.floor(value);

  if(d3.event.sourceEvent.type == 'mouseup'){
  		userUpdated = true;
  		updateBirthday();
  }

}

function updateBirthday() {
	if(!!(yourBirthdayDate.month + 1) && !!(yourBirthdayDate.day) && userUpdated){
		yourBirthday.setBirthdate(Date.parse(new Date(yourBirthdayDate.year, yourBirthdayDate.month, yourBirthdayDate.day)))
		document.getElementById('ageSeconds').innerHTML = "<p>You are <span class='highlight'>" + d3.format(",d")(yourBirthday.ageInSeconds()) + "</span> seconds old.</p>";
		var tense = 'was';
		if(yourBirthday.getBillion().billionDate > Date.now()){tense = 'will be'}
		document.getElementById('billionSecondsBday').innerHTML = "<p>Your first billion seconds birthday " + tense + " <span class='highlight'>" + d3.time.format("%A %B %d %Y")(yourBirthday.getBillion().billionDate) + "</span>.</p>";
		if(yourBirthday.getBillion().billionDate < Date.now()){
			document.getElementById('nextBillion').innerHTML = "<p>Your " + yourBirthday.getNextBillion().nextBillionCount + " billion seconds birthday will be <span class='highlight'>" + d3.time.format("%A %B %d %Y")(yourBirthday.getNextBillion().nextBillionDate) + "</span>.</p>";
		} else {
			document.getElementById('nextBillion').innerHTML = ''
		}
	}
}
// send a reminder if logged into Gmail? https://www.google.com/search?q=remind+me+of+billion+second+birthday+january+20th%2C+2015&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:official&client=firefox-a&channel=fflb
