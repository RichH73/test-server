module.exports = ({ shipment_id, shipment_total, shipping_total, gift, shipping_address = {}, shipping_method = {} }) => {
	const transformAddress = require('./basketAddress');
	const transformShippingMethod = require('./shippingMethod');

	return {
		id: shipment_id,
		total: shipment_total,
		shippingTotal: shipping_total,
		isGift: gift,
		shippingAddress: transformAddress(shipping_address),
		shippingMethod: transformShippingMethod(shipping_method)
	};
};
