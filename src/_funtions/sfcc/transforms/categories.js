module.exports = (response) => {
	const _ = require('lodash');
	const client_config = require('../../client_configs').category_filters;

	if (response.status !== 200) {
		throw new Error(_.get(response, 'body.fault.message', 'There was an error processing your request'));
	}

	const recurse = (categories) => {
		return categories
			.filter((category) => _.get(category, 'name'))
			.filter((category) => {
				let result = true;

				// if there are any attribute filters defined in the client_config
				if (_.get(client_config, 'attribute_filters')) {
					// iterate over each of them, we will drop the category if any of the filters match our criteria
					_.get(client_config, 'attribute_filters').map((attribute_filter) => {
						// see if the value matches the filter_when attribute value
						if (_.get(category, _.get(attribute_filter, 'id')) === _.get(attribute_filter, 'filter_when')) {
							// if any match, drop the category
							result = false;
						}
					});
				}

				// client-specific categories that should be excluded
				if (_.get(client_config, 'exclude_categories')) {
					_.get(client_config, 'exclude_categories').map((exclude_category) => {
						// if any category id matches our exclusion list then drop the category
						if (_.isEqual(exclude_category, _.get(category, 'id'))) {
							result = false;
						}
					});
				}

				return result;
			})
			.map((category) => {
				return {
					id: !!category.id ? category.id : null,
					label: category.name,
					path: !!category.categories ? null : category.id,
					children: !!category.categories ? recurse(category.categories) : []
				};
			});
	};

	if (response.body && !!_.get(response, 'body.categories')) {
		return recurse(_.get(response, 'body.categories'));
	}

	// hopefully we didn't get here
	return response;
};

/*
module.exports = (body) => {
    const transform = require('./category');
    return body;
};
*/
