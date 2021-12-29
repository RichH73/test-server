module.exports = ({ coupon_item_id, code, valid: isValid }) => {
	return {
		code,
		isValid,
		id: coupon_item_id
	};
};
