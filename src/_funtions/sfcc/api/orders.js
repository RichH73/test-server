exports.createFromCart = async (envKey, token, { region, brand, locale, basketId }) => {
	const transform = require('../transforms/baskets');

	const { response: { body = {} } = {} } = await context.callEndpoint('sfcc-post', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/orders`,
		body: {
			basket_id: basketId
		}
	});

	return transform(body);
};
