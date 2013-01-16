// 
//  INSTANCE VARIABLES
//
//

var winW = 630, winH = 460;
var maxCardsWidth = 1; // maximum horizontal card pixel width, based on window width minus 300 (for mouseover + menu), at standard 100px width

var doc = $(document);
var win = $(window);
var canvas = $('#canvas');
var ctx = canvas[0].getContext('2d');
var canvasHeight = 0;
var canvasWidth = 0;

var url = 'http://localhost:8081'; // remember the port has to be changed here, too, if changed in server.js
var socket = io.connect(url); // connect to the server!
var GUID = -1; // this client's globally unique identifier -- if -1, we haven't received from the server yet :(
var spriteSheet = new Image(); // contains all cards in the database, sized at 325x455
	// I hate doing this here, but doing the rest of spriteSheet initialization
spriteSheet.src = 'assets/img/sheet.png';
spriteSheet.onload = function() { $('#instructions').fadeOut(5000, redraw); };
var hand = new Array();
var deck = new Array();
var myField = new Array();
var oppField = new Array();
var myMagi = new Array();
var oppMagi = new Array();
var myDiscard = new Array();
var oppDiscard = new Array();

var oldCard = 0; // card that was previously moused over


//
//
//  INITIALIZE ALL THE ARRAYS!!!! all of them
//
//
// note that these are not final array stylings
//    for the times when img = cardback, we need to make sure there is also a cID that can change it per rules

hand.push({'img':0, 'maxEnergy':15, 'energy':15});
hand.push({'img':1, 'maxEnergy':12, 'energy':12});
hand.push({'img':2, 'maxEnergy':10, 'energy':10});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
hand.push({'img':0});
hand.push({'img':1});
hand.push({'img':2});
oppMagi.push({'img':0});
oppMagi.push({'img':1});
oppMagi.push({'img':2});
myMagi.push({'img':1});
myMagi.push({'img':0});
myMagi.push({'img':0});
oppField.push({'img':0});
oppField.push({'img':1});
oppField.push({'img':2});
oppField.push({'img':0});
oppField.push({'img':1});
oppField.push({'img':2});
myField.push({'img':0});
myField.push({'img':1});
myField.push({'img':2});
myField.push({'img':0});
myField.push({'img':1});
myField.push({'img':2});
myField.push({'img':2});


//
//  FUNCTIONS
//
//

// the meat and potato -- you could think of this as main()
//        and yes, you receive only one potato.
//                                deal with it.
$(function(){
	
	// Double-check we have canvas support
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	
	// get the window dimensions, which assigns them automatically to winH and winW
	getWindowDimensions();
	// since we have the actual window height / width, assign to canvas rather than the default
	// the -45 is there for the footer offset
	document.getElementById('canvas').height = (winH - 45);
	document.getElementById('canvas').width = winW;
	canvasHeight = winH - 45;
	canvasWidth = winW;

	// finally, set an event trigger on resize to re-calculate stuff. Also needs to trigger a redraw of field
	window.onresize = function() 
	{ 
		getWindowDimensions();
		document.getElementById('canvas').height = (winH - 45);
		document.getElementById('canvas').width = winW;
		canvasHeight = winH - 45;
		canvasWidth = winW;
		redraw();
	};
	
	// listen for my GUID!
	// server sends our GUID to us -- store in GUID
	socket.on('GUID', function(data) 
	{
		GUID = data;
	}); 

	// activates on another client's disconnect
	socket.on('clientDC', function(data)
	{
		// 'data' is just the other user's session ID (integer)
		// removed alert here; later use this to see if your game partner has disconnected
	});

	// now performing a new test with the sprite sheet.
	// now re-draws the field on-click

	canvas.mousedown(function(e)
	{
		// don't respond to right-clicks, etc.
		e.preventDefault();

		// redraw the entire screen; TODO: is this necessary?
		redraw();
	});

	canvas.mousemove(function(event)
	{
		// for now, let's only check one of the areas
		// remember that oldCard is the global variable we check against to avoid redrawing if possible
		var mouseAt = 0;
		var scaleW = 100; // default value
		if(event.clientY > canvasHeight-133) // we could be moused over a card in the hand!
		{
			// calculate scalar, if applicable TODO: refactor this to hold the damned scalar in memory
			if(hand.length > Math.floor(maxCardsWidth/100))
				scaleW = Math.floor(maxCardsWidth/hand.length);
			mouseAt = Math.floor((event.clientX - 300) / scaleW);
			if(mouseAt >= 0 && mouseAt < hand.length)
				if(hand[mouseAt].img != oldCard)
					{
						oldCard = mouseAt;
						drawMousedOverCard(hand[mouseAt].img);
					}
		}
		else if(event.clientY > canvasHeight-283 && event.clientY < canvasHeight - 150) // we could be moused over a card in myMagi!
		{
			// calculate scalar, if applicable TODO: refactor this to hold the damned scalar in memory
			if(myMagi.length > Math.floor(maxCardsWidth/100))
				scaleW = Math.floor(maxCardsWidth/myMagi.length);
			mouseAt = Math.floor((event.clientX - 300) / scaleW);
			if(mouseAt >= 0 && mouseAt < myMagi.length)
				if(myMagi[mouseAt].img != oldCard)
					{
						oldCard = mouseAt;
						drawMousedOverCard(myMagi[mouseAt].img);
					}
		}
		else if(event.clientY > canvasHeight-433 && event.clientY < canvasHeight - 300) // we could be moused over a card in myField!
		{
			// calculate scalar, if applicable TODO: refactor this to hold the damned scalar in memory
			if(myField.length > Math.floor(maxCardsWidth/100))
				scaleW = Math.floor(maxCardsWidth/myField.length);
			mouseAt = Math.floor((event.clientX - 300) / scaleW);
			if(mouseAt >= 0 && mouseAt < myField.length)
				if(myField[mouseAt].img != oldCard)
					{
					alert(newCard + " " + oldCard);
						oldCard = mouseAt;
						drawMousedOverCard(myField[mouseAt].img);
					}
		}
		else if(event.clientY < 133) // we could be moused over a card in oppMagi!
		{
			// calculate scalar, if applicable TODO: refactor this to hold the damned scalar in memory
			if(oppMagi.length > Math.floor(maxCardsWidth/100))
				scaleW = Math.floor(maxCardsWidth/oppMagi.length);
			mouseAt = Math.floor((event.clientX - 300) / scaleW);
			if(mouseAt >= 0 && mouseAt < oppMagi.length)
				if(oppMagi[mouseAt].img != oldCard)
				{
					oldCard = mouseAt;
					drawMousedOverCard(oppMagi[mouseAt].img);
				}
		}
		else if(event.clientY < 283 && event.clientY > 150) // we could be moused over a card in oppField!
		{
			// calculate scalar, if applicable TODO: refactor this to hold the damned scalar in memory
			if(oppField.length > Math.floor(maxCardsWidth/100))
				scaleW = Math.floor(maxCardsWidth/oppField.length);
			mouseAt = Math.floor((event.clientX - 300) / scaleW);
			if(mouseAt >= 0  && mouseAt < oppField.length)
				if(oppField[mouseAt].img != oldCard)
					{
						oldCard = mouseAt;
						drawMousedOverCard(oppField[mouseAt].img);
					}
		}
	}); // end canvas.mousemove. FFS, can't we TODO: REFACTOR THE HELL OUT OF THIS? GET IT OUT OF MAIN.
	
	
});

// YOU BETTER BELIEVE IT. This redraws the whole dang screen, no exceptions.
function redraw()
{
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
	// TODO: this doesn't belong here.
	drawMousedOverCard(0);

	// draw each aspect of the field.
	drawArray(oppMagi, 300, 0, true);
	drawArray(oppField, 300, 150, true);
	drawArray(myField, 300, canvasHeight - 300, false);
	drawArray(myMagi, 300, canvasHeight - 150, false);
	drawArray(hand, 300, canvasHeight, false);
};

//
// draw the passed array starting at the specified x/y
//     NOTE THAT THIS DOES NOT CLEAR ANY PORTION OF THE SCREEN BEFORE DOING SO.
///      now refactored: relativeToTop: if false, we're relative to bottom
//                                         When relative to bottom, y is the _bottom_ point of the card
///                                         otherwise, y is top as normal.
function drawArray(arr, x, y, relativeToTop)
{
	// scale for calculating scales
	var scaleW = 100; 
	var scaleH = 133;	

	// re-calculate scalars if applicable
	if(arr.length > Math.floor(maxCardsWidth/100))
	{
		scaleW = Math.floor(maxCardsWidth/arr.length);
		//scaleH = Math.floor(scaleW*1.33); // taking this out to assist with mouseover, plus height scaling doesn't help
	};
	// draw the whole thing!
	if(relativeToTop)
	{
		for(var i=0; i<arr.length; i++)
		{
			ctx.drawImage(spriteSheet, arr[i].img*325, 0, 325, 455, (i*scaleW) + x, y, scaleW, scaleH);	
		}
	}
	else //relative to bottom!!!!
	{
		for(var i=0; i<arr.length; i++)
		{
			ctx.drawImage(spriteSheet, arr[i].img*325, 0, 325, 455, (i*scaleW) + x, y - scaleH, scaleW, scaleH);	
		}
	}
};

function drawMousedOverCard(image)
{
	ctx.drawImage(spriteSheet, image*325, 0, 325, 455, 0, 0, 300, 400);
};

function mouseOverCard(event)
{
	alert('eh, steve!');
	// for now, let's only check one of the areas
	// remember that oldCard is the global variable we check against to avoid redrawing if possible
	var newCard = 0;
	var scaleW = 100; // default value
	if(event.clientY > canvasHeight-133) // we could be moused over a card in the hand!
	{
		// calculate scalar, if applicable TODO: refactor this to hold the damned scalar in memory
		if(hand.length > Math.floor(maxCardsWidth/100))
			scaleW = Math.floor(maxCardsWidth/hand.length);
		newCard = Math.floor((event.clientX - 300) / scaleW);
		if(oldCard != newCard)
			if(hand.length <= newCard)
				drawMousedOverCard(hand[newCard].img);
	}
};

function getWindowDimensions()
{
	// get the window height and such, assign to instance vars winH and winW
	if (document.body && document.body.offsetWidth) {
	 winW = document.body.offsetWidth;
	 winH = document.body.offsetHeight;
	}
	if (document.compatMode=='CSS1Compat' &&
	    document.documentElement &&
	    document.documentElement.offsetWidth ) {
	 winW = document.documentElement.offsetWidth;
	 winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
	 winW = window.innerWidth;
	 winH = window.innerHeight;
	}
	// this has completed getting the window height / width

	// calculate max number of cards across the screen before scaling is forced
	maxCardsWidth = winW - 300; 
};
