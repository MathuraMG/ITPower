var querystring = require('querystring');
var https = require('https');


var loginData = querystring.stringify({
	'client_id':'c99b7f5dec0d6a0f6178',
	'client_secret': '575af139440e5ae453d6171d14efd8ce3a4f3005',
	'grant_type': 'password',
	'username': 'mmg542@nyu.edu',
	'password': 'energyatitp',
})

console.log(loginData);

// set up the HTTPS request options. You'll modify and
// reuse this for subsequent calls:
var loginRequestOptions = {
  rejectUnauthorized: false,
  method: 'POST',
  host: 'api.enertiv.com',
  port: 443,
  path: '/o/token/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};

var dataRequestOptions = {
  rejectUnauthorized: false,
  method: 'GET',
  host: 'api.enertiv.com',
  port: 443,
  path: '/o/token/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};

console.log(loginRequestOptions);

setInterval(function() {
  var request = https.request(loginRequestOptions, saveToken);	// start it
  request.write(loginData);                       // add  body of  POST request
  request.end();
  console.log('Hello');
}, 10000);

var accessToken;
function saveToken(response) {
  var result = '';		// string to hold the response
  // as each chunk comes in, add it to the result string:
  response.on('data', function (data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function () {
    result = JSON.parse(result);
    accessToken = result.access_token;

    var toTime = new Date();
    toTime.setHours(toTime.getHours());
    var fromTime = new Date(toTime);

    var durationInMinutes = 3;
    console.log(toTime);
    console.log(fromTime);
    fromTime.setMinutes(toTime.getMinutes() - durationInMinutes);

    var url = '/api/equipment/a40be1ed-5a9d-4b35-b500-0aff698e8c79/data/?fromTime=' +
    fromTime.toISOString() +
    '&toTime=' +
    toTime.toISOString() +
    '&interval=min';

    getClientInfo(url, accessToken);
    console.log(result);
  });
}

var clientData;

function getClientInfo(path, token) {
  dataRequestOptions.path = path;
  dataRequestOptions.headers = {
    'Authorization': 'Bearer ' + token
  }
  request = https.get(dataRequestOptions, function (response) { // make the API call
    var result = '';
    // as each chunk comes in, add it to the result string:
    response.on('data', function (data) {
      result += data;
    });

    // when the final chunk comes in, print it out:
    response.on('end', function () {
      result = JSON.parse(result);
      clientData = result;
      console.log('****************');
      console.log(clientData);
      console.log('****************');
      console.log(accessToken);
      console.log('****************');
    });
  });
}
