exports.customerSearch = async (envKey, token, { region, brand, locale, email }) => {
	const transform = require('../transforms/customers');

	const { response: searchResultsResponse } = await context.callEndpoint('sfcc-data-post', {
		finalPath: '/customer_lists/(customerList)/customer_search',
		envKey,
		region,
		brand,
		locale,
		token,
		body: {
			query: {
				text_query: { fields: ['email'], search_phrase: email }
			},
			select: '(count,hits.(data.(**)))'
		}
	});

	if (searchResultsResponse.status !== 200) throw new Error(`Error searching for customers: ${JSON.stringify(searchResultsResponse)}`);

	const searchResults = transform(searchResultsResponse.body);

	const addresses = await Promise.all(
		searchResults.map((customerProfile) => {
			if (customerProfile && customerProfile.id) {
				return exports.getAddresses(envKey, token, { region, brand, locale, customerId: customerProfile.id });
			} else {
				return Promise.resolve(null);
			}
		})
	);

	searchResults.forEach((customerProfile, i) => {
		if (customerProfile && customerProfile.id) {
			customerProfile.addresses = addresses[i];
		}
	});

	return searchResults;
};

exports.getCustomerById = (envKey, token, { region, brand, locale, customerId }) => {
	return context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/customers/${customerId}`
	});
};

exports.getCustomerByCustomerNumber = async (envKey, token, { region, brand, locale, customerNumber }) => {
	const { response: { body } = {} } = await context.callEndpoint('sfcc-data-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/customer_lists/(customerList)/customers/${customerNumber}`,
		qs: {
			expand: 'product,images,availability'
		}
	});
	return body;
};

exports.getProductCollections = async (envKey, token, { region, brand, locale, customerId, transformResponse = true }) => {
	const transform = require('../transforms/product-collections');
	const response = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/customers/${customerId}/product_lists`,
		qs: {
			expand: 'product,images,availability'
		}
	});

	if (!transformResponse) return response;

	return transform(response);
};

exports.getAddresses = async (envKey, token, { region, brand, locale, customerId }) => {
	const transform = require('../transforms/customer-addresses');

	const { response } = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		locale,
		token,
		finalPath: `/customers/${customerId}/addresses`
	});

	if (response.status !== 200) throw new Error(`Error getting customer addresses: ${JSON.stringify(response)}`);

	return transform(response.body);
};
