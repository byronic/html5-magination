// Including libraries

var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	stat = require('node-static'); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new stat.Server('./');

// I like having client-specific IDs
// and for them to be incremental rather than random
//  so here's a global variable holding the next available number; we'll use it in the connection function
var nextAvailableID = 0;
	
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(8081);

// If the URL of the socket server is opened in a browser
function handler (request, response) {

	request.addListener('end', function () {
        fileServer.serve(request, response);
    });
}

// comment out the next line if you like watching socket.io debug messages
io.set('log level', 1);

// start listening for new connections!
io.sockets.on('connection', function (socket) {
	// instantiate a client-specific ID!
	var sessionID = nextAvailableID;
	++nextAvailableID;
	console.log(sessionID);
	socket.emit('GUID', sessionID); 

	socket.on('disconnect', function()
	{
		console.log('client ID ' + sessionID + ' has disconnected!');
		//send the disconnect message
		// note we can no longer use the local socket object at this point
		io.sockets.emit('clientDC', sessionID);
	});
});

console.log("Reached EOF, server is running!");
