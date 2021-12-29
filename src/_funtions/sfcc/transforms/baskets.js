module.exports = ({
	_flash = [],
	basket_id,
	currency,
	product_total: productTotal,
	order_total: total,
	tax_total: tax,
	shipments = [],
	agent_basket: isAssociateBasket,
	shipping_items = [],
	product_items = [],
	coupon_items = [],
	payment_instruments = [],
	billing_address = {},
	customer_info: customer = {},
	order_no: orderNumber
}) => {
	const transformItem = require('./basketItem');
	const transformShipment = require('./basketShipment');
	const transformAddress = require('./basketAddress');
	const transformPaymentInstruments = require('./paymentInstruments');
	const transformCoupons = require('./coupons');

	const items = product_items.concat(shipping_items).map((item) => transformItem(item));

	const shippedTax = items.reduce((acc, item) => {
		return acc + Number(item.tax);
	}, 0);
	const shippedTotal = items.reduce((acc, item) => {
		return acc + Number(item.netAmount);
	}, 0);

	return {
		id: basket_id,
		orderNumber,
		customer: {
			id: customer.customer_id,
			email: customer.email
		},
		currency,
		productTotal,
		tax,
		total,
		shippedTotal,
		shippedTax,
		items,
		shipments: shipments.map((shipment) => transformShipment(shipment)),
		payments: transformPaymentInstruments(payment_instruments),
		billingAddress: transformAddress(billing_address),
		coupons: transformCoupons(coupon_items),
		isAssociateBasket,
		requiredActions: _flash.map(({ message, type }) => {
			return {
				message,
				type
			};
		})
	};
};
