// 
//  INSTANCE VARIABLES
//
//

var winW = 630, winH = 460;
var doc = $(document),
		win = $(window),
		canvas = $('#canvas'),
		ctx = canvas[0].getContext('2d');
var canvasHeight = 0;
var canvasWidth = 0;
var url = 'http://localhost:8081'; // remember the port has to be changed here, too, if changed in server.js
var socket = io.connect(url); // connect to the server!
var GUID = -1; // this client's globally unique identifier -- if -1, we haven't received from the server yet :(

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
	// server sends our GUID to us -- TODO: remove the alert!
	socket.on('GUID', function(data) 
	{
		GUID = data;
		window.alert('My ID is ' + GUID);
	}); 

	// activates on another client's disconnect
	socket.on('clientDC', function(data)
	{
		// 'data' is just the other user's session ID (integer)
		// removed alert here; later use this to see if your game partner has disconnected
	});

	// now performing the same test, but with a sprite sheet.
	// cycles through all of the available images (on the field) through clicking.
	// also draws a 'hand' of all three cards.
	var cardOnField = 0;
	var testSheet = new Image();
	testSheet.src = 'assets/img/testsheet.png';
	testSheet.onload = function() { $('#instructions').fadeOut(5000); };

	canvas.mousedown(function(e)
	{
		// don't respond to right-clicks, etc.
		e.preventDefault();

		// clear canvas for drawing		
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		ctx.drawImage(testSheet, (cardOnField%3)*325, 0, 325, 455, 0, 0, 300, 400);
		cardOnField++;
		for(var i=0; i<3; i++)
			ctx.drawImage(testSheet, i*325, 0, 325, 455, (i*100) + 350, canvasHeight-133, 100, 133);
	});
});

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
};
