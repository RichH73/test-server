module.exports = (response) => {
	const _ = require('lodash');
	const client_configs = require('../../client_configs');

	const transform = () => {
		const image_link = _.get(client_configs, 'product_details.image_link_attribute', 'link');
		return _.get(response, 'response.body.data', [])
			.map((list) => {
				const get_products = () => {
					return (
						_.get(list, 'customer_product_list_items', [])
							.filter((list_item) => _.get(list_item, 'product'))
							//.filter(list_item => !_.get(list_item, 'public'))
							.map((list_item) => {
								return {
									id: _.get(list_item, 'product_id'),
									name: _.get(list_item, 'product.name'),
									image: _.get(list_item, `product.image_groups[0].images[0].${image_link}`),
									isFinalSku: _.get(list_item, 'product.type.variant', false),
									sku: _.get(list_item, 'product_id'),
									quantity: _.get(list_item, 'product.quantity'),
									fulfillmentType: ''
								};
							})
					);
				};

				const has_final_skus = () => {
					return get_products().filter((product) => _.get(product, 'isFinalSku')).length > 0;
				};

				return {
					id: _.get(list, 'id'),
					type: _.get(list, 'type'),
					name: '',
					hasFinalSkus: has_final_skus(),
					readOnly: false,
					products: get_products()
				};
			})
			.filter((list) => _.get(list, 'products', []).length > 0);
		// filter out any noise with wishlists that have nothing in them
	};

	return transform();
};
