module.exports = ({ applicable_shipping_methods = [] }) => {
	const transform = require('./shippingMethod');
	return applicable_shipping_methods.map((method) => transform(method));
};
