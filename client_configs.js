module.exports = {
    product_details: {
		use_salesforce_inventory: true,
		// the following are attributes that are customizable per client although they generally use the default values
		color_variation_attribute_name: 'color', // defaults to color if not present
		image_group_view_type_large: ['large'], // defaults to large if not present
		image_group_view_type_swatch: 'swatch', // defaults to swatch if not present
		// use this to specify a different attribute for the image link
		image_link_attribute: 'link',
		/*
			variant_dependencies are important because they let us know when to restrict child variant values
			for instance; the sizeType values are dependent on what has been selected for color while the values
			for size are dependent on the color and sizeType selections.

			if a variants values have no dependencies on other variants then just leave these alone
		*/
		variant_dependency_type: 'id',
		variant_dependencies: [
			{
				id: 'color',
				dependencies: ['color']
			}
		],
		sort_variants: [{ id: 'size', type: 'numeric' }],
		select_single_option_variants: false,
		default_variant_selections: [{ id: 'color' }],
		extra_parameters: [
			{ id: 'all_images', value: true },
			{
				id: 'expand',
				value: 'images,availability,variations,links,promotions,prices,options,set_products,bundled_products'
			}
		]
	}
}