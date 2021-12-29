exports.search = async (envKey, token, { region, brand, locale, start, count, latitude, longitude, maxDistance }) => {
	const transform = require('../transforms/stores');
	const { getDistanceUnitByRegion } = require('../../../_functions/helper_functions');

	const { storeInfo: { region: deviceRegion } = {} } = envKey;

	const currentDistanceUnit = getDistanceUnitByRegion(region || deviceRegion);

	const { response: searchResultsResponse } = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: '/stores',
		qs: {
			start,
			count,
			latitude,
			longitude,
			max_distance: maxDistance,
			distance_unit: currentDistanceUnit
		}
	});

	return transform(searchResultsResponse);
};

exports.getById = async (envKey, token, { region, brand, locale, storeId }) => {
	const transform = require('../transforms/store');

	const { response: { body } = {} } = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/stores/${storeId}`
	});

	return transform(body);
};
