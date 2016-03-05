var http = require('http');
//add node's nuilt in querystring module to parse the actual form data
var qs = require('querystring');
var formOutput = '<html><body>'
  + '<h1>Enter Driver Phone Number</h1>'
  + '<form method="post" action="/inbound" enctype="application/x-www-form-urlencoded"><fieldset>'
  + '<div><label for="Name">Name:</label><input type="text" id="Name" name="Name" /></div>'
  + '<div><label for="Phone Number">Phone Number:</label><input type="text" id="PhoneNumber" name="PhoneNumber" /></div>'
  + '<div><input id="SendAddresses" type="submit" value="Send Addresses" /></div></fieldset></form></body></html>';
var serverPort = 8124;

http.createServer(function(req, resp){
	if(req.method === "GET"){
		//have server listen for requests for favicon.ico
		//Request made alongside almost all inital requests for a webpage by all major browsers
		//the little icon you see up in tabs of each webpage you are visting
		//Wont need to serve a favicon need to handle inbound requests for it to show basic routing mechanisms
		if(req.url === "/favicon.ico"){		
			resp.writeHead(404, {'Content-Type': 'text/html'});
			resp.write('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
			resp.end();
		} else {
			resp.writeHead(200, {'Content-Type': 'text/html'});
			resp.end(formOutput);
		}
	} else if(req.method === "POST") {
		//listen for inbound requests called /inbound which is the action of our HTML form
		//action of form tells the brower where to send the form data
		if(req.url === "/inbound") {
			var reqBody = '';
			req.on('data', function(data){
				reqBody += data; 
				//Protecting from malicious attacks by uploading endless files to 10 MB
				if(reqBody.length > 1e7){
					resp.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
					resp.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
				}
			});
		req.on('end', function() {
			var formData = qs.parse(reqBody);
			resp.writeHead(200, {'Content-Type': 'text/html'});
			resp.write('<!doctype html><html><head><title>response</title></head><body>');
			resp.write('Your text will be sent! <br> Name : '+formData.Name);
			resp.write('<br />Phone Number: '+formData.PhoneNumber);
        	resp.end('</body></html>');
        	console.log(formData);
		});
		}
	//Generic to any POST we cant handle
    else {
    	resp.writeHead(404, 'Resource Not Found', {'Content-Type': 'text/html'});
    	return resp.end('<!doctype html><html><head><title>404</title></head><body>413: Request Entity Too Large</body></html>');
    }
	} else {
		resp.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    	return resp.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
	}
}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);


//TWILIO
// Twilio Credentials 
var accountSid = ''; 
var authToken = ''; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
	to: "+17327968419", 
	from: "+17323209523", 
	body: "Test Message",   
}, function(err, message) { 
	console.log(message.sid); 
});
console.log(process.env);