exports.createBasket = async (envKey, token, { region, brand, locale, customerEmail, customerNumber }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets`,
		body: {
			customer_info: {
				email: customerEmail,
				customer_no: customerNumber
			}
		}
	});

	return transform(body);
};

exports.deleteBasket = (envKey, token, { region, brand, locale, basketId }) => {
	return context.callEndpoint('sfcc-delete', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}`
	});
};

exports.getBasketByCustomerId = async (envKey, token, { region, brand, locale, customerId }) => {
	const transform = require('../transforms/baskets');

	const response = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/customers/${customerId}/baskets`
	});

	let { body: { baskets = [] } = {} } = response;

	baskets = baskets.map((basket) => transform(basket));

	return baskets.find((basket) => basket.isAssociateBasket);
};

exports.getBasketById = async (envKey, token, { region, brand, locale, basketId }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}`
	});

	return transform(body);
};

exports.addItems = async (envKey, token, { region, brand, locale, basketId, items = [] }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/items`,
		body: items.map((item) => {
			return {
				product_id: item.itemId,
				quantity: item.quantity
			};
		})
	});

	return transform(body);
};

exports.addCoupon = async (envKey, token, { region, brand, locale, basketId, couponId }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/coupons`,
		body: {
			code: couponId
		}
	});

	return transform(body);
};

exports.addAddresses = async (envKey, token, { region, brand, locale, basketId, shipping, billing }) => {
	const transform = require('../transforms/baskets');

	let result = await context.callEndpoint('sfcc-put', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/shipments/me/shipping_address`,
		qs: {
			use_as_billing: billing ? false : true
		},
		body: {
			first_name: shipping.firstName,
			last_name: shipping.lastName,
			address1: shipping.address1,
			address2: shipping.address2,
			address3: shipping.address3,
			city: shipping.city,
			state_code: shipping.state,
			postal_code: shipping.postalCode,
			country_code: shipping.countryCode,
			phone: (shipping.phone || '').replace(/[^\d]/g, '')
		}
	});

	if (billing) {
		result = await context.callEndpoint('sfcc-put', {
			envKey,
			region,
			brand,
			locale,
			token,
			finalPath: `/baskets/${basketId}/shipments/me/billing_address`,
			qs: {
				use_as_billing: billing ? false : true
			},
			body: {
				first_name: billing.firstName,
				last_name: billing.lastName,
				address1: billing.address1,
				address2: billing.address2,
				address3: billing.address3,
				city: billing.city,
				state_code: billing.state,
				postal_code: billing.postalCode,
				country_code: billing.countryCode,
				phone: (billing.phone || '').replace(/[^\d]/g, '')
			}
		});
		return transform(result.response.body);
	}
	return transform(result.response.body);
};

exports.getShippingMethods = async (envKey, token, { region, brand, locale, basketId }) => {
	const transform = require('../transforms/shippingMethods');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/shipments/me/shipping_methods`
	});

	return transform(body);
};

exports.addShippingMethodToDefaultShipment = async (envKey, token, { region, brand, locale, basketId, shippingMethodId }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-patch', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/shipments/me`,
		body: {
			shipping_method: {
				id: shippingMethodId
			}
		}
	});

	return transform(body);
};

// TODO: review method signature to determine if all these params are really needed, many are duplicate values.
exports.addCreditCard = async (envKey, token, { region, brand, locale, basketId, amount, cardToken }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/payment_instruments`,
		body: {
			amount,
			payment_card: {
				credit_card_token: cardToken
			},
			payment_method_id: 'ADYEN'
		}
	});

	return transform(body);
};

exports.addLoyaltyReward = async (envKey, token, { region, brand, locale, basketId }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-patch', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}`,
		body: {
			c_priceAdjustment: 'REWARD'
		}
	});

	return transform(body);
};

exports.addGiftCard = async (envKey, token, { region, brand, locale, basketId, amount, cardNumber, pin }) => {
	const transform = require('../transforms/baskets');

	// eslint-disable-next-line node/no-deprecated-api
	const base64Encode = (myStr) => new Buffer(myStr).toString('base64');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/payment_instruments`,
		body: {
			amount,
			payment_card: {},
			payment_method_id: 'GIFT_CERTIFICATE',
			c_giftcardNumber: cardNumber,
			c_encodedPin: base64Encode(base64Encode(pin)),
			gift_certificate_code: cardNumber
		}
	});

	return transform(body);
};

exports.removePaymentInstrument = async (envKey, token, { region, brand, locale, basketId, paymentInstrumentId }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-delete', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/payment_instruments/${paymentInstrumentId}`
	});

	return transform(body);
};

exports.addProductPriceAdjustment = async (envKey, token, { region, brand, locale, basketId, itemId, adjustmentAmount, promotionId, reasonCode }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/price_adjustments`,
		body: {
			item_id: itemId,
			level: 'product',
			promotion_id: promotionId,
			reason_code: reasonCode,
			discount: {
				type: 'amount',
				value: adjustmentAmount
			}
		}
	});

	return transform(body);
};

exports.addShippingPriceAdjustment = async (
	envKey,
	token,
	{ region, brand, locale, basketId, itemId, adjustmentAmount, promotionId, reasonCode }
) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/baskets/${basketId}/price_adjustments`,
		body: {
			item_id: itemId,
			level: 'shipping',
			promotion_id: promotionId,
			reason_code: reasonCode,
			discount: {
				type: 'amount',
				value: adjustmentAmount
			}
		}
	});

	return transform(body);
};
