module.exports = {
	activity: {
		appointments: {
			version: {
				v1: 'v1'
			}
		},
		type: {
			appointment: 'Appointment'
		},
		getStatus: {
			'2': 'No Show',
			'6': 'Completed (With Purchase)',
			'3': 'Completed (Without Purchase)',
			'4': 'Cancelled',
			'0': 'Pending',
			'7': 'Completed By System'
		},
		updateStatus: {
			'No Show': '2',
			'Completed (With Purchase)': '6',
			'Completed (Without Purchase)': '3',
			Pending: '0',
			Cancelled: '4'
		},
		getBookingSource: {
			// '0': 'Other',
			'1': 'Ecomm',
			'2': 'Store/Walk-in',
			// '3': 'WalkIn',
			'4': 'Phone'
		},
		updateBookingSource: {
			// Other: '0',
			Ecomm: '1',
			'Store/Walk-in': '2',
			// WalkIn: '3',
			Phone: '4'
		}
	},
	authorization: {
		email: 'userInfo.email',
		name: 'userInfo.name',
		loginName: 'userInfo.email',
		userId: 'userInfo.preferred_username',
		userName: 'userInfo.email',
		roles: 'roles',
		permissions: 'appPermissions',
		sandbox: 'sandbox',
		tenant: 'tenant',
		sub: 'userInfo.sub',
		picture: {
			thumbnail: 'userInfo.picture'
		}
	},
	buyLink: 'https://staging-na01-guess.demandware.net/',
	category_filters: {
		attribute_filters: [],
		exclude_categories: []
	},
	conversations: {
		groups: [
			{
				roles: ['supervisor', 'manager'],
				groups: ['Store', 'Personal', 'Inbox', 'Drafts', 'Sent Items']
			},
			{
				roles: ['associate'],
				groups: ['Store', 'Personal']
			}
		],
		default_group: ['Personal']
	},
	customer_attributes: {
		customer_attributes: {
			excluded_attributes: ['store_location_id', 'furnishings', 'sms_consent', 'nationality', 'visibility', 'corporate_email']
		},
		conversationEnabled: {
			isEnabled: true,
			email: {
				isEnabled: false,
				id: 'emails'
			},
			phone: {
				isEnabled: true,
				id: 'phonenumbers',
				type: 'MOBILE'
			}
		},
		group_attributes: true,
		attribute_groups_only: true,
		filter_groups: [
			{ id: 'customer', editable: true, viewable: true, title: 'General Information' },
			{ id: 'lip', editable: true, viewable: true, title: 'Lips' },
			{ id: 'face', editable: true, viewable: true, title: 'Face' },
			{ id: 'eye', editable: true, viewable: true, title: 'Eyes' }
		],
		excluded_attributes: [],
		contact_preferences: {
			custom_attributes: ['CONTACT PREFERENCE'],
			id: 'contact_preferences'
		},
		contact_permissions: {
			custom_attributes: ['CONTACT PERMISSION'],
			exclude_contact_type: [],
			id: 'contact_permissions',
			original: {
				label: 'CONTACT PERMISSION'
			}
		}
	},
	customer_detail: {
		// these represent field values with no value, in case we want to hide these or change their default
		no_value_representations: ['N/A'],
		// if these custom attributes have "no value" as defined above, then set their values to blank
		replace_no_value_attributes: ['loyalty_tier', 'shoes', 'skirts', 'shorts', 'jacket', 'dress', 'pants', 'blazer', 'sweater', 'concept_id'],

		group_custom_attributes: true,
		exclude_empty_attributes: true,
		notes: {
			data: {
				options: {
					subtype: ['NOTE']
				}
			}
		},
		//if it is an array then in the transform we'll look for the object key and get the value, otherwise
		//we just find the object using path
		//For Arrays: override value will replace the existing object returned with the replacement value in the value field
		specific_attributes: [
			{ id: 'firstpurchasedate', path: 'FirstPurchaseDate' },
			{ id: 'lastPurchaseDate', path: 'LastPurchaseDate' },
			{ id: 'lastUpdatedDate', path: 'LastUpdateInfo.UpdateDate' },
			{ id: 'gender', path: 'EntityInformation.Individual.PersonalSummary.GenderType' },
			{ id: 'birthdate', path: 'EntityInformation.Individual.PersonalSummary.BirthDate' },
			{ id: 'loyaltybalance', path: 'CustomAttribute', isArray: true, map: 'attributes.name', key: 'LOYALTY_BALANCE', value: 'AttributeValue[0]' },
			{ id: 'homeStore', path: 'CustomAttribute', isArray: true, map: 'attributes.name', key: 'CUSTOMER_HOME_STORE', value: 'AttributeValue[0]' },
			{ id: 'ecommerceId', path: 'CustomerID' } // ecommerceId = wishlist/Product Collections customerId
		]
	},
	customer_field_data: {
		group_attributes: true,
		attribute_groups_only: true,
		excluded_attributes: ['97', '98'],
		/*
			this will let us override any of the attributes we're dynamically parsing to correct for data issues,
			or replace default behavior with a more specific module we've implemented or for client-requested changes
		*/
		attribute_overrides: [
			{
				identifier_key: {
					field: 'name',
					value: 'points_earned'
				},
				override_type: 'partial',
				overrides: {
					name: 'points_earned',
					cmp: 'ReadOnlyField',
					type: 'readOnly',
					fieldType: 'attribute'
				}
			}
		],
		additional_attributes: [
			{
				id: 'sizes',
				cmp: 'ReadOnlyField',
				name: 'attribute_group',
				type: 'readOnly',
				fieldType: 'readOnly'
			}
		]
	},
	customer_transaction_history: {
		line_item_types: ['Sale', 'Return', 'CustomerOrderForDelivery'],
		transaction_display_attributes: [
			{
				label: 'Date',
				id: 'BusinessDayDate'
			},
			{
				label: 'Order #',
				id: 'SequenceNumber'
			},
			{
				label: 'Associate',
				id: 'OperatorID'
			}
		],

		item_history: {
			line_item_display_attributes: [
				{ label: 'Item #', id: 'ItemID' },
				{ label: 'Item Price', id: 'ActualSalesUnitPrice', type: 'currency' },
				//{ label: 'Regular Price', id: 'RegularSalesUnitPrice', type: 'price' },
				{ label: 'Quantity', id: 'Quantity', type: 'integer' }
			],
			attribute_fields: [],
			description_field: 'attributes.description'
		},
		ignore_cancel_flag: true,
		ignore_void_flag: true,
		spacer: ':'
	},
	customer_favorites: {
		name: 'Favorites'
	},
	customer_overrides: {
		form_dropdowns: {
			create_customer: 'shared.createCustomerForm.fields',
			customer_search: 'modules.blackbook.views.customerSearch.landscape.parentNode.0.config.formConfig',
			edit_customer: 'shared.editCustomerAddressesForm.fields',
			checkout_form: 'modules.checkout.views.activeTransaction.landscape.parentNode.0.config.captureShippingDetails.shippingForm',
			assign_customer: 'modules.checkout.views.activeTransaction.landscape.parentNode.0.config.customerSearch.formConfig',
			search_customer: 'shared.customerSearchForm'
		}
	},
	dashboard: {
		show: {
			lists: true,
			tasks: false,
			appointments: true
		}
	},
	pos_data: {
		enums: {
			in_store: 'InStore',
			online: 'Ship'
		}
	},
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
				id: 'size',
				dependencies: ['color']
			}
		],
		sort_variants: [{ id: 'size', type: 'numeric' }],
		select_single_option_variants: true,
		default_variant_selections: [{ id: 'color' }],
		extra_parameters: [
			{ id: 'all_images', value: true },
			{
				id: 'expand',
				value: 'images,availability,variations,links,promotions,prices,options,set_products,bundled_products'
			}
		]
	},
	product_lists: {
		// we can use either the sku or the base product_id of the product when moving to product_detail
		useSku: true,
		expand: ['images', 'availability', 'variations'],
		// this is the id of the refinement_id representing the color refinement, set this only if the
		// value is different from the default value 'color'
		//'color_id': 'colorname', // defaults to color
		// if the blacklist is used, all categories in this list will be ignored
		blacklist_categories: ['cgid'],
		// the opposite of blacklist, however, if the whitelist is used, then all categories not in this
		// list should be considered blacklisted. only the categories in the whitelist should be returned
		whitelist_categories: [],
		// any refinement category listed here should allow for multiple values to be selected
		// otherwise, a new selection in a category should overwrite an existing selection
		allow_multiple_selections: ['color', 'size'],
		// this can override the page size setting default
		page_size: 24,
		use_badges: true,
		use_swatches: true
	},
	product_collections: {
		collection_type: 'single' // single or multiple
	},
	product_get_reviews: {
		// styleNumber is set in product-details and uses sfcc master.master_id, which never changes when select PDP variants
		id: 'styleNumber'
	},
	tasks: {
		task_types: {
			APPOINTMENT: 'Appointment'
		},
		type: 'Appointment',
		onlineAppointment: 'Client', // customer (Client) created appt
		closed: 'CLOSED',
		dataType: 'relate'
	}
};
