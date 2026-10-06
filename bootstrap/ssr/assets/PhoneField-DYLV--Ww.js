import { c as server_renderer_exports, l as vue_exports } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region node_modules/.pnpm/intl-tel-input@29.5.3/node_modules/intl-tel-input/dist/js/intlTelInput.mjs
var rawCountryData = [
	[
		"af",
		"93",
		0,
		null,
		"0"
	],
	[
		"ax",
		"358",
		1,
		[
			"18",
			"4",
			"50"
		],
		"0"
	],
	[
		"al",
		"355",
		0,
		null,
		"0"
	],
	[
		"dz",
		"213",
		0,
		null,
		"0"
	],
	[
		"as",
		"1",
		5,
		["684"],
		"1"
	],
	["ad", "376"],
	["ao", "244"],
	[
		"ai",
		"1",
		6,
		["264"],
		"1"
	],
	[
		"ag",
		"1",
		7,
		["268"],
		"1"
	],
	[
		"ar",
		"54",
		0,
		null,
		"0"
	],
	[
		"am",
		"374",
		0,
		null,
		"0"
	],
	["aw", "297"],
	["ac", "247"],
	[
		"au",
		"61",
		0,
		["4"],
		"0"
	],
	[
		"at",
		"43",
		0,
		null,
		"0"
	],
	[
		"az",
		"994",
		0,
		null,
		"0"
	],
	[
		"bs",
		"1",
		8,
		["242"],
		"1"
	],
	["bh", "973"],
	[
		"bd",
		"880",
		0,
		null,
		"0"
	],
	[
		"bb",
		"1",
		9,
		["246"],
		"1"
	],
	[
		"by",
		"375",
		0,
		null,
		"8"
	],
	[
		"be",
		"32",
		0,
		null,
		"0"
	],
	["bz", "501"],
	["bj", "229"],
	[
		"bm",
		"1",
		10,
		["441"],
		"1"
	],
	["bt", "975"],
	[
		"bo",
		"591",
		0,
		null,
		"0"
	],
	[
		"ba",
		"387",
		0,
		null,
		"0"
	],
	["bw", "267"],
	[
		"br",
		"55",
		0,
		null,
		"0"
	],
	["io", "246"],
	[
		"vg",
		"1",
		11,
		["284"],
		"1"
	],
	["bn", "673"],
	[
		"bg",
		"359",
		0,
		null,
		"0"
	],
	["bf", "226"],
	["bi", "257"],
	[
		"kh",
		"855",
		0,
		null,
		"0"
	],
	["cm", "237"],
	[
		"ca",
		"1",
		1,
		[
			"204",
			"226",
			"236",
			"249",
			"250",
			"257",
			"263",
			"289",
			"306",
			"343",
			"354",
			"365",
			"367",
			"368",
			"382",
			"403",
			"416",
			"418",
			"428",
			"431",
			"437",
			"438",
			"450",
			"468",
			"474",
			"506",
			"514",
			"519",
			"548",
			"579",
			"581",
			"584",
			"587",
			"604",
			"613",
			"639",
			"647",
			"672",
			"683",
			"705",
			"709",
			"742",
			"753",
			"778",
			"780",
			"782",
			"807",
			"819",
			"825",
			"867",
			"873",
			"879",
			"902",
			"905",
			"942"
		],
		"1"
	],
	["cv", "238"],
	[
		"bq",
		"599",
		1,
		[
			"3",
			"4",
			"7"
		]
	],
	[
		"ky",
		"1",
		12,
		["345"],
		"1"
	],
	["cf", "236"],
	["td", "235"],
	["cl", "56"],
	[
		"cn",
		"86",
		0,
		null,
		"0"
	],
	[
		"cx",
		"61",
		2,
		["4", "89164"],
		"0"
	],
	[
		"cc",
		"61",
		1,
		["4", "89162"],
		"0"
	],
	[
		"co",
		"57",
		0,
		null,
		"0"
	],
	["km", "269"],
	["cg", "242"],
	[
		"cd",
		"243",
		0,
		null,
		"0"
	],
	["ck", "682"],
	["cr", "506"],
	["ci", "225"],
	[
		"hr",
		"385",
		0,
		null,
		"0"
	],
	[
		"cu",
		"53",
		0,
		null,
		"0"
	],
	[
		"cw",
		"599",
		0
	],
	["cy", "357"],
	["cz", "420"],
	["dk", "45"],
	["dj", "253"],
	[
		"dm",
		"1",
		13,
		["767"],
		"1"
	],
	[
		"do",
		"1",
		2,
		[
			"809",
			"829",
			"849"
		],
		"1"
	],
	[
		"ec",
		"593",
		0,
		null,
		"0"
	],
	[
		"eg",
		"20",
		0,
		null,
		"0"
	],
	["sv", "503"],
	["gq", "240"],
	[
		"er",
		"291",
		0,
		null,
		"0"
	],
	["ee", "372"],
	["sz", "268"],
	[
		"et",
		"251",
		0,
		null,
		"0"
	],
	["fk", "500"],
	["fo", "298"],
	["fj", "679"],
	[
		"fi",
		"358",
		0,
		["4", "50"],
		"0"
	],
	[
		"fr",
		"33",
		0,
		null,
		"0"
	],
	[
		"gf",
		"594",
		0,
		null,
		"0"
	],
	["pf", "689"],
	["ga", "241"],
	["gm", "220"],
	[
		"ge",
		"995",
		0,
		null,
		"0"
	],
	[
		"de",
		"49",
		0,
		null,
		"0"
	],
	[
		"gh",
		"233",
		0,
		null,
		"0"
	],
	["gi", "350"],
	["gr", "30"],
	["gl", "299"],
	[
		"gd",
		"1",
		14,
		["473"],
		"1"
	],
	[
		"gp",
		"590",
		0,
		null,
		"0"
	],
	[
		"gu",
		"1",
		15,
		["671"],
		"1"
	],
	["gt", "502"],
	[
		"gg",
		"44",
		1,
		[
			"1481",
			"7781",
			"7839",
			"79111",
			"79117"
		],
		"0"
	],
	["gn", "224"],
	["gw", "245"],
	["gy", "592"],
	["ht", "509"],
	["hn", "504"],
	["hk", "852"],
	[
		"hu",
		"36",
		0,
		null,
		"06"
	],
	["is", "354"],
	[
		"in",
		"91",
		0,
		null,
		"0"
	],
	[
		"id",
		"62",
		0,
		null,
		"0"
	],
	[
		"ir",
		"98",
		0,
		null,
		"0"
	],
	[
		"iq",
		"964",
		0,
		null,
		"0"
	],
	[
		"ie",
		"353",
		0,
		null,
		"0"
	],
	[
		"im",
		"44",
		2,
		[
			"1624",
			"74576",
			"7524",
			"7624",
			"7924"
		],
		"0"
	],
	[
		"il",
		"972",
		0,
		null,
		"0"
	],
	[
		"it",
		"39",
		0,
		["3"]
	],
	[
		"jm",
		"1",
		4,
		["658", "876"],
		"1"
	],
	[
		"jp",
		"81",
		0,
		null,
		"0"
	],
	[
		"je",
		"44",
		3,
		[
			"1534",
			"7509",
			"77003",
			"77007",
			"77008",
			"7797",
			"7829",
			"7937"
		],
		"0"
	],
	[
		"jo",
		"962",
		0,
		null,
		"0"
	],
	[
		"kz",
		"7",
		1,
		["33", "7"],
		"8"
	],
	[
		"ke",
		"254",
		0,
		null,
		"0"
	],
	[
		"ki",
		"686",
		0,
		null,
		"0"
	],
	[
		"xk",
		"383",
		0,
		null,
		"0"
	],
	["kw", "965"],
	[
		"kg",
		"996",
		0,
		null,
		"0"
	],
	[
		"la",
		"856",
		0,
		null,
		"0"
	],
	["lv", "371"],
	[
		"lb",
		"961",
		0,
		null,
		"0"
	],
	["ls", "266"],
	[
		"lr",
		"231",
		0,
		null,
		"0"
	],
	[
		"ly",
		"218",
		0,
		null,
		"0"
	],
	[
		"li",
		"423",
		0,
		null,
		"0"
	],
	[
		"lt",
		"370",
		0,
		null,
		"0"
	],
	["lu", "352"],
	["mo", "853"],
	[
		"mg",
		"261",
		0,
		null,
		"0"
	],
	[
		"mw",
		"265",
		0,
		null,
		"0"
	],
	[
		"my",
		"60",
		0,
		null,
		"0"
	],
	["mv", "960"],
	["ml", "223"],
	["mt", "356"],
	[
		"mh",
		"692",
		0,
		null,
		"1"
	],
	[
		"mq",
		"596",
		0,
		null,
		"0"
	],
	["mr", "222"],
	["mu", "230"],
	[
		"yt",
		"262",
		1,
		[
			"2689",
			"269",
			"639",
			"7093"
		],
		"0"
	],
	["mx", "52"],
	["fm", "691"],
	[
		"md",
		"373",
		0,
		null,
		"0"
	],
	[
		"mc",
		"377",
		0,
		null,
		"0"
	],
	[
		"mn",
		"976",
		0,
		null,
		"0"
	],
	[
		"me",
		"382",
		0,
		null,
		"0"
	],
	[
		"ms",
		"1",
		16,
		["664"],
		"1"
	],
	[
		"ma",
		"212",
		0,
		["6", "7"],
		"0"
	],
	["mz", "258"],
	[
		"mm",
		"95",
		0,
		null,
		"0"
	],
	[
		"na",
		"264",
		0,
		null,
		"0"
	],
	["nr", "674"],
	[
		"np",
		"977",
		0,
		null,
		"0"
	],
	[
		"nl",
		"31",
		0,
		null,
		"0"
	],
	["nc", "687"],
	[
		"nz",
		"64",
		0,
		null,
		"0"
	],
	["ni", "505"],
	["ne", "227"],
	[
		"ng",
		"234",
		0,
		null,
		"0"
	],
	["nu", "683"],
	["nf", "672"],
	[
		"kp",
		"850",
		0,
		null,
		"0"
	],
	[
		"mk",
		"389",
		0,
		null,
		"0"
	],
	[
		"mp",
		"1",
		17,
		["670"],
		"1"
	],
	[
		"no",
		"47",
		0,
		["4", "9"]
	],
	["om", "968"],
	[
		"pk",
		"92",
		0,
		null,
		"0"
	],
	["pw", "680"],
	[
		"ps",
		"970",
		0,
		null,
		"0"
	],
	["pa", "507"],
	["pg", "675"],
	[
		"py",
		"595",
		0,
		null,
		"0"
	],
	[
		"pe",
		"51",
		0,
		null,
		"0"
	],
	[
		"ph",
		"63",
		0,
		null,
		"0"
	],
	["pl", "48"],
	["pt", "351"],
	[
		"pr",
		"1",
		3,
		["787", "939"],
		"1"
	],
	["qa", "974"],
	[
		"re",
		"262",
		0,
		null,
		"0"
	],
	[
		"ro",
		"40",
		0,
		null,
		"0"
	],
	[
		"ru",
		"7",
		0,
		["33"],
		"8"
	],
	[
		"rw",
		"250",
		0,
		null,
		"0"
	],
	["ws", "685"],
	["sm", "378"],
	["st", "239"],
	[
		"sa",
		"966",
		0,
		null,
		"0"
	],
	["sn", "221"],
	[
		"rs",
		"381",
		0,
		null,
		"0"
	],
	["sc", "248"],
	[
		"sl",
		"232",
		0,
		null,
		"0"
	],
	["sg", "65"],
	[
		"sx",
		"1",
		21,
		["721"],
		"1"
	],
	[
		"sk",
		"421",
		0,
		null,
		"0"
	],
	[
		"si",
		"386",
		0,
		null,
		"0"
	],
	["sb", "677"],
	[
		"so",
		"252",
		0,
		null,
		"0"
	],
	[
		"za",
		"27",
		0,
		null,
		"0"
	],
	[
		"kr",
		"82",
		0,
		null,
		"0"
	],
	[
		"ss",
		"211",
		0,
		null,
		"0"
	],
	["es", "34"],
	[
		"lk",
		"94",
		0,
		null,
		"0"
	],
	[
		"bl",
		"590",
		1,
		null,
		"0"
	],
	["sh", "290"],
	[
		"kn",
		"1",
		18,
		["869"],
		"1"
	],
	[
		"lc",
		"1",
		19,
		["758"],
		"1"
	],
	[
		"mf",
		"590",
		2,
		null,
		"0"
	],
	[
		"pm",
		"508",
		0,
		null,
		"0"
	],
	[
		"vc",
		"1",
		20,
		["784"],
		"1"
	],
	[
		"sd",
		"249",
		0,
		null,
		"0"
	],
	["sr", "597"],
	[
		"sj",
		"47",
		1,
		[
			"4",
			"79",
			"9"
		]
	],
	[
		"se",
		"46",
		0,
		null,
		"0"
	],
	[
		"ch",
		"41",
		0,
		null,
		"0"
	],
	[
		"sy",
		"963",
		0,
		null,
		"0"
	],
	[
		"tw",
		"886",
		0,
		null,
		"0"
	],
	["tj", "992"],
	[
		"tz",
		"255",
		0,
		null,
		"0"
	],
	[
		"th",
		"66",
		0,
		null,
		"0"
	],
	["tl", "670"],
	["tg", "228"],
	["tk", "690"],
	["to", "676"],
	[
		"tt",
		"1",
		22,
		["868"],
		"1"
	],
	["tn", "216"],
	[
		"tr",
		"90",
		0,
		null,
		"0"
	],
	[
		"tm",
		"993",
		0,
		null,
		"8"
	],
	[
		"tc",
		"1",
		23,
		["649"],
		"1"
	],
	["tv", "688"],
	[
		"vi",
		"1",
		24,
		["340"],
		"1"
	],
	[
		"ug",
		"256",
		0,
		null,
		"0"
	],
	[
		"ua",
		"380",
		0,
		null,
		"0"
	],
	[
		"ae",
		"971",
		0,
		null,
		"0"
	],
	[
		"gb",
		"44",
		0,
		null,
		"0"
	],
	[
		"us",
		"1",
		0,
		null,
		"1"
	],
	[
		"uy",
		"598",
		0,
		null,
		"0"
	],
	["uz", "998"],
	["vu", "678"],
	[
		"va",
		"39",
		1,
		["06698", "3"]
	],
	[
		"ve",
		"58",
		0,
		null,
		"0"
	],
	[
		"vn",
		"84",
		0,
		null,
		"0"
	],
	["wf", "681"],
	[
		"eh",
		"212",
		1,
		[
			"5288",
			"5289",
			"6",
			"7"
		],
		"0"
	],
	[
		"ye",
		"967",
		0,
		null,
		"0"
	],
	[
		"zm",
		"260",
		0,
		null,
		"0"
	],
	[
		"zw",
		"263",
		0,
		null,
		"0"
	]
];
var allCountries = [];
for (const c of rawCountryData) allCountries.push({
	name: "",
	iso2: c[0],
	dialCode: c[1],
	priority: c[2] || 0,
	areaCodes: c[3] || null,
	nationalPrefix: c[4] || null
});
var iso2Set = new Set(allCountries.map((c) => c.iso2));
var isIso2 = (val) => iso2Set.has(val);
var data_default = allCountries;
var EVENTS = {
	OPEN_COUNTRY_SELECTOR: "open:countryselector",
	CLOSE_COUNTRY_SELECTOR: "close:countryselector",
	COUNTRY_CHANGE: "countrychange",
	INPUT: "input",
	STRICT_REJECT: "strict:reject"
};
var ITI_SLOTS = [
	"container",
	"input",
	"countryContainer",
	"selectedCountry",
	"selectedCountryPrimary",
	"selectedFlag",
	"arrow",
	"selectedDialCode",
	"countrySelector",
	"countrySelectorContainer",
	"closeButton",
	"searchWrapper",
	"searchIcon",
	"searchInput",
	"searchClear",
	"countryList",
	"countryListItem",
	"countryListItemFlag",
	"countryName",
	"dialCode",
	"countryCheck",
	"noResults"
];
var CLASSES = {
	HIDE: "iti__hide",
	V_HIDE: "iti__v-hide",
	ARROW_UP: "iti__arrow--up",
	GLOBE: "iti__globe",
	FLAG: "iti__flag",
	LOADING: "iti__loading",
	COUNTRY_ITEM: "iti__country",
	HIGHLIGHT: "iti__highlight",
	STRICT_REJECT_ANIMATION: "iti__strict-reject-animation"
};
var KEYS = {
	ARROW_UP: "ArrowUp",
	ARROW_DOWN: "ArrowDown",
	SPACE: " ",
	ENTER: "Enter",
	ESC: "Escape",
	TAB: "Tab"
};
var INPUT_TYPES = {
	PASTE: "insertFromPaste",
	DELETE_FORWARD: "deleteContentForward"
};
var REGEX = {
	ALPHA_UNICODE: /\p{L}/u,
	NON_PLUS_NUMERIC: /[^+0-9]/,
	NON_PLUS_NUMERIC_GLOBAL: /[^+0-9]/g,
	HIDDEN_SEARCH_CHAR: /^[a-zA-ZÀ-ÿа-яА-Я ]$/
};
var TIMINGS = {
	SEARCH_DEBOUNCE_MS: 100,
	HIDDEN_SEARCH_RESET_MS: 1e3,
	NEXT_TICK: 0
};
var LAYOUT = {
	NARROW_VIEWPORT_WIDTH: 500,
	FALLBACK_SELECTED_COUNTRY_WITH_DIAL_WIDTH: 78,
	FALLBACK_SELECTED_COUNTRY_NO_DIAL_WIDTH: 42,
	INPUT_PADDING_EXTRA_LEFT: 6,
	DROPDOWN_MARGIN: 3,
	FALLBACK_DROPDOWN_HEIGHT: 200
};
var DIAL_CODE = {
	PLUS: "+",
	NANP: "1"
};
var E164_MAX_DIGITS = 15;
var UK = {
	ISO2: "gb",
	DIAL_CODE: "44",
	MOBILE_PREFIX: "7",
	MOBILE_CORE_LENGTH: 10
};
var US = {
	ISO2: "us",
	DIAL_CODE: "1"
};
var PLACEHOLDER_POLICY = {
	AGGRESSIVE: "AGGRESSIVE",
	POLITE: "POLITE",
	OFF: "OFF"
};
var COUNTRY_SELECTOR_MODES = [
	"OFF",
	"DROPDOWN",
	"FULLSCREEN",
	"AUTO"
];
var NUMBER_FORMATS = [
	"E164",
	"INTERNATIONAL",
	"NATIONAL",
	"RFC3966"
];
var NUMBER_TYPES = [
	"FIXED_LINE",
	"MOBILE",
	"FIXED_LINE_OR_MOBILE",
	"TOLL_FREE",
	"PREMIUM_RATE",
	"SHARED_COST",
	"VOIP",
	"PERSONAL_NUMBER",
	"PAGER",
	"UAN",
	"VOICEMAIL",
	"UNKNOWN"
];
var VALIDATION_ERRORS = [
	"IS_POSSIBLE",
	"INVALID_COUNTRY_CODE",
	"TOO_SHORT",
	"TOO_LONG",
	"IS_POSSIBLE_LOCAL_ONLY",
	"INVALID_LENGTH"
];
var toEnumObject = (arr) => Object.fromEntries(arr.map((v) => [v, v]));
var NUMBER_FORMAT = toEnumObject(NUMBER_FORMATS);
var NUMBER_TYPE = toEnumObject(NUMBER_TYPES);
var VALIDATION_ERROR = toEnumObject(VALIDATION_ERRORS);
var COUNTRY_SELECTOR_MODE = toEnumObject(COUNTRY_SELECTOR_MODES);
var DATA_KEYS = {
	ISO2: "iso2",
	DIAL_CODE: "dialCode",
	INSTANCE_ID: "intlTelInputId"
};
var ARIA = {
	EXPANDED: "aria-expanded",
	LABEL: "aria-label",
	SELECTED: "aria-selected",
	ACTIVE_DESCENDANT: "aria-activedescendant",
	HASPOPUP: "aria-haspopup",
	CONTROLS: "aria-controls",
	HIDDEN: "aria-hidden",
	AUTOCOMPLETE: "aria-autocomplete",
	MODAL: "aria-modal"
};
var en_default = {
	selectedCountryAriaLabel: "Change country for phone number, currently selected ${countryName} (${dialCode})",
	noCountrySelected: "Select country for phone number",
	countryListAriaLabel: "List of countries",
	searchPlaceholder: "Search",
	clearSearchAriaLabel: "Clear search",
	closeCountrySelectorAriaLabel: "Close",
	searchEmptyState: "No results found",
	searchSummaryAria(count) {
		if (count === 0) return "No results found";
		if (count === 1) return "1 result found";
		return `${count} results found`;
	}
};
var mediaQuery = (q) => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(q).matches;
var isNarrowViewport = () => mediaQuery(`(max-width: ${LAYOUT.NARROW_VIEWPORT_WIDTH}px)`);
var resolveAutoCountrySelectorMode = () => {
	if (typeof navigator !== "undefined" && typeof window !== "undefined") {
		const isShortViewport = mediaQuery("(max-height: 600px)");
		const isCoarsePointer = mediaQuery("(pointer: coarse)");
		if (isNarrowViewport() || isCoarsePointer && isShortViewport) return COUNTRY_SELECTOR_MODE.FULLSCREEN;
	}
	return COUNTRY_SELECTOR_MODE.DROPDOWN;
};
var defaults = {
	countrySelectorMode: COUNTRY_SELECTOR_MODE.AUTO,
	allowedNumberTypes: [NUMBER_TYPE.MOBILE, NUMBER_TYPE.FIXED_LINE],
	allowNumberExtensions: false,
	allowPhonewords: false,
	classNames: {},
	containerClass: "",
	countryNameLocale: "en",
	countryNameOverrides: {},
	countryOrder: null,
	countrySearch: true,
	customPlaceholder: null,
	dropdownAlwaysOpen: false,
	dropdownParent: null,
	excludeCountries: null,
	matchDropdownWidth: true,
	formatAsYouType: true,
	fullscreenParent: null,
	hiddenInputs: null,
	uiTranslations: {},
	initialCountry: "",
	initialCountryLookup: null,
	loadUtils: null,
	numberDisplayFormat: NUMBER_FORMAT.INTERNATIONAL,
	onlyCountries: null,
	placeholderNumberPolicy: PLACEHOLDER_POLICY.POLITE,
	placeholderNumberType: NUMBER_TYPE.MOBILE,
	searchInputClass: "",
	separateDialCode: true,
	strictRejectAnimation: true,
	showFlags: true,
	strictMode: true
};
var toString = (val) => JSON.stringify(val);
var isPlainObject = (val) => Boolean(val) && typeof val === "object" && !Array.isArray(val);
var isFunction = (val) => typeof val === "function";
var isElLike = (val) => {
	if (!val || typeof val !== "object") return false;
	const v = val;
	return v.nodeType === 1 && typeof v.tagName === "string" && typeof v.appendChild === "function";
};
var placeholderPolicySet = new Set(Object.values(PLACEHOLDER_POLICY));
var slotSet = new Set(ITI_SLOTS);
var warn = (message) => {
	console.warn(`[intl-tel-input] ${message}`);
};
var warnOption = (optionName, expectedType, actualValue) => {
	warn(`Option '${optionName}' must be ${expectedType}; got ${toString(actualValue)}. Ignoring.`);
};
var validateIso2Array = (key, value) => {
	const expectedType = "an array of iso2 country code strings";
	if (!Array.isArray(value)) {
		warnOption(key, expectedType, value);
		return false;
	}
	const valid = [];
	for (const v of value) {
		if (typeof v !== "string") {
			warnOption(key, expectedType, value);
			return false;
		}
		if (!isIso2(v.toLowerCase())) warn(`Invalid iso2 code in '${key}': '${v}'. Skipping.`);
		else valid.push(v);
	}
	return valid;
};
var validateOptions = (customOptions) => {
	if (customOptions === void 0) return {};
	if (!isPlainObject(customOptions)) {
		warn(`The second argument must be an options object; got ${toString(customOptions)}. Using defaults.`);
		return {};
	}
	const validatedOptions = {};
	for (const [key, value] of Object.entries(customOptions)) {
		if (!Object.hasOwn(defaults, key)) {
			warn(`Unknown option '${key}'. Ignoring.`);
			continue;
		}
		switch (key) {
			case "allowNumberExtensions":
			case "allowPhonewords":
			case "countrySearch":
			case "dropdownAlwaysOpen":
			case "matchDropdownWidth":
			case "formatAsYouType":
			case "showFlags":
			case "separateDialCode":
			case "strictMode":
			case "strictRejectAnimation":
				if (typeof value !== "boolean") {
					warnOption(key, "a boolean", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "countrySelectorMode":
				if (typeof value !== "string" || !COUNTRY_SELECTOR_MODES.includes(value)) {
					warnOption("countrySelectorMode", `one of ${COUNTRY_SELECTOR_MODES.map((m) => `"${m}"`).join(", ")}`, value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "numberDisplayFormat":
				if (typeof value !== "string" || value === NUMBER_FORMAT.RFC3966 || !(value === NUMBER_FORMAT.E164 || value === NUMBER_FORMAT.INTERNATIONAL || value === NUMBER_FORMAT.NATIONAL)) {
					warnOption("numberDisplayFormat", "one of \"E164\", \"INTERNATIONAL\", \"NATIONAL\"", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "placeholderNumberPolicy":
				if (typeof value !== "string" || !placeholderPolicySet.has(value)) {
					warnOption("placeholderNumberPolicy", `one of ${Array.from(placeholderPolicySet).join(", ")}`, value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "containerClass":
			case "searchInputClass":
			case "countryNameLocale":
				if (typeof value !== "string") {
					warnOption(key, "a string", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "classNames": {
				if (!isPlainObject(value)) {
					warnOption("classNames", "an object", value);
					break;
				}
				const validSlots = {};
				for (const [slot, slotValue] of Object.entries(value)) if (!slotSet.has(slot)) warn(`Unknown slot '${slot}' in 'classNames'. Valid slots: ${ITI_SLOTS.join(", ")}. Skipping.`);
				else if (typeof slotValue !== "string") warnOption(`classNames.${slot}`, "a string", slotValue);
				else validSlots[slot] = slotValue.trim().replace(/\s+/g, " ");
				validatedOptions[key] = validSlots;
				break;
			}
			case "countryOrder":
				if (value === null) validatedOptions[key] = value;
				else {
					const filtered = validateIso2Array(key, value);
					if (filtered !== false) validatedOptions[key] = filtered;
				}
				break;
			case "customPlaceholder":
			case "hiddenInputs":
			case "initialCountryLookup":
			case "loadUtils":
				if (value !== null && !isFunction(value)) {
					warnOption(key, "a function or null", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "dropdownParent":
			case "fullscreenParent":
				if (value !== null && !isElLike(value)) {
					warnOption(key, "an HTMLElement or null", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "excludeCountries":
			case "onlyCountries":
				if (value === null) validatedOptions[key] = value;
				else {
					const filtered = validateIso2Array(key, value);
					if (filtered !== false) validatedOptions[key] = filtered;
				}
				break;
			case "uiTranslations":
				if (value && !isPlainObject(value)) {
					warnOption("uiTranslations", "an object", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "countryNameOverrides":
				if (value && !isPlainObject(value)) {
					warnOption("countryNameOverrides", "an object", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "initialCountry": {
				if (typeof value !== "string") {
					warnOption("initialCountry", "a string", value);
					break;
				}
				const lower = value.toLowerCase();
				if (lower && !isIso2(lower)) {
					warnOption("initialCountry", "a valid iso2 country code", value);
					break;
				}
				validatedOptions[key] = value;
				break;
			}
			case "placeholderNumberType":
				if (typeof value !== "string" || !NUMBER_TYPES.includes(value)) {
					warnOption("placeholderNumberType", `one of ${NUMBER_TYPES.join(", ")}`, value);
					break;
				}
				validatedOptions[key] = value;
				break;
			case "allowedNumberTypes":
				if (value !== null) {
					if (!Array.isArray(value)) {
						warnOption("allowedNumberTypes", "an array of number types or null", value);
						break;
					}
					let allValid = true;
					for (const v of value) if (typeof v !== "string" || !NUMBER_TYPES.includes(v)) {
						warnOption("allowedNumberTypes", `an array of valid number types (${NUMBER_TYPES.join(", ")})`, v);
						allValid = false;
						break;
					}
					if (allValid) validatedOptions[key] = value;
				} else validatedOptions[key] = null;
				break;
		}
	}
	return validatedOptions;
};
var normaliseOptions = (o) => {
	if (o.initialCountry) o.initialCountry = o.initialCountry.toLowerCase();
	if (o.onlyCountries?.length) o.onlyCountries = o.onlyCountries.map((c) => c.toLowerCase());
	if (o.excludeCountries?.length) o.excludeCountries = o.excludeCountries.map((c) => c.toLowerCase());
	if (o.countryOrder) o.countryOrder = o.countryOrder.map((c) => c.toLowerCase());
};
var applyOptionSideEffects = (o) => {
	if (o.countrySelectorMode === COUNTRY_SELECTOR_MODE.AUTO) o.countrySelectorMode = resolveAutoCountrySelectorMode();
	if (o.dropdownAlwaysOpen) o.countrySelectorMode = COUNTRY_SELECTOR_MODE.DROPDOWN;
	if (o.countrySelectorMode === COUNTRY_SELECTOR_MODE.FULLSCREEN) o.matchDropdownWidth = false;
	else if (isNarrowViewport()) o.matchDropdownWidth = true;
	if (o.onlyCountries?.length === 1) o.initialCountry = o.onlyCountries[0];
	if (o.separateDialCode && o.numberDisplayFormat === NUMBER_FORMAT.NATIONAL) o.numberDisplayFormat = NUMBER_FORMAT.INTERNATIONAL;
	if (o.countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF && !o.showFlags && !o.separateDialCode && o.numberDisplayFormat === NUMBER_FORMAT.NATIONAL) o.numberDisplayFormat = NUMBER_FORMAT.INTERNATIONAL;
	o.uiTranslations = {
		...en_default,
		...o.uiTranslations
	};
};
var getNumeric = (s) => s.replace(/\D/g, "");
var normaliseString = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
var buildClassNames = (flags) => Object.keys(flags).filter((k) => Boolean(flags[k])).join(" ");
var createEl = (tagName, attrs, container) => {
	const el = document.createElement(tagName);
	if (attrs) Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
	if (container) container.appendChild(el);
	return el;
};
var SVG_NS = "http://www.w3.org/2000/svg";
var buildSvg = ([tag, attrs, children]) => {
	const el = document.createElementNS(SVG_NS, tag);
	if (attrs) for (const k in attrs) el.setAttribute(k, String(attrs[k]));
	if (children) for (const c of children) el.appendChild(buildSvg(c));
	return el;
};
var buildSearchIcon = () => buildSvg([
	"svg",
	{
		class: "iti__search-icon-svg",
		width: 14,
		height: 14,
		viewBox: "0 0 24 24",
		focusable: "false",
		[ARIA.HIDDEN]: "true"
	},
	[["circle", {
		cx: 11,
		cy: 11,
		r: 7
	}], ["line", {
		x1: 21,
		y1: 21,
		x2: 16.65,
		y2: 16.65
	}]]
]);
var buildClearIcon = (id) => {
	const maskId = `iti-${id}-clear-mask`;
	return buildSvg([
		"svg",
		{
			class: "iti__search-clear-svg",
			width: 12,
			height: 12,
			viewBox: "0 0 16 16",
			[ARIA.HIDDEN]: "true",
			focusable: "false"
		},
		[[
			"mask",
			{
				id: maskId,
				maskUnits: "userSpaceOnUse"
			},
			[["rect", {
				width: 16,
				height: 16,
				fill: "white"
			}], ["path", {
				d: "M5.2 5.2 L10.8 10.8 M10.8 5.2 L5.2 10.8",
				stroke: "black",
				"stroke-linecap": "round",
				class: "iti__search-clear-x"
			}]]
		], ["circle", {
			cx: 8,
			cy: 8,
			r: 8,
			class: "iti__search-clear-bg",
			mask: `url(#${maskId})`
		}]]
	]);
};
var buildCloseIcon = () => buildSvg([
	"svg",
	{
		class: "iti__close-button-svg",
		width: 20,
		height: 20,
		viewBox: "0 0 16 16",
		focusable: "false",
		[ARIA.HIDDEN]: "true"
	},
	[["path", { d: "M3 3 L13 13 M13 3 L3 13" }]]
]);
var buildCheckIcon = () => buildSvg([
	"svg",
	{
		class: "iti__country-check-svg",
		width: 14,
		height: 14,
		viewBox: "0 0 16 16",
		fill: "currentColor",
		focusable: "false",
		[ARIA.HIDDEN]: "true"
	},
	[["path", { d: "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" }]]
]);
var buildGlobeIcon = () => buildSvg([
	"svg",
	{
		width: 256,
		height: 256,
		viewBox: "0 0 512 512",
		class: "iti__globe-svg"
	},
	[["path", { d: "M508 213a240 240 0 0 0-449-87l-2 5-2 5c-8 14-13 30-17 46a65 65 0 0 1 56 4c16-10 35-19 56-27l9-3c-6 23-10 48-10 74h-16l4 6c3 4 5 8 6 13h6c0 22 3 44 8 65l2 10-25-10-4 5 12 18 9 3 6 2 8 3 9 26 1 2 16-7h1l-5-13-1-2c24 6 49 9 75 10v26l11 10 7 7v-30l1-13c22 0 44-3 65-8l10-2-21 48-1 1a317 317 0 0 1-14 23l-21 5h-2c6 16 7 33 1 50a240 240 0 0 0 211-265m-401-56-11 6c19-44 54-79 98-98-11 20-21 44-29 69-21 6-40 15-58 23m154 182v4c-29-1-57-6-81-13-7-25-12-52-13-81h94zm0-109h-94c1-29 6-56 13-81 24-7 52-12 81-13zm0-112c-22 1-44 4-65 8l-10 2 12-30 9-17 1-2a332 332 0 0 1 13-23c13-4 26-6 40-7zm187 69 6 4c4 12 6 25 6 38v1h-68c-1-26-4-51-10-74l48 20 1 1 14 8zm-14-44 10 20c-20-11-43-21-68-29-8-25-18-49-29-69 37 16 67 44 87 78M279 49h1c13 1 27 3 39 7l14 23 1 2a343 343 0 0 1 12 26l2 5 6 16c-23-6-48-9-74-10h-1zm0 87h1c29 1 56 6 81 13 7 24 12 51 12 80v1h-94zm2 207h-2v-94h95c-1 29-6 56-13 81-24 7-51 12-80 13m86 60-20 10c11-20 21-43 29-68 25-8 48-18 68-29-16 37-43 67-77 87m87-115-7 5-16 9-2 1a337 337 0 0 1-47 21c6-24 9-49 10-75h68c0 13-2 27-6 39" }], ["path", { d: "m261 428-2-2-22-21a40 40 0 0 0-32-11h-1a37 37 0 0 0-18 8l-1 1-4 2-2 2-5 4c-9-3-36-31-47-44s-32-45-34-55l3-2a151 151 0 0 0 11-9v-1a39 39 0 0 0 5-48l-3-3-11-19-3-4-5-7h-1l-3-3-4-3-5-2a35 35 0 0 0-16-3h-5c-4 1-14 5-24 11l-4 2-4 3-4 2c-9 8-17 17-18 27a380 380 0 0 0 212 259h3c12 0 25-10 36-21l10-12 6-11a39 39 0 0 0-8-40" }]]
]);
var normaliseName = (s) => normaliseString(s).replace(/[^\p{L}]+/gu, " ").trim();
var buildSearchTokens = (countries) => {
	const tokens = /* @__PURE__ */ new Map();
	for (const c of countries) {
		const normalisedName = normaliseName(c.name);
		const words = normalisedName.split(" ").filter(Boolean);
		const initials = words.map((w) => w[0] || "").join("");
		tokens.set(c.iso2, {
			normalisedName,
			words,
			initials,
			dialCodePlus: `+${c.dialCode}`
		});
	}
	return tokens;
};
var getMatchedCountries = (countries, searchTokens, query) => {
	const lowerQuery = normaliseString(query);
	const nameQuery = normaliseName(query);
	const skipNameBuckets = lowerQuery !== "" && nameQuery === "";
	const iso2Matches = [];
	const nameStartsWith = [];
	const nameContains = [];
	const dialCodeMatches = [];
	const dialCodeContains = [];
	const initialsMatches = [];
	const wordMatches = [];
	for (const c of countries) {
		const t = searchTokens.get(c.iso2);
		if (c.iso2 === lowerQuery) iso2Matches.push(c);
		else if (!skipNameBuckets && t.normalisedName.startsWith(nameQuery)) nameStartsWith.push(c);
		else if (!skipNameBuckets && t.normalisedName.includes(nameQuery)) nameContains.push(c);
		else if (lowerQuery === c.dialCode || lowerQuery === t.dialCodePlus) dialCodeMatches.push(c);
		else if (t.dialCodePlus.includes(lowerQuery)) dialCodeContains.push(c);
		else if (t.initials.includes(lowerQuery)) initialsMatches.push(c);
	}
	const queryWords = nameQuery.split(" ").filter(Boolean);
	if (queryWords.length > 1 && iso2Matches.length === 0 && nameStartsWith.length === 0 && nameContains.length === 0) {
		const claimed = /* @__PURE__ */ new Set([
			...dialCodeMatches.map((c) => c.iso2),
			...dialCodeContains.map((c) => c.iso2),
			...initialsMatches.map((c) => c.iso2)
		]);
		for (const c of countries) {
			if (claimed.has(c.iso2)) continue;
			const t = searchTokens.get(c.iso2);
			if (queryWords.some((qw) => t.words.some((sw) => sw.startsWith(qw)))) wordMatches.push(c);
		}
	}
	const sortByPriority = (a, b) => a.priority - b.priority;
	return [
		...iso2Matches,
		...nameStartsWith,
		...nameContains,
		...dialCodeMatches.sort(sortByPriority),
		...dialCodeContains.sort(sortByPriority),
		...initialsMatches,
		...wordMatches
	];
};
var findFirstCountryStartingWith = (countries, searchTokens, query) => {
	const nameQuery = normaliseName(query);
	for (const c of countries) {
		const { normalisedName } = searchTokens.get(c.iso2);
		if (normalisedName.startsWith(nameQuery)) return c;
	}
	return null;
};
var Numerals = class _Numerals {
	#userNumeralSet;
	static toAscii(str) {
		if (!str) return "";
		return str.replace(/[٠-٩]/g, (ch) => String.fromCharCode(48 + (ch.charCodeAt(0) - 1632))).replace(/[۰-۹]/g, (ch) => String.fromCharCode(48 + (ch.charCodeAt(0) - 1776)));
	}
	constructor(initialValue) {
		if (initialValue) this.#updateNumeralSet(initialValue);
	}
	#updateNumeralSet(str) {
		if (/[٠-٩]/.test(str)) this.#userNumeralSet = "arabic-indic";
		else if (/[۰-۹]/.test(str)) this.#userNumeralSet = "persian";
		else this.#userNumeralSet = "ascii";
	}
	denormalise(str) {
		if (!this.#userNumeralSet || this.#userNumeralSet === "ascii") return str;
		const base = this.#userNumeralSet === "arabic-indic" ? 1632 : 1776;
		return str.replace(/[0-9]/g, (d) => String.fromCharCode(base + Number(d)));
	}
	normalise(str) {
		if (!str) return "";
		this.#updateNumeralSet(str);
		if (this.#userNumeralSet === "ascii") return str;
		return _Numerals.toAscii(str);
	}
	isAscii() {
		return !this.#userNumeralSet || this.#userNumeralSet === "ascii";
	}
};
var supportsCssAnchor = typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("anchor-name: --x");
var UI = class {
	#options;
	#id;
	#isRTL;
	#originalPaddingLeft = "";
	#countries;
	#searchTokens;
	#searchDebounceTimer = null;
	#inlineDropdownHeight;
	#cssAnchorPositioningDone = false;
	#countryContainerEl;
	#selectedCountryEl;
	#selectedFlagEl;
	#selectedDialCodeEl;
	#arrowEl;
	#countrySelectorEl;
	#closeButtonEl;
	#searchIconEl;
	#searchInputEl;
	#searchClearButtonEl;
	#countryListEl;
	#hiddenInputPhoneEl;
	#hiddenInputCountryEl;
	#noResultsMessageEl;
	#searchResultsLiveRegionEl;
	#detachedCountrySelectorEl;
	#selectedListItemEl = null;
	#highlightedListItemEl = null;
	#listItemByIso2 = /* @__PURE__ */ new Map();
	#countrySelectorAbortController = null;
	#resizeObserver;
	telInputEl;
	hadInitialPlaceholder;
	constructor(input, options, id) {
		input.dataset[DATA_KEYS.INSTANCE_ID] = id.toString();
		this.telInputEl = input;
		this.#options = options;
		this.#id = id;
		this.hadInitialPlaceholder = Boolean(input.getAttribute("placeholder"));
		this.#isRTL = !!this.telInputEl.closest("[dir=rtl]");
		this.#originalPaddingLeft = this.telInputEl.style.paddingLeft;
	}
	static validateInput(input) {
		const tagName = input?.tagName;
		if (!(Boolean(input) && typeof input === "object" && tagName === "INPUT" && typeof input.setAttribute === "function")) {
			const type = Object.prototype.toString.call(input);
			throw new TypeError(`The first argument must be an HTMLInputElement, not ${type}`);
		}
	}
	#withSlotClass(slot, ourClasses) {
		const custom = this.#options.classNames[slot];
		return custom ? `${ourClasses} ${custom}` : ourClasses;
	}
	buildMarkup(countries, searchTokens) {
		this.#countries = countries;
		this.#searchTokens = searchTokens;
		this.telInputEl.classList.add(...this.#withSlotClass("input", "iti__tel-input").split(" "));
		if (!this.telInputEl.hasAttribute("type")) this.telInputEl.setAttribute("type", "tel");
		if (!this.telInputEl.hasAttribute("autocomplete")) this.telInputEl.setAttribute("autocomplete", "tel");
		if (!this.telInputEl.hasAttribute("inputmode")) this.telInputEl.setAttribute("inputmode", "tel");
		const wrapper = this.#createWrapperAndInsert();
		this.#buildCountryContainer(wrapper);
		wrapper.appendChild(this.telInputEl);
		this.#updateInputPaddingAndReveal();
		this.#observeSelectedCountryResize();
		this.#buildHiddenInputs(wrapper);
		this.ensureDropdownWidthSet();
	}
	#createWrapperAndInsert() {
		const { countrySelectorMode, showFlags, containerClass } = this.#options;
		const parentClasses = buildClassNames({
			iti: true,
			"iti--input-container": true,
			"iti--has-country-selector": countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF,
			"iti--show-flags": showFlags,
			"iti--inline-country-selector": countrySelectorMode !== COUNTRY_SELECTOR_MODE.FULLSCREEN,
			[containerClass]: Boolean(containerClass)
		});
		const wrapper = createEl("div", { class: this.#withSlotClass("container", parentClasses) });
		if (this.#isRTL) wrapper.setAttribute("dir", "ltr");
		this.telInputEl.before(wrapper);
		return wrapper;
	}
	#buildCountryContainer(wrapper) {
		const { countrySelectorMode, separateDialCode, showFlags } = this.#options;
		const enableCountrySelector = countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF;
		if (!enableCountrySelector && !showFlags && !separateDialCode) return;
		this.#countryContainerEl = createEl("div", { class: this.#withSlotClass("countryContainer", `iti__country-container ${CLASSES.V_HIDE}`) }, wrapper);
		if (enableCountrySelector) {
			this.#selectedCountryEl = createEl("button", {
				type: "button",
				class: this.#withSlotClass("selectedCountry", "iti__selected-country"),
				[ARIA.EXPANDED]: "false",
				[ARIA.LABEL]: this.#options.uiTranslations.noCountrySelected,
				[ARIA.HASPOPUP]: "dialog",
				[ARIA.CONTROLS]: `iti-${this.#id}__country-selector`
			}, this.#countryContainerEl);
			if (this.telInputEl.disabled) this.#selectedCountryEl.setAttribute("disabled", "true");
		} else this.#selectedCountryEl = createEl("div", { class: this.#withSlotClass("selectedCountry", "iti__selected-country") }, this.#countryContainerEl);
		const selectedCountryPrimary = createEl("div", { class: this.#withSlotClass("selectedCountryPrimary", "iti__selected-country-primary") }, this.#selectedCountryEl);
		this.#selectedFlagEl = createEl("div", { class: this.#withSlotClass("selectedFlag", CLASSES.FLAG) }, selectedCountryPrimary);
		if (enableCountrySelector) this.#arrowEl = createEl("div", {
			class: this.#withSlotClass("arrow", "iti__arrow"),
			[ARIA.HIDDEN]: "true"
		}, selectedCountryPrimary);
		if (separateDialCode) this.#selectedDialCodeEl = createEl("div", { class: this.#withSlotClass("selectedDialCode", "iti__selected-dial-code") }, this.#selectedCountryEl);
		if (enableCountrySelector) this.#buildCountrySelector();
	}
	ensureDropdownWidthSet() {
		const { matchDropdownWidth, countrySelectorMode } = this.#options;
		if (countrySelectorMode === COUNTRY_SELECTOR_MODE.OFF || !matchDropdownWidth || this.#countrySelectorEl.style.width) return;
		const inputWidth = this.telInputEl.offsetWidth;
		if (inputWidth > 0) this.#countrySelectorEl.style.width = `${inputWidth}px`;
	}
	#buildCountrySelector() {
		const { matchDropdownWidth, countrySelectorMode, countrySearch, uiTranslations, containerClass } = this.#options;
		const isFullscreen = countrySelectorMode === COUNTRY_SELECTOR_MODE.FULLSCREEN;
		const detachedParent = this.#getDetachedParent();
		const extraClasses = matchDropdownWidth ? "" : "iti--flexible-dropdown-width";
		this.#countrySelectorEl = createEl("div", {
			id: `iti-${this.#id}__country-selector`,
			class: this.#withSlotClass("countrySelector", `iti__country-selector ${CLASSES.HIDE} ${extraClasses}`),
			role: "dialog",
			[ARIA.MODAL]: "true"
		});
		if (this.#isRTL) this.#countrySelectorEl.setAttribute("dir", "rtl");
		if (isFullscreen) this.#buildCloseButton();
		if (countrySearch) this.#buildSearchUI();
		this.#countryListEl = createEl("ul", {
			class: this.#withSlotClass("countryList", "iti__country-list"),
			id: `iti-${this.#id}__country-listbox`,
			role: "listbox",
			[ARIA.LABEL]: uiTranslations.countryListAriaLabel
		}, this.#countrySelectorEl);
		if (!countrySearch) this.#countryListEl.setAttribute("tabindex", "0");
		this.#appendListItems();
		if (countrySearch) this.#updateSearchResultsA11yText();
		if (detachedParent) {
			const wrapperClasses = buildClassNames({
				iti: true,
				"iti--detached-country-selector": true,
				"iti--fullscreen-popup": isFullscreen,
				"iti--inline-country-selector": !isFullscreen,
				[containerClass]: Boolean(containerClass)
			});
			this.#detachedCountrySelectorEl = createEl("div", { class: this.#withSlotClass("countrySelectorContainer", wrapperClasses) });
			this.#detachedCountrySelectorEl.appendChild(this.#countrySelectorEl);
		} else this.#countryContainerEl.appendChild(this.#countrySelectorEl);
	}
	#getDetachedParent() {
		const { countrySelectorMode, dropdownParent, fullscreenParent } = this.#options;
		if (countrySelectorMode === COUNTRY_SELECTOR_MODE.FULLSCREEN) return fullscreenParent ?? document.body;
		if (countrySelectorMode === COUNTRY_SELECTOR_MODE.DROPDOWN) return dropdownParent;
		return null;
	}
	#buildCloseButton() {
		this.#closeButtonEl = createEl("button", {
			type: "button",
			class: this.#withSlotClass("closeButton", "iti__close-button"),
			[ARIA.LABEL]: this.#options.uiTranslations.closeCountrySelectorAriaLabel,
			tabindex: "-1"
		}, this.#countrySelectorEl);
		this.#closeButtonEl.appendChild(buildCloseIcon());
	}
	#buildSearchUI() {
		const { uiTranslations, searchInputClass } = this.#options;
		const searchWrapper = createEl("div", { class: this.#withSlotClass("searchWrapper", "iti__search-input-wrapper") }, this.#countrySelectorEl);
		this.#searchIconEl = createEl("span", {
			class: this.#withSlotClass("searchIcon", "iti__search-icon"),
			[ARIA.HIDDEN]: "true"
		}, searchWrapper);
		this.#searchIconEl.appendChild(buildSearchIcon());
		this.#searchInputEl = createEl("input", {
			id: `iti-${this.#id}__search-input`,
			type: "search",
			class: this.#withSlotClass("searchInput", `iti__search-input ${searchInputClass}`),
			placeholder: uiTranslations.searchPlaceholder,
			role: "combobox",
			[ARIA.EXPANDED]: "true",
			[ARIA.LABEL]: uiTranslations.searchPlaceholder,
			[ARIA.CONTROLS]: `iti-${this.#id}__country-listbox`,
			[ARIA.AUTOCOMPLETE]: "list",
			autocomplete: "off"
		}, searchWrapper);
		this.#searchClearButtonEl = createEl("button", {
			type: "button",
			class: this.#withSlotClass("searchClear", `iti__search-clear ${CLASSES.HIDE}`),
			[ARIA.LABEL]: uiTranslations.clearSearchAriaLabel,
			tabindex: "-1"
		}, searchWrapper);
		this.#searchClearButtonEl.appendChild(buildClearIcon(this.#id));
		this.#searchResultsLiveRegionEl = createEl("span", { class: "iti__a11y-text" }, this.#countrySelectorEl);
		this.#noResultsMessageEl = createEl("div", {
			class: this.#withSlotClass("noResults", `iti__no-results ${CLASSES.HIDE}`),
			[ARIA.HIDDEN]: "true"
		}, this.#countrySelectorEl);
		this.#noResultsMessageEl.textContent = uiTranslations.searchEmptyState ?? null;
	}
	#updateInputPaddingAndReveal() {
		if (!this.#countryContainerEl) return;
		this.#updateInputPadding();
		this.#countryContainerEl.classList.remove(CLASSES.V_HIDE);
	}
	#buildHiddenInputs(wrapper) {
		const { hiddenInputs } = this.#options;
		if (!hiddenInputs) return;
		const names = hiddenInputs(this.telInputEl.getAttribute("name") || "");
		if (names.phone) {
			const existingInput = this.telInputEl.form?.querySelector(`input[name="${names.phone}"]`);
			if (existingInput) this.#hiddenInputPhoneEl = existingInput;
			else {
				this.#hiddenInputPhoneEl = createEl("input", {
					type: "hidden",
					name: names.phone
				});
				wrapper.appendChild(this.#hiddenInputPhoneEl);
			}
		}
		if (names.country) {
			const existingInput = this.telInputEl.form?.querySelector(`input[name="${names.country}"]`);
			if (existingInput) this.#hiddenInputCountryEl = existingInput;
			else {
				this.#hiddenInputCountryEl = createEl("input", {
					type: "hidden",
					name: names.country
				});
				wrapper.appendChild(this.#hiddenInputCountryEl);
			}
		}
	}
	#appendListItems() {
		const frag = document.createDocumentFragment();
		const liClass = this.#withSlotClass("countryListItem", CLASSES.COUNTRY_ITEM);
		for (let i = 0; i < this.#countries.length; i++) {
			const c = this.#countries[i];
			const listItem = createEl("li", {
				id: `iti-${this.#id}__item-${c.iso2}`,
				class: liClass,
				role: "option",
				[ARIA.SELECTED]: "false"
			});
			listItem.dataset[DATA_KEYS.DIAL_CODE] = c.dialCode;
			listItem.dataset[DATA_KEYS.ISO2] = c.iso2;
			this.#listItemByIso2.set(c.iso2, listItem);
			if (this.#options.showFlags) createEl("div", { class: this.#withSlotClass("countryListItemFlag", `${CLASSES.FLAG} iti__${c.iso2}`) }, listItem);
			const nameEl = createEl("span", { class: this.#withSlotClass("countryName", "iti__country-name") }, listItem);
			nameEl.textContent = `${c.name} `;
			const dialEl = createEl("span", { class: this.#withSlotClass("dialCode", "iti__dial-code") }, nameEl);
			if (this.#isRTL) dialEl.setAttribute("dir", "ltr");
			dialEl.textContent = `(+${c.dialCode})`;
			frag.appendChild(listItem);
		}
		this.#countryListEl.appendChild(frag);
	}
	#updateInputPadding() {
		if (this.#selectedCountryEl) {
			const fallbackWidth = this.#options.separateDialCode ? LAYOUT.FALLBACK_SELECTED_COUNTRY_WITH_DIAL_WIDTH : LAYOUT.FALLBACK_SELECTED_COUNTRY_NO_DIAL_WIDTH;
			const inputPadding = (this.#selectedCountryEl.offsetWidth || this.#getHiddenSelectedCountryWidth() || fallbackWidth) + LAYOUT.INPUT_PADDING_EXTRA_LEFT;
			this.telInputEl.style.paddingLeft = `${inputPadding}px`;
		}
	}
	#observeSelectedCountryResize() {
		if (!this.#selectedCountryEl || typeof ResizeObserver === "undefined") return;
		this.#resizeObserver = new ResizeObserver(() => {
			if (this.#selectedCountryEl?.offsetWidth) this.#updateInputPadding();
		});
		this.#resizeObserver.observe(this.#selectedCountryEl);
	}
	#getHiddenSelectedCountryWidth() {
		if (!this.telInputEl.parentNode) return 0;
		const body = document.body;
		const containerClone = this.telInputEl.parentNode.cloneNode(false);
		containerClone.style.visibility = "hidden";
		body.appendChild(containerClone);
		const countryContainerClone = this.#countryContainerEl.cloneNode();
		containerClone.appendChild(countryContainerClone);
		const selectedCountryClone = this.#selectedCountryEl.cloneNode(true);
		countryContainerClone.appendChild(selectedCountryClone);
		const width = selectedCountryClone.offsetWidth;
		body.removeChild(containerClone);
		return width;
	}
	#ensureInlineDropdownSizeMeasured() {
		if (this.#inlineDropdownHeight !== void 0) return;
		const { countrySearch, matchDropdownWidth } = this.#options;
		const { height, width } = this.#getHiddenInlineDropdownSize();
		this.#inlineDropdownHeight = height;
		if (countrySearch) {
			this.#countrySelectorEl.style.height = `${height}px`;
			if (!matchDropdownWidth && width > 0) this.#countrySelectorEl.style.width = `${width}px`;
		}
	}
	#getHiddenInlineDropdownSize() {
		const body = document.body;
		const selectorEl = this.#countrySelectorEl;
		const originalParent = selectorEl.parentNode;
		const originalNextSibling = selectorEl.nextSibling;
		selectorEl.classList.remove(CLASSES.HIDE);
		const tempContainer = createEl("div", { class: "iti iti--inline-country-selector" });
		tempContainer.appendChild(selectorEl);
		tempContainer.style.visibility = "hidden";
		body.appendChild(tempContainer);
		const height = selectorEl.offsetHeight;
		const width = selectorEl.offsetWidth;
		body.removeChild(tempContainer);
		selectorEl.classList.add(CLASSES.HIDE);
		if (originalParent) originalParent.insertBefore(selectorEl, originalNextSibling);
		return {
			height: height > 0 ? height : LAYOUT.FALLBACK_DROPDOWN_HEIGHT,
			width
		};
	}
	#updateSearchResultsA11yText() {
		const { uiTranslations } = this.#options;
		const count = this.#countryListEl.childElementCount;
		this.#searchResultsLiveRegionEl.textContent = uiTranslations.searchSummaryAria(count);
	}
	#filterCountriesByQuery(query) {
		let matchedCountries;
		if (query === "") matchedCountries = this.#countries;
		else {
			const normalisedQuery = Numerals.toAscii(query);
			matchedCountries = getMatchedCountries(this.#countries, this.#searchTokens, normalisedQuery);
		}
		this.#showFilteredCountries(matchedCountries);
	}
	prefillSearchWithPlus() {
		this.#searchInputEl.value = "+";
		this.#searchInputEl.focus();
		this.#filterCountriesByQuery("");
	}
	#applySearchFilter() {
		const inputQuery = this.#searchInputEl.value.trim();
		this.#filterCountriesByQuery(inputQuery);
		if (this.#searchInputEl.value) this.#searchClearButtonEl.classList.remove(CLASSES.HIDE);
		else this.#searchClearButtonEl.classList.add(CLASSES.HIDE);
	}
	#handleSearchChange() {
		if (this.#searchDebounceTimer) clearTimeout(this.#searchDebounceTimer);
		this.#searchDebounceTimer = setTimeout(() => {
			this.#applySearchFilter();
			this.#searchDebounceTimer = null;
		}, TIMINGS.SEARCH_DEBOUNCE_MS);
	}
	#handleSearchClear() {
		this.#searchInputEl.value = "";
		this.#searchInputEl.focus();
		this.#applySearchFilter();
	}
	#scrollCountryListToItem(element) {
		const container = this.#countryListEl;
		const containerRect = container.getBoundingClientRect();
		const elementRect = element.getBoundingClientRect();
		const offsetTop = elementRect.top - containerRect.top + container.scrollTop;
		if (elementRect.top < containerRect.top) container.scrollTop = offsetTop;
		else if (elementRect.bottom > containerRect.bottom) container.scrollTop = offsetTop - containerRect.height + elementRect.height;
	}
	#getOpenFocusEl() {
		return this.#options.countrySearch ? this.#searchInputEl : this.#countryListEl;
	}
	#highlightListItem(listItem, doScroll = true) {
		this.#highlightedListItemEl?.classList.remove(CLASSES.HIGHLIGHT);
		if (listItem) {
			listItem.classList.add(CLASSES.HIGHLIGHT);
			const activeDescendant = listItem.getAttribute("id") || "";
			this.#getOpenFocusEl().setAttribute(ARIA.ACTIVE_DESCENDANT, activeDescendant);
			if (doScroll) this.#scrollCountryListToItem(listItem);
			this.#highlightedListItemEl = listItem;
		} else this.#highlightedListItemEl = null;
	}
	bindHiddenInputSubmitListener(signal, getPhone, getCountryIso2) {
		const form = this.telInputEl.form;
		if (!form || !this.#hiddenInputPhoneEl && !this.#hiddenInputCountryEl) return;
		form.addEventListener("submit", () => {
			if (this.#hiddenInputPhoneEl) this.#hiddenInputPhoneEl.value = getPhone();
			if (this.#hiddenInputCountryEl) this.#hiddenInputCountryEl.value = getCountryIso2();
		}, { signal });
	}
	bindAllInitialCountrySelectorListeners(signal, onOpen, onClose) {
		const label = this.telInputEl.closest("label");
		if (label) label.addEventListener("click", (e) => {
			if (!this.isCountrySelectorOpen()) this.telInputEl.focus();
			else e.preventDefault();
		}, { signal });
		this.#selectedCountryEl.addEventListener("click", () => {
			if (!this.isCountrySelectorOpen() && !this.telInputEl.disabled && !this.telInputEl.readOnly) onOpen();
		}, { signal });
		this.#countryContainerEl.addEventListener("keydown", (e) => {
			const openKeys = [
				KEYS.ARROW_UP,
				KEYS.ARROW_DOWN,
				KEYS.SPACE,
				KEYS.ENTER
			];
			if (!this.isCountrySelectorOpen() && openKeys.includes(e.key)) {
				e.preventDefault();
				e.stopPropagation();
				onOpen();
			}
			if (e.key === KEYS.TAB) onClose();
		}, { signal });
	}
	openCountrySelector(onSelect, onClose) {
		const { dropdownAlwaysOpen } = this.#options;
		this.#countrySelectorAbortController = new AbortController();
		if (this.#options.countrySelectorMode !== COUNTRY_SELECTOR_MODE.FULLSCREEN) this.#ensureInlineDropdownSizeMeasured();
		this.ensureDropdownWidthSet();
		if (this.#detachedCountrySelectorEl) this.#injectAndPositionDetachedCountrySelector();
		else {
			const positionBelow = this.#shouldPositionDropdownBelowInput();
			const distance = this.telInputEl.offsetHeight + LAYOUT.DROPDOWN_MARGIN;
			if (positionBelow) this.#countrySelectorEl.style.top = `${distance}px`;
			else this.#countrySelectorEl.style.bottom = `${distance}px`;
		}
		this.#countrySelectorEl.classList.remove(CLASSES.HIDE);
		this.#selectedCountryEl.setAttribute(ARIA.EXPANDED, "true");
		const itemToHighlight = this.#selectedListItemEl ?? this.#countryListEl.firstElementChild;
		if (itemToHighlight) this.#highlightListItem(itemToHighlight);
		if (!dropdownAlwaysOpen) this.#getOpenFocusEl().focus();
		if (this.#options.countrySelectorMode === COUNTRY_SELECTOR_MODE.FULLSCREEN && this.#detachedCountrySelectorEl && window.visualViewport) {
			this.#adjustFullscreenPopupToViewport();
			const onViewportResize = () => {
				this.#adjustFullscreenPopupToViewport();
				if (this.#highlightedListItemEl) this.#scrollCountryListToItem(this.#highlightedListItemEl);
			};
			const { signal } = this.#countrySelectorAbortController;
			window.visualViewport.addEventListener("resize", onViewportResize, { signal });
			window.addEventListener("resize", onViewportResize, { signal });
		}
		this.#arrowEl.classList.add(CLASSES.ARROW_UP);
		this.#bindCountrySelectorOpenListeners(onSelect, onClose);
	}
	#bindCountrySelectorOpenListeners(onSelect, onClose) {
		const signal = this.#countrySelectorAbortController.signal;
		this.#bindListItemHover(signal);
		this.#bindListItemClick(signal, onSelect);
		if (!this.#options.dropdownAlwaysOpen) this.#bindOutsideClickToClose(signal, onClose);
		this.#bindCountrySelectorKeydownListener(signal, onSelect, onClose);
		this.#closeButtonEl?.addEventListener("click", () => {
			onClose();
			this.#selectedCountryEl.focus();
		}, { signal });
		if (this.#options.countrySearch) this.#bindSearchInputListener(signal);
		if (this.#options.countrySelectorMode === COUNTRY_SELECTOR_MODE.DROPDOWN && this.#options.dropdownParent && !supportsCssAnchor) document.addEventListener("scroll", onClose, {
			signal,
			capture: true,
			passive: true
		});
	}
	#bindListItemHover(signal) {
		this.#countryListEl.addEventListener("mouseover", (e) => {
			const listItem = e.target?.closest(`.${CLASSES.COUNTRY_ITEM}`);
			if (listItem) this.#highlightListItem(listItem, false);
		}, { signal });
	}
	#bindListItemClick(signal, onSelect) {
		this.#countryListEl.addEventListener("click", (e) => {
			const listItem = e.target?.closest(`.${CLASSES.COUNTRY_ITEM}`);
			if (listItem) onSelect(listItem);
		}, { signal });
	}
	#bindOutsideClickToClose(signal, onClickOff) {
		setTimeout(() => {
			document.documentElement.addEventListener("click", (e) => {
				if (!this.#countrySelectorEl.contains(e.target)) onClickOff();
			}, { signal });
		}, 0);
	}
	#bindCountrySelectorKeydownListener(signal, onEnter, onEscape) {
		let query = "";
		let queryTimer = null;
		const handleKeydown = (e) => {
			if ([
				KEYS.ARROW_UP,
				KEYS.ARROW_DOWN,
				KEYS.ENTER,
				KEYS.ESC
			].includes(e.key)) {
				e.preventDefault();
				e.stopPropagation();
				if (e.key === KEYS.ARROW_UP || e.key === KEYS.ARROW_DOWN) this.#handleUpDownKey(e.key);
				else if (e.key === KEYS.ENTER && !e.isComposing) onEnter(this.#highlightedListItemEl);
				else if (e.key === KEYS.ESC) {
					onEscape();
					this.#selectedCountryEl.focus();
				}
			}
			if (!this.#options.countrySearch && REGEX.HIDDEN_SEARCH_CHAR.test(e.key)) {
				e.stopPropagation();
				if (queryTimer) clearTimeout(queryTimer);
				query += e.key.toLowerCase();
				this.#searchForCountry(query);
				queryTimer = setTimeout(() => {
					query = "";
				}, TIMINGS.HIDDEN_SEARCH_RESET_MS);
			}
		};
		this.#selectedCountryEl?.addEventListener("keydown", handleKeydown, { signal });
		this.#countrySelectorEl?.addEventListener("keydown", handleKeydown, { signal });
		if (this.#detachedCountrySelectorEl) this.#countrySelectorEl?.addEventListener("keydown", (e) => {
			if (e.key === KEYS.TAB) {
				e.preventDefault();
				onEscape();
				(e.shiftKey ? this.#selectedCountryEl : this.telInputEl).focus();
			}
		}, { signal });
	}
	#bindSearchInputListener(signal) {
		this.#searchInputEl.addEventListener("input", () => this.#handleSearchChange(), { signal });
		this.#searchClearButtonEl.addEventListener("click", () => this.#handleSearchClear(), { signal });
	}
	#searchForCountry(query) {
		const match = findFirstCountryStartingWith(this.#countries, this.#searchTokens, query);
		if (match) {
			const listItem = this.#listItemByIso2.get(match.iso2);
			this.#highlightListItem(listItem);
		}
	}
	#handleUpDownKey(key) {
		let next = key === KEYS.ARROW_UP ? this.#highlightedListItemEl?.previousElementSibling : this.#highlightedListItemEl?.nextElementSibling;
		if (!next && this.#countryListEl.childElementCount > 1) next = key === KEYS.ARROW_UP ? this.#countryListEl.lastElementChild : this.#countryListEl.firstElementChild;
		if (next) this.#highlightListItem(next);
	}
	#updateSelectedListItem(iso2) {
		if (this.#selectedListItemEl && this.#selectedListItemEl.dataset[DATA_KEYS.ISO2] !== iso2) {
			this.#selectedListItemEl.setAttribute(ARIA.SELECTED, "false");
			this.#selectedListItemEl.querySelector(".iti__country-check")?.remove();
			this.#selectedListItemEl = null;
		}
		if (iso2 && !this.#selectedListItemEl) {
			const newListItem = this.#countryListEl.querySelector(`[data-iso2="${iso2}"]`);
			if (newListItem) {
				newListItem.setAttribute(ARIA.SELECTED, "true");
				createEl("span", {
					class: this.#withSlotClass("countryCheck", "iti__country-check"),
					[ARIA.HIDDEN]: "true"
				}, newListItem).appendChild(buildCheckIcon());
				this.#selectedListItemEl = newListItem;
				if (this.#options.dropdownAlwaysOpen) this.#highlightListItem(newListItem);
			}
		}
	}
	#showFilteredCountries(matchedCountries) {
		this.#countryListEl.replaceChildren();
		let noCountriesAddedYet = true;
		for (const c of matchedCountries) {
			const listItem = this.#listItemByIso2.get(c.iso2);
			if (listItem) {
				this.#countryListEl.appendChild(listItem);
				if (noCountriesAddedYet) {
					this.#highlightListItem(listItem, false);
					noCountriesAddedYet = false;
				}
			}
		}
		if (noCountriesAddedYet) {
			this.#highlightListItem(null);
			if (this.#noResultsMessageEl) this.#noResultsMessageEl.classList.remove(CLASSES.HIDE);
		} else if (this.#noResultsMessageEl) this.#noResultsMessageEl.classList.add(CLASSES.HIDE);
		this.#countryListEl.scrollTop = 0;
		this.#updateSearchResultsA11yText();
	}
	closeCountrySelector() {
		const { countrySearch } = this.#options;
		this.#countrySelectorAbortController.abort();
		this.#countrySelectorAbortController = null;
		this.#countrySelectorEl.classList.add(CLASSES.HIDE);
		this.#selectedCountryEl.setAttribute(ARIA.EXPANDED, "false");
		this.#getOpenFocusEl().removeAttribute(ARIA.ACTIVE_DESCENDANT);
		if (countrySearch) {
			this.#searchInputEl.value = "";
			this.#applySearchFilter();
			if (this.#highlightedListItemEl) {
				this.#highlightedListItemEl.classList.remove(CLASSES.HIGHLIGHT);
				this.#highlightedListItemEl = null;
			}
		}
		this.#arrowEl.classList.remove(CLASSES.ARROW_UP);
		if (this.#detachedCountrySelectorEl) {
			this.#detachedCountrySelectorEl.remove();
			this.#detachedCountrySelectorEl.style.top = "";
			this.#detachedCountrySelectorEl.style.bottom = "";
			this.#detachedCountrySelectorEl.style.removeProperty("--iti-virtual-keyboard-height");
			this.#detachedCountrySelectorEl.style.paddingLeft = "";
			this.#detachedCountrySelectorEl.style.paddingRight = "";
		} else {
			this.#countrySelectorEl.style.top = "";
			this.#countrySelectorEl.style.bottom = "";
		}
	}
	#shouldPositionDropdownBelowInput() {
		if (this.#options.dropdownAlwaysOpen) return true;
		const inputPos = this.telInputEl.getBoundingClientRect();
		const spaceAbove = inputPos.top;
		const spaceBelow = window.innerHeight - inputPos.bottom;
		return spaceBelow >= this.#inlineDropdownHeight || spaceBelow >= spaceAbove;
	}
	#injectAndPositionDetachedCountrySelector() {
		const isFullscreen = this.#options.countrySelectorMode === COUNTRY_SELECTOR_MODE.FULLSCREEN;
		const detachedParent = this.#getDetachedParent();
		if (isFullscreen) {
			if (window.innerWidth >= LAYOUT.NARROW_VIEWPORT_WIDTH) {
				const inputPos = this.telInputEl.getBoundingClientRect();
				this.#detachedCountrySelectorEl.style.paddingLeft = `${inputPos.left}px`;
				this.#detachedCountrySelectorEl.style.paddingRight = `${window.innerWidth - inputPos.right}px`;
			}
		} else this.#setupCssAnchorPositioning();
		if (!isFullscreen && !supportsCssAnchor) {
			const inputPos = this.telInputEl.getBoundingClientRect();
			this.#detachedCountrySelectorEl.style.left = `${inputPos.left}px`;
			if (this.#shouldPositionDropdownBelowInput()) this.#detachedCountrySelectorEl.style.top = `${inputPos.bottom + LAYOUT.DROPDOWN_MARGIN}px`;
			else {
				this.#detachedCountrySelectorEl.style.top = "unset";
				this.#detachedCountrySelectorEl.style.bottom = `${window.innerHeight - inputPos.top + LAYOUT.DROPDOWN_MARGIN}px`;
			}
		}
		detachedParent.appendChild(this.#detachedCountrySelectorEl);
	}
	#setupCssAnchorPositioning() {
		if (this.#cssAnchorPositioningDone) return;
		this.#cssAnchorPositioningDone = true;
		const anchorName = `--iti-anchor-${this.#id}`;
		const existing = getComputedStyle(this.telInputEl).anchorName;
		this.telInputEl.style.anchorName = existing && existing !== "none" ? `${existing}, ${anchorName}` : anchorName;
		this.#detachedCountrySelectorEl.style.positionAnchor = anchorName;
	}
	#adjustFullscreenPopupToViewport() {
		const vv = window.visualViewport;
		const popup = this.#detachedCountrySelectorEl;
		if (!vv || !popup) return;
		const virtualKeyboardHeight = Math.max(0, popup.offsetHeight - vv.height);
		popup.style.setProperty("--iti-virtual-keyboard-height", `${virtualKeyboardHeight}px`);
	}
	isCountrySelectorOpen() {
		return !this.#countrySelectorEl.classList.contains(CLASSES.HIDE);
	}
	setLoading(isLoading) {
		this.#selectedFlagEl.classList.toggle(CLASSES.LOADING, isLoading);
	}
	playStrictRejectAnimation() {
		if (!this.#options.strictRejectAnimation) return;
		const wrapperEl = this.telInputEl.parentElement;
		if (!wrapperEl) return;
		wrapperEl.classList.remove(CLASSES.STRICT_REJECT_ANIMATION);
		wrapperEl.offsetWidth;
		wrapperEl.classList.add(CLASSES.STRICT_REJECT_ANIMATION);
		wrapperEl.addEventListener("animationend", () => wrapperEl.classList.remove(CLASSES.STRICT_REJECT_ANIMATION), { once: true });
	}
	isLoading() {
		return this.#selectedFlagEl.classList.contains(CLASSES.LOADING);
	}
	setDisabled(disabled) {
		this.telInputEl.disabled = disabled;
		if (this.#selectedCountryEl) if (disabled) this.#selectedCountryEl.setAttribute("disabled", "true");
		else this.#selectedCountryEl.removeAttribute("disabled");
	}
	setReadonly(readonly) {
		this.telInputEl.readOnly = readonly;
		if (this.#selectedCountryEl) if (readonly) this.#selectedCountryEl.setAttribute("disabled", "true");
		else this.#selectedCountryEl.removeAttribute("disabled");
	}
	setSelectedCountry(selectedCountry) {
		const { countrySelectorMode, showFlags, separateDialCode, uiTranslations } = this.#options;
		const name = selectedCountry?.name;
		const dialCode = selectedCountry?.dialCode;
		const iso2 = selectedCountry?.iso2 ?? "";
		if (countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF) this.#updateSelectedListItem(iso2);
		if (this.#selectedCountryEl) {
			const flagClass = this.#withSlotClass("selectedFlag", iso2 && showFlags ? `${CLASSES.FLAG} iti__${iso2}` : `${CLASSES.FLAG} ${CLASSES.GLOBE}`);
			let ariaLabel, title;
			let flagContent = null;
			if (iso2) {
				title = name;
				ariaLabel = uiTranslations.selectedCountryAriaLabel.replace("${countryName}", name).replace("${dialCode}", `+${dialCode}`);
				if (!showFlags) flagContent = buildGlobeIcon();
			} else {
				title = uiTranslations.noCountrySelected;
				ariaLabel = uiTranslations.noCountrySelected;
				flagContent = buildGlobeIcon();
			}
			this.#selectedFlagEl.className = flagClass;
			this.#selectedCountryEl.setAttribute("title", title);
			this.#selectedCountryEl.setAttribute(ARIA.LABEL, ariaLabel);
			if (flagContent) this.#selectedFlagEl.replaceChildren(flagContent);
			else this.#selectedFlagEl.replaceChildren();
		}
		if (separateDialCode) {
			const fullDialCode = dialCode ? `+${dialCode}` : "";
			this.#selectedDialCodeEl.textContent = fullDialCode;
			this.#updateInputPadding();
		}
	}
	destroy() {
		this.telInputEl.iti = void 0;
		delete this.telInputEl.dataset[DATA_KEYS.INSTANCE_ID];
		this.#resizeObserver?.disconnect();
		this.telInputEl.style.paddingLeft = this.#originalPaddingLeft;
		const wrapper = this.telInputEl.parentNode;
		if (wrapper) {
			wrapper.before(this.telInputEl);
			wrapper.remove();
		}
		this.#listItemByIso2.clear();
	}
};
var processAllCountries = (options) => {
	const { onlyCountries, excludeCountries } = options;
	if (onlyCountries?.length) return data_default.filter((country) => onlyCountries.includes(country.iso2));
	else if (excludeCountries?.length) return data_default.filter((country) => !excludeCountries.includes(country.iso2));
	return [...data_default];
};
var generateCountryNames = (countries, options) => {
	const { countryNameLocale, countryNameOverrides, uiTranslations } = options;
	const bundledCountryNames = uiTranslations?.countryNames;
	let displayNames;
	try {
		if (typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function") displayNames = new Intl.DisplayNames(countryNameLocale, { type: "region" });
		else displayNames = null;
	} catch (e) {
		console.error(e);
		displayNames = null;
	}
	for (const c of countries) c.name = countryNameOverrides[c.iso2] || bundledCountryNames?.[c.iso2] || displayNames?.of(c.iso2.toUpperCase()) || "";
};
var processDialCodes = (countries) => {
	const dialCodes = /* @__PURE__ */ new Set();
	let dialCodeMaxLength = 0;
	const dialCodeToIso2Map = {};
	const addToDialCodeMap = (iso2, dialCode) => {
		if (!iso2 || !dialCode) return;
		if (dialCode.length > dialCodeMaxLength) dialCodeMaxLength = dialCode.length;
		if (!Object.hasOwn(dialCodeToIso2Map, dialCode)) dialCodeToIso2Map[dialCode] = [];
		const iso2List = dialCodeToIso2Map[dialCode];
		if (iso2List.includes(iso2)) return;
		iso2List.push(iso2);
	};
	const countriesSortedByPriority = [...countries].sort((a, b) => a.priority - b.priority);
	for (const c of countriesSortedByPriority) {
		if (!dialCodes.has(c.dialCode)) dialCodes.add(c.dialCode);
		for (let k = 1; k < c.dialCode.length; k++) {
			const partialDialCode = c.dialCode.substring(0, k);
			addToDialCodeMap(c.iso2, partialDialCode);
		}
		addToDialCodeMap(c.iso2, c.dialCode);
		if (c.areaCodes) {
			const rootIso2Code = dialCodeToIso2Map[c.dialCode][0];
			for (const areaCode of c.areaCodes) {
				for (let k = 1; k < areaCode.length; k++) {
					const partialAreaCode = areaCode.substring(0, k);
					const partialDialCode = c.dialCode + partialAreaCode;
					addToDialCodeMap(rootIso2Code, partialDialCode);
					addToDialCodeMap(c.iso2, partialDialCode);
				}
				addToDialCodeMap(c.iso2, c.dialCode + areaCode);
			}
		}
	}
	return {
		dialCodes,
		dialCodeMaxLength,
		dialCodeToIso2Map
	};
};
var sortCountries = (countries, options) => {
	const { countryOrder } = options;
	countries.sort((a, b) => {
		if (countryOrder) {
			const aIndex = countryOrder.indexOf(a.iso2);
			const bIndex = countryOrder.indexOf(b.iso2);
			const aIndexExists = aIndex > -1;
			const bIndexExists = bIndex > -1;
			if (aIndexExists || bIndexExists) {
				if (aIndexExists && bIndexExists) return aIndex - bIndex;
				return aIndexExists ? -1 : 1;
			}
		}
		return a.name.localeCompare(b.name);
	});
};
var regionlessDialCodes = /* @__PURE__ */ new Set([
	"800",
	"808",
	"870",
	"881",
	"882",
	"883",
	"888",
	"979"
]);
var hasRegionlessDialCode = (number) => {
	const dialCode = getNumeric(number).slice(0, 3);
	return number.startsWith("+") && regionlessDialCodes.has(dialCode);
};
var stripSeparateDialCode = (fullNumber, hasValidDialCode, separateDialCode, selectedCountry) => {
	if (!separateDialCode || !hasValidDialCode) return fullNumber;
	const dialCode = `+${selectedCountry.dialCode}`;
	const start = fullNumber[dialCode.length] === " " || fullNumber[dialCode.length] === "-" ? dialCode.length + 1 : dialCode.length;
	return fullNumber.substring(start);
};
var formatNumberAsYouType = (fullNumber, telInputValue, utils, selectedCountry, separateDialCode) => {
	const result = utils ? utils.formatNumberAsYouType(fullNumber, selectedCountry?.iso2) : fullNumber;
	const dialCode = selectedCountry?.dialCode;
	if (separateDialCode && telInputValue.charAt(0) !== "+" && result.includes(`+${dialCode}`)) return (result.split(`+${dialCode}`)[1] || "").trim();
	return result;
};
var computeNewCaretPosition = (relevantChars, formattedValue, prevCaretPos, isDeleteForwards) => {
	if (prevCaretPos === 0 && !isDeleteForwards) return 0;
	let relevantCharCount = 0;
	for (let i = 0; i < formattedValue.length; i++) {
		if (/[+0-9]/.test(formattedValue[i])) relevantCharCount++;
		if (relevantCharCount === relevantChars && !isDeleteForwards) return i + 1;
		if (isDeleteForwards && relevantCharCount === relevantChars + 1) return i;
	}
	return formattedValue.length;
};
var regionlessNanpAreaCodes = /* @__PURE__ */ new Set([
	"800",
	"822",
	"833",
	"844",
	"855",
	"866",
	"877",
	"880",
	"881",
	"882",
	"883",
	"884",
	"885",
	"886",
	"887",
	"888",
	"889"
]);
var isRegionlessNanp = (number) => {
	const numeric = getNumeric(number);
	if (numeric.startsWith(DIAL_CODE.NANP) && numeric.length >= 4) {
		const areaCode = numeric.substring(1, 4);
		return regionlessNanpAreaCodes.has(areaCode);
	}
	return false;
};
var nextId = 0;
var ensureUtils = (methodName) => {
	if (!intlTelInput.utils) throw new Error(`intlTelInput.utils is required for ${methodName}(). See: https://intl-tel-input.com/docs/utils`);
};
var createDeferred = () => {
	let resolve;
	let reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
};
var Iti = class _Iti {
	id;
	promise;
	#ui;
	#options;
	#isAndroid;
	#countries;
	#dialCodeMaxLength;
	#dialCodeToIso2Map;
	#dialCodes;
	#countryByIso2;
	#searchTokens;
	#selectedCountry = null;
	#maxCoreNumberLength = null;
	#fallbackCountryIso2;
	#isActive = true;
	#abortController;
	#numerals;
	#userOverrideFormatting = false;
	#strictPasteSnapshot = null;
	#autoCountryDeferred;
	#utilsDeferred;
	constructor(input, customOptions = {}) {
		this.id = nextId++;
		UI.validateInput(input);
		const validatedOptions = validateOptions(customOptions);
		this.#options = {
			...defaults,
			...validatedOptions
		};
		normaliseOptions(this.#options);
		applyOptionSideEffects(this.#options);
		this.#ui = new UI(input, this.#options, this.id);
		this.#isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
		this.#numerals = new Numerals(input.value);
		this.promise = this.#createInitPromise(this.#options);
		this.#countries = processAllCountries(this.#options);
		const { dialCodes, dialCodeMaxLength, dialCodeToIso2Map } = processDialCodes(this.#countries);
		this.#dialCodes = dialCodes;
		this.#dialCodeMaxLength = dialCodeMaxLength;
		this.#dialCodeToIso2Map = dialCodeToIso2Map;
		this.#countryByIso2 = new Map(this.#countries.map((c) => [c.iso2, c]));
		this.#init();
	}
	#getTelInputValue() {
		const inputValue = this.#ui.telInputEl.value.trim();
		return this.#numerals.normalise(inputValue);
	}
	#setTelInputValue(asciiValue) {
		this.#ui.telInputEl.value = this.#numerals.denormalise(asciiValue);
	}
	#createInitPromise(options) {
		const { initialCountry, initialCountryLookup, loadUtils } = options;
		const needsAutoCountryDeferred = !initialCountry && Boolean(initialCountryLookup);
		const needsUtilsDeferred = Boolean(loadUtils) && !intlTelInput.utils;
		if (needsAutoCountryDeferred) this.#autoCountryDeferred = createDeferred();
		if (needsUtilsDeferred) this.#utilsDeferred = createDeferred();
		return Promise.all([this.#autoCountryDeferred?.promise, this.#utilsDeferred?.promise]).then(() => {});
	}
	#init() {
		this.#abortController = new AbortController();
		this.#processCountryData();
		this.#ui.buildMarkup(this.#countries, this.#searchTokens);
		this.#setInitialState();
		this.#initListeners();
		this.#startAsyncLoads();
		if (this.#options.dropdownAlwaysOpen) this.openCountrySelector();
	}
	#processCountryData() {
		generateCountryNames(this.#countries, this.#options);
		sortCountries(this.#countries, this.#options);
		this.#searchTokens = buildSearchTokens(this.#countries);
	}
	#setInitialState(overrideAutoCountry = false) {
		const attributeValueRaw = this.#ui.telInputEl.getAttribute("value");
		const attributeValue = this.#numerals.normalise(attributeValueRaw ?? "");
		const inputValue = this.#getTelInputValue();
		const value = attributeValue && attributeValue.startsWith("+") && (!inputValue || !inputValue.startsWith("+")) ? attributeValue : inputValue;
		const dialCode = this.#getDialCode(value);
		const isRegionlessNanpNumber = isRegionlessNanp(value);
		const { initialCountry, initialCountryLookup } = this.#options;
		const isAutoCountry = !initialCountry && Boolean(initialCountryLookup);
		const resolvedInitialCountry = isAutoCountry && intlTelInput.autoCountry ? intlTelInput.autoCountry : initialCountry;
		const doingAutoCountryLookup = isAutoCountry && !overrideAutoCountry && !intlTelInput.autoCountry;
		const isValidInitialCountry = isIso2(resolvedInitialCountry);
		if (dialCode) if (isRegionlessNanpNumber) {
			if (isValidInitialCountry) this.#updateSelectedCountry(resolvedInitialCountry);
			else if (!doingAutoCountryLookup) this.#updateSelectedCountry(US.ISO2);
		} else {
			if (isValidInitialCountry) this.#updateSelectedCountry(resolvedInitialCountry);
			this.#updateCountryFromNumber(value);
		}
		else if (isValidInitialCountry) this.#updateSelectedCountry(resolvedInitialCountry);
		else if (!doingAutoCountryLookup) this.#updateSelectedCountry("");
		if (value) this.#updateValueFromNumber(value);
	}
	#initListeners() {
		this.#bindAllTelInputListeners();
		if (this.#options.countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF) this.#ui.bindAllInitialCountrySelectorListeners(this.#abortController.signal, () => this.openCountrySelector(), () => this.#closeCountrySelectorInternal());
		this.#ui.bindHiddenInputSubmitListener(this.#abortController.signal, () => this.getNumber(), () => this.#selectedCountry?.iso2 || "");
	}
	#startAsyncLoads() {
		if (this.#utilsDeferred) {
			const { loadUtils } = this.#options;
			const doAttachUtils = () => {
				intlTelInput.attachUtils(loadUtils).catch(() => {});
			};
			if (intlTelInput.documentReady()) doAttachUtils();
			else window.addEventListener("load", doAttachUtils, { signal: this.#abortController.signal });
		}
		if (this.#autoCountryDeferred) if (this.#selectedCountry) this.#autoCountryDeferred.resolve();
		else this.#loadAutoCountry();
	}
	async #loadAutoCountry() {
		if (intlTelInput.autoCountry) {
			this.#handleAutoCountryLoaded();
			return;
		}
		this.#ui.setLoading(true);
		if (intlTelInput.startedLoadingAutoCountry) return;
		intlTelInput.startedLoadingAutoCountry = true;
		if (typeof this.#options.initialCountryLookup === "function") {
			let timeoutId;
			try {
				const iso2 = await Promise.race([this.#options.initialCountryLookup(), new Promise((_, reject) => {
					timeoutId = setTimeout(() => reject(/* @__PURE__ */ new Error("intl-tel-input: initialCountryLookup timed out after 10s")), 1e4);
				})]);
				const iso2Lower = typeof iso2 === "string" ? iso2.toLowerCase() : "";
				if (!isIso2(iso2Lower)) {
					intlTelInput.startedLoadingAutoCountry = false;
					_Iti.forEachInstance("handleAutoCountryFailure");
					return;
				}
				intlTelInput.autoCountry = iso2Lower;
				setTimeout(() => _Iti.forEachInstance("handleAutoCountryLoaded"));
			} catch {
				intlTelInput.startedLoadingAutoCountry = false;
				_Iti.forEachInstance("handleAutoCountryFailure");
			} finally {
				if (timeoutId !== void 0) clearTimeout(timeoutId);
			}
		}
	}
	#openCountrySelectorWithPlus() {
		this.openCountrySelector();
		this.#ui.prefillSearchWithPlus();
	}
	#removeJustTypedChar(inputValue) {
		const currentCaretPos = this.#ui.telInputEl.selectionStart || 0;
		const valueBeforeCaret = inputValue.substring(0, currentCaretPos - 1);
		const valueAfterCaret = inputValue.substring(currentCaretPos);
		this.#setTelInputValue(valueBeforeCaret + valueAfterCaret);
		return currentCaretPos - 1;
	}
	#bindAllTelInputListeners() {
		this.#bindInputListener();
		this.#bindKeydownListener();
		this.#bindStrictPasteListener();
	}
	#handleAndroidPlusKey(inputValue) {
		this.#removeJustTypedChar(inputValue);
		this.#openCountrySelectorWithPlus();
	}
	#handleAndroidStrictReject(inputValue, rejectedInput) {
		const newCaretPos = this.#removeJustTypedChar(inputValue);
		this.#ui.telInputEl.setSelectionRange(newCaretPos, newCaretPos);
		this.#ui.playStrictRejectAnimation();
		this.#dispatchEvent(EVENTS.STRICT_REJECT, {
			source: "key",
			rejectedInput,
			reason: "invalid"
		});
	}
	#formatAsYouType(inputValue, isDeleteForwards) {
		const currentCaretPos = this.#ui.telInputEl.selectionStart || 0;
		const relevantCharsBeforeCaret = inputValue.substring(0, currentCaretPos).replace(REGEX.NON_PLUS_NUMERIC_GLOBAL, "").length;
		const formattedValue = formatNumberAsYouType(this.#getFullNumber(), inputValue, intlTelInput.utils, this.#selectedCountry, this.#options.separateDialCode);
		const newCaretPos = computeNewCaretPosition(relevantCharsBeforeCaret, formattedValue, currentCaretPos, isDeleteForwards);
		this.#setTelInputValue(formattedValue);
		this.#ui.telInputEl.setSelectionRange(newCaretPos, newCaretPos);
	}
	#stripTypedDialCode(inputValue) {
		if (inputValue.startsWith("+") && this.#selectedCountry && this.#getDialCode(inputValue)) {
			const cleanNumber = stripSeparateDialCode(inputValue, true, true, this.#selectedCountry);
			this.#setTelInputValue(cleanNumber);
		}
	}
	#bindInputListener() {
		this.#userOverrideFormatting = REGEX.ALPHA_UNICODE.test(this.#getTelInputValue());
		this.#ui.telInputEl.addEventListener("input", this.#handleInputEvent, { signal: this.#abortController.signal });
	}
	#handleInputEvent = (e) => {
		const { strictMode, formatAsYouType, separateDialCode, countrySelectorMode, countrySearch } = this.#options;
		const detail = e?.detail;
		if (detail?.["isCountryChange"]) return;
		let inputValue = this.#getTelInputValue();
		const isPaste = e?.inputType === INPUT_TYPES.PASTE;
		const isStrictPaste = strictMode && isPaste;
		if (this.#isAndroid && !isPaste && e?.data === "+" && separateDialCode && countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF && countrySearch) {
			this.#handleAndroidPlusKey(inputValue);
			return;
		}
		if (this.#isAndroid && !isPaste && strictMode && (e?.data === " " || e?.data === "-" || e?.data === ".")) {
			this.#handleAndroidStrictReject(inputValue, e.data);
			return;
		}
		if (isStrictPaste) {
			if (this.#handleStrictPasteInputEvent()) return;
			inputValue = this.#getTelInputValue();
		}
		if (this.#updateCountryFromNumber(inputValue)) {
			this.#dispatchCountryChangeEvent();
			this.#dispatchEvent(EVENTS.INPUT, { isCountryChange: true });
		}
		if (!isStrictPaste && e?.data && REGEX.NON_PLUS_NUMERIC.test(e.data) || isPaste && inputValue && !strictMode) this.#userOverrideFormatting = true;
		else if (!REGEX.NON_PLUS_NUMERIC.test(inputValue)) this.#userOverrideFormatting = false;
		if (formatAsYouType && !this.#userOverrideFormatting && !detail?.["isSetNumber"] && this.#numerals.isAscii()) this.#formatAsYouType(inputValue, e?.inputType === INPUT_TYPES.DELETE_FORWARD);
		if (separateDialCode) this.#stripTypedDialCode(inputValue);
	};
	#bindKeydownListener() {
		const { strictMode, separateDialCode } = this.#options;
		if (!strictMode && !separateDialCode) return;
		this.#ui.telInputEl.addEventListener("keydown", this.#handleKeydownEvent, { signal: this.#abortController.signal });
	}
	#handleKeydownEvent = (e) => {
		const { strictMode, separateDialCode, countrySelectorMode, countrySearch } = this.#options;
		if (!e.key || e.key.length !== 1 || e.altKey || e.ctrlKey || e.metaKey) return;
		if (separateDialCode && countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF && countrySearch && e.key === "+") {
			e.preventDefault();
			this.#openCountrySelectorWithPlus();
			return;
		}
		if (!strictMode) return;
		const inputValue = this.#getTelInputValue();
		const isInitialPlus = !inputValue.startsWith("+") && this.#ui.telInputEl.selectionStart === 0 && e.key === "+";
		const normalisedKey = this.#numerals.normalise(e.key);
		const isNumeric = /^[0-9]$/.test(normalisedKey);
		const isAllowedChar = separateDialCode ? isNumeric : isInitialPlus || isNumeric;
		const input = this.#ui.telInputEl;
		const selStart = input.selectionStart;
		const selEnd = input.selectionEnd;
		const before = inputValue.slice(0, selStart ?? void 0);
		const after = inputValue.slice(selEnd ?? void 0);
		const newValue = before + normalisedKey + after;
		const newFullNumber = this.#buildFullNumber(newValue);
		let hasExceededMaxLength = getNumeric(newFullNumber).length > E164_MAX_DIGITS;
		if (!hasExceededMaxLength && intlTelInput.utils && this.#maxCoreNumberLength) hasExceededMaxLength = intlTelInput.utils.getCoreNumber(newFullNumber, this.#selectedCountry?.iso2).length > this.#maxCoreNumberLength;
		const isChangingDialCode = this.#resolveCountryChangeFromNumber(newFullNumber) !== null;
		if (!isAllowedChar || hasExceededMaxLength && !isChangingDialCode && !isInitialPlus) {
			this.#ui.playStrictRejectAnimation();
			this.#dispatchEvent(EVENTS.STRICT_REJECT, {
				source: "key",
				rejectedInput: e.key,
				reason: !isAllowedChar ? "invalid" : "max-length"
			});
			e.preventDefault();
		}
	};
	#bindStrictPasteListener() {
		if (!this.#options.strictMode) return;
		this.#ui.telInputEl.addEventListener("paste", this.#handleStrictPasteEvent, { signal: this.#abortController.signal });
	}
	#handleStrictPasteEvent = (e) => {
		const input = this.#ui.telInputEl;
		const inputValue = this.#getTelInputValue();
		this.#strictPasteSnapshot = {
			pastedRaw: e.clipboardData?.getData("text") ?? "",
			value: inputValue,
			selectionStart: input.selectionStart ?? inputValue.length,
			selectionEnd: input.selectionEnd ?? inputValue.length
		};
	};
	#handleStrictPasteInputEvent() {
		const input = this.#ui.telInputEl;
		const pasteSnapshot = this.#strictPasteSnapshot;
		this.#strictPasteSnapshot = null;
		if (!pasteSnapshot) return false;
		const pastedRaw = pasteSnapshot.pastedRaw;
		const originalValue = pasteSnapshot.value;
		const selStart = pasteSnapshot.selectionStart;
		const selEnd = pasteSnapshot.selectionEnd;
		const before = originalValue.slice(0, selStart);
		const after = originalValue.slice(selEnd);
		const iso2 = this.#selectedCountry?.iso2;
		const pasted = this.#numerals.normalise(pastedRaw);
		const initialCharSelected = selStart === 0 && selEnd > 0;
		const allowLeadingPlus = !originalValue.startsWith("+") || initialCharSelected;
		const allowedChars = pasted.replace(REGEX.NON_PLUS_NUMERIC_GLOBAL, "");
		const hasLeadingPlus = allowedChars.startsWith("+");
		const numerics = allowedChars.replace(/\+/g, "");
		const sanitised = hasLeadingPlus && allowLeadingPlus ? `+${numerics}` : numerics;
		let newValue = before + sanitised + after;
		let rejectReason = sanitised !== pasted ? "invalid" : null;
		if (newValue.length > 30) {
			this.#rejectStrictPasteAsTooLong(pasteSnapshot);
			return true;
		}
		const excessDigits = getNumeric(this.#buildFullNumber(newValue)).length - E164_MAX_DIGITS;
		if (excessDigits > 0) {
			if (selEnd !== originalValue.length) {
				this.#rejectStrictPasteAsTooLong(pasteSnapshot);
				return true;
			}
			newValue = newValue.slice(0, newValue.length - excessDigits);
			rejectReason = "max-length";
		}
		if (this.#maxCoreNumberLength && newValue.length > 5 && intlTelInput.utils) {
			let coreNumber = intlTelInput.utils.getCoreNumber(newValue, iso2);
			while (coreNumber.length === 0 && newValue.length > 0) {
				newValue = newValue.slice(0, -1);
				coreNumber = intlTelInput.utils.getCoreNumber(newValue, iso2);
			}
			if (!coreNumber) {
				this.#rejectStrictPasteAsTooLong(pasteSnapshot);
				return true;
			}
			if (coreNumber.length > this.#maxCoreNumberLength) if (selEnd === originalValue.length) {
				const trimLength = coreNumber.length - this.#maxCoreNumberLength;
				newValue = newValue.slice(0, newValue.length - trimLength);
				rejectReason = "max-length";
			} else {
				this.#rejectStrictPasteAsTooLong(pasteSnapshot);
				return true;
			}
		}
		this.#setTelInputValue(newValue);
		const caretPos = selStart + sanitised.length;
		input.setSelectionRange(caretPos, caretPos);
		if (rejectReason) {
			if (pasted.length > 0 && sanitised.length === 0) this.#ui.playStrictRejectAnimation();
			this.#dispatchEvent(EVENTS.STRICT_REJECT, {
				source: "paste",
				rejectedInput: pastedRaw,
				reason: rejectReason
			});
		}
		return false;
	}
	#rejectStrictPasteAsTooLong(pasteSnapshot) {
		this.#ui.playStrictRejectAnimation();
		this.#dispatchEvent(EVENTS.STRICT_REJECT, {
			source: "paste",
			rejectedInput: pasteSnapshot.pastedRaw,
			reason: "max-length"
		});
		this.#restoreValueBeforeStrictPaste(pasteSnapshot);
	}
	#restoreValueBeforeStrictPaste(pasteSnapshot) {
		this.#setTelInputValue(pasteSnapshot.value);
		this.#ui.telInputEl.setSelectionRange(pasteSnapshot.selectionStart, pasteSnapshot.selectionEnd);
	}
	#truncateToMaxLength(number) {
		const max = Number(this.#ui.telInputEl.getAttribute("maxlength"));
		return max && number.length > max ? number.substring(0, max) : number;
	}
	#dispatchEvent(name, detailProps = {}) {
		const e = new CustomEvent(name, {
			bubbles: true,
			cancelable: true,
			detail: detailProps
		});
		this.#ui.telInputEl.dispatchEvent(e);
	}
	openCountrySelector() {
		if (this.#ui.isCountrySelectorOpen()) return;
		this.#ui.openCountrySelector((li) => this.#selectListItem(li), () => this.#closeCountrySelectorInternal());
		this.#dispatchEvent(EVENTS.OPEN_COUNTRY_SELECTOR);
	}
	#updateValueFromNumber(fullNumber) {
		const { numberDisplayFormat, separateDialCode } = this.#options;
		let number = fullNumber;
		if (intlTelInput.utils && this.#selectedCountry) {
			const isRegionless = hasRegionlessDialCode(fullNumber);
			const preserveUserNational = !number.startsWith("+") && !separateDialCode;
			const useNational = numberDisplayFormat === NUMBER_FORMAT.NATIONAL && !isRegionless || preserveUserNational;
			let format;
			if (useNational) format = NUMBER_FORMAT.NATIONAL;
			else if (numberDisplayFormat === NUMBER_FORMAT.E164 && !isRegionless) format = NUMBER_FORMAT.E164;
			else format = NUMBER_FORMAT.INTERNATIONAL;
			number = intlTelInput.utils.formatNumber(number, this.#selectedCountry?.iso2, format);
		}
		number = this.#prepareNumberForInput(number);
		this.#setTelInputValue(number);
	}
	#updateCountryFromNumber(fullNumber) {
		const iso2 = this.#resolveCountryChangeFromNumber(fullNumber);
		if (iso2 !== null) return this.#updateSelectedCountry(iso2);
		return false;
	}
	#withDialCodePrefix(number) {
		const dialCode = this.#selectedCountry?.dialCode;
		const nationalPrefix = this.#selectedCountry?.nationalPrefix;
		if (number.startsWith("+") || !dialCode) return number;
		return `+${dialCode}${nationalPrefix && number.startsWith(nationalPrefix) && !this.#options.separateDialCode ? number.substring(1) : number}`;
	}
	#resolveCountryChangeFromNumber(fullNumber) {
		const plusIndex = fullNumber.indexOf("+");
		let number = plusIndex > 0 ? fullNumber.substring(plusIndex) : fullNumber;
		const selectedIso2 = this.#selectedCountry?.iso2;
		number = this.#withDialCodePrefix(number);
		const dialCodeMatch = this.#getDialCode(number, true);
		const numeric = getNumeric(number);
		if (dialCodeMatch) {
			const dialCodeMatchNumeric = getNumeric(dialCodeMatch);
			const iso2Codes = this.#dialCodeToIso2Map[dialCodeMatchNumeric];
			if (iso2Codes.length === 1) {
				if (iso2Codes[0] === selectedIso2) return null;
				return iso2Codes[0];
			}
			return this.#resolveCountryChangeFromMultiMatch(iso2Codes, dialCodeMatchNumeric, numeric);
		} else if (number.startsWith("+") && numeric.length) {
			const currentDial = this.#selectedCountry?.dialCode || "";
			if (currentDial && currentDial.startsWith(numeric)) return null;
			if (!selectedIso2) return null;
			return "";
		} else if ((!number || number === "+") && !selectedIso2 && this.#fallbackCountryIso2) return this.#fallbackCountryIso2;
		return null;
	}
	#resolveCountryChangeFromMultiMatch(iso2Codes, dialCodeMatchNumeric, numeric) {
		const selectedIso2 = this.#selectedCountry?.iso2;
		const selectedDialCode = this.#selectedCountry?.dialCode;
		if (!selectedIso2 && this.#fallbackCountryIso2 && iso2Codes.includes(this.#fallbackCountryIso2)) return this.#fallbackCountryIso2;
		if (selectedDialCode === DIAL_CODE.NANP && isRegionlessNanp(numeric)) return null;
		const areaCodes = this.#selectedCountry?.areaCodes;
		const priority = this.#selectedCountry?.priority;
		if (areaCodes) {
			const dialCodeAreaCodes = areaCodes.map((areaCode) => `${selectedDialCode}${areaCode}`);
			for (const dialCodeAreaCode of dialCodeAreaCodes) if (numeric.startsWith(dialCodeAreaCode)) return null;
		}
		const hasAreaCodesButNoneMatched = areaCodes && !(priority === 0) && numeric.length > dialCodeMatchNumeric.length;
		const isValidSelection = selectedIso2 && iso2Codes.includes(selectedIso2) && !hasAreaCodesButNoneMatched;
		const alreadySelected = selectedIso2 === iso2Codes[0];
		if (!isValidSelection && !alreadySelected) return iso2Codes[0];
		return null;
	}
	#updateSelectedCountry(iso2) {
		const prevIso2 = this.#selectedCountry?.iso2 || "";
		this.#selectedCountry = iso2 ? this.#countryByIso2.get(iso2) : null;
		if (this.#selectedCountry) this.#fallbackCountryIso2 = this.#selectedCountry.iso2;
		this.#ui.setSelectedCountry(this.#selectedCountry);
		this.#updatePlaceholder();
		this.#updateMaxCoreNumberLength();
		return prevIso2 !== iso2;
	}
	#updateMaxCoreNumberLength() {
		const { strictMode, placeholderNumberType, allowedNumberTypes } = this.#options;
		if (!strictMode || !intlTelInput.utils) return;
		const iso2 = this.#selectedCountry?.iso2;
		if (!iso2) {
			this.#maxCoreNumberLength = null;
			return;
		}
		let exampleNumber = intlTelInput.utils.getExampleNumber(iso2, placeholderNumberType, NUMBER_FORMAT.E164);
		let validNumber = exampleNumber;
		while (intlTelInput.utils.isValidNumber(exampleNumber, iso2, allowedNumberTypes)) {
			validNumber = exampleNumber;
			exampleNumber += "0";
		}
		const coreNumber = intlTelInput.utils.getCoreNumber(validNumber, iso2);
		this.#maxCoreNumberLength = coreNumber.length;
		if (iso2 === "by") this.#maxCoreNumberLength = coreNumber.length + 1;
	}
	#updatePlaceholder() {
		const { placeholderNumberPolicy, placeholderNumberType, numberDisplayFormat, customPlaceholder } = this.#options;
		const shouldSetPlaceholder = placeholderNumberPolicy === PLACEHOLDER_POLICY.AGGRESSIVE || !this.#ui.hadInitialPlaceholder && placeholderNumberPolicy === PLACEHOLDER_POLICY.POLITE;
		if (!intlTelInput.utils || !shouldSetPlaceholder) return;
		let placeholder = this.#selectedCountry ? intlTelInput.utils.getExampleNumber(this.#selectedCountry.iso2, placeholderNumberType, numberDisplayFormat) : "";
		placeholder = this.#prepareNumberForInput(placeholder);
		if (typeof customPlaceholder === "function") placeholder = customPlaceholder(placeholder, this.#selectedCountry);
		this.#ui.telInputEl.setAttribute("placeholder", placeholder);
	}
	#selectListItem(listItem) {
		if (!listItem) return;
		const iso2 = listItem.dataset[DATA_KEYS.ISO2];
		const countryChanged = this.#updateSelectedCountry(iso2);
		this.#closeCountrySelectorInternal();
		const dialCode = listItem.dataset[DATA_KEYS.DIAL_CODE];
		this.#updateDialCode(dialCode);
		const inputValue = this.#getTelInputValue();
		this.#updateValueFromNumber(inputValue);
		this.#ui.telInputEl.focus();
		if (countryChanged) {
			this.#dispatchCountryChangeEvent();
			this.#dispatchEvent(EVENTS.INPUT, { isCountryChange: true });
		}
	}
	closeCountrySelector() {
		this.#closeCountrySelectorInternal();
	}
	#closeCountrySelectorInternal(isDestroy) {
		if (!this.#ui.isCountrySelectorOpen() || this.#options.dropdownAlwaysOpen && !isDestroy) return;
		this.#ui.closeCountrySelector();
		this.#dispatchEvent(EVENTS.CLOSE_COUNTRY_SELECTOR);
	}
	#updateDialCode(newDialCodeDigits) {
		const inputValue = this.#getTelInputValue();
		if (!inputValue.startsWith("+")) return;
		const newDialCode = `+${newDialCodeDigits}`;
		const prevDialCode = this.#getDialCode(inputValue);
		let newNumber;
		if (prevDialCode) newNumber = inputValue.replace(prevDialCode, newDialCode);
		else newNumber = newDialCode;
		this.#setTelInputValue(newNumber);
	}
	#getDialCode(number, includeAreaCode) {
		if (!number.startsWith("+")) return "";
		let dialCode = "";
		let numericChars = "";
		let foundBaseDialCode = false;
		for (let i = 0; i < number.length; i++) {
			const c = number.charAt(i);
			if (!/[0-9]/.test(c)) continue;
			numericChars += c;
			if (!Boolean(this.#dialCodeToIso2Map[numericChars])) break;
			if (this.#dialCodes.has(numericChars)) {
				dialCode = number.substring(0, i + 1);
				foundBaseDialCode = true;
				if (!includeAreaCode) break;
			} else if (includeAreaCode && foundBaseDialCode) dialCode = number.substring(0, i + 1);
			if (numericChars.length === this.#dialCodeMaxLength) break;
		}
		return dialCode;
	}
	#buildFullNumber(value) {
		const dialCode = this.#selectedCountry?.dialCode;
		const numericValue = getNumeric(value);
		return (this.#options.separateDialCode && !value.startsWith("+") && dialCode && numericValue ? `+${dialCode}` : "") + value;
	}
	#getFullNumber() {
		const value = this.#getTelInputValue();
		return this.#buildFullNumber(value);
	}
	#prepareNumberForInput(fullNumber) {
		const number = stripSeparateDialCode(fullNumber, Boolean(this.#getDialCode(fullNumber)), this.#options.separateDialCode, this.#selectedCountry);
		return this.#truncateToMaxLength(number);
	}
	#dispatchCountryChangeEvent() {
		this.#dispatchEvent(EVENTS.COUNTRY_CHANGE, this.#selectedCountry ?? null);
	}
	#handleAutoCountryLoaded() {
		if (!this.#autoCountryDeferred || !intlTelInput.autoCountry) return;
		if (!this.#isActive) {
			this.#autoCountryDeferred.resolve();
			return;
		}
		const isFocused = document.activeElement === this.#ui.telInputEl;
		const hasTypedValue = Boolean(this.#getTelInputValue());
		if (this.#ui.isLoading() && !(isFocused && hasTypedValue)) this.setSelectedCountry(intlTelInput.autoCountry);
		else this.#fallbackCountryIso2 = intlTelInput.autoCountry;
		this.#ui.setLoading(false);
		this.#autoCountryDeferred.resolve();
	}
	#handleAutoCountryFailure() {
		if (!this.#isActive) {
			this.#autoCountryDeferred?.reject();
			return;
		}
		if (this.#ui.isLoading()) this.#setInitialState(true);
		this.#ui.setLoading(false);
		this.#autoCountryDeferred?.reject();
	}
	#handleUtilsLoaded() {
		if (!this.#isActive) {
			this.#utilsDeferred?.resolve();
			return;
		}
		if (!intlTelInput.utils) {
			this.#utilsDeferred?.resolve();
			return;
		}
		const inputValue = this.#getTelInputValue();
		const isFocused = document.activeElement === this.#ui.telInputEl;
		if (inputValue && !isFocused) this.#updateValueFromNumber(inputValue);
		if (this.#selectedCountry) {
			this.#updatePlaceholder();
			this.#updateMaxCoreNumberLength();
		}
		this.#utilsDeferred?.resolve();
	}
	#handleUtilsFailure(error) {
		if (!this.#isActive) {
			this.#utilsDeferred?.reject(error);
			return;
		}
		this.#utilsDeferred?.reject(error);
	}
	destroy() {
		if (!this.#isActive) return;
		this.#isActive = false;
		if (this.#options.countrySelectorMode !== COUNTRY_SELECTOR_MODE.OFF) this.#closeCountrySelectorInternal(true);
		this.#abortController.abort();
		this.#ui.destroy();
		intlTelInput.instances.delete(String(this.id));
	}
	isActive() {
		return this.#isActive;
	}
	getExtension() {
		if (!this.#isActive) return "";
		ensureUtils("getExtension");
		return intlTelInput.utils.getExtension(this.#getFullNumber(), this.#selectedCountry?.iso2);
	}
	getNumber(format) {
		if (!this.#isActive) return "";
		ensureUtils("getNumber");
		const iso2 = this.#selectedCountry?.iso2;
		const fullNumber = this.#getFullNumber();
		const formattedNumber = intlTelInput.utils.formatNumber(fullNumber, iso2, format);
		return this.#numerals.denormalise(formattedNumber);
	}
	getNumberType() {
		if (!this.#isActive) return null;
		ensureUtils("getNumberType");
		return intlTelInput.utils.getNumberType(this.#getFullNumber(), this.#selectedCountry?.iso2);
	}
	getSelectedCountry() {
		return this.#selectedCountry ?? null;
	}
	getValidationError() {
		if (!this.#isActive) return null;
		ensureUtils("getValidationError");
		const iso2 = this.#selectedCountry?.iso2;
		return intlTelInput.utils.getValidationError(this.#getFullNumber(), iso2);
	}
	isValidNumber() {
		if (!this.#isActive) return null;
		ensureUtils("isValidNumber");
		const dialCode = this.#selectedCountry?.dialCode;
		const iso2 = this.#selectedCountry?.iso2;
		const number = this.#getFullNumber();
		const coreNumber = intlTelInput.utils.getCoreNumber(number, iso2);
		if (coreNumber) {
			if (dialCode === UK.DIAL_CODE) {
				if (coreNumber[0] === UK.MOBILE_PREFIX && coreNumber.length !== UK.MOBILE_CORE_LENGTH) return false;
			}
			if (!REGEX.ALPHA_UNICODE.test(number) && dialCode) {
				const nationalDigitCount = getNumeric(number.startsWith("+") ? number.slice(1 + dialCode.length) : number).length;
				if (coreNumber.length > nationalDigitCount) return false;
			}
		}
		return this.#validateNumber("possible");
	}
	isValidNumberPrecise() {
		if (!this.#isActive) return null;
		ensureUtils("isValidNumberPrecise");
		return this.#validateNumber("precise");
	}
	#validateNumber(mode) {
		const { allowNumberExtensions, allowPhonewords, allowedNumberTypes } = this.#options;
		const iso2 = this.#selectedCountry?.iso2;
		const value = this.#getFullNumber();
		if (!this.#selectedCountry && !hasRegionlessDialCode(value)) return false;
		if (!(mode === "precise" ? intlTelInput.utils.isValidNumberPrecise : intlTelInput.utils.isValidNumber)(value, iso2, allowedNumberTypes)) return false;
		if (REGEX.ALPHA_UNICODE.test(value)) return Boolean(intlTelInput.utils.getExtension(value, iso2)) ? allowNumberExtensions : allowPhonewords;
		return true;
	}
	setSelectedCountry(iso2) {
		if (!this.#isActive) return;
		const iso2Lower = iso2?.toLowerCase();
		if (!isIso2(iso2Lower)) throw new Error(`Invalid iso2 code: '${iso2Lower}'`);
		const currentCountry = this.#selectedCountry?.iso2;
		if (!(iso2 && iso2Lower !== currentCountry || !iso2 && currentCountry)) return;
		this.#updateSelectedCountry(iso2Lower);
		this.#updateDialCode(this.#selectedCountry?.dialCode || "");
		const inputValue = this.#getTelInputValue();
		this.#updateValueFromNumber(inputValue);
		this.#dispatchCountryChangeEvent();
		this.#dispatchEvent(EVENTS.INPUT, { isCountryChange: true });
	}
	setNumber(number) {
		if (!this.#isActive) return;
		const normalisedNumber = this.#numerals.normalise(number);
		const countryChanged = this.#updateCountryFromNumber(normalisedNumber);
		this.#updateValueFromNumber(normalisedNumber);
		if (countryChanged) this.#dispatchCountryChangeEvent();
		this.#dispatchEvent(EVENTS.INPUT, { isSetNumber: true });
	}
	setPlaceholderNumberType(type) {
		if (!this.#isActive) return;
		this.#options.placeholderNumberType = type;
		this.#updatePlaceholder();
	}
	setDisabled(disabled) {
		if (!this.#isActive) return;
		this.#ui.setDisabled(disabled);
	}
	setReadonly(readonly) {
		if (!this.#isActive) return;
		this.#ui.setReadonly(readonly);
	}
	static forEachInstance(method, ...args) {
		const values = [...intlTelInput.instances.values()];
		const arg = args[0];
		values.forEach((instance) => {
			if (!(instance instanceof _Iti)) return;
			switch (method) {
				case "handleUtilsLoaded":
					instance.#handleUtilsLoaded();
					break;
				case "handleUtilsFailure":
					instance.#handleUtilsFailure(arg);
					break;
				case "handleAutoCountryLoaded":
					instance.#handleAutoCountryLoaded();
					break;
				case "handleAutoCountryFailure":
					instance.#handleAutoCountryFailure();
					break;
			}
		});
	}
};
var attachUtils = async (source) => {
	if (intlTelInput.utils || intlTelInput.startedLoadingUtils) return null;
	if (typeof source !== "function") throw new TypeError(`The argument passed to attachUtils must be a function that returns a promise for the utils module, not ${typeof source}`);
	intlTelInput.startedLoadingUtils = true;
	try {
		const utils = (await source())?.default;
		if (!utils || typeof utils !== "object") throw new TypeError("The loader function passed to attachUtils did not resolve to a module object with utils as its default export.");
		intlTelInput.utils = utils;
		Iti.forEachInstance("handleUtilsLoaded");
		return true;
	} catch (error) {
		Iti.forEachInstance("handleUtilsFailure", error);
		throw error;
	}
};
var intlTelInput = Object.assign((input, options) => {
	const iti = new Iti(input, options);
	intlTelInput.instances.set(String(iti.id), iti);
	input.iti = iti;
	return iti;
}, {
	defaults,
	documentReady: () => document.readyState === "complete",
	getAllCountries: () => data_default,
	getInstance: (input) => {
		const id = input.dataset[DATA_KEYS.INSTANCE_ID];
		return id ? intlTelInput.instances.get(id) ?? null : null;
	},
	instances: /* @__PURE__ */ new Map(),
	attachUtils,
	startedLoadingUtils: false,
	startedLoadingAutoCountry: false,
	version: "29.5.3",
	NUMBER_FORMAT,
	NUMBER_TYPE,
	VALIDATION_ERROR,
	PLACEHOLDER_POLICY,
	COUNTRY_SELECTOR_MODE
});
var intlTelInput_default = intlTelInput;
//#endregion
//#region resources/js/components/Form/PhoneField.vue
var _sfc_main = {
	__name: "PhoneField",
	__ssrInlineRender: true,
	props: {
		modelValue: {
			type: String,
			default: ""
		},
		id: {
			type: String,
			default: "phone"
		},
		placeholder: {
			type: String,
			default: "01XXXXXXXXX"
		},
		invalid: {
			type: Boolean,
			default: false
		},
		inputClass: {
			type: String,
			default: ""
		},
		defaultCountry: {
			type: String,
			default: "bd"
		}
	},
	emits: [
		"update:modelValue",
		"update:valid",
		"blur"
	],
	setup(__props, { emit: __emit }) {
		/**
		* Phone input with a country flag picker and real validation.
		*
		* Wraps intl-tel-input, which carries Google's libphonenumber rules, so a
		* number is checked against the selected country's actual numbering plan
		* rather than a length check. The bound value is always E.164
		* (+8801712345678) once the number is valid, which is the one format every
		* integration can be derived from.
		*/
		const props = __props;
		const emit = __emit;
		const el = (0, vue_exports.ref)(null);
		let iti = null;
		let syncing = false;
		/** Push the current state out: E.164 while valid, raw text while not. */
		function sync() {
			if (!iti) return;
			const valid = iti.isValidNumber() ?? false;
			const value = valid ? iti.getNumber() : el.value.value;
			syncing = true;
			emit("update:valid", valid);
			emit("update:modelValue", value);
			Promise.resolve().then(() => {
				syncing = false;
			});
		}
		(0, vue_exports.onMounted)(() => {
			iti = intlTelInput_default(el.value, {
				initialCountry: props.defaultCountry,
				countryOrder: [props.defaultCountry],
				nationalMode: true,
				strictMode: true,
				autoPlaceholder: "aggressive",
				placeholderNumberType: "MOBILE",
				loadUtils: () => import("./utils-DN55CzUP.js")
			});
			if (props.modelValue) iti.setNumber(props.modelValue);
			iti.promise.then(sync).catch(() => {});
			el.value.addEventListener("input", sync);
			el.value.addEventListener("countrychange", sync);
			el.value.addEventListener("blur", () => {
				sync();
				emit("blur");
			});
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			iti?.destroy();
			iti = null;
		});
		(0, vue_exports.watch)(() => props.modelValue, (value) => {
			if (syncing || !iti) return;
			if (value !== iti.getNumber()) iti.setNumber(value || "");
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: ["phone-field", { "is-invalid": __props.invalid }] }, _attrs))} data-v-5c965970><input${(0, server_renderer_exports.ssrRenderAttr)("id", __props.id)} type="tel" autocomplete="tel"${(0, server_renderer_exports.ssrRenderAttr)("placeholder", __props.placeholder)} class="${(0, server_renderer_exports.ssrRenderClass)([__props.inputClass, "iti__tel-input"])}" data-v-5c965970></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Form/PhoneField.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PhoneField_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-5c965970"]]);
//#endregion
export { PhoneField_default as t };

//# sourceMappingURL=PhoneField-DYLV--Ww.js.map