module.exports = ({ data: addresses = [] }) => {
	return addresses.map(
		({ address_id: id, address1: street, address2: street2, city, country_code: country, state_code: state, postal_code: zip }, i) => {
			return {
				id,
				key: i,
				isPrimary: false,
				street,
				street2,
				city,
				country,
				state,
				zip,
				attribute_type: 'ADDRESS'
			};
		}
	);
};
