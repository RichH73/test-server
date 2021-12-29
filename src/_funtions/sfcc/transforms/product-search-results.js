module.exports = ({ hits: searchResults = [], refinements = [], sorting_options = [], total }) => {
	return {
		products: searchResults.map(
			({
				currency,
				image: { link: imageHref } = {},
				orderable: isOrderableOnline = false,
				price,
				product_id: sku,
				product_name: name,
				variation_attributes = []
			}) => {
				return {
					id: sku,
					sku,
					price,
					isOrderableOnline,
					name,
					image: imageHref,
					currency,
					variationAttributes: variation_attributes.map(({ id, name, values }) => {
						return {
							id,
							name,
							values: values.map(({ name: valueName, description, value, orderable }) => {
								return {
									name: valueName,
									description,
									value,
									orderable
								};
							})
						};
					})
				};
			}
		),
		refinements: refinements
			.filter(({ values = [] }) => values.length)
			.map(({ attribute_id, label, values = [] }) => {
				return {
					id: attribute_id,
					label,
					values: values.map(({ label, value, hit_count: total }) => {
						return {
							label,
							value,
							total
						};
					})
				};
			}),
		sortingOptions: sorting_options.map(({ id, label }) => {
			return {
				id,
				label
			};
		}),
		total
	};
};
