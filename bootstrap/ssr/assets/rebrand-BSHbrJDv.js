//#region resources/js/utils/rebrand.js
/**
* The storefront speaks as Chhondo. Text written in the admin before the
* rename — product descriptions, policy pages — still names the old brand,
* so the name is swapped where it is shown. The stored text is untouched,
* and nothing inside an e-mail address or a link is rewritten.
*/
function rebrand(text) {
	return String(text ?? "").replace(/চিত্র\s*চারুকথন|চারুকথন/g, "ছন্দ").replace(/(?<![\w.@/-])(?:chito\s+)?charuk(?:o|a)th?on(?![\w.@/-])/gi, "Chhondo");
}
//#endregion
export { rebrand as t };

//# sourceMappingURL=rebrand-BSHbrJDv.js.map