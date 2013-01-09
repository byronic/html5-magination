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

//
//  FUNCTIONS
//
//

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
	alert ("canvasHeight " + canvasHeight + "\ncanvasWidth " + canvasWidth);
	
	var socket = io.connect(url);
	
	// listen for my GUID!
	var GUID = -1; // don't forget -- you must instantiate your variable immediately!!!!
	
	// server sends our GUID to us -- TODO: remove the alert!
	socket.on('GUID', function(data) 
	{
		GUID = data;
		window.alert('My ID is ' + GUID);
	}); 

	// on client disconnect, alert
	// TODO: remove the alert!
	socket.on('clientDC', function(data)
	{
		// the data is just the other user's session ID
		// removed alert here; later use this to see if your game partner has disconnected
	});

	// testing drawing a card in hand, and on the field.
	// also tests clearing the screen.
	// clicking should toggle back and forth
	var inHand = true;
	var testImage = new Image();
	testImage.src = 'assets/img/testcard.jpg';
	testImage.onload = function() { ctx.drawImage(testImage, 500, 500);  };
	
	alert("Testing " + canvasHeight + canvasWidth);
	canvas.mousedown(function(e)
	{
		// don't respond to right-clicks, etc.
		e.preventDefault();

		// clear canvas for drawing		
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		if(inHand)
		{
			//draw on the field, no scaling	
			ctx.drawImage(testImage, 0, 0)
			inHand = false;			
		}
		else
		{
			//draw in the hand, scale to 100px wide and 133 px tall
			ctx.drawImage(testImage, 50, canvasHeight - 133, 100, 133);
			inHand = true;
		}
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
