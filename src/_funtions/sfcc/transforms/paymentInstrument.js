module.exports = ({ amount, payment_instrument_id, payment_method_id }) => {
	return {
		id: payment_instrument_id,
		type: payment_method_id,
		amount
	};
};
