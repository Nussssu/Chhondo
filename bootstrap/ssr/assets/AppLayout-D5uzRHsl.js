import { c as server_renderer_exports, d as __esmMin, f as __exportAll, h as __toESM, i as link_default, l as vue_exports, m as __toCommonJS, n as require_pinia_prod, o as usePage, p as __require, s as router, u as __commonJSMin } from "../ssr.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import http from "http";
import util from "util";
import stream, { Readable } from "stream";
import { resolve } from "path";
import https from "https";
import url from "url";
import crypto from "crypto";
import { EventEmitter } from "events";
import http2 from "http2";
import zlib from "zlib";
//#region node_modules/axios/lib/helpers/bind.js
/**
* Create a bound version of a function with a specified `this` context
*
* @param {Function} fn - The function to bind
* @param {*} thisArg - The value to be passed as the `this` parameter
* @returns {Function} A new function that will call the original function with the specified `this` context
*/
function bind(fn, thisArg) {
	return function wrap() {
		return fn.apply(thisArg, arguments);
	};
}
//#endregion
//#region node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var { iterator, toStringTag } = Symbol;
var hasOwnProperty = (({ hasOwnProperty }) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);
/**
* Walk the prototype chain (excluding the shared Object.prototype) looking for
* an own `prop`. This distinguishes genuine own/inherited members — including
* class accessors and template prototypes — from members injected via
* Object.prototype pollution (e.g. `Object.prototype.username = '...'`), which
* live on Object.prototype itself and are therefore never matched.
*
* @param {*} thing The value whose chain to inspect
* @param {string|symbol} prop The property key to look for
*
* @returns {boolean} True when `prop` is owned below Object.prototype
*/
var hasOwnInPrototypeChain = (thing, prop) => {
	let obj = thing;
	const seen = [];
	while (obj != null && obj !== Object.prototype) {
		if (seen.indexOf(obj) !== -1) return false;
		seen.push(obj);
		if (hasOwnProperty(obj, prop)) return true;
		obj = getPrototypeOf(obj);
	}
	return false;
};
/**
* Read `obj[prop]` only when it is safe from Object.prototype pollution. Own
* properties and members inherited from a non-Object.prototype source (a class
* instance or template object) are honored; a value reachable only through a
* polluted Object.prototype is ignored and `undefined` is returned.
*
* @param {*} obj The source object
* @param {string|symbol} prop The property key to read
*
* @returns {*} The resolved value, or undefined when unsafe/absent
*/
var getSafeProp = (obj, prop) => obj != null && hasOwnInPrototypeChain(obj, prop) ? obj[prop] : void 0;
var kindOf = ((cache) => (thing) => {
	const str = toString.call(thing);
	return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
var kindOfTest = (type) => {
	type = type.toLowerCase();
	return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
/**
* Determine if a value is a non-null object
*
* @param {Object} val The value to test
*
* @returns {boolean} True if value is an Array, otherwise false
*/
var { isArray } = Array;
/**
* Determine if a value is undefined
*
* @param {*} val The value to test
*
* @returns {boolean} True if the value is undefined, otherwise false
*/
var isUndefined = typeOfTest("undefined");
/**
* Determine if a value is a Buffer
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Buffer, otherwise false
*/
function isBuffer(val) {
	return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
* Determine if a value is an ArrayBuffer
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is an ArrayBuffer, otherwise false
*/
var isArrayBuffer = kindOfTest("ArrayBuffer");
/**
* Determine if a value is a view on an ArrayBuffer
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
*/
function isArrayBufferView(val) {
	let result;
	if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
	else result = val && val.buffer && isArrayBuffer(val.buffer);
	return result;
}
/**
* Determine if a value is a String
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a String, otherwise false
*/
var isString = typeOfTest("string");
/**
* Determine if a value is a Function
*
* @param {*} val The value to test
* @returns {boolean} True if value is a Function, otherwise false
*/
var isFunction$1 = typeOfTest("function");
/**
* Determine if a value is a Number
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Number, otherwise false
*/
var isNumber = typeOfTest("number");
/**
* Determine if a value is an Object
*
* @param {*} thing The value to test
*
* @returns {boolean} True if value is an Object, otherwise false
*/
var isObject = (thing) => thing !== null && typeof thing === "object";
/**
* Determine if a value is a Boolean
*
* @param {*} thing The value to test
* @returns {boolean} True if value is a Boolean, otherwise false
*/
var isBoolean = (thing) => thing === true || thing === false;
/**
* Determine if a value is a plain Object
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a plain Object, otherwise false
*/
var isPlainObject = (val) => {
	if (!isObject(val)) return false;
	const prototype = getPrototypeOf(val);
	return (prototype === null || prototype === Object.prototype || getPrototypeOf(prototype) === null) && !hasOwnInPrototypeChain(val, toStringTag) && !hasOwnInPrototypeChain(val, iterator);
};
/**
* Determine if a value is an empty object (safely handles Buffers)
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is an empty object, otherwise false
*/
var isEmptyObject = (val) => {
	if (!isObject(val) || isBuffer(val)) return false;
	try {
		return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
	} catch (e) {
		return false;
	}
};
/**
* Determine if a value is a Date
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Date, otherwise false
*/
var isDate = kindOfTest("Date");
/**
* Determine if a value is a File
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a File, otherwise false
*/
var isFile = kindOfTest("File");
/**
* Determine if a value is a React Native Blob
* React Native "blob": an object with a `uri` attribute. Optionally, it can
* also have a `name` and `type` attribute to specify filename and content type
*
* @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
*
* @param {*} value The value to test
*
* @returns {boolean} True if value is a React Native Blob, otherwise false
*/
var isReactNativeBlob = (value) => {
	return !!(value && typeof value.uri !== "undefined");
};
/**
* Determine if environment is React Native
* ReactNative `FormData` has a non-standard `getParts()` method
*
* @param {*} formData The formData to test
*
* @returns {boolean} True if environment is React Native, otherwise false
*/
var isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
/**
* Determine if a value is a Blob
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Blob, otherwise false
*/
var isBlob = kindOfTest("Blob");
/**
* Determine if a value is a FileList
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a FileList, otherwise false
*/
var isFileList = kindOfTest("FileList");
var isSet = kindOfTest("Set");
/**
* Determine if a value is a Stream
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Stream, otherwise false
*/
var isStream = (val) => isObject(val) && isFunction$1(val.pipe);
/**
* Determine if a value is a FormData
*
* @param {*} thing The value to test
*
* @returns {boolean} True if value is an FormData, otherwise false
*/
function getGlobal() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	return {};
}
var G$5 = getGlobal();
var FormDataCtor = typeof G$5.FormData !== "undefined" ? G$5.FormData : void 0;
var isFormData = (thing) => {
	if (!thing) return false;
	if (FormDataCtor && thing instanceof FormDataCtor) return true;
	const proto = getPrototypeOf(thing);
	if (!proto || proto === Object.prototype) return false;
	if (!isFunction$1(thing.append)) return false;
	const kind = kindOf(thing);
	return kind === "formdata" || kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]";
};
/**
* Determine if a value is a URLSearchParams object
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a URLSearchParams object, otherwise false
*/
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(kindOfTest);
/**
* Trim excess whitespace off the beginning and end of a string
*
* @param {String} str The String to trim
*
* @returns {String} The String freed of excess whitespace
*/
var trim = (str) => {
	return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};
/**
* Iterate over an Array or an Object invoking a function for each item.
*
* If `obj` is an Array callback will be called passing
* the value, index, and complete array for each item.
*
* If 'obj' is an Object callback will be called passing
* the value, key, and complete object for each property.
*
* @param {Object|Array<unknown>} obj The object to iterate
* @param {Function} fn The callback to invoke for each item
*
* @param {Object} [options]
* @param {Boolean} [options.allOwnKeys = false]
* @returns {any}
*/
function forEach(obj, fn, { allOwnKeys = false } = {}) {
	if (obj === null || typeof obj === "undefined") return;
	let i;
	let l;
	if (typeof obj !== "object") obj = [obj];
	if (isArray(obj)) for (i = 0, l = obj.length; i < l; i++) fn.call(null, obj[i], i, obj);
	else {
		if (isBuffer(obj)) return;
		const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
		const len = keys.length;
		let key;
		for (i = 0; i < len; i++) {
			key = keys[i];
			fn.call(null, obj[key], key, obj);
		}
	}
}
/**
* Finds a key in an object, case-insensitive, returning the actual key name.
* Returns null if the object is a Buffer or if no match is found.
*
* @param {Object} obj - The object to search.
* @param {string} key - The key to find (case-insensitive).
* @returns {?string} The actual key name if found, otherwise null.
*/
function findKey(obj, key) {
	if (isBuffer(obj)) return null;
	key = key.toLowerCase();
	const keys = Object.keys(obj);
	let i = keys.length;
	let _key;
	while (i-- > 0) {
		_key = keys[i];
		if (key === _key.toLowerCase()) return _key;
	}
	return null;
}
var _global = (() => {
	if (typeof globalThis !== "undefined") return globalThis;
	return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
/**
* Accepts varargs expecting each argument to be an object, then
* immutably merges the properties of each object and returns result.
*
* When multiple objects contain the same key the later object in
* the arguments list will take precedence.
*
* Example:
*
* ```js
* const result = merge({foo: 123}, {foo: 456});
* console.log(result.foo); // outputs 456
* ```
*
* @param {Object} obj1 Object to merge
*
* @returns {Object} Result of all merge properties
*/
function merge(...objs) {
	const { caseless, skipUndefined } = isContextDefined(this) && this || {};
	const result = {};
	const assignValue = (val, key) => {
		if (key === "__proto__" || key === "constructor" || key === "prototype") return;
		const targetKey = caseless && typeof key === "string" && findKey(result, key) || key;
		const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
		if (isPlainObject(existing) && isPlainObject(val)) result[targetKey] = merge(existing, val);
		else if (isPlainObject(val)) result[targetKey] = merge({}, val);
		else if (isArray(val)) result[targetKey] = val.slice();
		else if (!skipUndefined || !isUndefined(val)) result[targetKey] = val;
	};
	for (let i = 0, l = objs.length; i < l; i++) {
		const source = objs[i];
		if (!source || isBuffer(source)) continue;
		forEach(source, assignValue);
		if (typeof source !== "object" || isArray(source)) continue;
		const symbols = Object.getOwnPropertySymbols(source);
		for (let j = 0; j < symbols.length; j++) {
			const symbol = symbols[j];
			if (propertyIsEnumerable.call(source, symbol)) assignValue(source[symbol], symbol);
		}
	}
	return result;
}
/**
* Extends object a by mutably adding to it the properties of object b.
*
* @param {Object} a The object to be extended
* @param {Object} b The object to copy properties from
* @param {Object} thisArg The object to bind function to
*
* @param {Object} [options]
* @param {Boolean} [options.allOwnKeys]
* @returns {Object} The resulting value of object a
*/
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
	forEach(b, (val, key) => {
		if (thisArg && isFunction$1(val)) Object.defineProperty(a, key, {
			__proto__: null,
			value: bind(val, thisArg),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else Object.defineProperty(a, key, {
			__proto__: null,
			value: val,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}, { allOwnKeys });
	return a;
};
/**
* Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
*
* @param {string} content with BOM
*
* @returns {string} content value without BOM
*/
var stripBOM = (content) => {
	if (content.charCodeAt(0) === 65279) content = content.slice(1);
	return content;
};
/**
* Inherit the prototype methods from one constructor into another
* @param {function} constructor
* @param {function} superConstructor
* @param {object} [props]
* @param {object} [descriptors]
*
* @returns {void}
*/
var inherits = (constructor, superConstructor, props, descriptors) => {
	constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	Object.defineProperty(constructor.prototype, "constructor", {
		__proto__: null,
		value: constructor,
		writable: true,
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(constructor, "super", {
		__proto__: null,
		value: superConstructor.prototype
	});
	props && Object.assign(constructor.prototype, props);
};
/**
* Resolve object with deep prototype chain to a flat object
* @param {Object} sourceObj source object
* @param {Object} [destObj]
* @param {Function|Boolean} [filter]
* @param {Function} [propFilter]
*
* @returns {Object}
*/
var toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	let props;
	let i;
	let prop;
	const merged = {};
	destObj = destObj || {};
	if (sourceObj == null) return destObj;
	do {
		props = Object.getOwnPropertyNames(sourceObj);
		i = props.length;
		while (i-- > 0) {
			prop = props[i];
			if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
				destObj[prop] = sourceObj[prop];
				merged[prop] = true;
			}
		}
		sourceObj = filter !== false && getPrototypeOf(sourceObj);
	} while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
	return destObj;
};
/**
* Determines whether a string ends with the characters of a specified string
*
* @param {String} str
* @param {String} searchString
* @param {Number} [position= 0]
*
* @returns {boolean}
*/
var endsWith = (str, searchString, position) => {
	str = String(str);
	if (position === void 0 || position > str.length) position = str.length;
	position -= searchString.length;
	const lastIndex = str.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
};
/**
* Returns new array from array like object or null if failed
*
* @param {*} [thing]
*
* @returns {?Array}
*/
var toArray = (thing) => {
	if (!thing) return null;
	if (isArray(thing)) return thing;
	let i = thing.length;
	if (!isNumber(i)) return null;
	const arr = new Array(i);
	while (i-- > 0) arr[i] = thing[i];
	return arr;
};
/**
* Checking if the Uint8Array exists and if it does, it returns a function that checks if the
* thing passed in is an instance of Uint8Array
*
* @param {TypedArray}
*
* @returns {Array}
*/
var isTypedArray = ((TypedArray) => {
	return (thing) => {
		return TypedArray && thing instanceof TypedArray;
	};
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
/**
* For each entry in the object, call the function with the key and value.
*
* @param {Object<any, any>} obj - The object to iterate over.
* @param {Function} fn - The function to call for each entry.
*
* @returns {void}
*/
var forEachEntry = (obj, fn) => {
	const _iterator = (obj && obj[iterator]).call(obj);
	let result;
	while ((result = _iterator.next()) && !result.done) {
		const pair = result.value;
		fn.call(obj, pair[0], pair[1]);
	}
};
/**
* It takes a regular expression and a string, and returns an array of all the matches
*
* @param {string} regExp - The regular expression to match against.
* @param {string} str - The string to search.
*
* @returns {Array<boolean>}
*/
var matchAll = (regExp, str) => {
	let matches;
	const arr = [];
	while ((matches = regExp.exec(str)) !== null) arr.push(matches);
	return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
	return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
		return p1.toUpperCase() + p2;
	});
};
var { propertyIsEnumerable } = Object.prototype;
/**
* Determine if a value is a RegExp object
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a RegExp object, otherwise false
*/
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
	const descriptors = Object.getOwnPropertyDescriptors(obj);
	const reducedDescriptors = {};
	forEach(descriptors, (descriptor, name) => {
		let ret;
		if ((ret = reducer(descriptor, name, obj)) !== false) reducedDescriptors[name] = ret || descriptor;
	});
	Object.defineProperties(obj, reducedDescriptors);
};
/**
* Makes all methods read-only
* @param {Object} obj
*/
var freezeMethods = (obj) => {
	reduceDescriptors(obj, (descriptor, name) => {
		if (isFunction$1(obj) && [
			"arguments",
			"caller",
			"callee"
		].includes(name)) return false;
		const value = obj[name];
		if (!isFunction$1(value)) return;
		descriptor.enumerable = false;
		if ("writable" in descriptor) {
			descriptor.writable = false;
			return;
		}
		if (!descriptor.set) descriptor.set = () => {
			throw Error("Can not rewrite read-only method '" + name + "'");
		};
	});
};
/**
* Converts an array or a delimited string into an object set with values as keys and true as values.
* Useful for fast membership checks.
*
* @param {Array|string} arrayOrString - The array or string to convert.
* @param {string} delimiter - The delimiter to use if input is a string.
* @returns {Object} An object with keys from the array or string, values set to true.
*/
var toObjectSet = (arrayOrString, delimiter) => {
	const obj = {};
	const define = (arr) => {
		arr.forEach((value) => {
			obj[value] = true;
		});
	};
	isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
	return obj;
};
var noop = () => {};
var toFiniteNumber = (value, defaultValue) => {
	return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
/**
* If the thing is a FormData object, return true, otherwise return false.
*
* @param {unknown} thing - The thing to check.
*
* @returns {boolean}
*/
function isSpecCompliantForm(thing) {
	return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
/**
* Recursively converts an object to a JSON-compatible object, handling circular references and Buffers.
*
* @param {Object} obj - The object to convert.
* @returns {Object} The JSON-compatible object.
*/
var toJSONObject = (obj) => {
	const visited = /* @__PURE__ */ new WeakSet();
	const visit = (source) => {
		if (isObject(source)) {
			if (visited.has(source)) return;
			if (isBuffer(source)) return source;
			if (!("toJSON" in source)) {
				visited.add(source);
				let target;
				if (isSet(source)) {
					target = [];
					for (const value of source) {
						const reducedValue = visit(value);
						!isUndefined(reducedValue) && target.push(reducedValue);
					}
				} else {
					target = isArray(source) ? [] : {};
					forEach(source, (value, key) => {
						const reducedValue = visit(value);
						!isUndefined(reducedValue) && (target[key] = reducedValue);
					});
				}
				visited.delete(source);
				return target;
			}
		}
		return source;
	};
	return visit(obj);
};
/**
* Determines if a value is an async function.
*
* @param {*} thing - The value to test.
* @returns {boolean} True if value is an async function, otherwise false.
*/
var isAsyncFn = kindOfTest("AsyncFunction");
/**
* Determines if a value is thenable (has then and catch methods).
*
* @param {*} thing - The value to test.
* @returns {boolean} True if value is thenable, otherwise false.
*/
var isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
/**
* Provides a cross-platform setImmediate implementation.
* Uses native setImmediate if available, otherwise falls back to postMessage or setTimeout.
*
* @param {boolean} setImmediateSupported - Whether setImmediate is supported.
* @param {boolean} postMessageSupported - Whether postMessage is supported.
* @returns {Function} A function to schedule a callback asynchronously.
*/
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
	if (setImmediateSupported) return setImmediate;
	return postMessageSupported ? ((token, callbacks) => {
		_global.addEventListener("message", ({ source, data }) => {
			if (source === _global && data === token) callbacks.length && callbacks.shift()();
		}, false);
		return (cb) => {
			callbacks.push(cb);
			_global.postMessage(token, "*");
		};
	})(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(typeof setImmediate === "function", isFunction$1(_global.postMessage));
/**
* Schedules a microtask or asynchronous callback as soon as possible.
* Uses queueMicrotask if available, otherwise falls back to process.nextTick or _setImmediate.
*
* @type {Function}
*/
var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
var isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
/**
* Determine if a value is iterable via an iterator that is NOT sourced solely
* from a polluted Object.prototype. Use this instead of `isIterable` whenever
* the iterable comes from untrusted input (e.g. user-supplied header sources),
* so `Object.prototype[Symbol.iterator] = ...` cannot turn an ordinary object
* into an attacker-controlled entries iterator.
*
* @param {*} thing The value to test
*
* @returns {boolean} True if value has a non-polluted iterator
*/
var isSafeIterable = (thing) => thing != null && hasOwnInPrototypeChain(thing, iterator) && isIterable(thing);
var utils_default = {
	isArray,
	isArrayBuffer,
	isBuffer,
	isFormData,
	isArrayBufferView,
	isString,
	isNumber,
	isBoolean,
	isObject,
	isPlainObject,
	isEmptyObject,
	isReadableStream,
	isRequest,
	isResponse,
	isHeaders,
	isUndefined,
	isDate,
	isFile,
	isReactNativeBlob,
	isReactNative,
	isBlob,
	isRegExp,
	isFunction: isFunction$1,
	isStream,
	isURLSearchParams,
	isTypedArray,
	isFileList,
	forEach,
	merge,
	extend,
	trim,
	stripBOM,
	inherits,
	toFlatObject,
	kindOf,
	kindOfTest,
	endsWith,
	toArray,
	forEachEntry,
	matchAll,
	isHTMLForm,
	hasOwnProperty,
	hasOwnProp: hasOwnProperty,
	hasOwnInPrototypeChain,
	getSafeProp,
	reduceDescriptors,
	freezeMethods,
	toObjectSet,
	toCamelCase,
	noop,
	toFiniteNumber,
	findKey,
	global: _global,
	isContextDefined,
	isSpecCompliantForm,
	toJSONObject,
	isAsyncFn,
	isThenable,
	setImmediate: _setImmediate,
	asap,
	isIterable,
	isSafeIterable
};
//#endregion
//#region node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"user-agent"
]);
/**
* Parse headers into an object
*
* ```
* Date: Wed, 27 Aug 2014 08:58:49 GMT
* Content-Type: application/json
* Connection: keep-alive
* Transfer-Encoding: chunked
* ```
*
* @param {String} rawHeaders Headers needing to be parsed
*
* @returns {Object} Headers parsed into an object
*/
var parseHeaders_default = (rawHeaders) => {
	const parsed = {};
	let key;
	let val;
	let i;
	rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
		i = line.indexOf(":");
		key = line.substring(0, i).trim().toLowerCase();
		val = line.substring(i + 1).trim();
		const hasKey = utils_default.hasOwnProp(parsed, key);
		if (!key || hasKey && utils_default.hasOwnProp(ignoreDuplicateOf, key)) return;
		if (key === "set-cookie") {
			if (hasKey) parsed[key].push(val);
			else parsed[key] = [val];
		} else parsed[key] = hasKey ? parsed[key] + ", " + val : val;
	});
	return parsed;
};
//#endregion
//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
function trimSPorHTAB(str) {
	let start = 0;
	let end = str.length;
	while (start < end) {
		const code = str.charCodeAt(start);
		if (code !== 9 && code !== 32) break;
		start += 1;
	}
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 9 && code !== 32) break;
		end -= 1;
	}
	return start === 0 && end === str.length ? str : str.slice(start, end);
}
var INVALID_UNICODE_HEADER_VALUE_CHARS = /* @__PURE__ */ new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g");
var INVALID_BYTE_STRING_HEADER_VALUE_CHARS = /* @__PURE__ */ new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function sanitizeValue(value, invalidChars) {
	if (utils_default.isArray(value)) return value.map((item) => sanitizeValue(item, invalidChars));
	return trimSPorHTAB(String(value).replace(invalidChars, ""));
}
var sanitizeHeaderValue = (value) => sanitizeValue(value, INVALID_UNICODE_HEADER_VALUE_CHARS);
var sanitizeByteStringHeaderValue = (value) => sanitizeValue(value, INVALID_BYTE_STRING_HEADER_VALUE_CHARS);
function toByteStringHeaderObject(headers) {
	const byteStringHeaders = Object.create(null);
	utils_default.forEach(headers.toJSON(), (value, header) => {
		byteStringHeaders[header] = sanitizeByteStringHeaderValue(value);
	});
	return byteStringHeaders;
}
//#endregion
//#region node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
	return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
	if (value === false || value == null) return value;
	return utils_default.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
}
function parseTokens(str) {
	const tokens = Object.create(null);
	const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	let match;
	while (match = tokensRE.exec(str)) tokens[match[1]] = match[2];
	return tokens;
}
var parameterNameRE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
function trimOWS(value) {
	let start = 0;
	let end = value.length;
	while (start < end) {
		const code = value.charCodeAt(start);
		if (code !== 9 && code !== 32) break;
		start += 1;
	}
	while (end > start) {
		const code = value.charCodeAt(end - 1);
		if (code !== 9 && code !== 32) break;
		end -= 1;
	}
	return start === 0 && end === value.length ? value : value.slice(start, end);
}
function decodeQuotedString(value) {
	const last = value.length - 1;
	if (last < 1 || value.charCodeAt(0) !== 34 || value.charCodeAt(last) !== 34) return value;
	let decoded = "";
	for (let i = 1; i < last; i++) {
		const code = value.charCodeAt(i);
		if (code === 34) return value;
		if (code === 92) {
			i += 1;
			if (i >= last) return value;
		}
		decoded += value[i];
	}
	return decoded;
}
function parseParameters(value) {
	const parameters = Object.create(null);
	const str = String(value);
	let start = 0;
	let quoted = false;
	let escaped = false;
	function parseParameter(end) {
		const part = trimOWS(str.slice(start, end));
		const equals = part.indexOf("=");
		if (equals < 1) return;
		const name = trimOWS(part.slice(0, equals));
		if (!parameterNameRE.test(name)) return;
		const normalizedName = name.toLowerCase();
		if (normalizedName === "__proto__" || normalizedName === "constructor" || normalizedName === "prototype") return;
		const parameterValue = trimOWS(part.slice(equals + 1));
		parameters[normalizedName] = decodeQuotedString(parameterValue);
	}
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);
		if (quoted) {
			if (escaped) escaped = false;
			else if (code === 92) escaped = true;
			else if (code === 34) quoted = false;
		} else if (code === 34) quoted = true;
		else if (code === 44 || code === 59) {
			parseParameter(i);
			start = i + 1;
		}
	}
	parseParameter(str.length);
	return parameters;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	if (utils_default.isFunction(filter)) return filter.call(this, value, header);
	if (isHeaderNameFilter) value = header;
	if (!utils_default.isString(value)) return;
	if (utils_default.isString(filter)) return value.indexOf(filter) !== -1;
	if (utils_default.isRegExp(filter)) return filter.test(value);
}
function formatHeader(header) {
	return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
		return char.toUpperCase() + str;
	});
}
function buildAccessors(obj, header) {
	const accessorName = utils_default.toCamelCase(" " + header);
	[
		"get",
		"set",
		"has"
	].forEach((methodName) => {
		Object.defineProperty(obj, methodName + accessorName, {
			__proto__: null,
			value: function(arg1, arg2, arg3) {
				return this[methodName].call(this, header, arg1, arg2, arg3);
			},
			configurable: true
		});
	});
}
var AxiosHeaders = class {
	constructor(headers) {
		headers && this.set(headers);
	}
	set(header, valueOrRewrite, rewrite) {
		const self = this;
		function setHeader(_value, _header, _rewrite) {
			const lHeader = normalizeHeader(_header);
			if (!lHeader) return;
			const key = utils_default.findKey(self, lHeader);
			if (!key || self[key] === void 0 || _rewrite === true || _rewrite === void 0 && self[key] !== false) self[key || _header] = normalizeValue(_value);
		}
		const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
		if (utils_default.isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
		else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders(parseHeaders_default(header), valueOrRewrite);
		else if (utils_default.isObject(header) && utils_default.isSafeIterable(header)) {
			let obj = Object.create(null), dest, key;
			for (const entry of header) {
				if (!utils_default.isArray(entry)) throw new TypeError("Object iterator must return a key-value pair");
				key = entry[0];
				if (utils_default.hasOwnProp(obj, key)) {
					dest = obj[key];
					obj[key] = utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]];
				} else obj[key] = entry[1];
			}
			setHeaders(obj, valueOrRewrite);
		} else header != null && setHeader(valueOrRewrite, header, rewrite);
		return this;
	}
	get(header, parser) {
		header = normalizeHeader(header);
		if (header) {
			const key = utils_default.findKey(this, header);
			if (key) {
				const value = this[key];
				if (!parser) return value;
				if (parser === true) return parseTokens(value);
				if (utils_default.isFunction(parser)) return parser.call(this, value, key);
				if (utils_default.isRegExp(parser)) return parser.exec(value);
				throw new TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(header, matcher) {
		header = normalizeHeader(header);
		if (header) {
			const key = utils_default.findKey(this, header);
			return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
		}
		return false;
	}
	delete(header, matcher) {
		const self = this;
		let deleted = false;
		function deleteHeader(_header) {
			_header = normalizeHeader(_header);
			if (_header) {
				const key = utils_default.findKey(self, _header);
				if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
					delete self[key];
					deleted = true;
				}
			}
		}
		if (utils_default.isArray(header)) header.forEach(deleteHeader);
		else deleteHeader(header);
		return deleted;
	}
	clear(matcher) {
		const keys = Object.keys(this);
		let i = keys.length;
		let deleted = false;
		while (i--) {
			const key = keys[i];
			if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
				delete this[key];
				deleted = true;
			}
		}
		return deleted;
	}
	normalize(format) {
		const self = this;
		const headers = {};
		utils_default.forEach(this, (value, header) => {
			const key = utils_default.findKey(headers, header);
			if (key) {
				self[key] = normalizeValue(value);
				delete self[header];
				return;
			}
			const normalized = format ? formatHeader(header) : String(header).trim();
			if (normalized !== header) delete self[header];
			self[normalized] = normalizeValue(value);
			headers[normalized] = true;
		});
		return this;
	}
	concat(...targets) {
		return this.constructor.concat(this, ...targets);
	}
	toJSON(asStrings) {
		const obj = Object.create(null);
		utils_default.forEach(this, (value, header) => {
			value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
		});
		return obj;
	}
	[Symbol.iterator]() {
		return Object.entries(this.toJSON())[Symbol.iterator]();
	}
	toString() {
		return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
	}
	getSetCookie() {
		const value = this.get("set-cookie");
		return utils_default.isArray(value) ? value : value == null || value === false ? [] : [value];
	}
	get [Symbol.toStringTag]() {
		return "AxiosHeaders";
	}
	static from(thing) {
		return thing instanceof this ? thing : new this(thing);
	}
	static parseParameters(value) {
		return parseParameters(value);
	}
	static concat(first, ...targets) {
		const computed = new this(first);
		targets.forEach((target) => computed.set(target));
		return computed;
	}
	static accessor(header) {
		const accessors = (this[$internals] = this[$internals] = { accessors: {} }).accessors;
		const prototype = this.prototype;
		function defineAccessor(_header) {
			const lHeader = normalizeHeader(_header);
			if (!accessors[lHeader]) {
				buildAccessors(prototype, _header);
				accessors[lHeader] = true;
			}
		}
		utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
		return this;
	}
};
AxiosHeaders.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
	let mapped = key[0].toUpperCase() + key.slice(1);
	return {
		get: () => value,
		set(headerValue) {
			this[mapped] = headerValue;
		}
	};
});
utils_default.freezeMethods(AxiosHeaders);
//#endregion
//#region node_modules/axios/lib/core/AxiosError.js
var REDACTED = "[REDACTED ****]";
function hasOwnOrPrototypeToJSON(source) {
	if (utils_default.hasOwnProp(source, "toJSON")) return true;
	let prototype = Object.getPrototypeOf(source);
	while (prototype && prototype !== Object.prototype) {
		if (utils_default.hasOwnProp(prototype, "toJSON")) return true;
		prototype = Object.getPrototypeOf(prototype);
	}
	return false;
}
function redactConfig(config, redactKeys) {
	const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
	const seen = [];
	const visit = (source) => {
		if (source === null || typeof source !== "object") return source;
		if (utils_default.isBuffer(source)) return source;
		if (seen.indexOf(source) !== -1) return void 0;
		if (source instanceof AxiosHeaders) source = source.toJSON();
		seen.push(source);
		let result;
		if (utils_default.isArray(source)) {
			result = [];
			source.forEach((v, i) => {
				const reducedValue = visit(v);
				if (!utils_default.isUndefined(reducedValue)) result[i] = reducedValue;
			});
		} else {
			if (!utils_default.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
				seen.pop();
				return source;
			}
			result = Object.create(null);
			for (const [key, value] of Object.entries(source)) {
				const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
				if (!utils_default.isUndefined(reducedValue)) result[key] = reducedValue;
			}
		}
		seen.pop();
		return result;
	};
	return visit(config);
}
function stringifySafely$1(value) {
	try {
		return String(value);
	} catch (err) {
		return "";
	}
}
function aggregateErrorMessage(error) {
	return error.errors.map((entry) => {
		try {
			return entry && entry.message ? stringifySafely$1(entry.message) : stringifySafely$1(entry);
		} catch (err) {
			return "";
		}
	}).filter(Boolean).join("; ") || error.name || "AggregateError";
}
var AxiosError = class AxiosError extends Error {
	static from(error, code, config, request, response, customProps) {
		let message = error.message;
		if (!message && utils_default.isArray(error.errors) && error.errors.length) message = aggregateErrorMessage(error);
		const axiosError = new AxiosError(message, code || error.code, config, request, response);
		Object.defineProperty(axiosError, "cause", {
			__proto__: null,
			value: error,
			writable: true,
			enumerable: false,
			configurable: true
		});
		axiosError.name = error.name;
		if (error.status != null && axiosError.status == null) axiosError.status = error.status;
		customProps && Object.assign(axiosError, customProps);
		return axiosError;
	}
	/**
	* Create an Error with the specified message, config, error code, request and response.
	*
	* @param {string} message The error message.
	* @param {string} [code] The error code (for example, 'ECONNABORTED').
	* @param {Object} [config] The config.
	* @param {Object} [request] The request.
	* @param {Object} [response] The response.
	*
	* @returns {Error} The created error.
	*/
	constructor(message, code, config, request, response) {
		super(message);
		Object.defineProperty(this, "message", {
			__proto__: null,
			value: message,
			enumerable: true,
			writable: true,
			configurable: true
		});
		this.name = "AxiosError";
		this.isAxiosError = true;
		code && (this.code = code);
		config && (this.config = config);
		request && (this.request = request);
		if (response) {
			this.response = response;
			this.status = response.status;
		}
	}
	toJSON() {
		const config = this.config;
		const redactKeys = config && utils_default.hasOwnProp(config, "redact") ? config.redact : void 0;
		const serializedConfig = utils_default.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config, redactKeys) : utils_default.toJSONObject(config);
		return {
			message: this.message,
			name: this.name,
			description: this.description,
			number: this.number,
			fileName: this.fileName,
			lineNumber: this.lineNumber,
			columnNumber: this.columnNumber,
			stack: this.stack,
			config: serializedConfig,
			code: this.code,
			status: this.status
		};
	}
};
AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
AxiosError.ECONNABORTED = "ECONNABORTED";
AxiosError.ETIMEDOUT = "ETIMEDOUT";
AxiosError.ECONNREFUSED = "ECONNREFUSED";
AxiosError.ERR_NETWORK = "ERR_NETWORK";
AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
AxiosError.ERR_CANCELED = "ERR_CANCELED";
AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
//#endregion
//#region node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stream$2 = __require("stream").Stream;
	var util$4 = __require("util");
	module.exports = DelayedStream;
	function DelayedStream() {
		this.source = null;
		this.dataSize = 0;
		this.maxDataSize = 1048576;
		this.pauseStream = true;
		this._maxDataSizeExceeded = false;
		this._released = false;
		this._bufferedEvents = [];
	}
	util$4.inherits(DelayedStream, Stream$2);
	DelayedStream.create = function(source, options) {
		var delayedStream = new this();
		options = options || {};
		for (var option in options) delayedStream[option] = options[option];
		delayedStream.source = source;
		var realEmit = source.emit;
		source.emit = function() {
			delayedStream._handleEmit(arguments);
			return realEmit.apply(source, arguments);
		};
		source.on("error", function() {});
		if (delayedStream.pauseStream) source.pause();
		return delayedStream;
	};
	Object.defineProperty(DelayedStream.prototype, "readable", {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.source.readable;
		}
	});
	DelayedStream.prototype.setEncoding = function() {
		return this.source.setEncoding.apply(this.source, arguments);
	};
	DelayedStream.prototype.resume = function() {
		if (!this._released) this.release();
		this.source.resume();
	};
	DelayedStream.prototype.pause = function() {
		this.source.pause();
	};
	DelayedStream.prototype.release = function() {
		this._released = true;
		this._bufferedEvents.forEach(function(args) {
			this.emit.apply(this, args);
		}.bind(this));
		this._bufferedEvents = [];
	};
	DelayedStream.prototype.pipe = function() {
		var r = Stream$2.prototype.pipe.apply(this, arguments);
		this.resume();
		return r;
	};
	DelayedStream.prototype._handleEmit = function(args) {
		if (this._released) {
			this.emit.apply(this, args);
			return;
		}
		if (args[0] === "data") {
			this.dataSize += args[1].length;
			this._checkIfMaxDataSizeExceeded();
		}
		this._bufferedEvents.push(args);
	};
	DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
		if (this._maxDataSizeExceeded) return;
		if (this.dataSize <= this.maxDataSize) return;
		this._maxDataSizeExceeded = true;
		var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
		this.emit("error", new Error(message));
	};
}));
//#endregion
//#region node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util$3 = __require("util");
	var Stream$1 = __require("stream").Stream;
	var DelayedStream = require_delayed_stream();
	module.exports = CombinedStream;
	function CombinedStream() {
		this.writable = false;
		this.readable = true;
		this.dataSize = 0;
		this.maxDataSize = 2097152;
		this.pauseStreams = true;
		this._released = false;
		this._streams = [];
		this._currentStream = null;
		this._insideLoop = false;
		this._pendingNext = false;
	}
	util$3.inherits(CombinedStream, Stream$1);
	CombinedStream.create = function(options) {
		var combinedStream = new this();
		options = options || {};
		for (var option in options) combinedStream[option] = options[option];
		return combinedStream;
	};
	CombinedStream.isStreamLike = function(stream) {
		return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
	};
	CombinedStream.prototype.append = function(stream) {
		if (CombinedStream.isStreamLike(stream)) {
			if (!(stream instanceof DelayedStream)) {
				var newStream = DelayedStream.create(stream, {
					maxDataSize: Infinity,
					pauseStream: this.pauseStreams
				});
				stream.on("data", this._checkDataSize.bind(this));
				stream = newStream;
			}
			this._handleErrors(stream);
			if (this.pauseStreams) stream.pause();
		}
		this._streams.push(stream);
		return this;
	};
	CombinedStream.prototype.pipe = function(dest, options) {
		Stream$1.prototype.pipe.call(this, dest, options);
		this.resume();
		return dest;
	};
	CombinedStream.prototype._getNext = function() {
		this._currentStream = null;
		if (this._insideLoop) {
			this._pendingNext = true;
			return;
		}
		this._insideLoop = true;
		try {
			do {
				this._pendingNext = false;
				this._realGetNext();
			} while (this._pendingNext);
		} finally {
			this._insideLoop = false;
		}
	};
	CombinedStream.prototype._realGetNext = function() {
		var stream = this._streams.shift();
		if (typeof stream == "undefined") {
			this.end();
			return;
		}
		if (typeof stream !== "function") {
			this._pipeNext(stream);
			return;
		}
		stream(function(stream) {
			if (CombinedStream.isStreamLike(stream)) {
				stream.on("data", this._checkDataSize.bind(this));
				this._handleErrors(stream);
			}
			this._pipeNext(stream);
		}.bind(this));
	};
	CombinedStream.prototype._pipeNext = function(stream) {
		this._currentStream = stream;
		if (CombinedStream.isStreamLike(stream)) {
			stream.on("end", this._getNext.bind(this));
			stream.pipe(this, { end: false });
			return;
		}
		var value = stream;
		this.write(value);
		this._getNext();
	};
	CombinedStream.prototype._handleErrors = function(stream) {
		var self = this;
		stream.on("error", function(err) {
			self._emitError(err);
		});
	};
	CombinedStream.prototype.write = function(data) {
		this.emit("data", data);
	};
	CombinedStream.prototype.pause = function() {
		if (!this.pauseStreams) return;
		if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
		this.emit("pause");
	};
	CombinedStream.prototype.resume = function() {
		if (!this._released) {
			this._released = true;
			this.writable = true;
			this._getNext();
		}
		if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
		this.emit("resume");
	};
	CombinedStream.prototype.end = function() {
		this._reset();
		this.emit("end");
	};
	CombinedStream.prototype.destroy = function() {
		this._reset();
		this.emit("close");
	};
	CombinedStream.prototype._reset = function() {
		this.writable = false;
		this._streams = [];
		this._currentStream = null;
	};
	CombinedStream.prototype._checkDataSize = function() {
		this._updateDataSize();
		if (this.dataSize <= this.maxDataSize) return;
		var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
		this._emitError(new Error(message));
	};
	CombinedStream.prototype._updateDataSize = function() {
		this.dataSize = 0;
		var self = this;
		this._streams.forEach(function(stream) {
			if (!stream.dataSize) return;
			self.dataSize += stream.dataSize;
		});
		if (this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize;
	};
	CombinedStream.prototype._emitError = function(err) {
		this._reset();
		this.emit("error", err);
	};
}));
//#endregion
//#region node_modules/mime-db/db.json
var db_exports = /* @__PURE__ */ __exportAll({ default: () => db_default });
var db_default;
var init_db = __esmMin((() => {
	db_default = {
		"application/1d-interleaved-parityfec": { "source": "iana" },
		"application/3gpdash-qoe-report+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/3gpp-ims+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/3gpphal+json": {
			"source": "iana",
			"compressible": true
		},
		"application/3gpphalforms+json": {
			"source": "iana",
			"compressible": true
		},
		"application/a2l": { "source": "iana" },
		"application/ace+cbor": { "source": "iana" },
		"application/activemessage": { "source": "iana" },
		"application/activity+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-costmap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-costmapfilter+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-directory+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointcost+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointcostparams+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointprop+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointpropparams+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-error+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-networkmap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-networkmapfilter+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-updatestreamcontrol+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-updatestreamparams+json": {
			"source": "iana",
			"compressible": true
		},
		"application/aml": { "source": "iana" },
		"application/andrew-inset": {
			"source": "iana",
			"extensions": ["ez"]
		},
		"application/applefile": { "source": "iana" },
		"application/applixware": {
			"source": "apache",
			"extensions": ["aw"]
		},
		"application/at+jwt": { "source": "iana" },
		"application/atf": { "source": "iana" },
		"application/atfx": { "source": "iana" },
		"application/atom+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atom"]
		},
		"application/atomcat+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atomcat"]
		},
		"application/atomdeleted+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atomdeleted"]
		},
		"application/atomicmail": { "source": "iana" },
		"application/atomsvc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atomsvc"]
		},
		"application/atsc-dwd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dwd"]
		},
		"application/atsc-dynamic-event-message": { "source": "iana" },
		"application/atsc-held+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["held"]
		},
		"application/atsc-rdt+json": {
			"source": "iana",
			"compressible": true
		},
		"application/atsc-rsat+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rsat"]
		},
		"application/atxml": { "source": "iana" },
		"application/auth-policy+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/bacnet-xdd+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/batch-smtp": { "source": "iana" },
		"application/bdoc": {
			"compressible": false,
			"extensions": ["bdoc"]
		},
		"application/beep+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/calendar+json": {
			"source": "iana",
			"compressible": true
		},
		"application/calendar+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xcs"]
		},
		"application/call-completion": { "source": "iana" },
		"application/cals-1840": { "source": "iana" },
		"application/captive+json": {
			"source": "iana",
			"compressible": true
		},
		"application/cbor": { "source": "iana" },
		"application/cbor-seq": { "source": "iana" },
		"application/cccex": { "source": "iana" },
		"application/ccmp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ccxml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ccxml"]
		},
		"application/cdfx+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["cdfx"]
		},
		"application/cdmi-capability": {
			"source": "iana",
			"extensions": ["cdmia"]
		},
		"application/cdmi-container": {
			"source": "iana",
			"extensions": ["cdmic"]
		},
		"application/cdmi-domain": {
			"source": "iana",
			"extensions": ["cdmid"]
		},
		"application/cdmi-object": {
			"source": "iana",
			"extensions": ["cdmio"]
		},
		"application/cdmi-queue": {
			"source": "iana",
			"extensions": ["cdmiq"]
		},
		"application/cdni": { "source": "iana" },
		"application/cea": { "source": "iana" },
		"application/cea-2018+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cellml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cfw": { "source": "iana" },
		"application/city+json": {
			"source": "iana",
			"compressible": true
		},
		"application/clr": { "source": "iana" },
		"application/clue+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/clue_info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cms": { "source": "iana" },
		"application/cnrp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/coap-group+json": {
			"source": "iana",
			"compressible": true
		},
		"application/coap-payload": { "source": "iana" },
		"application/commonground": { "source": "iana" },
		"application/conference-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cose": { "source": "iana" },
		"application/cose-key": { "source": "iana" },
		"application/cose-key-set": { "source": "iana" },
		"application/cpl+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["cpl"]
		},
		"application/csrattrs": { "source": "iana" },
		"application/csta+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cstadata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/csvm+json": {
			"source": "iana",
			"compressible": true
		},
		"application/cu-seeme": {
			"source": "apache",
			"extensions": ["cu"]
		},
		"application/cwt": { "source": "iana" },
		"application/cybercash": { "source": "iana" },
		"application/dart": { "compressible": true },
		"application/dash+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpd"]
		},
		"application/dash-patch+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpp"]
		},
		"application/dashdelta": { "source": "iana" },
		"application/davmount+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["davmount"]
		},
		"application/dca-rft": { "source": "iana" },
		"application/dcd": { "source": "iana" },
		"application/dec-dx": { "source": "iana" },
		"application/dialog-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/dicom": { "source": "iana" },
		"application/dicom+json": {
			"source": "iana",
			"compressible": true
		},
		"application/dicom+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/dii": { "source": "iana" },
		"application/dit": { "source": "iana" },
		"application/dns": { "source": "iana" },
		"application/dns+json": {
			"source": "iana",
			"compressible": true
		},
		"application/dns-message": { "source": "iana" },
		"application/docbook+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["dbk"]
		},
		"application/dots+cbor": { "source": "iana" },
		"application/dskpp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/dssc+der": {
			"source": "iana",
			"extensions": ["dssc"]
		},
		"application/dssc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xdssc"]
		},
		"application/dvcs": { "source": "iana" },
		"application/ecmascript": {
			"source": "iana",
			"compressible": true,
			"extensions": ["es", "ecma"]
		},
		"application/edi-consent": { "source": "iana" },
		"application/edi-x12": {
			"source": "iana",
			"compressible": false
		},
		"application/edifact": {
			"source": "iana",
			"compressible": false
		},
		"application/efi": { "source": "iana" },
		"application/elm+json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/elm+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.cap+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/emergencycalldata.comment+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.control+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.deviceinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.ecall.msd": { "source": "iana" },
		"application/emergencycalldata.providerinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.serviceinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.subscriberinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.veds+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emma+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["emma"]
		},
		"application/emotionml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["emotionml"]
		},
		"application/encaprtp": { "source": "iana" },
		"application/epp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/epub+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["epub"]
		},
		"application/eshop": { "source": "iana" },
		"application/exi": {
			"source": "iana",
			"extensions": ["exi"]
		},
		"application/expect-ct-report+json": {
			"source": "iana",
			"compressible": true
		},
		"application/express": {
			"source": "iana",
			"extensions": ["exp"]
		},
		"application/fastinfoset": { "source": "iana" },
		"application/fastsoap": { "source": "iana" },
		"application/fdt+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["fdt"]
		},
		"application/fhir+json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/fhir+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/fido.trusted-apps+json": { "compressible": true },
		"application/fits": { "source": "iana" },
		"application/flexfec": { "source": "iana" },
		"application/font-sfnt": { "source": "iana" },
		"application/font-tdpfr": {
			"source": "iana",
			"extensions": ["pfr"]
		},
		"application/font-woff": {
			"source": "iana",
			"compressible": false
		},
		"application/framework-attributes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/geo+json": {
			"source": "iana",
			"compressible": true,
			"extensions": ["geojson"]
		},
		"application/geo+json-seq": { "source": "iana" },
		"application/geopackage+sqlite3": { "source": "iana" },
		"application/geoxacml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/gltf-buffer": { "source": "iana" },
		"application/gml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["gml"]
		},
		"application/gpx+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["gpx"]
		},
		"application/gxf": {
			"source": "apache",
			"extensions": ["gxf"]
		},
		"application/gzip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["gz"]
		},
		"application/h224": { "source": "iana" },
		"application/held+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/hjson": { "extensions": ["hjson"] },
		"application/http": { "source": "iana" },
		"application/hyperstudio": {
			"source": "iana",
			"extensions": ["stk"]
		},
		"application/ibe-key-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ibe-pkg-reply+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ibe-pp-data": { "source": "iana" },
		"application/iges": { "source": "iana" },
		"application/im-iscomposing+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/index": { "source": "iana" },
		"application/index.cmd": { "source": "iana" },
		"application/index.obj": { "source": "iana" },
		"application/index.response": { "source": "iana" },
		"application/index.vnd": { "source": "iana" },
		"application/inkml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ink", "inkml"]
		},
		"application/iotp": { "source": "iana" },
		"application/ipfix": {
			"source": "iana",
			"extensions": ["ipfix"]
		},
		"application/ipp": { "source": "iana" },
		"application/isup": { "source": "iana" },
		"application/its+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["its"]
		},
		"application/java-archive": {
			"source": "apache",
			"compressible": false,
			"extensions": [
				"jar",
				"war",
				"ear"
			]
		},
		"application/java-serialized-object": {
			"source": "apache",
			"compressible": false,
			"extensions": ["ser"]
		},
		"application/java-vm": {
			"source": "apache",
			"compressible": false,
			"extensions": ["class"]
		},
		"application/javascript": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["js", "mjs"]
		},
		"application/jf2feed+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jose": { "source": "iana" },
		"application/jose+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jrd+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jscalendar+json": {
			"source": "iana",
			"compressible": true
		},
		"application/json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["json", "map"]
		},
		"application/json-patch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/json-seq": { "source": "iana" },
		"application/json5": { "extensions": ["json5"] },
		"application/jsonml+json": {
			"source": "apache",
			"compressible": true,
			"extensions": ["jsonml"]
		},
		"application/jwk+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jwk-set+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jwt": { "source": "iana" },
		"application/kpml-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/kpml-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ld+json": {
			"source": "iana",
			"compressible": true,
			"extensions": ["jsonld"]
		},
		"application/lgr+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lgr"]
		},
		"application/link-format": { "source": "iana" },
		"application/load-control+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/lost+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lostxml"]
		},
		"application/lostsync+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/lpf+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/lxf": { "source": "iana" },
		"application/mac-binhex40": {
			"source": "iana",
			"extensions": ["hqx"]
		},
		"application/mac-compactpro": {
			"source": "apache",
			"extensions": ["cpt"]
		},
		"application/macwriteii": { "source": "iana" },
		"application/mads+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mads"]
		},
		"application/manifest+json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["webmanifest"]
		},
		"application/marc": {
			"source": "iana",
			"extensions": ["mrc"]
		},
		"application/marcxml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mrcx"]
		},
		"application/mathematica": {
			"source": "iana",
			"extensions": [
				"ma",
				"nb",
				"mb"
			]
		},
		"application/mathml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mathml"]
		},
		"application/mathml-content+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mathml-presentation+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-associated-procedure-description+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-deregister+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-envelope+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-msk+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-msk-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-protection-description+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-reception-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-register+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-register-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-schedule+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-user-service-description+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbox": {
			"source": "iana",
			"extensions": ["mbox"]
		},
		"application/media-policy-dataset+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpf"]
		},
		"application/media_control+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mediaservercontrol+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mscml"]
		},
		"application/merge-patch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/metalink+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["metalink"]
		},
		"application/metalink4+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["meta4"]
		},
		"application/mets+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mets"]
		},
		"application/mf4": { "source": "iana" },
		"application/mikey": { "source": "iana" },
		"application/mipc": { "source": "iana" },
		"application/missing-blocks+cbor-seq": { "source": "iana" },
		"application/mmt-aei+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["maei"]
		},
		"application/mmt-usd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["musd"]
		},
		"application/mods+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mods"]
		},
		"application/moss-keys": { "source": "iana" },
		"application/moss-signature": { "source": "iana" },
		"application/mosskey-data": { "source": "iana" },
		"application/mosskey-request": { "source": "iana" },
		"application/mp21": {
			"source": "iana",
			"extensions": ["m21", "mp21"]
		},
		"application/mp4": {
			"source": "iana",
			"extensions": ["mp4s", "m4p"]
		},
		"application/mpeg4-generic": { "source": "iana" },
		"application/mpeg4-iod": { "source": "iana" },
		"application/mpeg4-iod-xmt": { "source": "iana" },
		"application/mrb-consumer+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mrb-publish+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/msc-ivr+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/msc-mixer+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/msword": {
			"source": "iana",
			"compressible": false,
			"extensions": ["doc", "dot"]
		},
		"application/mud+json": {
			"source": "iana",
			"compressible": true
		},
		"application/multipart-core": { "source": "iana" },
		"application/mxf": {
			"source": "iana",
			"extensions": ["mxf"]
		},
		"application/n-quads": {
			"source": "iana",
			"extensions": ["nq"]
		},
		"application/n-triples": {
			"source": "iana",
			"extensions": ["nt"]
		},
		"application/nasdata": { "source": "iana" },
		"application/news-checkgroups": {
			"source": "iana",
			"charset": "US-ASCII"
		},
		"application/news-groupinfo": {
			"source": "iana",
			"charset": "US-ASCII"
		},
		"application/news-transmission": { "source": "iana" },
		"application/nlsml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/node": {
			"source": "iana",
			"extensions": ["cjs"]
		},
		"application/nss": { "source": "iana" },
		"application/oauth-authz-req+jwt": { "source": "iana" },
		"application/oblivious-dns-message": { "source": "iana" },
		"application/ocsp-request": { "source": "iana" },
		"application/ocsp-response": { "source": "iana" },
		"application/octet-stream": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"bin",
				"dms",
				"lrf",
				"mar",
				"so",
				"dist",
				"distz",
				"pkg",
				"bpk",
				"dump",
				"elc",
				"deploy",
				"exe",
				"dll",
				"deb",
				"dmg",
				"iso",
				"img",
				"msi",
				"msp",
				"msm",
				"buffer"
			]
		},
		"application/oda": {
			"source": "iana",
			"extensions": ["oda"]
		},
		"application/odm+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/odx": { "source": "iana" },
		"application/oebps-package+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["opf"]
		},
		"application/ogg": {
			"source": "iana",
			"compressible": false,
			"extensions": ["ogx"]
		},
		"application/omdoc+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["omdoc"]
		},
		"application/onenote": {
			"source": "apache",
			"extensions": [
				"onetoc",
				"onetoc2",
				"onetmp",
				"onepkg"
			]
		},
		"application/opc-nodeset+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/oscore": { "source": "iana" },
		"application/oxps": {
			"source": "iana",
			"extensions": ["oxps"]
		},
		"application/p21": { "source": "iana" },
		"application/p21+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/p2p-overlay+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["relo"]
		},
		"application/parityfec": { "source": "iana" },
		"application/passport": { "source": "iana" },
		"application/patch-ops-error+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xer"]
		},
		"application/pdf": {
			"source": "iana",
			"compressible": false,
			"extensions": ["pdf"]
		},
		"application/pdx": { "source": "iana" },
		"application/pem-certificate-chain": { "source": "iana" },
		"application/pgp-encrypted": {
			"source": "iana",
			"compressible": false,
			"extensions": ["pgp"]
		},
		"application/pgp-keys": {
			"source": "iana",
			"extensions": ["asc"]
		},
		"application/pgp-signature": {
			"source": "iana",
			"extensions": ["asc", "sig"]
		},
		"application/pics-rules": {
			"source": "apache",
			"extensions": ["prf"]
		},
		"application/pidf+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/pidf-diff+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/pkcs10": {
			"source": "iana",
			"extensions": ["p10"]
		},
		"application/pkcs12": { "source": "iana" },
		"application/pkcs7-mime": {
			"source": "iana",
			"extensions": ["p7m", "p7c"]
		},
		"application/pkcs7-signature": {
			"source": "iana",
			"extensions": ["p7s"]
		},
		"application/pkcs8": {
			"source": "iana",
			"extensions": ["p8"]
		},
		"application/pkcs8-encrypted": { "source": "iana" },
		"application/pkix-attr-cert": {
			"source": "iana",
			"extensions": ["ac"]
		},
		"application/pkix-cert": {
			"source": "iana",
			"extensions": ["cer"]
		},
		"application/pkix-crl": {
			"source": "iana",
			"extensions": ["crl"]
		},
		"application/pkix-pkipath": {
			"source": "iana",
			"extensions": ["pkipath"]
		},
		"application/pkixcmp": {
			"source": "iana",
			"extensions": ["pki"]
		},
		"application/pls+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["pls"]
		},
		"application/poc-settings+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/postscript": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"ai",
				"eps",
				"ps"
			]
		},
		"application/ppsp-tracker+json": {
			"source": "iana",
			"compressible": true
		},
		"application/problem+json": {
			"source": "iana",
			"compressible": true
		},
		"application/problem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/provenance+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["provx"]
		},
		"application/prs.alvestrand.titrax-sheet": { "source": "iana" },
		"application/prs.cww": {
			"source": "iana",
			"extensions": ["cww"]
		},
		"application/prs.cyn": {
			"source": "iana",
			"charset": "7-BIT"
		},
		"application/prs.hpub+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/prs.nprend": { "source": "iana" },
		"application/prs.plucker": { "source": "iana" },
		"application/prs.rdf-xml-crypt": { "source": "iana" },
		"application/prs.xsf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/pskc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["pskcxml"]
		},
		"application/pvd+json": {
			"source": "iana",
			"compressible": true
		},
		"application/qsig": { "source": "iana" },
		"application/raml+yaml": {
			"compressible": true,
			"extensions": ["raml"]
		},
		"application/raptorfec": { "source": "iana" },
		"application/rdap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/rdf+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rdf", "owl"]
		},
		"application/reginfo+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rif"]
		},
		"application/relax-ng-compact-syntax": {
			"source": "iana",
			"extensions": ["rnc"]
		},
		"application/remote-printing": { "source": "iana" },
		"application/reputon+json": {
			"source": "iana",
			"compressible": true
		},
		"application/resource-lists+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rl"]
		},
		"application/resource-lists-diff+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rld"]
		},
		"application/rfc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/riscos": { "source": "iana" },
		"application/rlmi+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/rls-services+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rs"]
		},
		"application/route-apd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rapd"]
		},
		"application/route-s-tsid+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sls"]
		},
		"application/route-usd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rusd"]
		},
		"application/rpki-ghostbusters": {
			"source": "iana",
			"extensions": ["gbr"]
		},
		"application/rpki-manifest": {
			"source": "iana",
			"extensions": ["mft"]
		},
		"application/rpki-publication": { "source": "iana" },
		"application/rpki-roa": {
			"source": "iana",
			"extensions": ["roa"]
		},
		"application/rpki-updown": { "source": "iana" },
		"application/rsd+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["rsd"]
		},
		"application/rss+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["rss"]
		},
		"application/rtf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rtf"]
		},
		"application/rtploopback": { "source": "iana" },
		"application/rtx": { "source": "iana" },
		"application/samlassertion+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/samlmetadata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sarif+json": {
			"source": "iana",
			"compressible": true
		},
		"application/sarif-external-properties+json": {
			"source": "iana",
			"compressible": true
		},
		"application/sbe": { "source": "iana" },
		"application/sbml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sbml"]
		},
		"application/scaip+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/scim+json": {
			"source": "iana",
			"compressible": true
		},
		"application/scvp-cv-request": {
			"source": "iana",
			"extensions": ["scq"]
		},
		"application/scvp-cv-response": {
			"source": "iana",
			"extensions": ["scs"]
		},
		"application/scvp-vp-request": {
			"source": "iana",
			"extensions": ["spq"]
		},
		"application/scvp-vp-response": {
			"source": "iana",
			"extensions": ["spp"]
		},
		"application/sdp": {
			"source": "iana",
			"extensions": ["sdp"]
		},
		"application/secevent+jwt": { "source": "iana" },
		"application/senml+cbor": { "source": "iana" },
		"application/senml+json": {
			"source": "iana",
			"compressible": true
		},
		"application/senml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["senmlx"]
		},
		"application/senml-etch+cbor": { "source": "iana" },
		"application/senml-etch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/senml-exi": { "source": "iana" },
		"application/sensml+cbor": { "source": "iana" },
		"application/sensml+json": {
			"source": "iana",
			"compressible": true
		},
		"application/sensml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sensmlx"]
		},
		"application/sensml-exi": { "source": "iana" },
		"application/sep+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sep-exi": { "source": "iana" },
		"application/session-info": { "source": "iana" },
		"application/set-payment": { "source": "iana" },
		"application/set-payment-initiation": {
			"source": "iana",
			"extensions": ["setpay"]
		},
		"application/set-registration": { "source": "iana" },
		"application/set-registration-initiation": {
			"source": "iana",
			"extensions": ["setreg"]
		},
		"application/sgml": { "source": "iana" },
		"application/sgml-open-catalog": { "source": "iana" },
		"application/shf+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["shf"]
		},
		"application/sieve": {
			"source": "iana",
			"extensions": ["siv", "sieve"]
		},
		"application/simple-filter+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/simple-message-summary": { "source": "iana" },
		"application/simplesymbolcontainer": { "source": "iana" },
		"application/sipc": { "source": "iana" },
		"application/slate": { "source": "iana" },
		"application/smil": { "source": "iana" },
		"application/smil+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["smi", "smil"]
		},
		"application/smpte336m": { "source": "iana" },
		"application/soap+fastinfoset": { "source": "iana" },
		"application/soap+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sparql-query": {
			"source": "iana",
			"extensions": ["rq"]
		},
		"application/sparql-results+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["srx"]
		},
		"application/spdx+json": {
			"source": "iana",
			"compressible": true
		},
		"application/spirits-event+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sql": { "source": "iana" },
		"application/srgs": {
			"source": "iana",
			"extensions": ["gram"]
		},
		"application/srgs+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["grxml"]
		},
		"application/sru+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sru"]
		},
		"application/ssdl+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["ssdl"]
		},
		"application/ssml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ssml"]
		},
		"application/stix+json": {
			"source": "iana",
			"compressible": true
		},
		"application/swid+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["swidtag"]
		},
		"application/tamp-apex-update": { "source": "iana" },
		"application/tamp-apex-update-confirm": { "source": "iana" },
		"application/tamp-community-update": { "source": "iana" },
		"application/tamp-community-update-confirm": { "source": "iana" },
		"application/tamp-error": { "source": "iana" },
		"application/tamp-sequence-adjust": { "source": "iana" },
		"application/tamp-sequence-adjust-confirm": { "source": "iana" },
		"application/tamp-status-query": { "source": "iana" },
		"application/tamp-status-response": { "source": "iana" },
		"application/tamp-update": { "source": "iana" },
		"application/tamp-update-confirm": { "source": "iana" },
		"application/tar": { "compressible": true },
		"application/taxii+json": {
			"source": "iana",
			"compressible": true
		},
		"application/td+json": {
			"source": "iana",
			"compressible": true
		},
		"application/tei+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["tei", "teicorpus"]
		},
		"application/tetra_isi": { "source": "iana" },
		"application/thraud+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["tfi"]
		},
		"application/timestamp-query": { "source": "iana" },
		"application/timestamp-reply": { "source": "iana" },
		"application/timestamped-data": {
			"source": "iana",
			"extensions": ["tsd"]
		},
		"application/tlsrpt+gzip": { "source": "iana" },
		"application/tlsrpt+json": {
			"source": "iana",
			"compressible": true
		},
		"application/tnauthlist": { "source": "iana" },
		"application/token-introspection+jwt": { "source": "iana" },
		"application/toml": {
			"compressible": true,
			"extensions": ["toml"]
		},
		"application/trickle-ice-sdpfrag": { "source": "iana" },
		"application/trig": {
			"source": "iana",
			"extensions": ["trig"]
		},
		"application/ttml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ttml"]
		},
		"application/tve-trigger": { "source": "iana" },
		"application/tzif": { "source": "iana" },
		"application/tzif-leap": { "source": "iana" },
		"application/ubjson": {
			"compressible": false,
			"extensions": ["ubj"]
		},
		"application/ulpfec": { "source": "iana" },
		"application/urc-grpsheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/urc-ressheet+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rsheet"]
		},
		"application/urc-targetdesc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["td"]
		},
		"application/urc-uisocketdesc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vcard+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vcard+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vemmi": { "source": "iana" },
		"application/vividence.scriptfile": { "source": "apache" },
		"application/vnd.1000minds.decision-model+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["1km"]
		},
		"application/vnd.3gpp-prose+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp-prose-pc3ch+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp-v2x-local-service-information": { "source": "iana" },
		"application/vnd.3gpp.5gnas": { "source": "iana" },
		"application/vnd.3gpp.access-transfer-events+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.bsf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.gmop+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.gtpc": { "source": "iana" },
		"application/vnd.3gpp.interworking-data": { "source": "iana" },
		"application/vnd.3gpp.lpp": { "source": "iana" },
		"application/vnd.3gpp.mc-signalling-ear": { "source": "iana" },
		"application/vnd.3gpp.mcdata-affiliation-command+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-payload": { "source": "iana" },
		"application/vnd.3gpp.mcdata-service-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-signalling": { "source": "iana" },
		"application/vnd.3gpp.mcdata-ue-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-user-profile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-affiliation-command+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-floor-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-location-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-service-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-signed+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-ue-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-ue-init-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-user-profile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-location-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-service-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-transmission-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-ue-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-user-profile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mid-call+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.ngap": { "source": "iana" },
		"application/vnd.3gpp.pfcp": { "source": "iana" },
		"application/vnd.3gpp.pic-bw-large": {
			"source": "iana",
			"extensions": ["plb"]
		},
		"application/vnd.3gpp.pic-bw-small": {
			"source": "iana",
			"extensions": ["psb"]
		},
		"application/vnd.3gpp.pic-bw-var": {
			"source": "iana",
			"extensions": ["pvb"]
		},
		"application/vnd.3gpp.s1ap": { "source": "iana" },
		"application/vnd.3gpp.sms": { "source": "iana" },
		"application/vnd.3gpp.sms+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.srvcc-ext+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.srvcc-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.state-and-event-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.ussd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp2.bcmcsinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp2.sms": { "source": "iana" },
		"application/vnd.3gpp2.tcap": {
			"source": "iana",
			"extensions": ["tcap"]
		},
		"application/vnd.3lightssoftware.imagescal": { "source": "iana" },
		"application/vnd.3m.post-it-notes": {
			"source": "iana",
			"extensions": ["pwn"]
		},
		"application/vnd.accpac.simply.aso": {
			"source": "iana",
			"extensions": ["aso"]
		},
		"application/vnd.accpac.simply.imp": {
			"source": "iana",
			"extensions": ["imp"]
		},
		"application/vnd.acucobol": {
			"source": "iana",
			"extensions": ["acu"]
		},
		"application/vnd.acucorp": {
			"source": "iana",
			"extensions": ["atc", "acutc"]
		},
		"application/vnd.adobe.air-application-installer-package+zip": {
			"source": "apache",
			"compressible": false,
			"extensions": ["air"]
		},
		"application/vnd.adobe.flash.movie": { "source": "iana" },
		"application/vnd.adobe.formscentral.fcdt": {
			"source": "iana",
			"extensions": ["fcdt"]
		},
		"application/vnd.adobe.fxp": {
			"source": "iana",
			"extensions": ["fxp", "fxpl"]
		},
		"application/vnd.adobe.partial-upload": { "source": "iana" },
		"application/vnd.adobe.xdp+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xdp"]
		},
		"application/vnd.adobe.xfdf": {
			"source": "iana",
			"extensions": ["xfdf"]
		},
		"application/vnd.aether.imp": { "source": "iana" },
		"application/vnd.afpc.afplinedata": { "source": "iana" },
		"application/vnd.afpc.afplinedata-pagedef": { "source": "iana" },
		"application/vnd.afpc.cmoca-cmresource": { "source": "iana" },
		"application/vnd.afpc.foca-charset": { "source": "iana" },
		"application/vnd.afpc.foca-codedfont": { "source": "iana" },
		"application/vnd.afpc.foca-codepage": { "source": "iana" },
		"application/vnd.afpc.modca": { "source": "iana" },
		"application/vnd.afpc.modca-cmtable": { "source": "iana" },
		"application/vnd.afpc.modca-formdef": { "source": "iana" },
		"application/vnd.afpc.modca-mediummap": { "source": "iana" },
		"application/vnd.afpc.modca-objectcontainer": { "source": "iana" },
		"application/vnd.afpc.modca-overlay": { "source": "iana" },
		"application/vnd.afpc.modca-pagesegment": { "source": "iana" },
		"application/vnd.age": {
			"source": "iana",
			"extensions": ["age"]
		},
		"application/vnd.ah-barcode": { "source": "iana" },
		"application/vnd.ahead.space": {
			"source": "iana",
			"extensions": ["ahead"]
		},
		"application/vnd.airzip.filesecure.azf": {
			"source": "iana",
			"extensions": ["azf"]
		},
		"application/vnd.airzip.filesecure.azs": {
			"source": "iana",
			"extensions": ["azs"]
		},
		"application/vnd.amadeus+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.amazon.ebook": {
			"source": "apache",
			"extensions": ["azw"]
		},
		"application/vnd.amazon.mobi8-ebook": { "source": "iana" },
		"application/vnd.americandynamics.acc": {
			"source": "iana",
			"extensions": ["acc"]
		},
		"application/vnd.amiga.ami": {
			"source": "iana",
			"extensions": ["ami"]
		},
		"application/vnd.amundsen.maze+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.android.ota": { "source": "iana" },
		"application/vnd.android.package-archive": {
			"source": "apache",
			"compressible": false,
			"extensions": ["apk"]
		},
		"application/vnd.anki": { "source": "iana" },
		"application/vnd.anser-web-certificate-issue-initiation": {
			"source": "iana",
			"extensions": ["cii"]
		},
		"application/vnd.anser-web-funds-transfer-initiation": {
			"source": "apache",
			"extensions": ["fti"]
		},
		"application/vnd.antix.game-component": {
			"source": "iana",
			"extensions": ["atx"]
		},
		"application/vnd.apache.arrow.file": { "source": "iana" },
		"application/vnd.apache.arrow.stream": { "source": "iana" },
		"application/vnd.apache.thrift.binary": { "source": "iana" },
		"application/vnd.apache.thrift.compact": { "source": "iana" },
		"application/vnd.apache.thrift.json": { "source": "iana" },
		"application/vnd.api+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.aplextor.warrp+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.apothekende.reservation+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.apple.installer+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpkg"]
		},
		"application/vnd.apple.keynote": {
			"source": "iana",
			"extensions": ["key"]
		},
		"application/vnd.apple.mpegurl": {
			"source": "iana",
			"extensions": ["m3u8"]
		},
		"application/vnd.apple.numbers": {
			"source": "iana",
			"extensions": ["numbers"]
		},
		"application/vnd.apple.pages": {
			"source": "iana",
			"extensions": ["pages"]
		},
		"application/vnd.apple.pkpass": {
			"compressible": false,
			"extensions": ["pkpass"]
		},
		"application/vnd.arastra.swi": { "source": "iana" },
		"application/vnd.aristanetworks.swi": {
			"source": "iana",
			"extensions": ["swi"]
		},
		"application/vnd.artisan+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.artsquare": { "source": "iana" },
		"application/vnd.astraea-software.iota": {
			"source": "iana",
			"extensions": ["iota"]
		},
		"application/vnd.audiograph": {
			"source": "iana",
			"extensions": ["aep"]
		},
		"application/vnd.autopackage": { "source": "iana" },
		"application/vnd.avalon+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.avistar+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.balsamiq.bmml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["bmml"]
		},
		"application/vnd.balsamiq.bmpr": { "source": "iana" },
		"application/vnd.banana-accounting": { "source": "iana" },
		"application/vnd.bbf.usp.error": { "source": "iana" },
		"application/vnd.bbf.usp.msg": { "source": "iana" },
		"application/vnd.bbf.usp.msg+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.bekitzur-stech+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.bint.med-content": { "source": "iana" },
		"application/vnd.biopax.rdf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.blink-idb-value-wrapper": { "source": "iana" },
		"application/vnd.blueice.multipass": {
			"source": "iana",
			"extensions": ["mpm"]
		},
		"application/vnd.bluetooth.ep.oob": { "source": "iana" },
		"application/vnd.bluetooth.le.oob": { "source": "iana" },
		"application/vnd.bmi": {
			"source": "iana",
			"extensions": ["bmi"]
		},
		"application/vnd.bpf": { "source": "iana" },
		"application/vnd.bpf3": { "source": "iana" },
		"application/vnd.businessobjects": {
			"source": "iana",
			"extensions": ["rep"]
		},
		"application/vnd.byu.uapi+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cab-jscript": { "source": "iana" },
		"application/vnd.canon-cpdl": { "source": "iana" },
		"application/vnd.canon-lips": { "source": "iana" },
		"application/vnd.capasystems-pg+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cendio.thinlinc.clientconf": { "source": "iana" },
		"application/vnd.century-systems.tcp_stream": { "source": "iana" },
		"application/vnd.chemdraw+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["cdxml"]
		},
		"application/vnd.chess-pgn": { "source": "iana" },
		"application/vnd.chipnuts.karaoke-mmd": {
			"source": "iana",
			"extensions": ["mmd"]
		},
		"application/vnd.ciedi": { "source": "iana" },
		"application/vnd.cinderella": {
			"source": "iana",
			"extensions": ["cdy"]
		},
		"application/vnd.cirpack.isdn-ext": { "source": "iana" },
		"application/vnd.citationstyles.style+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["csl"]
		},
		"application/vnd.claymore": {
			"source": "iana",
			"extensions": ["cla"]
		},
		"application/vnd.cloanto.rp9": {
			"source": "iana",
			"extensions": ["rp9"]
		},
		"application/vnd.clonk.c4group": {
			"source": "iana",
			"extensions": [
				"c4g",
				"c4d",
				"c4f",
				"c4p",
				"c4u"
			]
		},
		"application/vnd.cluetrust.cartomobile-config": {
			"source": "iana",
			"extensions": ["c11amc"]
		},
		"application/vnd.cluetrust.cartomobile-config-pkg": {
			"source": "iana",
			"extensions": ["c11amz"]
		},
		"application/vnd.coffeescript": { "source": "iana" },
		"application/vnd.collabio.xodocuments.document": { "source": "iana" },
		"application/vnd.collabio.xodocuments.document-template": { "source": "iana" },
		"application/vnd.collabio.xodocuments.presentation": { "source": "iana" },
		"application/vnd.collabio.xodocuments.presentation-template": { "source": "iana" },
		"application/vnd.collabio.xodocuments.spreadsheet": { "source": "iana" },
		"application/vnd.collabio.xodocuments.spreadsheet-template": { "source": "iana" },
		"application/vnd.collection+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.collection.doc+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.collection.next+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.comicbook+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.comicbook-rar": { "source": "iana" },
		"application/vnd.commerce-battelle": { "source": "iana" },
		"application/vnd.commonspace": {
			"source": "iana",
			"extensions": ["csp"]
		},
		"application/vnd.contact.cmsg": {
			"source": "iana",
			"extensions": ["cdbcmsg"]
		},
		"application/vnd.coreos.ignition+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cosmocaller": {
			"source": "iana",
			"extensions": ["cmc"]
		},
		"application/vnd.crick.clicker": {
			"source": "iana",
			"extensions": ["clkx"]
		},
		"application/vnd.crick.clicker.keyboard": {
			"source": "iana",
			"extensions": ["clkk"]
		},
		"application/vnd.crick.clicker.palette": {
			"source": "iana",
			"extensions": ["clkp"]
		},
		"application/vnd.crick.clicker.template": {
			"source": "iana",
			"extensions": ["clkt"]
		},
		"application/vnd.crick.clicker.wordbank": {
			"source": "iana",
			"extensions": ["clkw"]
		},
		"application/vnd.criticaltools.wbs+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wbs"]
		},
		"application/vnd.cryptii.pipe+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.crypto-shade-file": { "source": "iana" },
		"application/vnd.cryptomator.encrypted": { "source": "iana" },
		"application/vnd.cryptomator.vault": { "source": "iana" },
		"application/vnd.ctc-posml": {
			"source": "iana",
			"extensions": ["pml"]
		},
		"application/vnd.ctct.ws+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cups-pdf": { "source": "iana" },
		"application/vnd.cups-postscript": { "source": "iana" },
		"application/vnd.cups-ppd": {
			"source": "iana",
			"extensions": ["ppd"]
		},
		"application/vnd.cups-raster": { "source": "iana" },
		"application/vnd.cups-raw": { "source": "iana" },
		"application/vnd.curl": { "source": "iana" },
		"application/vnd.curl.car": {
			"source": "apache",
			"extensions": ["car"]
		},
		"application/vnd.curl.pcurl": {
			"source": "apache",
			"extensions": ["pcurl"]
		},
		"application/vnd.cyan.dean.root+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cybank": { "source": "iana" },
		"application/vnd.cyclonedx+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cyclonedx+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.d2l.coursepackage1p0+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.d3m-dataset": { "source": "iana" },
		"application/vnd.d3m-problem": { "source": "iana" },
		"application/vnd.dart": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dart"]
		},
		"application/vnd.data-vision.rdz": {
			"source": "iana",
			"extensions": ["rdz"]
		},
		"application/vnd.datapackage+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dataresource+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dbf": {
			"source": "iana",
			"extensions": ["dbf"]
		},
		"application/vnd.debian.binary-package": { "source": "iana" },
		"application/vnd.dece.data": {
			"source": "iana",
			"extensions": [
				"uvf",
				"uvvf",
				"uvd",
				"uvvd"
			]
		},
		"application/vnd.dece.ttml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["uvt", "uvvt"]
		},
		"application/vnd.dece.unspecified": {
			"source": "iana",
			"extensions": ["uvx", "uvvx"]
		},
		"application/vnd.dece.zip": {
			"source": "iana",
			"extensions": ["uvz", "uvvz"]
		},
		"application/vnd.denovo.fcselayout-link": {
			"source": "iana",
			"extensions": ["fe_launch"]
		},
		"application/vnd.desmume.movie": { "source": "iana" },
		"application/vnd.dir-bi.plate-dl-nosuffix": { "source": "iana" },
		"application/vnd.dm.delegation+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dna": {
			"source": "iana",
			"extensions": ["dna"]
		},
		"application/vnd.document+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dolby.mlp": {
			"source": "apache",
			"extensions": ["mlp"]
		},
		"application/vnd.dolby.mobile.1": { "source": "iana" },
		"application/vnd.dolby.mobile.2": { "source": "iana" },
		"application/vnd.doremir.scorecloud-binary-document": { "source": "iana" },
		"application/vnd.dpgraph": {
			"source": "iana",
			"extensions": ["dpg"]
		},
		"application/vnd.dreamfactory": {
			"source": "iana",
			"extensions": ["dfac"]
		},
		"application/vnd.drive+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ds-keypoint": {
			"source": "apache",
			"extensions": ["kpxx"]
		},
		"application/vnd.dtg.local": { "source": "iana" },
		"application/vnd.dtg.local.flash": { "source": "iana" },
		"application/vnd.dtg.local.html": { "source": "iana" },
		"application/vnd.dvb.ait": {
			"source": "iana",
			"extensions": ["ait"]
		},
		"application/vnd.dvb.dvbisl+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.dvbj": { "source": "iana" },
		"application/vnd.dvb.esgcontainer": { "source": "iana" },
		"application/vnd.dvb.ipdcdftnotifaccess": { "source": "iana" },
		"application/vnd.dvb.ipdcesgaccess": { "source": "iana" },
		"application/vnd.dvb.ipdcesgaccess2": { "source": "iana" },
		"application/vnd.dvb.ipdcesgpdd": { "source": "iana" },
		"application/vnd.dvb.ipdcroaming": { "source": "iana" },
		"application/vnd.dvb.iptv.alfec-base": { "source": "iana" },
		"application/vnd.dvb.iptv.alfec-enhancement": { "source": "iana" },
		"application/vnd.dvb.notif-aggregate-root+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-container+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-generic+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-ia-msglist+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-ia-registration-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-ia-registration-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-init+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.pfr": { "source": "iana" },
		"application/vnd.dvb.service": {
			"source": "iana",
			"extensions": ["svc"]
		},
		"application/vnd.dxr": { "source": "iana" },
		"application/vnd.dynageo": {
			"source": "iana",
			"extensions": ["geo"]
		},
		"application/vnd.dzr": { "source": "iana" },
		"application/vnd.easykaraoke.cdgdownload": { "source": "iana" },
		"application/vnd.ecdis-update": { "source": "iana" },
		"application/vnd.ecip.rlp": { "source": "iana" },
		"application/vnd.eclipse.ditto+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ecowin.chart": {
			"source": "iana",
			"extensions": ["mag"]
		},
		"application/vnd.ecowin.filerequest": { "source": "iana" },
		"application/vnd.ecowin.fileupdate": { "source": "iana" },
		"application/vnd.ecowin.series": { "source": "iana" },
		"application/vnd.ecowin.seriesrequest": { "source": "iana" },
		"application/vnd.ecowin.seriesupdate": { "source": "iana" },
		"application/vnd.efi.img": { "source": "iana" },
		"application/vnd.efi.iso": { "source": "iana" },
		"application/vnd.emclient.accessrequest+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.enliven": {
			"source": "iana",
			"extensions": ["nml"]
		},
		"application/vnd.enphase.envoy": { "source": "iana" },
		"application/vnd.eprints.data+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.epson.esf": {
			"source": "iana",
			"extensions": ["esf"]
		},
		"application/vnd.epson.msf": {
			"source": "iana",
			"extensions": ["msf"]
		},
		"application/vnd.epson.quickanime": {
			"source": "iana",
			"extensions": ["qam"]
		},
		"application/vnd.epson.salt": {
			"source": "iana",
			"extensions": ["slt"]
		},
		"application/vnd.epson.ssf": {
			"source": "iana",
			"extensions": ["ssf"]
		},
		"application/vnd.ericsson.quickcall": { "source": "iana" },
		"application/vnd.espass-espass+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.eszigno3+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["es3", "et3"]
		},
		"application/vnd.etsi.aoc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.asic-e+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.etsi.asic-s+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.etsi.cug+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvcommand+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvdiscovery+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsad-bc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsad-cod+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsad-npvr+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvservice+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsync+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvueprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.mcid+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.mheg5": { "source": "iana" },
		"application/vnd.etsi.overload-control-policy-dataset+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.pstn+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.sci+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.simservs+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.timestamp-token": { "source": "iana" },
		"application/vnd.etsi.tsl+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.tsl.der": { "source": "iana" },
		"application/vnd.eu.kasparian.car+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.eudora.data": { "source": "iana" },
		"application/vnd.evolv.ecig.profile": { "source": "iana" },
		"application/vnd.evolv.ecig.settings": { "source": "iana" },
		"application/vnd.evolv.ecig.theme": { "source": "iana" },
		"application/vnd.exstream-empower+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.exstream-package": { "source": "iana" },
		"application/vnd.ezpix-album": {
			"source": "iana",
			"extensions": ["ez2"]
		},
		"application/vnd.ezpix-package": {
			"source": "iana",
			"extensions": ["ez3"]
		},
		"application/vnd.f-secure.mobile": { "source": "iana" },
		"application/vnd.familysearch.gedcom+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.fastcopy-disk-image": { "source": "iana" },
		"application/vnd.fdf": {
			"source": "iana",
			"extensions": ["fdf"]
		},
		"application/vnd.fdsn.mseed": {
			"source": "iana",
			"extensions": ["mseed"]
		},
		"application/vnd.fdsn.seed": {
			"source": "iana",
			"extensions": ["seed", "dataless"]
		},
		"application/vnd.ffsns": { "source": "iana" },
		"application/vnd.ficlab.flb+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.filmit.zfc": { "source": "iana" },
		"application/vnd.fints": { "source": "iana" },
		"application/vnd.firemonkeys.cloudcell": { "source": "iana" },
		"application/vnd.flographit": {
			"source": "iana",
			"extensions": ["gph"]
		},
		"application/vnd.fluxtime.clip": {
			"source": "iana",
			"extensions": ["ftc"]
		},
		"application/vnd.font-fontforge-sfd": { "source": "iana" },
		"application/vnd.framemaker": {
			"source": "iana",
			"extensions": [
				"fm",
				"frame",
				"maker",
				"book"
			]
		},
		"application/vnd.frogans.fnc": {
			"source": "iana",
			"extensions": ["fnc"]
		},
		"application/vnd.frogans.ltf": {
			"source": "iana",
			"extensions": ["ltf"]
		},
		"application/vnd.fsc.weblaunch": {
			"source": "iana",
			"extensions": ["fsc"]
		},
		"application/vnd.fujifilm.fb.docuworks": { "source": "iana" },
		"application/vnd.fujifilm.fb.docuworks.binder": { "source": "iana" },
		"application/vnd.fujifilm.fb.docuworks.container": { "source": "iana" },
		"application/vnd.fujifilm.fb.jfi+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.fujitsu.oasys": {
			"source": "iana",
			"extensions": ["oas"]
		},
		"application/vnd.fujitsu.oasys2": {
			"source": "iana",
			"extensions": ["oa2"]
		},
		"application/vnd.fujitsu.oasys3": {
			"source": "iana",
			"extensions": ["oa3"]
		},
		"application/vnd.fujitsu.oasysgp": {
			"source": "iana",
			"extensions": ["fg5"]
		},
		"application/vnd.fujitsu.oasysprs": {
			"source": "iana",
			"extensions": ["bh2"]
		},
		"application/vnd.fujixerox.art-ex": { "source": "iana" },
		"application/vnd.fujixerox.art4": { "source": "iana" },
		"application/vnd.fujixerox.ddd": {
			"source": "iana",
			"extensions": ["ddd"]
		},
		"application/vnd.fujixerox.docuworks": {
			"source": "iana",
			"extensions": ["xdw"]
		},
		"application/vnd.fujixerox.docuworks.binder": {
			"source": "iana",
			"extensions": ["xbd"]
		},
		"application/vnd.fujixerox.docuworks.container": { "source": "iana" },
		"application/vnd.fujixerox.hbpl": { "source": "iana" },
		"application/vnd.fut-misnet": { "source": "iana" },
		"application/vnd.futoin+cbor": { "source": "iana" },
		"application/vnd.futoin+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.fuzzysheet": {
			"source": "iana",
			"extensions": ["fzs"]
		},
		"application/vnd.genomatix.tuxedo": {
			"source": "iana",
			"extensions": ["txd"]
		},
		"application/vnd.gentics.grd+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.geo+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.geocube+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.geogebra.file": {
			"source": "iana",
			"extensions": ["ggb"]
		},
		"application/vnd.geogebra.slides": { "source": "iana" },
		"application/vnd.geogebra.tool": {
			"source": "iana",
			"extensions": ["ggt"]
		},
		"application/vnd.geometry-explorer": {
			"source": "iana",
			"extensions": ["gex", "gre"]
		},
		"application/vnd.geonext": {
			"source": "iana",
			"extensions": ["gxt"]
		},
		"application/vnd.geoplan": {
			"source": "iana",
			"extensions": ["g2w"]
		},
		"application/vnd.geospace": {
			"source": "iana",
			"extensions": ["g3w"]
		},
		"application/vnd.gerber": { "source": "iana" },
		"application/vnd.globalplatform.card-content-mgt": { "source": "iana" },
		"application/vnd.globalplatform.card-content-mgt-response": { "source": "iana" },
		"application/vnd.gmx": {
			"source": "iana",
			"extensions": ["gmx"]
		},
		"application/vnd.google-apps.document": {
			"compressible": false,
			"extensions": ["gdoc"]
		},
		"application/vnd.google-apps.presentation": {
			"compressible": false,
			"extensions": ["gslides"]
		},
		"application/vnd.google-apps.spreadsheet": {
			"compressible": false,
			"extensions": ["gsheet"]
		},
		"application/vnd.google-earth.kml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["kml"]
		},
		"application/vnd.google-earth.kmz": {
			"source": "iana",
			"compressible": false,
			"extensions": ["kmz"]
		},
		"application/vnd.gov.sk.e-form+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.gov.sk.e-form+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.gov.sk.xmldatacontainer+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.grafeq": {
			"source": "iana",
			"extensions": ["gqf", "gqs"]
		},
		"application/vnd.gridmp": { "source": "iana" },
		"application/vnd.groove-account": {
			"source": "iana",
			"extensions": ["gac"]
		},
		"application/vnd.groove-help": {
			"source": "iana",
			"extensions": ["ghf"]
		},
		"application/vnd.groove-identity-message": {
			"source": "iana",
			"extensions": ["gim"]
		},
		"application/vnd.groove-injector": {
			"source": "iana",
			"extensions": ["grv"]
		},
		"application/vnd.groove-tool-message": {
			"source": "iana",
			"extensions": ["gtm"]
		},
		"application/vnd.groove-tool-template": {
			"source": "iana",
			"extensions": ["tpl"]
		},
		"application/vnd.groove-vcard": {
			"source": "iana",
			"extensions": ["vcg"]
		},
		"application/vnd.hal+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hal+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["hal"]
		},
		"application/vnd.handheld-entertainment+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["zmm"]
		},
		"application/vnd.hbci": {
			"source": "iana",
			"extensions": ["hbci"]
		},
		"application/vnd.hc+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hcl-bireports": { "source": "iana" },
		"application/vnd.hdt": { "source": "iana" },
		"application/vnd.heroku+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hhe.lesson-player": {
			"source": "iana",
			"extensions": ["les"]
		},
		"application/vnd.hl7cda+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.hl7v2+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.hp-hpgl": {
			"source": "iana",
			"extensions": ["hpgl"]
		},
		"application/vnd.hp-hpid": {
			"source": "iana",
			"extensions": ["hpid"]
		},
		"application/vnd.hp-hps": {
			"source": "iana",
			"extensions": ["hps"]
		},
		"application/vnd.hp-jlyt": {
			"source": "iana",
			"extensions": ["jlt"]
		},
		"application/vnd.hp-pcl": {
			"source": "iana",
			"extensions": ["pcl"]
		},
		"application/vnd.hp-pclxl": {
			"source": "iana",
			"extensions": ["pclxl"]
		},
		"application/vnd.httphone": { "source": "iana" },
		"application/vnd.hydrostatix.sof-data": {
			"source": "iana",
			"extensions": ["sfd-hdstx"]
		},
		"application/vnd.hyper+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hyper-item+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hyperdrive+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hzn-3d-crossword": { "source": "iana" },
		"application/vnd.ibm.afplinedata": { "source": "iana" },
		"application/vnd.ibm.electronic-media": { "source": "iana" },
		"application/vnd.ibm.minipay": {
			"source": "iana",
			"extensions": ["mpy"]
		},
		"application/vnd.ibm.modcap": {
			"source": "iana",
			"extensions": [
				"afp",
				"listafp",
				"list3820"
			]
		},
		"application/vnd.ibm.rights-management": {
			"source": "iana",
			"extensions": ["irm"]
		},
		"application/vnd.ibm.secure-container": {
			"source": "iana",
			"extensions": ["sc"]
		},
		"application/vnd.iccprofile": {
			"source": "iana",
			"extensions": ["icc", "icm"]
		},
		"application/vnd.ieee.1905": { "source": "iana" },
		"application/vnd.igloader": {
			"source": "iana",
			"extensions": ["igl"]
		},
		"application/vnd.imagemeter.folder+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.imagemeter.image+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.immervision-ivp": {
			"source": "iana",
			"extensions": ["ivp"]
		},
		"application/vnd.immervision-ivu": {
			"source": "iana",
			"extensions": ["ivu"]
		},
		"application/vnd.ims.imsccv1p1": { "source": "iana" },
		"application/vnd.ims.imsccv1p2": { "source": "iana" },
		"application/vnd.ims.imsccv1p3": { "source": "iana" },
		"application/vnd.ims.lis.v2.result+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolproxy+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolproxy.id+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolsettings+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolsettings.simple+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.informedcontrol.rms+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.informix-visionary": { "source": "iana" },
		"application/vnd.infotech.project": { "source": "iana" },
		"application/vnd.infotech.project+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.innopath.wamp.notification": { "source": "iana" },
		"application/vnd.insors.igm": {
			"source": "iana",
			"extensions": ["igm"]
		},
		"application/vnd.intercon.formnet": {
			"source": "iana",
			"extensions": ["xpw", "xpx"]
		},
		"application/vnd.intergeo": {
			"source": "iana",
			"extensions": ["i2g"]
		},
		"application/vnd.intertrust.digibox": { "source": "iana" },
		"application/vnd.intertrust.nncp": { "source": "iana" },
		"application/vnd.intu.qbo": {
			"source": "iana",
			"extensions": ["qbo"]
		},
		"application/vnd.intu.qfx": {
			"source": "iana",
			"extensions": ["qfx"]
		},
		"application/vnd.iptc.g2.catalogitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.conceptitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.knowledgeitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.newsitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.newsmessage+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.packageitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.planningitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ipunplugged.rcprofile": {
			"source": "iana",
			"extensions": ["rcprofile"]
		},
		"application/vnd.irepository.package+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["irp"]
		},
		"application/vnd.is-xpr": {
			"source": "iana",
			"extensions": ["xpr"]
		},
		"application/vnd.isac.fcs": {
			"source": "iana",
			"extensions": ["fcs"]
		},
		"application/vnd.iso11783-10+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.jam": {
			"source": "iana",
			"extensions": ["jam"]
		},
		"application/vnd.japannet-directory-service": { "source": "iana" },
		"application/vnd.japannet-jpnstore-wakeup": { "source": "iana" },
		"application/vnd.japannet-payment-wakeup": { "source": "iana" },
		"application/vnd.japannet-registration": { "source": "iana" },
		"application/vnd.japannet-registration-wakeup": { "source": "iana" },
		"application/vnd.japannet-setstore-wakeup": { "source": "iana" },
		"application/vnd.japannet-verification": { "source": "iana" },
		"application/vnd.japannet-verification-wakeup": { "source": "iana" },
		"application/vnd.jcp.javame.midlet-rms": {
			"source": "iana",
			"extensions": ["rms"]
		},
		"application/vnd.jisp": {
			"source": "iana",
			"extensions": ["jisp"]
		},
		"application/vnd.joost.joda-archive": {
			"source": "iana",
			"extensions": ["joda"]
		},
		"application/vnd.jsk.isdn-ngn": { "source": "iana" },
		"application/vnd.kahootz": {
			"source": "iana",
			"extensions": ["ktz", "ktr"]
		},
		"application/vnd.kde.karbon": {
			"source": "iana",
			"extensions": ["karbon"]
		},
		"application/vnd.kde.kchart": {
			"source": "iana",
			"extensions": ["chrt"]
		},
		"application/vnd.kde.kformula": {
			"source": "iana",
			"extensions": ["kfo"]
		},
		"application/vnd.kde.kivio": {
			"source": "iana",
			"extensions": ["flw"]
		},
		"application/vnd.kde.kontour": {
			"source": "iana",
			"extensions": ["kon"]
		},
		"application/vnd.kde.kpresenter": {
			"source": "iana",
			"extensions": ["kpr", "kpt"]
		},
		"application/vnd.kde.kspread": {
			"source": "iana",
			"extensions": ["ksp"]
		},
		"application/vnd.kde.kword": {
			"source": "iana",
			"extensions": ["kwd", "kwt"]
		},
		"application/vnd.kenameaapp": {
			"source": "iana",
			"extensions": ["htke"]
		},
		"application/vnd.kidspiration": {
			"source": "iana",
			"extensions": ["kia"]
		},
		"application/vnd.kinar": {
			"source": "iana",
			"extensions": ["kne", "knp"]
		},
		"application/vnd.koan": {
			"source": "iana",
			"extensions": [
				"skp",
				"skd",
				"skt",
				"skm"
			]
		},
		"application/vnd.kodak-descriptor": {
			"source": "iana",
			"extensions": ["sse"]
		},
		"application/vnd.las": { "source": "iana" },
		"application/vnd.las.las+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.las.las+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lasxml"]
		},
		"application/vnd.laszip": { "source": "iana" },
		"application/vnd.leap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.liberty-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.llamagraphics.life-balance.desktop": {
			"source": "iana",
			"extensions": ["lbd"]
		},
		"application/vnd.llamagraphics.life-balance.exchange+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lbe"]
		},
		"application/vnd.logipipe.circuit+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.loom": { "source": "iana" },
		"application/vnd.lotus-1-2-3": {
			"source": "iana",
			"extensions": ["123"]
		},
		"application/vnd.lotus-approach": {
			"source": "iana",
			"extensions": ["apr"]
		},
		"application/vnd.lotus-freelance": {
			"source": "iana",
			"extensions": ["pre"]
		},
		"application/vnd.lotus-notes": {
			"source": "iana",
			"extensions": ["nsf"]
		},
		"application/vnd.lotus-organizer": {
			"source": "iana",
			"extensions": ["org"]
		},
		"application/vnd.lotus-screencam": {
			"source": "iana",
			"extensions": ["scm"]
		},
		"application/vnd.lotus-wordpro": {
			"source": "iana",
			"extensions": ["lwp"]
		},
		"application/vnd.macports.portpkg": {
			"source": "iana",
			"extensions": ["portpkg"]
		},
		"application/vnd.mapbox-vector-tile": {
			"source": "iana",
			"extensions": ["mvt"]
		},
		"application/vnd.marlin.drm.actiontoken+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.marlin.drm.conftoken+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.marlin.drm.license+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.marlin.drm.mdcf": { "source": "iana" },
		"application/vnd.mason+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.maxar.archive.3tz+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.maxmind.maxmind-db": { "source": "iana" },
		"application/vnd.mcd": {
			"source": "iana",
			"extensions": ["mcd"]
		},
		"application/vnd.medcalcdata": {
			"source": "iana",
			"extensions": ["mc1"]
		},
		"application/vnd.mediastation.cdkey": {
			"source": "iana",
			"extensions": ["cdkey"]
		},
		"application/vnd.meridian-slingshot": { "source": "iana" },
		"application/vnd.mfer": {
			"source": "iana",
			"extensions": ["mwf"]
		},
		"application/vnd.mfmp": {
			"source": "iana",
			"extensions": ["mfm"]
		},
		"application/vnd.micro+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.micrografx.flo": {
			"source": "iana",
			"extensions": ["flo"]
		},
		"application/vnd.micrografx.igx": {
			"source": "iana",
			"extensions": ["igx"]
		},
		"application/vnd.microsoft.portable-executable": { "source": "iana" },
		"application/vnd.microsoft.windows.thumbnail-cache": { "source": "iana" },
		"application/vnd.miele+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.mif": {
			"source": "iana",
			"extensions": ["mif"]
		},
		"application/vnd.minisoft-hp3000-save": { "source": "iana" },
		"application/vnd.mitsubishi.misty-guard.trustweb": { "source": "iana" },
		"application/vnd.mobius.daf": {
			"source": "iana",
			"extensions": ["daf"]
		},
		"application/vnd.mobius.dis": {
			"source": "iana",
			"extensions": ["dis"]
		},
		"application/vnd.mobius.mbk": {
			"source": "iana",
			"extensions": ["mbk"]
		},
		"application/vnd.mobius.mqy": {
			"source": "iana",
			"extensions": ["mqy"]
		},
		"application/vnd.mobius.msl": {
			"source": "iana",
			"extensions": ["msl"]
		},
		"application/vnd.mobius.plc": {
			"source": "iana",
			"extensions": ["plc"]
		},
		"application/vnd.mobius.txf": {
			"source": "iana",
			"extensions": ["txf"]
		},
		"application/vnd.mophun.application": {
			"source": "iana",
			"extensions": ["mpn"]
		},
		"application/vnd.mophun.certificate": {
			"source": "iana",
			"extensions": ["mpc"]
		},
		"application/vnd.motorola.flexsuite": { "source": "iana" },
		"application/vnd.motorola.flexsuite.adsi": { "source": "iana" },
		"application/vnd.motorola.flexsuite.fis": { "source": "iana" },
		"application/vnd.motorola.flexsuite.gotap": { "source": "iana" },
		"application/vnd.motorola.flexsuite.kmr": { "source": "iana" },
		"application/vnd.motorola.flexsuite.ttc": { "source": "iana" },
		"application/vnd.motorola.flexsuite.wem": { "source": "iana" },
		"application/vnd.motorola.iprm": { "source": "iana" },
		"application/vnd.mozilla.xul+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xul"]
		},
		"application/vnd.ms-3mfdocument": { "source": "iana" },
		"application/vnd.ms-artgalry": {
			"source": "iana",
			"extensions": ["cil"]
		},
		"application/vnd.ms-asf": { "source": "iana" },
		"application/vnd.ms-cab-compressed": {
			"source": "iana",
			"extensions": ["cab"]
		},
		"application/vnd.ms-color.iccprofile": { "source": "apache" },
		"application/vnd.ms-excel": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"xls",
				"xlm",
				"xla",
				"xlc",
				"xlt",
				"xlw"
			]
		},
		"application/vnd.ms-excel.addin.macroenabled.12": {
			"source": "iana",
			"extensions": ["xlam"]
		},
		"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
			"source": "iana",
			"extensions": ["xlsb"]
		},
		"application/vnd.ms-excel.sheet.macroenabled.12": {
			"source": "iana",
			"extensions": ["xlsm"]
		},
		"application/vnd.ms-excel.template.macroenabled.12": {
			"source": "iana",
			"extensions": ["xltm"]
		},
		"application/vnd.ms-fontobject": {
			"source": "iana",
			"compressible": true,
			"extensions": ["eot"]
		},
		"application/vnd.ms-htmlhelp": {
			"source": "iana",
			"extensions": ["chm"]
		},
		"application/vnd.ms-ims": {
			"source": "iana",
			"extensions": ["ims"]
		},
		"application/vnd.ms-lrm": {
			"source": "iana",
			"extensions": ["lrm"]
		},
		"application/vnd.ms-office.activex+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-officetheme": {
			"source": "iana",
			"extensions": ["thmx"]
		},
		"application/vnd.ms-opentype": {
			"source": "apache",
			"compressible": true
		},
		"application/vnd.ms-outlook": {
			"compressible": false,
			"extensions": ["msg"]
		},
		"application/vnd.ms-package.obfuscated-opentype": { "source": "apache" },
		"application/vnd.ms-pki.seccat": {
			"source": "apache",
			"extensions": ["cat"]
		},
		"application/vnd.ms-pki.stl": {
			"source": "apache",
			"extensions": ["stl"]
		},
		"application/vnd.ms-playready.initiator+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-powerpoint": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"ppt",
				"pps",
				"pot"
			]
		},
		"application/vnd.ms-powerpoint.addin.macroenabled.12": {
			"source": "iana",
			"extensions": ["ppam"]
		},
		"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
			"source": "iana",
			"extensions": ["pptm"]
		},
		"application/vnd.ms-powerpoint.slide.macroenabled.12": {
			"source": "iana",
			"extensions": ["sldm"]
		},
		"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
			"source": "iana",
			"extensions": ["ppsm"]
		},
		"application/vnd.ms-powerpoint.template.macroenabled.12": {
			"source": "iana",
			"extensions": ["potm"]
		},
		"application/vnd.ms-printdevicecapabilities+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-printing.printticket+xml": {
			"source": "apache",
			"compressible": true
		},
		"application/vnd.ms-printschematicket+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-project": {
			"source": "iana",
			"extensions": ["mpp", "mpt"]
		},
		"application/vnd.ms-tnef": { "source": "iana" },
		"application/vnd.ms-windows.devicepairing": { "source": "iana" },
		"application/vnd.ms-windows.nwprinting.oob": { "source": "iana" },
		"application/vnd.ms-windows.printerpairing": { "source": "iana" },
		"application/vnd.ms-windows.wsd.oob": { "source": "iana" },
		"application/vnd.ms-wmdrm.lic-chlg-req": { "source": "iana" },
		"application/vnd.ms-wmdrm.lic-resp": { "source": "iana" },
		"application/vnd.ms-wmdrm.meter-chlg-req": { "source": "iana" },
		"application/vnd.ms-wmdrm.meter-resp": { "source": "iana" },
		"application/vnd.ms-word.document.macroenabled.12": {
			"source": "iana",
			"extensions": ["docm"]
		},
		"application/vnd.ms-word.template.macroenabled.12": {
			"source": "iana",
			"extensions": ["dotm"]
		},
		"application/vnd.ms-works": {
			"source": "iana",
			"extensions": [
				"wps",
				"wks",
				"wcm",
				"wdb"
			]
		},
		"application/vnd.ms-wpl": {
			"source": "iana",
			"extensions": ["wpl"]
		},
		"application/vnd.ms-xpsdocument": {
			"source": "iana",
			"compressible": false,
			"extensions": ["xps"]
		},
		"application/vnd.msa-disk-image": { "source": "iana" },
		"application/vnd.mseq": {
			"source": "iana",
			"extensions": ["mseq"]
		},
		"application/vnd.msign": { "source": "iana" },
		"application/vnd.multiad.creator": { "source": "iana" },
		"application/vnd.multiad.creator.cif": { "source": "iana" },
		"application/vnd.music-niff": { "source": "iana" },
		"application/vnd.musician": {
			"source": "iana",
			"extensions": ["mus"]
		},
		"application/vnd.muvee.style": {
			"source": "iana",
			"extensions": ["msty"]
		},
		"application/vnd.mynfc": {
			"source": "iana",
			"extensions": ["taglet"]
		},
		"application/vnd.nacamar.ybrid+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ncd.control": { "source": "iana" },
		"application/vnd.ncd.reference": { "source": "iana" },
		"application/vnd.nearst.inv+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nebumind.line": { "source": "iana" },
		"application/vnd.nervana": { "source": "iana" },
		"application/vnd.netfpx": { "source": "iana" },
		"application/vnd.neurolanguage.nlu": {
			"source": "iana",
			"extensions": ["nlu"]
		},
		"application/vnd.nimn": { "source": "iana" },
		"application/vnd.nintendo.nitro.rom": { "source": "iana" },
		"application/vnd.nintendo.snes.rom": { "source": "iana" },
		"application/vnd.nitf": {
			"source": "iana",
			"extensions": ["ntf", "nitf"]
		},
		"application/vnd.noblenet-directory": {
			"source": "iana",
			"extensions": ["nnd"]
		},
		"application/vnd.noblenet-sealer": {
			"source": "iana",
			"extensions": ["nns"]
		},
		"application/vnd.noblenet-web": {
			"source": "iana",
			"extensions": ["nnw"]
		},
		"application/vnd.nokia.catalogs": { "source": "iana" },
		"application/vnd.nokia.conml+wbxml": { "source": "iana" },
		"application/vnd.nokia.conml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.iptv.config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.isds-radio-presets": { "source": "iana" },
		"application/vnd.nokia.landmark+wbxml": { "source": "iana" },
		"application/vnd.nokia.landmark+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.landmarkcollection+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.n-gage.ac+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ac"]
		},
		"application/vnd.nokia.n-gage.data": {
			"source": "iana",
			"extensions": ["ngdat"]
		},
		"application/vnd.nokia.n-gage.symbian.install": {
			"source": "iana",
			"extensions": ["n-gage"]
		},
		"application/vnd.nokia.ncd": { "source": "iana" },
		"application/vnd.nokia.pcd+wbxml": { "source": "iana" },
		"application/vnd.nokia.pcd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.radio-preset": {
			"source": "iana",
			"extensions": ["rpst"]
		},
		"application/vnd.nokia.radio-presets": {
			"source": "iana",
			"extensions": ["rpss"]
		},
		"application/vnd.novadigm.edm": {
			"source": "iana",
			"extensions": ["edm"]
		},
		"application/vnd.novadigm.edx": {
			"source": "iana",
			"extensions": ["edx"]
		},
		"application/vnd.novadigm.ext": {
			"source": "iana",
			"extensions": ["ext"]
		},
		"application/vnd.ntt-local.content-share": { "source": "iana" },
		"application/vnd.ntt-local.file-transfer": { "source": "iana" },
		"application/vnd.ntt-local.ogw_remote-access": { "source": "iana" },
		"application/vnd.ntt-local.sip-ta_remote": { "source": "iana" },
		"application/vnd.ntt-local.sip-ta_tcp_stream": { "source": "iana" },
		"application/vnd.oasis.opendocument.chart": {
			"source": "iana",
			"extensions": ["odc"]
		},
		"application/vnd.oasis.opendocument.chart-template": {
			"source": "iana",
			"extensions": ["otc"]
		},
		"application/vnd.oasis.opendocument.database": {
			"source": "iana",
			"extensions": ["odb"]
		},
		"application/vnd.oasis.opendocument.formula": {
			"source": "iana",
			"extensions": ["odf"]
		},
		"application/vnd.oasis.opendocument.formula-template": {
			"source": "iana",
			"extensions": ["odft"]
		},
		"application/vnd.oasis.opendocument.graphics": {
			"source": "iana",
			"compressible": false,
			"extensions": ["odg"]
		},
		"application/vnd.oasis.opendocument.graphics-template": {
			"source": "iana",
			"extensions": ["otg"]
		},
		"application/vnd.oasis.opendocument.image": {
			"source": "iana",
			"extensions": ["odi"]
		},
		"application/vnd.oasis.opendocument.image-template": {
			"source": "iana",
			"extensions": ["oti"]
		},
		"application/vnd.oasis.opendocument.presentation": {
			"source": "iana",
			"compressible": false,
			"extensions": ["odp"]
		},
		"application/vnd.oasis.opendocument.presentation-template": {
			"source": "iana",
			"extensions": ["otp"]
		},
		"application/vnd.oasis.opendocument.spreadsheet": {
			"source": "iana",
			"compressible": false,
			"extensions": ["ods"]
		},
		"application/vnd.oasis.opendocument.spreadsheet-template": {
			"source": "iana",
			"extensions": ["ots"]
		},
		"application/vnd.oasis.opendocument.text": {
			"source": "iana",
			"compressible": false,
			"extensions": ["odt"]
		},
		"application/vnd.oasis.opendocument.text-master": {
			"source": "iana",
			"extensions": ["odm"]
		},
		"application/vnd.oasis.opendocument.text-template": {
			"source": "iana",
			"extensions": ["ott"]
		},
		"application/vnd.oasis.opendocument.text-web": {
			"source": "iana",
			"extensions": ["oth"]
		},
		"application/vnd.obn": { "source": "iana" },
		"application/vnd.ocf+cbor": { "source": "iana" },
		"application/vnd.oci.image.manifest.v1+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oftn.l10n+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.contentaccessdownload+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.contentaccessstreaming+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.cspg-hexbinary": { "source": "iana" },
		"application/vnd.oipf.dae.svg+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.dae.xhtml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.mippvcontrolmessage+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.pae.gem": { "source": "iana" },
		"application/vnd.oipf.spdiscovery+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.spdlist+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.ueprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.userprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.olpc-sugar": {
			"source": "iana",
			"extensions": ["xo"]
		},
		"application/vnd.oma-scws-config": { "source": "iana" },
		"application/vnd.oma-scws-http-request": { "source": "iana" },
		"application/vnd.oma-scws-http-response": { "source": "iana" },
		"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.drm-trigger+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.imd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.ltkm": { "source": "iana" },
		"application/vnd.oma.bcast.notification+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.provisioningtrigger": { "source": "iana" },
		"application/vnd.oma.bcast.sgboot": { "source": "iana" },
		"application/vnd.oma.bcast.sgdd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.sgdu": { "source": "iana" },
		"application/vnd.oma.bcast.simple-symbol-container": { "source": "iana" },
		"application/vnd.oma.bcast.smartcard-trigger+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.sprov+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.stkm": { "source": "iana" },
		"application/vnd.oma.cab-address-book+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-feature-handler+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-pcc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-subs-invite+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-user-prefs+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.dcd": { "source": "iana" },
		"application/vnd.oma.dcdc": { "source": "iana" },
		"application/vnd.oma.dd2+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dd2"]
		},
		"application/vnd.oma.drm.risd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.group-usage-list+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.lwm2m+cbor": { "source": "iana" },
		"application/vnd.oma.lwm2m+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.lwm2m+tlv": { "source": "iana" },
		"application/vnd.oma.pal+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.detailed-progress-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.final-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.groups+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.invocation-descriptor+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.optimized-progress-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.push": { "source": "iana" },
		"application/vnd.oma.scidm.messages+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.xcap-directory+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.omads-email+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.omads-file+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.omads-folder+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.omaloc-supl-init": { "source": "iana" },
		"application/vnd.onepager": { "source": "iana" },
		"application/vnd.onepagertamp": { "source": "iana" },
		"application/vnd.onepagertamx": { "source": "iana" },
		"application/vnd.onepagertat": { "source": "iana" },
		"application/vnd.onepagertatp": { "source": "iana" },
		"application/vnd.onepagertatx": { "source": "iana" },
		"application/vnd.openblox.game+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["obgx"]
		},
		"application/vnd.openblox.game-binary": { "source": "iana" },
		"application/vnd.openeye.oeb": { "source": "iana" },
		"application/vnd.openofficeorg.extension": {
			"source": "apache",
			"extensions": ["oxt"]
		},
		"application/vnd.openstreetmap.data+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["osm"]
		},
		"application/vnd.opentimestamps.ots": { "source": "iana" },
		"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawing+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
			"source": "iana",
			"compressible": false,
			"extensions": ["pptx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slide": {
			"source": "iana",
			"extensions": ["sldx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
			"source": "iana",
			"extensions": ["ppsx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.template": {
			"source": "iana",
			"extensions": ["potx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
			"source": "iana",
			"compressible": false,
			"extensions": ["xlsx"]
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
			"source": "iana",
			"extensions": ["xltx"]
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.theme+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.vmldrawing": { "source": "iana" },
		"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
			"source": "iana",
			"compressible": false,
			"extensions": ["docx"]
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
			"source": "iana",
			"extensions": ["dotx"]
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-package.core-properties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-package.relationships+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oracle.resource+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.orange.indata": { "source": "iana" },
		"application/vnd.osa.netdeploy": { "source": "iana" },
		"application/vnd.osgeo.mapguide.package": {
			"source": "iana",
			"extensions": ["mgp"]
		},
		"application/vnd.osgi.bundle": { "source": "iana" },
		"application/vnd.osgi.dp": {
			"source": "iana",
			"extensions": ["dp"]
		},
		"application/vnd.osgi.subsystem": {
			"source": "iana",
			"extensions": ["esa"]
		},
		"application/vnd.otps.ct-kip+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oxli.countgraph": { "source": "iana" },
		"application/vnd.pagerduty+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.palm": {
			"source": "iana",
			"extensions": [
				"pdb",
				"pqa",
				"oprc"
			]
		},
		"application/vnd.panoply": { "source": "iana" },
		"application/vnd.paos.xml": { "source": "iana" },
		"application/vnd.patentdive": { "source": "iana" },
		"application/vnd.patientecommsdoc": { "source": "iana" },
		"application/vnd.pawaafile": {
			"source": "iana",
			"extensions": ["paw"]
		},
		"application/vnd.pcos": { "source": "iana" },
		"application/vnd.pg.format": {
			"source": "iana",
			"extensions": ["str"]
		},
		"application/vnd.pg.osasli": {
			"source": "iana",
			"extensions": ["ei6"]
		},
		"application/vnd.piaccess.application-licence": { "source": "iana" },
		"application/vnd.picsel": {
			"source": "iana",
			"extensions": ["efif"]
		},
		"application/vnd.pmi.widget": {
			"source": "iana",
			"extensions": ["wg"]
		},
		"application/vnd.poc.group-advertisement+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.pocketlearn": {
			"source": "iana",
			"extensions": ["plf"]
		},
		"application/vnd.powerbuilder6": {
			"source": "iana",
			"extensions": ["pbd"]
		},
		"application/vnd.powerbuilder6-s": { "source": "iana" },
		"application/vnd.powerbuilder7": { "source": "iana" },
		"application/vnd.powerbuilder7-s": { "source": "iana" },
		"application/vnd.powerbuilder75": { "source": "iana" },
		"application/vnd.powerbuilder75-s": { "source": "iana" },
		"application/vnd.preminet": { "source": "iana" },
		"application/vnd.previewsystems.box": {
			"source": "iana",
			"extensions": ["box"]
		},
		"application/vnd.proteus.magazine": {
			"source": "iana",
			"extensions": ["mgz"]
		},
		"application/vnd.psfs": { "source": "iana" },
		"application/vnd.publishare-delta-tree": {
			"source": "iana",
			"extensions": ["qps"]
		},
		"application/vnd.pvi.ptid1": {
			"source": "iana",
			"extensions": ["ptid"]
		},
		"application/vnd.pwg-multiplexed": { "source": "iana" },
		"application/vnd.pwg-xhtml-print+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.qualcomm.brew-app-res": { "source": "iana" },
		"application/vnd.quarantainenet": { "source": "iana" },
		"application/vnd.quark.quarkxpress": {
			"source": "iana",
			"extensions": [
				"qxd",
				"qxt",
				"qwd",
				"qwt",
				"qxl",
				"qxb"
			]
		},
		"application/vnd.quobject-quoxdocument": { "source": "iana" },
		"application/vnd.radisys.moml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-conf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-conn+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-dialog+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-stream+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-conf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-base+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-fax-detect+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-group+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-speech+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-transform+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.rainstor.data": { "source": "iana" },
		"application/vnd.rapid": { "source": "iana" },
		"application/vnd.rar": {
			"source": "iana",
			"extensions": ["rar"]
		},
		"application/vnd.realvnc.bed": {
			"source": "iana",
			"extensions": ["bed"]
		},
		"application/vnd.recordare.musicxml": {
			"source": "iana",
			"extensions": ["mxl"]
		},
		"application/vnd.recordare.musicxml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["musicxml"]
		},
		"application/vnd.renlearn.rlprint": { "source": "iana" },
		"application/vnd.resilient.logic": { "source": "iana" },
		"application/vnd.restful+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.rig.cryptonote": {
			"source": "iana",
			"extensions": ["cryptonote"]
		},
		"application/vnd.rim.cod": {
			"source": "apache",
			"extensions": ["cod"]
		},
		"application/vnd.rn-realmedia": {
			"source": "apache",
			"extensions": ["rm"]
		},
		"application/vnd.rn-realmedia-vbr": {
			"source": "apache",
			"extensions": ["rmvb"]
		},
		"application/vnd.route66.link66+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["link66"]
		},
		"application/vnd.rs-274x": { "source": "iana" },
		"application/vnd.ruckus.download": { "source": "iana" },
		"application/vnd.s3sms": { "source": "iana" },
		"application/vnd.sailingtracker.track": {
			"source": "iana",
			"extensions": ["st"]
		},
		"application/vnd.sar": { "source": "iana" },
		"application/vnd.sbm.cid": { "source": "iana" },
		"application/vnd.sbm.mid2": { "source": "iana" },
		"application/vnd.scribus": { "source": "iana" },
		"application/vnd.sealed.3df": { "source": "iana" },
		"application/vnd.sealed.csf": { "source": "iana" },
		"application/vnd.sealed.doc": { "source": "iana" },
		"application/vnd.sealed.eml": { "source": "iana" },
		"application/vnd.sealed.mht": { "source": "iana" },
		"application/vnd.sealed.net": { "source": "iana" },
		"application/vnd.sealed.ppt": { "source": "iana" },
		"application/vnd.sealed.tiff": { "source": "iana" },
		"application/vnd.sealed.xls": { "source": "iana" },
		"application/vnd.sealedmedia.softseal.html": { "source": "iana" },
		"application/vnd.sealedmedia.softseal.pdf": { "source": "iana" },
		"application/vnd.seemail": {
			"source": "iana",
			"extensions": ["see"]
		},
		"application/vnd.seis+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.sema": {
			"source": "iana",
			"extensions": ["sema"]
		},
		"application/vnd.semd": {
			"source": "iana",
			"extensions": ["semd"]
		},
		"application/vnd.semf": {
			"source": "iana",
			"extensions": ["semf"]
		},
		"application/vnd.shade-save-file": { "source": "iana" },
		"application/vnd.shana.informed.formdata": {
			"source": "iana",
			"extensions": ["ifm"]
		},
		"application/vnd.shana.informed.formtemplate": {
			"source": "iana",
			"extensions": ["itp"]
		},
		"application/vnd.shana.informed.interchange": {
			"source": "iana",
			"extensions": ["iif"]
		},
		"application/vnd.shana.informed.package": {
			"source": "iana",
			"extensions": ["ipk"]
		},
		"application/vnd.shootproof+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.shopkick+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.shp": { "source": "iana" },
		"application/vnd.shx": { "source": "iana" },
		"application/vnd.sigrok.session": { "source": "iana" },
		"application/vnd.simtech-mindmapper": {
			"source": "iana",
			"extensions": ["twd", "twds"]
		},
		"application/vnd.siren+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.smaf": {
			"source": "iana",
			"extensions": ["mmf"]
		},
		"application/vnd.smart.notebook": { "source": "iana" },
		"application/vnd.smart.teacher": {
			"source": "iana",
			"extensions": ["teacher"]
		},
		"application/vnd.snesdev-page-table": { "source": "iana" },
		"application/vnd.software602.filler.form+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["fo"]
		},
		"application/vnd.software602.filler.form-xml-zip": { "source": "iana" },
		"application/vnd.solent.sdkm+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sdkm", "sdkd"]
		},
		"application/vnd.spotfire.dxp": {
			"source": "iana",
			"extensions": ["dxp"]
		},
		"application/vnd.spotfire.sfs": {
			"source": "iana",
			"extensions": ["sfs"]
		},
		"application/vnd.sqlite3": { "source": "iana" },
		"application/vnd.sss-cod": { "source": "iana" },
		"application/vnd.sss-dtf": { "source": "iana" },
		"application/vnd.sss-ntf": { "source": "iana" },
		"application/vnd.stardivision.calc": {
			"source": "apache",
			"extensions": ["sdc"]
		},
		"application/vnd.stardivision.draw": {
			"source": "apache",
			"extensions": ["sda"]
		},
		"application/vnd.stardivision.impress": {
			"source": "apache",
			"extensions": ["sdd"]
		},
		"application/vnd.stardivision.math": {
			"source": "apache",
			"extensions": ["smf"]
		},
		"application/vnd.stardivision.writer": {
			"source": "apache",
			"extensions": ["sdw", "vor"]
		},
		"application/vnd.stardivision.writer-global": {
			"source": "apache",
			"extensions": ["sgl"]
		},
		"application/vnd.stepmania.package": {
			"source": "iana",
			"extensions": ["smzip"]
		},
		"application/vnd.stepmania.stepchart": {
			"source": "iana",
			"extensions": ["sm"]
		},
		"application/vnd.street-stream": { "source": "iana" },
		"application/vnd.sun.wadl+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wadl"]
		},
		"application/vnd.sun.xml.calc": {
			"source": "apache",
			"extensions": ["sxc"]
		},
		"application/vnd.sun.xml.calc.template": {
			"source": "apache",
			"extensions": ["stc"]
		},
		"application/vnd.sun.xml.draw": {
			"source": "apache",
			"extensions": ["sxd"]
		},
		"application/vnd.sun.xml.draw.template": {
			"source": "apache",
			"extensions": ["std"]
		},
		"application/vnd.sun.xml.impress": {
			"source": "apache",
			"extensions": ["sxi"]
		},
		"application/vnd.sun.xml.impress.template": {
			"source": "apache",
			"extensions": ["sti"]
		},
		"application/vnd.sun.xml.math": {
			"source": "apache",
			"extensions": ["sxm"]
		},
		"application/vnd.sun.xml.writer": {
			"source": "apache",
			"extensions": ["sxw"]
		},
		"application/vnd.sun.xml.writer.global": {
			"source": "apache",
			"extensions": ["sxg"]
		},
		"application/vnd.sun.xml.writer.template": {
			"source": "apache",
			"extensions": ["stw"]
		},
		"application/vnd.sus-calendar": {
			"source": "iana",
			"extensions": ["sus", "susp"]
		},
		"application/vnd.svd": {
			"source": "iana",
			"extensions": ["svd"]
		},
		"application/vnd.swiftview-ics": { "source": "iana" },
		"application/vnd.sycle+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.syft+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.symbian.install": {
			"source": "apache",
			"extensions": ["sis", "sisx"]
		},
		"application/vnd.syncml+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["xsm"]
		},
		"application/vnd.syncml.dm+wbxml": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["bdm"]
		},
		"application/vnd.syncml.dm+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["xdm"]
		},
		"application/vnd.syncml.dm.notification": { "source": "iana" },
		"application/vnd.syncml.dmddf+wbxml": { "source": "iana" },
		"application/vnd.syncml.dmddf+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["ddf"]
		},
		"application/vnd.syncml.dmtnds+wbxml": { "source": "iana" },
		"application/vnd.syncml.dmtnds+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.syncml.ds.notification": { "source": "iana" },
		"application/vnd.tableschema+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.tao.intent-module-archive": {
			"source": "iana",
			"extensions": ["tao"]
		},
		"application/vnd.tcpdump.pcap": {
			"source": "iana",
			"extensions": [
				"pcap",
				"cap",
				"dmp"
			]
		},
		"application/vnd.think-cell.ppttc+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.tmd.mediaflex.api+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.tml": { "source": "iana" },
		"application/vnd.tmobile-livetv": {
			"source": "iana",
			"extensions": ["tmo"]
		},
		"application/vnd.tri.onesource": { "source": "iana" },
		"application/vnd.trid.tpt": {
			"source": "iana",
			"extensions": ["tpt"]
		},
		"application/vnd.triscape.mxs": {
			"source": "iana",
			"extensions": ["mxs"]
		},
		"application/vnd.trueapp": {
			"source": "iana",
			"extensions": ["tra"]
		},
		"application/vnd.truedoc": { "source": "iana" },
		"application/vnd.ubisoft.webplayer": { "source": "iana" },
		"application/vnd.ufdl": {
			"source": "iana",
			"extensions": ["ufd", "ufdl"]
		},
		"application/vnd.uiq.theme": {
			"source": "iana",
			"extensions": ["utz"]
		},
		"application/vnd.umajin": {
			"source": "iana",
			"extensions": ["umj"]
		},
		"application/vnd.unity": {
			"source": "iana",
			"extensions": ["unityweb"]
		},
		"application/vnd.uoml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["uoml"]
		},
		"application/vnd.uplanet.alert": { "source": "iana" },
		"application/vnd.uplanet.alert-wbxml": { "source": "iana" },
		"application/vnd.uplanet.bearer-choice": { "source": "iana" },
		"application/vnd.uplanet.bearer-choice-wbxml": { "source": "iana" },
		"application/vnd.uplanet.cacheop": { "source": "iana" },
		"application/vnd.uplanet.cacheop-wbxml": { "source": "iana" },
		"application/vnd.uplanet.channel": { "source": "iana" },
		"application/vnd.uplanet.channel-wbxml": { "source": "iana" },
		"application/vnd.uplanet.list": { "source": "iana" },
		"application/vnd.uplanet.list-wbxml": { "source": "iana" },
		"application/vnd.uplanet.listcmd": { "source": "iana" },
		"application/vnd.uplanet.listcmd-wbxml": { "source": "iana" },
		"application/vnd.uplanet.signal": { "source": "iana" },
		"application/vnd.uri-map": { "source": "iana" },
		"application/vnd.valve.source.material": { "source": "iana" },
		"application/vnd.vcx": {
			"source": "iana",
			"extensions": ["vcx"]
		},
		"application/vnd.vd-study": { "source": "iana" },
		"application/vnd.vectorworks": { "source": "iana" },
		"application/vnd.vel+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.verimatrix.vcas": { "source": "iana" },
		"application/vnd.veritone.aion+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.veryant.thin": { "source": "iana" },
		"application/vnd.ves.encrypted": { "source": "iana" },
		"application/vnd.vidsoft.vidconference": { "source": "iana" },
		"application/vnd.visio": {
			"source": "iana",
			"extensions": [
				"vsd",
				"vst",
				"vss",
				"vsw"
			]
		},
		"application/vnd.visionary": {
			"source": "iana",
			"extensions": ["vis"]
		},
		"application/vnd.vividence.scriptfile": { "source": "iana" },
		"application/vnd.vsf": {
			"source": "iana",
			"extensions": ["vsf"]
		},
		"application/vnd.wap.sic": { "source": "iana" },
		"application/vnd.wap.slc": { "source": "iana" },
		"application/vnd.wap.wbxml": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["wbxml"]
		},
		"application/vnd.wap.wmlc": {
			"source": "iana",
			"extensions": ["wmlc"]
		},
		"application/vnd.wap.wmlscriptc": {
			"source": "iana",
			"extensions": ["wmlsc"]
		},
		"application/vnd.webturbo": {
			"source": "iana",
			"extensions": ["wtb"]
		},
		"application/vnd.wfa.dpp": { "source": "iana" },
		"application/vnd.wfa.p2p": { "source": "iana" },
		"application/vnd.wfa.wsc": { "source": "iana" },
		"application/vnd.windows.devicepairing": { "source": "iana" },
		"application/vnd.wmc": { "source": "iana" },
		"application/vnd.wmf.bootstrap": { "source": "iana" },
		"application/vnd.wolfram.mathematica": { "source": "iana" },
		"application/vnd.wolfram.mathematica.package": { "source": "iana" },
		"application/vnd.wolfram.player": {
			"source": "iana",
			"extensions": ["nbp"]
		},
		"application/vnd.wordperfect": {
			"source": "iana",
			"extensions": ["wpd"]
		},
		"application/vnd.wqd": {
			"source": "iana",
			"extensions": ["wqd"]
		},
		"application/vnd.wrq-hp3000-labelled": { "source": "iana" },
		"application/vnd.wt.stf": {
			"source": "iana",
			"extensions": ["stf"]
		},
		"application/vnd.wv.csp+wbxml": { "source": "iana" },
		"application/vnd.wv.csp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.wv.ssp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.xacml+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.xara": {
			"source": "iana",
			"extensions": ["xar"]
		},
		"application/vnd.xfdl": {
			"source": "iana",
			"extensions": ["xfdl"]
		},
		"application/vnd.xfdl.webform": { "source": "iana" },
		"application/vnd.xmi+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.xmpie.cpkg": { "source": "iana" },
		"application/vnd.xmpie.dpkg": { "source": "iana" },
		"application/vnd.xmpie.plan": { "source": "iana" },
		"application/vnd.xmpie.ppkg": { "source": "iana" },
		"application/vnd.xmpie.xlim": { "source": "iana" },
		"application/vnd.yamaha.hv-dic": {
			"source": "iana",
			"extensions": ["hvd"]
		},
		"application/vnd.yamaha.hv-script": {
			"source": "iana",
			"extensions": ["hvs"]
		},
		"application/vnd.yamaha.hv-voice": {
			"source": "iana",
			"extensions": ["hvp"]
		},
		"application/vnd.yamaha.openscoreformat": {
			"source": "iana",
			"extensions": ["osf"]
		},
		"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["osfpvg"]
		},
		"application/vnd.yamaha.remote-setup": { "source": "iana" },
		"application/vnd.yamaha.smaf-audio": {
			"source": "iana",
			"extensions": ["saf"]
		},
		"application/vnd.yamaha.smaf-phrase": {
			"source": "iana",
			"extensions": ["spf"]
		},
		"application/vnd.yamaha.through-ngn": { "source": "iana" },
		"application/vnd.yamaha.tunnel-udpencap": { "source": "iana" },
		"application/vnd.yaoweme": { "source": "iana" },
		"application/vnd.yellowriver-custom-menu": {
			"source": "iana",
			"extensions": ["cmp"]
		},
		"application/vnd.youtube.yt": { "source": "iana" },
		"application/vnd.zul": {
			"source": "iana",
			"extensions": ["zir", "zirz"]
		},
		"application/vnd.zzazz.deck+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["zaz"]
		},
		"application/voicexml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["vxml"]
		},
		"application/voucher-cms+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vq-rtcpxr": { "source": "iana" },
		"application/wasm": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wasm"]
		},
		"application/watcherinfo+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wif"]
		},
		"application/webpush-options+json": {
			"source": "iana",
			"compressible": true
		},
		"application/whoispp-query": { "source": "iana" },
		"application/whoispp-response": { "source": "iana" },
		"application/widget": {
			"source": "iana",
			"extensions": ["wgt"]
		},
		"application/winhlp": {
			"source": "apache",
			"extensions": ["hlp"]
		},
		"application/wita": { "source": "iana" },
		"application/wordperfect5.1": { "source": "iana" },
		"application/wsdl+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wsdl"]
		},
		"application/wspolicy+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wspolicy"]
		},
		"application/x-7z-compressed": {
			"source": "apache",
			"compressible": false,
			"extensions": ["7z"]
		},
		"application/x-abiword": {
			"source": "apache",
			"extensions": ["abw"]
		},
		"application/x-ace-compressed": {
			"source": "apache",
			"extensions": ["ace"]
		},
		"application/x-amf": { "source": "apache" },
		"application/x-apple-diskimage": {
			"source": "apache",
			"extensions": ["dmg"]
		},
		"application/x-arj": {
			"compressible": false,
			"extensions": ["arj"]
		},
		"application/x-authorware-bin": {
			"source": "apache",
			"extensions": [
				"aab",
				"x32",
				"u32",
				"vox"
			]
		},
		"application/x-authorware-map": {
			"source": "apache",
			"extensions": ["aam"]
		},
		"application/x-authorware-seg": {
			"source": "apache",
			"extensions": ["aas"]
		},
		"application/x-bcpio": {
			"source": "apache",
			"extensions": ["bcpio"]
		},
		"application/x-bdoc": {
			"compressible": false,
			"extensions": ["bdoc"]
		},
		"application/x-bittorrent": {
			"source": "apache",
			"extensions": ["torrent"]
		},
		"application/x-blorb": {
			"source": "apache",
			"extensions": ["blb", "blorb"]
		},
		"application/x-bzip": {
			"source": "apache",
			"compressible": false,
			"extensions": ["bz"]
		},
		"application/x-bzip2": {
			"source": "apache",
			"compressible": false,
			"extensions": ["bz2", "boz"]
		},
		"application/x-cbr": {
			"source": "apache",
			"extensions": [
				"cbr",
				"cba",
				"cbt",
				"cbz",
				"cb7"
			]
		},
		"application/x-cdlink": {
			"source": "apache",
			"extensions": ["vcd"]
		},
		"application/x-cfs-compressed": {
			"source": "apache",
			"extensions": ["cfs"]
		},
		"application/x-chat": {
			"source": "apache",
			"extensions": ["chat"]
		},
		"application/x-chess-pgn": {
			"source": "apache",
			"extensions": ["pgn"]
		},
		"application/x-chrome-extension": { "extensions": ["crx"] },
		"application/x-cocoa": {
			"source": "nginx",
			"extensions": ["cco"]
		},
		"application/x-compress": { "source": "apache" },
		"application/x-conference": {
			"source": "apache",
			"extensions": ["nsc"]
		},
		"application/x-cpio": {
			"source": "apache",
			"extensions": ["cpio"]
		},
		"application/x-csh": {
			"source": "apache",
			"extensions": ["csh"]
		},
		"application/x-deb": { "compressible": false },
		"application/x-debian-package": {
			"source": "apache",
			"extensions": ["deb", "udeb"]
		},
		"application/x-dgc-compressed": {
			"source": "apache",
			"extensions": ["dgc"]
		},
		"application/x-director": {
			"source": "apache",
			"extensions": [
				"dir",
				"dcr",
				"dxr",
				"cst",
				"cct",
				"cxt",
				"w3d",
				"fgd",
				"swa"
			]
		},
		"application/x-doom": {
			"source": "apache",
			"extensions": ["wad"]
		},
		"application/x-dtbncx+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["ncx"]
		},
		"application/x-dtbook+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["dtb"]
		},
		"application/x-dtbresource+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["res"]
		},
		"application/x-dvi": {
			"source": "apache",
			"compressible": false,
			"extensions": ["dvi"]
		},
		"application/x-envoy": {
			"source": "apache",
			"extensions": ["evy"]
		},
		"application/x-eva": {
			"source": "apache",
			"extensions": ["eva"]
		},
		"application/x-font-bdf": {
			"source": "apache",
			"extensions": ["bdf"]
		},
		"application/x-font-dos": { "source": "apache" },
		"application/x-font-framemaker": { "source": "apache" },
		"application/x-font-ghostscript": {
			"source": "apache",
			"extensions": ["gsf"]
		},
		"application/x-font-libgrx": { "source": "apache" },
		"application/x-font-linux-psf": {
			"source": "apache",
			"extensions": ["psf"]
		},
		"application/x-font-pcf": {
			"source": "apache",
			"extensions": ["pcf"]
		},
		"application/x-font-snf": {
			"source": "apache",
			"extensions": ["snf"]
		},
		"application/x-font-speedo": { "source": "apache" },
		"application/x-font-sunos-news": { "source": "apache" },
		"application/x-font-type1": {
			"source": "apache",
			"extensions": [
				"pfa",
				"pfb",
				"pfm",
				"afm"
			]
		},
		"application/x-font-vfont": { "source": "apache" },
		"application/x-freearc": {
			"source": "apache",
			"extensions": ["arc"]
		},
		"application/x-futuresplash": {
			"source": "apache",
			"extensions": ["spl"]
		},
		"application/x-gca-compressed": {
			"source": "apache",
			"extensions": ["gca"]
		},
		"application/x-glulx": {
			"source": "apache",
			"extensions": ["ulx"]
		},
		"application/x-gnumeric": {
			"source": "apache",
			"extensions": ["gnumeric"]
		},
		"application/x-gramps-xml": {
			"source": "apache",
			"extensions": ["gramps"]
		},
		"application/x-gtar": {
			"source": "apache",
			"extensions": ["gtar"]
		},
		"application/x-gzip": { "source": "apache" },
		"application/x-hdf": {
			"source": "apache",
			"extensions": ["hdf"]
		},
		"application/x-httpd-php": {
			"compressible": true,
			"extensions": ["php"]
		},
		"application/x-install-instructions": {
			"source": "apache",
			"extensions": ["install"]
		},
		"application/x-iso9660-image": {
			"source": "apache",
			"extensions": ["iso"]
		},
		"application/x-iwork-keynote-sffkey": { "extensions": ["key"] },
		"application/x-iwork-numbers-sffnumbers": { "extensions": ["numbers"] },
		"application/x-iwork-pages-sffpages": { "extensions": ["pages"] },
		"application/x-java-archive-diff": {
			"source": "nginx",
			"extensions": ["jardiff"]
		},
		"application/x-java-jnlp-file": {
			"source": "apache",
			"compressible": false,
			"extensions": ["jnlp"]
		},
		"application/x-javascript": { "compressible": true },
		"application/x-keepass2": { "extensions": ["kdbx"] },
		"application/x-latex": {
			"source": "apache",
			"compressible": false,
			"extensions": ["latex"]
		},
		"application/x-lua-bytecode": { "extensions": ["luac"] },
		"application/x-lzh-compressed": {
			"source": "apache",
			"extensions": ["lzh", "lha"]
		},
		"application/x-makeself": {
			"source": "nginx",
			"extensions": ["run"]
		},
		"application/x-mie": {
			"source": "apache",
			"extensions": ["mie"]
		},
		"application/x-mobipocket-ebook": {
			"source": "apache",
			"extensions": ["prc", "mobi"]
		},
		"application/x-mpegurl": { "compressible": false },
		"application/x-ms-application": {
			"source": "apache",
			"extensions": ["application"]
		},
		"application/x-ms-shortcut": {
			"source": "apache",
			"extensions": ["lnk"]
		},
		"application/x-ms-wmd": {
			"source": "apache",
			"extensions": ["wmd"]
		},
		"application/x-ms-wmz": {
			"source": "apache",
			"extensions": ["wmz"]
		},
		"application/x-ms-xbap": {
			"source": "apache",
			"extensions": ["xbap"]
		},
		"application/x-msaccess": {
			"source": "apache",
			"extensions": ["mdb"]
		},
		"application/x-msbinder": {
			"source": "apache",
			"extensions": ["obd"]
		},
		"application/x-mscardfile": {
			"source": "apache",
			"extensions": ["crd"]
		},
		"application/x-msclip": {
			"source": "apache",
			"extensions": ["clp"]
		},
		"application/x-msdos-program": { "extensions": ["exe"] },
		"application/x-msdownload": {
			"source": "apache",
			"extensions": [
				"exe",
				"dll",
				"com",
				"bat",
				"msi"
			]
		},
		"application/x-msmediaview": {
			"source": "apache",
			"extensions": [
				"mvb",
				"m13",
				"m14"
			]
		},
		"application/x-msmetafile": {
			"source": "apache",
			"extensions": [
				"wmf",
				"wmz",
				"emf",
				"emz"
			]
		},
		"application/x-msmoney": {
			"source": "apache",
			"extensions": ["mny"]
		},
		"application/x-mspublisher": {
			"source": "apache",
			"extensions": ["pub"]
		},
		"application/x-msschedule": {
			"source": "apache",
			"extensions": ["scd"]
		},
		"application/x-msterminal": {
			"source": "apache",
			"extensions": ["trm"]
		},
		"application/x-mswrite": {
			"source": "apache",
			"extensions": ["wri"]
		},
		"application/x-netcdf": {
			"source": "apache",
			"extensions": ["nc", "cdf"]
		},
		"application/x-ns-proxy-autoconfig": {
			"compressible": true,
			"extensions": ["pac"]
		},
		"application/x-nzb": {
			"source": "apache",
			"extensions": ["nzb"]
		},
		"application/x-perl": {
			"source": "nginx",
			"extensions": ["pl", "pm"]
		},
		"application/x-pilot": {
			"source": "nginx",
			"extensions": ["prc", "pdb"]
		},
		"application/x-pkcs12": {
			"source": "apache",
			"compressible": false,
			"extensions": ["p12", "pfx"]
		},
		"application/x-pkcs7-certificates": {
			"source": "apache",
			"extensions": ["p7b", "spc"]
		},
		"application/x-pkcs7-certreqresp": {
			"source": "apache",
			"extensions": ["p7r"]
		},
		"application/x-pki-message": { "source": "iana" },
		"application/x-rar-compressed": {
			"source": "apache",
			"compressible": false,
			"extensions": ["rar"]
		},
		"application/x-redhat-package-manager": {
			"source": "nginx",
			"extensions": ["rpm"]
		},
		"application/x-research-info-systems": {
			"source": "apache",
			"extensions": ["ris"]
		},
		"application/x-sea": {
			"source": "nginx",
			"extensions": ["sea"]
		},
		"application/x-sh": {
			"source": "apache",
			"compressible": true,
			"extensions": ["sh"]
		},
		"application/x-shar": {
			"source": "apache",
			"extensions": ["shar"]
		},
		"application/x-shockwave-flash": {
			"source": "apache",
			"compressible": false,
			"extensions": ["swf"]
		},
		"application/x-silverlight-app": {
			"source": "apache",
			"extensions": ["xap"]
		},
		"application/x-sql": {
			"source": "apache",
			"extensions": ["sql"]
		},
		"application/x-stuffit": {
			"source": "apache",
			"compressible": false,
			"extensions": ["sit"]
		},
		"application/x-stuffitx": {
			"source": "apache",
			"extensions": ["sitx"]
		},
		"application/x-subrip": {
			"source": "apache",
			"extensions": ["srt"]
		},
		"application/x-sv4cpio": {
			"source": "apache",
			"extensions": ["sv4cpio"]
		},
		"application/x-sv4crc": {
			"source": "apache",
			"extensions": ["sv4crc"]
		},
		"application/x-t3vm-image": {
			"source": "apache",
			"extensions": ["t3"]
		},
		"application/x-tads": {
			"source": "apache",
			"extensions": ["gam"]
		},
		"application/x-tar": {
			"source": "apache",
			"compressible": true,
			"extensions": ["tar"]
		},
		"application/x-tcl": {
			"source": "apache",
			"extensions": ["tcl", "tk"]
		},
		"application/x-tex": {
			"source": "apache",
			"extensions": ["tex"]
		},
		"application/x-tex-tfm": {
			"source": "apache",
			"extensions": ["tfm"]
		},
		"application/x-texinfo": {
			"source": "apache",
			"extensions": ["texinfo", "texi"]
		},
		"application/x-tgif": {
			"source": "apache",
			"extensions": ["obj"]
		},
		"application/x-ustar": {
			"source": "apache",
			"extensions": ["ustar"]
		},
		"application/x-virtualbox-hdd": {
			"compressible": true,
			"extensions": ["hdd"]
		},
		"application/x-virtualbox-ova": {
			"compressible": true,
			"extensions": ["ova"]
		},
		"application/x-virtualbox-ovf": {
			"compressible": true,
			"extensions": ["ovf"]
		},
		"application/x-virtualbox-vbox": {
			"compressible": true,
			"extensions": ["vbox"]
		},
		"application/x-virtualbox-vbox-extpack": {
			"compressible": false,
			"extensions": ["vbox-extpack"]
		},
		"application/x-virtualbox-vdi": {
			"compressible": true,
			"extensions": ["vdi"]
		},
		"application/x-virtualbox-vhd": {
			"compressible": true,
			"extensions": ["vhd"]
		},
		"application/x-virtualbox-vmdk": {
			"compressible": true,
			"extensions": ["vmdk"]
		},
		"application/x-wais-source": {
			"source": "apache",
			"extensions": ["src"]
		},
		"application/x-web-app-manifest+json": {
			"compressible": true,
			"extensions": ["webapp"]
		},
		"application/x-www-form-urlencoded": {
			"source": "iana",
			"compressible": true
		},
		"application/x-x509-ca-cert": {
			"source": "iana",
			"extensions": [
				"der",
				"crt",
				"pem"
			]
		},
		"application/x-x509-ca-ra-cert": { "source": "iana" },
		"application/x-x509-next-ca-cert": { "source": "iana" },
		"application/x-xfig": {
			"source": "apache",
			"extensions": ["fig"]
		},
		"application/x-xliff+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xlf"]
		},
		"application/x-xpinstall": {
			"source": "apache",
			"compressible": false,
			"extensions": ["xpi"]
		},
		"application/x-xz": {
			"source": "apache",
			"extensions": ["xz"]
		},
		"application/x-zmachine": {
			"source": "apache",
			"extensions": [
				"z1",
				"z2",
				"z3",
				"z4",
				"z5",
				"z6",
				"z7",
				"z8"
			]
		},
		"application/x400-bp": { "source": "iana" },
		"application/xacml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xaml+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xaml"]
		},
		"application/xcap-att+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xav"]
		},
		"application/xcap-caps+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xca"]
		},
		"application/xcap-diff+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xdf"]
		},
		"application/xcap-el+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xel"]
		},
		"application/xcap-error+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xcap-ns+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xns"]
		},
		"application/xcon-conference-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xcon-conference-info-diff+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xenc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xenc"]
		},
		"application/xhtml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xhtml", "xht"]
		},
		"application/xhtml-voice+xml": {
			"source": "apache",
			"compressible": true
		},
		"application/xliff+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xlf"]
		},
		"application/xml": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"xml",
				"xsl",
				"xsd",
				"rng"
			]
		},
		"application/xml-dtd": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dtd"]
		},
		"application/xml-external-parsed-entity": { "source": "iana" },
		"application/xml-patch+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xmpp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xop+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xop"]
		},
		"application/xproc+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xpl"]
		},
		"application/xslt+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xsl", "xslt"]
		},
		"application/xspf+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xspf"]
		},
		"application/xv+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"mxml",
				"xhvml",
				"xvml",
				"xvm"
			]
		},
		"application/yang": {
			"source": "iana",
			"extensions": ["yang"]
		},
		"application/yang-data+json": {
			"source": "iana",
			"compressible": true
		},
		"application/yang-data+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/yang-patch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/yang-patch+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/yin+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["yin"]
		},
		"application/zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["zip"]
		},
		"application/zlib": { "source": "iana" },
		"application/zstd": { "source": "iana" },
		"audio/1d-interleaved-parityfec": { "source": "iana" },
		"audio/32kadpcm": { "source": "iana" },
		"audio/3gpp": {
			"source": "iana",
			"compressible": false,
			"extensions": ["3gpp"]
		},
		"audio/3gpp2": { "source": "iana" },
		"audio/aac": { "source": "iana" },
		"audio/ac3": { "source": "iana" },
		"audio/adpcm": {
			"source": "apache",
			"extensions": ["adp"]
		},
		"audio/amr": {
			"source": "iana",
			"extensions": ["amr"]
		},
		"audio/amr-wb": { "source": "iana" },
		"audio/amr-wb+": { "source": "iana" },
		"audio/aptx": { "source": "iana" },
		"audio/asc": { "source": "iana" },
		"audio/atrac-advanced-lossless": { "source": "iana" },
		"audio/atrac-x": { "source": "iana" },
		"audio/atrac3": { "source": "iana" },
		"audio/basic": {
			"source": "iana",
			"compressible": false,
			"extensions": ["au", "snd"]
		},
		"audio/bv16": { "source": "iana" },
		"audio/bv32": { "source": "iana" },
		"audio/clearmode": { "source": "iana" },
		"audio/cn": { "source": "iana" },
		"audio/dat12": { "source": "iana" },
		"audio/dls": { "source": "iana" },
		"audio/dsr-es201108": { "source": "iana" },
		"audio/dsr-es202050": { "source": "iana" },
		"audio/dsr-es202211": { "source": "iana" },
		"audio/dsr-es202212": { "source": "iana" },
		"audio/dv": { "source": "iana" },
		"audio/dvi4": { "source": "iana" },
		"audio/eac3": { "source": "iana" },
		"audio/encaprtp": { "source": "iana" },
		"audio/evrc": { "source": "iana" },
		"audio/evrc-qcp": { "source": "iana" },
		"audio/evrc0": { "source": "iana" },
		"audio/evrc1": { "source": "iana" },
		"audio/evrcb": { "source": "iana" },
		"audio/evrcb0": { "source": "iana" },
		"audio/evrcb1": { "source": "iana" },
		"audio/evrcnw": { "source": "iana" },
		"audio/evrcnw0": { "source": "iana" },
		"audio/evrcnw1": { "source": "iana" },
		"audio/evrcwb": { "source": "iana" },
		"audio/evrcwb0": { "source": "iana" },
		"audio/evrcwb1": { "source": "iana" },
		"audio/evs": { "source": "iana" },
		"audio/flexfec": { "source": "iana" },
		"audio/fwdred": { "source": "iana" },
		"audio/g711-0": { "source": "iana" },
		"audio/g719": { "source": "iana" },
		"audio/g722": { "source": "iana" },
		"audio/g7221": { "source": "iana" },
		"audio/g723": { "source": "iana" },
		"audio/g726-16": { "source": "iana" },
		"audio/g726-24": { "source": "iana" },
		"audio/g726-32": { "source": "iana" },
		"audio/g726-40": { "source": "iana" },
		"audio/g728": { "source": "iana" },
		"audio/g729": { "source": "iana" },
		"audio/g7291": { "source": "iana" },
		"audio/g729d": { "source": "iana" },
		"audio/g729e": { "source": "iana" },
		"audio/gsm": { "source": "iana" },
		"audio/gsm-efr": { "source": "iana" },
		"audio/gsm-hr-08": { "source": "iana" },
		"audio/ilbc": { "source": "iana" },
		"audio/ip-mr_v2.5": { "source": "iana" },
		"audio/isac": { "source": "apache" },
		"audio/l16": { "source": "iana" },
		"audio/l20": { "source": "iana" },
		"audio/l24": {
			"source": "iana",
			"compressible": false
		},
		"audio/l8": { "source": "iana" },
		"audio/lpc": { "source": "iana" },
		"audio/melp": { "source": "iana" },
		"audio/melp1200": { "source": "iana" },
		"audio/melp2400": { "source": "iana" },
		"audio/melp600": { "source": "iana" },
		"audio/mhas": { "source": "iana" },
		"audio/midi": {
			"source": "apache",
			"extensions": [
				"mid",
				"midi",
				"kar",
				"rmi"
			]
		},
		"audio/mobile-xmf": {
			"source": "iana",
			"extensions": ["mxmf"]
		},
		"audio/mp3": {
			"compressible": false,
			"extensions": ["mp3"]
		},
		"audio/mp4": {
			"source": "iana",
			"compressible": false,
			"extensions": ["m4a", "mp4a"]
		},
		"audio/mp4a-latm": { "source": "iana" },
		"audio/mpa": { "source": "iana" },
		"audio/mpa-robust": { "source": "iana" },
		"audio/mpeg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"mpga",
				"mp2",
				"mp2a",
				"mp3",
				"m2a",
				"m3a"
			]
		},
		"audio/mpeg4-generic": { "source": "iana" },
		"audio/musepack": { "source": "apache" },
		"audio/ogg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"oga",
				"ogg",
				"spx",
				"opus"
			]
		},
		"audio/opus": { "source": "iana" },
		"audio/parityfec": { "source": "iana" },
		"audio/pcma": { "source": "iana" },
		"audio/pcma-wb": { "source": "iana" },
		"audio/pcmu": { "source": "iana" },
		"audio/pcmu-wb": { "source": "iana" },
		"audio/prs.sid": { "source": "iana" },
		"audio/qcelp": { "source": "iana" },
		"audio/raptorfec": { "source": "iana" },
		"audio/red": { "source": "iana" },
		"audio/rtp-enc-aescm128": { "source": "iana" },
		"audio/rtp-midi": { "source": "iana" },
		"audio/rtploopback": { "source": "iana" },
		"audio/rtx": { "source": "iana" },
		"audio/s3m": {
			"source": "apache",
			"extensions": ["s3m"]
		},
		"audio/scip": { "source": "iana" },
		"audio/silk": {
			"source": "apache",
			"extensions": ["sil"]
		},
		"audio/smv": { "source": "iana" },
		"audio/smv-qcp": { "source": "iana" },
		"audio/smv0": { "source": "iana" },
		"audio/sofa": { "source": "iana" },
		"audio/sp-midi": { "source": "iana" },
		"audio/speex": { "source": "iana" },
		"audio/t140c": { "source": "iana" },
		"audio/t38": { "source": "iana" },
		"audio/telephone-event": { "source": "iana" },
		"audio/tetra_acelp": { "source": "iana" },
		"audio/tetra_acelp_bb": { "source": "iana" },
		"audio/tone": { "source": "iana" },
		"audio/tsvcis": { "source": "iana" },
		"audio/uemclip": { "source": "iana" },
		"audio/ulpfec": { "source": "iana" },
		"audio/usac": { "source": "iana" },
		"audio/vdvi": { "source": "iana" },
		"audio/vmr-wb": { "source": "iana" },
		"audio/vnd.3gpp.iufp": { "source": "iana" },
		"audio/vnd.4sb": { "source": "iana" },
		"audio/vnd.audiokoz": { "source": "iana" },
		"audio/vnd.celp": { "source": "iana" },
		"audio/vnd.cisco.nse": { "source": "iana" },
		"audio/vnd.cmles.radio-events": { "source": "iana" },
		"audio/vnd.cns.anp1": { "source": "iana" },
		"audio/vnd.cns.inf1": { "source": "iana" },
		"audio/vnd.dece.audio": {
			"source": "iana",
			"extensions": ["uva", "uvva"]
		},
		"audio/vnd.digital-winds": {
			"source": "iana",
			"extensions": ["eol"]
		},
		"audio/vnd.dlna.adts": { "source": "iana" },
		"audio/vnd.dolby.heaac.1": { "source": "iana" },
		"audio/vnd.dolby.heaac.2": { "source": "iana" },
		"audio/vnd.dolby.mlp": { "source": "iana" },
		"audio/vnd.dolby.mps": { "source": "iana" },
		"audio/vnd.dolby.pl2": { "source": "iana" },
		"audio/vnd.dolby.pl2x": { "source": "iana" },
		"audio/vnd.dolby.pl2z": { "source": "iana" },
		"audio/vnd.dolby.pulse.1": { "source": "iana" },
		"audio/vnd.dra": {
			"source": "iana",
			"extensions": ["dra"]
		},
		"audio/vnd.dts": {
			"source": "iana",
			"extensions": ["dts"]
		},
		"audio/vnd.dts.hd": {
			"source": "iana",
			"extensions": ["dtshd"]
		},
		"audio/vnd.dts.uhd": { "source": "iana" },
		"audio/vnd.dvb.file": { "source": "iana" },
		"audio/vnd.everad.plj": { "source": "iana" },
		"audio/vnd.hns.audio": { "source": "iana" },
		"audio/vnd.lucent.voice": {
			"source": "iana",
			"extensions": ["lvp"]
		},
		"audio/vnd.ms-playready.media.pya": {
			"source": "iana",
			"extensions": ["pya"]
		},
		"audio/vnd.nokia.mobile-xmf": { "source": "iana" },
		"audio/vnd.nortel.vbk": { "source": "iana" },
		"audio/vnd.nuera.ecelp4800": {
			"source": "iana",
			"extensions": ["ecelp4800"]
		},
		"audio/vnd.nuera.ecelp7470": {
			"source": "iana",
			"extensions": ["ecelp7470"]
		},
		"audio/vnd.nuera.ecelp9600": {
			"source": "iana",
			"extensions": ["ecelp9600"]
		},
		"audio/vnd.octel.sbc": { "source": "iana" },
		"audio/vnd.presonus.multitrack": { "source": "iana" },
		"audio/vnd.qcelp": { "source": "iana" },
		"audio/vnd.rhetorex.32kadpcm": { "source": "iana" },
		"audio/vnd.rip": {
			"source": "iana",
			"extensions": ["rip"]
		},
		"audio/vnd.rn-realaudio": { "compressible": false },
		"audio/vnd.sealedmedia.softseal.mpeg": { "source": "iana" },
		"audio/vnd.vmx.cvsd": { "source": "iana" },
		"audio/vnd.wave": { "compressible": false },
		"audio/vorbis": {
			"source": "iana",
			"compressible": false
		},
		"audio/vorbis-config": { "source": "iana" },
		"audio/wav": {
			"compressible": false,
			"extensions": ["wav"]
		},
		"audio/wave": {
			"compressible": false,
			"extensions": ["wav"]
		},
		"audio/webm": {
			"source": "apache",
			"compressible": false,
			"extensions": ["weba"]
		},
		"audio/x-aac": {
			"source": "apache",
			"compressible": false,
			"extensions": ["aac"]
		},
		"audio/x-aiff": {
			"source": "apache",
			"extensions": [
				"aif",
				"aiff",
				"aifc"
			]
		},
		"audio/x-caf": {
			"source": "apache",
			"compressible": false,
			"extensions": ["caf"]
		},
		"audio/x-flac": {
			"source": "apache",
			"extensions": ["flac"]
		},
		"audio/x-m4a": {
			"source": "nginx",
			"extensions": ["m4a"]
		},
		"audio/x-matroska": {
			"source": "apache",
			"extensions": ["mka"]
		},
		"audio/x-mpegurl": {
			"source": "apache",
			"extensions": ["m3u"]
		},
		"audio/x-ms-wax": {
			"source": "apache",
			"extensions": ["wax"]
		},
		"audio/x-ms-wma": {
			"source": "apache",
			"extensions": ["wma"]
		},
		"audio/x-pn-realaudio": {
			"source": "apache",
			"extensions": ["ram", "ra"]
		},
		"audio/x-pn-realaudio-plugin": {
			"source": "apache",
			"extensions": ["rmp"]
		},
		"audio/x-realaudio": {
			"source": "nginx",
			"extensions": ["ra"]
		},
		"audio/x-tta": { "source": "apache" },
		"audio/x-wav": {
			"source": "apache",
			"extensions": ["wav"]
		},
		"audio/xm": {
			"source": "apache",
			"extensions": ["xm"]
		},
		"chemical/x-cdx": {
			"source": "apache",
			"extensions": ["cdx"]
		},
		"chemical/x-cif": {
			"source": "apache",
			"extensions": ["cif"]
		},
		"chemical/x-cmdf": {
			"source": "apache",
			"extensions": ["cmdf"]
		},
		"chemical/x-cml": {
			"source": "apache",
			"extensions": ["cml"]
		},
		"chemical/x-csml": {
			"source": "apache",
			"extensions": ["csml"]
		},
		"chemical/x-pdb": { "source": "apache" },
		"chemical/x-xyz": {
			"source": "apache",
			"extensions": ["xyz"]
		},
		"font/collection": {
			"source": "iana",
			"extensions": ["ttc"]
		},
		"font/otf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["otf"]
		},
		"font/sfnt": { "source": "iana" },
		"font/ttf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ttf"]
		},
		"font/woff": {
			"source": "iana",
			"extensions": ["woff"]
		},
		"font/woff2": {
			"source": "iana",
			"extensions": ["woff2"]
		},
		"image/aces": {
			"source": "iana",
			"extensions": ["exr"]
		},
		"image/apng": {
			"compressible": false,
			"extensions": ["apng"]
		},
		"image/avci": {
			"source": "iana",
			"extensions": ["avci"]
		},
		"image/avcs": {
			"source": "iana",
			"extensions": ["avcs"]
		},
		"image/avif": {
			"source": "iana",
			"compressible": false,
			"extensions": ["avif"]
		},
		"image/bmp": {
			"source": "iana",
			"compressible": true,
			"extensions": ["bmp"]
		},
		"image/cgm": {
			"source": "iana",
			"extensions": ["cgm"]
		},
		"image/dicom-rle": {
			"source": "iana",
			"extensions": ["drle"]
		},
		"image/emf": {
			"source": "iana",
			"extensions": ["emf"]
		},
		"image/fits": {
			"source": "iana",
			"extensions": ["fits"]
		},
		"image/g3fax": {
			"source": "iana",
			"extensions": ["g3"]
		},
		"image/gif": {
			"source": "iana",
			"compressible": false,
			"extensions": ["gif"]
		},
		"image/heic": {
			"source": "iana",
			"extensions": ["heic"]
		},
		"image/heic-sequence": {
			"source": "iana",
			"extensions": ["heics"]
		},
		"image/heif": {
			"source": "iana",
			"extensions": ["heif"]
		},
		"image/heif-sequence": {
			"source": "iana",
			"extensions": ["heifs"]
		},
		"image/hej2k": {
			"source": "iana",
			"extensions": ["hej2"]
		},
		"image/hsj2": {
			"source": "iana",
			"extensions": ["hsj2"]
		},
		"image/ief": {
			"source": "iana",
			"extensions": ["ief"]
		},
		"image/jls": {
			"source": "iana",
			"extensions": ["jls"]
		},
		"image/jp2": {
			"source": "iana",
			"compressible": false,
			"extensions": ["jp2", "jpg2"]
		},
		"image/jpeg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"jpeg",
				"jpg",
				"jpe"
			]
		},
		"image/jph": {
			"source": "iana",
			"extensions": ["jph"]
		},
		"image/jphc": {
			"source": "iana",
			"extensions": ["jhc"]
		},
		"image/jpm": {
			"source": "iana",
			"compressible": false,
			"extensions": ["jpm"]
		},
		"image/jpx": {
			"source": "iana",
			"compressible": false,
			"extensions": ["jpx", "jpf"]
		},
		"image/jxr": {
			"source": "iana",
			"extensions": ["jxr"]
		},
		"image/jxra": {
			"source": "iana",
			"extensions": ["jxra"]
		},
		"image/jxrs": {
			"source": "iana",
			"extensions": ["jxrs"]
		},
		"image/jxs": {
			"source": "iana",
			"extensions": ["jxs"]
		},
		"image/jxsc": {
			"source": "iana",
			"extensions": ["jxsc"]
		},
		"image/jxsi": {
			"source": "iana",
			"extensions": ["jxsi"]
		},
		"image/jxss": {
			"source": "iana",
			"extensions": ["jxss"]
		},
		"image/ktx": {
			"source": "iana",
			"extensions": ["ktx"]
		},
		"image/ktx2": {
			"source": "iana",
			"extensions": ["ktx2"]
		},
		"image/naplps": { "source": "iana" },
		"image/pjpeg": { "compressible": false },
		"image/png": {
			"source": "iana",
			"compressible": false,
			"extensions": ["png"]
		},
		"image/prs.btif": {
			"source": "iana",
			"extensions": ["btif"]
		},
		"image/prs.pti": {
			"source": "iana",
			"extensions": ["pti"]
		},
		"image/pwg-raster": { "source": "iana" },
		"image/sgi": {
			"source": "apache",
			"extensions": ["sgi"]
		},
		"image/svg+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["svg", "svgz"]
		},
		"image/t38": {
			"source": "iana",
			"extensions": ["t38"]
		},
		"image/tiff": {
			"source": "iana",
			"compressible": false,
			"extensions": ["tif", "tiff"]
		},
		"image/tiff-fx": {
			"source": "iana",
			"extensions": ["tfx"]
		},
		"image/vnd.adobe.photoshop": {
			"source": "iana",
			"compressible": true,
			"extensions": ["psd"]
		},
		"image/vnd.airzip.accelerator.azv": {
			"source": "iana",
			"extensions": ["azv"]
		},
		"image/vnd.cns.inf2": { "source": "iana" },
		"image/vnd.dece.graphic": {
			"source": "iana",
			"extensions": [
				"uvi",
				"uvvi",
				"uvg",
				"uvvg"
			]
		},
		"image/vnd.djvu": {
			"source": "iana",
			"extensions": ["djvu", "djv"]
		},
		"image/vnd.dvb.subtitle": {
			"source": "iana",
			"extensions": ["sub"]
		},
		"image/vnd.dwg": {
			"source": "iana",
			"extensions": ["dwg"]
		},
		"image/vnd.dxf": {
			"source": "iana",
			"extensions": ["dxf"]
		},
		"image/vnd.fastbidsheet": {
			"source": "iana",
			"extensions": ["fbs"]
		},
		"image/vnd.fpx": {
			"source": "iana",
			"extensions": ["fpx"]
		},
		"image/vnd.fst": {
			"source": "iana",
			"extensions": ["fst"]
		},
		"image/vnd.fujixerox.edmics-mmr": {
			"source": "iana",
			"extensions": ["mmr"]
		},
		"image/vnd.fujixerox.edmics-rlc": {
			"source": "iana",
			"extensions": ["rlc"]
		},
		"image/vnd.globalgraphics.pgb": { "source": "iana" },
		"image/vnd.microsoft.icon": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ico"]
		},
		"image/vnd.mix": { "source": "iana" },
		"image/vnd.mozilla.apng": { "source": "iana" },
		"image/vnd.ms-dds": {
			"compressible": true,
			"extensions": ["dds"]
		},
		"image/vnd.ms-modi": {
			"source": "iana",
			"extensions": ["mdi"]
		},
		"image/vnd.ms-photo": {
			"source": "apache",
			"extensions": ["wdp"]
		},
		"image/vnd.net-fpx": {
			"source": "iana",
			"extensions": ["npx"]
		},
		"image/vnd.pco.b16": {
			"source": "iana",
			"extensions": ["b16"]
		},
		"image/vnd.radiance": { "source": "iana" },
		"image/vnd.sealed.png": { "source": "iana" },
		"image/vnd.sealedmedia.softseal.gif": { "source": "iana" },
		"image/vnd.sealedmedia.softseal.jpg": { "source": "iana" },
		"image/vnd.svf": { "source": "iana" },
		"image/vnd.tencent.tap": {
			"source": "iana",
			"extensions": ["tap"]
		},
		"image/vnd.valve.source.texture": {
			"source": "iana",
			"extensions": ["vtf"]
		},
		"image/vnd.wap.wbmp": {
			"source": "iana",
			"extensions": ["wbmp"]
		},
		"image/vnd.xiff": {
			"source": "iana",
			"extensions": ["xif"]
		},
		"image/vnd.zbrush.pcx": {
			"source": "iana",
			"extensions": ["pcx"]
		},
		"image/webp": {
			"source": "apache",
			"extensions": ["webp"]
		},
		"image/wmf": {
			"source": "iana",
			"extensions": ["wmf"]
		},
		"image/x-3ds": {
			"source": "apache",
			"extensions": ["3ds"]
		},
		"image/x-cmu-raster": {
			"source": "apache",
			"extensions": ["ras"]
		},
		"image/x-cmx": {
			"source": "apache",
			"extensions": ["cmx"]
		},
		"image/x-freehand": {
			"source": "apache",
			"extensions": [
				"fh",
				"fhc",
				"fh4",
				"fh5",
				"fh7"
			]
		},
		"image/x-icon": {
			"source": "apache",
			"compressible": true,
			"extensions": ["ico"]
		},
		"image/x-jng": {
			"source": "nginx",
			"extensions": ["jng"]
		},
		"image/x-mrsid-image": {
			"source": "apache",
			"extensions": ["sid"]
		},
		"image/x-ms-bmp": {
			"source": "nginx",
			"compressible": true,
			"extensions": ["bmp"]
		},
		"image/x-pcx": {
			"source": "apache",
			"extensions": ["pcx"]
		},
		"image/x-pict": {
			"source": "apache",
			"extensions": ["pic", "pct"]
		},
		"image/x-portable-anymap": {
			"source": "apache",
			"extensions": ["pnm"]
		},
		"image/x-portable-bitmap": {
			"source": "apache",
			"extensions": ["pbm"]
		},
		"image/x-portable-graymap": {
			"source": "apache",
			"extensions": ["pgm"]
		},
		"image/x-portable-pixmap": {
			"source": "apache",
			"extensions": ["ppm"]
		},
		"image/x-rgb": {
			"source": "apache",
			"extensions": ["rgb"]
		},
		"image/x-tga": {
			"source": "apache",
			"extensions": ["tga"]
		},
		"image/x-xbitmap": {
			"source": "apache",
			"extensions": ["xbm"]
		},
		"image/x-xcf": { "compressible": false },
		"image/x-xpixmap": {
			"source": "apache",
			"extensions": ["xpm"]
		},
		"image/x-xwindowdump": {
			"source": "apache",
			"extensions": ["xwd"]
		},
		"message/cpim": { "source": "iana" },
		"message/delivery-status": { "source": "iana" },
		"message/disposition-notification": {
			"source": "iana",
			"extensions": ["disposition-notification"]
		},
		"message/external-body": { "source": "iana" },
		"message/feedback-report": { "source": "iana" },
		"message/global": {
			"source": "iana",
			"extensions": ["u8msg"]
		},
		"message/global-delivery-status": {
			"source": "iana",
			"extensions": ["u8dsn"]
		},
		"message/global-disposition-notification": {
			"source": "iana",
			"extensions": ["u8mdn"]
		},
		"message/global-headers": {
			"source": "iana",
			"extensions": ["u8hdr"]
		},
		"message/http": {
			"source": "iana",
			"compressible": false
		},
		"message/imdn+xml": {
			"source": "iana",
			"compressible": true
		},
		"message/news": { "source": "iana" },
		"message/partial": {
			"source": "iana",
			"compressible": false
		},
		"message/rfc822": {
			"source": "iana",
			"compressible": true,
			"extensions": ["eml", "mime"]
		},
		"message/s-http": { "source": "iana" },
		"message/sip": { "source": "iana" },
		"message/sipfrag": { "source": "iana" },
		"message/tracking-status": { "source": "iana" },
		"message/vnd.si.simp": { "source": "iana" },
		"message/vnd.wfa.wsc": {
			"source": "iana",
			"extensions": ["wsc"]
		},
		"model/3mf": {
			"source": "iana",
			"extensions": ["3mf"]
		},
		"model/e57": { "source": "iana" },
		"model/gltf+json": {
			"source": "iana",
			"compressible": true,
			"extensions": ["gltf"]
		},
		"model/gltf-binary": {
			"source": "iana",
			"compressible": true,
			"extensions": ["glb"]
		},
		"model/iges": {
			"source": "iana",
			"compressible": false,
			"extensions": ["igs", "iges"]
		},
		"model/mesh": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"msh",
				"mesh",
				"silo"
			]
		},
		"model/mtl": {
			"source": "iana",
			"extensions": ["mtl"]
		},
		"model/obj": {
			"source": "iana",
			"extensions": ["obj"]
		},
		"model/step": { "source": "iana" },
		"model/step+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["stpx"]
		},
		"model/step+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["stpz"]
		},
		"model/step-xml+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["stpxz"]
		},
		"model/stl": {
			"source": "iana",
			"extensions": ["stl"]
		},
		"model/vnd.collada+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dae"]
		},
		"model/vnd.dwf": {
			"source": "iana",
			"extensions": ["dwf"]
		},
		"model/vnd.flatland.3dml": { "source": "iana" },
		"model/vnd.gdl": {
			"source": "iana",
			"extensions": ["gdl"]
		},
		"model/vnd.gs-gdl": { "source": "apache" },
		"model/vnd.gs.gdl": { "source": "iana" },
		"model/vnd.gtw": {
			"source": "iana",
			"extensions": ["gtw"]
		},
		"model/vnd.moml+xml": {
			"source": "iana",
			"compressible": true
		},
		"model/vnd.mts": {
			"source": "iana",
			"extensions": ["mts"]
		},
		"model/vnd.opengex": {
			"source": "iana",
			"extensions": ["ogex"]
		},
		"model/vnd.parasolid.transmit.binary": {
			"source": "iana",
			"extensions": ["x_b"]
		},
		"model/vnd.parasolid.transmit.text": {
			"source": "iana",
			"extensions": ["x_t"]
		},
		"model/vnd.pytha.pyox": { "source": "iana" },
		"model/vnd.rosette.annotated-data-model": { "source": "iana" },
		"model/vnd.sap.vds": {
			"source": "iana",
			"extensions": ["vds"]
		},
		"model/vnd.usdz+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["usdz"]
		},
		"model/vnd.valve.source.compiled-map": {
			"source": "iana",
			"extensions": ["bsp"]
		},
		"model/vnd.vtu": {
			"source": "iana",
			"extensions": ["vtu"]
		},
		"model/vrml": {
			"source": "iana",
			"compressible": false,
			"extensions": ["wrl", "vrml"]
		},
		"model/x3d+binary": {
			"source": "apache",
			"compressible": false,
			"extensions": ["x3db", "x3dbz"]
		},
		"model/x3d+fastinfoset": {
			"source": "iana",
			"extensions": ["x3db"]
		},
		"model/x3d+vrml": {
			"source": "apache",
			"compressible": false,
			"extensions": ["x3dv", "x3dvz"]
		},
		"model/x3d+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["x3d", "x3dz"]
		},
		"model/x3d-vrml": {
			"source": "iana",
			"extensions": ["x3dv"]
		},
		"multipart/alternative": {
			"source": "iana",
			"compressible": false
		},
		"multipart/appledouble": { "source": "iana" },
		"multipart/byteranges": { "source": "iana" },
		"multipart/digest": { "source": "iana" },
		"multipart/encrypted": {
			"source": "iana",
			"compressible": false
		},
		"multipart/form-data": {
			"source": "iana",
			"compressible": false
		},
		"multipart/header-set": { "source": "iana" },
		"multipart/mixed": { "source": "iana" },
		"multipart/multilingual": { "source": "iana" },
		"multipart/parallel": { "source": "iana" },
		"multipart/related": {
			"source": "iana",
			"compressible": false
		},
		"multipart/report": { "source": "iana" },
		"multipart/signed": {
			"source": "iana",
			"compressible": false
		},
		"multipart/vnd.bint.med-plus": { "source": "iana" },
		"multipart/voice-message": { "source": "iana" },
		"multipart/x-mixed-replace": { "source": "iana" },
		"text/1d-interleaved-parityfec": { "source": "iana" },
		"text/cache-manifest": {
			"source": "iana",
			"compressible": true,
			"extensions": ["appcache", "manifest"]
		},
		"text/calendar": {
			"source": "iana",
			"extensions": ["ics", "ifb"]
		},
		"text/calender": { "compressible": true },
		"text/cmd": { "compressible": true },
		"text/coffeescript": { "extensions": ["coffee", "litcoffee"] },
		"text/cql": { "source": "iana" },
		"text/cql-expression": { "source": "iana" },
		"text/cql-identifier": { "source": "iana" },
		"text/css": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["css"]
		},
		"text/csv": {
			"source": "iana",
			"compressible": true,
			"extensions": ["csv"]
		},
		"text/csv-schema": { "source": "iana" },
		"text/directory": { "source": "iana" },
		"text/dns": { "source": "iana" },
		"text/ecmascript": { "source": "iana" },
		"text/encaprtp": { "source": "iana" },
		"text/enriched": { "source": "iana" },
		"text/fhirpath": { "source": "iana" },
		"text/flexfec": { "source": "iana" },
		"text/fwdred": { "source": "iana" },
		"text/gff3": { "source": "iana" },
		"text/grammar-ref-list": { "source": "iana" },
		"text/html": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"html",
				"htm",
				"shtml"
			]
		},
		"text/jade": { "extensions": ["jade"] },
		"text/javascript": {
			"source": "iana",
			"compressible": true
		},
		"text/jcr-cnd": { "source": "iana" },
		"text/jsx": {
			"compressible": true,
			"extensions": ["jsx"]
		},
		"text/less": {
			"compressible": true,
			"extensions": ["less"]
		},
		"text/markdown": {
			"source": "iana",
			"compressible": true,
			"extensions": ["markdown", "md"]
		},
		"text/mathml": {
			"source": "nginx",
			"extensions": ["mml"]
		},
		"text/mdx": {
			"compressible": true,
			"extensions": ["mdx"]
		},
		"text/mizar": { "source": "iana" },
		"text/n3": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["n3"]
		},
		"text/parameters": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/parityfec": { "source": "iana" },
		"text/plain": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"txt",
				"text",
				"conf",
				"def",
				"list",
				"log",
				"in",
				"ini"
			]
		},
		"text/provenance-notation": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/prs.fallenstein.rst": { "source": "iana" },
		"text/prs.lines.tag": {
			"source": "iana",
			"extensions": ["dsc"]
		},
		"text/prs.prop.logic": { "source": "iana" },
		"text/raptorfec": { "source": "iana" },
		"text/red": { "source": "iana" },
		"text/rfc822-headers": { "source": "iana" },
		"text/richtext": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rtx"]
		},
		"text/rtf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rtf"]
		},
		"text/rtp-enc-aescm128": { "source": "iana" },
		"text/rtploopback": { "source": "iana" },
		"text/rtx": { "source": "iana" },
		"text/sgml": {
			"source": "iana",
			"extensions": ["sgml", "sgm"]
		},
		"text/shaclc": { "source": "iana" },
		"text/shex": {
			"source": "iana",
			"extensions": ["shex"]
		},
		"text/slim": { "extensions": ["slim", "slm"] },
		"text/spdx": {
			"source": "iana",
			"extensions": ["spdx"]
		},
		"text/strings": { "source": "iana" },
		"text/stylus": { "extensions": ["stylus", "styl"] },
		"text/t140": { "source": "iana" },
		"text/tab-separated-values": {
			"source": "iana",
			"compressible": true,
			"extensions": ["tsv"]
		},
		"text/troff": {
			"source": "iana",
			"extensions": [
				"t",
				"tr",
				"roff",
				"man",
				"me",
				"ms"
			]
		},
		"text/turtle": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["ttl"]
		},
		"text/ulpfec": { "source": "iana" },
		"text/uri-list": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"uri",
				"uris",
				"urls"
			]
		},
		"text/vcard": {
			"source": "iana",
			"compressible": true,
			"extensions": ["vcard"]
		},
		"text/vnd.a": { "source": "iana" },
		"text/vnd.abc": { "source": "iana" },
		"text/vnd.ascii-art": { "source": "iana" },
		"text/vnd.curl": {
			"source": "iana",
			"extensions": ["curl"]
		},
		"text/vnd.curl.dcurl": {
			"source": "apache",
			"extensions": ["dcurl"]
		},
		"text/vnd.curl.mcurl": {
			"source": "apache",
			"extensions": ["mcurl"]
		},
		"text/vnd.curl.scurl": {
			"source": "apache",
			"extensions": ["scurl"]
		},
		"text/vnd.debian.copyright": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/vnd.dmclientscript": { "source": "iana" },
		"text/vnd.dvb.subtitle": {
			"source": "iana",
			"extensions": ["sub"]
		},
		"text/vnd.esmertec.theme-descriptor": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/vnd.familysearch.gedcom": {
			"source": "iana",
			"extensions": ["ged"]
		},
		"text/vnd.ficlab.flt": { "source": "iana" },
		"text/vnd.fly": {
			"source": "iana",
			"extensions": ["fly"]
		},
		"text/vnd.fmi.flexstor": {
			"source": "iana",
			"extensions": ["flx"]
		},
		"text/vnd.gml": { "source": "iana" },
		"text/vnd.graphviz": {
			"source": "iana",
			"extensions": ["gv"]
		},
		"text/vnd.hans": { "source": "iana" },
		"text/vnd.hgl": { "source": "iana" },
		"text/vnd.in3d.3dml": {
			"source": "iana",
			"extensions": ["3dml"]
		},
		"text/vnd.in3d.spot": {
			"source": "iana",
			"extensions": ["spot"]
		},
		"text/vnd.iptc.newsml": { "source": "iana" },
		"text/vnd.iptc.nitf": { "source": "iana" },
		"text/vnd.latex-z": { "source": "iana" },
		"text/vnd.motorola.reflex": { "source": "iana" },
		"text/vnd.ms-mediapackage": { "source": "iana" },
		"text/vnd.net2phone.commcenter.command": { "source": "iana" },
		"text/vnd.radisys.msml-basic-layout": { "source": "iana" },
		"text/vnd.senx.warpscript": { "source": "iana" },
		"text/vnd.si.uricatalogue": { "source": "iana" },
		"text/vnd.sosi": { "source": "iana" },
		"text/vnd.sun.j2me.app-descriptor": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["jad"]
		},
		"text/vnd.trolltech.linguist": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/vnd.wap.si": { "source": "iana" },
		"text/vnd.wap.sl": { "source": "iana" },
		"text/vnd.wap.wml": {
			"source": "iana",
			"extensions": ["wml"]
		},
		"text/vnd.wap.wmlscript": {
			"source": "iana",
			"extensions": ["wmls"]
		},
		"text/vtt": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["vtt"]
		},
		"text/x-asm": {
			"source": "apache",
			"extensions": ["s", "asm"]
		},
		"text/x-c": {
			"source": "apache",
			"extensions": [
				"c",
				"cc",
				"cxx",
				"cpp",
				"h",
				"hh",
				"dic"
			]
		},
		"text/x-component": {
			"source": "nginx",
			"extensions": ["htc"]
		},
		"text/x-fortran": {
			"source": "apache",
			"extensions": [
				"f",
				"for",
				"f77",
				"f90"
			]
		},
		"text/x-gwt-rpc": { "compressible": true },
		"text/x-handlebars-template": { "extensions": ["hbs"] },
		"text/x-java-source": {
			"source": "apache",
			"extensions": ["java"]
		},
		"text/x-jquery-tmpl": { "compressible": true },
		"text/x-lua": { "extensions": ["lua"] },
		"text/x-markdown": {
			"compressible": true,
			"extensions": ["mkd"]
		},
		"text/x-nfo": {
			"source": "apache",
			"extensions": ["nfo"]
		},
		"text/x-opml": {
			"source": "apache",
			"extensions": ["opml"]
		},
		"text/x-org": {
			"compressible": true,
			"extensions": ["org"]
		},
		"text/x-pascal": {
			"source": "apache",
			"extensions": ["p", "pas"]
		},
		"text/x-processing": {
			"compressible": true,
			"extensions": ["pde"]
		},
		"text/x-sass": { "extensions": ["sass"] },
		"text/x-scss": { "extensions": ["scss"] },
		"text/x-setext": {
			"source": "apache",
			"extensions": ["etx"]
		},
		"text/x-sfv": {
			"source": "apache",
			"extensions": ["sfv"]
		},
		"text/x-suse-ymp": {
			"compressible": true,
			"extensions": ["ymp"]
		},
		"text/x-uuencode": {
			"source": "apache",
			"extensions": ["uu"]
		},
		"text/x-vcalendar": {
			"source": "apache",
			"extensions": ["vcs"]
		},
		"text/x-vcard": {
			"source": "apache",
			"extensions": ["vcf"]
		},
		"text/xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xml"]
		},
		"text/xml-external-parsed-entity": { "source": "iana" },
		"text/yaml": {
			"compressible": true,
			"extensions": ["yaml", "yml"]
		},
		"video/1d-interleaved-parityfec": { "source": "iana" },
		"video/3gpp": {
			"source": "iana",
			"extensions": ["3gp", "3gpp"]
		},
		"video/3gpp-tt": { "source": "iana" },
		"video/3gpp2": {
			"source": "iana",
			"extensions": ["3g2"]
		},
		"video/av1": { "source": "iana" },
		"video/bmpeg": { "source": "iana" },
		"video/bt656": { "source": "iana" },
		"video/celb": { "source": "iana" },
		"video/dv": { "source": "iana" },
		"video/encaprtp": { "source": "iana" },
		"video/ffv1": { "source": "iana" },
		"video/flexfec": { "source": "iana" },
		"video/h261": {
			"source": "iana",
			"extensions": ["h261"]
		},
		"video/h263": {
			"source": "iana",
			"extensions": ["h263"]
		},
		"video/h263-1998": { "source": "iana" },
		"video/h263-2000": { "source": "iana" },
		"video/h264": {
			"source": "iana",
			"extensions": ["h264"]
		},
		"video/h264-rcdo": { "source": "iana" },
		"video/h264-svc": { "source": "iana" },
		"video/h265": { "source": "iana" },
		"video/iso.segment": {
			"source": "iana",
			"extensions": ["m4s"]
		},
		"video/jpeg": {
			"source": "iana",
			"extensions": ["jpgv"]
		},
		"video/jpeg2000": { "source": "iana" },
		"video/jpm": {
			"source": "apache",
			"extensions": ["jpm", "jpgm"]
		},
		"video/jxsv": { "source": "iana" },
		"video/mj2": {
			"source": "iana",
			"extensions": ["mj2", "mjp2"]
		},
		"video/mp1s": { "source": "iana" },
		"video/mp2p": { "source": "iana" },
		"video/mp2t": {
			"source": "iana",
			"extensions": ["ts"]
		},
		"video/mp4": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"mp4",
				"mp4v",
				"mpg4"
			]
		},
		"video/mp4v-es": { "source": "iana" },
		"video/mpeg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"mpeg",
				"mpg",
				"mpe",
				"m1v",
				"m2v"
			]
		},
		"video/mpeg4-generic": { "source": "iana" },
		"video/mpv": { "source": "iana" },
		"video/nv": { "source": "iana" },
		"video/ogg": {
			"source": "iana",
			"compressible": false,
			"extensions": ["ogv"]
		},
		"video/parityfec": { "source": "iana" },
		"video/pointer": { "source": "iana" },
		"video/quicktime": {
			"source": "iana",
			"compressible": false,
			"extensions": ["qt", "mov"]
		},
		"video/raptorfec": { "source": "iana" },
		"video/raw": { "source": "iana" },
		"video/rtp-enc-aescm128": { "source": "iana" },
		"video/rtploopback": { "source": "iana" },
		"video/rtx": { "source": "iana" },
		"video/scip": { "source": "iana" },
		"video/smpte291": { "source": "iana" },
		"video/smpte292m": { "source": "iana" },
		"video/ulpfec": { "source": "iana" },
		"video/vc1": { "source": "iana" },
		"video/vc2": { "source": "iana" },
		"video/vnd.cctv": { "source": "iana" },
		"video/vnd.dece.hd": {
			"source": "iana",
			"extensions": ["uvh", "uvvh"]
		},
		"video/vnd.dece.mobile": {
			"source": "iana",
			"extensions": ["uvm", "uvvm"]
		},
		"video/vnd.dece.mp4": { "source": "iana" },
		"video/vnd.dece.pd": {
			"source": "iana",
			"extensions": ["uvp", "uvvp"]
		},
		"video/vnd.dece.sd": {
			"source": "iana",
			"extensions": ["uvs", "uvvs"]
		},
		"video/vnd.dece.video": {
			"source": "iana",
			"extensions": ["uvv", "uvvv"]
		},
		"video/vnd.directv.mpeg": { "source": "iana" },
		"video/vnd.directv.mpeg-tts": { "source": "iana" },
		"video/vnd.dlna.mpeg-tts": { "source": "iana" },
		"video/vnd.dvb.file": {
			"source": "iana",
			"extensions": ["dvb"]
		},
		"video/vnd.fvt": {
			"source": "iana",
			"extensions": ["fvt"]
		},
		"video/vnd.hns.video": { "source": "iana" },
		"video/vnd.iptvforum.1dparityfec-1010": { "source": "iana" },
		"video/vnd.iptvforum.1dparityfec-2005": { "source": "iana" },
		"video/vnd.iptvforum.2dparityfec-1010": { "source": "iana" },
		"video/vnd.iptvforum.2dparityfec-2005": { "source": "iana" },
		"video/vnd.iptvforum.ttsavc": { "source": "iana" },
		"video/vnd.iptvforum.ttsmpeg2": { "source": "iana" },
		"video/vnd.motorola.video": { "source": "iana" },
		"video/vnd.motorola.videop": { "source": "iana" },
		"video/vnd.mpegurl": {
			"source": "iana",
			"extensions": ["mxu", "m4u"]
		},
		"video/vnd.ms-playready.media.pyv": {
			"source": "iana",
			"extensions": ["pyv"]
		},
		"video/vnd.nokia.interleaved-multimedia": { "source": "iana" },
		"video/vnd.nokia.mp4vr": { "source": "iana" },
		"video/vnd.nokia.videovoip": { "source": "iana" },
		"video/vnd.objectvideo": { "source": "iana" },
		"video/vnd.radgamettools.bink": { "source": "iana" },
		"video/vnd.radgamettools.smacker": { "source": "iana" },
		"video/vnd.sealed.mpeg1": { "source": "iana" },
		"video/vnd.sealed.mpeg4": { "source": "iana" },
		"video/vnd.sealed.swf": { "source": "iana" },
		"video/vnd.sealedmedia.softseal.mov": { "source": "iana" },
		"video/vnd.uvvu.mp4": {
			"source": "iana",
			"extensions": ["uvu", "uvvu"]
		},
		"video/vnd.vivo": {
			"source": "iana",
			"extensions": ["viv"]
		},
		"video/vnd.youtube.yt": { "source": "iana" },
		"video/vp8": { "source": "iana" },
		"video/vp9": { "source": "iana" },
		"video/webm": {
			"source": "apache",
			"compressible": false,
			"extensions": ["webm"]
		},
		"video/x-f4v": {
			"source": "apache",
			"extensions": ["f4v"]
		},
		"video/x-fli": {
			"source": "apache",
			"extensions": ["fli"]
		},
		"video/x-flv": {
			"source": "apache",
			"compressible": false,
			"extensions": ["flv"]
		},
		"video/x-m4v": {
			"source": "apache",
			"extensions": ["m4v"]
		},
		"video/x-matroska": {
			"source": "apache",
			"compressible": false,
			"extensions": [
				"mkv",
				"mk3d",
				"mks"
			]
		},
		"video/x-mng": {
			"source": "apache",
			"extensions": ["mng"]
		},
		"video/x-ms-asf": {
			"source": "apache",
			"extensions": ["asf", "asx"]
		},
		"video/x-ms-vob": {
			"source": "apache",
			"extensions": ["vob"]
		},
		"video/x-ms-wm": {
			"source": "apache",
			"extensions": ["wm"]
		},
		"video/x-ms-wmv": {
			"source": "apache",
			"compressible": false,
			"extensions": ["wmv"]
		},
		"video/x-ms-wmx": {
			"source": "apache",
			"extensions": ["wmx"]
		},
		"video/x-ms-wvx": {
			"source": "apache",
			"extensions": ["wvx"]
		},
		"video/x-msvideo": {
			"source": "apache",
			"extensions": ["avi"]
		},
		"video/x-sgi-movie": {
			"source": "apache",
			"extensions": ["movie"]
		},
		"video/x-smv": {
			"source": "apache",
			"extensions": ["smv"]
		},
		"x-conference/x-cooltalk": {
			"source": "apache",
			"extensions": ["ice"]
		},
		"x-shader/x-fragment": { "compressible": true },
		"x-shader/x-vertex": { "compressible": true }
	};
}));
//#endregion
//#region node_modules/mime-db/index.js
var require_mime_db = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* mime-db
	* Copyright(c) 2014 Jonathan Ong
	* Copyright(c) 2015-2022 Douglas Christopher Wilson
	* MIT Licensed
	*/
	/**
	* Module exports.
	*/
	module.exports = (init_db(), __toCommonJS(db_exports).default);
}));
//#endregion
//#region node_modules/mime-types/index.js
/*!
* mime-types
* Copyright(c) 2014 Jonathan Ong
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_mime_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Module dependencies.
	* @private
	*/
	var db = require_mime_db();
	var extname = __require("path").extname;
	/**
	* Module variables.
	* @private
	*/
	var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
	var TEXT_TYPE_REGEXP = /^text\//i;
	/**
	* Module exports.
	* @public
	*/
	exports.charset = charset;
	exports.charsets = { lookup: charset };
	exports.contentType = contentType;
	exports.extension = extension;
	exports.extensions = Object.create(null);
	exports.lookup = lookup;
	exports.types = Object.create(null);
	populateMaps(exports.extensions, exports.types);
	/**
	* Get the default charset for a MIME type.
	*
	* @param {string} type
	* @return {boolean|string}
	*/
	function charset(type) {
		if (!type || typeof type !== "string") return false;
		var match = EXTRACT_TYPE_REGEXP.exec(type);
		var mime = match && db[match[1].toLowerCase()];
		if (mime && mime.charset) return mime.charset;
		if (match && TEXT_TYPE_REGEXP.test(match[1])) return "UTF-8";
		return false;
	}
	/**
	* Create a full Content-Type header given a MIME type or extension.
	*
	* @param {string} str
	* @return {boolean|string}
	*/
	function contentType(str) {
		if (!str || typeof str !== "string") return false;
		var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
		if (!mime) return false;
		if (mime.indexOf("charset") === -1) {
			var charset = exports.charset(mime);
			if (charset) mime += "; charset=" + charset.toLowerCase();
		}
		return mime;
	}
	/**
	* Get the default extension for a MIME type.
	*
	* @param {string} type
	* @return {boolean|string}
	*/
	function extension(type) {
		if (!type || typeof type !== "string") return false;
		var match = EXTRACT_TYPE_REGEXP.exec(type);
		var exts = match && exports.extensions[match[1].toLowerCase()];
		if (!exts || !exts.length) return false;
		return exts[0];
	}
	/**
	* Lookup the MIME type for a file path/extension.
	*
	* @param {string} path
	* @return {boolean|string}
	*/
	function lookup(path) {
		if (!path || typeof path !== "string") return false;
		var extension = extname("x." + path).toLowerCase().substr(1);
		if (!extension) return false;
		return exports.types[extension] || false;
	}
	/**
	* Populate the extensions and types maps.
	* @private
	*/
	function populateMaps(extensions, types) {
		var preference = [
			"nginx",
			"apache",
			void 0,
			"iana"
		];
		Object.keys(db).forEach(function forEachMimeType(type) {
			var mime = db[type];
			var exts = mime.extensions;
			if (!exts || !exts.length) return;
			extensions[type] = exts;
			for (var i = 0; i < exts.length; i++) {
				var extension = exts[i];
				if (types[extension]) {
					var from = preference.indexOf(db[types[extension]].source);
					var to = preference.indexOf(mime.source);
					if (types[extension] !== "application/octet-stream" && (from > to || from === to && types[extension].substr(0, 12) === "application/")) continue;
				}
				types[extension] = type;
			}
		});
	}
}));
//#endregion
//#region node_modules/asynckit/lib/defer.js
var require_defer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = defer;
	/**
	* Runs provided function on next iteration of the event loop
	*
	* @param {function} fn - function to run
	*/
	function defer(fn) {
		var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
		if (nextTick) nextTick(fn);
		else setTimeout(fn, 0);
	}
}));
//#endregion
//#region node_modules/asynckit/lib/async.js
var require_async = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var defer = require_defer();
	module.exports = async;
	/**
	* Runs provided callback asynchronously
	* even if callback itself is not
	*
	* @param   {function} callback - callback to invoke
	* @returns {function} - augmented callback
	*/
	function async(callback) {
		var isAsync = false;
		defer(function() {
			isAsync = true;
		});
		return function async_callback(err, result) {
			if (isAsync) callback(err, result);
			else defer(function nextTick_callback() {
				callback(err, result);
			});
		};
	}
}));
//#endregion
//#region node_modules/asynckit/lib/abort.js
var require_abort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = abort;
	/**
	* Aborts leftover active jobs
	*
	* @param {object} state - current state object
	*/
	function abort(state) {
		Object.keys(state.jobs).forEach(clean.bind(state));
		state.jobs = {};
	}
	/**
	* Cleans up leftover job by invoking abort function for the provided job id
	*
	* @this  state
	* @param {string|number} key - job id to abort
	*/
	function clean(key) {
		if (typeof this.jobs[key] == "function") this.jobs[key]();
	}
}));
//#endregion
//#region node_modules/asynckit/lib/iterate.js
var require_iterate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var async = require_async();
	var abort = require_abort();
	module.exports = iterate;
	/**
	* Iterates over each job object
	*
	* @param {array|object} list - array or object (named list) to iterate over
	* @param {function} iterator - iterator to run
	* @param {object} state - current job status
	* @param {function} callback - invoked when all elements processed
	*/
	function iterate(list, iterator, state, callback) {
		var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
		state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
			if (!(key in state.jobs)) return;
			delete state.jobs[key];
			if (error) abort(state);
			else state.results[key] = output;
			callback(error, state.results);
		});
	}
	/**
	* Runs iterator over provided job element
	*
	* @param   {function} iterator - iterator to invoke
	* @param   {string|number} key - key/index of the element in the list of jobs
	* @param   {mixed} item - job description
	* @param   {function} callback - invoked after iterator is done with the job
	* @returns {function|mixed} - job abort function or something else
	*/
	function runJob(iterator, key, item, callback) {
		var aborter;
		if (iterator.length == 2) aborter = iterator(item, async(callback));
		else aborter = iterator(item, key, async(callback));
		return aborter;
	}
}));
//#endregion
//#region node_modules/asynckit/lib/state.js
var require_state = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = state;
	/**
	* Creates initial state object
	* for iteration over list
	*
	* @param   {array|object} list - list to iterate over
	* @param   {function|null} sortMethod - function to use for keys sort,
	*                                     or `null` to keep them as is
	* @returns {object} - initial state object
	*/
	function state(list, sortMethod) {
		var isNamedList = !Array.isArray(list), initState = {
			index: 0,
			keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
			jobs: {},
			results: isNamedList ? {} : [],
			size: isNamedList ? Object.keys(list).length : list.length
		};
		if (sortMethod) initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
			return sortMethod(list[a], list[b]);
		});
		return initState;
	}
}));
//#endregion
//#region node_modules/asynckit/lib/terminator.js
var require_terminator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var abort = require_abort();
	var async = require_async();
	module.exports = terminator;
	/**
	* Terminates jobs in the attached state context
	*
	* @this  AsyncKitState#
	* @param {function} callback - final callback to invoke after termination
	*/
	function terminator(callback) {
		if (!Object.keys(this.jobs).length) return;
		this.index = this.size;
		abort(this);
		async(callback)(null, this.results);
	}
}));
//#endregion
//#region node_modules/asynckit/parallel.js
var require_parallel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var iterate = require_iterate();
	var initState = require_state();
	var terminator = require_terminator();
	module.exports = parallel;
	/**
	* Runs iterator over provided array elements in parallel
	*
	* @param   {array|object} list - array or object (named list) to iterate over
	* @param   {function} iterator - iterator to run
	* @param   {function} callback - invoked when all elements processed
	* @returns {function} - jobs terminator
	*/
	function parallel(list, iterator, callback) {
		var state = initState(list);
		while (state.index < (state["keyedList"] || list).length) {
			iterate(list, iterator, state, function(error, result) {
				if (error) {
					callback(error, result);
					return;
				}
				if (Object.keys(state.jobs).length === 0) {
					callback(null, state.results);
					return;
				}
			});
			state.index++;
		}
		return terminator.bind(state, callback);
	}
}));
//#endregion
//#region node_modules/asynckit/serialOrdered.js
var require_serialOrdered = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var iterate = require_iterate();
	var initState = require_state();
	var terminator = require_terminator();
	module.exports = serialOrdered;
	module.exports.ascending = ascending;
	module.exports.descending = descending;
	/**
	* Runs iterator over provided sorted array elements in series
	*
	* @param   {array|object} list - array or object (named list) to iterate over
	* @param   {function} iterator - iterator to run
	* @param   {function} sortMethod - custom sort function
	* @param   {function} callback - invoked when all elements processed
	* @returns {function} - jobs terminator
	*/
	function serialOrdered(list, iterator, sortMethod, callback) {
		var state = initState(list, sortMethod);
		iterate(list, iterator, state, function iteratorHandler(error, result) {
			if (error) {
				callback(error, result);
				return;
			}
			state.index++;
			if (state.index < (state["keyedList"] || list).length) {
				iterate(list, iterator, state, iteratorHandler);
				return;
			}
			callback(null, state.results);
		});
		return terminator.bind(state, callback);
	}
	/**
	* sort helper to sort array elements in ascending order
	*
	* @param   {mixed} a - an item to compare
	* @param   {mixed} b - an item to compare
	* @returns {number} - comparison result
	*/
	function ascending(a, b) {
		return a < b ? -1 : a > b ? 1 : 0;
	}
	/**
	* sort helper to sort array elements in descending order
	*
	* @param   {mixed} a - an item to compare
	* @param   {mixed} b - an item to compare
	* @returns {number} - comparison result
	*/
	function descending(a, b) {
		return -1 * ascending(a, b);
	}
}));
//#endregion
//#region node_modules/asynckit/serial.js
var require_serial = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var serialOrdered = require_serialOrdered();
	module.exports = serial;
	/**
	* Runs iterator over provided array elements in series
	*
	* @param   {array|object} list - array or object (named list) to iterate over
	* @param   {function} iterator - iterator to run
	* @param   {function} callback - invoked when all elements processed
	* @returns {function} - jobs terminator
	*/
	function serial(list, iterator, callback) {
		return serialOrdered(list, iterator, null, callback);
	}
}));
//#endregion
//#region node_modules/asynckit/index.js
var require_asynckit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		parallel: require_parallel(),
		serial: require_serial(),
		serialOrdered: require_serialOrdered()
	};
}));
//#endregion
//#region node_modules/es-object-atoms/index.js
var require_es_object_atoms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Object;
}));
//#endregion
//#region node_modules/es-errors/index.js
var require_es_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Error;
}));
//#endregion
//#region node_modules/es-errors/eval.js
var require_eval = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./eval')} */
	module.exports = EvalError;
}));
//#endregion
//#region node_modules/es-errors/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./range')} */
	module.exports = RangeError;
}));
//#endregion
//#region node_modules/es-errors/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./ref')} */
	module.exports = ReferenceError;
}));
//#endregion
//#region node_modules/es-errors/syntax.js
var require_syntax = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./syntax')} */
	module.exports = SyntaxError;
}));
//#endregion
//#region node_modules/es-errors/type.js
var require_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./type')} */
	module.exports = TypeError;
}));
//#endregion
//#region node_modules/es-errors/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./uri')} */
	module.exports = URIError;
}));
//#endregion
//#region node_modules/math-intrinsics/abs.js
var require_abs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./abs')} */
	module.exports = Math.abs;
}));
//#endregion
//#region node_modules/math-intrinsics/floor.js
var require_floor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./floor')} */
	module.exports = Math.floor;
}));
//#endregion
//#region node_modules/math-intrinsics/max.js
var require_max = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./max')} */
	module.exports = Math.max;
}));
//#endregion
//#region node_modules/math-intrinsics/min.js
var require_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./min')} */
	module.exports = Math.min;
}));
//#endregion
//#region node_modules/math-intrinsics/pow.js
var require_pow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./pow')} */
	module.exports = Math.pow;
}));
//#endregion
//#region node_modules/math-intrinsics/round.js
var require_round = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./round')} */
	module.exports = Math.round;
}));
//#endregion
//#region node_modules/math-intrinsics/isNaN.js
var require_isNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isNaN')} */
	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
}));
//#endregion
//#region node_modules/math-intrinsics/sign.js
var require_sign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $isNaN = require_isNaN();
	/** @type {import('./sign')} */
	module.exports = function sign(number) {
		if ($isNaN(number) || number === 0) return number;
		return number < 0 ? -1 : 1;
	};
}));
//#endregion
//#region node_modules/gopd/gOPD.js
var require_gOPD = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./gOPD')} */
	module.exports = Object.getOwnPropertyDescriptor;
}));
//#endregion
//#region node_modules/gopd/index.js
var require_gopd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $gOPD = require_gOPD();
	if ($gOPD) try {
		$gOPD([], "length");
	} catch (e) {
		$gOPD = null;
	}
	module.exports = $gOPD;
}));
//#endregion
//#region node_modules/es-define-property/index.js
var require_es_define_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) try {
		$defineProperty({}, "a", { value: 1 });
	} catch (e) {
		$defineProperty = false;
	}
	module.exports = $defineProperty;
}));
//#endregion
//#region node_modules/has-symbols/shams.js
var require_shams$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./shams')} */
	module.exports = function hasSymbols() {
		if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return false;
		if (typeof Symbol.iterator === "symbol") return true;
		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol("test");
		var symObj = Object(sym);
		if (typeof sym === "string") return false;
		if (Object.prototype.toString.call(sym) !== "[object Symbol]") return false;
		if (Object.prototype.toString.call(symObj) !== "[object Symbol]") return false;
		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) return false;
		if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) return false;
		if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) return false;
		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) return false;
		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) return false;
		if (typeof Object.getOwnPropertyDescriptor === "function") {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== symVal || descriptor.enumerable !== true) return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/has-symbols/index.js
var require_has_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var origSymbol = typeof Symbol !== "undefined" && Symbol;
	var hasSymbolSham = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasNativeSymbols() {
		if (typeof origSymbol !== "function") return false;
		if (typeof Symbol !== "function") return false;
		if (typeof origSymbol("foo") !== "symbol") return false;
		if (typeof Symbol("bar") !== "symbol") return false;
		return hasSymbolSham();
	};
}));
//#endregion
//#region node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Reflect.getPrototypeOf')} */
	module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
}));
//#endregion
//#region node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Object.getPrototypeOf')} */
	module.exports = require_es_object_atoms().getPrototypeOf || null;
}));
//#endregion
//#region node_modules/function-bind/implementation.js
var require_implementation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = "[object Function]";
	var concatty = function concatty(a, b) {
		var arr = [];
		for (var i = 0; i < a.length; i += 1) arr[i] = a[i];
		for (var j = 0; j < b.length; j += 1) arr[j + a.length] = b[j];
		return arr;
	};
	var slicy = function slicy(arrLike, offset) {
		var arr = [];
		for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) arr[j] = arrLike[i];
		return arr;
	};
	var joiny = function(arr, joiner) {
		var str = "";
		for (var i = 0; i < arr.length; i += 1) {
			str += arr[i];
			if (i + 1 < arr.length) str += joiner;
		}
		return str;
	};
	module.exports = function bind(that) {
		var target = this;
		if (typeof target !== "function" || toStr.apply(target) !== funcType) throw new TypeError(ERROR_MESSAGE + target);
		var args = slicy(arguments, 1);
		var bound;
		var binder = function() {
			if (this instanceof bound) {
				var result = target.apply(this, concatty(args, arguments));
				if (Object(result) === result) return result;
				return this;
			}
			return target.apply(that, concatty(args, arguments));
		};
		var boundLength = max(0, target.length - args.length);
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) boundArgs[i] = "$" + i;
		bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
		if (target.prototype) {
			var Empty = function Empty() {};
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			Empty.prototype = null;
		}
		return bound;
	};
}));
//#endregion
//#region node_modules/function-bind/index.js
var require_function_bind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation();
	module.exports = Function.prototype.bind || implementation;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionCall')} */
	module.exports = Function.prototype.call;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionApply')} */
	module.exports = Function.prototype.apply;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./reflectApply')} */
	module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	/** @type {import('./actualApply')} */
	module.exports = require_reflectApply() || bind.call($call, $apply);
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $TypeError = require_type();
	var $call = require_functionCall();
	var $actualApply = require_actualApply();
	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	module.exports = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== "function") throw new $TypeError("a function is required");
		return $actualApply(bind, $call, args);
	};
}));
//#endregion
//#region node_modules/dunder-proto/get.js
var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind_apply_helpers();
	var gOPD = require_gopd();
	var hasProtoAccessor;
	try {
		hasProtoAccessor = [].__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") throw e;
	}
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;
	/** @type {import('./get')} */
	module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
		return $getPrototypeOf(value == null ? value : $Object(value));
	} : false;
}));
//#endregion
//#region node_modules/get-proto/index.js
var require_get_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reflectGetProto = require_Reflect_getPrototypeOf();
	var originalGetProto = require_Object_getPrototypeOf();
	var getDunderProto = require_get();
	/** @type {import('.')} */
	module.exports = reflectGetProto ? function getProto(O) {
		return reflectGetProto(O);
	} : originalGetProto ? function getProto(O) {
		if (!O || typeof O !== "object" && typeof O !== "function") throw new TypeError("getProto: not an object");
		return originalGetProto(O);
	} : getDunderProto ? function getProto(O) {
		return getDunderProto(O);
	} : null;
}));
//#endregion
//#region node_modules/hasown/index.js
var require_hasown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	/** @type {import('.')} */
	module.exports = require_function_bind().call(call, $hasOwn);
}));
//#endregion
//#region node_modules/get-intrinsic/index.js
var require_get_intrinsic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var undefined;
	var $Object = require_es_object_atoms();
	var $Error = require_es_errors();
	var $EvalError = require_eval();
	var $RangeError = require_range();
	var $ReferenceError = require_ref();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var $URIError = require_uri();
	var abs = require_abs();
	var floor = require_floor();
	var max = require_max();
	var min = require_min();
	var pow = require_pow();
	var round = require_round();
	var sign = require_sign();
	var $Function = Function;
	var getEvalledConstructor = function(expressionSyntax) {
		try {
			return $Function("\"use strict\"; return (" + expressionSyntax + ").constructor;")();
		} catch (e) {}
	};
	var $gOPD = require_gopd();
	var $defineProperty = require_es_define_property();
	var throwTypeError = function() {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD ? function() {
		try {
			arguments.callee;
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				return $gOPD(arguments, "callee").get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}() : throwTypeError;
	var hasSymbols = require_has_symbols()();
	var getProto = require_get_proto();
	var $ObjectGPO = require_Object_getPrototypeOf();
	var $ReflectGPO = require_Reflect_getPrototypeOf();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	var needsEval = {};
	var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined : getProto(Uint8Array);
	var INTRINSICS = {
		__proto__: null,
		"%AggregateError%": typeof AggregateError === "undefined" ? undefined : AggregateError,
		"%Array%": Array,
		"%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined : ArrayBuffer,
		"%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
		"%AsyncFromSyncIteratorPrototype%": undefined,
		"%AsyncFunction%": needsEval,
		"%AsyncGenerator%": needsEval,
		"%AsyncGeneratorFunction%": needsEval,
		"%AsyncIteratorPrototype%": needsEval,
		"%Atomics%": typeof Atomics === "undefined" ? undefined : Atomics,
		"%BigInt%": typeof BigInt === "undefined" ? undefined : BigInt,
		"%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined : BigInt64Array,
		"%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined : BigUint64Array,
		"%Boolean%": Boolean,
		"%DataView%": typeof DataView === "undefined" ? undefined : DataView,
		"%Date%": Date,
		"%decodeURI%": decodeURI,
		"%decodeURIComponent%": decodeURIComponent,
		"%encodeURI%": encodeURI,
		"%encodeURIComponent%": encodeURIComponent,
		"%Error%": $Error,
		"%eval%": eval,
		"%EvalError%": $EvalError,
		"%Float16Array%": typeof Float16Array === "undefined" ? undefined : Float16Array,
		"%Float32Array%": typeof Float32Array === "undefined" ? undefined : Float32Array,
		"%Float64Array%": typeof Float64Array === "undefined" ? undefined : Float64Array,
		"%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry,
		"%Function%": $Function,
		"%GeneratorFunction%": needsEval,
		"%Int8Array%": typeof Int8Array === "undefined" ? undefined : Int8Array,
		"%Int16Array%": typeof Int16Array === "undefined" ? undefined : Int16Array,
		"%Int32Array%": typeof Int32Array === "undefined" ? undefined : Int32Array,
		"%isFinite%": isFinite,
		"%isNaN%": isNaN,
		"%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
		"%JSON%": typeof JSON === "object" ? JSON : undefined,
		"%Map%": typeof Map === "undefined" ? undefined : Map,
		"%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
		"%Math%": Math,
		"%Number%": Number,
		"%Object%": $Object,
		"%Object.getOwnPropertyDescriptor%": $gOPD,
		"%parseFloat%": parseFloat,
		"%parseInt%": parseInt,
		"%Promise%": typeof Promise === "undefined" ? undefined : Promise,
		"%Proxy%": typeof Proxy === "undefined" ? undefined : Proxy,
		"%RangeError%": $RangeError,
		"%ReferenceError%": $ReferenceError,
		"%Reflect%": typeof Reflect === "undefined" ? undefined : Reflect,
		"%RegExp%": RegExp,
		"%Set%": typeof Set === "undefined" ? undefined : Set,
		"%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
		"%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined : SharedArrayBuffer,
		"%String%": String,
		"%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined,
		"%Symbol%": hasSymbols ? Symbol : undefined,
		"%SyntaxError%": $SyntaxError,
		"%ThrowTypeError%": ThrowTypeError,
		"%TypedArray%": TypedArray,
		"%TypeError%": $TypeError,
		"%Uint8Array%": typeof Uint8Array === "undefined" ? undefined : Uint8Array,
		"%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined : Uint8ClampedArray,
		"%Uint16Array%": typeof Uint16Array === "undefined" ? undefined : Uint16Array,
		"%Uint32Array%": typeof Uint32Array === "undefined" ? undefined : Uint32Array,
		"%URIError%": $URIError,
		"%WeakMap%": typeof WeakMap === "undefined" ? undefined : WeakMap,
		"%WeakRef%": typeof WeakRef === "undefined" ? undefined : WeakRef,
		"%WeakSet%": typeof WeakSet === "undefined" ? undefined : WeakSet,
		"%Function.prototype.call%": $call,
		"%Function.prototype.apply%": $apply,
		"%Object.defineProperty%": $defineProperty,
		"%Object.getPrototypeOf%": $ObjectGPO,
		"%Math.abs%": abs,
		"%Math.floor%": floor,
		"%Math.max%": max,
		"%Math.min%": min,
		"%Math.pow%": pow,
		"%Math.round%": round,
		"%Math.sign%": sign,
		"%Reflect.getPrototypeOf%": $ReflectGPO
	};
	if (getProto) try {
		null.error;
	} catch (e) {
		INTRINSICS["%Error.prototype%"] = getProto(getProto(e));
	}
	var doEval = function doEval(name) {
		var value;
		if (name === "%AsyncFunction%") value = getEvalledConstructor("async function () {}");
		else if (name === "%GeneratorFunction%") value = getEvalledConstructor("function* () {}");
		else if (name === "%AsyncGeneratorFunction%") value = getEvalledConstructor("async function* () {}");
		else if (name === "%AsyncGenerator%") {
			var fn = doEval("%AsyncGeneratorFunction%");
			if (fn) value = fn.prototype;
		} else if (name === "%AsyncIteratorPrototype%") {
			var gen = doEval("%AsyncGenerator%");
			if (gen && getProto) value = getProto(gen.prototype);
		}
		INTRINSICS[name] = value;
		return value;
	};
	var LEGACY_ALIASES = {
		__proto__: null,
		"%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
		"%ArrayPrototype%": ["Array", "prototype"],
		"%ArrayProto_entries%": [
			"Array",
			"prototype",
			"entries"
		],
		"%ArrayProto_forEach%": [
			"Array",
			"prototype",
			"forEach"
		],
		"%ArrayProto_keys%": [
			"Array",
			"prototype",
			"keys"
		],
		"%ArrayProto_values%": [
			"Array",
			"prototype",
			"values"
		],
		"%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
		"%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
		"%AsyncGeneratorPrototype%": [
			"AsyncGeneratorFunction",
			"prototype",
			"prototype"
		],
		"%BooleanPrototype%": ["Boolean", "prototype"],
		"%DataViewPrototype%": ["DataView", "prototype"],
		"%DatePrototype%": ["Date", "prototype"],
		"%ErrorPrototype%": ["Error", "prototype"],
		"%EvalErrorPrototype%": ["EvalError", "prototype"],
		"%Float32ArrayPrototype%": ["Float32Array", "prototype"],
		"%Float64ArrayPrototype%": ["Float64Array", "prototype"],
		"%FunctionPrototype%": ["Function", "prototype"],
		"%Generator%": ["GeneratorFunction", "prototype"],
		"%GeneratorPrototype%": [
			"GeneratorFunction",
			"prototype",
			"prototype"
		],
		"%Int8ArrayPrototype%": ["Int8Array", "prototype"],
		"%Int16ArrayPrototype%": ["Int16Array", "prototype"],
		"%Int32ArrayPrototype%": ["Int32Array", "prototype"],
		"%JSONParse%": ["JSON", "parse"],
		"%JSONStringify%": ["JSON", "stringify"],
		"%MapPrototype%": ["Map", "prototype"],
		"%NumberPrototype%": ["Number", "prototype"],
		"%ObjectPrototype%": ["Object", "prototype"],
		"%ObjProto_toString%": [
			"Object",
			"prototype",
			"toString"
		],
		"%ObjProto_valueOf%": [
			"Object",
			"prototype",
			"valueOf"
		],
		"%PromisePrototype%": ["Promise", "prototype"],
		"%PromiseProto_then%": [
			"Promise",
			"prototype",
			"then"
		],
		"%Promise_all%": ["Promise", "all"],
		"%Promise_reject%": ["Promise", "reject"],
		"%Promise_resolve%": ["Promise", "resolve"],
		"%RangeErrorPrototype%": ["RangeError", "prototype"],
		"%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
		"%RegExpPrototype%": ["RegExp", "prototype"],
		"%SetPrototype%": ["Set", "prototype"],
		"%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
		"%StringPrototype%": ["String", "prototype"],
		"%SymbolPrototype%": ["Symbol", "prototype"],
		"%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
		"%TypedArrayPrototype%": ["TypedArray", "prototype"],
		"%TypeErrorPrototype%": ["TypeError", "prototype"],
		"%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
		"%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
		"%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
		"%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
		"%URIErrorPrototype%": ["URIError", "prototype"],
		"%WeakMapPrototype%": ["WeakMap", "prototype"],
		"%WeakSetPrototype%": ["WeakSet", "prototype"]
	};
	var bind = require_function_bind();
	var hasOwn = require_hasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g;
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === "%" && last !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
		else if (last === "%" && first !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
		var result = [];
		$replace(string, rePropName, function(match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
		});
		return result;
	};
	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = "%" + alias[0] + "%";
		}
		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) value = doEval(intrinsicName);
			if (typeof value === "undefined" && !allowMissing) throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
			return {
				alias,
				name: intrinsicName,
				value
			};
		}
		throw new $SyntaxError("intrinsic " + name + " does not exist!");
	};
	module.exports = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== "string" || name.length === 0) throw new $TypeError("intrinsic name must be a non-empty string");
		if (arguments.length > 1 && typeof allowMissing !== "boolean") throw new $TypeError("\"allowMissing\" argument must be a boolean");
		if ($exec(/^%?[^%]*%?$/, name) === null) throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
		var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;
		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}
		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if ((first === "\"" || first === "'" || first === "`" || last === "\"" || last === "'" || last === "`") && first !== last) throw new $SyntaxError("property names with quotes must have matching quotes");
			if (part === "constructor" || !isOwn) skipFurtherCaching = true;
			intrinsicBaseName += "." + part;
			intrinsicRealName = "%" + intrinsicBaseName + "%";
			if (hasOwn(INTRINSICS, intrinsicRealName)) value = INTRINSICS[intrinsicRealName];
			else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
					return;
				}
				if ($gOPD && i + 1 >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;
					if (isOwn && "get" in desc && !("originalValue" in desc.get)) value = desc.get;
					else value = value[part];
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}
				if (isOwn && !skipFurtherCaching) INTRINSICS[intrinsicRealName] = value;
			}
		}
		return value;
	};
}));
//#endregion
//#region node_modules/has-tostringtag/shams.js
var require_shams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasSymbols = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	};
}));
//#endregion
//#region node_modules/es-set-tostringtag/index.js
var require_es_set_tostringtag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $defineProperty = require_get_intrinsic()("%Object.defineProperty%", true);
	var hasToStringTag = require_shams()();
	var hasOwn = require_hasown();
	var $TypeError = require_type();
	var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
	/** @type {import('.')} */
	module.exports = function setToStringTag(object, value) {
		var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
		var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
		if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
		if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
			if ($defineProperty) $defineProperty(object, toStringTag, {
				configurable: !nonConfigurable,
				enumerable: false,
				value,
				writable: false
			});
			else object[toStringTag] = value;
		}
	};
}));
//#endregion
//#region node_modules/form-data/lib/populate.js
var require_populate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(dst, src) {
		Object.keys(src).forEach(function(prop) {
			dst[prop] = dst[prop] || src[prop];
		});
		return dst;
	};
}));
var FormData_default = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var CombinedStream = require_combined_stream();
	var util$2 = __require("util");
	var path = __require("path");
	var http$2 = __require("http");
	var https$2 = __require("https");
	var parseUrl$1 = __require("url").parse;
	var fs = __require("fs");
	var Stream = __require("stream").Stream;
	var crypto$1 = __require("crypto");
	var mime = require_mime_types();
	var asynckit = require_asynckit();
	var setToStringTag = require_es_set_tostringtag();
	var hasOwn = require_hasown();
	var populate = require_populate();
	/**
	* Escape CR, LF, and `"` in a multipart `name`/`filename` parameter, so a field
	* name or filename can not break out of its header line to inject headers or
	* smuggle additional parts. Matches the WHATWG HTML multipart/form-data encoding.
	*
	* @param {string} str - the parameter value to escape
	* @returns {string} the escaped value
	*/
	function escapeHeaderParam(str) {
		return String(str).replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/"/g, "%22");
	}
	/**
	* Create readable "multipart/form-data" streams.
	* Can be used to submit forms
	* and file uploads to other web applications.
	*
	* @constructor
	* @param {object} options - Properties to be added/overriden for FormData and CombinedStream
	*/
	function FormData(options) {
		if (!(this instanceof FormData)) return new FormData(options);
		this._overheadLength = 0;
		this._valueLength = 0;
		this._valuesToMeasure = [];
		CombinedStream.call(this);
		options = options || {};
		for (var option in options) this[option] = options[option];
	}
	util$2.inherits(FormData, CombinedStream);
	FormData.LINE_BREAK = "\r\n";
	FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
	FormData.prototype.append = function(field, value, options) {
		options = options || {};
		if (typeof options === "string") options = { filename: options };
		var append = CombinedStream.prototype.append.bind(this);
		if (typeof value === "number" || value == null) value = String(value);
		if (Array.isArray(value)) {
			this._error(/* @__PURE__ */ new Error("Arrays are not supported."));
			return;
		}
		var header = this._multiPartHeader(field, value, options);
		var footer = this._multiPartFooter();
		append(header);
		append(value);
		append(footer);
		this._trackLength(header, value, options);
	};
	FormData.prototype._trackLength = function(header, value, options) {
		var valueLength = 0;
		if (options.knownLength != null) valueLength += Number(options.knownLength);
		else if (Buffer.isBuffer(value)) valueLength = value.length;
		else if (typeof value === "string") valueLength = Buffer.byteLength(value);
		this._valueLength += valueLength;
		this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
		if (!value || !value.path && !(value.readable && hasOwn(value, "httpVersion")) && !(value instanceof Stream)) return;
		if (!options.knownLength) this._valuesToMeasure.push(value);
	};
	FormData.prototype._lengthRetriever = function(value, callback) {
		if (hasOwn(value, "fd")) {
			if (value.end != void 0 && value.end != Infinity && value.start != void 0) callback(null, value.end + 1 - (value.start ? value.start : 0));
			else fs.stat(value.path, function(err, stat) {
				if (err) {
					callback(err);
					return;
				}
				callback(null, stat.size - (value.start ? value.start : 0));
			});
		} else if (hasOwn(value, "httpVersion")) callback(null, Number(value.headers["content-length"]));
		else if (hasOwn(value, "httpModule")) {
			value.on("response", function(response) {
				value.pause();
				callback(null, Number(response.headers["content-length"]));
			});
			value.resume();
		} else callback("Unknown stream");
	};
	FormData.prototype._multiPartHeader = function(field, value, options) {
		if (typeof options.header === "string") return options.header;
		var contentDisposition = this._getContentDisposition(value, options);
		var contentType = this._getContentType(value, options);
		var contents = "";
		var headers = {
			"Content-Disposition": ["form-data", "name=\"" + escapeHeaderParam(field) + "\""].concat(contentDisposition || []),
			"Content-Type": [].concat(contentType || [])
		};
		if (typeof options.header === "object") populate(headers, options.header);
		var header;
		for (var prop in headers) if (hasOwn(headers, prop)) {
			header = headers[prop];
			if (header == null) continue;
			if (!Array.isArray(header)) header = [header];
			if (header.length) contents += prop + ": " + header.join("; ") + FormData.LINE_BREAK;
		}
		return "--" + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
	};
	FormData.prototype._getContentDisposition = function(value, options) {
		var filename;
		if (typeof options.filepath === "string") filename = path.normalize(options.filepath).replace(/\\/g, "/");
		else if (options.filename || value && (value.name || value.path)) filename = path.basename(options.filename || value && (value.name || value.path));
		else if (value && value.readable && hasOwn(value, "httpVersion")) filename = path.basename(value.client._httpMessage.path || "");
		if (filename) return "filename=\"" + escapeHeaderParam(filename) + "\"";
	};
	FormData.prototype._getContentType = function(value, options) {
		var contentType = options.contentType;
		if (!contentType && value && value.name) contentType = mime.lookup(value.name);
		if (!contentType && value && value.path) contentType = mime.lookup(value.path);
		if (!contentType && value && value.readable && hasOwn(value, "httpVersion")) contentType = value.headers["content-type"];
		if (!contentType && (options.filepath || options.filename)) contentType = mime.lookup(options.filepath || options.filename);
		if (!contentType && value && typeof value === "object") contentType = FormData.DEFAULT_CONTENT_TYPE;
		return contentType;
	};
	FormData.prototype._multiPartFooter = function() {
		return function(next) {
			var footer = FormData.LINE_BREAK;
			if (this._streams.length === 0) footer += this._lastBoundary();
			next(footer);
		}.bind(this);
	};
	FormData.prototype._lastBoundary = function() {
		return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK;
	};
	FormData.prototype.getHeaders = function(userHeaders) {
		var header;
		var formHeaders = { "content-type": "multipart/form-data; boundary=" + this.getBoundary() };
		for (header in userHeaders) if (hasOwn(userHeaders, header)) formHeaders[header.toLowerCase()] = userHeaders[header];
		return formHeaders;
	};
	FormData.prototype.setBoundary = function(boundary) {
		if (typeof boundary !== "string") throw new TypeError("FormData boundary must be a string");
		this._boundary = boundary;
	};
	FormData.prototype.getBoundary = function() {
		if (!this._boundary) this._generateBoundary();
		return this._boundary;
	};
	FormData.prototype.getBuffer = function() {
		var dataBuffer = new Buffer.alloc(0);
		var boundary = this.getBoundary();
		for (var i = 0, len = this._streams.length; i < len; i++) if (typeof this._streams[i] !== "function") {
			if (Buffer.isBuffer(this._streams[i])) dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
			else dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
			if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData.LINE_BREAK)]);
		}
		return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
	};
	FormData.prototype._generateBoundary = function() {
		this._boundary = "--------------------------" + crypto$1.randomBytes(12).toString("hex");
	};
	FormData.prototype.getLengthSync = function() {
		var knownLength = this._overheadLength + this._valueLength;
		if (this._streams.length) knownLength += this._lastBoundary().length;
		if (!this.hasKnownLength()) this._error(/* @__PURE__ */ new Error("Cannot calculate proper length in synchronous way."));
		return knownLength;
	};
	FormData.prototype.hasKnownLength = function() {
		var hasKnownLength = true;
		if (this._valuesToMeasure.length) hasKnownLength = false;
		return hasKnownLength;
	};
	FormData.prototype.getLength = function(cb) {
		var knownLength = this._overheadLength + this._valueLength;
		if (this._streams.length) knownLength += this._lastBoundary().length;
		if (!this._valuesToMeasure.length) {
			process.nextTick(cb.bind(this, null, knownLength));
			return;
		}
		asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
			if (err) {
				cb(err);
				return;
			}
			values.forEach(function(length) {
				knownLength += length;
			});
			cb(null, knownLength);
		});
	};
	FormData.prototype.submit = function(params, cb) {
		var request;
		var options;
		var defaults = { method: "post" };
		if (typeof params === "string") {
			params = parseUrl$1(params);
			options = populate({
				port: params.port,
				path: params.pathname,
				host: params.hostname,
				protocol: params.protocol
			}, defaults);
		} else {
			options = populate(params, defaults);
			if (!options.port) options.port = options.protocol === "https:" ? 443 : 80;
		}
		options.headers = this.getHeaders(params.headers);
		if (options.protocol === "https:") request = https$2.request(options);
		else request = http$2.request(options);
		this.getLength(function(err, length) {
			if (err && err !== "Unknown stream") {
				this._error(err);
				return;
			}
			if (length) request.setHeader("Content-Length", length);
			this.pipe(request);
			if (cb) {
				var onResponse;
				var callback = function(error, responce) {
					request.removeListener("error", callback);
					request.removeListener("response", onResponse);
					return cb.call(this, error, responce);
				};
				onResponse = callback.bind(this, null);
				request.on("error", callback);
				request.on("response", onResponse);
			}
		}.bind(this));
		return request;
	};
	FormData.prototype._error = function(err) {
		if (!this.error) {
			this.error = err;
			this.pause();
			this.emit("error", err);
		}
	};
	FormData.prototype.toString = function() {
		return "[object FormData]";
	};
	setToStringTag(FormData.prototype, "FormData");
	module.exports = FormData;
})))(), 1)).default;
//#endregion
//#region node_modules/axios/lib/platform/node/classes/Buffer.js
var Buffer_default = {
	isBufferAvailable() {
		return typeof Buffer !== "undefined";
	},
	from(value) {
		return Buffer.from(value);
	}
};
/**
* Determines if the given thing is a array or js object.
*
* @param {string} thing - The object or array to be visited.
*
* @returns {boolean}
*/
function isVisitable(thing) {
	return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
/**
* It removes the brackets from the end of a string
*
* @param {string} key - The key of the parameter.
*
* @returns {string} the key without the brackets.
*/
function removeBrackets(key) {
	return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
/**
* It takes a path, a key, and a boolean, and returns a string
*
* @param {string} path - The path to the current key.
* @param {string} key - The key of the current object being iterated over.
* @param {string} dots - If true, the key will be rendered with dots instead of brackets.
*
* @returns {string} The path to the current key.
*/
function renderKey(path, key, dots) {
	if (!path) return key;
	return path.concat(key).map(function each(token, i) {
		token = removeBrackets(token);
		return !dots && i ? "[" + token + "]" : token;
	}).join(dots ? "." : "");
}
/**
* If the array is an array and none of its elements are visitable, then it's a flat array.
*
* @param {Array<any>} arr - The array to check
*
* @returns {boolean}
*/
function isFlatArray(arr) {
	return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
	return /^is[A-Z]/.test(prop);
});
/**
* Convert a data object to FormData
*
* @param {Object} obj
* @param {?Object} [formData]
* @param {?Object} [options]
* @param {Function} [options.visitor]
* @param {Boolean} [options.metaTokens = true]
* @param {Boolean} [options.dots = false]
* @param {?Boolean} [options.indexes = false]
*
* @returns {Object}
**/
/**
* It converts an object into a FormData object
*
* @param {Object<any, any>} obj - The object to convert to form data.
* @param {string} formData - The FormData object to append to.
* @param {Object<string, any>} options
*
* @returns
*/
function toFormData(obj, formData, options) {
	if (!utils_default.isObject(obj)) throw new TypeError("target must be an object");
	formData = formData || new (FormData_default || FormData)();
	options = utils_default.toFlatObject(options, {
		metaTokens: true,
		dots: false,
		indexes: false
	}, false, function defined(option, source) {
		return !utils_default.isUndefined(source[option]);
	});
	const metaTokens = options.metaTokens;
	const visitor = options.visitor || defaultVisitor;
	const dots = options.dots;
	const indexes = options.indexes;
	const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
	const maxDepth = options.maxDepth === void 0 ? 100 : options.maxDepth;
	const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
	const stack = [];
	if (!utils_default.isFunction(visitor)) throw new TypeError("visitor must be a function");
	function convertValue(value) {
		if (value === null) return "";
		if (utils_default.isDate(value)) return value.toISOString();
		if (utils_default.isBoolean(value)) return value.toString();
		if (!useBlob && utils_default.isBlob(value)) throw new AxiosError("Blob is not supported. Use a Buffer instead.");
		if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
			if (useBlob && typeof _Blob === "function") return new _Blob([value]);
			if (Buffer_default && Buffer_default.isBufferAvailable()) return Buffer_default.from(value);
			throw new AxiosError("Blob is not supported. Use a Buffer instead.", AxiosError.ERR_NOT_SUPPORT);
		}
		return value;
	}
	function throwIfMaxDepthExceeded(depth) {
		if (depth > maxDepth) throw new AxiosError("Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth, AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED);
	}
	function stringifyWithDepthLimit(value, depth) {
		if (maxDepth === Infinity) return JSON.stringify(value);
		const ancestors = [];
		return JSON.stringify(value, function limitDepth(_key, currentValue) {
			if (!utils_default.isObject(currentValue)) return currentValue;
			while (ancestors.length && ancestors[ancestors.length - 1] !== this) ancestors.pop();
			ancestors.push(currentValue);
			throwIfMaxDepthExceeded(depth + ancestors.length - 1);
			return currentValue;
		});
	}
	/**
	* Default visitor.
	*
	* @param {*} value
	* @param {String|Number} key
	* @param {Array<String|Number>} path
	* @this {FormData}
	*
	* @returns {boolean} return true to visit the each prop of the value recursively
	*/
	function defaultVisitor(value, key, path) {
		let arr = value;
		if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
			formData.append(renderKey(path, key, dots), convertValue(value));
			return false;
		}
		if (value && !path && typeof value === "object") {
			if (utils_default.endsWith(key, "{}")) {
				key = metaTokens ? key : key.slice(0, -2);
				value = stringifyWithDepthLimit(value, 1);
			} else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
				key = removeBrackets(key);
				arr.forEach(function each(el, index) {
					!(utils_default.isUndefined(el) || el === null) && formData.append(indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
				});
				return false;
			}
		}
		if (isVisitable(value)) return true;
		formData.append(renderKey(path, key, dots), convertValue(value));
		return false;
	}
	const exposedHelpers = Object.assign(predicates, {
		defaultVisitor,
		convertValue,
		isVisitable
	});
	function build(value, path, depth = 0) {
		if (utils_default.isUndefined(value)) return;
		throwIfMaxDepthExceeded(depth);
		if (stack.indexOf(value) !== -1) throw new Error("Circular reference detected in " + path.join("."));
		stack.push(value);
		utils_default.forEach(value, function each(el, key) {
			if ((!(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers)) === true) build(el, path ? path.concat(key) : [key], depth + 1);
		});
		stack.pop();
	}
	if (!utils_default.isObject(obj)) throw new TypeError("data must be an object");
	build(obj);
	return formData;
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
/**
* It encodes a string by replacing all characters that are not in the unreserved set with
* their percent-encoded equivalents
*
* @param {string} str - The string to encode.
*
* @returns {string} The encoded string.
*/
function encode$1(str) {
	const charMap = {
		"!": "%21",
		"'": "%27",
		"(": "%28",
		")": "%29",
		"~": "%7E",
		"%20": "+"
	};
	return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
		return charMap[match];
	});
}
/**
* It takes a params object and converts it to a FormData object
*
* @param {Object<string, any>} params - The parameters to be converted to a FormData object.
* @param {Object<string, any>} options - The options object passed to the Axios constructor.
*
* @returns {void}
*/
function AxiosURLSearchParams(params, options) {
	this._pairs = [];
	params && toFormData(params, this, options);
}
var prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
	this._pairs.push([name, value]);
};
prototype.toString = function toString(encoder) {
	const _encode = encoder ? (value) => encoder.call(this, value, encode$1) : encode$1;
	return this._pairs.map(function each(pair) {
		return _encode(pair[0]) + "=" + _encode(pair[1]);
	}, "").join("&");
};
//#endregion
//#region node_modules/axios/lib/helpers/buildURL.js
/**
* It replaces URL-encoded forms of `:`, `$`, `,`, and spaces with
* their plain counterparts (`:`, `$`, `,`, `+`).
*
* @param {string} val The value to be encoded.
*
* @returns {string} The encoded value.
*/
function encode(val) {
	return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
/**
* Build a URL by appending params to the end
*
* @param {string} url The base of the url (e.g., http://www.google.com)
* @param {object} [params] The params to be appended
* @param {?(object|Function)} options
*
* @returns {string} The formatted url
*/
function buildURL(url, params, options) {
	if (!params) return url;
	url = url || "";
	const _options = utils_default.isFunction(options) ? { serialize: options } : options;
	const _encode = utils_default.getSafeProp(_options, "encode") || encode;
	const serializeFn = utils_default.getSafeProp(_options, "serialize");
	let serializedParams;
	if (serializeFn) serializedParams = serializeFn(params, _options);
	else serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, _options).toString(_encode);
	if (serializedParams) {
		const hashmarkIndex = url.indexOf("#");
		if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
		url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
	}
	return url;
}
//#endregion
//#region node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
	constructor() {
		this.handlers = [];
	}
	/**
	* Add a new interceptor to the stack
	*
	* @param {Function} fulfilled The function to handle `then` for a `Promise`
	* @param {Function} rejected The function to handle `reject` for a `Promise`
	* @param {Object} options The options for the interceptor, synchronous and runWhen
	*
	* @return {Number} An ID used to remove interceptor later
	*/
	use(fulfilled, rejected, options) {
		this.handlers.push({
			fulfilled,
			rejected,
			synchronous: options ? options.synchronous : false,
			runWhen: options ? options.runWhen : null
		});
		return this.handlers.length - 1;
	}
	/**
	* Remove an interceptor from the stack
	*
	* @param {Number} id The ID that was returned by `use`
	*
	* @returns {void}
	*/
	eject(id) {
		if (this.handlers[id]) this.handlers[id] = null;
	}
	/**
	* Clear all interceptors from the stack
	*
	* @returns {void}
	*/
	clear() {
		if (this.handlers) this.handlers = [];
	}
	/**
	* Iterate over all the registered interceptors
	*
	* This method is particularly useful for skipping over any
	* interceptors that may have become `null` calling `eject`.
	*
	* @param {Function} fn The function to call for each interceptor
	*
	* @returns {void}
	*/
	forEach(fn) {
		utils_default.forEach(this.handlers, function forEachHandler(h) {
			if (h !== null) fn(h);
		});
	}
};
//#endregion
//#region node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
	silentJSONParsing: true,
	forcedJSONParsing: true,
	clarifyTimeoutError: false,
	legacyInterceptorReqResOrdering: true,
	advertiseZstdAcceptEncoding: false,
	validateStatusUndefinedResolves: true
};
//#endregion
//#region node_modules/axios/lib/platform/node/classes/URLSearchParams.js
var URLSearchParams_default = url.URLSearchParams;
//#endregion
//#region node_modules/axios/lib/platform/node/index.js
var ALPHA = "abcdefghijklmnopqrstuvwxyz";
var DIGIT = "0123456789";
var ALPHABET = {
	DIGIT,
	ALPHA,
	ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
	let str = "";
	const { length } = alphabet;
	const randomValues = new Uint32Array(size);
	crypto.randomFillSync(randomValues);
	for (let i = 0; i < size; i++) str += alphabet[randomValues[i] % length];
	return str;
};
var node_default = {
	isNode: true,
	classes: {
		URLSearchParams: URLSearchParams_default,
		FormData: FormData_default,
		Blob: typeof Blob !== "undefined" && Blob || null
	},
	ALPHABET,
	generateString,
	protocols: [
		"http",
		"https",
		"file",
		"data"
	]
};
//#endregion
//#region node_modules/axios/lib/platform/common/utils.js
var utils_exports = /* @__PURE__ */ __exportAll({
	hasBrowserEnv: () => hasBrowserEnv,
	hasStandardBrowserEnv: () => hasStandardBrowserEnv,
	hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
	navigator: () => _navigator,
	origin: () => origin
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = typeof navigator === "object" && navigator || void 0;
/**
* Determine if we're running in a standard browser environment
*
* This allows axios to run in a web worker, and react-native.
* Both environments support XMLHttpRequest, but not fully standard globals.
*
* web workers:
*  typeof window -> undefined
*  typeof document -> undefined
*
* react-native:
*  navigator.product -> 'ReactNative'
* nativescript
*  navigator.product -> 'NativeScript' or 'NS'
*
* @returns {boolean}
*/
var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(_navigator.product) < 0);
/**
* Determine if we're running in a standard browser webWorker environment
*
* Although the `isStandardBrowserEnv` method indicates that
* `allows axios to run in a web worker`, the WebWorker will still be
* filtered out due to its judgment standard
* `typeof window !== 'undefined' && typeof document !== 'undefined'`.
* This leads to a problem when axios post `FormData` in webWorker
*/
var hasStandardBrowserWebWorkerEnv = (() => {
	return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var origin = hasBrowserEnv && window.location.href || "http://localhost";
//#endregion
//#region node_modules/axios/lib/platform/index.js
var platform_default = {
	...utils_exports,
	...node_default
};
//#endregion
//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
	return toFormData(data, new platform_default.classes.URLSearchParams(), {
		visitor: function(value, key, path, helpers) {
			if (platform_default.isNode && utils_default.isBuffer(value)) {
				this.append(key, value.toString("base64"));
				return false;
			}
			return helpers.defaultVisitor.apply(this, arguments);
		},
		...options
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/formDataToJSON.js
var MAX_DEPTH = 100;
function throwIfDepthExceeded(index) {
	if (index > MAX_DEPTH) throw new AxiosError("FormData field is too deeply nested (" + index + " levels). Max depth: " + MAX_DEPTH, AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED);
}
/**
* It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
*
* @param {string} name - The name of the property to get.
*
* @returns An array of strings.
*/
function parsePropPath(name) {
	const path = [];
	const pattern = /[^.[\]]+|\[([^.[\]]*)]/g;
	let match;
	while ((match = pattern.exec(name)) !== null) {
		throwIfDepthExceeded(path.length);
		path.push(match[0] === "[]" ? "" : match[1] || match[0]);
	}
	return path;
}
/**
* Convert an array to an object.
*
* @param {Array<any>} arr - The array to convert to an object.
*
* @returns An object with the same keys and values as the array.
*/
function arrayToObject(arr) {
	const obj = {};
	const keys = Object.keys(arr);
	let i;
	const len = keys.length;
	let key;
	for (i = 0; i < len; i++) {
		key = keys[i];
		obj[key] = arr[key];
	}
	return obj;
}
/**
* It takes a FormData object and returns a JavaScript object
*
* @param {string} formData The FormData object to convert to JSON.
*
* @returns {Object<string, any> | null} The converted object.
*/
function formDataToJSON(formData) {
	function buildPath(path, value, target, index) {
		throwIfDepthExceeded(index);
		let name = path[index++];
		if (name === "__proto__") return true;
		const isNumericKey = Number.isFinite(+name);
		const isLast = index >= path.length;
		name = !name && utils_default.isArray(target) ? target.length : name;
		if (isLast) {
			if (utils_default.hasOwnProp(target, name)) target[name] = utils_default.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
			else target[name] = value;
			return !isNumericKey;
		}
		if (!utils_default.hasOwnProp(target, name) || !utils_default.isObject(target[name])) target[name] = [];
		if (buildPath(path, value, target[name], index) && utils_default.isArray(target[name])) target[name] = arrayToObject(target[name]);
		return !isNumericKey;
	}
	if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
		const obj = {};
		utils_default.forEachEntry(formData, (name, value) => {
			buildPath(parsePropPath(name), value, obj, 0);
		});
		return obj;
	}
	return null;
}
//#endregion
//#region node_modules/axios/lib/defaults/index.js
var own = (obj, key) => obj != null && utils_default.hasOwnProp(obj, key) ? obj[key] : void 0;
/**
* It takes a string, tries to parse it, and if it fails, it returns the stringified version
* of the input
*
* @param {any} rawValue - The value to be stringified.
* @param {Function} parser - A function that parses a string into a JavaScript object.
* @param {Function} encoder - A function that takes a value and returns a string.
*
* @returns {string} A stringified version of the rawValue.
*/
function stringifySafely(rawValue, parser, encoder) {
	if (utils_default.isString(rawValue)) try {
		(parser || JSON.parse)(rawValue);
		return utils_default.trim(rawValue);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
	transitional: transitional_default,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function transformRequest(data, headers) {
		const contentType = headers.getContentType() || "";
		const hasJSONContentType = contentType.indexOf("application/json") > -1;
		const isObjectPayload = utils_default.isObject(data);
		if (isObjectPayload && utils_default.isHTMLForm(data)) data = new FormData(data);
		if (utils_default.isFormData(data)) return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
		if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) return data;
		if (utils_default.isArrayBufferView(data)) return data.buffer;
		if (utils_default.isURLSearchParams(data)) {
			headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
			return data.toString();
		}
		let isFileList;
		if (isObjectPayload) {
			const formSerializer = own(this, "formSerializer");
			if (contentType.indexOf("application/x-www-form-urlencoded") > -1) return toURLEncodedForm(data, formSerializer).toString();
			if ((isFileList = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
				const env = own(this, "env");
				const _FormData = env && env.FormData;
				return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData(), formSerializer);
			}
		}
		if (isObjectPayload || hasJSONContentType) {
			headers.setContentType("application/json", false);
			return stringifySafely(data);
		}
		return data;
	}],
	transformResponse: [function transformResponse(data) {
		const transitional = own(this, "transitional") || defaults.transitional;
		const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
		const responseType = own(this, "responseType");
		const JSONRequested = responseType === "json";
		if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) return data;
		if (data && utils_default.isString(data) && (forcedJSONParsing && !responseType || JSONRequested)) {
			const strictJSONParsing = !(transitional && transitional.silentJSONParsing) && JSONRequested;
			try {
				return JSON.parse(data, own(this, "parseReviver"));
			} catch (e) {
				if (strictJSONParsing) {
					if (e.name === "SyntaxError") throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, own(this, "response"));
					throw e;
				}
			}
		}
		return data;
	}],
	/**
	* A timeout in milliseconds to abort a request. If set to 0 (default) a
	* timeout is not created.
	*/
	timeout: 0,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
	maxContentLength: -1,
	maxBodyLength: -1,
	env: {
		FormData: platform_default.classes.FormData,
		Blob: platform_default.classes.Blob
	},
	validateStatus: function validateStatus(status) {
		return status >= 200 && status < 300;
	},
	headers: { common: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
utils_default.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch",
	"query"
], (method) => {
	defaults.headers[method] = {};
});
//#endregion
//#region node_modules/axios/lib/core/transformData.js
/**
* Transform the data for a request or a response
*
* @param {Array|Function} fns A single function or Array of functions
* @param {?Object} response The response object
*
* @returns {*} The resulting transformed data
*/
function transformData(fns, response) {
	const config = this || defaults;
	const context = response || config;
	const headers = AxiosHeaders.from(context.headers);
	let data = context.data;
	utils_default.forEach(fns, function transform(fn) {
		data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
	});
	headers.normalize();
	return data;
}
//#endregion
//#region node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
	return !!(value && value.__CANCEL__);
}
//#endregion
//#region node_modules/axios/lib/cancel/CanceledError.js
var CanceledError = class extends AxiosError {
	/**
	* A `CanceledError` is an object that is thrown when an operation is canceled.
	*
	* @param {string=} message The message.
	* @param {Object=} config The config.
	* @param {Object=} request The request.
	*
	* @returns {CanceledError} The created error.
	*/
	constructor(message, config, request) {
		super(message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
		this.name = "CanceledError";
		this.__CANCEL__ = true;
	}
};
//#endregion
//#region node_modules/axios/lib/core/settle.js
/**
* Resolve or reject a Promise based on response status.
*
* @param {Function} resolve A function that resolves the promise.
* @param {Function} reject A function that rejects the promise.
* @param {object} response The response.
*
* @returns {object} The response.
*/
function settle(resolve, reject, response) {
	const validateStatus = response.config.validateStatus;
	if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
	else reject(new AxiosError("Request failed with status code " + response.status, response.status >= 400 && response.status < 500 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE, response.config, response.request, response));
}
//#endregion
//#region node_modules/axios/lib/helpers/isAbsoluteURL.js
/**
* Determines whether the specified URL is absolute
*
* @param {string} url The URL to test
*
* @returns {boolean} True if the specified URL is absolute, otherwise false
*/
function isAbsoluteURL(url) {
	if (typeof url !== "string") return false;
	return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
//#endregion
//#region node_modules/axios/lib/helpers/combineURLs.js
/**
* Creates a new URL by combining the specified URLs
*
* @param {string} baseURL The base URL
* @param {string} relativeURL The relative URL
*
* @returns {string} The combined URL
*/
function combineURLs(baseURL, relativeURL) {
	if (!relativeURL) return baseURL;
	let end = baseURL.length;
	while (end > 0 && baseURL.charCodeAt(end - 1) === 47) end--;
	return baseURL.slice(0, end) + "/" + relativeURL.replace(/^\/+/, "");
}
//#endregion
//#region node_modules/axios/lib/core/buildFullPath.js
var malformedHttpProtocol = /^https?:(?!\/\/)/i;
var httpProtocolControlCharacters = /[\t\n\r]/g;
function stripLeadingC0ControlOrSpace(url) {
	let i = 0;
	while (i < url.length && url.charCodeAt(i) <= 32) i++;
	return url.slice(i);
}
function normalizeURLForProtocolCheck(url) {
	return stripLeadingC0ControlOrSpace(url).replace(httpProtocolControlCharacters, "");
}
function redactFragment(fragment) {
	if (!fragment) return fragment;
	return fragment.replace(/(^|&)([^=&]*=)?[^&]+/g, (match, separator, parameterName = "") => {
		return `${separator}${parameterName}${REDACTED}`;
	});
}
function redactSensitiveURLParts(url) {
	const redactedURL = url.replace(/^(https?:\/{0,2})[^/?#]*@/i, `$1${REDACTED}@`);
	const fragmentIndex = redactedURL.indexOf("#");
	const redactedURLWithoutFragment = (fragmentIndex === -1 ? redactedURL : redactedURL.slice(0, fragmentIndex)).replace(/([?&][^=&#]*=)[^&#]*/g, `$1${REDACTED}`);
	if (fragmentIndex === -1) return redactedURLWithoutFragment;
	return `${redactedURLWithoutFragment}#${redactFragment(redactedURL.slice(fragmentIndex + 1))}`;
}
function assertValidHttpProtocolURL(url, config) {
	if (typeof url === "string") {
		const normalizedURL = normalizeURLForProtocolCheck(url);
		if (malformedHttpProtocol.test(normalizedURL)) throw new AxiosError(`Invalid URL ${JSON.stringify(redactSensitiveURLParts(normalizedURL))}: missing "//" after protocol`, AxiosError.ERR_INVALID_URL, config);
	}
}
/**
* Creates a new URL by combining the baseURL with the requestedURL,
* only when the requestedURL is not already an absolute URL.
* If the requestURL is absolute, this function returns the requestedURL untouched.
*
* @param {string} baseURL The base URL
* @param {string} requestedURL Absolute or relative URL to combine
*
* @returns {string} The combined full path
*/
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls, config) {
	assertValidHttpProtocolURL(requestedURL, config);
	let isRelativeUrl = !isAbsoluteURL(requestedURL);
	if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) {
		assertValidHttpProtocolURL(baseURL, config);
		return combineURLs(baseURL, requestedURL);
	}
	return requestedURL;
}
//#endregion
//#region node_modules/proxy-from-env/index.js
var DEFAULT_PORTS$1 = {
	ftp: 21,
	gopher: 70,
	http: 80,
	https: 443,
	ws: 80,
	wss: 443
};
function parseUrl(urlString) {
	try {
		return new URL(urlString);
	} catch {
		return null;
	}
}
/**
* @param {string|object|URL} url - The URL as a string or URL instance, or a
*   compatible object (such as the result from legacy url.parse).
* @return {string} The URL of the proxy that should handle the request to the
*  given URL. If no proxy is set, this will be an empty string.
*/
function getProxyForUrl(url) {
	var parsedUrl = (typeof url === "string" ? parseUrl(url) : url) || {};
	var proto = parsedUrl.protocol;
	var hostname = parsedUrl.host;
	var port = parsedUrl.port;
	if (typeof hostname !== "string" || !hostname || typeof proto !== "string") return "";
	proto = proto.split(":", 1)[0];
	hostname = hostname.replace(/:\d*$/, "");
	port = parseInt(port) || DEFAULT_PORTS$1[proto] || 0;
	if (!shouldProxy(hostname, port)) return "";
	var proxy = getEnv(proto + "_proxy") || getEnv("all_proxy");
	if (proxy && proxy.indexOf("://") === -1) proxy = proto + "://" + proxy;
	return proxy;
}
/**
* Determines whether a given URL should be proxied.
*
* @param {string} hostname - The host name of the URL.
* @param {number} port - The effective port of the URL.
* @returns {boolean} Whether the given URL should be proxied.
* @private
*/
function shouldProxy(hostname, port) {
	var NO_PROXY = getEnv("no_proxy").toLowerCase();
	if (!NO_PROXY) return true;
	if (NO_PROXY === "*") return false;
	return NO_PROXY.split(/[,\s]/).every(function(proxy) {
		if (!proxy) return true;
		var parsedProxy = proxy.match(/^(.+):(\d+)$/);
		var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
		var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
		if (parsedProxyPort && parsedProxyPort !== port) return true;
		if (!/^[.*]/.test(parsedProxyHostname)) return hostname !== parsedProxyHostname;
		if (parsedProxyHostname.charAt(0) === "*") parsedProxyHostname = parsedProxyHostname.slice(1);
		return !hostname.endsWith(parsedProxyHostname);
	});
}
/**
* Get the value for an environment variable.
*
* @param {string} key - The name of the environment variable.
* @return {string} The value of the environment variable.
* @private
*/
function getEnv(key) {
	return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
//#endregion
//#region node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
				if (template[templateIndex] === "*") {
					starIndex = templateIndex;
					matchIndex = searchIndex;
					templateIndex++;
				} else {
					searchIndex++;
					templateIndex++;
				}
			} else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/has-flag/index.js
var require_has_flag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (flag, argv = process.argv) => {
		const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf("--");
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
}));
//#endregion
//#region node_modules/supports-color/index.js
var require_supports_color = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os = __require("os");
	var tty$1 = __require("tty");
	var hasFlag = require_has_flag();
	var { env } = process;
	var flagForceColor;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) flagForceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) flagForceColor = 1;
	function envForceColor() {
		if ("FORCE_COLOR" in env) {
			if (env.FORCE_COLOR === "true") return 1;
			if (env.FORCE_COLOR === "false") return 0;
			return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
		}
	}
	function translateLevel(level) {
		if (level === 0) return false;
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
		const noFlagForceColor = envForceColor();
		if (noFlagForceColor !== void 0) flagForceColor = noFlagForceColor;
		const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
		if (forceColor === 0) return 0;
		if (sniffFlags) {
			if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
			if (hasFlag("color=256")) return 2;
		}
		if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
		const min = forceColor || 0;
		if (env.TERM === "dumb") return min;
		if (process.platform === "win32") {
			const osRelease = os.release().split(".");
			if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
			return 1;
		}
		if ("CI" in env) {
			if ([
				"TRAVIS",
				"CIRCLECI",
				"APPVEYOR",
				"GITLAB_CI",
				"GITHUB_ACTIONS",
				"BUILDKITE",
				"DRONE"
			].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
			return min;
		}
		if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		if (env.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in env) {
			const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (env.TERM_PROGRAM) {
				case "iTerm.app": return version >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) return 2;
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
		if ("COLORTERM" in env) return 1;
		return min;
	}
	function getSupportLevel(stream, options = {}) {
		return translateLevel(supportsColor(stream, {
			streamIsTTY: stream && stream.isTTY,
			...options
		}));
	}
	module.exports = {
		supportsColor: getSupportLevel,
		stdout: getSupportLevel({ isTTY: tty$1.isatty(1) }),
		stderr: getSupportLevel({ isTTY: tty$1.isatty(2) })
	};
}));
//#endregion
//#region node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty = __require("tty");
	var util$1 = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util$1.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util$1.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$1.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$1.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/debug/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));
//#endregion
//#region node_modules/agent-base/dist/src/promisify.js
var require_promisify = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function promisify(fn) {
		return function(req, opts) {
			return new Promise((resolve, reject) => {
				fn.call(this, req, opts, (err, rtn) => {
					if (err) reject(err);
					else resolve(rtn);
				});
			});
		};
	}
	exports.default = promisify;
}));
//#endregion
//#region node_modules/agent-base/dist/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var events_1 = __require("events");
	var debug_1 = __importDefault(require_src$1());
	var promisify_1 = __importDefault(require_promisify());
	var debug = debug_1.default("agent-base");
	function isAgent(v) {
		return Boolean(v) && typeof v.addRequest === "function";
	}
	function isSecureEndpoint() {
		const { stack } = /* @__PURE__ */ new Error();
		if (typeof stack !== "string") return false;
		return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
	}
	function createAgent(callback, opts) {
		return new createAgent.Agent(callback, opts);
	}
	(function(createAgent) {
		/**
		* Base `http.Agent` implementation.
		* No pooling/keep-alive is implemented by default.
		*
		* @param {Function} callback
		* @api public
		*/
		class Agent extends events_1.EventEmitter {
			constructor(callback, _opts) {
				super();
				let opts = _opts;
				if (typeof callback === "function") this.callback = callback;
				else if (callback) opts = callback;
				this.timeout = null;
				if (opts && typeof opts.timeout === "number") this.timeout = opts.timeout;
				this.maxFreeSockets = 1;
				this.maxSockets = 1;
				this.maxTotalSockets = Infinity;
				this.sockets = {};
				this.freeSockets = {};
				this.requests = {};
				this.options = {};
			}
			get defaultPort() {
				if (typeof this.explicitDefaultPort === "number") return this.explicitDefaultPort;
				return isSecureEndpoint() ? 443 : 80;
			}
			set defaultPort(v) {
				this.explicitDefaultPort = v;
			}
			get protocol() {
				if (typeof this.explicitProtocol === "string") return this.explicitProtocol;
				return isSecureEndpoint() ? "https:" : "http:";
			}
			set protocol(v) {
				this.explicitProtocol = v;
			}
			callback(req, opts, fn) {
				throw new Error("\"agent-base\" has no default implementation, you must subclass and override `callback()`");
			}
			/**
			* Called by node-core's "_http_client.js" module when creating
			* a new HTTP request with this Agent instance.
			*
			* @api public
			*/
			addRequest(req, _opts) {
				const opts = Object.assign({}, _opts);
				if (typeof opts.secureEndpoint !== "boolean") opts.secureEndpoint = isSecureEndpoint();
				if (opts.host == null) opts.host = "localhost";
				if (opts.port == null) opts.port = opts.secureEndpoint ? 443 : 80;
				if (opts.protocol == null) opts.protocol = opts.secureEndpoint ? "https:" : "http:";
				if (opts.host && opts.path) delete opts.path;
				delete opts.agent;
				delete opts.hostname;
				delete opts._defaultAgent;
				delete opts.defaultPort;
				delete opts.createConnection;
				req._last = true;
				req.shouldKeepAlive = false;
				let timedOut = false;
				let timeoutId = null;
				const timeoutMs = opts.timeout || this.timeout;
				const onerror = (err) => {
					if (req._hadError) return;
					req.emit("error", err);
					req._hadError = true;
				};
				const ontimeout = () => {
					timeoutId = null;
					timedOut = true;
					const err = /* @__PURE__ */ new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
					err.code = "ETIMEOUT";
					onerror(err);
				};
				const callbackError = (err) => {
					if (timedOut) return;
					if (timeoutId !== null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					onerror(err);
				};
				const onsocket = (socket) => {
					if (timedOut) return;
					if (timeoutId != null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
					if (isAgent(socket)) {
						debug("Callback returned another Agent instance %o", socket.constructor.name);
						socket.addRequest(req, opts);
						return;
					}
					if (socket) {
						socket.once("free", () => {
							this.freeSocket(socket, opts);
						});
						req.onSocket(socket);
						return;
					}
					const err = /* @__PURE__ */ new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``);
					onerror(err);
				};
				if (typeof this.callback !== "function") {
					onerror(/* @__PURE__ */ new Error("`callback` is not defined"));
					return;
				}
				if (!this.promisifiedCallback) {
					if (this.callback.length >= 3) {
						debug("Converting legacy callback function to promise");
						this.promisifiedCallback = promisify_1.default(this.callback);
					} else this.promisifiedCallback = this.callback;
				}
				if (typeof timeoutMs === "number" && timeoutMs > 0) timeoutId = setTimeout(ontimeout, timeoutMs);
				if ("port" in opts && typeof opts.port !== "number") opts.port = Number(opts.port);
				try {
					debug("Resolving socket for %o request: %o", opts.protocol, `${req.method} ${req.path}`);
					Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
				} catch (err) {
					Promise.reject(err).catch(callbackError);
				}
			}
			freeSocket(socket, opts) {
				debug("Freeing socket %o %o", socket.constructor.name, opts);
				socket.destroy();
			}
			destroy() {
				debug("Destroying agent %o", this.constructor.name);
			}
		}
		createAgent.Agent = Agent;
		createAgent.prototype = createAgent.Agent.prototype;
	})(createAgent || (createAgent = {}));
	module.exports = createAgent;
}));
//#endregion
//#region node_modules/https-proxy-agent/dist/parse-proxy-response.js
var require_parse_proxy_response = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var debug = __importDefault(require_src$1()).default("https-proxy-agent:parse-proxy-response");
	function parseProxyResponse(socket) {
		return new Promise((resolve, reject) => {
			let buffersLength = 0;
			const buffers = [];
			function read() {
				const b = socket.read();
				if (b) ondata(b);
				else socket.once("readable", read);
			}
			function cleanup() {
				socket.removeListener("end", onend);
				socket.removeListener("error", onerror);
				socket.removeListener("close", onclose);
				socket.removeListener("readable", read);
			}
			function onclose(err) {
				debug("onclose had error %o", err);
			}
			function onend() {
				debug("onend");
			}
			function onerror(err) {
				cleanup();
				debug("onerror %o", err);
				reject(err);
			}
			function ondata(b) {
				buffers.push(b);
				buffersLength += b.length;
				const buffered = Buffer.concat(buffers, buffersLength);
				if (buffered.indexOf("\r\n\r\n") === -1) {
					debug("have not received end of HTTP headers yet...");
					read();
					return;
				}
				const firstLine = buffered.toString("ascii", 0, buffered.indexOf("\r\n"));
				const statusCode = +firstLine.split(" ")[1];
				debug("got proxy server response: %o", firstLine);
				resolve({
					statusCode,
					buffered
				});
			}
			socket.on("error", onerror);
			socket.on("close", onclose);
			socket.on("end", onend);
			read();
		});
	}
	exports.default = parseProxyResponse;
}));
//#endregion
//#region node_modules/https-proxy-agent/dist/agent.js
var require_agent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var net_1 = __importDefault(__require("net"));
	var tls_1 = __importDefault(__require("tls"));
	var url_1 = __importDefault(__require("url"));
	var assert_1 = __importDefault(__require("assert"));
	var debug_1 = __importDefault(require_src$1());
	var agent_base_1 = require_src();
	var parse_proxy_response_1 = __importDefault(require_parse_proxy_response());
	var debug = debug_1.default("https-proxy-agent:agent");
	/**
	* The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
	* the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
	*
	* Outgoing HTTP requests are first tunneled through the proxy server using the
	* `CONNECT` HTTP request method to establish a connection to the proxy server,
	* and then the proxy server connects to the destination target and issues the
	* HTTP request from the proxy server.
	*
	* `https:` requests have their socket connection upgraded to TLS once
	* the connection to the proxy server has been established.
	*
	* @api public
	*/
	var HttpsProxyAgent = class extends agent_base_1.Agent {
		constructor(_opts) {
			let opts;
			if (typeof _opts === "string") opts = url_1.default.parse(_opts);
			else opts = _opts;
			if (!opts) throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
			debug("creating new HttpsProxyAgent instance: %o", opts);
			super(opts);
			const proxy = Object.assign({}, opts);
			this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
			proxy.host = proxy.hostname || proxy.host;
			if (typeof proxy.port === "string") proxy.port = parseInt(proxy.port, 10);
			if (!proxy.port && proxy.host) proxy.port = this.secureProxy ? 443 : 80;
			if (this.secureProxy && !("ALPNProtocols" in proxy)) proxy.ALPNProtocols = ["http 1.1"];
			if (proxy.host && proxy.path) {
				delete proxy.path;
				delete proxy.pathname;
			}
			this.proxy = proxy;
		}
		/**
		* Called when the node-core HTTP client library is creating a
		* new HTTP request.
		*
		* @api protected
		*/
		callback(req, opts) {
			return __awaiter(this, void 0, void 0, function* () {
				const { proxy, secureProxy } = this;
				let socket;
				if (secureProxy) {
					debug("Creating `tls.Socket`: %o", proxy);
					socket = tls_1.default.connect(proxy);
				} else {
					debug("Creating `net.Socket`: %o", proxy);
					socket = net_1.default.connect(proxy);
				}
				const headers = Object.assign({}, proxy.headers);
				let payload = `CONNECT ${`${opts.host}:${opts.port}`} HTTP/1.1\r\n`;
				if (proxy.auth) headers["Proxy-Authorization"] = `Basic ${Buffer.from(proxy.auth).toString("base64")}`;
				let { host, port, secureEndpoint } = opts;
				if (!isDefaultPort(port, secureEndpoint)) host += `:${port}`;
				headers.Host = host;
				headers.Connection = "close";
				for (const name of Object.keys(headers)) payload += `${name}: ${headers[name]}\r\n`;
				const proxyResponsePromise = parse_proxy_response_1.default(socket);
				socket.write(`${payload}\r\n`);
				const { statusCode, buffered } = yield proxyResponsePromise;
				if (statusCode === 200) {
					req.once("socket", resume);
					if (opts.secureEndpoint) {
						debug("Upgrading socket connection to TLS");
						const servername = opts.servername || opts.host;
						return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, "host", "hostname", "path", "port")), {
							socket,
							servername
						}));
					}
					return socket;
				}
				socket.destroy();
				const fakeSocket = new net_1.default.Socket({ writable: false });
				fakeSocket.readable = true;
				req.once("socket", (s) => {
					debug("replaying proxy buffer for failed request");
					assert_1.default(s.listenerCount("data") > 0);
					s.push(buffered);
					s.push(null);
				});
				return fakeSocket;
			});
		}
	};
	exports.default = HttpsProxyAgent;
	function resume(socket) {
		socket.resume();
	}
	function isDefaultPort(port, secure) {
		return Boolean(!secure && port === 80 || secure && port === 443);
	}
	function isHTTPS(protocol) {
		return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
	}
	function omit(obj, ...keys) {
		const ret = {};
		let key;
		for (key in obj) if (!keys.includes(key)) ret[key] = obj[key];
		return ret;
	}
}));
//#endregion
//#region node_modules/https-proxy-agent/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var agent_1 = (exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	})(require_agent());
	function createHttpsProxyAgent(opts) {
		return new agent_1.default(opts);
	}
	(function(createHttpsProxyAgent) {
		createHttpsProxyAgent.HttpsProxyAgent = agent_1.default;
		createHttpsProxyAgent.prototype = agent_1.default.prototype;
	})(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
	module.exports = createHttpsProxyAgent;
}));
//#endregion
//#region node_modules/follow-redirects/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var debug;
	module.exports = function() {
		if (!debug) {
			try {
				debug = require_src$1()("follow-redirects");
			} catch (error) {}
			if (typeof debug !== "function") debug = function() {};
		}
		debug.apply(null, arguments);
	};
}));
//#endregion
//#region node_modules/follow-redirects/index.js
var require_follow_redirects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var url$1 = __require("url");
	var URL = url$1.URL;
	var http$1 = __require("http");
	var https$1 = __require("https");
	var Writable = __require("stream").Writable;
	var assert = __require("assert");
	var debug = require_debug();
	// istanbul ignore next
	(function detectUnsupportedEnvironment() {
		var looksLikeNode = typeof process !== "undefined";
		var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
		var looksLikeV8 = isFunction(Error.captureStackTrace);
		if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) console.warn("The follow-redirects package should be excluded from browser builds.");
	})();
	var useNativeURL = false;
	try {
		assert(new URL(""));
	} catch (error) {
		useNativeURL = error.code === "ERR_INVALID_URL";
	}
	var sensitiveHeaders = [
		"Authorization",
		"Proxy-Authorization",
		"Cookie"
	];
	var preservedUrlFields = [
		"auth",
		"host",
		"hostname",
		"href",
		"path",
		"pathname",
		"port",
		"protocol",
		"query",
		"search",
		"hash"
	];
	var events = [
		"abort",
		"aborted",
		"connect",
		"error",
		"socket",
		"timeout"
	];
	var eventHandlers = Object.create(null);
	events.forEach(function(event) {
		eventHandlers[event] = function(arg1, arg2, arg3) {
			this._redirectable.emit(event, arg1, arg2, arg3);
		};
	});
	var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
	var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
	var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded", RedirectionError);
	var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
	var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
	// istanbul ignore next
	var destroy = Writable.prototype.destroy || noop;
	function RedirectableRequest(options, responseCallback) {
		Writable.call(this);
		this._sanitizeOptions(options);
		this._options = options;
		this._ended = false;
		this._ending = false;
		this._redirectCount = 0;
		this._redirects = [];
		this._requestBodyLength = 0;
		this._requestBodyBuffers = [];
		if (responseCallback) this.on("response", responseCallback);
		var self = this;
		this._onNativeResponse = function(response) {
			try {
				self._processResponse(response);
			} catch (cause) {
				self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
			}
		};
		this._headerFilter = new RegExp("^(?:" + sensitiveHeaders.concat(options.sensitiveHeaders).map(escapeRegex).join("|") + ")$", "i");
		this._performRequest();
	}
	RedirectableRequest.prototype = Object.create(Writable.prototype);
	RedirectableRequest.prototype.abort = function() {
		destroyRequest(this._currentRequest);
		this._currentRequest.abort();
		this.emit("abort");
	};
	RedirectableRequest.prototype.destroy = function(error) {
		destroyRequest(this._currentRequest, error);
		destroy.call(this, error);
		return this;
	};
	RedirectableRequest.prototype.write = function(data, encoding, callback) {
		if (this._ending) throw new WriteAfterEndError();
		if (!isString(data) && !isBuffer(data)) throw new TypeError("data should be a string, Buffer or Uint8Array");
		if (isFunction(encoding)) {
			callback = encoding;
			encoding = null;
		}
		if (data.length === 0) {
			if (callback) callback();
			return;
		}
		if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
			this._requestBodyLength += data.length;
			this._requestBodyBuffers.push({
				data,
				encoding
			});
			this._currentRequest.write(data, encoding, callback);
		} else {
			this.emit("error", new MaxBodyLengthExceededError());
			this.abort();
		}
	};
	RedirectableRequest.prototype.end = function(data, encoding, callback) {
		if (isFunction(data)) {
			callback = data;
			data = encoding = null;
		} else if (isFunction(encoding)) {
			callback = encoding;
			encoding = null;
		}
		if (!data) {
			this._ended = this._ending = true;
			this._currentRequest.end(null, null, callback);
		} else {
			var self = this;
			var currentRequest = this._currentRequest;
			this.write(data, encoding, function() {
				self._ended = true;
				currentRequest.end(null, null, callback);
			});
			this._ending = true;
		}
	};
	RedirectableRequest.prototype.setHeader = function(name, value) {
		this._options.headers[name] = value;
		this._currentRequest.setHeader(name, value);
	};
	RedirectableRequest.prototype.removeHeader = function(name) {
		delete this._options.headers[name];
		this._currentRequest.removeHeader(name);
	};
	RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
		var self = this;
		function destroyOnTimeout(socket) {
			socket.setTimeout(msecs);
			socket.removeListener("timeout", socket.destroy);
			socket.addListener("timeout", socket.destroy);
		}
		function startTimer(socket) {
			if (self._timeout) clearTimeout(self._timeout);
			self._timeout = setTimeout(function() {
				self.emit("timeout");
				clearTimer();
			}, msecs);
			destroyOnTimeout(socket);
		}
		function clearTimer() {
			if (self._timeout) {
				clearTimeout(self._timeout);
				self._timeout = null;
			}
			self.removeListener("abort", clearTimer);
			self.removeListener("error", clearTimer);
			self.removeListener("response", clearTimer);
			self.removeListener("close", clearTimer);
			if (callback) self.removeListener("timeout", callback);
			if (!self.socket) self._currentRequest.removeListener("socket", startTimer);
		}
		if (callback) this.on("timeout", callback);
		if (this.socket) startTimer(this.socket);
		else this._currentRequest.once("socket", startTimer);
		this.on("socket", destroyOnTimeout);
		this.on("abort", clearTimer);
		this.on("error", clearTimer);
		this.on("response", clearTimer);
		this.on("close", clearTimer);
		return this;
	};
	[
		"flushHeaders",
		"getHeader",
		"setNoDelay",
		"setSocketKeepAlive"
	].forEach(function(method) {
		RedirectableRequest.prototype[method] = function(a, b) {
			return this._currentRequest[method](a, b);
		};
	});
	[
		"aborted",
		"connection",
		"socket"
	].forEach(function(property) {
		Object.defineProperty(RedirectableRequest.prototype, property, { get: function() {
			return this._currentRequest[property];
		} });
	});
	RedirectableRequest.prototype._sanitizeOptions = function(options) {
		if (!options.headers) options.headers = {};
		if (!isArray(options.sensitiveHeaders)) options.sensitiveHeaders = [];
		if (options.host) {
			if (!options.hostname) options.hostname = options.host;
			delete options.host;
		}
		if (!options.pathname && options.path) {
			var searchPos = options.path.indexOf("?");
			if (searchPos < 0) options.pathname = options.path;
			else {
				options.pathname = options.path.substring(0, searchPos);
				options.search = options.path.substring(searchPos);
			}
		}
	};
	RedirectableRequest.prototype._performRequest = function() {
		var protocol = this._options.protocol;
		var nativeProtocol = this._options.nativeProtocols[protocol];
		if (!nativeProtocol) throw new TypeError("Unsupported protocol " + protocol);
		if (this._options.agents) {
			var scheme = protocol.slice(0, -1);
			this._options.agent = this._options.agents[scheme];
		}
		var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
		request._redirectable = this;
		for (var event of events) request.on(event, eventHandlers[event]);
		this._currentUrl = /^\//.test(this._options.path) ? url$1.format(this._options) : this._options.path;
		if (this._isRedirect) {
			var i = 0;
			var self = this;
			var buffers = this._requestBodyBuffers;
			(function writeNext(error) {
				// istanbul ignore else
				if (request === self._currentRequest) {
					// istanbul ignore if
					if (error) self.emit("error", error);
					else if (i < buffers.length) {
						var buffer = buffers[i++];
						// istanbul ignore else
						if (!request.finished) request.write(buffer.data, buffer.encoding, writeNext);
					} else if (self._ended) request.end();
				}
			})();
		}
	};
	RedirectableRequest.prototype._processResponse = function(response) {
		var statusCode = response.statusCode;
		if (this._options.trackRedirects) this._redirects.push({
			url: this._currentUrl,
			headers: response.headers,
			statusCode
		});
		var location = response.headers.location;
		if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
			response.responseUrl = this._currentUrl;
			response.redirects = this._redirects;
			this.emit("response", response);
			this._requestBodyBuffers = [];
			return;
		}
		destroyRequest(this._currentRequest);
		response.destroy();
		if (++this._redirectCount > this._options.maxRedirects) throw new TooManyRedirectsError();
		var requestHeaders;
		var beforeRedirect = this._options.beforeRedirect;
		if (beforeRedirect) requestHeaders = Object.assign({ Host: response.req.getHeader("host") }, this._options.headers);
		var method = this._options.method;
		if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
			this._options.method = "GET";
			this._requestBodyBuffers = [];
			removeMatchingHeaders(/^content-/i, this._options.headers);
		}
		var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
		var currentUrlParts = parseUrl(this._currentUrl);
		var currentHost = currentHostHeader || currentUrlParts.host;
		var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url$1.format(Object.assign(currentUrlParts, { host: currentHost }));
		var redirectUrl = resolveUrl(location, currentUrl);
		debug("redirecting to", redirectUrl.href);
		this._isRedirect = true;
		spreadUrlObject(redirectUrl, this._options);
		if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) removeMatchingHeaders(this._headerFilter, this._options.headers);
		if (isFunction(beforeRedirect)) {
			var responseDetails = {
				headers: response.headers,
				statusCode
			};
			var requestDetails = {
				url: currentUrl,
				method,
				headers: requestHeaders
			};
			beforeRedirect(this._options, responseDetails, requestDetails);
			this._sanitizeOptions(this._options);
		}
		this._performRequest();
	};
	function wrap(protocols) {
		var exports$1 = {
			maxRedirects: 21,
			maxBodyLength: 10485760
		};
		var nativeProtocols = {};
		Object.keys(protocols).forEach(function(scheme) {
			var protocol = scheme + ":";
			var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
			var wrappedProtocol = exports$1[scheme] = Object.create(nativeProtocol);
			function request(input, options, callback) {
				if (isURL(input)) input = spreadUrlObject(input);
				else if (isString(input)) input = spreadUrlObject(parseUrl(input));
				else {
					callback = options;
					options = validateUrl(input);
					input = { protocol };
				}
				if (isFunction(options)) {
					callback = options;
					options = null;
				}
				options = Object.assign({
					maxRedirects: exports$1.maxRedirects,
					maxBodyLength: exports$1.maxBodyLength
				}, input, options);
				options.nativeProtocols = nativeProtocols;
				if (!isString(options.host) && !isString(options.hostname)) options.hostname = "::1";
				assert.equal(options.protocol, protocol, "protocol mismatch");
				debug("options", options);
				return new RedirectableRequest(options, callback);
			}
			function get(input, options, callback) {
				var wrappedRequest = wrappedProtocol.request(input, options, callback);
				wrappedRequest.end();
				return wrappedRequest;
			}
			Object.defineProperties(wrappedProtocol, {
				request: {
					value: request,
					configurable: true,
					enumerable: true,
					writable: true
				},
				get: {
					value: get,
					configurable: true,
					enumerable: true,
					writable: true
				}
			});
		});
		return exports$1;
	}
	function noop() {}
	function parseUrl(input) {
		var parsed;
		// istanbul ignore else
		if (useNativeURL) parsed = new URL(input);
		else {
			parsed = validateUrl(url$1.parse(input));
			if (!isString(parsed.protocol)) throw new InvalidUrlError({ input });
		}
		return parsed;
	}
	function resolveUrl(relative, base) {
		// istanbul ignore next
		return useNativeURL ? new URL(relative, base) : parseUrl(url$1.resolve(base, relative));
	}
	function validateUrl(input) {
		if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) throw new InvalidUrlError({ input: input.href || input });
		if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) throw new InvalidUrlError({ input: input.href || input });
		return input;
	}
	function spreadUrlObject(urlObject, target) {
		var spread = target || {};
		for (var key of preservedUrlFields) spread[key] = urlObject[key];
		if (spread.hostname.startsWith("[")) spread.hostname = spread.hostname.slice(1, -1);
		if (spread.port !== "") spread.port = Number(spread.port);
		spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;
		return spread;
	}
	function removeMatchingHeaders(regex, headers) {
		var lastValue;
		for (var header in headers) if (regex.test(header)) {
			lastValue = headers[header];
			delete headers[header];
		}
		return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
	}
	function createErrorType(code, message, baseClass) {
		function CustomError(properties) {
			// istanbul ignore else
			if (isFunction(Error.captureStackTrace)) Error.captureStackTrace(this, this.constructor);
			Object.assign(this, properties || {});
			this.code = code;
			this.message = this.cause ? message + ": " + this.cause.message : message;
		}
		CustomError.prototype = new (baseClass || Error)();
		Object.defineProperties(CustomError.prototype, {
			constructor: {
				value: CustomError,
				enumerable: false
			},
			name: {
				value: "Error [" + code + "]",
				enumerable: false
			}
		});
		return CustomError;
	}
	function destroyRequest(request, error) {
		for (var event of events) request.removeListener(event, eventHandlers[event]);
		request.on("error", noop);
		request.destroy(error);
	}
	function isSubdomain(subdomain, domain) {
		assert(isString(subdomain) && isString(domain));
		var dot = subdomain.length - domain.length - 1;
		return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
	}
	function isArray(value) {
		return value instanceof Array;
	}
	function isString(value) {
		return typeof value === "string" || value instanceof String;
	}
	function isFunction(value) {
		return typeof value === "function";
	}
	function isBuffer(value) {
		return typeof value === "object" && "length" in value;
	}
	function isURL(value) {
		return URL && value instanceof URL;
	}
	function escapeRegex(regex) {
		return regex.replace(/[\]\\/()*+?.$]/g, "\\$&");
	}
	module.exports = wrap({
		http: http$1,
		https: https$1
	});
	module.exports.wrap = wrap;
}));
//#endregion
//#region node_modules/axios/lib/env/data.js
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
var import_follow_redirects = /* @__PURE__ */ __toESM(require_follow_redirects(), 1);
var VERSION = "1.19.0";
//#endregion
//#region node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
	const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url);
	return match && match[1] || "";
}
//#endregion
//#region node_modules/axios/lib/helpers/fromDataURI.js
var DATA_URL_PATTERN = /^([^,;]+\/[^,;]+)?((?:;[^,;=]+=[^,;]+)*)(;base64)?,([\s\S]*)$/;
/**
* Parse data uri to a Buffer or Blob
*
* @param {String} uri
* @param {?Boolean} asBlob
* @param {?Object} options
* @param {?Function} options.Blob
*
* @returns {Buffer|Blob}
*/
function fromDataURI(uri, asBlob, options) {
	const _Blob = options && options.Blob || platform_default.classes.Blob;
	const protocol = parseProtocol(uri);
	if (asBlob === void 0 && _Blob) asBlob = true;
	if (protocol === "data") {
		uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
		const match = DATA_URL_PATTERN.exec(uri);
		if (!match) throw new AxiosError("Invalid URL", AxiosError.ERR_INVALID_URL);
		const type = match[1];
		const params = match[2];
		const encoding = match[3] ? "base64" : "utf8";
		const body = match[4];
		let mime = "";
		if (type) mime = params ? type + params : type;
		else if (params) mime = "text/plain" + params;
		const buffer = encoding === "base64" ? Buffer.from(body, "base64") : Buffer.from(decodeURIComponent(body), encoding);
		if (asBlob) {
			if (!_Blob) throw new AxiosError("Blob is not supported", AxiosError.ERR_NOT_SUPPORT);
			return new _Blob([buffer], { type: mime });
		}
		return buffer;
	}
	throw new AxiosError("Unsupported protocol " + protocol, AxiosError.ERR_NOT_SUPPORT);
}
//#endregion
//#region node_modules/axios/lib/core/setFormDataHeaders.js
var FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
/**
* Apply the headers generated by a FormData implementation to the request headers,
* honoring the `formDataHeaderPolicy` option: with 'content-only', copy only the
* content-* headers; otherwise merge all of them.
*
* @param {AxiosHeaders} headers - the request headers to mutate
* @param {Object | null | undefined} formHeaders - headers produced by the FormData implementation
* @param {String} [policy] - the resolved `formDataHeaderPolicy` config value
*
* @returns {void}
*/
function setFormDataHeaders(headers, formHeaders, policy) {
	if (policy !== "content-only") {
		headers.set(formHeaders);
		return;
	}
	Object.entries(formHeaders || {}).forEach(([key, val]) => {
		if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) headers.set(key, val);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosTransformStream.js
var kInternals = Symbol("internals");
var AxiosTransformStream = class extends stream.Transform {
	constructor(options) {
		options = utils_default.toFlatObject(options, {
			maxRate: 0,
			chunkSize: 65536,
			minChunkSize: 100,
			timeWindow: 500,
			ticksRate: 2,
			samplesCount: 15
		}, null, (prop, source) => {
			return !utils_default.isUndefined(source[prop]);
		});
		super({ readableHighWaterMark: options.chunkSize });
		const internals = this[kInternals] = {
			timeWindow: options.timeWindow,
			chunkSize: options.chunkSize,
			maxRate: options.maxRate,
			minChunkSize: options.minChunkSize,
			bytesSeen: 0,
			isCaptured: false,
			notifiedBytesLoaded: 0,
			ts: Date.now(),
			bytes: 0,
			onReadCallback: null
		};
		this.on("newListener", (event) => {
			if (event === "progress") {
				if (!internals.isCaptured) internals.isCaptured = true;
			}
		});
	}
	_read(size) {
		const internals = this[kInternals];
		if (internals.onReadCallback) internals.onReadCallback();
		return super._read(size);
	}
	_transform(chunk, encoding, callback) {
		const internals = this[kInternals];
		const maxRate = internals.maxRate;
		const readableHighWaterMark = this.readableHighWaterMark;
		const timeWindow = internals.timeWindow;
		const bytesThreshold = maxRate / (1e3 / timeWindow);
		const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * .01) : 0;
		const pushChunk = (_chunk, _callback) => {
			const bytes = Buffer.byteLength(_chunk);
			internals.bytesSeen += bytes;
			internals.bytes += bytes;
			internals.isCaptured && this.emit("progress", internals.bytesSeen);
			if (this.push(_chunk)) process.nextTick(_callback);
			else internals.onReadCallback = () => {
				internals.onReadCallback = null;
				process.nextTick(_callback);
			};
		};
		const transformChunk = (_chunk, _callback) => {
			const chunkSize = Buffer.byteLength(_chunk);
			let chunkRemainder = null;
			let maxChunkSize = readableHighWaterMark;
			let bytesLeft;
			let passed = 0;
			if (maxRate) {
				const now = Date.now();
				if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
					internals.ts = now;
					bytesLeft = bytesThreshold - internals.bytes;
					internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
					passed = 0;
				}
				bytesLeft = bytesThreshold - internals.bytes;
			}
			if (maxRate) {
				if (bytesLeft <= 0) return setTimeout(() => {
					_callback(null, _chunk);
				}, timeWindow - passed);
				if (bytesLeft < maxChunkSize) maxChunkSize = bytesLeft;
			}
			if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
				chunkRemainder = _chunk.subarray(maxChunkSize);
				_chunk = _chunk.subarray(0, maxChunkSize);
			}
			pushChunk(_chunk, chunkRemainder ? () => {
				process.nextTick(_callback, null, chunkRemainder);
			} : _callback);
		};
		transformChunk(chunk, function transformNextChunk(err, _chunk) {
			if (err) return callback(err);
			if (_chunk) transformChunk(_chunk, transformNextChunk);
			else callback(null);
		});
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/readBlob.js
var { asyncIterator } = Symbol;
var readBlob = async function* (blob) {
	if (blob.stream) yield* blob.stream();
	else if (blob.arrayBuffer) yield await blob.arrayBuffer();
	else if (blob[asyncIterator]) yield* blob[asyncIterator]();
	else yield blob;
};
//#endregion
//#region node_modules/axios/lib/helpers/formDataToStream.js
var BOUNDARY_ALPHABET = platform_default.ALPHABET.ALPHA_DIGIT + "-_";
var textEncoder = typeof TextEncoder === "function" ? new TextEncoder() : new util.TextEncoder();
var CRLF = "\r\n";
var CRLF_BYTES = textEncoder.encode(CRLF);
var CRLF_BYTES_COUNT = 2;
var FormDataPart = class {
	constructor(name, value) {
		const { escapeName } = this.constructor;
		const isStringValue = utils_default.isString(value);
		let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
		if (isStringValue) value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
		else {
			const safeType = String(value.type || "application/octet-stream").replace(/[\r\n]/g, "");
			headers += `Content-Type: ${safeType}${CRLF}`;
		}
		this.headers = textEncoder.encode(headers + CRLF);
		this.contentLength = isStringValue ? value.byteLength : value.size;
		this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
		this.name = name;
		this.value = value;
	}
	async *encode() {
		yield this.headers;
		const { value } = this;
		if (utils_default.isTypedArray(value)) yield value;
		else yield* readBlob(value);
		yield CRLF_BYTES;
	}
	static escapeName(name) {
		return String(name).replace(/[\r\n"]/g, (match) => ({
			"\r": "%0D",
			"\n": "%0A",
			"\"": "%22"
		})[match]);
	}
};
var formDataToStream = (form, headersHandler, options) => {
	const { tag = "form-data-boundary", size = 25, boundary = tag + "-" + platform_default.generateString(size, BOUNDARY_ALPHABET) } = options || {};
	if (!utils_default.isFormData(form)) throw new TypeError("FormData instance required");
	if (boundary.length < 1 || boundary.length > 70) throw new Error("boundary must be 1-70 characters long");
	const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
	const footerBytes = textEncoder.encode("--" + boundary + "--\r\n");
	let contentLength = footerBytes.byteLength;
	const parts = Array.from(form.entries()).map(([name, value]) => {
		const part = new FormDataPart(name, value);
		contentLength += part.size;
		return part;
	});
	contentLength += boundaryBytes.byteLength * parts.length;
	contentLength = utils_default.toFiniteNumber(contentLength);
	const computedHeaders = { "Content-Type": `multipart/form-data; boundary=${boundary}` };
	if (Number.isFinite(contentLength)) computedHeaders["Content-Length"] = contentLength;
	headersHandler && headersHandler(computedHeaders);
	return Readable.from((async function* () {
		for (const part of parts) {
			yield boundaryBytes;
			yield* part.encode();
		}
		yield footerBytes;
	})());
};
//#endregion
//#region node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js
var ZlibHeaderTransformStream = class extends stream.Transform {
	__transform(chunk, encoding, callback) {
		this.push(chunk);
		callback();
	}
	_transform(chunk, encoding, callback) {
		if (chunk.length !== 0) {
			this._transform = this.__transform;
			if (chunk[0] !== 120) {
				const header = Buffer.alloc(2);
				header[0] = 120;
				header[1] = 156;
				this.push(header, encoding);
			}
		}
		this.__transform(chunk, encoding, callback);
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/Http2Sessions.js
var Http2Sessions = class {
	constructor() {
		this.sessions = Object.create(null);
	}
	getSession(authority, options) {
		options = Object.assign({ sessionTimeout: 1e3 }, options);
		let authoritySessions = this.sessions[authority];
		if (authoritySessions) {
			let len = authoritySessions.length;
			for (let i = 0; i < len; i++) {
				const [sessionHandle, sessionOptions] = authoritySessions[i];
				if (!sessionHandle.destroyed && !sessionHandle.closed && util.isDeepStrictEqual(sessionOptions, options)) return sessionHandle;
			}
		}
		const session = http2.connect(authority, options);
		let removed;
		let timer;
		const removeSession = () => {
			if (removed) return;
			removed = true;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			let entries = authoritySessions, len = entries.length, i = len;
			while (i--) if (entries[i][0] === session) {
				if (len === 1) delete this.sessions[authority];
				else entries.splice(i, 1);
				if (!session.closed) session.close();
				return;
			}
		};
		const originalRequestFn = session.request;
		const { sessionTimeout } = options;
		if (sessionTimeout != null) {
			let streamsCount = 0;
			session.request = function() {
				const stream = originalRequestFn.apply(this, arguments);
				streamsCount++;
				if (timer) {
					clearTimeout(timer);
					timer = null;
				}
				stream.once("close", () => {
					if (!--streamsCount) timer = setTimeout(() => {
						timer = null;
						removeSession();
					}, sessionTimeout);
				});
				return stream;
			};
		}
		session.once("close", removeSession);
		let entry = [session, options];
		authoritySessions ? authoritySessions.push(entry) : authoritySessions = this.sessions[authority] = [entry];
		return session;
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/callbackify.js
var callbackify = (fn, reducer) => {
	return utils_default.isAsyncFn(fn) ? function(...args) {
		const cb = args.pop();
		fn.apply(this, args).then((value) => {
			try {
				reducer ? cb(null, ...reducer(value)) : cb(null, value);
			} catch (err) {
				cb(err);
			}
		}, cb);
	} : fn;
};
//#endregion
//#region node_modules/axios/lib/helpers/shouldBypassProxy.js
var LOOPBACK_HOSTNAMES = /* @__PURE__ */ new Set(["localhost", "0.0.0.0"]);
var isIPv4Loopback = (host) => {
	const parts = host.split(".");
	if (parts.length !== 4) return false;
	if (parts[0] !== "127") return false;
	return parts.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
};
/**
* Canonicalize an IPv4 address written in shorthand, octal, or hex form into
* dotted-decimal. IPv6 addresses and non-IP strings are returned unchanged so
* the existing IPv4-mapped IPv6 unmap path and the isLoopback path can still
* see them.
*
* Shorthand expansion mirrors Node's URL parser: literal parts fill from the
* left, the final part fills the remaining octets from the right with
* zero-padding on the left.
*   127.1     -> 127.0.0.1
*   127.0.1   -> 127.0.0.1
*   1.2.3     -> 1.2.0.3
*
* Each octet is parsed with an explicit base: 16 for `0x`/`0X` prefix, 8 for
* zero-prefixed multi-digit all-`0-7` parts, 10 otherwise. Zero-prefixed
* decimal-looking parts that contain `8` or `9` are rejected to match Node's
* URL parser, and the comparison layer falls through to non-bypass if either
* side rejects the form (fail-safe).
*
* Returns the input unchanged on any parse failure, out-of-range octet, or
* unusual shape (1-part, 5+ parts) so the comparison layer fails closed.
*/
var parseIPv4Octet = (text) => {
	if (/^0[xX][0-9a-fA-F]+$/.test(text)) {
		const n = parseInt(text.slice(2), 16);
		return Number.isFinite(n) ? n : null;
	}
	if (text.length > 1 && /^0[0-7]+$/.test(text)) {
		const n = parseInt(text, 8);
		return Number.isFinite(n) ? n : null;
	}
	if (text.length > 1 && /^0[0-9]+$/.test(text)) return null;
	if (/^[0-9]+$/.test(text)) {
		const n = parseInt(text, 10);
		return Number.isFinite(n) ? n : null;
	}
	return null;
};
var normalizeIPAddress = (host) => {
	if (typeof host !== "string" || !host || host.indexOf(":") !== -1) return host;
	let h = host;
	if (h.charAt(0) === "[" && h.charAt(h.length - 1) === "]") h = h.slice(1, -1);
	h = h.replace(/\.+$/, "");
	if (!/^[0-9.xXa-fA-F]+$/.test(h)) return host;
	const parts = h.split(".");
	if (parts.some((p) => p === "")) return host;
	if (parts.length === 4) {
		const octets = parts.map(parseIPv4Octet);
		if (octets.some((n) => n === null || n < 0 || n > 255)) return host;
		return octets.join(".");
	}
	if (parts.length > 4) return host;
	if (parts.length === 1) return host;
	const literalOctets = parts.slice(0, -1);
	const tail = parts[parts.length - 1];
	const tailSlots = 4 - literalOctets.length;
	const tailValue = parseIPv4Octet(tail);
	if (tailValue === null) return host;
	const maxTail = (1 << 8 * tailSlots) - 1;
	if (tailValue < 0 || tailValue > maxTail) return host;
	const tailOctets = new Array(tailSlots).fill(0);
	for (let i = tailSlots - 1, v = tailValue; i >= 0; i--, v >>= 8) tailOctets[i] = v & 255;
	const literal = literalOctets.map(parseIPv4Octet);
	if (literal.some((n) => n === null || n < 0 || n > 255)) return host;
	return [...literal, ...tailOctets].join(".");
};
var isIPv6ZeroGroup = (group) => /^0{1,4}$/.test(group);
var isIPv6Unspecified = (host) => {
	if (host === "::") return true;
	const compressionIndex = host.indexOf("::");
	if (compressionIndex !== -1) {
		if (compressionIndex !== host.lastIndexOf("::")) return false;
		const left = host.slice(0, compressionIndex);
		const right = host.slice(compressionIndex + 2);
		const leftGroups = left ? left.split(":") : [];
		const rightGroups = right ? right.split(":") : [];
		return leftGroups.length + rightGroups.length < 8 && leftGroups.every(isIPv6ZeroGroup) && rightGroups.every(isIPv6ZeroGroup);
	}
	const groups = host.split(":");
	return groups.length === 8 && groups.every(isIPv6ZeroGroup);
};
var isIPv6Loopback = (host) => {
	if (host === "::1") return true;
	const v4MappedDotted = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
	if (v4MappedDotted) return isIPv4Loopback(v4MappedDotted[1]);
	const v4MappedHex = host.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
	if (v4MappedHex) {
		const high = parseInt(v4MappedHex[1], 16);
		return high >= 32512 && high <= 32767;
	}
	const groups = host.split(":");
	if (groups.length === 8) {
		for (let i = 0; i < 7; i++) if (!/^0+$/.test(groups[i])) return false;
		return /^0*1$/.test(groups[7]);
	}
	return false;
};
var isLoopback = (host) => {
	if (!host) return false;
	if (LOOPBACK_HOSTNAMES.has(host)) return true;
	if (isIPv4Loopback(host)) return true;
	if (isIPv6Unspecified(host)) return true;
	return isIPv6Loopback(host);
};
var DEFAULT_PORTS = {
	http: 80,
	https: 443,
	ws: 80,
	wss: 443,
	ftp: 21
};
var parseNoProxyEntry = (entry) => {
	let entryHost = entry;
	let entryPort = 0;
	if (entryHost.charAt(0) === "[") {
		const bracketIndex = entryHost.indexOf("]");
		if (bracketIndex !== -1) {
			const host = entryHost.slice(1, bracketIndex);
			const rest = entryHost.slice(bracketIndex + 1);
			if (rest.charAt(0) === ":" && /^\d+$/.test(rest.slice(1))) entryPort = Number.parseInt(rest.slice(1), 10);
			return [host, entryPort];
		}
	}
	const firstColon = entryHost.indexOf(":");
	const lastColon = entryHost.lastIndexOf(":");
	if (firstColon !== -1 && firstColon === lastColon && /^\d+$/.test(entryHost.slice(lastColon + 1))) {
		entryPort = Number.parseInt(entryHost.slice(lastColon + 1), 10);
		entryHost = entryHost.slice(0, lastColon);
	}
	return [entryHost, entryPort];
};
var IPV4_MAPPED_DOTTED_RE = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:(\d+\.\d+\.\d+\.\d+)$/i;
var IPV4_MAPPED_HEX_RE = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
var unmapIPv4MappedIPv6 = (host) => {
	if (typeof host !== "string" || host.indexOf(":") === -1) return host;
	const dotted = host.match(IPV4_MAPPED_DOTTED_RE);
	if (dotted) return dotted[1];
	const hex = host.match(IPV4_MAPPED_HEX_RE);
	if (hex) {
		const high = parseInt(hex[1], 16);
		const low = parseInt(hex[2], 16);
		return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
	}
	return host;
};
var normalizeNoProxyHost = (hostname) => {
	if (!hostname) return hostname;
	if (hostname.charAt(0) === "[" && hostname.charAt(hostname.length - 1) === "]") hostname = hostname.slice(1, -1);
	const trimmed = hostname.replace(/\.+$/, "");
	const ipv4 = normalizeIPAddress(trimmed);
	if (ipv4 !== trimmed) return ipv4;
	return unmapIPv4MappedIPv6(trimmed);
};
function shouldBypassProxy(location) {
	let parsed;
	try {
		parsed = new URL(location);
	} catch (_err) {
		return false;
	}
	const noProxy = (process.env.no_proxy || process.env.NO_PROXY || "").toLowerCase();
	if (!noProxy) return false;
	if (noProxy === "*") return true;
	const port = Number.parseInt(parsed.port, 10) || DEFAULT_PORTS[parsed.protocol.split(":", 1)[0]] || 0;
	const hostname = normalizeNoProxyHost(parsed.hostname.toLowerCase());
	return noProxy.split(/[\s,]+/).some((entry) => {
		if (!entry) return false;
		if (entry === "*") return true;
		let [entryHost, entryPort] = parseNoProxyEntry(entry);
		entryHost = normalizeNoProxyHost(entryHost);
		if (!entryHost) return false;
		if (entryPort && entryPort !== port) return false;
		if (entryHost.charAt(0) === "*") entryHost = entryHost.slice(1);
		if (entryHost.charAt(0) === ".") return hostname.endsWith(entryHost);
		return hostname === entryHost || isLoopback(hostname) && isLoopback(entryHost);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/speedometer.js
/**
* Calculate data maxRate
* @param {Number} [samplesCount= 10]
* @param {Number} [min= 1000]
* @returns {Function}
*/
function speedometer(samplesCount, min) {
	samplesCount = samplesCount || 10;
	const bytes = new Array(samplesCount);
	const timestamps = new Array(samplesCount);
	let head = 0;
	let tail = 0;
	let firstSampleTS;
	min = min !== void 0 ? min : 1e3;
	return function push(chunkLength) {
		const now = Date.now();
		const startedAt = timestamps[tail];
		if (!firstSampleTS) firstSampleTS = now;
		bytes[head] = chunkLength;
		timestamps[head] = now;
		let i = tail;
		let bytesCount = 0;
		while (i !== head) {
			bytesCount += bytes[i++];
			i = i % samplesCount;
		}
		head = (head + 1) % samplesCount;
		if (head === tail) tail = (tail + 1) % samplesCount;
		if (now - firstSampleTS < min) return;
		const passed = startedAt && now - startedAt;
		return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/throttle.js
/**
* Throttle decorator
* @param {Function} fn
* @param {Number} freq
* @return {Function}
*/
function throttle(fn, freq) {
	let timestamp = 0;
	let threshold = 1e3 / freq;
	let lastArgs;
	let timer;
	const invoke = (args, now = Date.now()) => {
		timestamp = now;
		lastArgs = null;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		fn(...args);
	};
	const throttled = (...args) => {
		const now = Date.now();
		const passed = now - timestamp;
		if (passed >= threshold) invoke(args, now);
		else {
			lastArgs = args;
			if (!timer) timer = setTimeout(() => {
				timer = null;
				invoke(lastArgs);
			}, threshold - passed);
		}
	};
	const flush = () => lastArgs && invoke(lastArgs);
	return [throttled, flush];
}
//#endregion
//#region node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
	let bytesNotified = 0;
	const _speedometer = speedometer(50, 250);
	return throttle((e) => {
		if (!e || typeof e.loaded !== "number") return;
		const rawLoaded = e.loaded;
		const total = e.lengthComputable ? e.total : void 0;
		const loaded = Math.max(0, total != null ? Math.min(rawLoaded, total) : rawLoaded);
		const progressBytes = Math.max(0, loaded - bytesNotified);
		const rate = _speedometer(progressBytes);
		bytesNotified = Math.max(bytesNotified, loaded);
		listener({
			loaded,
			total,
			progress: total ? loaded / total : void 0,
			bytes: progressBytes,
			rate: rate ? rate : void 0,
			estimated: rate && total ? (total - loaded) / rate : void 0,
			event: e,
			lengthComputable: total != null,
			[isDownloadStream ? "download" : "upload"]: true
		});
	}, freq);
};
var progressEventDecorator = (total, throttled) => {
	const lengthComputable = total != null;
	return [(loaded) => throttled[0]({
		lengthComputable,
		total,
		loaded
	}), throttled[1]];
};
var asyncDecorator = (fn, scheduler = utils_default.asap) => (...args) => scheduler(() => fn(...args));
//#endregion
//#region node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
/**
* Estimate data: URL byte lengths *without* allocating large buffers.
* - Fetch percent-decodes a base64 body before decoding it.
* - Node's Buffer.from(body, 'base64') sizes its backing allocation from the
*   raw body, including ignored characters and content after padding.
* - Non-base64 data is percent-decoded and then encoded as UTF-8.
*/
var isHexDigit = (charCode) => charCode >= 48 && charCode <= 57 || charCode >= 65 && charCode <= 70 || charCode >= 97 && charCode <= 102;
var isPercentEncodedByte = (str, i, len) => i + 2 < len && isHexDigit(str.charCodeAt(i + 1)) && isHexDigit(str.charCodeAt(i + 2));
var hexValue = (charCode) => charCode <= 57 ? charCode - 48 : (charCode & 223) - 55;
var isBase64Char = (charCode) => charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122 || charCode >= 48 && charCode <= 57 || charCode === 43 || charCode === 47 || charCode === 45 || charCode === 95;
var isBase64Whitespace = (charCode) => charCode === 9 || charCode === 10 || charCode === 12 || charCode === 13 || charCode === 32;
var base64Bytes = (significant) => {
	const groups = Math.floor(significant / 4);
	const remainder = significant % 4;
	return groups * 3 + (remainder === 2 ? 1 : remainder === 3 ? 2 : 0);
};
var estimateBase64BufferAllocation = (body) => {
	const len = body.length;
	let padding = 0;
	if (len > 0 && body.charCodeAt(len - 1) === 61) {
		padding++;
		if (len > 1 && body.charCodeAt(len - 2) === 61) padding++;
	}
	return Math.floor((len - padding) * 3 / 4);
};
var estimatePercentDecodedBase64Bytes = (body) => {
	const len = body.length;
	let significant = 0;
	let padding = 0;
	let invalid = false;
	for (let i = 0; i < len; i++) {
		let code = body.charCodeAt(i);
		if (code === 37 && isPercentEncodedByte(body, i, len)) {
			code = hexValue(body.charCodeAt(i + 1)) * 16 + hexValue(body.charCodeAt(i + 2));
			i += 2;
		}
		if (isBase64Whitespace(code)) continue;
		if (code === 61) {
			padding++;
			continue;
		}
		if (!isBase64Char(code) || padding > 0) {
			invalid = true;
			continue;
		}
		significant++;
	}
	if (invalid || padding > 2 || padding > 0 && (significant + padding) % 4 !== 0 || significant % 4 === 1) return estimateBase64BufferAllocation(body);
	return base64Bytes(significant);
};
var estimateDataURLBytes = (url, estimateBase64) => {
	if (!url || typeof url !== "string") return 0;
	if (!url.startsWith("data:")) return 0;
	const comma = url.indexOf(",");
	if (comma < 0) return 0;
	const meta = url.slice(5, comma);
	const body = url.slice(comma + 1);
	if (/;base64/i.test(meta)) return estimateBase64(body);
	let bytes = 0;
	for (let i = 0, len = body.length; i < len; i++) {
		const c = body.charCodeAt(i);
		if (c === 37 && isPercentEncodedByte(body, i, len)) {
			bytes += 1;
			i += 2;
		} else if (c < 128) bytes += 1;
		else if (c < 2048) bytes += 2;
		else if (c >= 55296 && c <= 56319 && i + 1 < len) {
			const next = body.charCodeAt(i + 1);
			if (next >= 56320 && next <= 57343) {
				bytes += 4;
				i++;
			} else bytes += 3;
		} else bytes += 3;
	}
	return bytes;
};
/**
* Estimate the percent-decoded payload size used by Fetch data: URLs.
*
* @param {string} url
* @returns {number}
*/
function estimateDataURLDecodedBytes(url) {
	const fragmentIndex = typeof url === "string" ? url.indexOf("#") : -1;
	return estimateDataURLBytes(fragmentIndex === -1 ? url : url.slice(0, fragmentIndex), estimatePercentDecodedBase64Bytes);
}
/**
* Estimate the Buffer backing allocation used by Node's raw base64 decoder.
*
* @param {string} url
* @returns {number}
*/
function estimateDataURLBufferAllocation(url) {
	return estimateDataURLBytes(url, estimateBase64BufferAllocation);
}
//#endregion
//#region node_modules/axios/lib/adapters/http.js
var zlibOptions = {
	flush: zlib.constants.Z_SYNC_FLUSH,
	finishFlush: zlib.constants.Z_SYNC_FLUSH
};
var brotliOptions = {
	flush: zlib.constants.BROTLI_OPERATION_FLUSH,
	finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
};
var zstdOptions = {
	flush: zlib.constants.ZSTD_e_flush,
	finishFlush: zlib.constants.ZSTD_e_flush
};
var isBrotliSupported = utils_default.isFunction(zlib.createBrotliDecompress);
var isZstdSupported = utils_default.isFunction(zlib.createZstdDecompress);
var ACCEPT_ENCODING = "gzip, compress, deflate" + (isBrotliSupported ? ", br" : "");
var ACCEPT_ENCODING_WITH_ZSTD = ACCEPT_ENCODING + (isZstdSupported ? ", zstd" : "");
var scheduleProgress = typeof process !== "undefined" && process.nextTick ? process.nextTick.bind(process) : utils_default.asap;
var { http: httpFollow, https: httpsFollow } = import_follow_redirects.default;
var isHttps = /https:?/;
var kAxiosSocketListener = Symbol("axios.http.socketListener");
var kAxiosCurrentReq = Symbol("axios.http.currentReq");
var kAxiosInstalledTunnel = Symbol("axios.http.installedTunnel");
var tunnelingAgentCache = /* @__PURE__ */ new Map();
var tunnelingAgentCacheUser = /* @__PURE__ */ new WeakMap();
var NODE_NATIVE_ENV_PROXY_SUPPORT = {
	22: 21,
	24: 5
};
function isNodeNativeEnvProxySupported(nodeVersion = process.versions && process.versions.node) {
	if (!nodeVersion) return false;
	const [major, minor] = nodeVersion.split(".").map((part) => Number(part));
	if (!Number.isInteger(major) || !Number.isInteger(minor)) return false;
	if (major > 24) return true;
	return NODE_NATIVE_ENV_PROXY_SUPPORT[major] != null && minor >= NODE_NATIVE_ENV_PROXY_SUPPORT[major];
}
function isNodeEnvProxyEnabled(agent, nodeVersion = process.versions && process.versions.node) {
	if (!isNodeNativeEnvProxySupported(nodeVersion)) return false;
	const agentOptions = agent && agent.options;
	return Boolean(agentOptions && utils_default.hasOwnProp(agentOptions, "proxyEnv") && agentOptions.proxyEnv != null);
}
function getProxyEnvAgent(options, configHttpAgent, configHttpsAgent) {
	return isHttps.test(options.protocol) ? configHttpsAgent || https.globalAgent : configHttpAgent || http.globalAgent;
}
function getTunnelingAgent(agentOptions, userHttpsAgent) {
	const key = agentOptions.protocol + "//" + agentOptions.hostname + ":" + (agentOptions.port || "") + "#" + (agentOptions.auth || "");
	const cache = userHttpsAgent ? tunnelingAgentCacheUser.get(userHttpsAgent) || tunnelingAgentCacheUser.set(userHttpsAgent, /* @__PURE__ */ new Map()).get(userHttpsAgent) : tunnelingAgentCache;
	let agent = cache.get(key);
	if (agent) return agent;
	const merged = userHttpsAgent && userHttpsAgent.options ? {
		...userHttpsAgent.options,
		...agentOptions
	} : agentOptions;
	agent = new import_dist.default(merged);
	if (userHttpsAgent && userHttpsAgent.options) {
		const originTLSOptions = { ...userHttpsAgent.options };
		const callback = agent.callback;
		agent.callback = function axiosTunnelingAgentCallback(req, opts) {
			return callback.call(this, req, {
				...originTLSOptions,
				...opts
			});
		};
	}
	agent[kAxiosInstalledTunnel] = true;
	cache.set(key, agent);
	return agent;
}
var supportedProtocols = platform_default.protocols.map((protocol) => {
	return protocol + ":";
});
var decodeURIComponentSafe$1 = (value) => {
	if (!utils_default.isString(value)) return value;
	try {
		return decodeURIComponent(value);
	} catch (error) {
		return value;
	}
};
var flushOnFinish = (stream, [throttled, flush]) => {
	stream.on("end", flush).on("error", flush);
	return throttled;
};
var http2Sessions = new Http2Sessions();
/**
* If the proxy, auth, sensitive header, or config beforeRedirects functions are defined,
* call them with the options object.
*
* @param {Object<string, any>} options - The options object that was passed to the request.
*
* @returns {Object<string, any>}
*/
function dispatchBeforeRedirect(options, responseDetails, requestDetails) {
	if (options.beforeRedirects.proxy) options.beforeRedirects.proxy(options);
	if (options.beforeRedirects.auth) options.beforeRedirects.auth(options);
	if (options.beforeRedirects.sensitiveHeaders) options.beforeRedirects.sensitiveHeaders(options, requestDetails);
	if (options.beforeRedirects.config) options.beforeRedirects.config(options, responseDetails, requestDetails);
}
function stripMatchingHeaders(headers, sensitiveSet) {
	if (!headers) return;
	Object.keys(headers).forEach((header) => {
		if (sensitiveSet.has(header.toLowerCase())) delete headers[header];
	});
}
function isSameOriginRedirect(redirectOptions, requestDetails) {
	if (!requestDetails) return false;
	try {
		return new URL(requestDetails.url).origin === new URL(redirectOptions.href).origin;
	} catch (e) {
		return false;
	}
}
/**
* If the proxy or config afterRedirects functions are defined, call them with the options
*
* @param {http.ClientRequestArgs} options
* @param {AxiosProxyConfig} configProxy configuration from Axios options object
* @param {string} location
*
* @returns {http.ClientRequestArgs}
*/
function setProxy(options, configProxy, location, isRedirect, configHttpsAgent, configHttpAgent) {
	let proxy = configProxy;
	const proxyEnvAgent = getProxyEnvAgent(options, configHttpAgent, configHttpsAgent);
	if (!proxy && proxy !== false && !isNodeEnvProxyEnabled(proxyEnvAgent)) {
		const proxyUrl = getProxyForUrl(location);
		if (proxyUrl) {
			if (!shouldBypassProxy(location)) proxy = new URL(proxyUrl);
		}
	}
	if (isRedirect && options.headers) {
		for (const name of Object.keys(options.headers)) if (name.toLowerCase() === "proxy-authorization") delete options.headers[name];
	}
	if (isRedirect && options.agent && options.agent[kAxiosInstalledTunnel]) options.agent = void 0;
	if (proxy) {
		const isProxyURL = proxy instanceof URL;
		const readProxyField = (key) => isProxyURL || utils_default.hasOwnProp(proxy, key) ? proxy[key] : void 0;
		const proxyUsername = readProxyField("username");
		const proxyPassword = readProxyField("password");
		let proxyAuth = utils_default.hasOwnProp(proxy, "auth") ? proxy.auth : void 0;
		if (proxyUsername) proxyAuth = (proxyUsername || "") + ":" + (proxyPassword || "");
		if (proxyAuth) {
			const authIsObject = typeof proxyAuth === "object";
			const authUsername = authIsObject && utils_default.hasOwnProp(proxyAuth, "username") ? proxyAuth.username : void 0;
			const authPassword = authIsObject && utils_default.hasOwnProp(proxyAuth, "password") ? proxyAuth.password : void 0;
			if (Boolean(authUsername || authPassword)) proxyAuth = (authUsername || "") + ":" + (authPassword || "");
			else if (authIsObject) throw new AxiosError("Invalid proxy authorization", AxiosError.ERR_BAD_OPTION, { proxy });
		}
		if (isHttps.test(options.protocol)) {
			if (!(configHttpsAgent instanceof import_dist.default)) {
				const proxyHost = readProxyField("hostname") || readProxyField("host");
				const proxyPort = readProxyField("port");
				const rawProxyProtocol = readProxyField("protocol");
				const normalizedProtocol = rawProxyProtocol ? rawProxyProtocol.includes(":") ? rawProxyProtocol : `${rawProxyProtocol}:` : "http:";
				const proxyHostForURL = proxyHost && proxyHost.includes(":") && !proxyHost.startsWith("[") ? `[${proxyHost}]` : proxyHost;
				const proxyURL = new URL(`${normalizedProtocol}//${proxyHostForURL}${proxyPort ? ":" + proxyPort : ""}`);
				const agentOptions = {
					protocol: proxyURL.protocol,
					hostname: proxyURL.hostname.replace(/^\[|\]$/g, ""),
					port: proxyURL.port,
					auth: proxyAuth && typeof proxyAuth === "string" ? proxyAuth : void 0
				};
				if (proxyURL.protocol === "https:") agentOptions.ALPNProtocols = ["http/1.1"];
				const tunnelingAgent = getTunnelingAgent(agentOptions, configHttpsAgent);
				options.agent = tunnelingAgent;
				if (options.agents) options.agents.https = tunnelingAgent;
			}
		} else {
			if (proxyAuth) {
				const base64 = Buffer.from(proxyAuth, "utf8").toString("base64");
				options.headers["Proxy-Authorization"] = "Basic " + base64;
			}
			let hasUserHostHeader = false;
			for (const name of Object.keys(options.headers)) if (name.toLowerCase() === "host") {
				hasUserHostHeader = true;
				break;
			}
			if (!hasUserHostHeader) options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
			const proxyHost = readProxyField("hostname") || readProxyField("host");
			options.hostname = proxyHost;
			options.host = proxyHost;
			options.port = readProxyField("port");
			options.path = location;
			const proxyProtocol = readProxyField("protocol");
			if (proxyProtocol) options.protocol = proxyProtocol.includes(":") ? proxyProtocol : `${proxyProtocol}:`;
		}
	}
	options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
		setProxy(redirectOptions, configProxy, redirectOptions.href, true, configHttpsAgent, configHttpAgent);
	};
}
var isHttpAdapterSupported = typeof process !== "undefined" && utils_default.kindOf(process) === "process";
var wrapAsync = (asyncExecutor) => {
	return new Promise((resolve, reject) => {
		let onDone;
		let isDone;
		const done = (value, isRejected) => {
			if (isDone) return;
			isDone = true;
			onDone && onDone(value, isRejected);
		};
		const _resolve = (value) => {
			done(value);
			resolve(value);
		};
		const _reject = (reason) => {
			done(reason, true);
			reject(reason);
		};
		asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
	});
};
var resolveFamily = ({ address, family }) => {
	if (!utils_default.isString(address)) throw TypeError("address must be a string");
	return {
		address,
		family: family || (address.indexOf(".") < 0 ? 6 : 4)
	};
};
var buildAddressEntry = (address, family) => resolveFamily(utils_default.isObject(address) ? address : {
	address,
	family
});
var http2Transport = { request(options, cb) {
	const authority = options.protocol + "//" + options.hostname + ":" + (options.port || (options.protocol === "https:" ? 443 : 80));
	const { http2Options, headers } = options;
	const session = http2Sessions.getSession(authority, http2Options);
	const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = http2.constants;
	const http2Headers = {
		[HTTP2_HEADER_SCHEME]: options.protocol.replace(":", ""),
		[HTTP2_HEADER_METHOD]: options.method,
		[HTTP2_HEADER_PATH]: options.path
	};
	utils_default.forEach(headers, (header, name) => {
		name.charAt(0) !== ":" && (http2Headers[name] = header);
	});
	const req = session.request(http2Headers);
	req.once("response", (responseHeaders) => {
		const response = req;
		responseHeaders = Object.assign({}, responseHeaders);
		const status = responseHeaders[HTTP2_HEADER_STATUS];
		delete responseHeaders[HTTP2_HEADER_STATUS];
		response.headers = responseHeaders;
		response.statusCode = +status;
		cb(response);
	});
	return req;
} };
var http_default = isHttpAdapterSupported && function httpAdapter(config) {
	return wrapAsync(async function dispatchHttpRequest(resolve$1, reject, onDone) {
		const own = (key) => utils_default.getSafeProp(config, key);
		const transitional = own("transitional") || transitional_default;
		let data = own("data");
		let lookup = own("lookup");
		let family = own("family");
		let httpVersion = own("httpVersion");
		if (httpVersion === void 0) httpVersion = 1;
		let http2Options = own("http2Options");
		const httpAgent = own("httpAgent");
		const httpsAgent = own("httpsAgent");
		const configProxy = own("proxy");
		const responseType = own("responseType");
		const responseEncoding = own("responseEncoding");
		const socketPath = own("socketPath");
		const method = own("method").toUpperCase();
		const maxRedirects = own("maxRedirects");
		const maxBodyLength = own("maxBodyLength");
		const maxContentLength = own("maxContentLength");
		const decompress = own("decompress");
		let isDone;
		let rejected = false;
		let req;
		let connectPhaseTimer;
		httpVersion = +httpVersion;
		if (Number.isNaN(httpVersion)) throw TypeError(`Invalid protocol version: '${config.httpVersion}' is not a number`);
		if (httpVersion !== 1 && httpVersion !== 2) throw TypeError(`Unsupported protocol version '${httpVersion}'`);
		const isHttp2 = httpVersion === 2;
		if (lookup) {
			const _lookup = callbackify(lookup, (value) => utils_default.isArray(value) ? value : [value]);
			lookup = (hostname, opt, cb) => {
				_lookup(hostname, opt, (err, arg0, arg1) => {
					if (err) return cb(err);
					const addresses = utils_default.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
					opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
				});
			};
		}
		const abortEmitter = new EventEmitter();
		function abort(reason) {
			try {
				abortEmitter.emit("abort", !reason || reason.type ? new CanceledError(null, config, req) : reason);
			} catch (err) {}
		}
		function clearConnectPhaseTimer() {
			if (connectPhaseTimer) {
				clearTimeout(connectPhaseTimer);
				connectPhaseTimer = null;
			}
		}
		function createTimeoutError() {
			const configTimeout = own("timeout");
			let timeoutErrorMessage = configTimeout ? "timeout of " + configTimeout + "ms exceeded" : "timeout exceeded";
			const configTimeoutErrorMessage = own("timeoutErrorMessage");
			if (configTimeoutErrorMessage) timeoutErrorMessage = configTimeoutErrorMessage;
			return new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, req);
		}
		abortEmitter.once("abort", reject);
		const onFinished = () => {
			clearConnectPhaseTimer();
			if (config.cancelToken) config.cancelToken.unsubscribe(abort);
			if (config.signal) config.signal.removeEventListener("abort", abort);
			abortEmitter.removeAllListeners();
		};
		if (config.cancelToken || config.signal) {
			config.cancelToken && config.cancelToken.subscribe(abort);
			if (config.signal) config.signal.aborted ? abort() : config.signal.addEventListener("abort", abort);
		}
		onDone((response, isRejected) => {
			isDone = true;
			clearConnectPhaseTimer();
			if (isRejected) {
				rejected = true;
				onFinished();
				return;
			}
			const { data } = response;
			if (data instanceof stream.Readable || data instanceof stream.Duplex) {
				const offListeners = stream.finished(data, () => {
					offListeners();
					onFinished();
				});
			} else onFinished();
		});
		const fullPath = buildFullPath(own("baseURL"), own("url"), own("allowAbsoluteUrls"), config);
		const urlBase = socketPath ? "http://localhost" : platform_default.hasBrowserEnv ? platform_default.origin : void 0;
		const parsed = new URL(fullPath, urlBase);
		const protocol = parsed.protocol || supportedProtocols[0];
		if (protocol === "data:") {
			if (maxContentLength > -1) {
				if (estimateDataURLBufferAllocation(String(own("url") || fullPath || "")) > maxContentLength) return reject(new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config));
			}
			let convertedData;
			if (method !== "GET") return settle(resolve$1, reject, {
				status: 405,
				statusText: "method not allowed",
				headers: {},
				config
			});
			try {
				convertedData = fromDataURI(own("url"), responseType === "blob", { Blob: config.env && config.env.Blob });
			} catch (err) {
				throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
			}
			if (responseType === "text") {
				convertedData = convertedData.toString(responseEncoding);
				if (!responseEncoding || responseEncoding === "utf8") convertedData = utils_default.stripBOM(convertedData);
			} else if (responseType === "stream") convertedData = stream.Readable.from(convertedData);
			return settle(resolve$1, reject, {
				data: convertedData,
				status: 200,
				statusText: "OK",
				headers: new AxiosHeaders(),
				config
			});
		}
		if (supportedProtocols.indexOf(protocol) === -1) return reject(new AxiosError("Unsupported protocol " + protocol, AxiosError.ERR_BAD_REQUEST, config));
		const headers = AxiosHeaders.from(config.headers).normalize();
		headers.set("User-Agent", "axios/1.19.0", false);
		const { onUploadProgress, onDownloadProgress } = config;
		const maxRate = config.maxRate;
		let maxUploadRate = void 0;
		let maxDownloadRate = void 0;
		if (utils_default.isSpecCompliantForm(data)) {
			const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
			data = formDataToStream(data, (formHeaders) => {
				headers.set(formHeaders);
			}, {
				tag: `axios-1.19.0-boundary`,
				boundary: userBoundary && userBoundary[1] || void 0
			});
		} else if (utils_default.isFormData(data) && utils_default.isFunction(data.getHeaders) && data.getHeaders !== Object.prototype.getHeaders) {
			setFormDataHeaders(headers, data.getHeaders(), own("formDataHeaderPolicy"));
			if (!headers.hasContentLength()) try {
				const knownLength = await util.promisify(data.getLength).call(data);
				Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
			} catch (e) {}
		} else if (utils_default.isBlob(data) || utils_default.isFile(data)) {
			data.size && headers.setContentType(data.type || "application/octet-stream");
			headers.setContentLength(data.size || 0);
			data = stream.Readable.from(readBlob(data));
		} else if (data && !utils_default.isStream(data)) {
			if (Buffer.isBuffer(data)) {} else if (utils_default.isArrayBuffer(data)) data = Buffer.from(new Uint8Array(data));
			else if (utils_default.isString(data)) data = Buffer.from(data, "utf-8");
			else return reject(new AxiosError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", AxiosError.ERR_BAD_REQUEST, config));
			headers.setContentLength(data.length, false);
			if (maxBodyLength > -1 && data.length > maxBodyLength) return reject(new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config));
		}
		const contentLength = utils_default.toFiniteNumber(headers.getContentLength());
		if (utils_default.isArray(maxRate)) {
			maxUploadRate = maxRate[0];
			maxDownloadRate = maxRate[1];
		} else maxUploadRate = maxDownloadRate = maxRate;
		if (data && (onUploadProgress || maxUploadRate)) {
			if (!utils_default.isStream(data)) data = stream.Readable.from(data, { objectMode: false });
			data = stream.pipeline([data, new AxiosTransformStream({ maxRate: utils_default.toFiniteNumber(maxUploadRate) })], utils_default.noop);
			onUploadProgress && data.on("progress", flushOnFinish(data, progressEventDecorator(contentLength, progressEventReducer(asyncDecorator(onUploadProgress, scheduleProgress), false, 3))));
		}
		let auth = void 0;
		const configAuth = own("auth");
		if (configAuth) {
			const username = utils_default.getSafeProp(configAuth, "username") || "";
			const password = utils_default.getSafeProp(configAuth, "password") || "";
			auth = username + ":" + password;
		}
		if (!auth && (parsed.username || parsed.password)) {
			const urlUsername = decodeURIComponentSafe$1(parsed.username);
			const urlPassword = decodeURIComponentSafe$1(parsed.password);
			auth = urlUsername + ":" + urlPassword;
		}
		auth && headers.delete("authorization");
		let path;
		try {
			path = buildURL(parsed.pathname + parsed.search, own("params"), own("paramsSerializer")).replace(/^\?/, "");
		} catch (err) {
			return reject(AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config, null, null, {
				url: own("url"),
				exists: true
			}));
		}
		headers.set("Accept-Encoding", utils_default.hasOwnProp(transitional, "advertiseZstdAcceptEncoding") && transitional.advertiseZstdAcceptEncoding === true ? ACCEPT_ENCODING_WITH_ZSTD : ACCEPT_ENCODING, false);
		const options = Object.assign(Object.create(null), {
			path,
			method,
			headers: toByteStringHeaderObject(headers),
			agents: {
				http: httpAgent,
				https: httpsAgent
			},
			auth,
			protocol,
			family,
			beforeRedirect: dispatchBeforeRedirect,
			beforeRedirects: Object.create(null),
			http2Options
		});
		!utils_default.isUndefined(lookup) && (options.lookup = lookup);
		if (socketPath) {
			if (typeof socketPath !== "string") return reject(new AxiosError("socketPath must be a string", AxiosError.ERR_BAD_OPTION_VALUE, config));
			const allowedSocketPaths = own("allowedSocketPaths");
			if (allowedSocketPaths != null) {
				const allowed = Array.isArray(allowedSocketPaths) ? allowedSocketPaths : [allowedSocketPaths];
				const resolvedSocket = resolve(socketPath);
				if (!allowed.some((entry) => typeof entry === "string" && resolve(entry) === resolvedSocket)) return reject(new AxiosError(`socketPath "${socketPath}" is not permitted by allowedSocketPaths`, AxiosError.ERR_BAD_OPTION_VALUE, config));
			}
			options.socketPath = socketPath;
		} else {
			options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
			options.port = parsed.port;
			setProxy(options, configProxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path, false, httpsAgent, httpAgent);
		}
		let transport;
		let isNativeTransport = false;
		let transportEnforcesMaxBodyLength = false;
		const isHttpsRequest = isHttps.test(options.protocol);
		if (options.agent == null) options.agent = isHttpsRequest ? httpsAgent : httpAgent;
		if (isHttp2) transport = http2Transport;
		else {
			const configTransport = own("transport");
			if (configTransport) transport = configTransport;
			else if (maxRedirects === 0) {
				transport = isHttpsRequest ? https : http;
				isNativeTransport = true;
			} else {
				transportEnforcesMaxBodyLength = true;
				options.sensitiveHeaders = [];
				if (maxRedirects) options.maxRedirects = maxRedirects;
				const configBeforeRedirect = own("beforeRedirect");
				if (configBeforeRedirect) options.beforeRedirects.config = configBeforeRedirect;
				if (auth) {
					const requestOrigin = parsed.origin;
					const authToRestore = auth;
					options.beforeRedirects.auth = function beforeRedirectAuth(redirectOptions) {
						try {
							if (new URL(redirectOptions.href).origin === requestOrigin) redirectOptions.auth = authToRestore;
						} catch (e) {}
					};
				}
				const sensitiveHeaders = own("sensitiveHeaders");
				if (sensitiveHeaders != null) {
					if (!utils_default.isArray(sensitiveHeaders)) return reject(new AxiosError("sensitiveHeaders must be an array of strings", AxiosError.ERR_BAD_OPTION_VALUE, config));
					const sensitiveSet = /* @__PURE__ */ new Set();
					for (const header of sensitiveHeaders) {
						if (!utils_default.isString(header)) return reject(new AxiosError("sensitiveHeaders must be an array of strings", AxiosError.ERR_BAD_OPTION_VALUE, config));
						sensitiveSet.add(header.toLowerCase());
					}
					if (sensitiveSet.size) {
						options.sensitiveHeaders = Array.from(sensitiveSet);
						options.beforeRedirects.sensitiveHeaders = function beforeRedirectSensitiveHeaders(redirectOptions, requestDetails) {
							if (!isSameOriginRedirect(redirectOptions, requestDetails)) stripMatchingHeaders(redirectOptions.headers, sensitiveSet);
						};
					}
				}
				transport = isHttpsRequest ? httpsFollow : httpFollow;
			}
		}
		if (maxBodyLength > -1) options.maxBodyLength = maxBodyLength;
		else options.maxBodyLength = Infinity;
		options.insecureHTTPParser = Boolean(own("insecureHTTPParser"));
		req = transport.request(options, function handleResponse(res) {
			clearConnectPhaseTimer();
			if (req.destroyed) return;
			const streams = [res];
			const responseLength = utils_default.toFiniteNumber(res.headers["content-length"]);
			if (onDownloadProgress || maxDownloadRate) {
				const transformStream = new AxiosTransformStream({ maxRate: utils_default.toFiniteNumber(maxDownloadRate) });
				onDownloadProgress && transformStream.on("progress", flushOnFinish(transformStream, progressEventDecorator(responseLength, progressEventReducer(asyncDecorator(onDownloadProgress, scheduleProgress), true, 3))));
				streams.push(transformStream);
			}
			let responseStream = res;
			const lastRequest = res.req || req;
			if (decompress !== false && res.headers["content-encoding"]) {
				if (method === "HEAD" || res.statusCode === 204) delete res.headers["content-encoding"];
				switch ((res.headers["content-encoding"] || "").toLowerCase()) {
					case "gzip":
					case "x-gzip":
					case "compress":
					case "x-compress":
						streams.push(zlib.createUnzip(zlibOptions));
						delete res.headers["content-encoding"];
						break;
					case "deflate":
						streams.push(new ZlibHeaderTransformStream());
						streams.push(zlib.createUnzip(zlibOptions));
						delete res.headers["content-encoding"];
						break;
					case "br":
						if (isBrotliSupported) {
							streams.push(zlib.createBrotliDecompress(brotliOptions));
							delete res.headers["content-encoding"];
						}
						break;
					case "zstd": if (isZstdSupported) {
						streams.push(zlib.createZstdDecompress(zstdOptions));
						delete res.headers["content-encoding"];
					}
				}
			}
			responseStream = streams.length > 1 ? stream.pipeline(streams, utils_default.noop) : streams[0];
			const response = {
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: new AxiosHeaders(res.headers),
				config,
				request: lastRequest
			};
			if (responseType === "stream") {
				if (maxContentLength > -1) {
					const limit = maxContentLength;
					const source = responseStream;
					async function* enforceMaxContentLength() {
						let totalResponseBytes = 0;
						for await (const chunk of source) {
							totalResponseBytes += chunk.length;
							if (totalResponseBytes > limit) throw new AxiosError("maxContentLength size of " + limit + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, lastRequest);
							yield chunk;
						}
					}
					responseStream = stream.Readable.from(enforceMaxContentLength(), { objectMode: false });
				}
				response.data = responseStream;
				settle(resolve$1, reject, response);
			} else {
				const responseBuffer = [];
				let totalResponseBytes = 0;
				responseStream.on("data", function handleStreamData(chunk) {
					responseBuffer.push(chunk);
					totalResponseBytes += chunk.length;
					if (maxContentLength > -1 && totalResponseBytes > maxContentLength) {
						rejected = true;
						responseStream.destroy();
						abort(new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
					}
				});
				responseStream.on("aborted", function handlerStreamAborted() {
					if (rejected) return;
					const err = new AxiosError("stream has been aborted", AxiosError.ERR_BAD_RESPONSE, config, lastRequest, response);
					responseStream.destroy(err);
					reject(err);
				});
				responseStream.on("error", function handleStreamError(err) {
					if (rejected) return;
					reject(AxiosError.from(err, null, config, lastRequest, response));
				});
				responseStream.on("end", function handleStreamEnd() {
					try {
						let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
						if (responseType !== "arraybuffer") {
							responseData = responseData.toString(responseEncoding);
							if (!responseEncoding || responseEncoding === "utf8") responseData = utils_default.stripBOM(responseData);
						}
						response.data = responseData;
					} catch (err) {
						return reject(AxiosError.from(err, null, config, response.request, response));
					}
					settle(resolve$1, reject, response);
				});
			}
			abortEmitter.once("abort", (err) => {
				if (!responseStream.destroyed) {
					responseStream.emit("error", err);
					responseStream.destroy();
				}
			});
		});
		abortEmitter.once("abort", (err) => {
			if (req.close) req.close();
			else req.destroy(err);
		});
		req.on("error", function handleRequestError(err) {
			reject(AxiosError.from(err, null, config, req));
		});
		const boundSockets = /* @__PURE__ */ new Set();
		req.on("socket", function handleRequestSocket(socket) {
			if (typeof socket.setKeepAlive === "function") socket.setKeepAlive(true, 6e4);
			if (!socket[kAxiosSocketListener]) {
				socket.on("error", function handleSocketError(err) {
					const current = socket[kAxiosCurrentReq];
					if (current && !current.destroyed) current.destroy(err);
				});
				socket[kAxiosSocketListener] = true;
			}
			socket[kAxiosCurrentReq] = req;
			boundSockets.add(socket);
		});
		req.once("close", function clearCurrentReq() {
			clearConnectPhaseTimer();
			for (const socket of boundSockets) if (socket[kAxiosCurrentReq] === req) socket[kAxiosCurrentReq] = null;
			boundSockets.clear();
		});
		if (own("timeout")) {
			const timeout = parseInt(own("timeout"), 10);
			if (Number.isNaN(timeout)) {
				abort(new AxiosError("error trying to parse `config.timeout` to int", AxiosError.ERR_BAD_OPTION_VALUE, config, req));
				return;
			}
			const handleTimeout = function handleTimeout() {
				if (isDone) return;
				abort(createTimeoutError());
			};
			if (isNativeTransport && timeout > 0) connectPhaseTimer = setTimeout(handleTimeout, timeout);
			req.setTimeout(timeout, handleTimeout);
		} else req.setTimeout(0);
		if (utils_default.isStream(data)) {
			let ended = false;
			let errored = false;
			data.on("end", () => {
				ended = true;
			});
			data.once("error", (err) => {
				errored = true;
				req.destroy(err);
			});
			data.on("close", () => {
				if (!ended && !errored) abort(new CanceledError("Request stream has been aborted", config, req));
			});
			let uploadStream = data;
			if (maxBodyLength > -1 && !transportEnforcesMaxBodyLength) {
				const limit = maxBodyLength;
				let bytesSent = 0;
				uploadStream = stream.pipeline([data, new stream.Transform({ transform(chunk, _enc, cb) {
					bytesSent += chunk.length;
					if (bytesSent > limit) return cb(new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config, req));
					cb(null, chunk);
				} })], utils_default.noop);
				uploadStream.on("error", (err) => {
					if (!req.destroyed) req.destroy(err);
				});
			}
			uploadStream.pipe(req);
		} else {
			data && req.write(data);
			req.end();
		}
	});
};
//#endregion
//#region node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
	url = new URL(url, platform_default.origin);
	return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
})(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : () => true;
//#endregion
//#region node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv ? {
	write(name, value, expires, path, domain, secure, sameSite) {
		if (typeof document === "undefined") return;
		const cookie = [`${name}=${encodeURIComponent(value)}`];
		if (utils_default.isNumber(expires)) cookie.push(`expires=${new Date(expires).toUTCString()}`);
		if (utils_default.isString(path)) cookie.push(`path=${path}`);
		if (utils_default.isString(domain)) cookie.push(`domain=${domain}`);
		if (secure === true) cookie.push("secure");
		if (utils_default.isString(sameSite)) cookie.push(`SameSite=${sameSite}`);
		document.cookie = cookie.join("; ");
	},
	read(name) {
		if (typeof document === "undefined") return null;
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].replace(/^\s+/, "");
			const eq = cookie.indexOf("=");
			if (eq !== -1 && cookie.slice(0, eq) === name) try {
				return decodeURIComponent(cookie.slice(eq + 1));
			} catch (e) {
				return cookie.slice(eq + 1);
			}
		}
		return null;
	},
	remove(name) {
		this.write(name, "", Date.now() - 864e5, "/");
	}
} : {
	write() {},
	read() {
		return null;
	},
	remove() {}
};
//#endregion
//#region node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
var ownEnumerableKeys = (thing) => {
	if (Object.getOwnPropertySymbols && Object.getOwnPropertyDescriptor) return Object.keys(thing).concat(Object.getOwnPropertySymbols(thing).filter((symbol) => Object.getOwnPropertyDescriptor(thing, symbol).enumerable));
	return Object.keys(thing);
};
/**
* Config-specific merge-function which creates a new config-object
* by merging two configuration objects together.
*
* @param {Object} config1
* @param {Object} config2
*
* @returns {Object} New object resulting from merging config2 to config1
*/
function mergeConfig(config1, config2) {
	config1 = config1 || {};
	config2 = config2 || {};
	const config = Object.create(null);
	Object.defineProperty(config, "hasOwnProperty", {
		__proto__: null,
		value: Object.prototype.hasOwnProperty,
		enumerable: false,
		writable: true,
		configurable: true
	});
	function getMergedValue(target, source, prop, caseless) {
		if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) return utils_default.merge.call({ caseless }, target, source);
		else if (utils_default.isPlainObject(source)) return utils_default.merge({}, source);
		else if (utils_default.isArray(source)) return source.slice();
		return source;
	}
	function mergeDeepProperties(a, b, prop, caseless) {
		if (!utils_default.isUndefined(b)) return getMergedValue(a, b, prop, caseless);
		else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a, prop, caseless);
	}
	function valueFromConfig2(a, b) {
		if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
	}
	function defaultToConfig2(a, b) {
		if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
		else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a);
	}
	function getMergedTransitionalOption(prop) {
		const transitional2 = utils_default.hasOwnProp(config2, "transitional") ? config2.transitional : void 0;
		if (!utils_default.isUndefined(transitional2)) {
			if (utils_default.isPlainObject(transitional2)) {
				if (utils_default.hasOwnProp(transitional2, prop)) return transitional2[prop];
			} else return;
		}
		const transitional1 = utils_default.hasOwnProp(config1, "transitional") ? config1.transitional : void 0;
		if (utils_default.isPlainObject(transitional1) && utils_default.hasOwnProp(transitional1, prop)) return transitional1[prop];
	}
	function mergeDirectKeys(a, b, prop) {
		if (utils_default.hasOwnProp(config2, prop)) return getMergedValue(a, b);
		else if (utils_default.hasOwnProp(config1, prop)) return getMergedValue(void 0, a);
	}
	const mergeMap = {
		url: valueFromConfig2,
		method: valueFromConfig2,
		data: valueFromConfig2,
		baseURL: defaultToConfig2,
		transformRequest: defaultToConfig2,
		transformResponse: defaultToConfig2,
		paramsSerializer: defaultToConfig2,
		timeout: defaultToConfig2,
		timeoutMessage: defaultToConfig2,
		withCredentials: defaultToConfig2,
		withXSRFToken: defaultToConfig2,
		adapter: defaultToConfig2,
		responseType: defaultToConfig2,
		xsrfCookieName: defaultToConfig2,
		xsrfHeaderName: defaultToConfig2,
		onUploadProgress: defaultToConfig2,
		onDownloadProgress: defaultToConfig2,
		decompress: defaultToConfig2,
		maxContentLength: defaultToConfig2,
		maxBodyLength: defaultToConfig2,
		beforeRedirect: defaultToConfig2,
		transport: defaultToConfig2,
		httpAgent: defaultToConfig2,
		httpsAgent: defaultToConfig2,
		cancelToken: defaultToConfig2,
		socketPath: defaultToConfig2,
		allowedSocketPaths: defaultToConfig2,
		responseEncoding: defaultToConfig2,
		validateStatus: mergeDirectKeys,
		headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
	};
	utils_default.forEach(ownEnumerableKeys({
		...config1,
		...config2
	}), function computeConfigValue(prop) {
		if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
		const merge = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
		const configValue = merge(utils_default.hasOwnProp(config1, prop) ? config1[prop] : void 0, utils_default.hasOwnProp(config2, prop) ? config2[prop] : void 0, prop);
		utils_default.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
	});
	if (utils_default.hasOwnProp(config2, "validateStatus") && utils_default.isUndefined(config2.validateStatus) && getMergedTransitionalOption("validateStatusUndefinedResolves") === false) {
		if (utils_default.hasOwnProp(config1, "validateStatus")) config.validateStatus = getMergedValue(void 0, config1.validateStatus);
		else delete config.validateStatus;
	}
	return config;
}
//#endregion
//#region node_modules/axios/lib/helpers/resolveConfig.js
/**
* Encode a UTF-8 string to a Latin-1 byte string for use with btoa().
* This is a modern replacement for the deprecated unescape(encodeURIComponent(str)) pattern.
*
* @param {string} str The string to encode
*
* @returns {string} UTF-8 bytes as a Latin-1 string
*/
var encodeUTF8$1 = (str) => encodeURIComponent(str).replace(/%([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
function resolveConfig(config) {
	const newConfig = mergeConfig({}, config);
	const own = (key) => utils_default.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
	const data = own("data");
	let withXSRFToken = own("withXSRFToken");
	const xsrfHeaderName = own("xsrfHeaderName");
	const xsrfCookieName = own("xsrfCookieName");
	let headers = own("headers");
	const auth = own("auth");
	const baseURL = own("baseURL");
	const allowAbsoluteUrls = own("allowAbsoluteUrls");
	const url = own("url");
	newConfig.headers = headers = AxiosHeaders.from(headers);
	newConfig.url = buildURL(buildFullPath(baseURL, url, allowAbsoluteUrls, newConfig), own("params"), own("paramsSerializer"));
	if (auth) {
		const username = utils_default.getSafeProp(auth, "username") || "";
		const password = utils_default.getSafeProp(auth, "password") || "";
		try {
			headers.set("Authorization", "Basic " + btoa(username + ":" + (password ? encodeUTF8$1(password) : "")));
		} catch (e) {
			throw AxiosError.from(e, AxiosError.ERR_BAD_OPTION_VALUE, config);
		}
	}
	if (utils_default.isFormData(data)) {
		if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv || utils_default.isReactNative(data)) headers.setContentType(void 0);
		else if (utils_default.isFunction(data.getHeaders)) setFormDataHeaders(headers, data.getHeaders(), own("formDataHeaderPolicy"));
	}
	if (platform_default.hasStandardBrowserEnv) {
		if (utils_default.isFunction(withXSRFToken)) withXSRFToken = withXSRFToken(newConfig);
		if (withXSRFToken === true || withXSRFToken == null && isURLSameOrigin_default(newConfig.url)) {
			const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
			if (xsrfValue) headers.set(xsrfHeaderName, xsrfValue);
		}
	}
	return newConfig;
}
var xhr_default = typeof XMLHttpRequest !== "undefined" && function(config) {
	return new Promise(function dispatchXhrRequest(resolve, reject) {
		const _config = resolveConfig(config);
		let requestData = _config.data;
		const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
		let { responseType, onUploadProgress, onDownloadProgress } = _config;
		let onCanceled;
		let uploadThrottled, downloadThrottled;
		let flushUpload, flushDownload;
		function done() {
			flushUpload && flushUpload();
			flushDownload && flushDownload();
			_config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
			_config.signal && _config.signal.removeEventListener("abort", onCanceled);
		}
		let request = new XMLHttpRequest();
		request.open(_config.method.toUpperCase(), _config.url, true);
		request.timeout = _config.timeout;
		function onloadend() {
			if (!request) return;
			const responseHeaders = AxiosHeaders.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
			settle(function _resolve(value) {
				resolve(value);
				done();
			}, function _reject(err) {
				reject(err);
				done();
			}, {
				data: !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response,
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				config,
				request
			});
			request = null;
		}
		if ("onloadend" in request) request.onloadend = onloadend;
		else request.onreadystatechange = function handleLoad() {
			if (!request || request.readyState !== 4) return;
			if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) return;
			setTimeout(onloadend);
		};
		request.onabort = function handleAbort() {
			if (!request) return;
			reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
			done();
			request = null;
		};
		request.onerror = function handleError(event) {
			const err = new AxiosError(event && event.message ? event.message : "Network Error", AxiosError.ERR_NETWORK, config, request);
			err.event = event || null;
			reject(err);
			done();
			request = null;
		};
		request.ontimeout = function handleTimeout() {
			let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
			const transitional = _config.transitional || transitional_default;
			if (_config.timeoutErrorMessage) timeoutErrorMessage = _config.timeoutErrorMessage;
			reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));
			done();
			request = null;
		};
		requestData === void 0 && requestHeaders.setContentType(null);
		if ("setRequestHeader" in request) utils_default.forEach(toByteStringHeaderObject(requestHeaders), function setRequestHeader(val, key) {
			request.setRequestHeader(key, val);
		});
		if (!utils_default.isUndefined(_config.withCredentials)) request.withCredentials = !!_config.withCredentials;
		if (responseType && responseType !== "json") request.responseType = _config.responseType;
		if (onDownloadProgress) {
			[downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
			request.addEventListener("progress", downloadThrottled);
		}
		if (onUploadProgress && request.upload) {
			[uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
			request.upload.addEventListener("progress", uploadThrottled);
			request.upload.addEventListener("loadend", flushUpload);
		}
		if (_config.cancelToken || _config.signal) {
			onCanceled = (cancel) => {
				if (!request) return;
				reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
				request.abort();
				done();
				request = null;
			};
			_config.cancelToken && _config.cancelToken.subscribe(onCanceled);
			if (_config.signal) _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
		}
		const protocol = parseProtocol(_config.url);
		if (protocol && !platform_default.protocols.includes(protocol)) {
			reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
			done();
			return;
		}
		request.send(requestData || null);
	});
};
//#endregion
//#region node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
	signals = signals ? signals.filter(Boolean) : [];
	if (!timeout && !signals.length) return;
	const controller = new AbortController();
	let aborted = false;
	const onabort = function(reason) {
		if (!aborted) {
			aborted = true;
			unsubscribe();
			const err = reason instanceof Error ? reason : this.reason;
			controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
		}
	};
	let timer = timeout && setTimeout(() => {
		timer = null;
		onabort(new AxiosError(`timeout of ${timeout}ms exceeded`, AxiosError.ETIMEDOUT));
	}, timeout);
	const unsubscribe = () => {
		if (!signals) return;
		timer && clearTimeout(timer);
		timer = null;
		signals.forEach((signal) => {
			signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener("abort", onabort);
		});
		signals = null;
	};
	signals.forEach((signal) => {
		if (aborted) return;
		if (signal.aborted) {
			onabort.call(signal);
			return;
		}
		signal.addEventListener("abort", onabort, { once: true });
	});
	const { signal } = controller;
	signal.unsubscribe = () => utils_default.asap(unsubscribe);
	return signal;
};
//#endregion
//#region node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
	let len = chunk.byteLength;
	if (!chunkSize || len < chunkSize) {
		yield chunk;
		return;
	}
	let pos = 0;
	let end;
	while (pos < len) {
		end = pos + chunkSize;
		yield chunk.slice(pos, end);
		pos = end;
	}
};
var readBytes = async function* (iterable, chunkSize) {
	for await (const chunk of readStream(iterable)) yield* streamChunk(chunk, chunkSize);
};
var readStream = async function* (stream) {
	if (stream[Symbol.asyncIterator]) {
		yield* stream;
		return;
	}
	const reader = stream.getReader();
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			yield value;
		}
	} finally {
		await reader.cancel();
	}
};
var trackStream = (stream, chunkSize, onProgress, onFinish) => {
	const iterator = readBytes(stream, chunkSize);
	let bytes = 0;
	let done;
	let _onFinish = (e) => {
		if (!done) {
			done = true;
			onFinish && onFinish(e);
		}
	};
	return new ReadableStream({
		async pull(controller) {
			try {
				const { done, value } = await iterator.next();
				if (done) {
					_onFinish();
					controller.close();
					return;
				}
				let len = value.byteLength;
				if (onProgress) onProgress(bytes += len);
				controller.enqueue(new Uint8Array(value));
			} catch (err) {
				_onFinish(err);
				throw err;
			}
		},
		cancel(reason) {
			_onFinish(reason);
			return iterator.return();
		}
	}, { highWaterMark: 2 });
};
//#endregion
//#region node_modules/axios/lib/adapters/fetch.js
var DEFAULT_CHUNK_SIZE = 65536;
var { isFunction } = utils_default;
/**
* Encode a UTF-8 string to a Latin-1 byte string for use with btoa().
* This is a modern replacement for the deprecated unescape(encodeURIComponent(str)) pattern.
*
* @param {string} str The string to encode
*
* @returns {string} UTF-8 bytes as a Latin-1 string
*/
var encodeUTF8 = (str) => encodeURIComponent(str).replace(/%([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
var decodeURIComponentSafe = (value) => {
	if (!utils_default.isString(value)) return value;
	try {
		return decodeURIComponent(value);
	} catch (error) {
		return value;
	}
};
var test = (fn, ...args) => {
	try {
		return !!fn(...args);
	} catch (e) {
		return false;
	}
};
var maybeWithAuthCredentials = (url) => {
	const protocolIndex = url.indexOf("://");
	let urlToCheck = url;
	if (protocolIndex !== -1) urlToCheck = urlToCheck.slice(protocolIndex + 3);
	return urlToCheck.includes("@") || urlToCheck.includes(":");
};
var factory = (env) => {
	const globalObject = utils_default.global !== void 0 && utils_default.global !== null ? utils_default.global : globalThis;
	const { ReadableStream, TextEncoder } = globalObject;
	env = utils_default.merge.call({ skipUndefined: true }, {
		Request: globalObject.Request,
		Response: globalObject.Response
	}, env);
	const { fetch: envFetch, Request, Response } = env;
	const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
	const isRequestSupported = isFunction(Request);
	const isResponseSupported = isFunction(Response);
	if (!isFetchSupported) return false;
	const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream);
	const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
	const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
		let duplexAccessed = false;
		const request = new Request(platform_default.origin, {
			body: new ReadableStream(),
			method: "POST",
			get duplex() {
				duplexAccessed = true;
				return "half";
			}
		});
		const hasContentType = request.headers.has("Content-Type");
		if (request.body != null) request.body.cancel();
		return duplexAccessed && !hasContentType;
	});
	const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
	const resolvers = { stream: supportsResponseStream && ((res) => res.body) };
	isFetchSupported && (() => {
		[
			"text",
			"arrayBuffer",
			"blob",
			"formData",
			"stream"
		].forEach((type) => {
			!resolvers[type] && (resolvers[type] = (res, config) => {
				let method = res && res[type];
				if (method) return method.call(res);
				throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
			});
		});
	})();
	const getBodyLength = async (body) => {
		if (body == null) return 0;
		if (utils_default.isBlob(body)) return body.size;
		if (utils_default.isSpecCompliantForm(body)) return (await new Request(platform_default.origin, {
			method: "POST",
			body
		}).arrayBuffer()).byteLength;
		if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) return body.byteLength;
		if (utils_default.isURLSearchParams(body)) body = body + "";
		if (utils_default.isString(body)) return (await encodeText(body)).byteLength;
	};
	const resolveBodyLength = async (headers, body) => {
		const length = utils_default.toFiniteNumber(headers.getContentLength());
		return length == null ? getBodyLength(body) : length;
	};
	return async (config) => {
		let { url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, withCredentials = "same-origin", fetchOptions, maxContentLength, maxBodyLength } = resolveConfig(config);
		const hasMaxContentLength = utils_default.isNumber(maxContentLength) && maxContentLength > -1;
		const hasMaxBodyLength = utils_default.isNumber(maxBodyLength) && maxBodyLength > -1;
		const own = (key) => utils_default.hasOwnProp(config, key) ? config[key] : void 0;
		let _fetch = envFetch || fetch;
		responseType = responseType ? (responseType + "").toLowerCase() : "text";
		let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
		let request = null;
		const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
			composedSignal.unsubscribe();
		});
		let requestContentLength;
		let pendingBodyError = null;
		const maxBodyLengthError = () => new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config, request);
		try {
			let auth = void 0;
			const configAuth = own("auth");
			if (configAuth) auth = {
				username: utils_default.getSafeProp(configAuth, "username") || "",
				password: utils_default.getSafeProp(configAuth, "password") || ""
			};
			if (maybeWithAuthCredentials(url)) {
				const parsedURL = new URL(url, platform_default.origin);
				if (!auth && (parsedURL.username || parsedURL.password)) auth = {
					username: decodeURIComponentSafe(parsedURL.username),
					password: decodeURIComponentSafe(parsedURL.password)
				};
				if (parsedURL.username || parsedURL.password) {
					parsedURL.username = "";
					parsedURL.password = "";
					url = parsedURL.href;
				}
			}
			if (auth) {
				headers.delete("authorization");
				headers.set("Authorization", "Basic " + btoa(encodeUTF8((auth.username || "") + ":" + (auth.password || ""))));
			}
			if (hasMaxContentLength && typeof url === "string" && url.startsWith("data:")) {
				if (estimateDataURLDecodedBytes(url) > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
			}
			if (hasMaxBodyLength && method !== "get" && method !== "head") {
				const outboundLength = await getBodyLength(data);
				if (typeof outboundLength === "number" && isFinite(outboundLength)) {
					requestContentLength = outboundLength;
					if (outboundLength > maxBodyLength) throw maxBodyLengthError();
				}
			}
			const mustEnforceStreamBody = hasMaxBodyLength && (utils_default.isReadableStream(data) || utils_default.isStream(data));
			const trackRequestStream = (stream, onProgress, flush) => trackStream(stream, DEFAULT_CHUNK_SIZE, (loadedBytes) => {
				if (hasMaxBodyLength && loadedBytes > maxBodyLength) throw pendingBodyError = maxBodyLengthError();
				onProgress && onProgress(loadedBytes);
			}, flush);
			if (supportsRequestStream && method !== "get" && method !== "head" && (onUploadProgress || mustEnforceStreamBody)) {
				requestContentLength = requestContentLength == null ? await resolveBodyLength(headers, data) : requestContentLength;
				if (requestContentLength !== 0 || mustEnforceStreamBody) {
					let _request = new Request(url, {
						method: "POST",
						body: data,
						duplex: "half"
					});
					let contentTypeHeader;
					if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) headers.setContentType(contentTypeHeader);
					if (_request.body) {
						const [onProgress, flush] = onUploadProgress && progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress))) || [];
						data = trackRequestStream(_request.body, onProgress, flush);
					}
				}
			} else if (mustEnforceStreamBody && !isRequestSupported && isReadableStreamSupported && method !== "get" && method !== "head") data = trackRequestStream(data);
			else if (mustEnforceStreamBody && isRequestSupported && !supportsRequestStream && method !== "get" && method !== "head") throw new AxiosError("Stream request bodies are not supported by the current fetch implementation", AxiosError.ERR_NOT_SUPPORT, config, request);
			if (!utils_default.isString(withCredentials)) withCredentials = withCredentials ? "include" : "omit";
			const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
			if (utils_default.isFormData(data)) {
				const contentType = headers.getContentType();
				if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) headers.delete("content-type");
			}
			headers.set("User-Agent", "axios/" + VERSION, false);
			const resolvedOptions = {
				...fetchOptions,
				signal: composedSignal,
				method: method.toUpperCase(),
				headers: toByteStringHeaderObject(headers.normalize()),
				body: data,
				duplex: "half",
				credentials: isCredentialsSupported ? withCredentials : void 0
			};
			request = isRequestSupported && new Request(url, resolvedOptions);
			let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
			const responseHeaders = AxiosHeaders.from(response.headers);
			if (hasMaxContentLength) {
				const declaredLength = utils_default.toFiniteNumber(responseHeaders.getContentLength());
				if (declaredLength != null && declaredLength > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
			}
			const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
			if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
				const options = {};
				[
					"status",
					"statusText",
					"headers"
				].forEach((prop) => {
					options[prop] = response[prop];
				});
				const responseContentLength = utils_default.toFiniteNumber(responseHeaders.getContentLength());
				const [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [];
				let bytesRead = 0;
				const onChunkProgress = (loadedBytes) => {
					if (hasMaxContentLength) {
						bytesRead = loadedBytes;
						if (bytesRead > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
					}
					onProgress && onProgress(loadedBytes);
				};
				response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
					flush && flush();
					unsubscribe && unsubscribe();
				}), options);
			}
			responseType = responseType || "text";
			let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
			if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
				let materializedSize;
				if (responseData != null) {
					if (typeof responseData.byteLength === "number") materializedSize = responseData.byteLength;
					else if (typeof responseData.size === "number") materializedSize = responseData.size;
					else if (typeof responseData === "string") materializedSize = typeof TextEncoder === "function" ? new TextEncoder().encode(responseData).byteLength : responseData.length;
				}
				if (typeof materializedSize === "number" && materializedSize > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
			}
			!isStreamResponse && unsubscribe && unsubscribe();
			return await new Promise((resolve, reject) => {
				settle(resolve, reject, {
					data: responseData,
					headers: AxiosHeaders.from(response.headers),
					status: response.status,
					statusText: response.statusText,
					config,
					request
				});
			});
		} catch (err) {
			unsubscribe && unsubscribe();
			if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError) {
				const canceledError = composedSignal.reason;
				canceledError.config = config;
				request && (canceledError.request = request);
				if (err !== canceledError) Object.defineProperty(canceledError, "cause", {
					__proto__: null,
					value: err,
					writable: true,
					enumerable: false,
					configurable: true
				});
				throw canceledError;
			}
			if (pendingBodyError) {
				request && !pendingBodyError.request && (pendingBodyError.request = request);
				throw pendingBodyError;
			}
			if (err instanceof AxiosError) {
				request && !err.request && (err.request = request);
				throw err;
			}
			if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
				const networkError = new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request, err && err.response);
				Object.defineProperty(networkError, "cause", {
					__proto__: null,
					value: err.cause || err,
					writable: true,
					enumerable: false,
					configurable: true
				});
				throw networkError;
			}
			throw AxiosError.from(err, err && err.code, config, request, err && err.response);
		}
	};
};
var seedCache = /* @__PURE__ */ new Map();
var getFetch = (config) => {
	let env = config && config.env || {};
	const { fetch, Request, Response } = env;
	const seeds = [
		Request,
		Response,
		fetch
	];
	let i = seeds.length, seed, target, map = seedCache;
	while (i--) {
		seed = seeds[i];
		target = map.get(seed);
		target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
		map = target;
	}
	return target;
};
getFetch();
//#endregion
//#region node_modules/axios/lib/adapters/adapters.js
/**
* Known adapters mapping.
* Provides environment-specific adapters for Axios:
* - `http` for Node.js
* - `xhr` for browsers
* - `fetch` for fetch API-based requests
*
* @type {Object<string, Function|Object>}
*/
var knownAdapters = {
	http: http_default,
	xhr: xhr_default,
	fetch: { get: getFetch }
};
utils_default.forEach(knownAdapters, (fn, value) => {
	if (fn) {
		try {
			Object.defineProperty(fn, "name", {
				__proto__: null,
				value
			});
		} catch (e) {}
		Object.defineProperty(fn, "adapterName", {
			__proto__: null,
			value
		});
	}
});
/**
* Render a rejection reason string for unknown or unsupported adapters
*
* @param {string} reason
* @returns {string}
*/
var renderReason = (reason) => `- ${reason}`;
/**
* Check if the adapter is resolved (function, null, or false)
*
* @param {Function|null|false} adapter
* @returns {boolean}
*/
var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
/**
* Get the first suitable adapter from the provided list.
* Tries each adapter in order until a supported one is found.
* Throws an AxiosError if no adapter is suitable.
*
* @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
* @param {Object} config - Axios request configuration
* @throws {AxiosError} If no suitable adapter is available
* @returns {Function} The resolved adapter function
*/
function getAdapter(adapters, config) {
	adapters = utils_default.isArray(adapters) ? adapters : [adapters];
	const { length } = adapters;
	let nameOrAdapter;
	let adapter;
	const rejectedReasons = {};
	for (let i = 0; i < length; i++) {
		nameOrAdapter = adapters[i];
		let id;
		adapter = nameOrAdapter;
		if (!isResolvedHandle(nameOrAdapter)) {
			adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
			if (adapter === void 0) throw new AxiosError(`Unknown adapter '${id}'`);
		}
		if (adapter && (utils_default.isFunction(adapter) || (adapter = adapter.get(config)))) break;
		rejectedReasons[id || "#" + i] = adapter;
	}
	if (!adapter) {
		const reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
		throw new AxiosError(`There is no suitable adapter to dispatch the request ` + (length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified"), AxiosError.ERR_NOT_SUPPORT);
	}
	return adapter;
}
/**
* Exports Axios adapters and utility to resolve an adapter
*/
var adapters_default = {
	/**
	* Resolve an adapter from a list of adapter names or functions.
	* @type {Function}
	*/
	getAdapter,
	/**
	* Exposes all known adapters
	* @type {Object<string, Function|Object>}
	*/
	adapters: knownAdapters
};
//#endregion
//#region node_modules/axios/lib/core/dispatchRequest.js
/**
* Throws a `CanceledError` if cancellation has been requested.
*
* @param {Object} config The config that is to be used for the request
*
* @returns {void}
*/
function throwIfCancellationRequested(config) {
	if (config.cancelToken) config.cancelToken.throwIfRequested();
	if (config.signal && config.signal.aborted) throw new CanceledError(null, config);
}
/**
* Dispatch a request to the server using the configured adapter.
*
* @param {object} config The config that is to be used for the request
*
* @returns {Promise} The Promise to be fulfilled
*/
function dispatchRequest(config) {
	throwIfCancellationRequested(config);
	config.headers = AxiosHeaders.from(config.headers);
	config.data = transformData.call(config, config.transformRequest);
	if ([
		"post",
		"put",
		"patch"
	].indexOf(config.method) !== -1) config.headers.setContentType("application/x-www-form-urlencoded", false);
	return adapters_default.getAdapter(config.adapter || defaults.adapter, config)(config).then(function onAdapterResolution(response) {
		throwIfCancellationRequested(config);
		config.response = response;
		try {
			response.data = transformData.call(config, config.transformResponse, response);
		} finally {
			delete config.response;
		}
		response.headers = AxiosHeaders.from(response.headers);
		return response;
	}, function onAdapterRejection(reason) {
		if (!isCancel(reason)) {
			throwIfCancellationRequested(config);
			if (reason && reason.response) {
				config.response = reason.response;
				try {
					reason.response.data = transformData.call(config, config.transformResponse, reason.response);
				} finally {
					delete config.response;
				}
				reason.response.headers = AxiosHeaders.from(reason.response.headers);
			}
		}
		return Promise.reject(reason);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/validator.js
var validators$1 = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((type, i) => {
	validators$1[type] = function validator(thing) {
		return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
	};
});
var deprecatedWarnings = {};
/**
* Transitional option validator
*
* @param {function|boolean?} validator - set to false if the transitional option has been removed
* @param {string?} version - deprecated version / removed since version
* @param {string?} message - some message with additional info
*
* @returns {function}
*/
validators$1.transitional = function transitional(validator, version, message) {
	function formatMessage(opt, desc) {
		return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
	}
	return (value, opt, opts) => {
		if (validator === false) throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
		if (version && !deprecatedWarnings[opt]) {
			deprecatedWarnings[opt] = true;
			console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
		}
		return validator ? validator(value, opt, opts) : true;
	};
};
validators$1.spelling = function spelling(correctSpelling) {
	return (value, opt) => {
		console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
		return true;
	};
};
/**
* Assert object's properties type
*
* @param {object} options
* @param {object} schema
* @param {boolean?} allowUnknown
*
* @returns {object}
*/
function assertOptions(options, schema, allowUnknown) {
	if (typeof options !== "object" || options === null) throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
	const keys = Object.keys(options);
	let i = keys.length;
	while (i-- > 0) {
		const opt = keys[i];
		const validator = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
		if (validator) {
			const value = options[opt];
			const result = value === void 0 || validator(value, opt, options);
			if (result !== true) throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (allowUnknown !== true) throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
	}
}
var validator_default = {
	assertOptions,
	validators: validators$1
};
//#endregion
//#region node_modules/axios/lib/core/Axios.js
var validators = validator_default.validators;
/**
* Create a new instance of Axios
*
* @param {Object} instanceConfig The default config for the instance
*
* @return {Axios} A new instance of Axios
*/
var Axios = class {
	constructor(instanceConfig) {
		this.defaults = instanceConfig || {};
		this.interceptors = {
			request: new InterceptorManager(),
			response: new InterceptorManager()
		};
	}
	/**
	* Dispatch a request
	*
	* @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	* @param {?Object} config
	*
	* @returns {Promise} The Promise to be fulfilled
	*/
	async request(configOrUrl, config) {
		try {
			return await this._request(configOrUrl, config);
		} catch (err) {
			if (err instanceof Error) {
				let dummy = {};
				Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = /* @__PURE__ */ new Error();
				const stack = (() => {
					if (!dummy.stack) return "";
					const firstNewlineIndex = dummy.stack.indexOf("\n");
					return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
				})();
				try {
					if (!err.stack) err.stack = stack;
					else if (stack) {
						const firstNewlineIndex = stack.indexOf("\n");
						const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
						const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
						if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) err.stack += "\n" + stack;
					}
				} catch (e) {}
			}
			throw err;
		}
	}
	_request(configOrUrl, config) {
		if (typeof configOrUrl === "string") {
			config = config || {};
			config.url = configOrUrl;
		} else config = configOrUrl || {};
		config = mergeConfig(this.defaults, config);
		const { transitional, paramsSerializer, headers } = config;
		if (transitional !== void 0) validator_default.assertOptions(transitional, {
			silentJSONParsing: validators.transitional(validators.boolean),
			forcedJSONParsing: validators.transitional(validators.boolean),
			clarifyTimeoutError: validators.transitional(validators.boolean),
			legacyInterceptorReqResOrdering: validators.transitional(validators.boolean),
			advertiseZstdAcceptEncoding: validators.transitional(validators.boolean),
			validateStatusUndefinedResolves: validators.transitional(validators.boolean)
		}, false);
		if (paramsSerializer != null) {
			if (utils_default.isFunction(paramsSerializer)) config.paramsSerializer = { serialize: paramsSerializer };
			else validator_default.assertOptions(paramsSerializer, {
				encode: validators.function,
				serialize: validators.function
			}, true);
		}
		if (config.allowAbsoluteUrls !== void 0) {} else if (this.defaults.allowAbsoluteUrls !== void 0) config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
		else config.allowAbsoluteUrls = true;
		validator_default.assertOptions(config, {
			baseUrl: validators.spelling("baseURL"),
			withXsrfToken: validators.spelling("withXSRFToken")
		}, true);
		config.method = (config.method || this.defaults.method || "get").toLowerCase();
		let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
		headers && utils_default.forEach([
			"delete",
			"get",
			"head",
			"post",
			"put",
			"patch",
			"query",
			"common"
		], (method) => {
			delete headers[method];
		});
		config.headers = AxiosHeaders.concat(contextHeaders, headers);
		const requestInterceptorChain = [];
		let synchronousRequestInterceptors = true;
		this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
			if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) return;
			synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
			const transitional = config.transitional || transitional_default;
			if (transitional && transitional.legacyInterceptorReqResOrdering) requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
			else requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
		});
		const responseInterceptorChain = [];
		this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
			responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
		});
		let promise;
		let i = 0;
		let len;
		if (!synchronousRequestInterceptors) {
			const chain = [dispatchRequest.bind(this), void 0];
			chain.unshift(...requestInterceptorChain);
			chain.push(...responseInterceptorChain);
			len = chain.length;
			promise = Promise.resolve(config);
			while (i < len) promise = promise.then(chain[i++], chain[i++]);
			return promise;
		}
		len = requestInterceptorChain.length;
		let newConfig = config;
		while (i < len) {
			const onFulfilled = requestInterceptorChain[i++];
			const onRejected = requestInterceptorChain[i++];
			try {
				newConfig = onFulfilled ? onFulfilled(newConfig) : newConfig;
			} catch (error) {
				if (!onRejected) {
					promise = Promise.reject(error);
					break;
				}
				try {
					const rejectedResult = onRejected.call(this, error);
					if (utils_default.isThenable(rejectedResult)) promise = Promise.resolve(rejectedResult).then(() => dispatchRequest.call(this, newConfig));
				} catch (rejectedError) {
					promise = Promise.reject(rejectedError);
				}
				break;
			}
		}
		if (!promise) try {
			promise = dispatchRequest.call(this, newConfig);
		} catch (error) {
			promise = Promise.reject(error);
		}
		i = 0;
		len = responseInterceptorChain.length;
		while (i < len) promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
		return promise;
	}
	getUri(config) {
		config = mergeConfig(this.defaults, config);
		return buildURL(buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls, config), config.params, config.paramsSerializer);
	}
};
utils_default.forEach([
	"delete",
	"get",
	"head",
	"options"
], function forEachMethodNoData(method) {
	Axios.prototype[method] = function(url, config) {
		return this.request(mergeConfig(config || {}, {
			method,
			url,
			data: config && utils_default.hasOwnProp(config, "data") ? config.data : void 0
		}));
	};
});
utils_default.forEach([
	"post",
	"put",
	"patch",
	"query"
], function forEachMethodWithData(method) {
	function generateHTTPMethod(isForm) {
		return function httpMethod(url, data, config) {
			return this.request(mergeConfig(config || {}, {
				method,
				headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
				url,
				data
			}));
		};
	}
	Axios.prototype[method] = generateHTTPMethod();
	if (method !== "query") Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
//#endregion
//#region node_modules/axios/lib/cancel/CancelToken.js
/**
* A `CancelToken` is an object that can be used to request cancellation of an operation.
*
* @param {Function} executor The executor function.
*
* @returns {CancelToken}
*/
var CancelToken = class CancelToken {
	constructor(executor) {
		if (typeof executor !== "function") throw new TypeError("executor must be a function.");
		let resolvePromise;
		this.promise = new Promise(function promiseExecutor(resolve) {
			resolvePromise = resolve;
		});
		const token = this;
		this.promise.then((cancel) => {
			if (!token._listeners) return;
			let i = token._listeners.length;
			while (i-- > 0) token._listeners[i](cancel);
			token._listeners = null;
		});
		this.promise.then = (onfulfilled) => {
			let _resolve;
			const promise = new Promise((resolve) => {
				token.subscribe(resolve);
				_resolve = resolve;
			}).then(onfulfilled);
			promise.cancel = function reject() {
				token.unsubscribe(_resolve);
			};
			return promise;
		};
		executor(function cancel(message, config, request) {
			if (token.reason) return;
			token.reason = new CanceledError(message, config, request);
			resolvePromise(token.reason);
		});
	}
	/**
	* Throws a `CanceledError` if cancellation has been requested.
	*/
	throwIfRequested() {
		if (this.reason) throw this.reason;
	}
	/**
	* Subscribe to the cancel signal
	*/
	subscribe(listener) {
		if (this.reason) {
			listener(this.reason);
			return;
		}
		if (this._listeners) this._listeners.push(listener);
		else this._listeners = [listener];
	}
	/**
	* Unsubscribe from the cancel signal
	*/
	unsubscribe(listener) {
		if (!this._listeners) return;
		const index = this._listeners.indexOf(listener);
		if (index !== -1) this._listeners.splice(index, 1);
	}
	toAbortSignal() {
		const controller = new AbortController();
		const abort = (err) => {
			controller.abort(err);
		};
		this.subscribe(abort);
		controller.signal.unsubscribe = () => this.unsubscribe(abort);
		return controller.signal;
	}
	/**
	* Returns an object that contains a new `CancelToken` and a function that, when called,
	* cancels the `CancelToken`.
	*/
	static source() {
		let cancel;
		return {
			token: new CancelToken(function executor(c) {
				cancel = c;
			}),
			cancel
		};
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/spread.js
/**
* Syntactic sugar for invoking a function and expanding an array for arguments.
*
* Common use case would be to use `Function.prototype.apply`.
*
*  ```js
*  function f(x, y, z) {}
*  const args = [1, 2, 3];
*  f.apply(null, args);
*  ```
*
* With `spread` this example can be re-written.
*
*  ```js
*  spread(function(x, y, z) {})([1, 2, 3]);
*  ```
*
* @param {Function} callback
*
* @returns {Function}
*/
function spread(callback) {
	return function wrap(arr) {
		return callback.apply(null, arr);
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/isAxiosError.js
/**
* Determines whether the payload is an error thrown by Axios
*
* @param {*} payload The value to test
*
* @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
*/
function isAxiosError(payload) {
	return utils_default.isObject(payload) && payload.isAxiosError === true;
}
//#endregion
//#region node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
	Continue: 100,
	SwitchingProtocols: 101,
	Processing: 102,
	EarlyHints: 103,
	Ok: 200,
	Created: 201,
	Accepted: 202,
	NonAuthoritativeInformation: 203,
	NoContent: 204,
	ResetContent: 205,
	PartialContent: 206,
	MultiStatus: 207,
	AlreadyReported: 208,
	ImUsed: 226,
	MultipleChoices: 300,
	MovedPermanently: 301,
	Found: 302,
	SeeOther: 303,
	NotModified: 304,
	UseProxy: 305,
	Unused: 306,
	TemporaryRedirect: 307,
	PermanentRedirect: 308,
	BadRequest: 400,
	Unauthorized: 401,
	PaymentRequired: 402,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,
	NotAcceptable: 406,
	ProxyAuthenticationRequired: 407,
	RequestTimeout: 408,
	Conflict: 409,
	Gone: 410,
	LengthRequired: 411,
	PreconditionFailed: 412,
	PayloadTooLarge: 413,
	UriTooLong: 414,
	UnsupportedMediaType: 415,
	RangeNotSatisfiable: 416,
	ExpectationFailed: 417,
	ImATeapot: 418,
	MisdirectedRequest: 421,
	UnprocessableEntity: 422,
	Locked: 423,
	FailedDependency: 424,
	TooEarly: 425,
	UpgradeRequired: 426,
	PreconditionRequired: 428,
	TooManyRequests: 429,
	RequestHeaderFieldsTooLarge: 431,
	UnavailableForLegalReasons: 451,
	InternalServerError: 500,
	NotImplemented: 501,
	BadGateway: 502,
	ServiceUnavailable: 503,
	GatewayTimeout: 504,
	HttpVersionNotSupported: 505,
	VariantAlsoNegotiates: 506,
	InsufficientStorage: 507,
	LoopDetected: 508,
	NotExtended: 510,
	NetworkAuthenticationRequired: 511,
	WebServerReturnsAnUnknownError: 520,
	WebServerIsDown: 521,
	ConnectionTimedOut: 522,
	OriginIsUnreachable: 523,
	TimeoutOccurred: 524,
	SslHandshakeFailed: 525,
	InvalidSslCertificate: 526
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
	HttpStatusCode[value] = key;
});
//#endregion
//#region node_modules/axios/lib/axios.js
/**
* Create an instance of Axios
*
* @param {Object} defaultConfig The default config for the instance
*
* @returns {Axios} A new instance of Axios
*/
function createInstance(defaultConfig) {
	const context = new Axios(defaultConfig);
	const instance = bind(Axios.prototype.request, context);
	utils_default.extend(instance, Axios.prototype, context, { allOwnKeys: true });
	utils_default.extend(instance, context, null, { allOwnKeys: true });
	instance.create = function create(instanceConfig) {
		return createInstance(mergeConfig(defaultConfig, instanceConfig));
	};
	return instance;
}
var axios = createInstance(defaults);
axios.Axios = Axios;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
	return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders;
axios.formToJSON = (thing) => formDataToJSON(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode;
axios.default = axios;
//#endregion
//#region resources/js/components/ClientOnly.vue
var _sfc_main$12 = {
	__name: "ClientOnly",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Renders its content in the browser only, once the page has mounted.
		*
		* For <Teleport to="body">. Vue hydrates a teleport by reading <body> from its
		* first child, but this storefront's <body> starts with the page data, #app and
		* any marketing snippets — so server-rendered teleport markup can never line up
		* and every page would report a hydration mismatch. The storefront's teleports
		* (toaster, login prompt, lightbox, search) are all closed or empty when a page
		* loads, so rendering them a moment later in the browser changes nothing a
		* visitor can see. Wrap any new <Teleport to="body"> in this too.
		*/
		const mounted = (0, vue_exports.ref)(false);
		(0, vue_exports.onMounted)(() => {
			mounted.value = true;
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (mounted.value) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ClientOnly.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhArrowCounterClockwise.vue.mjs
var y$10 = [
	"width",
	"height",
	"fill",
	"transform"
];
var V$11 = { key: 0 };
var w$8 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M228,128a100,100,0,0,1-98.66,100H128a99.39,99.39,0,0,1-68.62-27.29,12,12,0,0,1,16.48-17.45,76,76,0,1,0-1.57-109c-.13.13-.25.25-.39.37L54.89,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.72L57.48,57.06A100,100,0,0,1,228,128Z" }, null, -1)];
var L$6 = { key: 1 };
var C$10 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z" }, null, -1)];
var Z$9 = { key: 2 };
var S$10 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L60.63,81.29l17,17A8,8,0,0,1,72,112H24a8,8,0,0,1-8-8V56A8,8,0,0,1,29.66,50.3L49.31,70,60.25,60A96,96,0,0,1,224,128Z" }, null, -1)];
var z$6 = { key: 3 };
var N$8 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z" }, null, -1)];
var b$11 = { key: 4 };
var P$7 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z" }, null, -1)];
var W$8 = { key: 5 };
var j$8 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M220,128a92,92,0,0,1-90.77,92H128a91.47,91.47,0,0,1-63.13-25.1,4,4,0,1,1,5.5-5.82A84,84,0,1,0,68.6,68.57l-.13.12L34.3,100H72a4,4,0,0,1,0,8H24a4,4,0,0,1-4-4V56a4,4,0,0,1,8,0V94.89l35-32A92,92,0,0,1,220,128Z" }, null, -1)];
var G$4 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhArrowCounterClockwise",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(c) {
		const a = c, d = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), s = (0, vue_exports.computed)(() => a.weight ?? d), i = (0, vue_exports.computed)(() => a.size ?? _), p = (0, vue_exports.computed)(() => a.color ?? h), g = (0, vue_exports.computed)(() => a.mirrored !== void 0 ? a.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (r, D) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: p.value,
			transform: g.value
		}, r.$attrs), [(0, vue_exports.renderSlot)(r.$slots, "default"), s.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$11, w$8)) : s.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", L$6, C$10)) : s.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", Z$9, S$10)) : s.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", z$6, N$8)) : s.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", b$11, P$7)) : s.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", W$8, j$8)) : (0, vue_exports.createCommentVNode)("", !0)], 16, y$10));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhCaretRight.vue.mjs
var w$7 = [
	"width",
	"height",
	"fill",
	"transform"
];
var M$8 = { key: 0 };
var A$9 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" }, null, -1)];
var Z$8 = { key: 1 };
var S$9 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M176,128,96,208V48Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z" }, null, -1)];
var V$10 = { key: 2 };
var L$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z" }, null, -1)];
var B$6 = { key: 3 };
var b$10 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z" }, null, -1)];
var E$6 = { key: 4 };
var W$7 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" }, null, -1)];
var $$7 = { key: 5 };
var R$1 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M178.83,130.83l-80,80a4,4,0,0,1-5.66-5.66L170.34,128,93.17,50.83a4,4,0,0,1,5.66-5.66l80,80A4,4,0,0,1,178.83,130.83Z" }, null, -1)];
var G$3 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhCaretRight",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(d) {
		const l = d, c = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), s = (0, vue_exports.computed)(() => l.weight ?? c), r = (0, vue_exports.computed)(() => l.size ?? _), p = (0, vue_exports.computed)(() => l.color ?? h), g = (0, vue_exports.computed)(() => l.mirrored !== void 0 ? l.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (a, D) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: r.value,
			height: r.value,
			fill: p.value,
			transform: g.value
		}, a.$attrs), [(0, vue_exports.renderSlot)(a.$slots, "default"), s.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", M$8, A$9)) : s.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", Z$8, S$9)) : s.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$10, L$5)) : s.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", B$6, b$10)) : s.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", E$6, W$7)) : s.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", $$7, R$1)) : (0, vue_exports.createCommentVNode)("", !0)], 16, w$7));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhHeadset.vue.mjs
var g$9 = [
	"width",
	"height",
	"fill",
	"transform"
];
var Z$7 = { key: 0 };
var M$7 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M204.73,51.85A108.07,108.07,0,0,0,20,128v56a28,28,0,0,0,28,28H64a28,28,0,0,0,28-28V144a28,28,0,0,0-28-28H44.84A84.05,84.05,0,0,1,128,44h.64a83.7,83.7,0,0,1,82.52,72H192a28,28,0,0,0-28,28v40a28,28,0,0,0,28,28h19.6A20,20,0,0,1,192,228H136a12,12,0,0,0,0,24h56a44.05,44.05,0,0,0,44-44V128A107.34,107.34,0,0,0,204.73,51.85ZM64,140a4,4,0,0,1,4,4v40a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V140Zm124,44V144a4,4,0,0,1,4-4h20v48H192A4,4,0,0,1,188,184Z" }, null, -1)];
var f$6 = { key: 1 };
var x$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M80,144v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V128H64A16,16,0,0,1,80,144Zm112-16a16,16,0,0,0-16,16v40a16,16,0,0,0,16,16h32V128Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M201.89,54.66A104.08,104.08,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z" }, null, -1)];
var S$8 = { key: 2 };
var C$9 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M232,128v80a40,40,0,0,1-40,40H136a8,8,0,0,1,0-16h56a24,24,0,0,0,24-24H192a24,24,0,0,1-24-24V144a24,24,0,0,1,24-24h23.65A88,88,0,0,0,66,65.54,87.29,87.29,0,0,0,40.36,120H64a24,24,0,0,1,24,24v40a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V128A104.11,104.11,0,0,1,201.89,54.66,103.41,103.41,0,0,1,232,128Z" }, null, -1)];
var B$5 = { key: 3 };
var b$9 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M200.47,56.07A101.37,101.37,0,0,0,128.77,26H128A102,102,0,0,0,26,128v56a22,22,0,0,0,22,22H64a22,22,0,0,0,22-22V144a22,22,0,0,0-22-22H38.2A90,90,0,0,1,128,38h.68a89.71,89.71,0,0,1,89.13,84H192a22,22,0,0,0-22,22v40a22,22,0,0,0,22,22h26v2a26,26,0,0,1-26,26H136a6,6,0,0,0,0,12h56a38,38,0,0,0,38-38V128A101.44,101.44,0,0,0,200.47,56.07ZM64,134a10,10,0,0,1,10,10v40a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V134Zm118,50V144a10,10,0,0,1,10-10h26v60H192A10,10,0,0,1,182,184Z" }, null, -1)];
var E$5 = { key: 4 };
var W$6 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z" }, null, -1)];
var $$6 = { key: 5 };
var q$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M199.05,57.48A100.07,100.07,0,0,0,28,128v56a20,20,0,0,0,20,20H64a20,20,0,0,0,20-20V144a20,20,0,0,0-20-20H36.08A92,92,0,0,1,128,36h.7a91.75,91.75,0,0,1,91.22,88H192a20,20,0,0,0-20,20v40a20,20,0,0,0,20,20h28v4a28,28,0,0,1-28,28H136a4,4,0,0,0,0,8h56a36,36,0,0,0,36-36V128A99.44,99.44,0,0,0,199.05,57.48ZM64,132a12,12,0,0,1,12,12v40a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V132Zm116,52V144a12,12,0,0,1,12-12h28v64H192A12,12,0,0,1,180,184Z" }, null, -1)];
var I$6 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhHeadset",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(r) {
		const s = r, d = (0, vue_exports.inject)("weight", "regular"), c = (0, vue_exports.inject)("size", "1em"), _ = (0, vue_exports.inject)("color", "currentColor"), v = (0, vue_exports.inject)("mirrored", !1), o = (0, vue_exports.computed)(() => s.weight ?? d), i = (0, vue_exports.computed)(() => s.size ?? c), H = (0, vue_exports.computed)(() => s.color ?? _), u = (0, vue_exports.computed)(() => s.mirrored !== void 0 ? s.mirrored ? "scale(-1, 1)" : void 0 : v ? "scale(-1, 1)" : void 0);
		return (l, F) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: H.value,
			transform: u.value
		}, l.$attrs), [(0, vue_exports.renderSlot)(l.$slots, "default"), o.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", Z$7, M$7)) : o.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", f$6, x$5)) : o.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", S$8, C$9)) : o.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", B$5, b$9)) : o.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", E$5, W$6)) : o.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", $$6, q$4)) : (0, vue_exports.createCommentVNode)("", !0)], 16, g$9));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhHeart.vue.mjs
var A$7 = [
	"width",
	"height",
	"fill",
	"transform"
];
var M$6 = { key: 0 };
var Z$6 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36a66.08,66.08,0,0,0-66,66c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z" }, null, -1)];
var w$6 = { key: 1 };
var x$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M232,102c0,66-104,122-104,122S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32A54,54,0,0,1,232,102Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z" }, null, -1)];
var z$5 = { key: 2 };
var N$7 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z" }, null, -1)];
var b$8 = { key: 3 };
var P$6 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M178,42c-21,0-39.26,9.47-50,25.34C117.26,51.47,99,42,78,42a60.07,60.07,0,0,0-60,60c0,29.2,18.2,59.59,54.1,90.31a334.68,334.68,0,0,0,53.06,37,6,6,0,0,0,5.68,0,334.68,334.68,0,0,0,53.06-37C219.8,161.59,238,131.2,238,102A60.07,60.07,0,0,0,178,42ZM128,217.11C111.59,207.64,30,157.72,30,102A48.05,48.05,0,0,1,78,54c20.28,0,37.31,10.83,44.45,28.27a6,6,0,0,0,11.1,0C140.69,64.83,157.72,54,178,54a48.05,48.05,0,0,1,48,48C226,157.72,144.41,207.64,128,217.11Z" }, null, -1)];
var V$8 = { key: 4 };
var $$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z" }, null, -1)];
var j$7 = { key: 5 };
var q$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M178,44c-21.44,0-39.92,10.19-50,27.07C117.92,54.19,99.44,44,78,44a58.07,58.07,0,0,0-58,58c0,28.59,18,58.47,53.4,88.79a333.81,333.81,0,0,0,52.7,36.73,4,4,0,0,0,3.8,0,333.81,333.81,0,0,0,52.7-36.73C218,160.47,236,130.59,236,102A58.07,58.07,0,0,0,178,44ZM128,219.42c-14-8-100-59.35-100-117.42A50.06,50.06,0,0,1,78,52c21.11,0,38.85,11.31,46.3,29.51a4,4,0,0,0,7.4,0C139.15,63.31,156.89,52,178,52a50.06,50.06,0,0,1,50,50C228,160,142,211.46,128,219.42Z" }, null, -1)];
var I$5 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhHeart",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(r) {
		const c = r, d = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), s = (0, vue_exports.computed)(() => c.weight ?? d), i = (0, vue_exports.computed)(() => c.size ?? _), C = (0, vue_exports.computed)(() => c.color ?? h), p = (0, vue_exports.computed)(() => c.mirrored !== void 0 ? c.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (l, F) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: C.value,
			transform: p.value
		}, l.$attrs), [(0, vue_exports.renderSlot)(l.$slots, "default"), s.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", M$6, Z$6)) : s.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", w$6, x$4)) : s.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", z$5, N$7)) : s.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", b$8, P$6)) : s.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$8, $$5)) : s.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", j$7, q$3)) : (0, vue_exports.createCommentVNode)("", !0)], 16, A$7));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhList.vue.mjs
var v$7 = [
	"width",
	"height",
	"fill",
	"transform"
];
var y$7 = { key: 0 };
var w$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z" }, null, -1)];
var k$5 = { key: 1 };
var S$7 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M216,64V192H40V64Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }, null, -1)];
var V$7 = { key: 2 };
var C$8 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM192,184H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Z" }, null, -1)];
var B$4 = { key: 3 };
var b$7 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z" }, null, -1)];
var E$4 = { key: 4 };
var W$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" }, null, -1)];
var $$4 = { key: 5 };
var L$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128ZM40,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8ZM216,188H40a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Z" }, null, -1)];
var G$2 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhList",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(d) {
		const s = d, c = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), H = (0, vue_exports.inject)("mirrored", !1), a = (0, vue_exports.computed)(() => s.weight ?? c), l = (0, vue_exports.computed)(() => s.size ?? _), u = (0, vue_exports.computed)(() => s.color ?? h), p = (0, vue_exports.computed)(() => s.mirrored !== void 0 ? s.mirrored ? "scale(-1, 1)" : void 0 : H ? "scale(-1, 1)" : void 0);
		return (r, D) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: l.value,
			height: l.value,
			fill: u.value,
			transform: p.value
		}, r.$attrs), [(0, vue_exports.renderSlot)(r.$slots, "default"), a.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", y$7, w$5)) : a.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", k$5, S$7)) : a.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$7, C$8)) : a.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", B$4, b$7)) : a.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", E$4, W$5)) : a.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", $$4, L$4)) : (0, vue_exports.createCommentVNode)("", !0)], 16, v$7));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhMagnifyingGlass.vue.mjs
var Z$4 = [
	"width",
	"height",
	"fill",
	"transform"
];
var f$5 = { key: 0 };
var A$6 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" }, null, -1)];
var k$4 = { key: 1 };
var z$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }, null, -1)];
var C$7 = { key: 2 };
var N$6 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" }, null, -1)];
var b$6 = { key: 3 };
var P$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z" }, null, -1)];
var V$6 = { key: 4 };
var $$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" }, null, -1)];
var j$6 = { key: 5 };
var q$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z" }, null, -1)];
var I$4 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhMagnifyingGlass",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(d) {
		const l = d, c = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), s = (0, vue_exports.computed)(() => l.weight ?? c), i = (0, vue_exports.computed)(() => l.size ?? _), p = (0, vue_exports.computed)(() => l.color ?? h), g = (0, vue_exports.computed)(() => l.mirrored !== void 0 ? l.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (r, F) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: p.value,
			transform: g.value
		}, r.$attrs), [(0, vue_exports.renderSlot)(r.$slots, "default"), s.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", f$5, A$6)) : s.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", k$4, z$4)) : s.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", C$7, N$6)) : s.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", b$6, P$5)) : s.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$6, $$3)) : s.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", j$6, q$2)) : (0, vue_exports.createCommentVNode)("", !0)], 16, Z$4));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhMapPin.vue.mjs
var y$5 = [
	"width",
	"height",
	"fill",
	"transform"
];
var C$6 = { key: 0 };
var w$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z" }, null, -1)];
var M$3 = { key: 1 };
var S$6 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M128,24a80,80,0,0,0-80,80c0,72,80,128,80,128s80-56,80-128A80,80,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" }, null, -1)];
var z$3 = { key: 2 };
var N$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" }, null, -1)];
var P$4 = { key: 3 };
var E$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M128,66a38,38,0,1,0,38,38A38,38,0,0,0,128,66Zm0,64a26,26,0,1,1,26-26A26,26,0,0,1,128,130Zm0-112a86.1,86.1,0,0,0-86,86c0,30.91,14.34,63.74,41.47,94.94a252.32,252.32,0,0,0,41.09,38,6,6,0,0,0,6.88,0,252.32,252.32,0,0,0,41.09-38c27.13-31.2,41.47-64,41.47-94.94A86.1,86.1,0,0,0,128,18Zm0,206.51C113,212.93,54,163.62,54,104a74,74,0,0,1,148,0C202,163.62,143,212.93,128,224.51Z" }, null, -1)];
var V$5 = { key: 4 };
var $$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" }, null, -1)];
var j$5 = { key: 5 };
var D$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M128,68a36,36,0,1,0,36,36A36,36,0,0,0,128,68Zm0,64a28,28,0,1,1,28-28A28,28,0,0,1,128,132Zm0-112a84.09,84.09,0,0,0-84,84c0,30.42,14.17,62.79,41,93.62a250,250,0,0,0,40.73,37.66,4,4,0,0,0,4.58,0A250,250,0,0,0,171,197.62c26.81-30.83,41-63.2,41-93.62A84.09,84.09,0,0,0,128,20Zm37.1,172.23A254.62,254.62,0,0,1,128,227a254.62,254.62,0,0,1-37.1-34.81C73.15,171.8,52,139.9,52,104a76,76,0,0,1,152,0C204,139.9,182.85,171.8,165.1,192.23Z" }, null, -1)];
var I$3 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhMapPin",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(r) {
		const a = r, d = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), m = (0, vue_exports.inject)("mirrored", !1), s = (0, vue_exports.computed)(() => a.weight ?? d), i = (0, vue_exports.computed)(() => a.size ?? _), u = (0, vue_exports.computed)(() => a.color ?? h), p = (0, vue_exports.computed)(() => a.mirrored !== void 0 ? a.mirrored ? "scale(-1, 1)" : void 0 : m ? "scale(-1, 1)" : void 0);
		return (l, G) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: u.value,
			transform: p.value
		}, l.$attrs), [(0, vue_exports.renderSlot)(l.$slots, "default"), s.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", C$6, w$4)) : s.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", M$3, S$6)) : s.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", z$3, N$5)) : s.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", P$4, E$3)) : s.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$5, $$2)) : s.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", j$5, D$2)) : (0, vue_exports.createCommentVNode)("", !0)], 16, y$5));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhNotebook.vue.mjs
var A$4 = [
	"width",
	"height",
	"fill",
	"transform"
];
var M$2 = { key: 0 };
var y$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M108,108a12,12,0,0,1,12-12h56a12,12,0,0,1,0,24H120A12,12,0,0,1,108,108Zm68,28H120a12,12,0,0,0,0,24h56a12,12,0,0,0,0-24Zm52-88V208a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28H208A20,20,0,0,1,228,48ZM52,204H68V52H52ZM204,52H92V204H204Z" }, null, -1)];
var f$4 = { key: 1 };
var x$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M80,40V216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z" }, null, -1)];
var S$5 = { key: 2 };
var C$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM80,208H48V48H80Zm96-56H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" }, null, -1)];
var B$3 = { key: 3 };
var b$5 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M182,112a6,6,0,0,1-6,6H112a6,6,0,0,1,0-12h64A6,6,0,0,1,182,112Zm-6,26H112a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm46-90V208a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H74V46H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210ZM210,48a2,2,0,0,0-2-2H86V210H208a2,2,0,0,0,2-2Z" }, null, -1)];
var E$2 = { key: 4 };
var W$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z" }, null, -1)];
var $$1 = { key: 5 };
var q$1 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M180,112a4,4,0,0,1-4,4H112a4,4,0,0,1,0-8h64A4,4,0,0,1,180,112Zm-4,28H112a4,4,0,0,0,0,8h64a4,4,0,0,0,0-8Zm44-92V208a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V48A12,12,0,0,1,48,36H208A12,12,0,0,1,220,48ZM48,212H76V44H48a4,4,0,0,0-4,4V208A4,4,0,0,0,48,212ZM212,48a4,4,0,0,0-4-4H84V212H208a4,4,0,0,0,4-4Z" }, null, -1)];
var I$2 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhNotebook",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(h) {
		const s = h, d = (0, vue_exports.inject)("weight", "regular"), c = (0, vue_exports.inject)("size", "1em"), H = (0, vue_exports.inject)("color", "currentColor"), _ = (0, vue_exports.inject)("mirrored", !1), a = (0, vue_exports.computed)(() => s.weight ?? d), l = (0, vue_exports.computed)(() => s.size ?? c), m = (0, vue_exports.computed)(() => s.color ?? H), V = (0, vue_exports.computed)(() => s.mirrored !== void 0 ? s.mirrored ? "scale(-1, 1)" : void 0 : _ ? "scale(-1, 1)" : void 0);
		return (r, F) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: l.value,
			height: l.value,
			fill: m.value,
			transform: V.value
		}, r.$attrs), [(0, vue_exports.renderSlot)(r.$slots, "default"), a.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", M$2, y$4)) : a.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", f$4, x$3)) : a.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", S$5, C$5)) : a.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", B$3, b$5)) : a.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", E$2, W$4)) : a.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", $$1, q$1)) : (0, vue_exports.createCommentVNode)("", !0)], 16, A$4));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhShieldCheck.vue.mjs
var y$3 = [
	"width",
	"height",
	"fill",
	"transform"
];
var C$4 = { key: 0 };
var f$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z" }, null, -1)];
var V$4 = { key: 1 };
var k$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M216,56v56c0,96-88,120-88,120S40,208,40,112V56a8,8,0,0,1,8-8H208A8,8,0,0,1,216,56Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" }, null, -1)];
var S$4 = { key: 2 };
var L$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm-34.32,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" }, null, -1)];
var z$2 = { key: 3 };
var N$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42Zm2,70c0,37.76-13.94,68.39-41.44,91.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66C59.94,180.39,46,149.76,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2ZM172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76Z" }, null, -1)];
var b$4 = { key: 4 };
var P$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" }, null, -1)];
var W$3 = { key: 5 };
var j$4 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,44H48A12,12,0,0,0,36,56v56c0,51.16,24.73,82.12,45.47,99.1,22.4,18.32,44.55,24.5,45.48,24.76a4,4,0,0,0,2.1,0c.93-.26,23.08-6.44,45.48-24.76,20.74-17,45.47-47.94,45.47-99.1V56A12,12,0,0,0,208,44Zm4,68c0,38.44-14.23,69.63-42.29,92.71A132.45,132.45,0,0,1,128,227.82a132.23,132.23,0,0,1-41.71-23.11C58.23,181.63,44,150.44,44,112V56a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-41.17-10.83a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17Z" }, null, -1)];
var G$1 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhShieldCheck",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(r) {
		const l = r, d = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), a = (0, vue_exports.computed)(() => l.weight ?? d), n = (0, vue_exports.computed)(() => l.size ?? _), p = (0, vue_exports.computed)(() => l.color ?? h), m = (0, vue_exports.computed)(() => l.mirrored !== void 0 ? l.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (i, D) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: n.value,
			height: n.value,
			fill: p.value,
			transform: m.value
		}, i.$attrs), [(0, vue_exports.renderSlot)(i.$slots, "default"), a.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", C$4, f$3)) : a.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$4, k$3)) : a.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", S$4, L$3)) : a.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", z$2, N$4)) : a.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", b$4, P$3)) : a.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", W$3, j$4)) : (0, vue_exports.createCommentVNode)("", !0)], 16, y$3));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhSignOut.vue.mjs
var y$2 = [
	"width",
	"height",
	"fill",
	"transform"
];
var A$2 = { key: 0 };
var f$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z" }, null, -1)];
var w$3 = { key: 1 };
var S$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M224,56V200a16,16,0,0,1-16,16H48V40H208A16,16,0,0,1,224,56Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" }, null, -1)];
var x$2 = { key: 2 };
var C$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40A8,8,0,0,0,176,88v32H112a8,8,0,0,0,0,16h64v32a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,229.66,122.34Z" }, null, -1)];
var L$2 = { key: 3 };
var N$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M118,216a6,6,0,0,1-6,6H48a6,6,0,0,1-6-6V40a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H54V210h58A6,6,0,0,1,118,216Zm110.24-92.24-40-40a6,6,0,0,0-8.48,8.48L209.51,122H112a6,6,0,0,0,0,12h97.51l-29.75,29.76a6,6,0,1,0,8.48,8.48l40-40A6,6,0,0,0,228.24,123.76Z" }, null, -1)];
var b$3 = { key: 4 };
var P$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" }, null, -1)];
var W$2 = { key: 5 };
var j$3 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M116,216a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V40a4,4,0,0,1,4-4h64a4,4,0,0,1,0,8H52V212h60A4,4,0,0,1,116,216Zm110.83-90.83-40-40a4,4,0,0,0-5.66,5.66L214.34,124H112a4,4,0,0,0,0,8H214.34l-33.17,33.17a4,4,0,0,0,5.66,5.66l40-40A4,4,0,0,0,226.83,125.17Z" }, null, -1)];
var F$2 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhSignOut",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(r) {
		const s = r, d = (0, vue_exports.inject)("weight", "regular"), c = (0, vue_exports.inject)("size", "1em"), _ = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), a = (0, vue_exports.computed)(() => s.weight ?? d), i = (0, vue_exports.computed)(() => s.size ?? c), p = (0, vue_exports.computed)(() => s.color ?? _), m = (0, vue_exports.computed)(() => s.mirrored !== void 0 ? s.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (h, q) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: p.value,
			transform: m.value
		}, h.$attrs), [(0, vue_exports.renderSlot)(h.$slots, "default"), a.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", A$2, f$2)) : a.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", w$3, S$3)) : a.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", x$2, C$3)) : a.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", L$2, N$3)) : a.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", b$3, P$2)) : a.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", W$2, j$3)) : (0, vue_exports.createCommentVNode)("", !0)], 16, y$2));
	}
});
//#endregion
//#region node_modules/@phosphor-icons/vue/dist/icons/PhX.vue.mjs
var f$1 = [
	"width",
	"height",
	"fill",
	"transform"
];
var w$2 = { key: 0 };
var k$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" }, null, -1)];
var Z = { key: 1 };
var S$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", {
	d: "M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",
	opacity: "0.2"
}, null, -1), /* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }, null, -1)];
var V$2 = { key: 2 };
var C$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }, null, -1)];
var B$2 = { key: 3 };
var N$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z" }, null, -1)];
var b$2 = { key: 4 };
var P$1 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" }, null, -1)];
var W$1 = { key: 5 };
var j$2 = [/* @__PURE__ */ (0, vue_exports.createElementVNode)("path", { d: "M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z" }, null, -1)];
var F$1 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	name: "PhX",
	props: {
		weight: { type: String },
		size: { type: [String, Number] },
		color: { type: String },
		mirrored: { type: Boolean }
	},
	setup(d) {
		const a = d, c = (0, vue_exports.inject)("weight", "regular"), _ = (0, vue_exports.inject)("size", "1em"), h = (0, vue_exports.inject)("color", "currentColor"), u = (0, vue_exports.inject)("mirrored", !1), s = (0, vue_exports.computed)(() => a.weight ?? c), i = (0, vue_exports.computed)(() => a.size ?? _), p = (0, vue_exports.computed)(() => a.color ?? h), L = (0, vue_exports.computed)(() => a.mirrored !== void 0 ? a.mirrored ? "scale(-1, 1)" : void 0 : u ? "scale(-1, 1)" : void 0);
		return (r, q) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("svg", (0, vue_exports.mergeProps)({
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 256 256",
			width: i.value,
			height: i.value,
			fill: p.value,
			transform: L.value
		}, r.$attrs), [(0, vue_exports.renderSlot)(r.$slots, "default"), s.value === "bold" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", w$2, k$2)) : s.value === "duotone" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", Z, S$2)) : s.value === "fill" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", V$2, C$2)) : s.value === "light" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", B$2, N$2)) : s.value === "regular" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", b$2, P$1)) : s.value === "thin" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("g", W$1, j$2)) : (0, vue_exports.createCommentVNode)("", !0)], 16, f$1));
	}
});
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/shared/src/utils.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/defaultAttributes.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/Icon.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon = ({ size, strokeWidth = 2, absoluteStrokeWidth, color, iconNode, name, class: classes, ...props }, { slots }) => {
	return (0, vue_exports.h)("svg", {
		...defaultAttributes,
		width: size || defaultAttributes.width,
		height: size || defaultAttributes.height,
		stroke: color || defaultAttributes.stroke,
		"stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
		class: ["lucide", `lucide-${toKebabCase(name ?? "icon")}`],
		...props
	}, [...iconNode.map((child) => (0, vue_exports.h)(...child)), ...slots.default ? [slots.default()] : []]);
};
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/createLucideIcon.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => (props, { slots }) => (0, vue_exports.h)(Icon, {
	...props,
	iconNode,
	name: iconName
}, slots);
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/icons/chevron-down.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronDown = createLucideIcon("ChevronDownIcon", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]);
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/icons/search.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Search = createLucideIcon("SearchIcon", [["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}], ["path", {
	d: "m21 21-4.3-4.3",
	key: "1qie3q"
}]]);
//#endregion
//#region node_modules/lucide-vue-next/dist/esm/icons/x.js
/**
* @license lucide-vue-next v0.400.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var X = createLucideIcon("XIcon", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region resources/js/utils/responsiveImage.js
/**
* Builds the srcset for an uploaded image from its URL alone.
*
* ResponsiveImageService writes a copy of every image at each of WIDTHS,
* named by convention — /uploads/abc.webp gains /uploads/abc-480.webp — so no
* request is needed to discover which widths exist. The service never skips a
* width (one wider than the source is a byte-for-byte copy), so every
* candidate produced here is a real file.
*
* Deliberately pure: no `window`, no `location`. An origin check cannot run
* while server-rendering, which would make the server emit no srcset where
* the browser emits one — disabling the optimisation on server-rendered
* markup and leaving hydration to disagree about every image.
*/
/** Must match ResponsiveImageService::WIDTHS. */
var WIDTHS = [
	320,
	480,
	768,
	1024
];
/** Must match ResponsiveImageService::MAX_WIDTH — every original is capped here. */
var ORIGINAL_WIDTH = 1400;
/**
* Whether variants can be derived from this URL.
*
* A data URI or an SVG has nothing to gain. Everything else is assumed to be
* one of our own images, because it always is: every stored image URL is
* built from APP_URL by url()/asset(), and no CDN or external image host is
* configured. Being permissive is safe — ResponsiveImage.vue drops the srcset
* if a candidate fails to load.
*/
function canUseVariants(src) {
	if (!src || typeof src !== "string" || src.startsWith("data:")) return false;
	return /\.(webp|jpe?g|png)$/i.test(src.split(/[?#]/)[0]);
}
/** "/a/b.webp" + 480 => "/a/b-480.webp", keeping any query string. */
function variantUrl(src, width) {
	const [path, suffix = ""] = src.split(/(?=[?#])/);
	const dot = path.lastIndexOf(".");
	if (dot === -1) return src;
	return `${path.slice(0, dot)}-${width}${path.slice(dot)}${suffix}`;
}
/**
* The full srcset, or undefined when this image has no variants — in which
* case the caller must leave both srcset and sizes off entirely.
*/
function variantSrcset(src, widths = WIDTHS) {
	if (!canUseVariants(src)) return void 0;
	const candidates = widths.filter((width) => width < ORIGINAL_WIDTH).map((width) => `${variantUrl(src, width)} ${width}w`);
	candidates.push(`${src} ${ORIGINAL_WIDTH}w`);
	return candidates.join(", ");
}
//#endregion
//#region resources/js/components/ResponsiveImage.vue
var _sfc_main$11 = {
	__name: "ResponsiveImage",
	__ssrInlineRender: true,
	props: {
		src: {
			type: String,
			default: ""
		},
		alt: {
			type: String,
			default: ""
		},
		/**
		* CSS `sizes`, e.g. "(max-width: 767px) 50vw, 350px" — how wide the image
		* will paint at each breakpoint, not the file's width. Required rather than
		* defaulted, because a plausible-looking wrong value silently makes the
		* browser pick the wrong file on every viewport.
		*/
		sizes: {
			type: String,
			required: true
		},
		/**
		* The aspect ratio to reserve, as a width/height pair. Without them the
		* page reflows as each image lands, which is what drives the layout-shift
		* score. They describe the shape of the box, not which file is chosen, so a
		* ratio (3 / 4) works as well as real pixel dimensions.
		*/
		width: {
			type: [Number, String],
			required: true
		},
		height: {
			type: [Number, String],
			required: true
		},
		loading: {
			type: String,
			default: "lazy"
		},
		fetchpriority: {
			type: String,
			default: "auto"
		},
		decoding: {
			type: String,
			default: "async"
		},
		imgClass: {
			type: String,
			default: ""
		},
		/** Must match ResponsiveImageService::WIDTHS. */
		widths: {
			type: Array,
			default: () => WIDTHS
		}
	},
	setup(__props) {
		/**
		* An <img> that offers the browser the narrower copies of an image.
		*
		* Images are stored at up to 1400px wide and every card was handed that file
		* however small it paints — the home page was shipping 4MB for a grid of
		* thumbnails, where a phone needs about 30KB each.
		*
		* ResponsiveImageService writes a copy at each width in `widths`, named by
		* convention (/uploads/abc.webp -> /uploads/abc-480.webp), so the srcset is
		* built from the base URL with no extra request. Two things cover the case
		* where a variant is missing anyway — an image added before the backfill ran,
		* or a host serving /uploads straight off disk: routes/images.php writes it on
		* first request, and a candidate that still fails drops the srcset entirely,
		* leaving the original. An unoptimised image is an acceptable outcome; a
		* broken one is not, and a failed srcset candidate does NOT fall back to
		* `src` on its own — the browser just renders a broken image.
		*/
		const props = __props;
		/** Set once a chosen candidate has failed, which drops the srcset. */
		const variantsFailed = (0, vue_exports.ref)(false);
		(0, vue_exports.watch)(() => props.src, () => {
			variantsFailed.value = false;
		});
		const srcset = (0, vue_exports.computed)(() => variantsFailed.value ? void 0 : variantSrcset(props.src, props.widths));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<img${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				src: __props.src,
				srcset: srcset.value,
				sizes: srcset.value ? __props.sizes : void 0,
				alt: __props.alt,
				width: __props.width,
				height: __props.height,
				loading: __props.loading,
				fetchpriority: __props.fetchpriority,
				decoding: __props.decoding,
				class: __props.imgClass
			}, _attrs))}>`);
		};
	}
};
var _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ResponsiveImage.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/Header/NavigationMenu.vue
var _sfc_main$10 = {
	__name: "NavigationMenu",
	__ssrInlineRender: true,
	props: {
		menuItems: Array,
		categories: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		const props = __props;
		const settings = (0, vue_exports.computed)(() => usePage().props.layout?.header ?? {});
		const showCategories = (0, vue_exports.computed)(() => settings.value.show_categories_menu !== false);
		const visibleItems = (0, vue_exports.computed)(() => (props.menuItems ?? []).filter((i) => i.type !== "categories" || showCategories.value));
		/**
		* The categories one dropdown lists.
		*
		* An item with no selection shows every category, which is how the dropdown
		* behaved before it could be narrowed. A selection is shown in the order it
		* was arranged in the admin, not the order the categories happen to load in.
		*/
		const categoriesFor = (item) => {
			const picked = item.categoryIds ?? [];
			if (!picked.length) return props.categories;
			const byId = new Map(props.categories.map((c) => [Number(c.id), c]));
			return picked.map((id) => byId.get(Number(id))).filter(Boolean);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "bg-transparent" }, _attrs))} data-v-87c0e520><div class="w-full mx-auto" data-v-87c0e520><ul class="header-main-menu flex justify-center flex-wrap space-x-8" data-v-87c0e520><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(visibleItems.value, (item) => {
				_push(`<li class="relative group py-3" data-v-87c0e520>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					href: item.url || "/shop",
					target: item.target || "_self",
					class: "text-gray-700 text-nowrap hover:text-theme flex items-center body-2-r transition-colors duration-200"
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`${(0, server_renderer_exports.ssrInterpolate)(item.title)} `);
							if (item.submenu?.length || item.type === "categories" && categoriesFor(item).length) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronDown), { class: "h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" }, null, _parent, _scopeId));
							else _push(`<!---->`);
						} else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(item.title) + " ", 1), item.submenu?.length || item.type === "categories" && categoriesFor(item).length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ChevronDown), {
							key: 0,
							class: "h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200"
						})) : (0, vue_exports.createCommentVNode)("", true)];
					}),
					_: 2
				}, _parent));
				if (item.type === "categories" && categoriesFor(item).length) {
					_push(`<div class="absolute top-full left-0 mt-0 min-w-[14rem] saree-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-50" data-v-87c0e520><ul class="py-1.5" data-v-87c0e520><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(categoriesFor(item), (category) => {
						_push(`<li data-v-87c0e520>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: `/product-category/${category.slug}`,
							class: "saree-dropdown-item"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									if (category.image) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$11, {
										src: category.image,
										alt: category.name,
										width: 32,
										height: 32,
										sizes: "32px",
										"img-class": "saree-dropdown-img"
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(`<span data-v-87c0e520${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(category.name)}</span>`);
								} else return [category.image ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$11, {
									key: 0,
									src: category.image,
									alt: category.name,
									width: 32,
									height: 32,
									sizes: "32px",
									"img-class": "saree-dropdown-img"
								}, null, 8, ["src", "alt"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(category.name), 1)];
							}),
							_: 2
						}, _parent));
						_push(`</li>`);
					});
					_push(`<!--]--></ul></div>`);
				} else _push(`<!---->`);
				if (item.submenu?.length) {
					_push(`<div class="absolute top-full left-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" data-v-87c0e520><ul class="py-2" data-v-87c0e520><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(item.submenu, (subItem) => {
						_push(`<li class="relative group/sub" data-v-87c0e520>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
							href: subItem.url,
							class: "block px-4 py-2 body-1-r text-gray-700 hover:bg-green-50 hover:text-theme flex items-center justify-between"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`${(0, server_renderer_exports.ssrInterpolate)(subItem.title)} `);
									if (subItem.submenu?.length) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronDown), { class: "h-4 w-4 ml-1 -rotate-90 group-hover/sub:rotate-0 transition-transform duration-200" }, null, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(subItem.title) + " ", 1), subItem.submenu?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ChevronDown), {
									key: 0,
									class: "h-4 w-4 ml-1 -rotate-90 group-hover/sub:rotate-0 transition-transform duration-200"
								})) : (0, vue_exports.createCommentVNode)("", true)];
							}),
							_: 2
						}, _parent));
						if (subItem.submenu?.length) {
							_push(`<div class="absolute left-full top-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300" data-v-87c0e520><ul class="py-2" data-v-87c0e520><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(subItem.submenu, (nestedItem) => {
								_push(`<li class="relative group/nested" data-v-87c0e520>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
									href: nestedItem.url,
									class: "block px-4 py-2 body-1-r text-gray-700 hover:bg-green-50 hover:text-theme flex items-center justify-between"
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push(`${(0, server_renderer_exports.ssrInterpolate)(nestedItem.title)} `);
											if (nestedItem.submenu?.length) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ChevronDown), { class: "h-4 w-4 ml-1 -rotate-90 group-hover/nested:rotate-0 transition-transform duration-200" }, null, _parent, _scopeId));
											else _push(`<!---->`);
										} else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(nestedItem.title) + " ", 1), nestedItem.submenu?.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ChevronDown), {
											key: 0,
											class: "h-4 w-4 ml-1 -rotate-90 group-hover/nested:rotate-0 transition-transform duration-200"
										})) : (0, vue_exports.createCommentVNode)("", true)];
									}),
									_: 2
								}, _parent));
								if (nestedItem.submenu?.length) {
									_push(`<div class="absolute left-full top-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-lg opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-300" data-v-87c0e520><ul class="py-2" data-v-87c0e520><!--[-->`);
									(0, server_renderer_exports.ssrRenderList)(nestedItem.submenu, (deepItem) => {
										_push(`<li data-v-87c0e520>`);
										_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
											href: deepItem.url,
											class: "block px-4 py-2 body-1-r text-gray-700 hover:bg-green-50 hover:text-theme"
										}, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(deepItem.title)}`);
												else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(deepItem.title), 1)];
											}),
											_: 2
										}, _parent));
										_push(`</li>`);
									});
									_push(`<!--]--></ul></div>`);
								} else _push(`<!---->`);
								_push(`</li>`);
							});
							_push(`<!--]--></ul></div>`);
						} else _push(`<!---->`);
						_push(`</li>`);
					});
					_push(`<!--]--></ul></div>`);
				} else _push(`<!---->`);
				_push(`</li>`);
			});
			_push(`<!--]--></ul></div></nav>`);
		};
	}
};
var _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/NavigationMenu.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var NavigationMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$10, [["__scopeId", "data-v-87c0e520"]]);
//#endregion
//#region node_modules/@steveyuowo/vue-hot-toast/dist/vue-hot-toast.es.js
var import_pinia_prod = require_pinia_prod();
var j$1 = { class: "VueHotToast__icon" };
var I$1 = { key: 0 };
var S$1 = ["src"];
var B$1 = {
	key: 1,
	class: "VueHotToast__checkmark"
};
var D$1 = {
	key: 2,
	class: "VueHotToast__error"
};
var M$1 = {
	key: 3,
	class: "VueHotToast__loading"
};
var L$1 = { class: "content" };
var N$1 = { class: "content-message" };
var U$1 = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ToasterItem",
	props: {
		id: {},
		type: {},
		message: {},
		autoClose: { type: Boolean },
		duration: {},
		icon: {},
		position: {}
	},
	emits: ["close"],
	setup(t, { emit: e }) {
		const o = t, s = e, n = (0, vue_exports.ref)(null), y = (0, vue_exports.ref)(0), f = (0, vue_exports.ref)(0), d = (0, vue_exports.ref)(!1), _ = () => {
			d.value || (d.value = !0, setTimeout(() => {
				s("close");
			}, 400));
		};
		return (0, vue_exports.watchEffect)(() => {
			o.autoClose && (y.value = Date.now(), f.value = o.duration, n.value = setTimeout(_, f.value));
		}), (r, J) => ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", {
			class: (0, vue_exports.normalizeClass)(["VueHotToast__toast", { leaving: d.value }]),
			style: (0, vue_exports.normalizeStyle)(`--toast-duration: ${r.duration}s;`),
			onClick: (0, vue_exports.withModifiers)(_, ["prevent"])
		}, [(0, vue_exports.createElementVNode)("div", j$1, [r.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", I$1, [(0, vue_exports.createElementVNode)("img", {
			class: "VueHotToast__custom-icon",
			src: r.icon,
			width: 24,
			height: 24,
			alt: "Toast Icon"
		}, null, 8, S$1)])) : r.type === "success" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", B$1)) : r.type === "error" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", D$1)) : r.type === "loading" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", M$1)) : (0, vue_exports.createCommentVNode)("", !0)]), (0, vue_exports.createElementVNode)("div", L$1, [(0, vue_exports.createElementVNode)("div", N$1, (0, vue_exports.toDisplayString)(r.message), 1)])], 6));
	}
});
var $ = {
	type: "info",
	message: "Here's your toast.",
	autoClose: !0,
	duration: 3e3,
	position: "top-center"
};
function z$1() {
	let t = (/* @__PURE__ */ new Date()).getTime();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(o) {
		var s = (t + Math.random() * 16) % 16 | 0;
		return t = Math.floor(t / 16), (o == "x" ? s : s & 3 | 8).toString(16);
	});
}
var a$1 = (0, vue_exports.reactive)({ notifications: [] });
var p$1 = function() {
	const t = (e) => {
		const o = Object.assign({ ...$ }, e), s = z$1();
		return a$1.notifications.unshift({
			id: s,
			...o
		}), s;
	};
	return t.update = (e, o) => {
		const s = a$1.notifications.findIndex((n) => n.id === e);
		if (s === -1) throw t(o), /* @__PURE__ */ new Error("Can't find toast");
		return Object.assign(a$1.notifications[s], o), e;
	}, t._handleOptions = (e, o) => {
		const s = Object.assign(o ?? {}, { type: e });
		return t(s);
	}, t.loading = (e, o) => t._handleOptions("loading", Object.assign(o ?? {}, { message: e })), t.success = (e, o) => t._handleOptions("success", Object.assign(o ?? {}, { message: e })), t.error = (e, o) => t._handleOptions("error", Object.assign(o ?? {}, { message: e })), t.promise = (e, o) => {
		const s = t.loading(o.loading, { position: o.position });
		return e.then((n) => (t.update(s, {
			message: o.success,
			type: "success",
			position: o.position
		}), s)).catch((n) => {
			throw t.update(s, {
				message: o.error,
				type: "error",
				position: o.position
			}), n;
		});
	}, t;
}();
var A$1 = (t) => {
	const e = a$1.notifications.findIndex((o) => o.id === t);
	e !== -1 && a$1.notifications.splice(e, 1);
};
var q = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "Toaster",
	setup(t) {
		const e = (0, vue_exports.computed)(() => a$1.notifications.length > 0 ? a$1.notifications[0].position : "top-center");
		return (o, s) => ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Teleport, { to: "body" }, [(0, vue_exports.createElementVNode)("div", { class: (0, vue_exports.normalizeClass)(["VueHotToast__toast-container", `VueHotToast__${e.value}`]) }, [((0, vue_exports.openBlock)(!0), (0, vue_exports.createElementBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(a$1).notifications, (n) => ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(U$1, {
			key: n.id,
			id: n.id,
			type: n.type,
			message: n.message,
			"auto-close": n.autoClose,
			duration: n.duration,
			icon: n.icon,
			position: n.position,
			onClose: () => {
				(0, vue_exports.unref)(A$1)(n.id);
			}
		}, null, 8, [
			"id",
			"type",
			"message",
			"auto-close",
			"duration",
			"icon",
			"position",
			"onClose"
		]))), 128))], 2)]));
	}
});
//#endregion
//#region resources/js/Store/authStore.js
var useAuthStore = (0, import_pinia_prod.defineStore)("auth", () => {
	const page = usePage();
	const user = (0, vue_exports.computed)(() => page.props.auth?.user || null);
	const isAuthenticated = (0, vue_exports.computed)(() => !!user.value);
	const guestId = (0, vue_exports.ref)(null);
	const initGuestId = () => {
		if (typeof window !== "undefined") {
			const storedId = localStorage.getItem("guest_id");
			if (storedId) guestId.value = storedId;
			else {
				const newId = `guest_${Date.now()}_${Math.floor(Math.random() * 1e4)}`;
				localStorage.setItem("guest_id", newId);
				guestId.value = newId;
			}
		}
	};
	const initAuth = () => {
		if (typeof window !== "undefined") initGuestId();
	};
	const logout = () => {
		router.post("/auth/logout", {}, { onSuccess: () => {
			p$1.success("Logged out successfully");
		} });
	};
	initAuth();
	return {
		user,
		isAuthenticated,
		guestId,
		logout,
		initAuth,
		fetchUserDetails: () => {}
	};
});
//#endregion
//#region resources/js/components/Header/MobileMenu.vue
var _sfc_main$9 = {
	__name: "MobileMenu",
	__ssrInlineRender: true,
	props: {
		menuItems: {
			type: Array,
			required: true
		},
		isMobileMenuOpen: Boolean,
		toggleMobileMenu: Function
	},
	setup(__props) {
		const authStore = useAuthStore();
		const props = __props;
		const logo = (0, vue_exports.ref)("/assets/images/logo/logo.png");
		const openSubmenuIds = (0, vue_exports.ref)(/* @__PURE__ */ new Set());
		const isSubmenuOpen = (id) => openSubmenuIds.value.has(id);
		const userName = (0, vue_exports.computed)(() => authStore.user?.name || "");
		const userInitial = (0, vue_exports.computed)(() => userName.value ? userName.value.charAt(0).toUpperCase() : "U");
		(0, vue_exports.watch)(() => props.isMobileMenuOpen, (open) => {
			if (typeof document === "undefined") return;
			document.body.style.overflow = open ? "hidden" : "";
		});
		const ICONS = {
			blog: I$2,
			track: I$3,
			refund: G$4,
			privacy: G$1,
			contact: I$6
		};
		const quickLinks = (0, vue_exports.computed)(() => (usePage().props.layout?.header?.mobile_links ?? []).map((link) => ({
			label: link.label,
			href: link.url,
			icon: ICONS[link.icon] ?? I$6
		})));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)} data-v-f8aab673><div class="mm-backdrop" style="${(0, server_renderer_exports.ssrRenderStyle)(__props.isMobileMenuOpen ? null : { display: "none" })}" data-v-f8aab673></div><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-drawer--open": __props.isMobileMenuOpen }, "mm-drawer"])}" data-v-f8aab673><div class="mm-header" data-v-f8aab673><img${(0, server_renderer_exports.ssrRenderAttr)("src", logo.value)} alt="Logo" class="w-[116px]" loading="lazy" data-v-f8aab673><button class="mm-close" aria-label="Close menu" data-v-f8aab673>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(F$1), {
				size: 18,
				weight: "bold"
			}, null, _parent));
			_push(`</button></div><div class="mm-body" data-v-f8aab673><div class="mm-account" data-v-f8aab673>`);
			if ((0, vue_exports.unref)(authStore).isAuthenticated) {
				_push(`<!--[-->`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					href: "/account",
					class: "mm-account-main",
					onClick: __props.toggleMobileMenu
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="mm-avatar" data-v-f8aab673${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(userInitial.value)}</span><span class="min-w-0" data-v-f8aab673${_scopeId}><span class="mm-account-name" data-v-f8aab673${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(userName.value)}</span><span class="mm-account-sub" data-v-f8aab673${_scopeId}>View my account</span></span>`);
						else return [(0, vue_exports.createVNode)("span", { class: "mm-avatar" }, (0, vue_exports.toDisplayString)(userInitial.value), 1), (0, vue_exports.createVNode)("span", { class: "min-w-0" }, [(0, vue_exports.createVNode)("span", { class: "mm-account-name" }, (0, vue_exports.toDisplayString)(userName.value), 1), (0, vue_exports.createVNode)("span", { class: "mm-account-sub" }, "View my account")])];
					}),
					_: 1
				}, _parent));
				_push(`<button class="mm-logout" aria-label="Log out" data-v-f8aab673>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(F$2), { size: 18 }, null, _parent));
				_push(`</button><!--]-->`);
			} else {
				_push(`<!--[--><div class="mm-account-greeting" data-v-f8aab673><span class="mm-account-name" data-v-f8aab673>Welcome</span><span class="mm-account-sub" data-v-f8aab673> Log in for faster checkout </span></div><div class="mm-auth-actions" data-v-f8aab673>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					href: "/login",
					class: "mm-btn mm-btn--solid",
					onClick: __props.toggleMobileMenu
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Log in `);
						else return [(0, vue_exports.createTextVNode)(" Log in ")];
					}),
					_: 1
				}, _parent));
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					href: "/register",
					class: "mm-btn mm-btn--ghost",
					onClick: __props.toggleMobileMenu
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Sign up `);
						else return [(0, vue_exports.createTextVNode)(" Sign up ")];
					}),
					_: 1
				}, _parent));
				_push(`</div><!--]-->`);
			}
			_push(`</div><p class="mm-section-label" data-v-f8aab673>Shop</p><ul class="mm-list" data-v-f8aab673><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(props.menuItems, (item) => {
				_push(`<li data-v-f8aab673><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-row--open": isSubmenuOpen(item.id) }, "mm-row"])}" data-v-f8aab673><a${(0, server_renderer_exports.ssrRenderAttr)("href", item.url)} class="mm-row-link" data-v-f8aab673>${(0, server_renderer_exports.ssrInterpolate)(item.title)}</a>`);
				if (item.submenu?.length) {
					_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-caret--open": isSubmenuOpen(item.id) }, "mm-caret"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", isSubmenuOpen(item.id))}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", `Toggle ${item.title} submenu`)} data-v-f8aab673>`);
					_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(G$3), {
						size: 14,
						weight: "bold"
					}, null, _parent));
					_push(`</button>`);
				} else _push(`<!---->`);
				_push(`</div>`);
				if (item.submenu?.length) {
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-sub--open": isSubmenuOpen(item.id) }, "mm-sub"])}" data-v-f8aab673><ul class="mm-sub-inner" data-v-f8aab673><!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(item.submenu, (subItem) => {
						_push(`<li data-v-f8aab673><div class="mm-row mm-row--sub" data-v-f8aab673><a${(0, server_renderer_exports.ssrRenderAttr)("href", subItem.url)} class="mm-row-link" data-v-f8aab673>${(0, server_renderer_exports.ssrInterpolate)(subItem.title)}</a>`);
						if (subItem.submenu?.length) {
							_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-caret--open": isSubmenuOpen(subItem.id) }, "mm-caret"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", isSubmenuOpen(subItem.id))} data-v-f8aab673>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(G$3), {
								size: 12,
								weight: "bold"
							}, null, _parent));
							_push(`</button>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if (subItem.submenu?.length) {
							_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-sub--open": isSubmenuOpen(subItem.id) }, "mm-sub"])}" data-v-f8aab673><ul class="mm-sub-inner" data-v-f8aab673><!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(subItem.submenu, (thirdItem) => {
								_push(`<li data-v-f8aab673><div class="mm-row mm-row--sub" data-v-f8aab673><a${(0, server_renderer_exports.ssrRenderAttr)("href", thirdItem.url)} class="mm-row-link" data-v-f8aab673>${(0, server_renderer_exports.ssrInterpolate)(thirdItem.title)}</a>`);
								if (thirdItem.submenu?.length) {
									_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-caret--open": isSubmenuOpen(thirdItem.id) }, "mm-caret"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-expanded", isSubmenuOpen(thirdItem.id))} data-v-f8aab673>`);
									_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(G$3), {
										size: 12,
										weight: "bold"
									}, null, _parent));
									_push(`</button>`);
								} else _push(`<!---->`);
								_push(`</div>`);
								if (thirdItem.submenu?.length) {
									_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{ "mm-sub--open": isSubmenuOpen(thirdItem.id) }, "mm-sub"])}" data-v-f8aab673><ul class="mm-sub-inner" data-v-f8aab673><!--[-->`);
									(0, server_renderer_exports.ssrRenderList)(thirdItem.submenu, (fourthItem) => {
										_push(`<li data-v-f8aab673><a${(0, server_renderer_exports.ssrRenderAttr)("href", fourthItem.url)} class="mm-row mm-row--sub mm-row-link" data-v-f8aab673>${(0, server_renderer_exports.ssrInterpolate)(fourthItem.title)}</a></li>`);
									});
									_push(`<!--]--></ul></div>`);
								} else _push(`<!---->`);
								_push(`</li>`);
							});
							_push(`<!--]--></ul></div>`);
						} else _push(`<!---->`);
						_push(`</li>`);
					});
					_push(`<!--]--></ul></div>`);
				} else _push(`<!---->`);
				_push(`</li>`);
			});
			_push(`<!--]--></ul><p class="mm-section-label" data-v-f8aab673>Help &amp; Support</p><div class="mm-card" data-v-f8aab673><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(quickLinks.value, (link) => {
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					key: link.href,
					href: link.href,
					class: "mm-quick",
					onClick: __props.toggleMobileMenu
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<span class="mm-quick-icon" data-v-f8aab673${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(link.icon), { size: 17 }, null), _parent, _scopeId);
							_push(`</span><span class="mm-quick-label" data-v-f8aab673${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(link.label)}</span>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(G$3), {
								size: 13,
								class: "mm-quick-caret"
							}, null, _parent, _scopeId));
						} else return [
							(0, vue_exports.createVNode)("span", { class: "mm-quick-icon" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(link.icon), { size: 17 }))]),
							(0, vue_exports.createVNode)("span", { class: "mm-quick-label" }, (0, vue_exports.toDisplayString)(link.label), 1),
							(0, vue_exports.createVNode)((0, vue_exports.unref)(G$3), {
								size: 13,
								class: "mm-quick-caret"
							})
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]-->`);
			if ((0, vue_exports.unref)(authStore).isAuthenticated) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
				href: "/account/wishlist",
				class: "mm-quick",
				onClick: __props.toggleMobileMenu
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<span class="mm-quick-icon" data-v-f8aab673${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(I$5), { size: 17 }, null, _parent, _scopeId));
						_push(`</span><span class="mm-quick-label" data-v-f8aab673${_scopeId}>My Wishlist</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(G$3), {
							size: 13,
							class: "mm-quick-caret"
						}, null, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)("span", { class: "mm-quick-icon" }, [(0, vue_exports.createVNode)((0, vue_exports.unref)(I$5), { size: 17 })]),
						(0, vue_exports.createVNode)("span", { class: "mm-quick-label" }, "My Wishlist"),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(G$3), {
							size: 13,
							class: "mm-quick-caret"
						})
					];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			_push(`</div><p class="mm-footnote" data-v-f8aab673>চারুকথন — ঐতিহ্যের গল্প</p></div></div></nav>`);
		};
	}
};
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/MobileMenu.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var MobileMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["__scopeId", "data-v-f8aab673"]]);
var STOCK_PREORDER = "preorder";
/** Whether this product is taking pre-orders. */
function isPreOrder(product) {
	if (!product) return false;
	if (typeof product.is_preorder === "boolean") return product.is_preorder;
	return product.stock_status === STOCK_PREORDER;
}
/** Whether stock is on hand right now. Pre-orders are not. */
function isInStock(product) {
	if (!product) return false;
	if (typeof product.in_stock === "boolean") return product.in_stock;
	if (product.stock_status === "instock") return true;
	if (product.stock_status === "outofstock" || product.stock_status === "preorder") return false;
	if (!("stock_status" in product)) return true;
	if (product.quantity === void 0 || product.quantity === null) return true;
	return Number(product.quantity) > 0;
}
/**
* Whether an order may be placed — what a buy button should ask.
*
* Note this is NOT the opposite of isOutOfStock: a pre-order is neither in
* stock nor out of it.
*/
function isPurchasable(product) {
	if (!product) return false;
	if (typeof product.purchasable === "boolean") return product.purchasable;
	return isPreOrder(product) || isInStock(product);
}
/** Nothing on the shelf and nothing on order: the product cannot be bought. */
function isOutOfStock(product) {
	if (!product) return true;
	return !isPurchasable(product);
}
/** The note the shop wrote about when pre-ordered stock is expected. */
function preOrderNote(product) {
	return String(product?.preorder_note ?? "").trim() || "";
}
/**
* Whether the chosen combination of options cannot be sold.
*
* A product can be in stock overall while one of its variants is not — the
* quantity is held per option row. Only asked of products that actually count
* stock: for "in stock" and "pre-order" the per-row quantity is noise, the same
* way it is on the product itself.
*
* @param product        the product being bought
* @param attributeRows  the product_attributes rows the selection resolves to
*/
function isVariantOutOfStock(product, attributeRows) {
	if (!product || !Array.isArray(attributeRows) || attributeRows.length === 0) return false;
	if (!![
		"instock",
		"outofstock",
		"preorder"
	].includes(product.stock_status)) return false;
	return attributeRows.some((row) => row && (row.status === "disable" || Number(row.quantity ?? 0) <= 0));
}
//#endregion
//#region resources/js/Store/cartStore.js
var useCartStore = (0, import_pinia_prod.defineStore)("cartStore", () => {
	const page = usePage();
	const authStore = useAuthStore();
	const isCartOpen = (0, vue_exports.ref)(false);
	const is_direct_order = (0, vue_exports.ref)(false);
	if (typeof window !== "undefined") is_direct_order.value = localStorage.getItem("is_direct_order") === "true";
	const cartItems = (0, vue_exports.computed)(() => page.props.cartItems || []);
	const cartCount = (0, vue_exports.computed)(() => page.props.cartCount || 0);
	const getGuestId = () => {
		if (typeof window === "undefined") return null;
		let guestId = localStorage.getItem("guest_id");
		if (!guestId) {
			guestId = `guest_${Date.now()}`;
			localStorage.setItem("guest_id", guestId);
		}
		return guestId;
	};
	const withGuestId = (data = {}) => ({
		...data,
		guest_id: authStore.user ? void 0 : getGuestId()
	});
	const setOrderType = (direct) => {
		is_direct_order.value = direct;
		if (typeof window !== "undefined") localStorage.setItem("is_direct_order", direct.toString());
	};
	const toggleCart = () => {
		isCartOpen.value = !isCartOpen.value;
	};
	const goToCheckout = () => {
		if (unavailableItems.value.length > 0) {
			const names = unavailableItems.value.map((item) => item.product?.product_name).filter(Boolean).join(", ");
			p$1.error(names ? `${names} is currently out of stock. Please remove it to continue.` : "An item in your cart is currently out of stock.");
			return;
		}
		setOrderType(false);
		isCartOpen.value = false;
		router.get("/checkout");
	};
	const cartOrder = () => setOrderType(false);
	const directOrder = () => setOrderType(true);
	const cartTotalPrice = (0, vue_exports.computed)(() => cartItems.value.reduce((t, item) => t + (item?.individual_price || 0) * item.quantity, 0).toFixed(2));
	const hasPreOrderItems = (0, vue_exports.computed)(() => cartItems.value.some((item) => item.product && isPreOrder(item.product)));
	/** Lines that can no longer be bought, so checkout can say which. */
	const unavailableItems = (0, vue_exports.computed)(() => cartItems.value.filter((item) => item.product && isOutOfStock(item.product)));
	const subtotal = (0, vue_exports.computed)(() => cartItems.value.reduce((t, item) => t + (item?.individual_price || 0) * item.quantity, 0));
	const total = (0, vue_exports.computed)(() => subtotal.value);
	const user_id = (0, vue_exports.computed)(() => authStore.user?.id ?? getGuestId());
	const incomplete_order_id = (0, vue_exports.ref)(0);
	/**
	* Add a line to the cart, refusing anything that is not for sale.
	*
	* The guard lives here rather than in each card and button: there are five
	* places that add to a cart, and one of them forgetting is a customer
	* ordering something the shop cannot ship. The server refuses it too — this
	* is what makes the refusal immediate and legible.
	*
	* @param cartData  what to add
	* @param product   the product being added, when the caller has it
	* @returns whether the request was sent
	*/
	const addToCart = (cartData, product = null) => {
		if (product && isOutOfStock(product)) {
			p$1.error("This product is currently out of stock.");
			return false;
		}
		router.post("/cart/add", withGuestId(cartData), {
			preserveScroll: true,
			onSuccess: () => {
				if (typeof window !== "undefined" && window.innerWidth > 768) isCartOpen.value = true;
				cartOrder();
			},
			onError: (errors) => {
				p$1.error(Object.values(errors)[0] || "Failed to add to cart.");
			}
		});
		return true;
	};
	const removeItem = (cartId) => {
		router.post("/cart/remove", withGuestId({ cart_id: cartId }), {
			preserveScroll: true,
			onError: () => p$1.error("Failed to remove item")
		});
	};
	const clearCart = () => {
		router.post("/cart/clear", withGuestId(), {
			preserveScroll: true,
			onError: () => p$1.error("Failed to clear cart")
		});
	};
	const fetchCartItems = () => {};
	const updateCartItemQuantity = (cartId, quantityArg, attributeValues = [], isRealCartItem = true) => {
		if (isRealCartItem) {
			router.post("/cart/update", withGuestId({
				cart_id: cartId,
				quantity: quantityArg,
				attribute_values: attributeValues
			}), {
				preserveScroll: true,
				preserveState: true,
				onError: (errors) => {
					p$1.error(Object.values(errors)[0] || "Failed to update quantity.");
				}
			});
			return;
		}
		if (typeof window !== "undefined") {
			const data = JSON.parse(localStorage.getItem("directOrderProductData"));
			if (data && data.product_id === cartId) {
				data.quantity = quantityArg;
				localStorage.setItem("directOrderProductData", JSON.stringify(data));
			}
		}
	};
	(0, vue_exports.watch)(() => page.url, () => {
		isCartOpen.value = false;
	});
	return {
		cartItems,
		cartCount,
		cartTotalPrice,
		hasPreOrderItems,
		unavailableItems,
		subtotal,
		total,
		user_id,
		incomplete_order_id,
		isCartOpen,
		is_direct_order,
		toggleCart,
		goToCheckout,
		setOrderType,
		cartOrder,
		directOrder,
		addToCart,
		removeItem,
		clearCart,
		fetchCartItems,
		updateCartItemQuantity,
		getGuestId,
		withGuestId
	};
});
//#endregion
//#region resources/js/components/Header/CartSidebar.vue
var _sfc_main$8 = {
	__name: "CartSidebar",
	__ssrInlineRender: true,
	setup(__props) {
		const emptyCartIcon = (0, vue_exports.ref)("/assets/images/icons/empty-cart.png");
		const cartStore = useCartStore();
		(0, vue_exports.onMounted)(() => {
			cartStore.fetchCartItems();
		});
		const cartItems = (0, vue_exports.computed)(() => cartStore.cartItems);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)} data-v-f07ab7af>`);
			if ((0, vue_exports.unref)(cartStore).isCartOpen) _push(`<div class="fixed inset-0 bg-black/50 z-40 transition-opacity" data-v-f07ab7af></div>`);
			else _push(`<!---->`);
			_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([{
				"translate-x-0": (0, vue_exports.unref)(cartStore).isCartOpen,
				"translate-x-full": !(0, vue_exports.unref)(cartStore).isCartOpen
			}, "fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col"])}" data-v-f07ab7af><div class="cart-header" data-v-f07ab7af><h2 class="cart-header-title" data-v-f07ab7af> আপনার কার্ট (${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(cartStore).cartCount)}) </h2><div class="flex items-center gap-4" data-v-f07ab7af>`);
			if (cartItems.value.length > 0) _push(`<button class="body-1-r text-gray-500 hover:text-red-500 transition-colors underline" data-v-f07ab7af> সব মুছুন </button>`);
			else _push(`<!---->`);
			_push(`<button class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors" data-v-f07ab7af><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-f07ab7af><path d="M18 6L6 18" data-v-f07ab7af></path><path d="M6 6l12 12" data-v-f07ab7af></path></svg></button></div></div><div class="flex-1 overflow-y-auto px-4 py-2" data-v-f07ab7af>`);
			if (cartItems.value.length === 0) _push(`<div class="flex flex-col items-center justify-center h-full text-center text-gray-500" data-v-f07ab7af><img${(0, server_renderer_exports.ssrRenderAttr)("src", emptyCartIcon.value)} alt="Empty Cart" class="w-[160px] mb-4 opacity-70" data-v-f07ab7af><p class="body-2-r" data-v-f07ab7af>আপনার কার্ট খালি</p></div>`);
			else {
				_push(`<div class="space-y-0" data-v-f07ab7af><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(cartItems.value, (item) => {
					_push(`<div class="cart-item" data-v-f07ab7af><div class="flex gap-3" data-v-f07ab7af><div class="w-[72px] h-[90px] rounded-xl overflow-hidden bg-gray-100 shrink-0" data-v-f07ab7af><img${(0, server_renderer_exports.ssrRenderAttr)("src", item.product.featured_image)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.product.product_name)} class="w-full h-full object-cover" fetchpriority="low" data-v-f07ab7af></div><div class="flex-1 min-w-0" data-v-f07ab7af><div class="flex items-start justify-between gap-2" data-v-f07ab7af><h3 class="body-1-sb text-gray-800 line-clamp-2 leading-snug" data-v-f07ab7af>${(0, server_renderer_exports.ssrInterpolate)(item.product.product_name)} `);
					if (item.attributes?.length) {
						_push(`<!--[--> (<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(item.attributes, (attribute, i) => {
							_push(`<span data-v-f07ab7af>${(0, server_renderer_exports.ssrInterpolate)(attribute.attribute_option)}`);
							if (i < item.attributes.length - 1) _push(`<span data-v-f07ab7af>, </span>`);
							else _push(`<!---->`);
							_push(`</span>`);
						});
						_push(`<!--]-->) <!--]-->`);
					} else _push(`<!---->`);
					_push(`</h3><button class="text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5" data-v-f07ab7af><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-f07ab7af><polyline points="3 6 5 6 21 6" data-v-f07ab7af></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-f07ab7af></path></svg></button></div><p class="body-1-r mt-1" data-v-f07ab7af>`);
					if (item.regular_individual_price) _push(`<span class="text-gray-400 line-through mr-1.5" data-v-f07ab7af>${(0, server_renderer_exports.ssrInterpolate)(item.regular_individual_price)} <span class="bangla-font" data-v-f07ab7af>৳</span></span>`);
					else _push(`<!---->`);
					_push(`<span class="text-[#356019]" data-v-f07ab7af>${(0, server_renderer_exports.ssrInterpolate)(item.individual_price)} <span class="bangla-font" data-v-f07ab7af>৳</span></span></p><div class="cart-badges" data-v-f07ab7af>`);
					if (item.blouse_choice) _push(`<span class="${(0, server_renderer_exports.ssrRenderClass)([item.blouse_choice === "with" ? "cart-badge--with" : "cart-badge--without", "cart-badge"])}" data-v-f07ab7af>${(0, server_renderer_exports.ssrInterpolate)(item.blouse_choice === "with" ? "With Blouse" : "Without Blouse")}</span>`);
					else _push(`<!---->`);
					if ((0, vue_exports.unref)(isPreOrder)(item.product)) _push(`<span class="cart-badge cart-badge--preorder" data-v-f07ab7af> Pre Order </span>`);
					else if ((0, vue_exports.unref)(isOutOfStock)(item.product)) _push(`<span class="cart-badge cart-badge--soldout" data-v-f07ab7af> Out of Stock </span>`);
					else _push(`<!---->`);
					_push(`</div><div class="flex items-center gap-0 mt-2" data-v-f07ab7af><button class="qty-btn rounded-l-lg" data-v-f07ab7af> — </button><span class="qty-value" data-v-f07ab7af>${(0, server_renderer_exports.ssrInterpolate)(item.quantity)}</span><button class="qty-btn rounded-r-lg" data-v-f07ab7af> + </button></div></div></div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
			if (cartItems.value.length > 0) _push(`<div class="cart-footer" data-v-f07ab7af><div class="flex justify-between items-center mb-4" data-v-f07ab7af><span class="body-2-sb text-gray-900" data-v-f07ab7af>মোট মূল্য</span><span class="body-2-sb text-gray-900" data-v-f07ab7af>৳${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(cartStore).cartTotalPrice)}</span></div><button class="checkout-btn" data-v-f07ab7af> চেকআউট করুন </button></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/CartSidebar.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var CartSidebar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$8, [["__scopeId", "data-v-f07ab7af"]]);
//#endregion
//#region resources/js/components/Icons/UserIcon.vue
var _sfc_main$7 = {
	__name: "UserIcon",
	__ssrInlineRender: true,
	props: { size: {
		type: [Number, String],
		default: 26
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				width: __props.size,
				height: __props.size,
				viewBox: "0 0 36 36",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg"
			}, _attrs))}><path d="M18 7.84668C11.84 7.84668 6.84668 12.84 6.84668 19C6.84668 25.16 11.84 30.1533 18 30.1533C24.16 30.1533 29.1533 25.16 29.1533 19C29.1533 12.84 24.16 7.84668 18 7.84668Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.37939 26.078C9.37939 26.078 11.8655 22.9038 17.9998 22.9038C24.1341 22.9038 26.6213 26.078 26.6213 26.078M17.9998 19.0001C18.8872 19.0001 19.7383 18.6476 20.3658 18.0201C20.9933 17.3926 21.3458 16.5415 21.3458 15.6541C21.3458 14.7667 20.9933 13.9156 20.3658 13.2881C19.7383 12.6606 18.8872 12.3081 17.9998 12.3081C17.1124 12.3081 16.2613 12.6606 15.6338 13.2881C15.0063 13.9156 14.6538 14.7667 14.6538 15.6541C14.6538 16.5415 15.0063 17.3926 15.6338 18.0201C16.2613 18.6476 17.1124 19.0001 17.9998 19.0001Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Icons/UserIcon.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/Icons/HeartIcon.vue
var _sfc_main$6 = {
	__name: "HeartIcon",
	__ssrInlineRender: true,
	props: {
		size: {
			type: [Number, String],
			default: 24
		},
		filled: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				width: __props.size,
				height: __props.size,
				viewBox: "0 0 24 23",
				fill: __props.filled ? "currentColor" : "none",
				xmlns: "http://www.w3.org/2000/svg"
			}, _attrs))}><path d="M6.58203 0.75C8.64837 0.750017 10.3099 1.98139 11.3457 3.98047L12.0176 5.27734L12.6797 3.97461C13.6912 1.98434 15.3917 0.750982 17.4189 0.750977C20.7689 0.750977 23.25 3.39079 23.25 7.26855C23.2499 10.1634 21.8002 13.0105 19.708 15.5645C17.6256 18.1064 14.9698 20.2791 12.7061 21.8115C12.4861 21.9567 12.347 22.061 12.1768 22.1631C12.1228 22.1954 12.0793 22.216 12.0469 22.2314C12.0025 22.2132 11.9438 22.1869 11.8711 22.1475C11.6966 22.0527 11.5181 21.937 11.3164 21.8115C9.05226 20.2788 6.39073 18.1054 4.30273 15.5635C2.20477 13.0094 0.750107 10.1629 0.75 7.26953C0.75 3.39156 3.25318 0.75 6.58203 0.75Z" stroke="currentColor" stroke-width="1.5"></path></svg>`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Icons/HeartIcon.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region resources/js/Store/homeStore.js
var useHomeStore = (0, import_pinia_prod.defineStore)("homeStore", () => {
	const page = usePage();
	const products = (0, vue_exports.computed)(() => page.props.products || []);
	const featureProducts = (0, vue_exports.computed)(() => page.props.featureProducts || []);
	const categories = (0, vue_exports.computed)(() => page.props.categories || []);
	const sliders = (0, vue_exports.computed)(() => page.props.sliders || []);
	const campaigns = (0, vue_exports.computed)(() => page.props.campaigns || []);
	const siteinfos = (0, vue_exports.computed)(() => {
		const info = page.props.storeInfo;
		return info ? [info] : [];
	});
	const categoryByproducts = (0, vue_exports.ref)([]);
	const categoryName = (0, vue_exports.ref)("");
	const isFetched = (0, vue_exports.ref)(true);
	const isCategoryFetched = (0, vue_exports.ref)(false);
	const logo = (0, vue_exports.computed)(() => page.props.storeInfo?.media?.[0]?.logo || "");
	const favicon = (0, vue_exports.computed)(() => page.props.storeInfo?.media?.[0]?.favicon || "");
	const marketing = (0, vue_exports.computed)(() => page.props.storeInfo?.marketing || []);
	const fetchData = () => {};
	const fetchCatByProduct = () => {};
	return {
		products,
		featureProducts,
		categories,
		sliders,
		campaigns,
		categoryByproducts,
		categoryName,
		fetchData,
		siteinfos,
		fetchCatByProduct,
		isFetched,
		isCategoryFetched,
		logo,
		favicon,
		marketing
	};
});
(0, vue_exports.reactive)({ isLoading: false });
var axiosInstance = axios.create({
	baseURL: "/api/v1",
	withCredentials: true,
	withXSRFToken: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		"X-Requested-With": "XMLHttpRequest"
	}
});
axiosInstance.interceptors.response.use((response) => response, (error) => {
	if (error.response?.status === 401) window.location.href = "/login";
	return Promise.reject(error);
});
//#endregion
//#region resources/js/Store/authPromptStore.js
/**
* Controls the global "please log in" popup shown when a guest tries to
* perform an action that requires an account (e.g. saving to the wishlist).
*/
var useAuthPromptStore = (0, import_pinia_prod.defineStore)("authPrompt", () => {
	const isOpen = (0, vue_exports.ref)(false);
	const message = (0, vue_exports.ref)("Please log in to continue.");
	const open = (msg = "Please log in to continue.") => {
		message.value = msg;
		isOpen.value = true;
	};
	const close = () => {
		isOpen.value = false;
	};
	return {
		isOpen,
		message,
		open,
		close
	};
});
//#endregion
//#region resources/js/Store/wishlistStore.js
var GUEST_KEY = "guest_wishlist";
var NUDGE_KEY = "wishlist_nudge_shown";
var useWishlistStore = (0, import_pinia_prod.defineStore)("wishlist", () => {
	const page = usePage();
	const authStore = useAuthStore();
	const authPrompt = useAuthPromptStore();
	const ids = (0, vue_exports.ref)(/* @__PURE__ */ new Set());
	const pending = (0, vue_exports.ref)(/* @__PURE__ */ new Set());
	const resolveId = (product) => Number(product && typeof product === "object" ? product.id : product);
	const readGuestIds = () => {
		if (typeof window === "undefined") return [];
		try {
			const raw = localStorage.getItem(GUEST_KEY);
			const arr = raw ? JSON.parse(raw) : [];
			return Array.isArray(arr) ? arr.map(Number) : [];
		} catch (e) {
			return [];
		}
	};
	const writeGuestIds = (set) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(GUEST_KEY, JSON.stringify([...set]));
		} catch (e) {}
	};
	const clearGuestIds = () => {
		if (typeof window === "undefined") return;
		try {
			localStorage.removeItem(GUEST_KEY);
		} catch (e) {}
	};
	const syncFromSource = () => {
		if (authStore.isAuthenticated) ids.value = new Set((page.props.wishlistIds || []).map(Number));
		else ids.value = new Set(readGuestIds());
	};
	syncFromSource();
	(0, vue_exports.watch)(() => page.props.wishlistIds, syncFromSource);
	(0, vue_exports.watch)(() => authStore.isAuthenticated, () => {
		syncFromSource();
		if (authStore.isAuthenticated) mergeGuestWishlist();
	});
	const count = (0, vue_exports.computed)(() => ids.value.size);
	const isWishlisted = (product) => ids.value.has(resolveId(product));
	const isPending = (product) => pending.value.has(resolveId(product));
	const maybeNudge = () => {
		if (typeof window !== "undefined") try {
			if (sessionStorage.getItem(NUDGE_KEY)) return;
			sessionStorage.setItem(NUDGE_KEY, "1");
		} catch (e) {}
		authPrompt.open("Log in to save your wishlist permanently and access it on any device.");
	};
	const toggle = async (product) => {
		const productId = resolveId(product);
		if (!productId) return;
		if (!authStore.isAuthenticated) {
			const next = new Set(ids.value);
			const wasIn = next.has(productId);
			wasIn ? next.delete(productId) : next.add(productId);
			ids.value = next;
			writeGuestIds(next);
			if (!wasIn) maybeNudge();
			return;
		}
		if (pending.value.has(productId)) return;
		pending.value = new Set(pending.value).add(productId);
		const wasWishlisted = ids.value.has(productId);
		const next = new Set(ids.value);
		wasWishlisted ? next.delete(productId) : next.add(productId);
		ids.value = next;
		try {
			if (wasWishlisted) {
				await axiosInstance.post(`/remove/from/wishlist/${productId}`);
				p$1.success("Removed from wishlist");
			} else {
				await axiosInstance.post(`/add/to/wishlist/${productId}`);
				p$1.success("Added to wishlist");
			}
		} catch (e) {
			const revert = new Set(ids.value);
			wasWishlisted ? revert.add(productId) : revert.delete(productId);
			ids.value = revert;
			if (e?.response?.status !== 401) p$1.error("Could not update wishlist. Please try again.");
		} finally {
			const done = new Set(pending.value);
			done.delete(productId);
			pending.value = done;
		}
	};
	const mergeGuestWishlist = async () => {
		if (!authStore.isAuthenticated) return;
		const guestIds = readGuestIds();
		if (!guestIds.length) return;
		clearGuestIds();
		ids.value = /* @__PURE__ */ new Set([...ids.value, ...guestIds]);
		await Promise.allSettled(guestIds.map((id) => axiosInstance.post(`/add/to/wishlist/${id}`)));
		router.reload({ only: ["wishlistIds"] });
	};
	if (authStore.isAuthenticated) mergeGuestWishlist();
	return {
		ids,
		count,
		isWishlisted,
		isPending,
		toggle,
		mergeGuestWishlist
	};
});
//#endregion
//#region resources/js/components/Header/Header.vue
var MIN_QUERY = 2;
var _sfc_main$5 = {
	__name: "Header",
	__ssrInlineRender: true,
	setup(__props) {
		const cartStore = useCartStore();
		const authStore = useAuthStore();
		const homeStore = useHomeStore();
		const wishlistStore = useWishlistStore();
		useAuthPromptStore();
		const userInitial = (0, vue_exports.computed)(() => {
			const name = authStore.user?.name || "";
			return name ? name.charAt(0).toUpperCase() : "U";
		});
		const globalCategories = (0, vue_exports.computed)(() => usePage().props.globalCategories);
		const categories = (0, vue_exports.computed)(() => globalCategories.value?.categories || []);
		(0, vue_exports.computed)(() => globalCategories.value.colors || []);
		const layout = (0, vue_exports.computed)(() => usePage().props.layout ?? {});
		const headerSettings = (0, vue_exports.computed)(() => layout.value.header ?? {});
		const menuItems = (0, vue_exports.computed)(() => {
			const items = layout.value.menu ?? [];
			if (!items.length) return [{
				id: 1,
				title: "Our Story",
				url: "/about-us",
				submenu: []
			}, {
				id: 2,
				title: "Contact Us",
				url: "/contact-us",
				submenu: []
			}];
			const toSubmenu = (list) => (list ?? []).map((entry) => ({
				id: entry.id,
				type: entry.type,
				categoryIds: entry.category_ids ?? [],
				title: entry.label,
				url: entry.url,
				target: entry.target,
				submenu: toSubmenu(entry.children)
			}));
			return toSubmenu(items);
		});
		const isMobileMenuOpen = (0, vue_exports.ref)(false);
		const toggleMobileMenu = () => {
			isMobileMenuOpen.value = !isMobileMenuOpen.value;
			if (isMobileMenuOpen.value) document.body.style.overflow = "hidden";
			else document.body.style.overflow = "";
		};
		const isOpen = (0, vue_exports.ref)(false);
		const searchQuery = (0, vue_exports.ref)("");
		const searchInput = (0, vue_exports.ref)(null);
		const showDropdown = (0, vue_exports.ref)(false);
		const isLoading = (0, vue_exports.ref)(false);
		const filteredProducts = (0, vue_exports.ref)([]);
		const totalResults = (0, vue_exports.ref)(0);
		const searchError = (0, vue_exports.ref)(false);
		let searchTimer = null;
		let searchToken = 0;
		async function runSearch(term) {
			const token = ++searchToken;
			if (term.trim().length < MIN_QUERY) {
				filteredProducts.value = [];
				totalResults.value = 0;
				isLoading.value = false;
				searchError.value = false;
				return;
			}
			isLoading.value = true;
			searchError.value = false;
			try {
				const { data } = await axios.get("/search/products", { params: { q: term } });
				if (token !== searchToken) return;
				filteredProducts.value = data.results ?? [];
				totalResults.value = data.total ?? 0;
			} catch {
				if (token !== searchToken) return;
				filteredProducts.value = [];
				totalResults.value = 0;
				searchError.value = true;
			} finally {
				if (token === searchToken) isLoading.value = false;
			}
		}
		const onSearchInputChange = () => {
			showDropdown.value = searchQuery.value.length > 0;
			clearTimeout(searchTimer);
			searchTimer = setTimeout(() => runSearch(searchQuery.value), 250);
		};
		/** Whether to tell the visitor their search found nothing. */
		const showNoResults = (0, vue_exports.computed)(() => !isLoading.value && !searchError.value && searchQuery.value.trim().length >= MIN_QUERY && filteredProducts.value.length === 0);
		/** How many more matches exist than the ones listed. */
		const moreResults = (0, vue_exports.computed)(() => Math.max(0, totalResults.value - filteredProducts.value.length));
		function submitSearch() {
			const term = searchQuery.value.trim();
			if (!term) return;
			closeSearch();
			router.visit(`/shop?name=${encodeURIComponent(term)}`);
		}
		const handleClickOutside = (event) => {
			if (searchInput.value && !searchInput.value.contains(event.target)) showDropdown.value = false;
		};
		(0, vue_exports.onMounted)(() => {
			document.addEventListener("click", handleClickOutside);
		});
		(0, vue_exports.onUnmounted)(() => {
			document.removeEventListener("click", handleClickOutside);
		});
		const closeSearch = () => {
			isOpen.value = false;
			searchQuery.value = "";
			filteredProducts.value = [];
			totalResults.value = 0;
			showDropdown.value = false;
			clearTimeout(searchTimer);
		};
		(0, vue_exports.watch)(() => authStore.user, (newUser) => {
			newUser?.id;
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><header class="header-area header-sticky" data-v-9ccd217f>`);
			if (headerSettings.value.announcement_enabled && headerSettings.value.announcement_text) {
				_push(`<div class="header-announcement" data-v-9ccd217f><div class="container text-center" data-v-9ccd217f>`);
				(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(headerSettings.value.announcement_url ? "a" : "span"), { href: headerSettings.value.announcement_url || void 0 }, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(headerSettings.value.announcement_text)}`);
						else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(headerSettings.value.announcement_text), 1)];
					}),
					_: 1
				}), _parent);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="header-top-area py-4 border-b border-gray-200 hidden xl:block bg-[#FFFAF4]" data-v-9ccd217f><div class="container" data-v-9ccd217f><div class="flex items-center justify-between" data-v-9ccd217f><div class="logo_area shrink-0" data-v-9ccd217f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
				href: "/",
				class: "logo w-[180px] block"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", (0, vue_exports.unref)(homeStore).logo)} alt="Site Logo" class="site-logo" data-v-9ccd217f${_scopeId}>`);
					else return [(0, vue_exports.createVNode)("img", {
						src: (0, vue_exports.unref)(homeStore).logo,
						alt: "Site Logo",
						class: "site-logo"
					}, null, 8, ["src"])];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="flex-grow flex justify-center" data-v-9ccd217f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(NavigationMenu_default, {
				menuItems: menuItems.value,
				categories: categories.value
			}, null, _parent));
			_push(`</div><div class="flex items-center gap-3 shrink-0" data-v-9ccd217f>`);
			if (headerSettings.value.show_search !== false) {
				_push(`<div class="desktop-search-area relative" data-v-9ccd217f><div class="desktop-search-box" data-v-9ccd217f><span class="desktop-search-icon" data-v-9ccd217f>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(I$4), {
					size: 15,
					weight: "bold"
				}, null, _parent));
				_push(`</span><input type="text" placeholder="Search Here"${(0, server_renderer_exports.ssrRenderAttr)("value", searchQuery.value)} class="desktop-search-input body-1-r" data-v-9ccd217f></div>`);
				if (showDropdown.value && searchQuery.value.length > 0) {
					_push(`<div class="search_results absolute bg-white shadow-lg mt-1 w-[320px] right-0 z-30 rounded-lg overflow-hidden" data-v-9ccd217f>`);
					if (isLoading.value) _push(`<div class="p-4 text-center text-gray-500" data-v-9ccd217f>Loading...</div>`);
					else if (filteredProducts.value.length > 0) {
						_push(`<ul class="max-h-80 overflow-y-auto" data-v-9ccd217f><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(filteredProducts.value, (product) => {
							_push(`<li class="p-2 hover:bg-gray-50 border-b border-gray-100" data-v-9ccd217f>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
								class: "flex items-center space-x-3",
								href: `/product/${product.slug}`
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", product.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.product_name)} class="w-10 h-10 rounded object-cover" data-v-9ccd217f${_scopeId}><div class="flex-grow" data-v-9ccd217f${_scopeId}><p class="body-1-sb text-gray-800" data-v-9ccd217f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.product_name)}</p><p class="body-1-r text-gray-500" data-v-9ccd217f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.price)}<span class="bangla-font" data-v-9ccd217f${_scopeId}>৳</span></p></div>`);
									else return [(0, vue_exports.createVNode)("img", {
										src: product.featured_image || "/placeholder.svg",
										alt: product.product_name,
										class: "w-10 h-10 rounded object-cover"
									}, null, 8, ["src", "alt"]), (0, vue_exports.createVNode)("div", { class: "flex-grow" }, [(0, vue_exports.createVNode)("p", { class: "body-1-sb text-gray-800" }, (0, vue_exports.toDisplayString)(product.product_name), 1), (0, vue_exports.createVNode)("p", { class: "body-1-r text-gray-500" }, [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(product.price), 1), (0, vue_exports.createVNode)("span", { class: "bangla-font" }, "৳")])])];
								}),
								_: 2
							}, _parent));
							_push(`</li>`);
						});
						_push(`<!--]--></ul>`);
					} else _push(`<div class="p-4 text-center text-gray-500 body-1-r" data-v-9ccd217f>No products found</div>`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			if (headerSettings.value.show_account !== false) {
				_push(`<button type="button" class="header-icon-btn"${(0, server_renderer_exports.ssrRenderAttr)("title", (0, vue_exports.unref)(authStore).isAuthenticated ? "My Account" : "Login")}${(0, server_renderer_exports.ssrRenderAttr)("aria-label", (0, vue_exports.unref)(authStore).isAuthenticated ? "My Account" : "Login")} data-v-9ccd217f>`);
				if ((0, vue_exports.unref)(authStore).isAuthenticated) _push(`<span class="user-avatar" data-v-9ccd217f>${(0, server_renderer_exports.ssrInterpolate)(userInitial.value)}</span>`);
				else _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$7, { size: 34 }, null, _parent));
				_push(`</button>`);
			} else _push(`<!---->`);
			if (headerSettings.value.show_wishlist !== false) {
				_push(`<button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([{ "has-items": (0, vue_exports.unref)(wishlistStore).count > 0 }, "header-icon-btn"])}" title="Wishlist" aria-label="Wishlist" data-v-9ccd217f>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$6, {
					size: 26,
					filled: (0, vue_exports.unref)(wishlistStore).count > 0
				}, null, _parent));
				if ((0, vue_exports.unref)(wishlistStore).count > 0) _push(`<span class="header-badge" data-v-9ccd217f>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(wishlistStore).count)}</span>`);
				else _push(`<!---->`);
				_push(`</button>`);
			} else _push(`<!---->`);
			_push(`<div class="cart-icon-wrapper" data-v-9ccd217f><button type="button" class="cart-icon-btn" data-v-9ccd217f><svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-9ccd217f><path fill-rule="evenodd" clip-rule="evenodd" d="M10.6668 9.33329V7.99996C10.6668 6.58547 11.2287 5.22892 12.2289 4.22872C13.2291 3.22853 14.5857 2.66663 16.0002 2.66663C17.4147 2.66663 18.7712 3.22853 19.7714 4.22872C20.7716 5.22892 21.3335 6.58547 21.3335 7.99996V9.33329H25.3335C26.0695 9.33329 26.6668 9.93196 26.6668 10.676V26.6773C26.6668 28.144 25.4735 29.3333 24.0082 29.3333H7.99216C7.2875 29.3333 6.61166 29.0535 6.11314 28.5555C5.61462 28.0575 5.3342 27.382 5.3335 26.6773V10.6773C5.3335 9.93329 5.92683 9.33329 6.66683 9.33329H10.6668ZM12.2668 9.33329H19.7335V7.99996C19.7335 7.00982 19.3402 6.06023 18.64 5.36009C17.9399 4.65996 16.9903 4.26663 16.0002 4.26663C15.01 4.26663 14.0604 4.65996 13.3603 5.36009C12.6602 6.06023 12.2668 7.00982 12.2668 7.99996V9.33329ZM10.6668 10.9333H6.9335V26.6773C6.9335 27.2586 7.40816 27.7333 7.99216 27.7333H24.0082C24.2885 27.7333 24.5574 27.6221 24.7558 27.4242C24.9543 27.2262 25.0661 26.9576 25.0668 26.6773V10.9333H21.3335V14.6666H19.7335V10.9333H12.2668V14.6666H10.6668V10.9333Z" fill="#252120" data-v-9ccd217f></path></svg><span class="${(0, server_renderer_exports.ssrRenderClass)([{ "cart_count--active": (0, vue_exports.unref)(cartStore).cartCount > 0 }, "cart_count"])}" data-v-9ccd217f>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(cartStore).cartCount)}</span></button></div></div></div></div></div><div class="container xl:hidden py-4 border-b border-gray-200" data-v-9ccd217f><div class="flex items-center justify-between" data-v-9ccd217f><div class="logo_area" data-v-9ccd217f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
				href: "/",
				class: "logo w-[120px] block"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", (0, vue_exports.unref)(homeStore).logo)} alt="logo" data-v-9ccd217f${_scopeId}>`);
					else return [(0, vue_exports.createVNode)("img", {
						src: (0, vue_exports.unref)(homeStore).logo,
						alt: "logo"
					}, null, 8, ["src"])];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="flex items-center gap-4" data-v-9ccd217f>`);
			if (headerSettings.value.show_search !== false) {
				_push(`<button class="text-gray-600 hover:text-theme focus:outline-none" data-v-9ccd217f>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(I$4), { size: 24 }, null, _parent));
				_push(`</button>`);
			} else _push(`<!---->`);
			_push(`<button class="hidden md:inline-flex text-gray-600 hover:text-theme focus:outline-none"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", (0, vue_exports.unref)(authStore).isAuthenticated ? "My Account" : "Login")} data-v-9ccd217f>`);
			if ((0, vue_exports.unref)(authStore).isAuthenticated) _push(`<span class="user-avatar user-avatar--sm" data-v-9ccd217f>${(0, server_renderer_exports.ssrInterpolate)(userInitial.value)}</span>`);
			else _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$7, { size: 30 }, null, _parent));
			_push(`</button>`);
			if (headerSettings.value.show_wishlist !== false) {
				_push(`<button class="relative text-gray-600 hover:text-theme focus:outline-none" style="${(0, server_renderer_exports.ssrRenderStyle)((0, vue_exports.unref)(wishlistStore).count > 0 ? { color: "var(--color-theme)" } : {})}" aria-label="Wishlist" data-v-9ccd217f>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$6, {
					size: 23,
					filled: (0, vue_exports.unref)(wishlistStore).count > 0
				}, null, _parent));
				if ((0, vue_exports.unref)(wishlistStore).count > 0) _push(`<span class="header-badge" data-v-9ccd217f>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(wishlistStore).count)}</span>`);
				else _push(`<!---->`);
				_push(`</button>`);
			} else _push(`<!---->`);
			_push(`<button class="text-gray-600 hover:text-theme focus:outline-none" data-v-9ccd217f>`);
			if (!isMobileMenuOpen.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(G$2), { size: 28 }, null, _parent));
			else _push(`<!---->`);
			_push(`</button></div></div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(MobileMenu_default, {
				menuItems: menuItems.value,
				isMobileMenuOpen: isMobileMenuOpen.value,
				toggleMobileMenu
			}, null, _parent));
			_push(`</header><div class="search" data-v-9ccd217f>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$12, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderTeleport)(_push, (_push) => {
						if (isOpen.value) {
							_push(`<div class="fixed inset-0 z-50 flex items-start sm:items-center justify-center" data-v-9ccd217f${_scopeId}><div class="absolute inset-0 bg-black/30 backdrop-blur-sm" data-v-9ccd217f${_scopeId}></div><div class="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[90vw] rounded-md max-w-3xl py-12 bg-white shadow-xl overflow-hidden flex flex-col" data-v-9ccd217f${_scopeId}><div class="sr-bar" data-v-9ccd217f${_scopeId}><div class="sr-field" data-v-9ccd217f${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Search), {
								size: 18,
								class: "sr-field-icon"
							}, null, _parent, _scopeId));
							_push(`<input${(0, server_renderer_exports.ssrRenderAttr)("value", searchQuery.value)} type="search" inputmode="search" enterkeyhint="search" placeholder="পণ্য খুঁজুন…" class="sr-input" data-v-9ccd217f${_scopeId}>`);
							if (searchQuery.value) {
								_push(`<button type="button" class="sr-clear" aria-label="Clear" data-v-9ccd217f${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(X), { size: 15 }, null, _parent, _scopeId));
								_push(`</button>`);
							} else _push(`<!---->`);
							_push(`</div><button type="button" class="sr-close" aria-label="Close search" data-v-9ccd217f${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(X), { size: 20 }, null, _parent, _scopeId));
							_push(`</button></div><div class="sr-body" data-v-9ccd217f${_scopeId}>`);
							if (isLoading.value) _push(`<p class="sr-state" data-v-9ccd217f${_scopeId}>খুঁজছি…</p>`);
							else if (searchError.value) _push(`<p class="sr-state" data-v-9ccd217f${_scopeId}> খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন। </p>`);
							else if (filteredProducts.value.length) {
								_push(`<!--[--><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(filteredProducts.value, (product) => {
									_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
										key: product.id,
										href: `/product/${product.slug}`,
										class: "sr-item",
										onClick: closeSearch
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", product.featured_image || "/placeholder.svg")}${(0, server_renderer_exports.ssrRenderAttr)("alt", product.product_name)} class="sr-thumb" loading="lazy" data-v-9ccd217f${_scopeId}><span class="sr-meta" data-v-9ccd217f${_scopeId}><span class="sr-name" data-v-9ccd217f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.product_name)}</span>`);
												if (product.category) _push(`<span class="sr-cat" data-v-9ccd217f${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(product.category)}</span>`);
												else _push(`<!---->`);
												_push(`<span class="sr-price" data-v-9ccd217f${_scopeId}><span class="sr-now" data-v-9ccd217f${_scopeId}>৳${(0, server_renderer_exports.ssrInterpolate)(product.price)}</span>`);
												if (product.previous_price && Number(product.previous_price) > Number(product.price)) _push(`<span class="sr-was" data-v-9ccd217f${_scopeId}>৳${(0, server_renderer_exports.ssrInterpolate)(product.previous_price)}</span>`);
												else _push(`<!---->`);
												if (!product.in_stock) _push(`<span class="sr-oos" data-v-9ccd217f${_scopeId}>স্টকে নেই</span>`);
												else _push(`<!---->`);
												_push(`</span></span>`);
											} else return [(0, vue_exports.createVNode)("img", {
												src: product.featured_image || "/placeholder.svg",
												alt: product.product_name,
												class: "sr-thumb",
												loading: "lazy"
											}, null, 8, ["src", "alt"]), (0, vue_exports.createVNode)("span", { class: "sr-meta" }, [
												(0, vue_exports.createVNode)("span", { class: "sr-name" }, (0, vue_exports.toDisplayString)(product.product_name), 1),
												product.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 0,
													class: "sr-cat"
												}, (0, vue_exports.toDisplayString)(product.category), 1)) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.createVNode)("span", { class: "sr-price" }, [
													(0, vue_exports.createVNode)("span", { class: "sr-now" }, "৳" + (0, vue_exports.toDisplayString)(product.price), 1),
													product.previous_price && Number(product.previous_price) > Number(product.price) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
														key: 0,
														class: "sr-was"
													}, "৳" + (0, vue_exports.toDisplayString)(product.previous_price), 1)) : (0, vue_exports.createCommentVNode)("", true),
													!product.in_stock ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
														key: 1,
														class: "sr-oos"
													}, "স্টকে নেই")) : (0, vue_exports.createCommentVNode)("", true)
												])
											])];
										}),
										_: 2
									}, _parent, _scopeId));
								});
								_push(`<!--]-->`);
								if (moreResults.value) _push(`<button type="button" class="sr-more" data-v-9ccd217f${_scopeId}> আরও ${(0, server_renderer_exports.ssrInterpolate)(moreResults.value)}টি ফলাফল দেখুন </button>`);
								else _push(`<!---->`);
								_push(`<!--]-->`);
							} else if (showNoResults.value) {
								_push(`<div class="sr-empty" data-v-9ccd217f${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Search), {
									size: 26,
									class: "sr-empty-icon"
								}, null, _parent, _scopeId));
								_push(`<p class="sr-empty-title" data-v-9ccd217f${_scopeId}>“${(0, server_renderer_exports.ssrInterpolate)(searchQuery.value)}” এর কোনো ফলাফল নেই</p><p class="sr-empty-note" data-v-9ccd217f${_scopeId}>বানান দেখে নিন, বা অন্য শব্দ দিয়ে খুঁজুন।</p></div>`);
							} else _push(`<p class="sr-state" data-v-9ccd217f${_scopeId}>পণ্যের নাম বা কোড লিখে খুঁজুন।</p>`);
							_push(`</div></div></div>`);
						} else _push(`<!---->`);
					}, "body", false, _parent);
					else return [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Teleport, { to: "body" }, [(0, vue_exports.createVNode)(vue_exports.Transition, { name: "slide-up" }, {
						default: (0, vue_exports.withCtx)(() => [isOpen.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "fixed inset-0 z-50 flex items-start sm:items-center justify-center"
						}, [(0, vue_exports.createVNode)("div", {
							class: "absolute inset-0 bg-black/30 backdrop-blur-sm",
							onClick: closeSearch
						}), (0, vue_exports.createVNode)("div", { class: "relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[90vw] rounded-md max-w-3xl py-12 bg-white shadow-xl overflow-hidden flex flex-col" }, [(0, vue_exports.createVNode)("div", { class: "sr-bar" }, [(0, vue_exports.createVNode)("div", { class: "sr-field" }, [
							(0, vue_exports.createVNode)((0, vue_exports.unref)(Search), {
								size: 18,
								class: "sr-field-icon"
							}),
							(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								ref_key: "searchInput",
								ref: searchInput,
								"onUpdate:modelValue": ($event) => searchQuery.value = $event,
								type: "search",
								inputmode: "search",
								enterkeyhint: "search",
								placeholder: "পণ্য খুঁজুন…",
								class: "sr-input",
								onInput: onSearchInputChange,
								onKeydown: [(0, vue_exports.withKeys)(submitSearch, ["enter"]), (0, vue_exports.withKeys)(closeSearch, ["esc"])]
							}, null, 40, ["onUpdate:modelValue"]), [[vue_exports.vModelText, searchQuery.value]]),
							searchQuery.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
								key: 0,
								type: "button",
								class: "sr-clear",
								"aria-label": "Clear",
								onClick: ($event) => {
									searchQuery.value = "";
									onSearchInputChange();
								}
							}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(X), { size: 15 })], 8, ["onClick"])) : (0, vue_exports.createCommentVNode)("", true)
						]), (0, vue_exports.createVNode)("button", {
							type: "button",
							class: "sr-close",
							"aria-label": "Close search",
							onClick: closeSearch
						}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(X), { size: 20 })])]), (0, vue_exports.createVNode)("div", { class: "sr-body" }, [isLoading.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 0,
							class: "sr-state"
						}, "খুঁজছি…")) : searchError.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 1,
							class: "sr-state"
						}, " খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন। ")) : filteredProducts.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 2 }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredProducts.value, (product) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(link_default), {
								key: product.id,
								href: `/product/${product.slug}`,
								class: "sr-item",
								onClick: closeSearch
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("img", {
									src: product.featured_image || "/placeholder.svg",
									alt: product.product_name,
									class: "sr-thumb",
									loading: "lazy"
								}, null, 8, ["src", "alt"]), (0, vue_exports.createVNode)("span", { class: "sr-meta" }, [
									(0, vue_exports.createVNode)("span", { class: "sr-name" }, (0, vue_exports.toDisplayString)(product.product_name), 1),
									product.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 0,
										class: "sr-cat"
									}, (0, vue_exports.toDisplayString)(product.category), 1)) : (0, vue_exports.createCommentVNode)("", true),
									(0, vue_exports.createVNode)("span", { class: "sr-price" }, [
										(0, vue_exports.createVNode)("span", { class: "sr-now" }, "৳" + (0, vue_exports.toDisplayString)(product.price), 1),
										product.previous_price && Number(product.previous_price) > Number(product.price) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											class: "sr-was"
										}, "৳" + (0, vue_exports.toDisplayString)(product.previous_price), 1)) : (0, vue_exports.createCommentVNode)("", true),
										!product.in_stock ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 1,
											class: "sr-oos"
										}, "স্টকে নেই")) : (0, vue_exports.createCommentVNode)("", true)
									])
								])]),
								_: 2
							}, 1032, ["href"]);
						}), 128)), moreResults.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("button", {
							key: 0,
							type: "button",
							class: "sr-more",
							onClick: submitSearch
						}, " আরও " + (0, vue_exports.toDisplayString)(moreResults.value) + "টি ফলাফল দেখুন ", 1)) : (0, vue_exports.createCommentVNode)("", true)], 64)) : showNoResults.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 3,
							class: "sr-empty"
						}, [
							(0, vue_exports.createVNode)((0, vue_exports.unref)(Search), {
								size: 26,
								class: "sr-empty-icon"
							}),
							(0, vue_exports.createVNode)("p", { class: "sr-empty-title" }, "“" + (0, vue_exports.toDisplayString)(searchQuery.value) + "” এর কোনো ফলাফল নেই", 1),
							(0, vue_exports.createVNode)("p", { class: "sr-empty-note" }, "বানান দেখে নিন, বা অন্য শব্দ দিয়ে খুঁজুন।")
						])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 4,
							class: "sr-state"
						}, "পণ্যের নাম বা কোড লিখে খুঁজুন।"))])])])) : (0, vue_exports.createCommentVNode)("", true)]),
						_: 1
					})]))];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(CartSidebar_default, null, null, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/Header.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var Header_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-9ccd217f"]]);
//#endregion
//#region node_modules/@lottiefiles/dotlottie-web/dist/index.js
function e(t) {
	"@babel/helpers - typeof";
	return e = typeof Symbol == `function` && typeof Symbol.iterator == `symbol` ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == `function` && e.constructor === Symbol && e !== Symbol.prototype ? `symbol` : typeof e;
	}, e(t);
}
function t(t, n) {
	if (e(t) != `object` || !t) return t;
	var r = t[Symbol.toPrimitive];
	if (r !== void 0) {
		var i = r.call(t, n || `default`);
		if (e(i) != `object`) return i;
		throw TypeError(`@@toPrimitive must return a primitive value.`);
	}
	return (n === `string` ? String : Number)(t);
}
function n(n) {
	var r = t(n, `string`);
	return e(r) == `symbol` ? r : r + ``;
}
function r(e, t, r) {
	return (t = n(t)) in e ? Object.defineProperty(e, t, {
		value: r,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = r, e;
}
var i = class {
	requestAnimationFrame(e) {
		return requestAnimationFrame(e);
	}
	cancelAnimationFrame(e) {
		cancelAnimationFrame(e);
	}
};
var a = class {
	constructor() {
		r(this, `_lastHandleId`, 0), r(this, `_lastImmediate`, null);
	}
	requestAnimationFrame(e) {
		return this._lastHandleId >= 2 ** 53 - 1 && (this._lastHandleId = 0), this._lastHandleId += 1, this._lastImmediate = setImmediate(() => {
			e(performance.now());
		}), this._lastHandleId;
	}
	cancelAnimationFrame(e) {
		this._lastImmediate && clearImmediate(this._lastImmediate);
	}
};
var o = class {
	constructor() {
		r(this, `_strategy`, void 0), this._strategy = typeof requestAnimationFrame == `function` ? new i() : new a();
	}
	requestAnimationFrame(e) {
		return this._strategy.requestAnimationFrame(e);
	}
	cancelAnimationFrame(e) {
		this._strategy.cancelAnimationFrame(e);
	}
};
var s = typeof window < `u` && window.document !== void 0;
var c = new Uint8Array([
	80,
	75,
	3,
	4
]);
var ee = [
	`v`,
	`ip`,
	`op`,
	`layers`,
	`fr`,
	`w`,
	`h`
];
var l;
var u = Array(128).fill(void 0);
u.push(void 0, null, !0, !1);
function d(e) {
	return u[e];
}
var f = u.length;
function p(e) {
	f === u.length && u.push(u.length + 1);
	let t = f;
	return f = u[t], u[t] = e, t;
}
function m(e, t) {
	try {
		return e.apply(this, t);
	} catch (e) {
		l.__wbindgen_export_0(p(e));
	}
}
var h$1 = 0;
var g = null;
function _() {
	return (g === null || g.byteLength === 0) && (g = new Uint8Array(l.memory.buffer)), g;
}
var v = typeof TextEncoder < `u` ? new TextEncoder(`utf-8`) : { encode: () => {
	throw Error(`TextEncoder not available`);
} };
var te = typeof v.encodeInto == `function` ? function(e, t) {
	return v.encodeInto(e, t);
} : function(e, t) {
	let n = v.encode(e);
	return t.set(n), {
		read: e.length,
		written: n.length
	};
};
function y(e, t, n) {
	if (n === void 0) {
		let n = v.encode(e), r = t(n.length, 1) >>> 0;
		return _().subarray(r, r + n.length).set(n), h$1 = n.length, r;
	}
	let r = e.length, i = t(r, 1) >>> 0, a = _(), o = 0;
	for (; o < r; o++) {
		let t = e.charCodeAt(o);
		if (t > 127) break;
		a[i + o] = t;
	}
	if (o !== r) {
		o !== 0 && (e = e.slice(o)), i = n(i, r, r = o + e.length * 3, 1) >>> 0;
		let t = _().subarray(i + o, i + r), a = te(e, t);
		o += a.written, i = n(i, r, o, 1) >>> 0;
	}
	return h$1 = o, i;
}
var b = null;
function x() {
	return (b === null || b.buffer.detached === !0 || b.buffer.detached === void 0 && b.buffer !== l.memory.buffer) && (b = new DataView(l.memory.buffer)), b;
}
var S = typeof TextDecoder < `u` ? new TextDecoder(`utf-8`, {
	ignoreBOM: !0,
	fatal: !0
}) : { decode: () => {
	throw Error(`TextDecoder not available`);
} };
typeof TextDecoder < `u` && S.decode();
function C(e, t) {
	return e >>>= 0, S.decode(_().subarray(e, e + t));
}
function ne(e) {
	e < 132 || (u[e] = f, f = e);
}
function w(e) {
	let t = d(e);
	return ne(e), t;
}
function T(e) {
	return e == null;
}
var E = null;
function re() {
	return (E === null || E.byteLength === 0) && (E = new Float32Array(l.memory.buffer)), E;
}
function ie(e, t) {
	let n = t(e.length * 4, 4) >>> 0;
	return re().set(e, n / 4), h$1 = e.length, n;
}
function D(e, t) {
	let n = t(e.length * 1, 1) >>> 0;
	return _().set(e, n / 1), h$1 = e.length, n;
}
function ae(e, t) {
	let n = t(e.length * 4, 4) >>> 0, r = x();
	for (let t = 0; t < e.length; t++) r.setUint32(n + 4 * t, p(e[t]), !0);
	return h$1 = e.length, n;
}
function oe(e, t) {
	let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1, i = D(t, l.__wbindgen_export_1), a = h$1;
	return l.register_font(n, r, i, a) !== 0;
}
var O = Object.freeze({
	Forward: 0,
	0: `Forward`,
	Reverse: 1,
	1: `Reverse`,
	Bounce: 2,
	2: `Bounce`,
	ReverseBounce: 3,
	3: `ReverseBounce`
});
var k = Object.freeze({
	Idle: 0,
	0: `Idle`,
	Playing: 1,
	1: `Playing`,
	Paused: 2,
	2: `Paused`,
	Stopped: 3,
	3: `Stopped`,
	Tweening: 4,
	4: `Tweening`
});
var A = typeof FinalizationRegistry > `u` ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((e) => l.__wbg_dotlottieplayerwasm_free(e >>> 0, 1));
var se = class {
	__destroy_into_raw() {
		let e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, A.unregister(this), e;
	}
	free() {
		let e = this.__destroy_into_raw();
		l.__wbg_dotlottieplayerwasm_free(e, 0);
	}
	clear_slot(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_clear_slot(this.__wbg_ptr, t, n) !== 0;
	}
	layout_fit() {
		let e, t;
		try {
			let i = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_layout_fit(i, this.__wbg_ptr);
			var n = x().getInt32(i + 0, !0), r = x().getInt32(i + 4, !0);
			return e = n, t = r, C(n, r);
		} finally {
			l.__wbindgen_add_to_stack_pointer(16), l.__wbindgen_export_3(e, t, 1);
		}
	}
	loop_count() {
		return l.dotlottieplayerwasm_loop_count(this.__wbg_ptr) >>> 0;
	}
	poll_event() {
		return w(l.dotlottieplayerwasm_poll_event(this.__wbg_ptr));
	}
	reset_slot(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_reset_slot(this.__wbg_ptr, t, n) !== 0;
	}
	set_layout(e, t, n) {
		let r = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), i = h$1;
		return l.dotlottieplayerwasm_set_layout(this.__wbg_ptr, r, i, t, n) !== 0;
	}
	set_marker(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		l.dotlottieplayerwasm_set_marker(this.__wbg_ptr, t, n);
	}
	clear_slots() {
		return l.dotlottieplayerwasm_clear_slots(this.__wbg_ptr) !== 0;
	}
	is_complete() {
		return l.dotlottieplayerwasm_is_complete(this.__wbg_ptr) !== 0;
	}
	reset_slots() {
		return l.dotlottieplayerwasm_reset_slots(this.__wbg_ptr) !== 0;
	}
	reset_theme() {
		return l.dotlottieplayerwasm_reset_theme(this.__wbg_ptr) !== 0;
	}
	segment_end() {
		return l.dotlottieplayerwasm_segment_end(this.__wbg_ptr);
	}
	set_quality(e) {
		return l.dotlottieplayerwasm_set_quality(this.__wbg_ptr, e) !== 0;
	}
	set_segment(e, t) {
		return l.dotlottieplayerwasm_set_segment(this.__wbg_ptr, e, t) !== 0;
	}
	sm_set_seed(e) {
		return l.dotlottieplayerwasm_sm_set_seed(this.__wbg_ptr, e) !== 0;
	}
	static unload_font(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_unload_font(t, n) !== 0;
	}
	animation_id() {
		try {
			let n = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_animation_id(n, this.__wbg_ptr);
			var e = x().getInt32(n + 0, !0), t = x().getInt32(n + 4, !0);
			let r;
			return e !== 0 && (r = C(e, t).slice(), l.__wbindgen_export_3(e, t * 1, 1)), r;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	audio_volume() {
		return l.dotlottieplayerwasm_audio_volume(this.__wbg_ptr);
	}
	background_a() {
		return l.dotlottieplayerwasm_background_a(this.__wbg_ptr);
	}
	background_b() {
		return l.dotlottieplayerwasm_background_b(this.__wbg_ptr);
	}
	background_g() {
		return l.dotlottieplayerwasm_background_g(this.__wbg_ptr);
	}
	background_r() {
		return l.dotlottieplayerwasm_background_r(this.__wbg_ptr);
	}
	clear_marker() {
		l.dotlottieplayerwasm_clear_marker(this.__wbg_ptr);
	}
	emit_on_loop() {
		l.dotlottieplayerwasm_emit_on_loop(this.__wbg_ptr);
	}
	get_slot_ids() {
		return w(l.dotlottieplayerwasm_get_slot_ids(this.__wbg_ptr));
	}
	get_slot_str(e) {
		try {
			let r = l.__wbindgen_add_to_stack_pointer(-16), i = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
			l.dotlottieplayerwasm_get_slot_str(r, this.__wbg_ptr, i, a);
			var t = x().getInt32(r + 0, !0), n = x().getInt32(r + 4, !0);
			let o;
			return t !== 0 && (o = C(t, n).slice(), l.__wbindgen_export_3(t, n * 1, 1)), o;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	marker_names() {
		return w(l.dotlottieplayerwasm_marker_names(this.__wbg_ptr));
	}
	set_autoplay(e) {
		l.dotlottieplayerwasm_set_autoplay(this.__wbg_ptr, e);
	}
	set_slot_str(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1, i = y(t, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
		return l.dotlottieplayerwasm_set_slot_str(this.__wbg_ptr, n, r, i, a) !== 0;
	}
	set_viewport(e, t, n, r) {
		return l.dotlottieplayerwasm_set_viewport(this.__wbg_ptr, e, t, n, r) !== 0;
	}
	total_frames() {
		return l.dotlottieplayerwasm_total_frames(this.__wbg_ptr);
	}
	clear_segment() {
		return l.dotlottieplayerwasm_clear_segment(this.__wbg_ptr) !== 0;
	}
	current_frame() {
		return l.dotlottieplayerwasm_current_frame(this.__wbg_ptr);
	}
	get_slot_type(e) {
		try {
			let r = l.__wbindgen_add_to_stack_pointer(-16), i = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
			l.dotlottieplayerwasm_get_slot_type(r, this.__wbg_ptr, i, a);
			var t = x().getInt32(r + 0, !0), n = x().getInt32(r + 4, !0);
			let o;
			return t !== 0 && (o = C(t, n).slice(), l.__wbindgen_export_3(t, n * 1, 1)), o;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	get_slots_str() {
		let e, t;
		try {
			let i = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_get_slots_str(i, this.__wbg_ptr);
			var n = x().getInt32(i + 0, !0), r = x().getInt32(i + 4, !0);
			return e = n, t = r, C(n, r);
		} finally {
			l.__wbindgen_add_to_stack_pointer(16), l.__wbindgen_export_3(e, t, 1);
		}
	}
	get_transform() {
		return w(l.dotlottieplayerwasm_get_transform(this.__wbg_ptr));
	}
	segment_start() {
		return l.dotlottieplayerwasm_segment_start(this.__wbg_ptr);
	}
	set_slots_str(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_set_slots_str(this.__wbg_ptr, t, n) !== 0;
	}
	set_text_slot(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1, i = y(t, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
		return l.dotlottieplayerwasm_set_text_slot(this.__wbg_ptr, n, r, i, a) !== 0;
	}
	set_transform(e) {
		let t = ie(e, l.__wbindgen_export_1), n = h$1;
		return l.dotlottieplayerwasm_set_transform(this.__wbg_ptr, t, n) !== 0;
	}
	sm_get_inputs() {
		return w(l.dotlottieplayerwasm_sm_get_inputs(this.__wbg_ptr));
	}
	sm_poll_event() {
		return w(l.dotlottieplayerwasm_sm_poll_event(this.__wbg_ptr));
	}
	sm_post_click(e, t) {
		l.dotlottieplayerwasm_sm_post_click(this.__wbg_ptr, e, t);
	}
	animation_size() {
		return w(l.dotlottieplayerwasm_animation_size(this.__wbg_ptr));
	}
	current_marker() {
		try {
			let n = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_current_marker(n, this.__wbg_ptr);
			var e = x().getInt32(n + 0, !0), t = x().getInt32(n + 4, !0);
			let r;
			return e !== 0 && (r = C(e, t).slice(), l.__wbindgen_export_3(e, t * 1, 1)), r;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	layout_align_x() {
		return l.dotlottieplayerwasm_layout_align_x(this.__wbg_ptr);
	}
	layout_align_y() {
		return l.dotlottieplayerwasm_layout_align_y(this.__wbg_ptr);
	}
	load_animation(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_load_animation(this.__wbg_ptr, t, n) !== 0;
	}
	loop_animation() {
		return l.dotlottieplayerwasm_loop_animation(this.__wbg_ptr) !== 0;
	}
	set_background(e, t, n, r) {
		return l.dotlottieplayerwasm_set_background(this.__wbg_ptr, e, t, n, r) !== 0;
	}
	set_color_slot(e, t, n, r) {
		let i = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
		return l.dotlottieplayerwasm_set_color_slot(this.__wbg_ptr, i, a, t, n, r) !== 0;
	}
	set_image_slot(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1, i = y(t, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
		return l.dotlottieplayerwasm_set_image_slot(this.__wbg_ptr, n, r, i, a) !== 0;
	}
	set_loop_count(e) {
		l.dotlottieplayerwasm_set_loop_count(this.__wbg_ptr, e);
	}
	set_theme_data(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_set_theme_data(this.__wbg_ptr, t, n) !== 0;
	}
	sm_reset_input(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		l.dotlottieplayerwasm_sm_reset_input(this.__wbg_ptr, t, n);
	}
	manifest_string() {
		let e, t;
		try {
			let i = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_manifest_string(i, this.__wbg_ptr);
			var n = x().getInt32(i + 0, !0), r = x().getInt32(i + 4, !0);
			return e = n, t = r, C(n, r);
		} finally {
			l.__wbindgen_add_to_stack_pointer(16), l.__wbindgen_export_3(e, t, 1);
		}
	}
	set_scalar_slot(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1;
		return l.dotlottieplayerwasm_set_scalar_slot(this.__wbg_ptr, n, r, t) !== 0;
	}
	set_vector_slot(e, t, n) {
		let r = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), i = h$1;
		return l.dotlottieplayerwasm_set_vector_slot(this.__wbg_ptr, r, i, t, n) !== 0;
	}
	setup_sw_target(e, t) {
		return l.dotlottieplayerwasm_setup_sw_target(this.__wbg_ptr, e, t) !== 0;
	}
	get_pixel_buffer() {
		return w(l.dotlottieplayerwasm_get_pixel_buffer(this.__wbg_ptr));
	}
	set_audio_volume(e) {
		l.dotlottieplayerwasm_set_audio_volume(this.__wbg_ptr, e);
	}
	sm_current_state() {
		let e, t;
		try {
			let i = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_sm_current_state(i, this.__wbg_ptr);
			var n = x().getInt32(i + 0, !0), r = x().getInt32(i + 4, !0);
			return e = n, t = r, C(n, r);
		} finally {
			l.__wbindgen_add_to_stack_pointer(16), l.__wbindgen_export_3(e, t, 1);
		}
	}
	state_machine_id() {
		try {
			let n = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_state_machine_id(n, this.__wbg_ptr);
			var e = x().getInt32(n + 0, !0), t = x().getInt32(n + 4, !0);
			let r;
			return e !== 0 && (r = C(e, t).slice(), l.__wbindgen_export_3(e, t * 1, 1)), r;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	get_state_machine(e) {
		try {
			let r = l.__wbindgen_add_to_stack_pointer(-16), i = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
			l.dotlottieplayerwasm_get_state_machine(r, this.__wbg_ptr, i, a);
			var t = x().getInt32(r + 0, !0), n = x().getInt32(r + 4, !0);
			let o;
			return t !== 0 && (o = C(t, n).slice(), l.__wbindgen_export_3(t, n * 1, 1)), o;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	set_position_slot(e, t, n) {
		let r = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), i = h$1;
		return l.dotlottieplayerwasm_set_position_slot(this.__wbg_ptr, r, i, t, n) !== 0;
	}
	current_loop_count() {
		return l.dotlottieplayerwasm_current_loop_count(this.__wbg_ptr) >>> 0;
	}
	set_asset_resolver(e) {
		l.dotlottieplayerwasm_set_asset_resolver(this.__wbg_ptr, T(e) ? 0 : p(e));
	}
	sm_framework_setup() {
		return w(l.dotlottieplayerwasm_sm_framework_setup(this.__wbg_ptr));
	}
	sm_post_pointer_up(e, t) {
		l.dotlottieplayerwasm_sm_post_pointer_up(this.__wbg_ptr, e, t);
	}
	state_machine_load(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_state_machine_load(this.__wbg_ptr, t, n) !== 0;
	}
	load_dotlottie_data(e) {
		let t = D(e, l.__wbindgen_export_1), n = h$1;
		return l.dotlottieplayerwasm_load_dotlottie_data(this.__wbg_ptr, t, n) !== 0;
	}
	sm_get_string_input(e) {
		try {
			let r = l.__wbindgen_add_to_stack_pointer(-16), i = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
			l.dotlottieplayerwasm_sm_get_string_input(r, this.__wbg_ptr, i, a);
			var t = x().getInt32(r + 0, !0), n = x().getInt32(r + 4, !0);
			let o;
			return t !== 0 && (o = C(t, n).slice(), l.__wbindgen_export_3(t, n * 1, 1)), o;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	sm_set_string_input(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1, i = y(t, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
		return l.dotlottieplayerwasm_sm_set_string_input(this.__wbg_ptr, n, r, i, a) !== 0;
	}
	sm_get_boolean_input(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1, r = l.dotlottieplayerwasm_sm_get_boolean_input(this.__wbg_ptr, t, n);
		return r === 16777215 ? void 0 : r !== 0;
	}
	sm_get_numeric_input(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1, r = l.dotlottieplayerwasm_sm_get_numeric_input(this.__wbg_ptr, t, n);
		return r === 4294967297 ? void 0 : r;
	}
	sm_post_pointer_down(e, t) {
		l.dotlottieplayerwasm_sm_post_pointer_down(this.__wbg_ptr, e, t);
	}
	sm_post_pointer_exit(e, t) {
		l.dotlottieplayerwasm_sm_post_pointer_exit(this.__wbg_ptr, e, t);
	}
	sm_post_pointer_move(e, t) {
		l.dotlottieplayerwasm_sm_post_pointer_move(this.__wbg_ptr, e, t);
	}
	sm_set_boolean_input(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1;
		return l.dotlottieplayerwasm_sm_set_boolean_input(this.__wbg_ptr, n, r, t) !== 0;
	}
	sm_set_numeric_input(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1;
		return l.dotlottieplayerwasm_sm_set_numeric_input(this.__wbg_ptr, n, r, t) !== 0;
	}
	state_machine_unload() {
		l.dotlottieplayerwasm_state_machine_unload(this.__wbg_ptr);
	}
	sm_post_pointer_enter(e, t) {
		l.dotlottieplayerwasm_sm_post_pointer_enter(this.__wbg_ptr, e, t);
	}
	load_animation_from_id(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_load_animation_from_id(this.__wbg_ptr, t, n) !== 0;
	}
	sm_poll_internal_event() {
		return w(l.dotlottieplayerwasm_sm_poll_internal_event(this.__wbg_ptr));
	}
	use_frame_interpolation() {
		return l.dotlottieplayerwasm_use_frame_interpolation(this.__wbg_ptr) !== 0;
	}
	reset_current_loop_count() {
		l.dotlottieplayerwasm_reset_current_loop_count(this.__wbg_ptr);
	}
	sm_override_current_state(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1;
		return l.dotlottieplayerwasm_sm_override_current_state(this.__wbg_ptr, n, r, t) !== 0;
	}
	state_machine_load_from_id(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_state_machine_load_from_id(this.__wbg_ptr, t, n) !== 0;
	}
	set_use_frame_interpolation(e) {
		l.dotlottieplayerwasm_set_use_frame_interpolation(this.__wbg_ptr, e);
	}
	constructor() {
		let e = l.dotlottieplayerwasm_new();
		return this.__wbg_ptr = e >>> 0, A.register(this, this.__wbg_ptr, this), this;
	}
	mode() {
		return l.dotlottieplayerwasm_mode(this.__wbg_ptr);
	}
	play() {
		return l.dotlottieplayerwasm_play(this.__wbg_ptr) !== 0;
	}
	stop() {
		return l.dotlottieplayerwasm_stop(this.__wbg_ptr) !== 0;
	}
	tick(e) {
		return l.dotlottieplayerwasm_tick(this.__wbg_ptr, e) !== 0;
	}
	pause() {
		return l.dotlottieplayerwasm_pause(this.__wbg_ptr) !== 0;
	}
	speed() {
		return l.dotlottieplayerwasm_speed(this.__wbg_ptr);
	}
	width() {
		return l.dotlottieplayerwasm_width(this.__wbg_ptr) >>> 0;
	}
	height() {
		return l.dotlottieplayerwasm_height(this.__wbg_ptr) >>> 0;
	}
	render() {
		return l.dotlottieplayerwasm_render(this.__wbg_ptr) !== 0;
	}
	status() {
		return l.dotlottieplayerwasm_status(this.__wbg_ptr);
	}
	markers() {
		return w(l.dotlottieplayerwasm_markers(this.__wbg_ptr));
	}
	sm_fire(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_sm_fire(this.__wbg_ptr, t, n) !== 0;
	}
	sm_stop() {
		return l.dotlottieplayerwasm_sm_stop(this.__wbg_ptr) !== 0;
	}
	sm_tick(e) {
		return l.dotlottieplayerwasm_sm_tick(this.__wbg_ptr, e) !== 0;
	}
	autoplay() {
		return l.dotlottieplayerwasm_autoplay(this.__wbg_ptr) !== 0;
	}
	duration() {
		return l.dotlottieplayerwasm_duration(this.__wbg_ptr);
	}
	set_loop(e) {
		l.dotlottieplayerwasm_set_loop(this.__wbg_ptr, e);
	}
	set_mode(e) {
		l.dotlottieplayerwasm_set_mode(this.__wbg_ptr, e);
	}
	sm_start(e, t) {
		let n = ae(t, l.__wbindgen_export_1), r = h$1;
		return l.dotlottieplayerwasm_sm_start(this.__wbg_ptr, e, n, r) !== 0;
	}
	theme_id() {
		try {
			let n = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_theme_id(n, this.__wbg_ptr);
			var e = x().getInt32(n + 0, !0), t = x().getInt32(n + 4, !0);
			let r;
			return e !== 0 && (r = C(e, t).slice(), l.__wbindgen_export_3(e, t * 1, 1)), r;
		} finally {
			l.__wbindgen_add_to_stack_pointer(16);
		}
	}
	load_font(e, t) {
		let n = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1, i = D(t, l.__wbindgen_export_1), a = h$1;
		return l.dotlottieplayerwasm_load_font(this.__wbg_ptr, n, r, i, a) !== 0;
	}
	set_frame(e) {
		return l.dotlottieplayerwasm_set_frame(this.__wbg_ptr, e) !== 0;
	}
	set_speed(e) {
		l.dotlottieplayerwasm_set_speed(this.__wbg_ptr, e);
	}
	set_theme(e) {
		let t = y(e, l.__wbindgen_export_1, l.__wbindgen_export_2), n = h$1;
		return l.dotlottieplayerwasm_set_theme(this.__wbg_ptr, t, n) !== 0;
	}
	sm_status() {
		let e, t;
		try {
			let i = l.__wbindgen_add_to_stack_pointer(-16);
			l.dotlottieplayerwasm_sm_status(i, this.__wbg_ptr);
			var n = x().getInt32(i + 0, !0), r = x().getInt32(i + 4, !0);
			return e = n, t = r, C(n, r);
		} finally {
			l.__wbindgen_add_to_stack_pointer(16), l.__wbindgen_export_3(e, t, 1);
		}
	}
};
async function ce(e, t) {
	if (typeof Response == `function` && e instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming == `function`) try {
			return await WebAssembly.instantiateStreaming(e, t);
		} catch (t) {
			if (e.headers.get(`Content-Type`) != `application/wasm`) console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t);
			else throw t;
		}
		let n = await e.arrayBuffer();
		return await WebAssembly.instantiate(n, t);
	} else {
		let n = await WebAssembly.instantiate(e, t);
		return n instanceof WebAssembly.Instance ? {
			instance: n,
			module: e
		} : n;
	}
}
function le() {
	let e = {};
	return e.wbg = {}, e.wbg.__wbg_buffer_609cc3eee51ed158 = function(e) {
		let t = d(e).buffer;
		return p(t);
	}, e.wbg.__wbg_call_7cccdd69e0791ae2 = function() {
		return m(function(e, t, n) {
			return p(d(e).call(d(t), d(n)));
		}, arguments);
	}, e.wbg.__wbg_createObjectURL_6e98d2f9c7bd9764 = function() {
		return m(function(e, t) {
			let n = y(URL.createObjectURL(d(t)), l.__wbindgen_export_1, l.__wbindgen_export_2), r = h$1;
			x().setInt32(e + 4, r, !0), x().setInt32(e + 0, n, !0);
		}, arguments);
	}, e.wbg.__wbg_ended_b873fb75d0c13ca7 = function(e) {
		return d(e).ended;
	}, e.wbg.__wbg_error_7534b8e9a36f1ab4 = function(e, t) {
		let n, r;
		try {
			n = e, r = t, console.error(C(e, t));
		} finally {
			l.__wbindgen_export_3(n, r, 1);
		}
	}, e.wbg.__wbg_length_a446193dc22c12f8 = function(e) {
		return d(e).length;
	}, e.wbg.__wbg_new_405e22f390576ce2 = function() {
		return p({});
	}, e.wbg.__wbg_new_78feb108b6472713 = function() {
		return p([]);
	}, e.wbg.__wbg_new_8a6f238a6ece86ea = function() {
		return p(Error());
	}, e.wbg.__wbg_new_a12002a7f91c75be = function(e) {
		return p(new Uint8Array(d(e)));
	}, e.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(e, t, n) {
		return p(new Uint8Array(d(e), t >>> 0, n >>> 0));
	}, e.wbg.__wbg_newwithlength_5a5efe313cfd59f1 = function(e) {
		return p(new Float32Array(e >>> 0));
	}, e.wbg.__wbg_newwithsrc_20307ca7e8762a81 = function() {
		return m(function(e, t) {
			return p(new Audio(C(e, t)));
		}, arguments);
	}, e.wbg.__wbg_newwithu8arraysequenceandoptions_068570c487f69127 = function() {
		return m(function(e, t) {
			return p(new Blob(d(e), d(t)));
		}, arguments);
	}, e.wbg.__wbg_pause_b74c96d69f769518 = function() {
		return m(function(e) {
			d(e).pause();
		}, arguments);
	}, e.wbg.__wbg_play_f6ec5fc4e84b0d26 = function() {
		return m(function(e) {
			return p(d(e).play());
		}, arguments);
	}, e.wbg.__wbg_push_737cfc8c1432c2c6 = function(e, t) {
		return d(e).push(d(t));
	}, e.wbg.__wbg_revokeObjectURL_27267efebeb457c7 = function() {
		return m(function(e, t) {
			URL.revokeObjectURL(C(e, t));
		}, arguments);
	}, e.wbg.__wbg_set_65595bdd868b3009 = function(e, t, n) {
		d(e).set(d(t), n >>> 0);
	}, e.wbg.__wbg_set_bb8cecf6a62b9f46 = function() {
		return m(function(e, t, n) {
			return Reflect.set(d(e), d(t), d(n));
		}, arguments);
	}, e.wbg.__wbg_setcurrentTime_64727eddd3966512 = function(e, t) {
		d(e).currentTime = t;
	}, e.wbg.__wbg_setindex_4e73afdcd9bb95cd = function(e, t, n) {
		d(e)[t >>> 0] = n;
	}, e.wbg.__wbg_settype_39ed370d3edd403c = function(e, t, n) {
		d(e).type = C(t, n);
	}, e.wbg.__wbg_setvolume_3895e06a030ca4f7 = function(e, t) {
		d(e).volume = t;
	}, e.wbg.__wbg_stack_0ed75d68575b0f3c = function(e, t) {
		let n = d(t).stack, r = y(n, l.__wbindgen_export_1, l.__wbindgen_export_2), i = h$1;
		x().setInt32(e + 4, i, !0), x().setInt32(e + 0, r, !0);
	}, e.wbg.__wbindgen_is_null = function(e) {
		return d(e) === null;
	}, e.wbg.__wbindgen_is_undefined = function(e) {
		return d(e) === void 0;
	}, e.wbg.__wbindgen_memory = function() {
		let e = l.memory;
		return p(e);
	}, e.wbg.__wbindgen_number_new = function(e) {
		return p(e);
	}, e.wbg.__wbindgen_object_drop_ref = function(e) {
		w(e);
	}, e.wbg.__wbindgen_string_get = function(e, t) {
		let n = d(t), r = typeof n == `string` ? n : void 0;
		var i = T(r) ? 0 : y(r, l.__wbindgen_export_1, l.__wbindgen_export_2), a = h$1;
		x().setInt32(e + 4, a, !0), x().setInt32(e + 0, i, !0);
	}, e.wbg.__wbindgen_string_new = function(e, t) {
		return p(C(e, t));
	}, e.wbg.__wbindgen_throw = function(e, t) {
		throw Error(C(e, t));
	}, e;
}
function ue(e, t) {
	return l = e.exports, j.__wbindgen_wasm_module = t, b = null, E = null, g = null, l;
}
async function j(e) {
	if (l !== void 0) return l;
	if (e !== void 0 && (Object.getPrototypeOf(e) === Object.prototype ? {module_or_path: e} = e : console.warn(`using deprecated parameters for the initialization function; pass a single object instead`)), e === void 0) throw Error(`WASM module URL must be provided via DotLottieWasmLoader or setWasmUrl().`);
	let t = le();
	(typeof e == `string` || typeof Request == `function` && e instanceof Request || typeof URL == `function` && e instanceof URL) && (e = fetch(e));
	let { instance: n, module: r } = await ce(await e, t);
	return ue(n, r);
}
var M = class {
	constructor() {
		r(this, `_eventListeners`, /* @__PURE__ */ new Map());
	}
	addEventListener(e, t) {
		let n = this._eventListeners.get(e);
		n || (n = /* @__PURE__ */ new Set(), this._eventListeners.set(e, n)), n.add(t);
	}
	removeEventListener(e, t) {
		let n = this._eventListeners.get(e);
		n && (t ? (n.delete(t), n.size === 0 && this._eventListeners.delete(e)) : this._eventListeners.delete(e));
	}
	dispatch(e) {
		this._eventListeners.get(e.type)?.forEach((t) => t(e));
	}
	removeAllEventListeners() {
		this._eventListeners.clear();
	}
};
var N = class e {
	static _initializeObserver() {
		e._observer || (e._observer = new IntersectionObserver((t) => {
			t.forEach((t) => {
				let n = e._observedCanvases.get(t.target);
				n && (t.isIntersecting ? n.unfreeze() : n.freeze());
			});
		}, { threshold: 0 }));
	}
	static observe(t, n) {
		e._initializeObserver(), !e._observedCanvases.has(t) && (e._observedCanvases.set(t, n), e._observer?.observe(t));
	}
	static unobserve(t) {
		e._observer?.unobserve(t), e._observedCanvases.delete(t), e._observedCanvases.size === 0 && (e._observer?.disconnect(), e._observer = null);
	}
};
r(N, `_observer`, null), r(N, `_observedCanvases`, /* @__PURE__ */ new Map());
var P = class e {
	static _initializeObserver() {
		e._observer || (e._observer = new ResizeObserver((t) => {
			t.forEach((t) => {
				let n = e._observedCanvases.get(t.target);
				if (!n) return;
				let [r, i] = n;
				clearTimeout(i);
				let a = setTimeout(() => {
					r.resize();
				}, 100);
				e._observedCanvases.set(t.target, [r, a]);
			});
		}));
	}
	static observe(t, n) {
		e._initializeObserver(), !e._observedCanvases.has(t) && (e._observedCanvases.set(t, [n, 0]), e._observer?.observe(t));
	}
	static unobserve(t) {
		let n = e._observedCanvases.get(t);
		if (n) {
			let e = n[1];
			e && clearTimeout(e);
		}
		e._observer?.unobserve(t), e._observedCanvases.delete(t), !e._observedCanvases.size && e._observer && (e._observer.disconnect(), e._observer = null);
	}
};
r(P, `_observer`, null), r(P, `_observedCanvases`, /* @__PURE__ */ new Map());
function de(e) {
	return /^#([\da-f]{6}|[\da-f]{8})$/iu.test(e);
}
function fe(e) {
	if (!de(e)) return [
		0,
		0,
		0,
		0
	];
	let t = e.replace(`#`, ``);
	return t = t.length === 6 ? `${t}ff` : t, [
		parseInt(t.slice(0, 2), 16) / 255,
		parseInt(t.slice(2, 4), 16) / 255,
		parseInt(t.slice(4, 6), 16) / 255,
		parseInt(t.slice(6, 8), 16) / 255
	];
}
function F(e) {
	if (e.byteLength < 4) return !1;
	let t = new Uint8Array(e.slice(0, c.byteLength));
	for (let e = 0; e < c.length; e += 1) if (c[e] !== t[e]) return !1;
	return !0;
}
function pe(e) {
	return ee.every((t) => Object.hasOwn(e, t));
}
function I(e) {
	return typeof e == `string` ? /^\s*\{/u.test(e) && /\}\s*$/u.test(e) : pe(e);
}
function L() {
	return 1 + ((s ? window.devicePixelRatio : 1) - 1) * .75;
}
function R(e) {
	let t = e.getBoundingClientRect(), n = window.innerHeight || document.documentElement.clientHeight, r = window.innerWidth || document.documentElement.clientWidth;
	return !(t.bottom < 0 || t.top > n || t.right < 0 || t.left > r);
}
function z(e) {
	let t = e.target;
	if (t instanceof HTMLCanvasElement) {
		let n = t.getBoundingClientRect();
		if (n.width === 0 || n.height === 0 || t.width === 0 || t.height === 0) return null;
		let r = t.width / n.width, i = t.height / n.height, a = (e.clientX - n.left) * r, o = (e.clientY - n.top) * i;
		return !Number.isFinite(a) || !Number.isFinite(o) || Number.isNaN(a) || Number.isNaN(o) ? null : {
			x: a,
			y: o
		};
	}
	return null;
}
function me(e) {
	return new Promise((t, n) => {
		let r = new FileReader();
		r.onerror = () => n(r.error ?? Error(`Failed to read image slot source`)), r.onload = () => t(r.result), r.readAsDataURL(e);
	});
}
async function B(e) {
	if (!/^https?:\/\//i.test(e)) return e;
	let t = await fetch(e);
	if (!t.ok) throw Error(`Failed to fetch image slot source from URL: ${e}. ${t.status}: ${t.statusText}`);
	return me(await t.blob());
}
function V(e) {
	let t = e.replace(`OpenUrl: `, ``), n = t.indexOf(` | Target: `), r, i;
	n === -1 ? (r = t, i = `_blank`) : (r = t.substring(0, n), i = t.substring(n + 11)), window.open(r, i);
}
function he(e, t, n) {
	let r = null, i = t;
	async function a(t) {
		await e({ module_or_path: t });
	}
	async function o(t) {
		let n = await fetch(t);
		if (!n.ok) throw Error(`fetch ${t} responded with ${n.status} ${n.statusText}`);
		await e({ module_or_path: await n.arrayBuffer() });
	}
	return {
		load() {
			if (!r) {
				let e = i, t = n;
				r = (async () => {
					let n, i;
					try {
						await a(e);
						return;
					} catch (r) {
						n = r, console.warn(`Primary WASM load failed from ${e}: ${r.message}`), console.warn(`Attempting to load WASM from backup URL: ${t}`);
					}
					try {
						await a(t);
						return;
					} catch (e) {
						i = e, console.warn(`Backup WASM load failed from ${t}: ${e.message}`);
					}
					console.warn(`Retrying WASM load with buffered instantiation`);
					try {
						await o(e);
						return;
					} catch (t) {
						console.warn(`Buffered WASM load from ${e} failed: ${t.message}`);
					}
					try {
						await o(t);
						return;
					} catch (e) {
						throw console.error(`Primary WASM URL failed: ${n.message}`), console.error(`Backup WASM URL failed: ${i.message}`), console.error(`Buffered fallback failed: ${e.message}`), r = null, Error(`WASM loading failed from all sources.`);
					}
				})();
			}
			return r;
		},
		setWasmUrl(e) {
			e !== i && (i = e, r = null);
		}
	};
}
var H = null;
function U() {
	return H ?? (H = he(j, `https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.79.0/dist/dotlottie-player.wasm`, `https://unpkg.com/@lottiefiles/dotlottie-web@0.79.0/dist/dotlottie-player.wasm`)), H;
}
var W = (e) => {
	switch (e) {
		case `reverse`: return O.Reverse;
		case `bounce`: return O.Bounce;
		case `reverse-bounce`: return O.ReverseBounce;
		default: return O.Forward;
	}
};
var G = (e) => {
	switch (e) {
		case O.Reverse: return `reverse`;
		case O.Bounce: return `bounce`;
		case O.ReverseBounce: return `reverse-bounce`;
		default: return `forward`;
	}
};
var ge = (e) => {
	switch (e) {
		case `contain`: return `contain`;
		case `cover`: return `cover`;
		case `fill`: return `fill`;
		case `fit-height`: return `fit-height`;
		case `fit-width`: return `fit-width`;
		case `none`: return `none`;
		default: return `contain`;
	}
};
var _e = class {
	constructor(e) {
		r(this, `_canvas`, null), r(this, `_pendingLoad`, null), r(this, `_srcFetchAbort`, null), r(this, `_context`, null), r(this, `_eventManager`, void 0), r(this, `_animationFrameId`, null), r(this, `_frameManager`, void 0), r(this, `_boundAnimationLoop`, void 0), r(this, `_dotLottieCore`, null), r(this, `_stateMachineId`, ``), r(this, `_stateMachineConfig`, null), r(this, `_isStateMachineRunning`, !1), r(this, `_renderConfig`, {}), r(this, `_isFrozen`, !1), r(this, `_backgroundColor`, null), r(this, `_lastFrameTime`, null), r(this, `_boundOnClick`, null), r(this, `_boundOnPointerUp`, null), r(this, `_boundOnPointerDown`, null), r(this, `_boundOnPointerMove`, null), r(this, `_boundOnPointerEnter`, null), r(this, `_boundOnPointerLeave`, null), r(this, `_bufferMismatchCount`, 0), r(this, `_lastExpectedBufferSize`, 0), r(this, `_cachedImageData`, null), r(this, `_cachedImageDataBuffer`, null), r(this, `_cachedImageDataByteOffset`, 0), r(this, `_marker`, ``), r(this, `_segment`, null), this._canvas = e.canvas ?? null, this._eventManager = new M(), this._frameManager = new o(), this._boundAnimationLoop = this._animationLoop.bind(this), this._renderConfig = {
			...e.renderConfig,
			devicePixelRatio: e.renderConfig?.devicePixelRatio || L(),
			freezeOnOffscreen: e.renderConfig?.freezeOnOffscreen ?? !0
		};
		let t = null;
		e.src && !e.data && (this._srcFetchAbort = new AbortController(), t = this._fetchData(e.src, this._srcFetchAbort.signal), t.catch(() => {})), this._initWasm().then(() => {
			this._dotLottieCore = this._createCore(), this._dotLottieCore.set_autoplay(e.autoplay ?? !1), this._dotLottieCore.set_loop(e.loop ?? !1), this._dotLottieCore.set_loop_count(e.loopCount ?? 0), this._dotLottieCore.set_mode(W(e.mode ?? `forward`)), this._dotLottieCore.set_speed(e.speed ?? 1), this._dotLottieCore.set_use_frame_interpolation(e.useFrameInterpolation ?? !0), e.segment && e.segment.length === 2 && (this._segment = [e.segment[0], e.segment[1]], this._dotLottieCore.set_segment(this._segment[0], this._segment[1])), this._marker = e.marker ?? ``, this._marker && this._dotLottieCore.set_marker(this._marker), this._dotLottieCore.set_layout(e.layout?.fit ?? `contain`, e.layout?.align?.[0] ?? .5, e.layout?.align?.[1] ?? .5), this._applyAssetResolver(e.assetResolver ?? null), this._stateMachineId = e.stateMachineId ?? ``, this._stateMachineConfig = e.stateMachineConfig ?? null, this._onCoreCreated(), this._eventManager.dispatch({ type: `ready` }), e.data ? this._canvas ? this._loadFromData(e.data) : this._pendingLoad = { data: e.data } : e.src && (this._canvas ? this._loadFromSrc(e.src, t) : this._pendingLoad = {
				src: e.src,
				dataPromise: t
			}), e.backgroundColor && this.setBackgroundColor(e.backgroundColor);
		}).catch((e) => {
			this._srcFetchAbort?.abort(), console.error(`[dotlottie-web] Initialization failed:`, e), this._eventManager.dispatch({
				type: `loadError`,
				error: Error(`Failed to load wasm module: ${e}`)
			});
		});
	}
	async _initWasm() {
		return U().load();
	}
	_createCore() {
		return new se();
	}
	_onCoreCreated() {}
	_setupTarget(e, t) {
		return this._dotLottieCore ? this._dotLottieCore.setup_sw_target(e, t) : !1;
	}
	_drainPlayerEvents({ skipFrame: e = !1 } = {}) {
		if (!this._dotLottieCore) return;
		let t;
		for (; (t = this._dotLottieCore.poll_event()) != null;) {
			let n = t;
			switch (n.type) {
				case `Load`:
					setTimeout(() => this._eventManager.dispatch({ type: `load` }), 0);
					break;
				case `LoadError`:
					setTimeout(() => this._eventManager.dispatch({
						type: `loadError`,
						error: Error(`failed to load`)
					}), 0);
					break;
				case `Play`:
					queueMicrotask(() => this._eventManager.dispatch({ type: `play` }));
					break;
				case `Pause`:
					queueMicrotask(() => this._eventManager.dispatch({ type: `pause` }));
					break;
				case `Stop`:
					queueMicrotask(() => this._eventManager.dispatch({ type: `stop` }));
					break;
				case `Frame`:
					e || queueMicrotask(() => this._eventManager.dispatch({
						type: `frame`,
						currentFrame: n.frameNo ?? 0
					}));
					break;
				case `Render`:
					e || queueMicrotask(() => this._eventManager.dispatch({
						type: `render`,
						currentFrame: n.frameNo ?? 0
					}));
					break;
				case `Loop`:
					queueMicrotask(() => this._eventManager.dispatch({
						type: `loop`,
						loopCount: n.loopCount ?? 0
					}));
					break;
				case `Complete`: queueMicrotask(() => this._eventManager.dispatch({ type: `complete` }));
			}
		}
	}
	_discardPlayerEvents() {
		for (; this._dotLottieCore?.poll_event() != null;);
	}
	_drainSmEvents() {
		if (!this._dotLottieCore) return;
		let e;
		for (; (e = this._dotLottieCore.sm_poll_event()) != null;) {
			let t = e;
			switch (t.type) {
				case `Start`:
					queueMicrotask(() => {
						this._isStateMachineRunning = !0, this._eventManager.dispatch({ type: `stateMachineStart` }), this._startAnimationLoop();
					});
					break;
				case `Stop`:
					queueMicrotask(() => {
						this._isStateMachineRunning = !1, this._eventManager.dispatch({ type: `stateMachineStop` }), this._dotLottieCore?.status() !== k.Playing && this._stopAnimationLoop();
					});
					break;
				case `CustomEvent`:
					this._eventManager.dispatch({
						type: `stateMachineCustomEvent`,
						eventName: t.message ?? ``
					});
					break;
				case `BooleanInputChange`:
					this._eventManager.dispatch({
						type: `stateMachineBooleanInputValueChange`,
						inputName: t.name ?? ``,
						newValue: t.newValue,
						oldValue: t.oldValue
					});
					break;
				case `NumericInputChange`:
					this._eventManager.dispatch({
						type: `stateMachineNumericInputValueChange`,
						inputName: t.name ?? ``,
						newValue: t.newValue,
						oldValue: t.oldValue
					});
					break;
				case `StringInputChange`:
					this._eventManager.dispatch({
						type: `stateMachineStringInputValueChange`,
						inputName: t.name ?? ``,
						newValue: t.newValue,
						oldValue: t.oldValue
					});
					break;
				case `InputFired`:
					this._eventManager.dispatch({
						type: `stateMachineInputFired`,
						inputName: t.name ?? ``
					});
					break;
				case `Transition`:
					this._eventManager.dispatch({
						type: `stateMachineTransition`,
						fromState: t.previousState ?? ``,
						toState: t.newState ?? ``
					});
					break;
				case `StateEntered`:
					this._eventManager.dispatch({
						type: `stateMachineStateEntered`,
						state: t.state ?? ``
					});
					break;
				case `StateExit`:
					this._eventManager.dispatch({
						type: `stateMachineStateExit`,
						state: t.state ?? ``
					});
					break;
				case `Error`: this._eventManager.dispatch({
					type: `stateMachineError`,
					error: t.message ?? ``
				});
			}
		}
		let t;
		for (; (t = this._dotLottieCore.sm_poll_internal_event()) != null;) {
			let e = t;
			if (e.type === `Message`) {
				let t = e.message ?? ``;
				s && t.startsWith(`OpenUrl: `) ? V(t) : this._eventManager.dispatch({
					type: `stateMachineInternalMessage`,
					message: t
				});
			}
		}
	}
	_dispatchError(e) {
		console.error(e), this._eventManager.dispatch({
			type: `loadError`,
			error: Error(e)
		});
	}
	async _fetchData(e, t = null) {
		let n = await fetch(e, { signal: t });
		if (!n.ok) throw Error(`Failed to fetch animation data from URL: ${e}. ${n.status}: ${n.statusText}`);
		let r = await n.arrayBuffer();
		return F(r) ? r : new TextDecoder().decode(r);
	}
	_loadFromData(e) {
		if (this._dotLottieCore === null) return;
		if (!this._canvas) {
			console.warn(`[dotlottie-web] Cannot load animation without canvas. Call setCanvas() first.`);
			return;
		}
		this._syncCanvasSize(), this._setupTarget(this._canvas.width, this._canvas.height);
		let t = !1;
		if (typeof e == `string`) {
			if (t = this._dotLottieCore.load_animation(e), !t && !I(e)) {
				this._discardPlayerEvents(), this._dispatchError(`Invalid Lottie JSON string: The provided string does not conform to the Lottie JSON format.`);
				return;
			}
		} else if (e instanceof ArrayBuffer) {
			if (!F(e)) {
				this._dispatchError(`Invalid dotLottie ArrayBuffer: The provided ArrayBuffer does not conform to the dotLottie format.`);
				return;
			}
			t = this._dotLottieCore.load_dotlottie_data(new Uint8Array(e));
		} else if (typeof e == `object`) {
			if (!I(e)) {
				this._dispatchError(`Invalid Lottie JSON object: The provided object does not conform to the Lottie JSON format.`);
				return;
			}
			t = this._dotLottieCore.load_animation(JSON.stringify(e));
		} else {
			this._dispatchError(`Unsupported data type for animation data. Expected:
          - string (Lottie JSON),
          - ArrayBuffer (dotLottie),
          - object (Lottie JSON).
          Received: ${typeof e}`);
			return;
		}
		if (t) {
			if (this._renderConfig.quality !== void 0 && this._dotLottieCore.set_quality(this._renderConfig.quality), this._drainPlayerEvents({ skipFrame: !!this._marker || !!this._segment }), this._marker && this._dotLottieCore.set_marker(this._marker), this._segment) {
				this._dotLottieCore.set_segment(this._segment[0], this._segment[1]);
				let e = G(this._dotLottieCore.mode()), t = e === `reverse` || e === `reverse-bounce` ? this._segment[1] : this._segment[0];
				this._dotLottieCore.set_frame(t);
			}
			setTimeout(() => {
				this._eventManager.dispatch({
					type: `frame`,
					currentFrame: this.currentFrame
				});
			}, 0), this._dotLottieCore.render(), this._drainPlayerEvents(), this._draw(), this._stateMachineId ? this.stateMachineLoad(this._stateMachineId) && this.stateMachineStart() && this._startAnimationLoop() : this._dotLottieCore.status() === k.Playing && this._startAnimationLoop(), s && this._canvas instanceof HTMLCanvasElement && (this._renderConfig.freezeOnOffscreen && (N.observe(this._canvas, this), R(this._canvas) || this.freeze()), this._renderConfig.autoResize && P.observe(this._canvas, this));
		} else this._drainPlayerEvents();
	}
	_loadFromSrc(e, t) {
		(t ?? this._fetchData(e)).then((e) => this._loadFromData(e)).catch((t) => this._dispatchError(`Failed to load animation data from URL: ${e}. ${t}`));
	}
	get buffer() {
		return this._dotLottieCore ? this._dotLottieCore.get_pixel_buffer() : null;
	}
	get activeAnimationId() {
		return this._dotLottieCore?.animation_id() ?? void 0;
	}
	get activeThemeId() {
		return this._dotLottieCore?.theme_id() ?? void 0;
	}
	get layout() {
		if (this._dotLottieCore) return {
			align: [this._dotLottieCore.layout_align_x(), this._dotLottieCore.layout_align_y()],
			fit: ge(this._dotLottieCore.layout_fit())
		};
	}
	get marker() {
		return this._dotLottieCore?.current_marker() ?? ``;
	}
	get manifest() {
		try {
			let e = this._dotLottieCore?.manifest_string();
			if (this._dotLottieCore === null || !e) return null;
			let t = JSON.parse(e);
			return Object.keys(t).length === 0 ? null : t;
		} catch {
			return null;
		}
	}
	get renderConfig() {
		return this._renderConfig;
	}
	get segment() {
		if (this._dotLottieCore) return [this._dotLottieCore.segment_start(), this._dotLottieCore.segment_end()];
	}
	get loop() {
		return this._dotLottieCore?.loop_animation() ?? !1;
	}
	get mode() {
		return this._dotLottieCore ? G(this._dotLottieCore.mode()) : `forward`;
	}
	get isFrozen() {
		return this._isFrozen;
	}
	get isStateMachineRunning() {
		return this._isStateMachineRunning;
	}
	get backgroundColor() {
		return this._backgroundColor ?? ``;
	}
	get autoplay() {
		return this._dotLottieCore?.autoplay() ?? !1;
	}
	get useFrameInterpolation() {
		return this._dotLottieCore?.use_frame_interpolation() ?? !1;
	}
	get speed() {
		return this._dotLottieCore?.speed() ?? 0;
	}
	get isReady() {
		return this._dotLottieCore !== null;
	}
	get isLoaded() {
		return (this._dotLottieCore?.status() ?? k.Idle) !== k.Idle;
	}
	get isPlaying() {
		return this._dotLottieCore?.status() === k.Playing;
	}
	get isPaused() {
		return this._dotLottieCore?.status() === k.Paused;
	}
	get isStopped() {
		return this._dotLottieCore?.status() === k.Stopped;
	}
	get currentFrame() {
		return this._dotLottieCore ? Math.round(this._dotLottieCore.current_frame() * 100) / 100 : 0;
	}
	get loopCount() {
		return this._dotLottieCore?.current_loop_count() ?? 0;
	}
	get totalFrames() {
		return this._dotLottieCore?.total_frames() ?? 0;
	}
	get duration() {
		return (this._dotLottieCore?.duration() ?? 0) / 1e3;
	}
	get canvas() {
		return this._canvas;
	}
	load(e) {
		this._dotLottieCore !== null && (this._stopAnimationLoop(), this._cleanupCanvas(), this._isFrozen = !1, this._dotLottieCore.set_autoplay(e.autoplay ?? !1), this._dotLottieCore.set_loop(e.loop ?? !1), this._dotLottieCore.set_loop_count(e.loopCount ?? 0), this._dotLottieCore.set_mode(W(e.mode ?? `forward`)), this._dotLottieCore.set_speed(e.speed ?? 1), this._dotLottieCore.set_use_frame_interpolation(e.useFrameInterpolation ?? !0), e.segment && e.segment.length === 2 ? (this._segment = [e.segment[0], e.segment[1]], this._dotLottieCore.set_segment(this._segment[0], this._segment[1])) : (this._segment = null, this._dotLottieCore.clear_segment()), this._marker = e.marker ?? ``, this._marker ? this._dotLottieCore.set_marker(this._marker) : this._dotLottieCore.clear_marker(), this._dotLottieCore.set_layout(e.layout?.fit ?? `contain`, e.layout?.align?.[0] ?? .5, e.layout?.align?.[1] ?? .5), this._applyAssetResolver(e.assetResolver ?? null), e.data ? this._canvas ? this._loadFromData(e.data) : this._pendingLoad = { data: e.data } : e.src && (this._canvas ? this._loadFromSrc(e.src) : this._pendingLoad = { src: e.src }), e.backgroundColor && this.setBackgroundColor(e.backgroundColor));
	}
	_draw() {
		if (this._dotLottieCore === null || this._canvas === null || (!this._context && `getContext` in this._canvas && typeof this._canvas.getContext == `function` && (!s || typeof HTMLCanvasElement < `u` && this._canvas instanceof HTMLCanvasElement || typeof OffscreenCanvas < `u` && this._canvas instanceof OffscreenCanvas) && (this._context = this._canvas.getContext(`2d`)), !this._context)) return;
		let e = this._dotLottieCore.get_pixel_buffer(), t = this._canvas.width, n = this._canvas.height, r = t * n * 4;
		if (e.byteLength !== r) {
			this._lastExpectedBufferSize === r ? this._bufferMismatchCount += 1 : (this._bufferMismatchCount = 1, this._lastExpectedBufferSize = r), this._bufferMismatchCount === 10 && console.warn(`[dotlottie-web] Persistent buffer size mismatch detected. Expected ${r} bytes for canvas ${t}x${n}, but got ${e.byteLength} bytes. This may indicate a WASM memory allocation issue or invalid canvas dimensions.`);
			return;
		}
		this._bufferMismatchCount = 0, this._lastExpectedBufferSize = r;
		let i = this._cachedImageData;
		if (!(i !== null && i.width === t && i.height === n && i.data.byteLength === r && this._cachedImageDataBuffer === e.buffer && this._cachedImageDataByteOffset === e.byteOffset)) {
			if (typeof ImageData > `u`) this._cachedImageData = this._context.createImageData(t, n);
			else {
				let r = new Uint8ClampedArray(e.buffer, e.byteOffset, e.byteLength);
				this._cachedImageData = new ImageData(r, t, n);
			}
			this._cachedImageDataBuffer = e.buffer, this._cachedImageDataByteOffset = e.byteOffset;
		}
		if (typeof ImageData > `u`) {
			let t = new Uint8ClampedArray(e.buffer, e.byteOffset, e.byteLength);
			this._cachedImageData.data.set(t);
		}
		this._context.putImageData(this._cachedImageData, 0, 0);
	}
	_cleanupCanvas() {
		this._canvas && s && this._canvas instanceof HTMLCanvasElement && (N.unobserve(this._canvas), P.unobserve(this._canvas), this._cleanupStateMachineListeners());
	}
	_initializeCanvas() {
		this._setupRendererOnCanvas(), this._canvas && s && this._canvas instanceof HTMLCanvasElement && this.isLoaded && (this._renderConfig.freezeOnOffscreen && (N.observe(this._canvas, this), R(this._canvas) || this.freeze()), this._renderConfig.autoResize && P.observe(this._canvas, this), this._isStateMachineRunning && this._setupStateMachineListeners()), this._canvas && this._dotLottieCore && this.isLoaded && this._setupTarget(this._canvas.width, this._canvas.height) && (this._dotLottieCore.render(), this._draw());
	}
	_setupRendererOnCanvas() {
		this._context = null;
	}
	_stopAnimationLoop() {
		this._animationFrameId !== null && (this._frameManager.cancelAnimationFrame(this._animationFrameId), this._animationFrameId = null), this._lastFrameTime = null;
	}
	_startAnimationLoop() {
		this._animationFrameId === null && this._dotLottieCore && !this._isFrozen && (this._dotLottieCore.status() === k.Playing || this._isStateMachineRunning) && (this._animationFrameId = this._frameManager.requestAnimationFrame(this._boundAnimationLoop));
	}
	_animationLoop(e) {
		if (this._dotLottieCore === null) {
			this._stopAnimationLoop();
			return;
		}
		if (this._dotLottieCore.status() !== k.Playing && !this._isStateMachineRunning) {
			this._stopAnimationLoop();
			return;
		}
		try {
			let t = this._lastFrameTime === null ? 0 : e - this._lastFrameTime;
			this._lastFrameTime = e;
			let n = this._isStateMachineRunning ? this._dotLottieCore.sm_tick(t) : this._dotLottieCore.tick(t);
			this._isStateMachineRunning ? this._drainSmEvents() : this._drainPlayerEvents(), n && this._draw(), this._animationFrameId = this._frameManager.requestAnimationFrame(this._boundAnimationLoop);
		} catch (e) {
			console.error(`Error in animation frame:`, e), this._eventManager.dispatch({
				type: `renderError`,
				error: e
			}), e instanceof WebAssembly.RuntimeError && this.destroy();
		}
	}
	play() {
		if (this._dotLottieCore === null || !this.isLoaded) return;
		this._stopAnimationLoop();
		let e = this._dotLottieCore.play();
		this._drainPlayerEvents(), (e || this._dotLottieCore.status() === k.Playing) && (this._isFrozen = !1, this._startAnimationLoop()), this._canvas && s && this._canvas instanceof HTMLCanvasElement && this._renderConfig.freezeOnOffscreen && !R(this._canvas) && this.freeze();
	}
	pause() {
		this._dotLottieCore !== null && (this._dotLottieCore.pause(), this._drainPlayerEvents(), this._stopAnimationLoop());
	}
	stop() {
		if (this._dotLottieCore === null) return;
		let e = this._dotLottieCore.stop();
		this._drainPlayerEvents(), this._stopAnimationLoop(), e && (this._eventManager.dispatch({
			type: `frame`,
			currentFrame: this.currentFrame
		}), this._dotLottieCore.render(), this._draw());
	}
	setFrame(e) {
		if (this._dotLottieCore !== null && this._dotLottieCore.set_frame(e)) {
			let e = this._dotLottieCore.render();
			this._drainPlayerEvents(), e && this._draw();
		}
	}
	setSpeed(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_speed(e);
	}
	setBackgroundColor(e) {
		if (this._dotLottieCore !== null) {
			if (s && this._canvas instanceof HTMLCanvasElement) this._canvas.style.backgroundColor = e;
			else {
				let [t, n, r, i] = fe(e);
				this._dotLottieCore.set_background(t, n, r, i);
			}
			this._backgroundColor = e;
		}
	}
	setLoop(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_loop(e);
	}
	setLoopCount(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_loop_count(e);
	}
	setUseFrameInterpolation(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_use_frame_interpolation(e);
	}
	_applyAssetResolver(e) {
		if (this._dotLottieCore !== null) {
			if (e === null) {
				this._dotLottieCore.set_asset_resolver(null);
				return;
			}
			this._dotLottieCore.set_asset_resolver((t) => {
				try {
					return e(t) ?? null;
				} catch (e) {
					return console.error(`[dotlottie-web] assetResolver threw for "${t}":`, e), null;
				}
			});
		}
	}
	addEventListener(e, t) {
		this._eventManager.addEventListener(e, t);
	}
	removeEventListener(e, t) {
		this._eventManager.removeEventListener(e, t);
	}
	destroy() {
		this._stopAnimationLoop(), this._isStateMachineRunning = !1, this._cleanupCanvas(), this._srcFetchAbort?.abort(), this._srcFetchAbort = null, this._pendingLoad = null;
		let e = this._dotLottieCore;
		if (this._dotLottieCore = null, this._context = null, e) try {
			e.free();
		} catch (e) {
			console.warn(`[dotlottie-web] Error freeing wasm core during destroy:`, e);
		}
		this._eventManager.dispatch({ type: `destroy` }), this._eventManager.removeAllEventListeners(), this._cleanupStateMachineListeners();
	}
	freeze() {
		this._animationFrameId !== null && (this._stopAnimationLoop(), this._isFrozen = !0, this._eventManager.dispatch({ type: `freeze` }));
	}
	unfreeze() {
		this._animationFrameId === null && (this._isFrozen = !1, this._eventManager.dispatch({ type: `unfreeze` }), this._startAnimationLoop());
	}
	_syncCanvasSize() {
		if (!(s && this._canvas instanceof HTMLCanvasElement)) return;
		let e = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1, { height: t, width: n } = this._canvas.getBoundingClientRect();
		t !== 0 && n !== 0 && (this._canvas.width = n * e, this._canvas.height = t * e);
	}
	resize() {
		!this._dotLottieCore || !this.isLoaded || !this._canvas || (this._syncCanvasSize(), this._setupTarget(this._canvas.width, this._canvas.height) && (this._dotLottieCore.render(), this._draw()));
	}
	setCanvas(e) {
		if (!(!e || this._canvas === e) && (this._canvas && this._cleanupCanvas(), this._canvas = e, this._initializeCanvas(), this._pendingLoad)) {
			let e = this._pendingLoad;
			this._pendingLoad = null, e.data ? this._loadFromData(e.data) : e.src && this._loadFromSrc(e.src, e.dataPromise);
		}
	}
	setTransform(e) {
		if (!this._dotLottieCore) return !1;
		let t = this._dotLottieCore.set_transform(new Float32Array(e));
		return t && this._dotLottieCore.render() && this._draw(), t;
	}
	getTransform() {
		if (!this._dotLottieCore) return;
		let e = this._dotLottieCore.get_transform();
		return Array.from(e);
	}
	setSegment(e, t) {
		this._dotLottieCore !== null && (this._segment = [e, t], this._dotLottieCore.set_segment(e, t));
	}
	resetSegment() {
		this._dotLottieCore !== null && (this._segment = null, this._dotLottieCore.clear_segment());
	}
	setMode(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_mode(W(e));
	}
	setRenderConfig(e) {
		let { devicePixelRatio: t, freezeOnOffscreen: n, quality: r, ...i } = e;
		this._renderConfig = {
			...this._renderConfig,
			...i,
			devicePixelRatio: t || L(),
			freezeOnOffscreen: n ?? !0,
			...r !== void 0 && { quality: r }
		}, r !== void 0 && this._dotLottieCore && this._dotLottieCore.set_quality(r), s && this._canvas instanceof HTMLCanvasElement && (this._renderConfig.autoResize ? P.observe(this._canvas, this) : P.unobserve(this._canvas), this._renderConfig.freezeOnOffscreen ? (N.observe(this._canvas, this), R(this._canvas) || this.freeze()) : (N.unobserve(this._canvas), this._isFrozen && this.unfreeze()));
	}
	loadAnimation(e) {
		this._dotLottieCore === null || this._dotLottieCore.animation_id() === e || !this._canvas || (this._syncCanvasSize(), this._setupTarget(this._canvas.width, this._canvas.height), this._dotLottieCore.load_animation_from_id(e) ? (this._renderConfig.quality !== void 0 && this._dotLottieCore.set_quality(this._renderConfig.quality), this._drainPlayerEvents(), this._dotLottieCore.render(), this._draw()) : this._dispatchError(`Failed to load animation with id: ${e}`));
	}
	setMarker(e) {
		this._dotLottieCore !== null && (this.markers().some((t) => t.name === e) ? (this._marker = e, this._dotLottieCore.set_marker(e)) : (this._marker = ``, this._segment = null, this._dotLottieCore.clear_marker(), this._dotLottieCore.clear_segment()));
	}
	markers() {
		let e = this._dotLottieCore?.markers();
		return e && Array.isArray(e) ? e : [];
	}
	setTheme(e) {
		if (this._dotLottieCore === null) return !1;
		let t = this._dotLottieCore.set_theme(e);
		return t && (this._dotLottieCore.render(), this._draw()), t;
	}
	resetTheme() {
		if (this._dotLottieCore === null) return !1;
		let e = this._dotLottieCore.reset_theme();
		return e && (this._dotLottieCore.render(), this._draw()), e;
	}
	setThemeData(e) {
		if (this._dotLottieCore === null) return !1;
		let t = typeof e == `string` ? e : JSON.stringify(e), n = this._dotLottieCore.set_theme_data(t);
		return n && (this._dotLottieCore.render(), this._draw()), n;
	}
	setSlots(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_slots_str(JSON.stringify(e)) && (this._dotLottieCore.render(), this._draw());
	}
	_isKeyframeArray(e) {
		return Array.isArray(e) && e.length > 0 && typeof e[0] == `object` && e[0] !== null && `t` in e[0] && `s` in e[0];
	}
	getSlotIds() {
		if (!this._dotLottieCore) return [];
		let e = this._dotLottieCore.get_slot_ids();
		return Array.isArray(e) ? e : [];
	}
	getSlotType(e) {
		if (!this._dotLottieCore) return;
		let t = this._dotLottieCore.get_slot_type(e);
		if (t) return t;
	}
	getSlot(e) {
		if (!this._dotLottieCore) return;
		let t = this._dotLottieCore.get_slot_str(e);
		if (t) try {
			return JSON.parse(t);
		} catch {
			return;
		}
	}
	getSlots() {
		if (!this._dotLottieCore) return {};
		try {
			return JSON.parse(this._dotLottieCore.get_slots_str());
		} catch {
			return {};
		}
	}
	setColorSlot(e, t) {
		if (this._dotLottieCore === null) return !1;
		let n = this._isKeyframeArray(t), r = JSON.stringify({
			a: +!!n,
			k: t
		}), i = this._dotLottieCore.set_slot_str(e, r);
		return this._dotLottieCore.render(), this._draw(), i;
	}
	setScalarSlot(e, t) {
		if (this._dotLottieCore === null) return !1;
		let n = JSON.stringify({
			a: typeof t == `number` ? 0 : 1,
			k: t
		}), r = this._dotLottieCore.set_slot_str(e, n);
		return this._dotLottieCore.render(), this._draw(), r;
	}
	setVectorSlot(e, t) {
		if (this._dotLottieCore === null) return !1;
		let n = this._isKeyframeArray(t), r = JSON.stringify({
			a: +!!n,
			k: t
		}), i = this._dotLottieCore.set_slot_str(e, r);
		return this._dotLottieCore.render(), this._draw(), i;
	}
	setGradientSlot(e, t, n) {
		if (this._dotLottieCore === null) return !1;
		let r = this._isKeyframeArray(t), i = JSON.stringify({
			k: {
				a: +!!r,
				k: t
			},
			p: n
		}), a = this._dotLottieCore.set_slot_str(e, i);
		return this._dotLottieCore.render(), this._draw(), a;
	}
	setTextSlot(e, t) {
		if (this._dotLottieCore === null) return !1;
		let n = this._dotLottieCore.get_slot_str(e), r = t;
		if (n) {
			let e = JSON.parse(n);
			if (e && `k` in e && Array.isArray(e.k)) {
				let n = e.k[0];
				`s` in n && typeof n.s == `object` && (r = {
					...n.s,
					...t
				});
			}
		}
		let i = JSON.stringify({
			a: 0,
			k: [{
				t: 0,
				s: r
			}]
		}), a = this._dotLottieCore.set_slot_str(e, i);
		return this._dotLottieCore.render(), this._draw(), a;
	}
	async setImageSlot(e, t) {
		if (this._dotLottieCore === null) return !1;
		let n = await B(t);
		if (this._dotLottieCore === null) return !1;
		let r = this._dotLottieCore.set_image_slot(e, n);
		return this._dotLottieCore.render(), this._draw(), r;
	}
	resetSlot(e) {
		if (this._dotLottieCore === null) return !1;
		let t = this._dotLottieCore.reset_slot(e);
		return this._dotLottieCore.render(), this._draw(), t;
	}
	clearSlot(e) {
		if (this._dotLottieCore === null) return !1;
		let t = this._dotLottieCore.clear_slot(e);
		return this._dotLottieCore.render(), this._draw(), t;
	}
	resetSlots() {
		if (this._dotLottieCore === null) return !1;
		let e = this._dotLottieCore.reset_slots();
		return this._dotLottieCore.render(), this._draw(), e;
	}
	clearSlots() {
		if (this._dotLottieCore === null) return !1;
		let e = this._dotLottieCore.clear_slots();
		return this._dotLottieCore.render(), this._draw(), e;
	}
	setLayout(e) {
		this._dotLottieCore !== null && this._dotLottieCore.set_layout(e.fit ?? `contain`, e.align?.[0] ?? .5, e.align?.[1] ?? .5);
	}
	setViewport(e, t, n, r) {
		return this._dotLottieCore === null ? !1 : this._dotLottieCore.set_viewport(e, t, n, r);
	}
	static setWasmUrl(e) {
		U().setWasmUrl(e);
	}
	static preload() {
		return U().load();
	}
	static async registerFont(e, t) {
		try {
			await U().load();
			let n;
			if (typeof t == `string`) {
				let e = await fetch(t);
				if (!e.ok) return console.error(`Failed to fetch font from URL: ${t}. Status: ${e.status}`), !1;
				n = new Uint8Array(await e.arrayBuffer());
			} else n = t instanceof Uint8Array ? t : new Uint8Array(t);
			let r = oe(e, n);
			return r || console.error(`Failed to register font "${e}". Font data may be invalid.`), r;
		} catch (t) {
			return console.error(`Error registering font "${e}":`, t), !1;
		}
	}
	animationSize() {
		let e = this._dotLottieCore?.animation_size();
		return {
			width: e?.[0] ?? 0,
			height: e?.[1] ?? 0
		};
	}
	stateMachineLoad(e) {
		return this._dotLottieCore ? this._dotLottieCore.state_machine_load_from_id(e) : !1;
	}
	stateMachineLoadData(e) {
		return this._dotLottieCore ? this._dotLottieCore.state_machine_load(e) : !1;
	}
	stateMachineSetConfig(e) {
		this._stateMachineConfig = e;
	}
	stateMachineStart() {
		if (this._dotLottieCore === null) return !1;
		let e = this._dotLottieCore.sm_start(this._stateMachineConfig?.openUrlPolicy?.requireUserInteraction ?? !0, this._stateMachineConfig?.openUrlPolicy?.whitelist ?? []);
		return this._drainSmEvents(), e && (this._isStateMachineRunning = !0, this._setupStateMachineListeners(), this._startAnimationLoop()), e;
	}
	stateMachineStop() {
		if (!this._dotLottieCore) return !1;
		let e = this._dotLottieCore.sm_stop();
		return this._drainSmEvents(), e && (this._isStateMachineRunning = !1, this._cleanupStateMachineListeners(), this._dotLottieCore.status() !== k.Playing && this._stopAnimationLoop()), e;
	}
	stateMachineGetStatus() {
		return this._dotLottieCore?.sm_status() ?? ``;
	}
	stateMachineGetCurrentState() {
		return this._dotLottieCore?.sm_current_state() ?? ``;
	}
	stateMachineGetActiveId() {
		return this._dotLottieCore?.state_machine_id() ?? ``;
	}
	stateMachineOverrideState(e, t = !1) {
		return this._dotLottieCore?.sm_override_current_state(e, t) ?? !1;
	}
	stateMachineSetSeed(e) {
		return this._dotLottieCore?.sm_set_seed(BigInt(Math.trunc(e))) ?? !1;
	}
	stateMachineGet(e) {
		return this._dotLottieCore?.get_state_machine(e) ?? ``;
	}
	stateMachineGetListeners() {
		if (!this._dotLottieCore) return [];
		let e = this._dotLottieCore.sm_framework_setup();
		return Array.isArray(e) ? e : [];
	}
	stateMachineSetBooleanInput(e, t) {
		return this._dotLottieCore?.sm_set_boolean_input(e, t) ?? !1;
	}
	stateMachineSetNumericInput(e, t) {
		return this._dotLottieCore?.sm_set_numeric_input(e, t) ?? !1;
	}
	stateMachineSetStringInput(e, t) {
		return this._dotLottieCore?.sm_set_string_input(e, t) ?? !1;
	}
	stateMachineGetBooleanInput(e) {
		return this._dotLottieCore?.sm_get_boolean_input(e) ?? void 0;
	}
	stateMachineGetNumericInput(e) {
		return this._dotLottieCore?.sm_get_numeric_input(e) ?? void 0;
	}
	stateMachineGetStringInput(e) {
		return this._dotLottieCore?.sm_get_string_input(e) ?? void 0;
	}
	stateMachineGetInputs() {
		if (!this._dotLottieCore) return [];
		let e = this._dotLottieCore.sm_get_inputs();
		return Array.isArray(e) ? e : [];
	}
	stateMachineFireEvent(e) {
		this._dotLottieCore?.sm_fire(e);
	}
	stateMachinePostClickEvent(e, t) {
		this._dotLottieCore?.sm_post_click(e, t);
	}
	stateMachinePostPointerUpEvent(e, t) {
		this._dotLottieCore?.sm_post_pointer_up(e, t);
	}
	stateMachinePostPointerDownEvent(e, t) {
		this._dotLottieCore?.sm_post_pointer_down(e, t);
	}
	stateMachinePostPointerMoveEvent(e, t) {
		this._dotLottieCore?.sm_post_pointer_move(e, t);
	}
	stateMachinePostPointerEnterEvent(e, t) {
		this._dotLottieCore?.sm_post_pointer_enter(e, t);
	}
	stateMachinePostPointerExitEvent(e, t) {
		this._dotLottieCore?.sm_post_pointer_exit(e, t);
	}
	_onClick(e) {
		let t = z(e);
		t && this.stateMachinePostClickEvent(t.x, t.y);
	}
	_onPointerUp(e) {
		let t = z(e);
		t && this.stateMachinePostPointerUpEvent(t.x, t.y);
	}
	_onPointerDown(e) {
		let t = z(e);
		t && this.stateMachinePostPointerDownEvent(t.x, t.y);
	}
	_onPointerMove(e) {
		let t = z(e);
		t && this.stateMachinePostPointerMoveEvent(t.x, t.y);
	}
	_onPointerEnter(e) {
		let t = z(e);
		t && this.stateMachinePostPointerEnterEvent(t.x, t.y);
	}
	_onPointerLeave(e) {
		let t = z(e);
		t && this.stateMachinePostPointerExitEvent(t.x, t.y);
	}
	_setupStateMachineListeners() {
		if (s && this._canvas instanceof HTMLCanvasElement && this._dotLottieCore !== null && this.isLoaded) {
			let e = this.stateMachineGetListeners();
			this._cleanupStateMachineListeners(), e.includes(`Click`) && (this._boundOnClick = this._onClick.bind(this), this._canvas.addEventListener(`click`, this._boundOnClick)), e.includes(`PointerUp`) && (this._boundOnPointerUp = this._onPointerUp.bind(this), this._canvas.addEventListener(`pointerup`, this._boundOnPointerUp)), e.includes(`PointerDown`) && (this._boundOnPointerDown = this._onPointerDown.bind(this), this._canvas.addEventListener(`pointerdown`, this._boundOnPointerDown)), e.includes(`PointerMove`) && (this._boundOnPointerMove = this._onPointerMove.bind(this), this._canvas.addEventListener(`pointermove`, this._boundOnPointerMove)), e.includes(`PointerEnter`) && (this._boundOnPointerEnter = this._onPointerEnter.bind(this), this._canvas.addEventListener(`pointerenter`, this._boundOnPointerEnter)), e.includes(`PointerExit`) && (this._boundOnPointerLeave = this._onPointerLeave.bind(this), this._canvas.addEventListener(`pointerleave`, this._boundOnPointerLeave));
		}
	}
	_cleanupStateMachineListeners() {
		s && this._canvas instanceof HTMLCanvasElement && (this._boundOnClick && (this._canvas.removeEventListener(`click`, this._boundOnClick), this._boundOnClick = null), this._boundOnPointerUp && (this._canvas.removeEventListener(`pointerup`, this._boundOnPointerUp), this._boundOnPointerUp = null), this._boundOnPointerDown && (this._canvas.removeEventListener(`pointerdown`, this._boundOnPointerDown), this._boundOnPointerDown = null), this._boundOnPointerMove && (this._canvas.removeEventListener(`pointermove`, this._boundOnPointerMove), this._boundOnPointerMove = null), this._boundOnPointerEnter && (this._canvas.removeEventListener(`pointerenter`, this._boundOnPointerEnter), this._boundOnPointerEnter = null), this._boundOnPointerLeave && (this._canvas.removeEventListener(`pointerleave`, this._boundOnPointerLeave), this._boundOnPointerLeave = null));
	}
};
//#endregion
//#region node_modules/@lottiefiles/dotlottie-vue/dist/dotlottie.js
var DotLottieVue = (0, vue_exports.defineComponent)({
	props: {
		animationId: {
			type: String,
			required: false
		},
		autoplay: {
			type: Boolean,
			required: false
		},
		backgroundColor: {
			type: String,
			required: false
		},
		data: {
			type: [String, ArrayBuffer],
			required: false
		},
		loop: {
			type: Boolean,
			required: false
		},
		loopCount: {
			type: Number,
			required: false
		},
		mode: {
			type: String,
			required: false
		},
		renderConfig: {
			type: Object,
			required: false
		},
		segment: {
			type: Array,
			required: false
		},
		speed: {
			type: Number,
			required: false
		},
		src: {
			type: String,
			required: false
		},
		useFrameInterpolation: {
			type: Boolean,
			required: false
		},
		marker: {
			type: String,
			required: false
		},
		playOnHover: {
			type: Boolean,
			required: false
		},
		themeData: {
			type: String,
			required: false
		},
		themeId: {
			type: String,
			required: false
		},
		layout: {
			type: Object,
			required: false
		},
		stateMachineId: {
			type: String,
			required: false
		},
		stateMachineConfig: {
			type: Object,
			required: false
		}
	},
	setup(props, { attrs, expose }) {
		const canvas = (0, vue_exports.ref)(void 0);
		const { animationId, backgroundColor, data, layout, loop, loopCount, marker, mode, playOnHover, renderConfig, segment, speed, src, stateMachineConfig, stateMachineId, themeId, useFrameInterpolation } = (0, vue_exports.toRefs)(props);
		let dotLottie = null;
		const shouldAutoplay = (0, vue_exports.computed)(() => {
			let _shouldAutoplay = props.autoplay;
			if (typeof playOnHover?.value !== "undefined" && playOnHover.value) _shouldAutoplay = false;
			return _shouldAutoplay;
		});
		/**
		* Wrap dotLottie-web's load function
		*/
		const load = (config = {}) => {
			if (dotLottie === null) return;
			dotLottie.load({
				animationId: animationId?.value,
				backgroundColor: backgroundColor?.value,
				data: data?.value,
				layout: layout?.value,
				loop: loop?.value,
				loopCount: loopCount?.value,
				marker: marker?.value,
				mode: mode?.value,
				autoplay: shouldAutoplay.value,
				renderConfig: renderConfig?.value,
				segment: segment?.value,
				speed: speed?.value,
				src: src?.value,
				stateMachineConfig: stateMachineConfig?.value,
				stateMachineId: stateMachineId?.value,
				themeId: themeId?.value,
				useFrameInterpolation: useFrameInterpolation?.value,
				...config
			});
		};
		(0, vue_exports.watch)(() => backgroundColor?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setBackgroundColor(newVal);
		});
		(0, vue_exports.watch)(() => marker?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setMarker(newVal);
		});
		(0, vue_exports.watch)(() => loop?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setLoop(newVal);
		});
		(0, vue_exports.watch)(() => loopCount?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setLoopCount(newVal);
		});
		(0, vue_exports.watch)(() => mode?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setMode(newVal);
		});
		(0, vue_exports.watch)(() => segment?.value, (newVal) => {
			if (!dotLottie) return;
			const startFrame = newVal?.[0];
			const endFrame = newVal?.[1];
			if (typeof startFrame === "number" && typeof endFrame === "number") dotLottie.setSegment(startFrame, endFrame);
		});
		(0, vue_exports.watch)(() => speed?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setSpeed(newVal);
		});
		(0, vue_exports.watch)(() => useFrameInterpolation?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setUseFrameInterpolation(newVal);
		});
		(0, vue_exports.watch)(() => animationId?.value, (newVal) => {
			if (dotLottie?.isLoaded && typeof newVal !== "undefined" && newVal !== dotLottie.activeAnimationId) dotLottie.loadAnimation(newVal);
		});
		(0, vue_exports.watch)(() => props.themeData, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setThemeData(newVal);
		});
		(0, vue_exports.watch)(() => themeId?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setTheme(newVal);
		});
		function hoverHandler(event) {
			if (event.type === "mouseenter") dotLottie?.play();
			else dotLottie?.pause();
		}
		(0, vue_exports.watch)(() => playOnHover?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined" && newVal) {
				canvas.value?.addEventListener("mouseenter", hoverHandler);
				canvas.value?.addEventListener("mouseleave", hoverHandler);
			} else {
				canvas.value?.removeEventListener("mouseenter", hoverHandler);
				canvas.value?.removeEventListener("mouseleave", hoverHandler);
			}
		});
		(0, vue_exports.watch)(() => layout?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setLayout(newVal);
		}, { deep: true });
		(0, vue_exports.watch)(() => renderConfig?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") dotLottie.setRenderConfig(newVal);
		}, { deep: true });
		(0, vue_exports.watch)(() => data?.value, (newVal) => {
			if (dotLottie && (typeof newVal === "object" || typeof newVal === "string")) load({ data: newVal });
		}, { deep: true });
		(0, vue_exports.watch)(() => src?.value, (newVal) => {
			if (dotLottie && typeof newVal !== "undefined") load({ src: newVal });
		});
		(0, vue_exports.watch)(() => stateMachineId?.value, (newVal) => {
			if (dotLottie?.isLoaded) if (typeof newVal === "string" && newVal) {
				if (dotLottie.stateMachineLoad(newVal)) dotLottie.stateMachineStart();
			} else dotLottie.stateMachineStop();
		});
		(0, vue_exports.watch)(() => stateMachineConfig?.value, (newVal) => {
			if (dotLottie) dotLottie.stateMachineSetConfig(newVal ?? null);
		}, { deep: true });
		(0, vue_exports.onMounted)(() => {
			if (!canvas.value) return;
			dotLottie = new _e({
				canvas: canvas.value,
				...props,
				autoplay: shouldAutoplay.value
			});
			if (playOnHover?.value) {
				canvas.value.addEventListener("mouseenter", hoverHandler);
				canvas.value.addEventListener("mouseleave", hoverHandler);
			}
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			canvas.value?.removeEventListener("mouseenter", hoverHandler);
			canvas.value?.removeEventListener("mouseleave", hoverHandler);
			dotLottie?.destroy();
		});
		expose({ getDotLottieInstance: () => dotLottie });
		return () => (0, vue_exports.h)("div", { ...attrs }, (0, vue_exports.h)("canvas", {
			style: "height: 100%; width: 100%",
			ref: canvas
		}));
	}
});
//#endregion
//#region resources/js/Store/storeInfo.js
var useStoreInfo = (0, import_pinia_prod.defineStore)("storeInfo", () => {
	const page = usePage();
	const storeInfo = (0, vue_exports.computed)(() => page.props.storeInfo || null);
	const fetchStoreData = () => {};
	return {
		storeInfo,
		fetchStoreData
	};
});
//#endregion
//#region resources/js/components/Footer.vue
var _sfc_main$4 = {
	__name: "Footer",
	__ssrInlineRender: true,
	setup(__props) {
		const homeStore = useHomeStore();
		const storeInfo = useStoreInfo();
		(0, vue_exports.onMounted)(() => {
			storeInfo.fetchStoreData();
		});
		const siteInfo = (0, vue_exports.computed)(() => storeInfo.storeInfo);
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		const page = usePage();
		const showTrustBadges = (0, vue_exports.computed)(() => {
			const url = page.url || "";
			return !url.startsWith("/login") && !url.startsWith("/register");
		});
		const footer = (0, vue_exports.computed)(() => page.props.layout?.footer ?? {});
		const columns = (0, vue_exports.computed)(() => footer.value.columns ?? []);
		const badges = (0, vue_exports.computed)(() => footer.value.badges ?? []);
		const badgeLottie = {
			security: "/assets/images/icons/lottieSecurity.lottie",
			support: "/assets/images/icons/lottieCustomerSupport.lottie",
			delivery: "/assets/images/icons/lottieDelivery.lottie"
		};
		const hoveredBadge = (0, vue_exports.ref)(null);
		const isMobile = (0, vue_exports.ref)(false);
		(0, vue_exports.onMounted)(() => {
			const checkMobile = () => {
				isMobile.value = window.innerWidth < 768;
			};
			checkMobile();
			window.addEventListener("resize", checkMobile);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			if (showTrustBadges.value && footer.value.show_badges !== false && badges.value.length) {
				_push(`<div class="bg-[#FFFAF4] py-16" data-v-bd2a09a2><div class="container" data-v-bd2a09a2><div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-v-bd2a09a2><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(badges.value, (badge, index) => {
					_push(`<div class="trust-badge-card bg-[#FFF5E6] rounded-xl p-8 flex flex-col items-center text-center" data-v-bd2a09a2><div class="badge-icon-frame text-theme" data-v-bd2a09a2>`);
					if (isMobile.value || hoveredBadge.value === index) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DotLottieVue), {
						class: ["badge-lottie", { "badge-lottie--delivery": badge.icon === "delivery" }],
						src: badgeLottie[badge.icon] ?? badgeLottie.security,
						autoplay: "",
						loop: ""
					}, null, _parent));
					else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DotLottieVue), {
						class: ["badge-lottie", { "badge-lottie--delivery": badge.icon === "delivery" }],
						src: badgeLottie[badge.icon] ?? badgeLottie.security
					}, null, _parent));
					_push(`</div><h4 class="title-2 text-gray-800 mb-2" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(badge.title)}</h4><p class="body-1-r text-gray-500" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(badge.text)}</p></div>`);
				});
				_push(`<!--]--></div></div></div>`);
			} else _push(`<!---->`);
			_push(`<footer class="bg-[#1C330D] text-white" data-v-bd2a09a2><div class="container" data-v-bd2a09a2><div class="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10" data-v-bd2a09a2><div class="lg:col-span-5 flex flex-col items-start gap-4" data-v-bd2a09a2>`);
			if (footer.value.show_logo !== false) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", (0, vue_exports.unref)(homeStore).logo)} alt="logo" class="site-logo brightness-0 invert max-w-[160px]" data-v-bd2a09a2>`);
			else _push(`<!---->`);
			if (footer.value.about_text) _push(`<p class="body-1-r text-gray-300 leading-relaxed max-w-[280px]" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(footer.value.about_text)}</p>`);
			else _push(`<!---->`);
			_push(`<div data-v-bd2a09a2><p class="body-2-sb text-white mb-2" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(footer.value.follow_label || "Follow Us")}</p>`);
			if (siteInfo.value) {
				_push(`<div class="flex gap-3" data-v-bd2a09a2>`);
				if (siteInfo.value.facebook_url) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", siteInfo.value.facebook_url)} target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 transition-colors" data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none" data-v-bd2a09a2><path d="M33.3333 16.6667C33.3333 7.46667 25.8667 0 16.6667 0C7.46667 0 0 7.46667 0 16.6667C0 24.7333 5.73333 31.45 13.3333 33V21.6667H10V16.6667H13.3333V12.5C13.3333 9.28333 15.95 6.66667 19.1667 6.66667H23.3333V11.6667H20C19.0833 11.6667 18.3333 12.4167 18.3333 13.3333V16.6667H23.3333V21.6667H18.3333V33.25C26.75 32.4167 33.3333 25.3167 33.3333 16.6667Z" fill="white" data-v-bd2a09a2></path></svg></a>`);
				else _push(`<!---->`);
				if (siteInfo.value.tiktok_url) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", siteInfo.value.tiktok_url)} target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 transition-colors" data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" data-v-bd2a09a2><path d="M19.9997 3.3335C16.7033 3.3335 13.481 4.31098 10.7402 6.14234C7.99936 7.97369 5.86315 10.5767 4.60169 13.6221C3.34023 16.6675 3.01017 20.0187 3.65326 23.2517C4.29635 26.4847 5.88369 29.4544 8.21457 31.7853C10.5454 34.1162 13.5152 35.7035 16.7482 36.3466C19.9812 36.9897 23.3323 36.6596 26.3777 35.3982C29.4232 34.1367 32.0261 32.0005 33.8575 29.2597C35.6889 26.5188 36.6663 23.2965 36.6663 20.0002C36.6619 15.5812 34.9046 11.3446 31.7799 8.21992C28.6553 5.09527 24.4186 3.33791 19.9997 3.3335ZM29.898 16.1885V17.2652C29.898 17.3476 29.8816 17.4291 29.8495 17.5051C29.8175 17.581 29.7706 17.6497 29.7115 17.7072C29.6525 17.7647 29.5825 17.8098 29.5058 17.8398C29.429 17.8698 29.3471 17.8841 29.2647 17.8818C27.5049 17.7575 25.8214 17.1149 24.4263 16.0352V23.9152C24.426 24.7873 24.2519 25.6506 23.9142 26.4547C23.5765 27.2588 23.0821 27.9876 22.4597 28.5985C21.8322 29.2254 21.0859 29.7208 20.2646 30.0556C19.4432 30.3904 18.5633 30.558 17.6763 30.5485C15.8928 30.5459 14.1809 29.8461 12.9063 28.5985C12.0953 27.7808 11.5112 26.7661 11.2113 25.6542C10.9115 24.5422 10.9063 23.3714 11.1963 22.2568C11.4613 21.1868 11.9963 20.2035 12.7513 19.4018C13.3144 18.7136 14.0241 18.16 14.8287 17.7814C15.6332 17.4027 16.5122 17.2087 17.4013 17.2135H18.768V20.0518C18.7686 20.1343 18.7516 20.2159 18.7182 20.2912C18.6848 20.3666 18.6357 20.434 18.5742 20.4888C18.5127 20.5437 18.4402 20.5849 18.3615 20.6095C18.2829 20.6342 18.1998 20.6418 18.118 20.6318C17.3245 20.3935 16.4694 20.4725 15.7331 20.8523C14.9967 21.2321 14.4366 21.883 14.1708 22.6677C13.9049 23.4525 13.9542 24.3098 14.3081 25.0589C14.662 25.8081 15.293 26.3905 16.068 26.6835C16.518 26.9418 17.0213 27.0935 17.538 27.1285C17.938 27.1452 18.338 27.0952 18.718 26.9752C19.3524 26.7611 19.9042 26.3545 20.2965 25.812C20.6887 25.2694 20.9019 24.618 20.9063 23.9485V9.59016C20.9063 9.43132 20.9693 9.27896 21.0815 9.16649C21.1937 9.05401 21.3458 8.9906 21.5047 8.99016H23.863C24.0162 8.99035 24.1636 9.04916 24.2749 9.15453C24.3861 9.25989 24.4528 9.40383 24.4613 9.55683C24.5473 10.2922 24.7809 11.0027 25.148 11.6456C25.5152 12.2886 26.0084 12.8507 26.598 13.2985C27.3948 13.8966 28.3412 14.2634 29.333 14.3585C29.4816 14.3712 29.6205 14.4373 29.7241 14.5445C29.8276 14.6518 29.8888 14.7929 29.8963 14.9418L29.898 16.1885Z" fill="white" data-v-bd2a09a2></path></svg></a>`);
				else _push(`<!---->`);
				if (siteInfo.value.instagram_url) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", siteInfo.value.instagram_url)} target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 transition-colors" data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" data-v-bd2a09a2><path d="M22.6834 20.405C22.6734 20.933 22.5068 21.4461 22.2048 21.8793C21.9028 22.3124 21.4789 22.6462 20.987 22.8382C20.4951 23.0303 19.9573 23.072 19.4416 22.958C18.926 22.844 18.4558 22.5795 18.0907 22.198C17.7256 21.8165 17.482 21.3351 17.3907 20.815C17.2995 20.2949 17.3647 19.7594 17.5781 19.2764C17.7915 18.7933 18.1436 18.3846 18.5896 18.1019C19.0356 17.8191 19.5555 17.6752 20.0834 17.6883C20.7849 17.7143 21.4487 18.0125 21.9341 18.5196C22.4195 19.0268 22.6883 19.703 22.6834 20.405Z" fill="white" data-v-bd2a09a2></path><path d="M24.6054 12.0552H15.5638C14.6691 12.0552 13.8111 12.4106 13.1785 13.0432C12.5458 13.6758 12.1904 14.5338 12.1904 15.4285V24.6735C12.1904 25.1165 12.2777 25.5552 12.4472 25.9644C12.6167 26.3737 12.8652 26.7456 13.1785 27.0588C13.4917 27.3721 13.8636 27.6205 14.2728 27.7901C14.6821 27.9596 15.1208 28.0468 15.5638 28.0468H24.6054C25.0484 28.0468 25.4871 27.9596 25.8963 27.7901C26.3056 27.6205 26.6775 27.3721 26.9907 27.0588C27.304 26.7456 27.5525 26.3737 27.722 25.9644C27.8915 25.5552 27.9788 25.1165 27.9788 24.6735V15.4452C27.9805 15.0009 27.8946 14.5607 27.7259 14.1497C27.5572 13.7387 27.309 13.365 26.9957 13.0501C26.6823 12.7351 26.3098 12.4852 25.8997 12.3144C25.4895 12.1437 25.0497 12.0556 24.6054 12.0552ZM20.0838 24.9268C19.1887 24.947 18.3079 24.7001 17.5538 24.2175C16.7997 23.735 16.2065 23.0386 15.8499 22.2174C15.4933 21.3962 15.3894 20.4874 15.5516 19.6069C15.7138 18.7265 16.1346 17.9143 16.7604 17.274C17.3862 16.6338 18.1886 16.1945 19.0651 16.0123C19.9417 15.8301 20.8527 15.9131 21.6818 16.2509C22.5109 16.5887 23.2206 17.1659 23.7202 17.9088C24.2199 18.6516 24.4869 19.5266 24.4871 20.4218C24.4944 21.0069 24.3862 21.5877 24.1687 22.1309C23.9512 22.6741 23.6288 23.1691 23.2198 23.5876C22.8108 24.006 22.3233 24.3397 21.7851 24.5695C21.247 24.7993 20.6689 24.9208 20.0838 24.9268ZM24.9771 15.9185C24.8671 15.9185 24.7582 15.8966 24.6568 15.854C24.5555 15.8114 24.4636 15.7491 24.3866 15.6705C24.3096 15.592 24.2491 15.4989 24.2085 15.3966C24.168 15.2944 24.1482 15.1851 24.1504 15.0752C24.1504 14.8515 24.2393 14.637 24.3974 14.4788C24.5556 14.3207 24.7701 14.2318 24.9938 14.2318C25.2174 14.2318 25.4319 14.3207 25.5901 14.4788C25.7482 14.637 25.8371 14.8515 25.8371 15.0752C25.8404 15.1942 25.818 15.3126 25.7713 15.4222C25.7246 15.5318 25.6548 15.63 25.5666 15.71C25.4784 15.7901 25.374 15.8502 25.2605 15.8862C25.1469 15.9222 25.027 15.9332 24.9088 15.9185H24.9771Z" fill="white" data-v-bd2a09a2></path><path d="M20.0832 3.33322C15.6629 3.31112 11.4149 5.04587 8.2737 8.15584C5.13246 11.2658 3.35532 15.4963 3.33322 19.9165C3.31112 24.3368 5.04587 28.5848 8.15584 31.7261C11.2658 34.8673 15.4963 36.6444 19.9165 36.6665C22.1052 36.6775 24.2747 36.2572 26.3009 35.4298C28.3272 34.6023 30.1707 33.3838 31.7261 31.8439C33.2815 30.304 34.5183 28.4728 35.366 26.4549C36.2137 24.437 36.6556 22.2719 36.6665 20.0832C36.6775 17.8945 36.2572 15.7251 35.4298 13.6988C34.6023 11.6725 33.3838 9.82908 31.8439 8.2737C30.304 6.71831 28.4728 5.48147 26.4549 4.63378C24.437 3.78609 22.2719 3.34416 20.0832 3.33322ZM30.2049 24.5032C30.2095 25.2509 30.0657 25.9921 29.7818 26.6839C29.4978 27.3756 29.0794 28.0041 28.5507 28.5329C28.0221 29.0617 27.3937 29.4803 26.7021 29.7645C26.0104 30.0486 25.2693 30.1926 24.5215 30.1882H15.6482C14.9005 30.1929 14.1593 30.049 13.4676 29.7651C12.7758 29.4811 12.1474 29.0627 11.6186 28.5341C11.0897 28.0054 10.6711 27.3771 10.387 26.6854C10.1028 25.9938 9.95879 25.2526 9.96322 24.5049V15.6299C9.95857 14.8822 10.1024 14.141 10.3863 13.4492C10.6703 12.7575 11.0887 12.129 11.6174 11.6002C12.146 11.0714 12.7744 10.6528 13.466 10.3686C14.1577 10.0845 14.8988 9.94046 15.6465 9.94488H24.5215C25.2691 9.94046 26.0102 10.0844 26.7017 10.3685C27.3932 10.6525 28.0215 11.071 28.5501 11.5996C29.0788 12.1283 29.4972 12.7565 29.7813 13.4481C30.0653 14.1396 30.2093 14.8806 30.2049 15.6282V24.5032Z" fill="white" data-v-bd2a09a2></path></svg></a>`);
				else _push(`<!---->`);
				if (siteInfo.value.youtube_url) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", siteInfo.value.youtube_url)} target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="text-white hover:text-gray-300 transition-colors" data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" data-v-bd2a09a2><path d="M20 3.333C10.795 3.333 3.333 10.795 3.333 20S10.795 36.667 20 36.667 36.667 29.205 36.667 20 29.205 3.333 20 3.333Zm8.63 21.4a2.26 2.26 0 0 1-1.59 1.597c-1.404.378-7.04.378-7.04.378s-5.635 0-7.039-.378a2.26 2.26 0 0 1-1.59-1.598c-.376-1.41-.376-4.35-.376-4.35s0-2.942.376-4.352a2.26 2.26 0 0 1 1.59-1.597c1.404-.378 7.04-.378 7.04-.378s5.635 0 7.039.378a2.26 2.26 0 0 1 1.59 1.597c.376 1.41.376 4.351.376 4.351s0 2.941-.376 4.351Z" fill="white" data-v-bd2a09a2></path><path d="M18.182 23.06 22.89 20.38l-4.708-2.68v5.36Z" fill="white" data-v-bd2a09a2></path></svg></a>`);
				else _push(`<!---->`);
				if (siteInfo.value.x_url) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", siteInfo.value.x_url)} target="_blank" rel="noopener noreferrer" aria-label="X" class="text-white hover:text-gray-300 transition-colors" data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none" data-v-bd2a09a2><path d="M17 0C7.611 0 0 7.611 0 17s7.611 17 17 17 17-7.611 17-17S26.389 0 17 0Zm5.032 25.5-4.79-6.98-5.86 6.98H9.087l7.062-8.41L9 8.5h5.968l4.44 6.47 5.43-6.47h1.296l-6.14 7.313L28 25.5h-5.968Z" fill="white" data-v-bd2a09a2></path><path d="m11.53 9.72 10.31 14.56h1.836L13.366 9.72H11.53Z" fill="#1D2226" data-v-bd2a09a2></path></svg></a>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8" data-v-bd2a09a2><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(columns.value, (column, ci) => {
				_push(`<div data-v-bd2a09a2>`);
				if (column.title) _push(`<h3 class="body-2-sb text-white mb-5" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(column.title)}</h3>`);
				else _push(`<!---->`);
				_push(`<ul class="space-y-3" data-v-bd2a09a2><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(column.links ?? [], (link, li) => {
					_push(`<li data-v-bd2a09a2>`);
					_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
						href: link.url,
						class: "body-1-r text-gray-300 hover:text-white transition-colors"
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(link.label)}`);
							else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(link.label), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul></div>`);
			});
			_push(`<!--]-->`);
			if (footer.value.show_contact !== false) {
				_push(`<div class="col-span-2 md:col-span-1" data-v-bd2a09a2><h3 class="body-2-sb text-white mb-5" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(footer.value.contact_title || "Contact Us")}</h3>`);
				if (siteInfo.value) _push(`<ul class="space-y-4" data-v-bd2a09a2><li data-v-bd2a09a2><a class="flex items-start gap-2 text-gray-300 hover:text-white transition-colors body-1-r"${(0, server_renderer_exports.ssrRenderAttr)("href", `mailto:${siteInfo.value.store_email}`)} data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" class="shrink-0 mt-0.5" data-v-bd2a09a2><path d="M4 9L10.2 13.65C11.2667 14.45 12.7333 14.45 13.8 13.65L20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-bd2a09a2></path><path d="M3 9.2C3 8.45 3.4 7.78 4.03 7.43L11.03 3.54C11.63 3.2 12.37 3.2 12.97 3.54L19.97 7.43C20.6 7.78 21 8.45 21 9.18V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V9.18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-bd2a09a2></path></svg><span data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(siteInfo.value.store_email)}</span></a></li><li data-v-bd2a09a2><a class="flex items-start gap-2 text-gray-300 hover:text-white transition-colors body-1-r"${(0, server_renderer_exports.ssrRenderAttr)("href", `tel:${siteInfo.value.phone_number}`)} data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" class="shrink-0 mt-0.5" data-v-bd2a09a2><path d="M22 16.92V20a2 2 0 0 1-2.18 2 
           19.79 19.79 0 0 1-8.63-3.07 
           19.5 19.5 0 0 1-6-6 
           19.79 19.79 0 0 1-3.07-8.63 
           A2 2 0 0 1 4 2h3.09a2 2 0 0 1 2 1.72 
           c.13 1.21.45 2.38.94 3.47 
           a2 2 0 0 1-.45 2.11L8.09 10.91 
           a16 16 0 0 0 6 6l1.61-1.61 
           a2 2 0 0 1 2.11-.45 
           c1.09.49 2.26.81 3.47.94 
           A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-bd2a09a2></path></svg><span data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(siteInfo.value.phone_number)}</span></a></li><li data-v-bd2a09a2><div class="flex items-start gap-2 text-gray-300 body-1-r" data-v-bd2a09a2><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" class="shrink-0 mt-0.5" data-v-bd2a09a2><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="2" fill="none" data-v-bd2a09a2></path><circle cx="12" cy="9" r="2.5" fill="currentColor" data-v-bd2a09a2></circle></svg><span data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(siteInfo.value.address)}</span></div></li></ul>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div></div><div class="border-t border-white/10 pt-10 pb-[86px] md:pb-10" data-v-bd2a09a2>`);
			if (siteInfo.value?.footer_text) _push(`<p class="body-1-r text-gray-400 text-center mb-3" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(siteInfo.value.footer_text)}</p>`);
			else _push(`<!---->`);
			if (footer.value.copyright) _push(`<p class="body-1-r text-gray-400 text-center" data-v-bd2a09a2>${(0, server_renderer_exports.ssrInterpolate)(footer.value.copyright)}</p>`);
			else {
				_push(`<p class="body-1-r text-gray-400 text-center" data-v-bd2a09a2> Copyright © ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(currentYear))} `);
				if (siteInfo.value) _push(`<!--[-->${(0, server_renderer_exports.ssrInterpolate)(siteInfo.value.app_name)}<!--]-->`);
				else _push(`<!---->`);
				_push(`. All rights reserved | Design &amp; Developed by <a target="_blank" href="https://www.marketorr.com.bd/" class="text-gray-300 hover:text-white transition-colors" data-v-bd2a09a2>Marketorr</a></p>`);
			}
			_push(`</div></footer><!--]-->`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Footer.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var Footer_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-bd2a09a2"]]);
//#endregion
//#region resources/js/components/MobileBottomNav.vue
var _sfc_main$3 = {
	__name: "MobileBottomNav",
	__ssrInlineRender: true,
	setup(__props) {
		const cartStore = useCartStore();
		const authStore = useAuthStore();
		const currentUrl = (0, vue_exports.computed)(() => usePage().url);
		const navItems = (0, vue_exports.computed)(() => [
			{
				label: "Home",
				href: "/",
				activeIcon: "/assets/images/icons/icoHomeActive.svg",
				inactiveIcon: "/assets/images/icons/icoHomeInactive.svg",
				match: (url) => url === "/" || url === "",
				action: null
			},
			{
				label: "Categories",
				href: "/categories",
				activeIcon: "/assets/images/icons/icoCategoriesActive.svg",
				inactiveIcon: "/assets/images/icons/icoCategoriesInActive.svg",
				match: (url) => url.startsWith("/categories") || url.startsWith("/product-category"),
				action: null
			},
			{
				label: "Cart",
				href: null,
				activeIcon: "/assets/images/icons/icoCartActive.svg",
				inactiveIcon: "/assets/images/icons/icoCartInActive.svg",
				match: () => false,
				action: () => cartStore.toggleCart()
			},
			{
				label: "Account",
				href: authStore.isAuthenticated ? "/account" : "/login",
				activeIcon: "/assets/images/icons/icoAccountActive.svg",
				inactiveIcon: "/assets/images/icons/icoAccountInActive.svg",
				match: (url) => url.startsWith("/account") || url.startsWith("/login"),
				action: null
			}
		]);
		const isActive = (item) => item.match(currentUrl.value);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "mobile-bottom-nav" }, _attrs))} data-v-50a4f5cb><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(navItems.value, (item) => {
				_push(`<!--[-->`);
				if (item.action) {
					_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([{ "nav-item--active": isActive(item) }, "nav-item"])}" data-v-50a4f5cb><div class="nav-icon-wrapper" data-v-50a4f5cb><img${(0, server_renderer_exports.ssrRenderAttr)("src", isActive(item) ? item.activeIcon : item.inactiveIcon)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.label)} class="nav-icon" data-v-50a4f5cb>`);
					if (item.label === "Cart" && (0, vue_exports.unref)(cartStore).cartCount > 0) _push(`<span class="cart-badge" data-v-50a4f5cb>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(cartStore).cartCount)}</span>`);
					else _push(`<!---->`);
					_push(`</div><span class="nav-label" data-v-50a4f5cb>${(0, server_renderer_exports.ssrInterpolate)(item.label)}</span></button>`);
				} else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(link_default), {
					href: item.href,
					class: ["nav-item", { "nav-item--active": isActive(item) }]
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", isActive(item) ? item.activeIcon : item.inactiveIcon)}${(0, server_renderer_exports.ssrRenderAttr)("alt", item.label)} class="nav-icon" data-v-50a4f5cb${_scopeId}><span class="nav-label" data-v-50a4f5cb${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(item.label)}</span>`);
						else return [(0, vue_exports.createVNode)("img", {
							src: isActive(item) ? item.activeIcon : item.inactiveIcon,
							alt: item.label,
							class: "nav-icon"
						}, null, 8, ["src", "alt"]), (0, vue_exports.createVNode)("span", { class: "nav-label" }, (0, vue_exports.toDisplayString)(item.label), 1)];
					}),
					_: 2
				}, _parent));
				_push(`<!--]-->`);
			});
			_push(`<!--]--></nav>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/MobileBottomNav.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var MobileBottomNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-50a4f5cb"]]);
//#endregion
//#region resources/js/components/Preloader/Preloader.vue
var _sfc_main$2 = {
	__name: "Preloader",
	__ssrInlineRender: true,
	setup(__props) {
		const globalLoadingState = (0, vue_exports.inject)("globalLoadingState", { isLoading: false });
		const isLoading = (0, vue_exports.computed)(() => globalLoadingState?.isLoading ?? false);
		return (_ctx, _push, _parent, _attrs) => {
			if (isLoading.value) _push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "preloader text-theme" }, _attrs))}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" style="${(0, server_renderer_exports.ssrRenderStyle)({
				"shape-rendering": "auto",
				"display": "block"
			})}" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g transform="rotate(0 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(30 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(60 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(90 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(120 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(150 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(180 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(210 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(240 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(270 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(300 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(330 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g></g></g></svg></div>`);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Preloader/Preloader.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/Auth/LoginPromptModal.vue
var _sfc_main$1 = {
	__name: "LoginPromptModal",
	__ssrInlineRender: true,
	setup(__props) {
		const authPrompt = useAuthPromptStore();
		const goToLogin = () => {
			authPrompt.close();
			router.visit("/login");
		};
		const goToRegister = () => {
			authPrompt.close();
			router.visit("/register");
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$12, _attrs, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderTeleport)(_push, (_push) => {
						if ((0, vue_exports.unref)(authPrompt).isOpen) _push(`<div class="auth-prompt-overlay" data-v-d2578b5e${_scopeId}><div class="auth-prompt-card" role="dialog" aria-modal="true" data-v-d2578b5e${_scopeId}><button type="button" class="auth-prompt-close" aria-label="Close" data-v-d2578b5e${_scopeId}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-d2578b5e${_scopeId}><path d="M18 6 6 18M6 6l12 12" data-v-d2578b5e${_scopeId}></path></svg></button><div class="auth-prompt-icon" data-v-d2578b5e${_scopeId}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-d2578b5e${_scopeId}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-d2578b5e${_scopeId}></path></svg></div><h3 class="auth-prompt-title" data-v-d2578b5e${_scopeId}>Log in to continue</h3><p class="auth-prompt-message" data-v-d2578b5e${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(authPrompt).message)}</p><div class="auth-prompt-actions" data-v-d2578b5e${_scopeId}><button type="button" class="auth-prompt-btn primary" data-v-d2578b5e${_scopeId}> Log in </button><button type="button" class="auth-prompt-btn secondary" data-v-d2578b5e${_scopeId}> Create an account </button></div></div></div>`);
						else _push(`<!---->`);
					}, "body", false, _parent);
					else return [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Teleport, { to: "body" }, [(0, vue_exports.createVNode)(vue_exports.Transition, { name: "auth-prompt-fade" }, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(authPrompt).isOpen ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "auth-prompt-overlay",
							onClick: (0, vue_exports.withModifiers)(($event) => (0, vue_exports.unref)(authPrompt).close(), ["self"])
						}, [(0, vue_exports.createVNode)("div", {
							class: "auth-prompt-card",
							role: "dialog",
							"aria-modal": "true"
						}, [
							(0, vue_exports.createVNode)("button", {
								type: "button",
								class: "auth-prompt-close",
								"aria-label": "Close",
								onClick: ($event) => (0, vue_exports.unref)(authPrompt).close()
							}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								width: "20",
								height: "20",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"stroke-linejoin": "round"
							}, [(0, vue_exports.createVNode)("path", { d: "M18 6 6 18M6 6l12 12" })]))], 8, ["onClick"]),
							(0, vue_exports.createVNode)("div", { class: "auth-prompt-icon" }, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("svg", {
								width: "30",
								height: "30",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "1.8",
								"stroke-linecap": "round",
								"stroke-linejoin": "round"
							}, [(0, vue_exports.createVNode)("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })]))]),
							(0, vue_exports.createVNode)("h3", { class: "auth-prompt-title" }, "Log in to continue"),
							(0, vue_exports.createVNode)("p", { class: "auth-prompt-message" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(authPrompt).message), 1),
							(0, vue_exports.createVNode)("div", { class: "auth-prompt-actions" }, [(0, vue_exports.createVNode)("button", {
								type: "button",
								class: "auth-prompt-btn primary",
								onClick: goToLogin
							}, " Log in "), (0, vue_exports.createVNode)("button", {
								type: "button",
								class: "auth-prompt-btn secondary",
								onClick: goToRegister
							}, " Create an account ")])
						])], 8, ["onClick"])) : (0, vue_exports.createCommentVNode)("", true)]),
						_: 1
					})]))];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Auth/LoginPromptModal.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var LoginPromptModal_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-d2578b5e"]]);
//#endregion
//#region resources/js/Layouts/AppLayout.vue
var _sfc_main = {
	__name: "AppLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const homeStore = useHomeStore();
		const globalLoadingState = (0, vue_exports.reactive)({ isLoading: false });
		(0, vue_exports.provide)("globalLoadingState", globalLoadingState);
		const page = usePage();
		(0, vue_exports.watch)(() => page.props.flash, (next) => {
			if (!next || typeof window === "undefined") return;
			if (next.success) p$1.success(next.success);
			if (next.error) p$1.error(next.error);
		}, { immediate: true });
		const updateFavicon = (faviconUrl) => {
			if (!faviconUrl || typeof document === "undefined") return;
			document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());
			const link = document.createElement("link");
			link.rel = "icon";
			link.href = faviconUrl;
			document.head.appendChild(link);
		};
		(0, vue_exports.watch)(() => homeStore.favicon, (newFavicon) => {
			updateFavicon(newFavicon);
		}, { immediate: true });
		const injectMarketingScripts = () => {
			if (typeof document === "undefined") return;
			document.querySelectorAll(".marketing-script").forEach((el) => el.remove());
			if (!homeStore.siteinfos || !Array.isArray(homeStore.siteinfos.marketing)) return;
			homeStore.siteinfos.marketing.forEach((scriptObj) => {
				if (!scriptObj.script) return;
				document.createRange().createContextualFragment(scriptObj.script.trim()).childNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.TEXT_NODE) {
						node.classList?.add?.("marketing-script");
						document.head.appendChild(node);
					}
				});
				if (scriptObj.name && scriptObj.name.toLowerCase().includes("google tag manager") && scriptObj.second_script) {
					const wrapper = document.createElement("div");
					wrapper.classList.add("marketing-script");
					wrapper.innerHTML = scriptObj.second_script.trim();
					document.body.insertAdjacentElement("afterbegin", wrapper);
				}
			});
		};
		(0, vue_exports.watch)(() => homeStore.siteinfos.marketing, () => {
			injectMarketingScripts();
		}, {
			deep: true,
			immediate: true
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "app-layout" }, _attrs))}>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$12, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(q), null, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(q))];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, null, null, _parent));
			if ((0, vue_exports.unref)(page).props.storeInfo?.maintenance_mode) _push(`<div class="bg-amber-400 text-amber-950 text-center text-sm font-medium px-4 py-2"> Maintenance mode is on — customers see the maintenance page, not this. <a href="/admin/manage" class="underline font-semibold ml-1">Turn it off</a></div>`);
			else _push(`<!---->`);
			_push((0, server_renderer_exports.ssrRenderComponent)(Header_default, null, null, _parent));
			_push(`<div class="pb-[68px] md:pb-0">`);
			(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(Footer_default, null, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(MobileBottomNav_default, null, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(LoginPromptModal_default, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AppLayout.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main$12 as _, useCartStore as a, isVariantOutOfStock as c, p$1 as d, _sfc_main$11 as f, createLucideIcon as g, ChevronDown as h, useHomeStore as i, preOrderNote as l, X as m, useStoreInfo as n, isOutOfStock as o, variantSrcset as p, useWishlistStore as r, isPreOrder as s, _sfc_main as t, useAuthStore as u };

//# sourceMappingURL=AppLayout-D5uzRHsl.js.map