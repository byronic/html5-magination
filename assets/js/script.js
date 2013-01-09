$(function(){
	
	// Double-check we have canvas support
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// remember the port has to be changed here, too, if changed in server.js
	var url = 'http://localhost:8081';

	var doc = $(document),
		win = $(window),
		canvas = $('#canvas'),
		ctx = canvas[0].getContext('2d');
		//instructions = $('#instructions');
	
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
		alert('Client with ID ' + data + ' disconnected! :(');
	});

	// testing drawing a card in hand, and on the field.
	// also tests clearing the screen.
	// clicking should toggle back and forth
	var inHand = true;
	var testImage = new Image();
	testImage.src = 'assets/img/testcard.jpg';
	testImage.onload = function() { ctx.drawImage(testImage, 500, 500);  };
	alert("Testing " + canvas.height + canvas.width);
	canvas.mousedown(function(e)
	{
		e.preventDefault();
		// clear canvas for drawing
		
		ctx.clearRect(0, 0, 1900, 1000);
		if(inHand)
		{
			//draw on the field, no scaling	
			ctx.drawImage(testImage, 50, 50)
			inHand = false;	
			alert("eh, steve!");		
		}
		else
		{
			//draw in the hand, scale to 100px wide and 200 px tall
			ctx.drawImage(testImage, 50, 20, 100, 200);
			inHand = true;
		}
	});
});
