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
});
