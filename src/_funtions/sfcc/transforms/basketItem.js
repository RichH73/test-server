const transform = require('./priceAdjustment');

module.exports = ({
	_type: type,
	item_id,
	item_text,
	base_price,
	price,
	price_after_item_discount,
	price_after_order_discount,
	price_adjustments = [],
	shipment_id,
	adjusted_tax,
	tax,
	quantity,
	product_id,
	c_IMAGE_URL: imageUrl,
	c_colorname: color,
	c_size: size
}) => {
	switch (type) {
		case 'product_item':
		case 'shipment':
		default:
			return {
				id: item_id,
				productId: product_id,
				quantity,
				description: item_text,
				unitPrice: base_price,
				baseAmount: price,
				netAmount: price_after_order_discount || price_after_item_discount,
				tax: adjusted_tax || tax,
				shipmentId: shipment_id,
				imageUrl,
				color,
				size,
				price_adjustments: price_adjustments.map((adjustment) => transform(adjustment))
			};
	}
};
