module.exports = {
	customer: {
		attributes: [
			{
				id: 'addresses',
				type: 'ADDRESS',
				value: [
					{
						id: '3',
						key: '3',
						isPrimary: true,
						type: 'HOME',
						street: '123 EASY ST 6',
						city: 'LECANTO',
						country: 'US',
						state: 'ALABAMA',
						postalCode: '34461',
						attribute_type: 'ADDRESS',
					},
				],
			},
            {
                id: 'quick_view_country',
                type: 'OTHER',
                value: 'CA'
            },
			{
				id: 'quick_view_street',
				type: 'OTHER',
				value: '123 EASY ST 6',
			},
			{
				id: 'quick_view_street2',
				type: 'OTHER',
			},
			{
				id: 'quick_view_address',
				type: 'OTHER',
				value: 'LECANTO, ALABAMA 34461',
			},
			{
				id: 'phonenumbers',
				type: 'PHONE',
				value: [
					{
						id: '1',
						key: '1',
						isPrimary: true,
						type: 'MOBILE',
						number: '3524768535',
						attribute_type: 'PHONE',
						isConversationEnabled: true,
					},
					{
						id: '2',
						key: '2',
						isPrimary: false,
						type: 'MOBILE',
						number: '13524768532',
						attribute_type: 'PHONE',
						isConversationEnabled: true,
					},
				],
			},
			{
				id: 'quick_view_phone',
				type: 'OTHER',
				value: '3524768535',
			},
			{
				id: 'emails',
				type: 'EMAIL',
				value: [
					{
						id: '2',
						key: '2',
						isPrimary: true,
						type: 'WORK',
						email: 'rhowell@madmobile.com',
						original: 'rhowell@madmobile.com',
						attribute_type: 'EMAIL',
					},
				],
			},
			{
				id: 'quick_view_email',
				type: 'OTHER',
				value: 'rhowell@madmobile.com',
			},
			{
				id: 'email_rcpt_flag',
				type: 'OTHER',
				value: 'false',
			},
			{
				id: 'active_flag',
				type: 'OTHER',
				value: 'true',
			},
			{
				id: 'email_opt_us_guesslist',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'party_type_code',
				type: 'OTHER',
				value: 'CUSTOMER',
			},
			{
				id: 'prompt_to_join_loyalty',
				type: 'OTHER',
				value: 'true',
			},
			{
				id: 'gendertype',
				name: 'GenderType',
				type: 'OTHER',
				value: 'M',
			},
			{
				id: 'birthdate',
				name: 'BirthDate',
				type: 'OTHER',
				value: '2021-06-15',
			},
			{
				id: 'anniversary',
				name: 'Anniversary',
				type: 'OTHER',
				value: '2019-12-23',
			},
			{
				id: 'maritalstatuscode',
				name: 'MaritalStatusCode',
				type: 'OTHER',
				value: 'UNKNOWN',
			},
			{
				id: 'rent',
				name: 'Rent',
				type: 'OTHER',
				value: false,
			},
			{
				id: 'highesteducationallevelname',
				name: 'HighestEducationalLevelName',
				type: 'OTHER',
				value: '',
			},
			{
				id: 'totalreturnsamount',
				name: 'TotalReturnsAmount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'totalsalesamount',
				name: 'TotalSalesAmount',
				type: 'OTHER',
				value: '47.6',
			},
			{
				id: 'totaltransactioncount',
				name: 'TotalTransactionCount',
				type: 'OTHER',
				value: '1',
			},
			{
				id: 'totalitemssoldcount',
				name: 'TotalItemsSoldCount',
				type: 'OTHER',
				value: '1',
			},
			{
				id: 'totalitemsreturnedcount',
				name: 'TotalItemsReturnedCount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'yeartodatereturnsamount',
				name: 'YearToDateReturnsAmount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'yeartodatesalesamount',
				name: 'YearToDateSalesAmount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'yeartodatetransactioncount',
				name: 'YearToDateTransactionCount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'yeartodateitemssoldcount',
				name: 'YearToDateItemsSoldCount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'yeartodateitemsreturnedcount',
				name: 'YearToDateItemsReturnedCount',
				type: 'OTHER',
				value: '0',
			},
			{
				id: 'contacttype_mail',
				label: 'ContactType_Mail',
				type: 'OTHER',
				value: 'false',
			},
			{
				id: 'contacttype_phone',
				label: 'ContactType_Phone',
				type: 'OTHER',
				value: 'true',
			},
			{
				id: 'contacttype_fax',
				label: 'ContactType_Fax',
				type: 'OTHER',
				value: 'false',
			},
			{
				id: 'contacttype_email',
				label: 'ContactType_Email',
				type: 'OTHER',
				value: 'true',
			},
			{
				id: 'homestorename',
				name: 'CUSTOMER_HOME_STORE',
				value: '5039',
			},
			{
				id: 'loyaltybalance',
				name: 'LOYALTY_BALANCE',
				type: 'OTHER',
				value: '60120001',
			},
			// {
			// 	id: 'loyaltyaccountnumber',
			// 	name: 'LOYALTY_ACCOUNT_NUMBER',
			// 	type: 'OTHER',
			// 	value: '60120001',
			// },
			{
				id: 'loyaltysignup',
				value: true,
			},
			{
				id: 'firstpurchasedate',
				label: 'firstpurchasedate',
				type: 'OTHER',
				value: '2019-12-23',
			},
			{
				id: 'lastpurchasedate',
				label: 'lastPurchaseDate',
				type: 'OTHER',
				value: '2019-12-23',
			},
			{
				id: 'lastupdateddate',
				label: 'lastUpdatedDate',
				type: 'OTHER',
				value: '2021-10-27T05:24:31.000-07:00',
			},
			{
				id: 'gender',
				label: 'gender',
				type: 'OTHER',
				value: 'M',
			},
			{
				id: 'homestore',
				label: 'homeStore',
				type: 'OTHER',
				value: [
					{
						attributes: {
							editable: 'true',
							name: 'EMAIL_RCPT_FLAG',
						},
						AttributeValue: ['false'],
					},
					{
						attributes: {
							editable: 'true',
							name: 'ACTIVE_FLAG',
						},
						AttributeValue: ['true'],
					},
					{
						attributes: {
							editable: 'true',
							name: 'Email_Opt_US_GuessList',
						},
						AttributeValue: ['0'],
					},
					{
						attributes: {
							editable: 'true',
							name: 'PARTY_TYPE_CODE',
						},
						AttributeValue: ['CUSTOMER'],
					},
					{
						attributes: {
							editable: 'true',
							name: 'PROMPT_TO_JOIN_LOYALTY',
						},
						AttributeValue: ['true'],
					},
				],
			},
			{
				id: 'ecommerceId',
				label: 'ecommerceId',
				type: 'OTHER',
				value: '25894236',
			},
			{
				id: 'contact_permissions',
				type: 'CUSTOM',
				value: [
					{
						id: 'contact_permissions',
						contact_permissions: 'Email,Phone',
						label: 'Opt-In Status',
						name: 'contact_permissions',
					},
				],
			},
			{
				id: 'favorite-customer',
				type: 'OTHER',
				value: false,
			},
			{
				id: 'lastOutreachDate',
				type: 'CUSTOM',
				value: '2021-09-07T10:06:34.000-07:00',
			},
			{
				id: 'social_media',
				type: 'CUSTOM',
				value: [
					{
						id: '253',
						name: 'location',
						label: 'LOCATION',
						isHidden: true,
						value: '',
						original: {
							id: '253',
							name: 'location',
							label: 'LOCATION',
							value: '',
							dataType: 'Character',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '254',
						name: 'language',
						label: 'LANGUAGE',
						isHidden: true,
						value: '',
						original: {
							id: '254',
							name: 'language',
							label: 'LANGUAGE',
							value: '',
							dataType: 'Character',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '255',
						name: 'friends_count',
						label: 'FRIENDS_COUNT',
						isHidden: true,
						value: '',
						original: {
							id: '255',
							name: 'friends_count',
							label: 'FRIENDS_COUNT',
							value: '',
							dataType: 'Number',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '256',
						name: 'followers_count',
						label: 'FOLLOWERS_COUNT',
						isHidden: true,
						value: '',
						original: {
							id: '256',
							name: 'followers_count',
							label: 'FOLLOWERS_COUNT',
							value: '',
							dataType: 'Number',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '257',
						name: 'school_name',
						label: 'SCHOOL_NAME',
						isHidden: true,
						value: '',
						original: {
							id: '257',
							name: 'school_name',
							label: 'SCHOOL_NAME',
							value: '',
							dataType: 'Character',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '258',
						name: 'hometown',
						label: 'HOMETOWN',
						isHidden: true,
						value: '',
						original: {
							id: '258',
							name: 'hometown',
							label: 'HOMETOWN',
							value: '',
							dataType: 'Character',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '259',
						name: 'gender',
						label: 'GENDER',
						isHidden: false,
						value: 'M',
						original: {
							id: '259',
							name: 'gender',
							label: 'GENDER',
							value: '',
							dataType: 'Character',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
					{
						id: '260',
						name: 'school_year',
						label: 'SCHOOL_YEAR',
						isHidden: true,
						value: '',
						original: {
							id: '260',
							name: 'school_year',
							label: 'SCHOOL_YEAR',
							value: '',
							dataType: 'Character',
							isUnique: true,
							isRequired: false,
							isEditable: false,
							group: 'social_media',
						},
					},
				],
			},
		],
		firstName: 'Richard',
		lastName: 'Howell',
		id: '25894236',
	},
};
