module.exports = ({ hits = [] }) => {
	const transform = require('./customer');
	return hits.map((customer) => transform(customer));
};
