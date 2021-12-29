module.exports = ({
	id,
	name,
	store_hours: hours,
	address1,
	address2,
	city,
	state_code: state,
	postal_code: postalCode,
	country_code: countryCode,
	phone,
	email,
	distance,
	distance_unit: distanceUnit
}) => {
	return {
		id,
		name,
		hours,
		address: {
			address1,
			address2,
			city,
			state,
			postalCode,
			countryCode
		},
		phone,
		email,
		distance,
		distanceUnit
	};
};
