const request = require('request');
const { over } = require('lodash');

const prodOptions = {
  method: 'GET',
  baseUrl: 'https://ocapi.belk.com/on/demandware.store/Sites-Belk-Site/default/BloomReachAPI-Search',
  uri: "",
  json: true,
  qs: {
	  q: 'something flashy'
  }
};


const devOptions = {
  method: 'GET',
  baseUrl: 'https://development-test-belk.demandware.net/on/demandware.store/Sites-Belk-Site/default/BloomReachAPI-Search',
  uri: "",
  json: true,
  qs: {
	  q: 'something flashy'
  }
};


const testOptions = {
  method: 'GET',
  baseUrl: 'https://ocapi.belkdev.com/on/demandware.store/Sites-Belk-Site/default/BloomReachAPI-Search',
  uri: "",
  json: true,
  qs: {
	  q: 'something flashy'
  }
};

request(devOptions, (err, response) => {
	if(err) console.log(err)
	//console.log('Develop body type:', typeof response.body)
});

request(prodOptions, (err, response) => {
	if(err) console.log(err)
	//console.log('Production body type:', typeof response.body)
});

request(testOptions, (err, response) => {
	if(err) console.log(err)
	//console.log('Test body type:', typeof response.body)
});

const plugTest = (req, res) => {
	request(devOptions, function (err, response) {
		if(err) console.log(err)
		console.log('Develop body type:', typeof response.body)
		res.status(200).send(_.get(response, 'body', "it's string"))
	});
	
}
