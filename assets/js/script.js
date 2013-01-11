// 
//  INSTANCE VARIABLES
//
//

var winW = 630, winH = 460;
var maxCardsWidth = 1; // maximum horizontal card pixel width, based on window width minus 300 (for mouseover + menu), at standard 100px width
var doc = $(document),
		win = $(window),
		canvas = $('#canvas'),
		ctx = canvas[0].getContext('2d');
var canvasHeight = 0;
var canvasWidth = 0;
var url = 'http://localhost:8081'; // remember the port has to be changed here, too, if changed in server.js
var socket = io.connect(url); // connect to the server!
var GUID = -1; // this client's globally unique identifier -- if -1, we haven't received from the server yet :(
var spriteSheet = new Image(); // contains all cards in the database, sized at 325x455
	// I hate doing this here, but doing the rest of spriteSheet initialization
spriteSheet.src = 'assets/img/sheet.png';
spriteSheet.onload = function() { $('#instructions').fadeOut(5000); };
var hand = new Array();
var deck = new Array();
var myField = new Array();
var oppField = new Array();
var myMagi = new Array();
var oppMagi = new Array();
var myDiscard = new Array();
var oppDiscard = new Array();


//
//
//  INITIALIZE ALL THE ARRAYS!!!! all of them
//
//
// note that these are not final array stylings
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
		//TODO: trigger a redraw
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

		// redraw the entire screen
		redraw();
	});
});

// YOU BETTER BELIEVE IT. This redraws the whole dang screen, no exceptions.
function redraw()
{
	// i is our iterative friend, we'll re-use him each loop
	var i = 0;
	// scale for calculating scales
	var scaleW = 0; 
	var scaleH = 0;	
	// clear the canvas for drawing
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// TODO: refactor this as a generic function you can pass an array, x- and y-offset to
	// draw the hand! first, calculate scalars if applicable
	if(hand.length > Math.floor(maxCardsWidth/100))
	{
		alert("more than I can comfortably hold in hand!");
		scaleW = Math.floor(maxCardsWidth/hand.length);
		scaleH = Math.floor(scaleW*1.33);
	}
	else
	{	// we don't have > max number of cards, so normal scale
		scaleW = 100;
		scaleH = 133;
	}
	for(i=0; i<hand.length; i++)
	{
		ctx.drawImage(spriteSheet, hand[i].img*325, 0, 325, 455, (i*scaleW) + 300, canvasHeight-scaleH, scaleW, scaleH);	
	};
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
