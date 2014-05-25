// Load the Connect module
var connect = require('connect');

// Create a Connect app
var app = connect(),
	port = 5000; //http port to listen on

// Configure the app
app.use(connect.static(__dirname)); // Static file hosting from the `./public` directory
app.use(connect.compress()); // Compress all responses using Gzip
app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`
app.use(connect.timeout(20000)); // Set maximum time to complete a request to 20 seconds (20000 ms)

// Listen for HTTP/HTTPS conncections on port 3000
app.listen(port);

console.log('Server running on ' + port + '...');