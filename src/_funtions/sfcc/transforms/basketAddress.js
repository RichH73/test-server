module.exports = ({ address1, address2, city, country_code, first_name, last_name, phone, postal_code, state_code }) => {
	return {
		firstName: first_name,
		lastName: last_name,
		address1,
		address2,
		city,
		state: state_code,
		postalCode: postal_code,
		country: country_code,
		phone
	};
};
