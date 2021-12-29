exports.getProductCategories = async (envKey, { region, brand }) => {
	const { response } = await context.callEndpoint('sfcc-get', {
		envKey,
		region,
		brand,
		finalPath: '/categories/root',
		qs: {
			levels: 3
		}
	});

	if (response.status !== 200) throw new Error(`Error searching for stores in Salesforce: ${JSON.stringify(response)}`);

	return response.body;
};

exports.searchProducts = async (envKey, token, { region, brand, refinements, sorter, pager: { startItem = 0 }, categoryId, searchKeyword }) => {
	const transform = require('../transforms/products');
	const {
		product_lists: { page_size }
	} = require('../../client_configs');

	function getRefinements(requestRefinements) {
		// loop over each group of refinements, then each option and filter out the ones not selected
		// the return the result as a query string
		const refinementQueryParams = {};
		requestRefinements
			.filter(({ options = [] }) => options.find((option) => option.updatedStatus || option.selected))
			.map(({ options = [], id }, refinement_index) => {
				const selected_options = options
					// filters out refinements that were previously selected and then clicked on
					// again, indicating they're de-selecting the option
					.filter((option) => !(option.hasOwnProperty('updatedStatus') && !option.updatedStatus && option.selected))
					// filters out any refinement that isn't selected or doesn't have updatedStatus
					.filter((option) => option.updatedStatus || option.selected)
					.map((option) => option.id);

				if (!selected_options) {
					return;
				}

				refinementIndex++;
				refinementQueryParams[`refine_${refinement_index}`] = `${id}=${selected_options.join('|')}`;
			});
		return refinementQueryParams;
	}

	let refinementIndex = 0; // User as part of a query param key name when building query params for this call.
	let hasFilter = false; // Set & used later to return the start page back to zero when a filter is set.

	const selectedSorter = sorter.find((x) => (x.hasOwnProperty('updatedStatus') ? x.updatedStatus : x.selected)) || {};

	refinements.forEach(({ options = [] }) => {
		options.forEach(({ updatedStatus = false }) => {
			if (updatedStatus) {
				hasFilter = true;
			}
		});
	});

	const request = {
		envKey,
		region,
		brand,
		finalPath: `/product_search`,
		token,
		qs: {
			expand: 'images,availability,variations,prices,',
			start: hasFilter ? 0 : startItem,
			count: page_size,
			sort: selectedSorter.value
		}
	};

	Object.assign(request.qs, {
		...getRefinements(refinements)
	});

	if (categoryId) {
		Object.assign(request.qs, {
			[`refine_${refinementIndex}`]: `cgid=${categoryId}`
		});
	}

	if (searchKeyword) {
		Object.assign(request.qs, {
			q: searchKeyword
		});
	}

	const { response } = await context.callEndpoint('sfcc-get', { ...request });

	// productLink
	Object.assign(response, { envKey });

	return transform(response, request);
};

exports.getById = async (envKey, token, { region, brand, productId, stores }) => {
	const {
		product_details: { extra_parameters }
	} = require('../../client_configs');

	const { getSalesforceCurrencyByRegion } = require('../../helper_functions');

	const { storeInfo: { region: storeRegion } = {} } = envKey;

	const { response } = await context.callEndpoint('sfcc-get', {
		finalPath: `/products/${productId}`,
		envKey,
		region,
		brand,
		token,
		qs: {
			all_images: true,
			expand: extra_parameters.find((params) => params.id === 'expand').value,
			currency: getSalesforceCurrencyByRegion(region || storeRegion),
			bopis_stores: stores ? stores.join(',') : undefined
		},
		dump_config: false
	});
	exports.getProductDetails = (envKey, token, { region, brand, variantAttributesSelected, productId, productIds, stores = [] } = {}) => {
		const transformProductDetails = require('../transforms/product-details');

		let selectedProductId = new String(productId).split('-')[0];
		// Get a collection of products if productIds is passed.
		if (productIds) {
			// allow for multiple product id's to be sent, mostly used for recommended products
			selectedProductId = `(${productIds.join(',')})`;
		}

		let productsResponse = exports.getById(envKey, token, { region, brand, productId: selectedProductId, stores });

		// Transform into product details model
		let productDetails = transformProductDetails(envKey, productsResponse, variantAttributesSelected, region, brand);
		// productDetails.ratings = ratings;

		return productDetails;
	};
	return response;
};

// TODO Figure out why there's two of exports.getProductDetails

exports.getProductDetails = async (envKey, token, { region, brand, variantAttributesSelected, productId, productIds, stores = [] } = {}) => {
	const transformProductDetails = require('../transforms/product-details');
	// const transformRatings = require('../../bazaar-voice/transforms/product-ratings');

	let selectedProductId = new String(productId).split('-')[0];
	// Get a collection of products if productIds is passed.
	if (productIds) {
		// allow for multiple product id's to be sent, mostly used for recommended products
		selectedProductId = `(${productIds.join(',')})`;
	}

	let productsResponse = await exports.getById(envKey, token, { region, brand, productId: selectedProductId, stores });

	// If a variant is selected, determine the real product id and do a repeat/replacement search in OCAPI to make sure we get the correct inventory
	if (variantAttributesSelected) {
		const productVariants = productsResponse.body.variants || [];
		const selectedVariant = productVariants.find(({ variation_values: variantValues }) => {
			return Object.keys(variantAttributesSelected).every((key) => {
				return variantAttributesSelected[key] === variantValues[key];
			});
		});
		//if (selectedVariant) productsResponse = await exports.getById(envKey, token, { region, brand, productId: selectedVariant.product_id, stores });
	}

	// Transform into product details model
	const productDetails = transformProductDetails(envKey, productsResponse, variantAttributesSelected, region, brand);

	const response = productsResponse;

	const request = { envKey };

	return transformProductDetails(response, request, productDetails);
};
