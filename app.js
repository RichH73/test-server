const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const _ = require('lodash');
const axios = require('axios');

app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 50000,
	})
);
app.use(bodyParser.json({ limit: '50mb' }));
const cors = require('cors');
const port = 8000;

app.use(
	bodyParser.json({
		type: 'application/json',
		limit: '40mb',
	})
);
app.use(bodyParser.urlencoded({ extended: false, limit: '40mb' }));

var whitelist = ['http://localhost:4000', 'http://192.168.0.2:4000', 'http://localhost:5000', 'http://localhost:3000'];

var corsOptions = {
	origin: whitelist,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));





const response = {
	body: [
		{
			"interactionId": 596,
			"interactionType": "Contact",
			"interactionDate": "2021-12-20T13:34:12Z",
			"employeeId": 117,
			"relatedItems": [
				{
					"interactionSubType": "ContactReason"
				},
				{
					"interactionSubType": "Comment",
					"interactionValue": "Form Test"
				},
				{
					"interactionSubType": "ContactType"
				}
			]
		},
		{
			"interactionId": 562,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117
		},
		{
			"interactionId": 563,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117
		},
		{
			"interactionId": 564,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117
		},
		{
			"interactionId": 565,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117
		},
		{
			"interactionId": 566,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117
		},
		{
			"interactionId": 586,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117,
			"relatedItems": [
				{
					"interactionSubType": "Comment",
					"interactionValue": "Just some test data..."
				}
			]
		},
		{
			"interactionId": 587,
			"interactionType": "Contact",
			"interactionDate": "2021-12-16T17:02:54Z",
			"employeeId": 117,
			"relatedItems": [
				{
					"interactionSubType": "Comment",
					"interactionValue": "Just some test data..."
				},
				{
					"interactionSubType": "ContactType",
					"interactionValue": "WhatsApp"
				},
				{
					"interactionSubType": "ContactReason",
					"interactionValue": "Thank You"
				}
			]
		}
	]
}


const records = response.body.map((record) => {
	const { interactionDate, interactionType, relatedItems = [], employeeId} = record
	let interactionValue = ''
	return {
		createdDate: interactionDate,
		title: relatedItems.length ? relatedItems.filter((item) => {
			const { interactionSubType = '', interactionValue = '' } = item
			if(interactionSubType === 'ContactReason' && interactionValue) return item
		}) : 'Contact',
		// body: relatedItems.length ? relatedItems.find((item) => item.interactionSubType === 'Comment').interactionValue : '',
		body: relatedItems.length ? relatedItems.filter((item) => {
			const { interactionSubType = '', interactionValue = '' } = item
			if(interactionSubType === 'Comment') return item
		})[0].interactionValue : 'Something',
		userId: employeeId,
		attributes: {
			cratorId: employeeId,
			creator: `${record.firstName} ${record.lastName}`
		}
	}
})






//console.log(records)
const cliff = require('./cliff')
cliff()
















const reply = (req, res) => {
	res.status(200).send(cliff())
}



app.get('/', reply)




























http.createServer(app).listen(port, () => console.log(`Node Server listening on HTTP port: ${port}`));
