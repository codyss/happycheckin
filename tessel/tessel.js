var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['A']); 
var rfidlib = require('rfid-pn532');
var rfid = rfidlib.use(tessel.port['D']); 
var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture
var http = require('http');
var takingPicture = false;

var thingsReady = 0;

var isReady = function (thing) {

	console.log(thing + ' ready!');

	thingsReady++;

	if (thingsReady !== 2) return;

	console.log('Ready to read RFID card');

	rfid.on('data', function(card) {
	  	if (!takingPicture) {
	  		var id = card.uid.toString('hex');
		    console.log('UID:', id);
	  		takingPicture = true;
	  		notificationLED.high();
	  		
	  		setTimeout(function() {
	  			camera.takePicture(function(err, image) {
				    if (err) {
				      console.log('error taking image', err);
				      takingPicture = false;
				    } else {
				      
				      var request = http.request({
		            hostname: '192.168.1.165', // Where your other process is running
		            port: 1337,
		            path: '/api/tessel/checkin/'+id,
		            method: 'POST',
		            headers: {
			            'Content-Type': 'image/jpg',
	                'Content-Length': image.length
		            }
			        });
							takingPicture = false;
							console.log('sending photo');
							notificationLED.low();
			        request.write(image);
				    }
				  });
	  		}, 500);
	  	}
	  });


};

//Wait for the camera module to say it's ready
rfid.on('ready', isReady.bind(null, 'rfid'));
camera.on('ready', isReady.bind(null, 'camera'));

camera.on('error', function(err) {
  console.error(err);
});

rfid.on('error', function (err) {
	console.error(err);
});