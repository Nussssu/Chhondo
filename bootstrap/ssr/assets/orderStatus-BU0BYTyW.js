//#region resources/js/utils/orderStatus.js
var TRACKER_STEPS = [
	{
		key: "placed",
		label: "অর্ডার প্লেসড"
	},
	{
		key: "processing",
		label: "প্রক্রিয়াধীন"
	},
	{
		key: "shipped",
		label: "পাঠানো হয়েছে"
	},
	{
		key: "out_for_delivery",
		label: "ট্রানজিটে আছে"
	},
	{
		key: "delivered",
		label: "ডেলিভারি সম্পন্ন"
	}
];
var STEP_INDEX_BY_STATUS = {
	pending: 0,
	processed: 1,
	shipped: 2,
	"on delivery": 3,
	"pending delivery": 3,
	delivered: 4
};
var EXCEPTION_STATUSES = [
	"returned",
	"cancelled",
	"incomplete"
];
var BADGE_VARIANTS = {
	delivered: {
		bg: "#d4e0c8",
		text: "#2d4a2d"
	},
	shipped: {
		bg: "#dbeafe",
		text: "#1d4ed8"
	},
	"on delivery": {
		bg: "#dbeafe",
		text: "#1d4ed8"
	},
	"pending delivery": {
		bg: "#dbeafe",
		text: "#1d4ed8"
	},
	processed: {
		bg: "#efe5d0",
		text: "#7a5c3e"
	},
	pending: {
		bg: "#efe5d0",
		text: "#7a5c3e"
	},
	cancelled: {
		bg: "#fee2e2",
		text: "#dc2626"
	},
	returned: {
		bg: "#fee2e2",
		text: "#dc2626"
	},
	incomplete: {
		bg: "#e4e1e0",
		text: "#6d6560"
	}
};
var STATUS_LABELS = {
	pending: "অপেক্ষমাণ",
	processed: "প্রক্রিয়াধীন",
	shipped: "পাঠানো হয়েছে",
	"on delivery": "ডেলিভারিতে আছে",
	"pending delivery": "ডেলিভারির অপেক্ষায়",
	delivered: "ডেলিভারি সম্পন্ন",
	cancelled: "বাতিল হয়েছে",
	returned: "ফেরত এসেছে",
	incomplete: "অসম্পূর্ণ"
};
function isExceptionStatus(status) {
	return EXCEPTION_STATUSES.includes((status || "").toLowerCase());
}
function getOrderStepIndex(status) {
	const key = (status || "").toLowerCase();
	return key in STEP_INDEX_BY_STATUS ? STEP_INDEX_BY_STATUS[key] : null;
}
function getOrderStatusBadge(status) {
	return BADGE_VARIANTS[(status || "").toLowerCase()] || {
		bg: "#e4e1e0",
		text: "#6d6560"
	};
}
function getOrderStatusLabel(status) {
	return STATUS_LABELS[(status || "").toLowerCase().replace(/_/g, " ")] || status || "অপেক্ষমাণ";
}
//#endregion
export { isExceptionStatus as a, getOrderStepIndex as i, getOrderStatusBadge as n, getOrderStatusLabel as r, TRACKER_STEPS as t };

//# sourceMappingURL=orderStatus-BU0BYTyW.js.map