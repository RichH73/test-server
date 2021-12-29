module.exports = async (envKey, queryObject) => {
	const {
		auth: { getServiceToken },
		products: { searchProducts }
	} = require('../_functions/sfcc');

	const { sorter, refinements = [], pager = {}, categoryId, searchKeyword, region, brand, locale } = queryObject;

	const token = await getServiceToken(envKey, { region, brand });

	return searchProducts(envKey, token, { region, brand, locale, refinements, sorter, pager, categoryId, searchKeyword });
};
