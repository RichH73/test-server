module.exports = ({ data: { customer_id, customer_no, email, first_name, last_name, credentials = {} } }) => {
	return {
		id: customer_id,
		isEnabled: credentials.enabled,
		isLocked: credentials.locked,
		login: credentials.login,
		customerNumber: customer_no,
		email,
		firstName: first_name,
		lastName: last_name
	};
};
