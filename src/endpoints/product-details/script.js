module.exports = async (envKey, detailRequest) => {
	const _ = require('lodash');

	const {
		auth: { getServiceToken },
		products: { getProductDetails }
	} = require('../../_funtions/sfcc');

	const { locale } = envKey
	const { productId, productIds, variantAttributesSelected } = detailRequest;

	const token = await getServiceToken(envKey, { region, brand });

	return await getProductDetails(envKey, token, {
		locale,
		variantAttributesSelected,
		productId,
		productIds
	});
};
