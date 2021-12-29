module.exports = (response, request) => {
	const _ = require('lodash');
	// const client_config = require('../../client_configs');
	// recs: [
	// {
	// 	"id": "W0BP1SR9I51",
	// 	"product_name": "Rhinestone Logo Henley",
	// 	"image_url": "http://img.guess.com/image/upload/f_auto,q_auto,fl_strip_profile,w_800,c_scale/v1/NA/Style/ECOMM/W0BP1SR9I51-JBLK-ALT1",
	// 	"product_url": "https://www.guess.com/us/en/women/apparel/tops/layering-basics/rhinestone-logo-henley/W0BP1SR9I51.html"
	// },
	// ]

	// return {
	// 	response: response
	// };

	const transform = () => {
		// return {
		// 	request: request,
		// 	response: [id, product_name, image_url, product_url]
		// };

		const get_products = () => {
			return response.map((product) => get_product(product));
		};

		const get_product = (product) => {
			//const [id, product_name, image_url, product_url] = product;
			// const get_image = () => {
			// 	let images = _.get(product, 'image_groups', []).filter((group) =>
			// 		_.get(client_config, 'product_recommendations.image_group_view_type_large', '').includes(_.get(group, 'view_type'))
			// 	);

			// 	if (!images) {
			// 		return _.get(product, `images[0].images[0].${_.get(client_config, 'product_details.image_link_attribute')}`);
			// 	}

			// 	return _.get(images, `[0].images[0].${_.get(client_config, 'product_details.image_link_attribute')}`);
			// };

			return {
				id: product.id,
				name: product.product_name,
				description: '<a href=' + product.product_url + '>More Details</a>',
				style: product.id,
				price: null,
				image: product.image_url,
				colors: [],
				badges: [],
				metaData: product
			};
		};

		return {
			id: '',
			title: '',
			products: get_products()
		};
	};

	return transform();
};
