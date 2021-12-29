module.exports = (paymentInstruments = []) => {
	const transform = require('./paymentInstrument');
	return paymentInstruments.map((instrument) => transform(instrument));
};
