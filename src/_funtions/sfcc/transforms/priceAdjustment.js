module.exports = ({ price_adjustment_id: id, applied_discount: { type, amount } = {}, manual: isAddedByUser }) => {
	return {
		id,
		type,
		amount,
		isAddedByUser
	};
};
