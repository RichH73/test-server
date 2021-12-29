const { addLoyaltyReward } = require('./baskets');

/* eslint-disable no-await-in-loop */
exports.createOrder = async (
	envKey,
	{
		region,
		brand,
		locale,
		basketId: requestBasketId,
		placeOrder = false,
		customer = {},
		items = [],
		coupons = [],
		shippingAddress,
		billingAddress,
		shippingMethodId,
		paymentInstruments = [],
		applyLoyaltyRewards = false
	}
) => {
	const {
		auth: { getServiceToken },
		baskets: {
			getBasketById,
			createBasket,
			addItems,
			addCoupon,
			addAddresses,
			addShippingMethodToDefaultShipment,
			addCreditCard,
			addGiftCard,
			addProductPriceAdjustment
		},
		orders: { createFromCart: createOrder },
		customers: { customerSearch }
	} = require('..');

	// const {
	// 	endlessAisle: { freeShippingMethods }
	// } = require('../../client_configs');

	let { email: customerEmail } = customer;
	let basket;
	let basketId = requestBasketId;

	const serviceToken = await getServiceToken(envKey, { region, brand, locale });

	// If basketId exists in request, get basket to get customer information.
	if (requestBasketId) {
		basket = await getBasketById(envKey, serviceToken, { region, brand, locale, basketId });
		customerEmail = basket.customer.email || customerEmail;
	}

	// Seach users by email to see if customer is registered. If so, get customer token
	const customerSearchResults = await customerSearch(envKey, serviceToken, { region, brand, locale, email: customerEmail });
	let customerNumber;
	if (customerSearchResults.length && customerSearchResults[0].id) {
		customerNumber = customerSearchResults[0].customerNumber;
	}

	// If basketId is not passed in the request, create a new basket to use as the basis for the rest of the transaction.
	if (!requestBasketId) {
		basket = await createBasket(envKey, serviceToken, { region, brand, locale, customerEmail, customerNumber });
		basketId = basket.id;
	}

	// If items exist in request body, add items to basket.
	if (items.length) {
		const adjustedItems = items.filter((item) => item.priceAdjustments && item.priceAdjustments.length);
		basket = await addItems(envKey, serviceToken, { region, brand, locale, basketId, items });
		if (adjustedItems.length) {
			for (const item of adjustedItems) {
				const { priceAdjustments, itemId } = item;
				for (const adjustment of priceAdjustments) {
					const { adjustmentAmount, reasonCode, promotionId } = adjustment;
					const lineItemsToAdjust = basket.items.filter((lineItem) => lineItem.productId === itemId);
					for (const lineItem of lineItemsToAdjust) {
						basket = await addProductPriceAdjustment(envKey, serviceToken, {
							region,
							brand,
							locale,
							basketId,
							itemId: lineItem.id,
							adjustmentAmount,
							reasonCode,
							promotionId
						});
					}
				}
			}
		}
	}

	// If coupons exist in request, add coupons to basket.
	if (coupons.length) {
		for (const coupon of coupons) {
			basket = await addCoupon(envKey, serviceToken, { region, brand, locale, basketId, couponId: coupon.id });
		}
	}

	// If shipping/billing addressses exists in request, add/update basket.
	if (shippingAddress) {
		basket = await addAddresses(envKey, serviceToken, {
			region,
			brand,
			locale,
			basketId,
			shipping: shippingAddress,
			billing: billingAddress
		});
	}

	// If shipping method exists in request, add/update default shipment of basket.
	if (shippingMethodId) {
		basket = await addShippingMethodToDefaultShipment(envKey, serviceToken, { region, brand, locale, basketId, shippingMethodId });
		// if (freeShippingMethods.includes(shippingMethodId)) {
		// 	const shippingItem = basket.items.find((item) => item.shipmentId === 'me' && !item.productId);
		// 	basket = await addShippingPriceAdjustment(envKey, serviceToken, {
		// 		region,
		// 		brand,
		// 		locale,
		// 		basketId,
		// 		itemId: shippingItem.id,
		// 		adjustmentAmount: shippingItem.netAmount,
		// 		reasonCode: 'MM EA Free Shipping',
		// 		promotionId: 'MM EA Free Shipping'
		// 	});
		// }
	}

	if (applyLoyaltyRewards) {
		basket = addLoyaltyReward(envKey, serviceToken, { region, brand, locale, basketId });
	}

	// If payment instruments exist in request, loop through and add gift and credit cards.
	if (paymentInstruments.length) {
		for (const instrument of paymentInstruments) {
			const { type, amount, cardNumber, pin, cardToken, alias } = instrument;
			if (cardToken) {
				basket = await addCreditCard(envKey, serviceToken, {
					region,
					brand,
					locale,
					basketId,
					amount,
					cardToken,
					alias
				});
			} else if (cardNumber) {
				basket = await addGiftCard(envKey, serviceToken, { region, brand, locale, basketId, amount, cardNumber, pin });
			} else {
				throw new Error(`Unrecognized payment type '${type}'.`);
			}
		}
	}

	// If all required actions are addressed & placeOrder === true in the request place the order
	const hasRequiredActions = basket.requiredActions && basket.requiredActions.length;
	if (placeOrder && !hasRequiredActions) {
		return createOrder(envKey, serviceToken, { region, brand, locale, basketId });
	} else if (placeOrder && hasRequiredActions) {
		throw new Error(`Required actions must be addressed before the order can be placed: ${JSON.stringify(basket.requiredActions)}`);
	}
	return basket;
};
