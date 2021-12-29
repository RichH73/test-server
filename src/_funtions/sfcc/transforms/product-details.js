module.exports = (response, request) => {
	const _ = require('lodash');
	const client_config = require('../../client_configs').product_details;
	// const page_type = _.get(response, 'externalProduct._type', 'product');
	const html_sanitizer = require('../../html_sanitizer');

	const query_string =
		'https://www.guess.com/us/en/' +
		`catalog/product/${_.get(response, 'body.id')}.html?storeId=${_.get(request, 'envKey.storeInfo.number')}&associateId=${_.get(
			request,
			'envKey.userInfo.userId'
		)}`;
	/*
		the response from sfcc could be a single product detail or an array of product details
		we will need to handle both scenarios!

		client_config options:
		these are configurable because our experience with several clients has shown these values can be different
		from one implementation to the next.

		- color_variation_attribute_name: the value used to represent the color variation, used for returning images
			matching a particular color selection
		- image_group_view_type_large: the view_type used to represent the images displayed on product detail
		- image_group_view_type_swatch: the view_type used to represent color swatches
		- image_link_attribute: the attribute on the image used to represent the source url
		- variant_dependencies: this allows us to filter available variant options when their availability
			depends on other variant selections. for example; variantAttributes may have a size option of "small"
			but when a color of "Red" is selected then "small" is no longer available. we use the variants array
			to make these determinations. in this example, we filter the variants based on selected_variants, the
			remaining variants array comprises the remaining possible options.

			note: if there is no dependency, it means you should return all options regardless of the variants selected
			essentially, this allows you to "start over" when configuring a product
	*/

	if (response.status !== 200) {
		return {
			response: response,
			request: request
		};
		//throw new Error(_.get(response, 'body.fault.message', 'There was an error processing your request. Please try again'));
	}

	// the magic starts here, baby!
	const parse_product = (product) => {
		let result = {};

		try {
			let variation_values = [] //_.get(request, 'variation_values', _.get(product, 'variation_values', {}));
			// first thing we'll do here is check for variants with only one option and pre-select them
			if (_.get(client_config, 'select_single_option_variants')) {
				_.get(product, 'variation_attributes', []).map((variation_attribute) => {
					// if there's only one option, it should be pre-selected no matter what may already be selected
					if (_.get(variation_attribute, 'values', []).length === 1) {
						_.set(variation_values, _.get(variation_attribute, 'id'), _.get(variation_attribute, 'values[0].value'));
					}
				});
			}

			// if we have defaults to apply, let's handle them now so the rest of the transform can use the resulting output
			if (_.get(client_config, 'default_variant_selections')) {
				_.get(client_config, 'default_variant_selections', []).map((default_variant_selection) => {
					// no need to go any further unless there isn't a selection already present in the variation_values object
					// if there is, then we shouldn't be changing it
					if (!_.get(variation_values, _.get(default_variant_selection, _.get(client_config, 'variant_dependency_type', 'id')))) {
						const variation = _.get(product, 'variation_attributes', []).find(
							(variation_attribute) =>
								_.get(variation_attribute, _.get(client_config, 'variant_dependency_type', 'id')) ===
								_.get(default_variant_selection, _.get(client_config, 'variant_dependency_type', 'id'))
						);

						// if we didn't find a variation_attribute matching the id of this default, then go no further
						if (!variation) {
							return;
						}

						// if we need to look for a particular value
						if (_.get(default_variant_selection, 'value')) {
							// let's try to find it in the variation_attributes
							let found_variation_value = _.get(variation, 'values', []).find(
								(variation_value) => _.get(variation_value, 'value') === _.get(default_variant_selection, 'value')
							);

							_.set(variation_values, _.get(default_variant_selection, 'id'), _.get(found_variation_value, 'value'));
						} else {
							_.set(variation_values, _.get(default_variant_selection, 'id'), _.get(variation, 'values[0].value'));
						}
					}
				});
			}

			const selected_variant = _.get(product, 'c_variants', []).find((variant) => _.isEqual(_.get(variant, 'variation_values'), variation_values));

			const get_bullet_points = () => {
				/*
					schema: array of string
					['', '']
				*/
				let result = [];

				try {
				} catch (exception) {
					throw new Error('getBulletPoints');
				}

				return result;
			};

			const get_images = () => {
				/*
					schema: array of string
					['', '']

					each image_group contains an array of images. they are unique by their view_type and their variation_attributes
					example; view_type='large' or 'swatch' and variation_attributes for different colors and sizes such as
					large red dress vs petite red dress and black shirt vs white shirt
				*/
				let result = [];

				try {
					// image parser
					const parseImages = (image_group) => {
						return _.get(image_group, 'images', []).map((image) => _.get(image, _.get(client_config, 'image_link_attribute', 'link')));
					};

					const image_groups = _.get(product, 'image_groups', [])
						.filter((image_group) => _.get(client_config, 'image_group_view_type_large', []).includes(_.get(image_group, 'view_type')))
						// find the image_groups containing the large images to be displayed on product detail view
						//.filter(image_group => _.isEqual(_.get(image_group, 'view_type'), _.get(client_config, 'image_group_view_type_large', 'large')))
						// then look for matches on available variation_attributes with ones selected by the user
						.filter((image_group) => {
							// keep track of how many matches each image_group has, at then end we'll give preference to
							// the image_group that best matches the selected variants
							_.set(image_group, 'match_count', 0);
							_.set(image_group, 'color_match', false);

							// all images are large ones now
							// first see if any variants have been selected, if not then pass back the default images
							if (_.isEmpty(variation_values)) {
								// the default images have no variation_attributes
								return !_.get(image_group, 'variation_attributes');
							}

							// if we have variation_values and this image_group has no variation attributes but others do
							if (
								!_.get(image_group, 'variation_attributes') &&
								_.get(product, 'image_groups', []).filter((image_group) => _.get(image_group, 'variation_attributes')).length > 0
							) {
								// then ignore this image_group
								return false;
							}

							// if no groups have variation_attributes, return true
							if (!_.get(product, 'image_groups', []).find((image_group) => _.get(image_group, 'variation_attributes'))) {
								return true;
							}

							// if we get here, it means we have at least some variants selected
							// loop over the available variation_attributes and see how closely they match
							_.get(image_group, 'variation_attributes', []).map((variation_attribute) => {
								// find the selected variant that corresponds to this variation_attribute
								const matching_selected_variant = _.get(variation_values, _.get(variation_attribute, 'id'));

								// so long as we have a match
								if (matching_selected_variant) {
									_.get(variation_attribute, 'values', []).map((variation_attribute_value) => {
										// iterate over each of the possible values for this matching attribute and look for a match
										if (_.isEqual(matching_selected_variant, _.get(variation_attribute_value, 'value'))) {
											// increment the number of matches found on this image_group
											_.set(image_group, 'match_count', _.get(image_group, 'match_count') + 1);

											// if this match is also on the color, we'll show preference for this than over a match on
											// other variants such as size or sizeType
											if (_.isEqual(_.get(client_config, 'color_variation_attribute_name'), _.get(variation_attribute, 'id'))) {
												_.set(image_group, 'color_match', true);
											}
										}
									});
								}
							});

							// return only image_groups that match on at least one field
							return _.get(image_group, 'match_count') > 0;
						})
						// sort the results from best match to worst
						.sort((a, b) => {
							// first sort by how many matches each image_group has with selected variants
							if (_.get(b, 'match_count') > _.get(a, 'match_count')) {
								return 1;
							}
							// the tie breaker will be to prioritize matches on color
							else {
								return _.get(b, 'color_match') > _.get(a, 'color_match') ? 1 : -1;
							}
						});

					// if matches are found, parse the first image_group and return it
					if (image_groups) {
						result = parseImages(_.first(image_groups));
					}
				} catch (exception) {
					throw new Error('getImages');
				}

				return result;
			};

			const get_image_thumbs = () => {
				/*
					schema: array of string
					['', '']
				*/
				let result = [];

				try {
				} catch (exception) {
					throw new Error('getImageThumbs');
				}

				return result;
			};

			const get_pricing = () => {
				let price = _.get(response, 'body.price');
				return {
					sale: {
						low: {
							label: '',
							value: null
						},
						high: {
							label: '',
							value: null
						},
						value: price
					}
				};
			};

			const get_sku = () => {
				/*
					if we have all variants selected, then we can look for a match in the variants array to find the sku
					match up variation_attributes with the variant.variation_values
				*/
				let result = _.get(response, 'body.id', '');

				return result;
			};

			const get_variant = () => {
				let result = {};
				/*
					schema:
					{
						sku: string
						posSku: string
						isAvailable: boolean
						pdpUrl: string
						colorLabel: string
						sizeTypeLabel: string
						sizeLabel: string
						variantAttributeValues: same as variantAttributesSelected
						pricing: {
							sale: float
							list: float
						}
						quantity: int
					}
				*/
				try {
					if (!selected_variant) {
						return null;
					}

					// each client implements pricing very differently, don't know that there's a generic way to parse these properly
					const getVariantPricing = () => {
						return {
							sale: 0,
							list: 0
						};
					};

					const get_inventory = () => {
						// return 255;
						if (!_.get(client_config, 'use_salesforce_inventory', false)) {
							return 0;
						}

						return _.get(product, 'inventory.stock_level', 0);
					};

					// we're doing this dynamically so we can avoid hardcoding stuff. don't assume you will always know
					// all the variants a client will use
					// loop over each selected_variant, then go to the variation_attributes and find the selected value and return the label
					const get_selected_variant_labels = () => {
						// loop over each selected variant
						get_variant_attributes().map((variation_attribute) => {
							// find the selected variant value
							const selected_value = _.get(variation_attribute, 'values', []).find(
								(variation_attribute_value) => !!_.get(variation_attribute_value, 'selected')
							);

							// if you got one...
							if (selected_value) {
								// add the field to the variant object and set it's value to the label field
								result[_.get(variation_attribute, 'id') + 'Label'] = _.startCase(_.get(selected_value, 'label'));
							}
						});
					};

					result = {
						sku: get_sku(),
						posSku: get_sku(),
						isAvailable: is_available(),
						pdpUrl: '',
						variantAttributeValues: variation_values,
						pricing: getVariantPricing(),
						quantity: get_inventory(),

						// this is what the inventory response looks like

						// "inventory": {
						// 	"_type": "inventory",
						// 	"ats": 409,
						// 	"backorderable": false,
						// 	"id": "guess_us",
						// 	"orderable": true,
						// 	"preorderable": false,
						// 	"stock_level": 409
						// },

						inventories: {
							currentSelection: 'Online',
							options: [
								{
									id: 'Online',
									qtyOnHand: get_inventory(),
									label: 'Buy Online',
									additionalText: `${get_inventory()} Available`,
									translateStrings: true,
									textDecorator: _.isEqual(_.get(response, 'body.inventory.orderable'), false) ? 'alert' : false
								},
								{
									id: 'InStore',
									qtyOnHand: get_inventory(),
									label: 'Buy in Store',
									additionalText: `${3} Available in Stock`,
									textDecorator: _.isEqual(_.get(response, 'body.inventory.orderable'), false) ? 'alert' : false,
									translateStrings: true
								}
							]
						}
					};

					get_selected_variant_labels();
				} catch (exception) {
					throw new Error('getVariant');
				}

				return result;
			};

			const get_variant_attributes = () => {
				/*
					schema: array of variant objects
					{
						'id': string,
						'label': string,
						'values': [
							{
								'id': string,
								'label': string,
								'swatchUrl': string,
								'hexColor': string,
								'available': boolean,
								'selected': boolean
							}
						]
					}
				*/
				let result = [];

				try {
					const is_selected = (variation, option) => {
						const id = _.get(variation, 'id', '');
						const option_value = _.get(option, 'value');

						return _.isEqual(option_value, _.get(variation_values, id));
					};

					const get_swatch = (product, variant, option) => {
						try {
							let result = '';
							const color_attribute_name = _.get(client_config, 'color_variation_attribute_name', 'color');

							// don't do all this unless we're dealing with the color variant
							if (!_.isEqual(_.get(variant, 'id'), color_attribute_name)) {
								return null;
							}

							const swatch_type = _.get(client_config, 'image_group_view_type_swatch', 'swatch');
							const image_link_attribute = _.get(client_config, 'image_link_attribute', 'link');
							let image_groups = _.get(product, 'image_groups', [])
								.filter((image_group) => _.isEqual(swatch_type, _.get(image_group, 'view_type'))) // only use swatch view_types
								.filter((image_group) => {
									// isolate the variation_attributes specific to color
									var color_variation_attribute = _.get(image_group, 'variation_attributes', []).find((variation_attribute) =>
										_.isEqual(color_attribute_name, _.get(variation_attribute, 'id'))
									);

									// so long as we find some
									if (color_variation_attribute) {
										// iterate over the values array
										return !!_.get(color_variation_attribute, 'values', []).find((color_variation_attribute_value) => {
											// and return any that match the color specified in this option
											return _.isEqual(_.get(color_variation_attribute_value, 'value'), _.get(option, 'value'));
										});
									} else {
										// if we didn't find a matching variation attribute it could just mean that none of the image_groups
										// have variation attributes, in this case return true;
										let total_groups_with_variation_attributes = _.get(product, 'image_groups', []).filter(
											(image_group) => !!_.get(image_group, 'variation_attributes')
										);

										if (!total_groups_with_variation_attributes.length > 0) {
											return true;
										}
									}

									return false;
								});

							// if we find the appropriate image_group(s)
							if (image_groups) {
								let images = [];

								// extract the images
								image_groups.map((image_group) => _.get(image_group, 'images', []).map((image) => images.push(_.get(image, image_link_attribute))));

								// and take the first one
								result = _.first(images);
							}

							return result;
						} catch (e) {
							throw new Error('get_variant_attributes.get_swatch');
						}
					};

					const dependency_match_object = (dependencies, variation_attribute, variation_attribute_value) => {
						let result = {};

						// for each dependency attribute
						dependencies.map((dependency) => {
							// if it has a selected value in our variation_values object, meaning that variant has been selected
							// add it to our match object. if it doesn't have a value then we don't have any reason to restrict
							// availability yet
							if (_.get(variation_values, dependency)) {
								result[dependency] = variation_values[dependency];
							}
						});

						return Object.assign({}, result, {
							[_.get(variation_attribute, _.get(client_config, 'variant_dependency_type', 'id'))]: _.get(variation_attribute_value, 'value')
						});
					};

					const is_variant_available = (dependencies, variation_attribute, variation_attribute_value) => {
						try {
							/*
								the idea here is to determine if this variation_attribute depends on other variation_attributes and,
								if it does have dependencies, to then determine if the variants already selected have a sku available
								for this attribute value.

								for example; the user has already selected color:RED and sizeType:MS and size has a dependency on [color,sizeType]
								so now, the only sizes that are available are those which have a corresponding variant that is both RED and MS.

								this function is called for each variation_attribute value and a comparison object is created and used to compare
								to all the available variants. in our example above we'd have the following:
								{
									'color': 'RED',
									'sizeType': 'MS',
									'size': '092' // this will change each time we iterate through the 'size' variation_attributes
								}

								if there is a variant with a matching variation_values object, then we know this size is available, otherwise
								there is no corresponding sku and therefore this combination of variants is not available
							*/

							// if we have no dependencies, we don't need to worry about it
							if (!dependencies) {
								return true;
							}

							// create our comparison object
							const match_object = dependency_match_object(dependencies, variation_attribute, variation_attribute_value);

							// look for a match in the variants array
							return !!product.variants
								.filter((variant) => {
									// check the client config to know if we should only consider variants where orderable: true
									if (_.get(client_config, 'include_only_orderable_variants')) {
										return _.get(variant, 'orderable');
									}

									// otherwise, bypass this filter
									return true;
								})
								.filter((variant) => {
									// _.isMatch() does partial matches!!! this is important because we may have only a partially
									// selected variant object. ie. they've only selected 'color' but not 'sizeType' or 'size'
									return _.isMatch(variant.variation_values, match_object);
								}).length;
						} catch (e) {
							throw new Error('get_variant_attributes.is_available');
						}
					};

					const to_decimal = (fraction) => {
						fraction = fraction.toString();
						var result,
							wholeNum = 0,
							frac,
							deci = 0;
						if (fraction.search('/') >= 0) {
							if (fraction.search(' ') >= 0) {
								wholeNum = fraction.split(' ');
								frac = wholeNum[1];
								wholeNum = parseInt(wholeNum, 10);
							} else {
								frac = fraction;
							}
							if (fraction.search('/') >= 0) {
								frac = frac.split('/');
								deci = parseInt(frac[0], 10) / parseInt(frac[1], 10);
							}
							result = wholeNum + deci;
						} else {
							result = parseFloat(fraction);
						}
						return result;
					};

					const sort_variants = (variation_attribute) => {
						let sort_variant = _.get(client_config, 'sort_variants', []).find(
							(variant) =>
								_.get(variant, _.get(client_config, 'variant_dependency_type', 'id')) ===
								_.get(variation_attribute, _.get(client_config, 'variant_dependency_type', 'id'))
						);

						if (!sort_variant) {
							return variation_attribute;
						}

						if (_.get(sort_variant, 'type') === 'numeric') {
							return Object.assign({}, variation_attribute, {
								values: _.get(variation_attribute, 'values')
									.map((variation_attribute_value) => {
										return Object.assign({}, variation_attribute_value, {
											numeric: to_decimal(_.get(variation_attribute_value, 'name').replace(/[a-zA-Z]/g, ''))
										});
									})
									.sort((a, b) => (a.numeric > b.numeric ? 1 : b.numeric > a.numeric ? -1 : 0))
							});
						}
						// "options" is not defined. This block is commented out as I don't believe it is doing anything.
						// It has been left in in case it is part of a hacky block needed for the app to work.
						// else {
						// 	return options;
						// }
					};

					result = _.get(product, 'variation_attributes', [])
						.filter((variation_attribute) => _.get(variation_attribute, 'values'))
						.map((variation_attribute) => {
							// get the variant dependencies for this variation attribute
							const variant_dependencies = _.get(client_config, 'variant_dependencies').find(
								(variant_dependency) =>
									_.get(variant_dependency, _.get(client_config, 'variant_dependency_type', 'id')) ===
									_.get(variation_attribute, _.get(client_config, 'variant_dependency_type', 'id'))
							);

							return {
								id: _.get(variation_attribute, 'id'),
								label: _.get(variation_attribute, 'name'),
								values: _.get(sort_variants(variation_attribute), 'values', []).map((variation_attribute_value) => {
									// const isAvailable = _.get(variation_attribute_value, 'orderable');

									return {
										id: _.get(variation_attribute_value, 'value', ''),
										label: _.get(variation_attribute_value, 'name', ''),
										swatchUrl: get_swatch(product, variation_attribute, variation_attribute_value),
										hexColor: null,
										available: is_variant_available(_.get(variant_dependencies, 'dependencies'), variation_attribute, variation_attribute_value),
										// available: isAvailable, // is_variant_available(_.get(variant_dependencies, 'dependencies'), variation_attribute, variation_attribute_value),
										selected: is_selected(variation_attribute, variation_attribute_value)
									};
								})
							};
						});
				} catch (exception) {
					throw new Error('get_variant_attributes');
				}

				return result;
			};

			const is_available = () => {
				/*
					if we have a configured variant, the check the orderable property there, otherwise look on the master object
				*/
				let result = false;

				try {
					if (get_sku()) {
						result = true; //_.get(selected_variant, 'orderable', false);
					} else {
						//result = _.get(product, 'master.orderable', false);
					}
				} catch (exception) {
					throw new Error('is_available');
				}

				return result;
			};

			const set_add_to_cart_state = () => {
				// false means the add to cart button will not be disabled
				let sku = get_sku();
				if (sku.length && is_available()) {
					return false;
				}

				return true;
			};

			const get_short_description = () => {
				const { short_description } = product;
				const newDescription = `<b>Sku: ${get_sku()}</b><br><br><b> Description: </b>${html_sanitizer(short_description)}`;
				return newDescription;
			};

			// const get_long_description = () => {
			// 	if (!_.get(product, 'long_description')) {
			// 		return html_sanitizer(_.get(product, 'short_description', ''));
			// 	}
			//
			// 	return html_sanitizer(_.get(product, 'long_description', ''));
			// };

			const get_ratings = () => {
				return {
					averageRating: 0,
					count: 0
				};
			};

			const get_dynamic_variants = () => {
				const dynamic_variants = {};
				const get_variant_attributes_array = get_variant_attributes() ? get_variant_attributes() : [];

				get_variant_attributes_array.map((item, i) => {
					Object.assign(dynamic_variants, {
						[i]: {
							variant: item.id,
							cmp: _.isEqual(_.get(item, 'id'), _.get(client_config, 'color_variation_attribute_name')) ? 'color' : 'variantPicker', // show color swatches not color labels on PDP
							type: item.id,
							label: item.label
						}
					});
				});

				return dynamic_variants;
			};

			// const parse_body = () => {
			// 	// we go through this extra step in case we're dealing with a list of product detail objects
			//
			// 	// if the response contains a single product detail
			// 	if (_.isEqual(page_type, 'product')) {
			// 		return Object.assign({}, parse_product(_.get(response, 'body'), request), {
			// 			externalProduct: response
			// 		});
			// 	}
			// 	// else if there are multiple results returned
			// 	else if (_.isEqual(page_type, 'product_result')) {
			// 		return _.get(response, 'body.data', []).map((product) => parse_product(product));
			// 	}
			// 	// we don't know what to parse
			// 	else {
			// 		return response;
			// 	}
			// };

			result = {
				displayConfig: get_dynamic_variants(variation_values), // use displayConfig with dynamicVariant in appconfig for variants, e.g. color, size, length variants
				id: _.get(product, 'id', ''),
				styleNumber: _.get(product, 'master.master_id', ''),
				sku: get_sku(),
				name: `${_.get(product, 'brand', '')} ${_.get(product, 'name', '')}`,
				shortDescription: get_short_description(),
				longDescription: get_short_description(),
				bulletNotes: get_bullet_points(),
				isAvailable: is_available(),
				images: get_images(),
				imageThumbs: get_image_thumbs(),
				pricing: get_pricing(),
				variantAttributes: get_variant_attributes(),
				variantAttributesSelected: variation_values,
				notPurchaseable: false,
				ratings: get_ratings(),
				variant: get_variant(),
				//TODO remove metaData for production environment

				allSizes: [],
				disableAddToCart: set_add_to_cart_state(),
				productLink: query_string
			};
		} catch (exception) {
			throw new Error(exception);
		}

		return result;
	};

	return parse_product(_.get(response, 'body'));
};
