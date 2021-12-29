exports.getServiceToken = (envKey, { region: requestRegion, brand: requestBrand }) => {
	const {
		storeInfo: { region: deviceRegion, chain: deviceBrand },
	} = envKey;

	const brand = requestBrand || deviceBrand;
	const region = requestRegion || deviceRegion;

	return context.callEndpoint('sfcc-get-token', { region, brand });
};

exports.getCustomerToken = (envKey, token, { region: requestRegion, brand: requestBrand, customerId }) => {
	const {
		storeInfo: { region: deviceRegion, chain: deviceBrand },
	} = envKey;

	const brand = requestBrand || deviceBrand;
	const region = requestRegion || deviceRegion;

	return context.callEndpoint('sfcc-get-customer-token', { token, region, brand, customerId });
};
