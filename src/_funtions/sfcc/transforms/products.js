module.exports = (response, request) => {
	// return response;
	const _ = require('lodash');
	const client_config = require('../../client_configs').product_lists;

	if (response.status !== 200 || !!_.get(response, 'body.fault.message')) {
		throw new Error(_.get(response, 'body.fault.message', 'There was an error processing your request'));
	}

	const get_pager = () => {
		return {
			pageSize: _.get(client_config, 'page_size'),
			totalItems: _.get(response, 'body.total'),
			startItem: _.get(response, 'body.start', 0)
		};
	};

	const get_refinements = () => {
		const refinements = _.get(response, 'body.refinements', []);
		const selected_refinements = _.get(response, 'body.selected_refinements');

		return _.compact(
			refinements
				.filter((refinement) => {
					if (!_.get(client_config, 'blacklist_categories')) {
						return true;
					}

					return !_.get(client_config, 'blacklist_categories').includes(_.get(refinement, 'attribute_id'));
				})
				.map((refinement) => {
					if (!_.get(refinement, 'values')) {
						return null;
					}

					return {
						id: refinement.attribute_id,
						label: refinement.label,
						options: _.get(refinement, 'values', []).map((refinement_value) => {
							const is_selected = () => {
								let selected_refinement = _.get(selected_refinements, _.first(_.get(refinement, `attribute_id`).split(':')));
								if (!selected_refinement) {
									return false;
								} else {
									return selected_refinement.split('|').includes(_.get(refinement_value, 'value'));
								}
							};

							return {
								count: _.get(refinement_value, 'hitCount'),
								type: 'Value',
								id: _.get(refinement_value, 'value'),
								value: _.get(refinement_value, 'label'),
								label: _.get(refinement_value, 'label'),
								selected: is_selected()
							};
						})
					};
				})
		);
	};

	const get_products = () => {
		return _.get(response, 'body.hits', []).map((product) => {
			const get_colors = () => {
				let colors = [];

				if (!_.get(client_config, 'use_swatches', false)) {
					return [];
				}

				_.get(product, 'variation_attributes', [])
					.filter((variation_attribute) => variation_attribute.id === _.get(client_config, 'color_variation_attribute_name', 'color'))
					.map((variation_attribute) => {
						_.get(variation_attribute, 'values', []).map((variation_attribute_value) => {
							colors.push({
								id: variation_attribute_value.value,
								label: variation_attribute_value.name,
								swatchUrl: _.get(variation_attribute_value, 'image_swatch.link'),
								hexColor: null
							});
						});
					});

				return colors;
			};

			const get_image = () => {
				return _.get(product, 'image.link');
			};

			const get_badges = () => {
				if (!_.get(client_config, 'use_badges', false)) {
					return [];
				}

				return [{ text: 'TOP_RATED', title: 'More Colors Available...', style: '' }];
			};

			const get_id = () => {
				// if the user is searching for a sku AND this product is that sku
				if (_.isEqual(_.get(response, 'body.query'), _.get(product, 'represented_product.id'))) {
					// when that happens, return the sku so the auto-redirection to product-detail
					// will take them to the configured product instead of the base product
					return _.get(product, 'represented_product.id');
					// if the user is searching for a item id AND this product is that item id
				}

				return _.get(product, 'product_id');
			};

			return {
				id: get_id(),
				name: `${_.get(product, 'c_brand', '')} \n\n${_.get(product, 'product_name', '')}`,
				description: _.get(product, 'product_name', ''),
				style: _.get(client_config, 'useSku') ? _.get(product, 'represented_product.id') : product.product_id,
				price: _.get(product, 'price', 0),
				image: get_image(),
				colors: get_colors(),
				badges: get_badges()
			};
		});
	};

	const getTitle = (data) => {
		if (_.get(data, 'body.query')) {
			return 'Search Results for "' + _.get(data, 'body.query') + '"';
		}

		return '';
	};

	const get_sorter = () => {
		return _.get(response, 'body.sorting_options').map((option) => {
			return {
				id: _.get(option, 'id'),
				label: _.get(option, 'label'),
				value: _.get(option, 'id'),
				selected: _.isEqual(_.get(option, 'id'), _.get(request, 'qs.sort'))
			};
		});
	};

	if (response.status === 200 && _.get(response, 'body')) {
		const result = {
			id: '',
			title: getTitle(response),
			products: get_products(),
			refinements: get_refinements(),
			pager: get_pager(),
			sorter: get_sorter(),
			selected_refinements: _.get(response, 'body.selected_refinements'),
			selected_sorter: _.get(response, 'body.selected_sorting_option'),
			external: response.body,
			temp: {
				client_config: client_config,
				request: request,
				response: response
			}
		};

		return result;
	}

	return response;
};
