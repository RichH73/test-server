module.exports = ({ body: { data: stores = [] } = {} }) => {
	const { store: transform } = require('.');
	return stores.map((store) => transform(store));
};
