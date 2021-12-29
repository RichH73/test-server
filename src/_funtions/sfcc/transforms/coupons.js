module.exports = (coupons = []) => {
	const transform = require('./coupon');
	return coupons.map((coupon) => transform(coupon));
};
