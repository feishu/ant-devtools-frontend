/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(44)('wks');
var uid = __webpack_require__(26);
var Symbol = __webpack_require__(3).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(0);
var ctx = __webpack_require__(12);
var hide = __webpack_require__(10);
var has = __webpack_require__(9);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(8)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7);
var IE8_DOM_DEFINE = __webpack_require__(65);
var toPrimitive = __webpack_require__(47);
var dP = Object.defineProperty;

exports.f = __webpack_require__(5) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(6);
var createDesc = __webpack_require__(23);
module.exports = __webpack_require__(5) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(36);
var defined = __webpack_require__(34);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(60);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(12);
var call = __webpack_require__(103);
var isArrayIter = __webpack_require__(102);
var anObject = __webpack_require__(7);
var toLength = __webpack_require__(46);
var getIterFn = __webpack_require__(71);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(26)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(9);
var setDesc = __webpack_require__(6).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(8)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(70);
var enumBugKeys = __webpack_require__(35);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(114);
var global = __webpack_require__(3);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(14);
var TO_STRING_TAG = __webpack_require__(1)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(7);
var dPs = __webpack_require__(105);
var enumBugKeys = __webpack_require__(35);
var IE_PROTO = __webpack_require__(43)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(64)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(101).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(6).f;
var has = __webpack_require__(9);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(34);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {



/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(111)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(37)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(12);
var IObject = __webpack_require__(36);
var toObject = __webpack_require__(25);
var toLength = __webpack_require__(46);
var asc = __webpack_require__(98);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(3);
var $export = __webpack_require__(2);
var meta = __webpack_require__(15);
var fails = __webpack_require__(8);
var hide = __webpack_require__(10);
var redefineAll = __webpack_require__(39);
var forOf = __webpack_require__(13);
var anInstance = __webpack_require__(30);
var isObject = __webpack_require__(4);
var setToStringTag = __webpack_require__(24);
var dP = __webpack_require__(6).f;
var each = __webpack_require__(31)(0);
var DESCRIPTORS = __webpack_require__(5);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(32);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(20);
var $export = __webpack_require__(2);
var redefine = __webpack_require__(40);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(14);
var $iterCreate = __webpack_require__(104);
var setToStringTag = __webpack_require__(24);
var getPrototypeOf = __webpack_require__(108);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(10);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(2);
var aFunction = __webpack_require__(60);
var ctx = __webpack_require__(12);
var forOf = __webpack_require__(13);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(2);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(44)('keys');
var uid = __webpack_require__(26);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(0);
var global = __webpack_require__(3);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(20) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 45 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(45);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(0);
var LIBRARY = __webpack_require__(20);
var wksExt = __webpack_require__(49);
var defineProperty = __webpack_require__(6).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


// Copied from React repo.

module.exports = {
  IndeterminateComponent: 0, // Before we know whether it is functional or class
  FunctionalComponent: 1,
  ClassComponent: 2,
  HostRoot: 3, // Root of a host tree. Could be nested inside another node.
  HostPortal: 4, // A subtree. Could be an entry point to a different renderer.
  HostComponent: 5,
  HostText: 6,
  CoroutineComponent: 7,
  CoroutineHandlerPhase: 8,
  YieldComponent: 9,
  Fragment: 10
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _extends2 = __webpack_require__(58);

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function copyWithSetImpl(obj, path, idx, value) {
  if (idx >= path.length) {
    return value;
  }
  var key = path[idx];
  var updated = Array.isArray(obj) ? obj.slice() : (0, _extends3.default)({}, obj);
  // $FlowFixMe number or string is fine here
  updated[key] = copyWithSetImpl(obj[key], path, idx + 1, value);
  return updated;
}

function copyWithSet(obj, path, value) {
  return copyWithSetImpl(obj, path, 0, value);
}

module.exports = copyWithSet;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _extends2 = __webpack_require__(58);

var _extends3 = _interopRequireDefault(_extends2);

var _keys = __webpack_require__(19);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(59);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var copyWithSet = __webpack_require__(51);
var getDisplayName = __webpack_require__(53);
var traverseAllChildrenImpl = __webpack_require__(79);

/**
 * Convert a react internal instance to a sanitized data object.
 */
function getData(internalInstance) {
  var children = null;
  var props = null;
  var state = null;
  var context = null;
  var updater = null;
  var name = null;
  var type = null;
  var key = null;
  var ref = null;
  var source = null;
  var text = null;
  var publicInstance = null;
  var nodeType = 'Native';
  // If the parent is a native node without rendered children, but with
  // multiple string children, then the `element` that gets passed in here is
  // a plain value -- a string or number.
  if ((typeof internalInstance === 'undefined' ? 'undefined' : (0, _typeof3.default)(internalInstance)) !== 'object') {
    nodeType = 'Text';
    text = internalInstance + '';
  } else if (internalInstance._currentElement === null || internalInstance._currentElement === false) {
    nodeType = 'Empty';
  } else if (internalInstance._renderedComponent) {
    nodeType = 'NativeWrapper';
    children = [internalInstance._renderedComponent];
    props = internalInstance._instance.props;
    state = internalInstance._instance.state;
    context = internalInstance._instance.context;
    if (context && (0, _keys2.default)(context).length === 0) {
      context = null;
    }
  } else if (internalInstance._renderedChildren) {
    children = childrenList(internalInstance._renderedChildren);
  } else if (internalInstance._currentElement && internalInstance._currentElement.props) {
    // This is a native node without rendered children -- meaning the children
    // prop is the unfiltered list of children.
    // This may include 'null' or even other invalid values, so we need to
    // filter it the same way that ReactDOM does.
    // Instead of pulling in the whole React library, we just copied over the
    // 'traverseAllChildrenImpl' method.
    // https://github.com/facebook/react/blob/240b84ed8e1db715d759afaae85033718a0b24e1/src/isomorphic/children/ReactChildren.js#L112-L158
    var unfilteredChildren = internalInstance._currentElement.props.children;
    var filteredChildren = [];
    traverseAllChildrenImpl(unfilteredChildren, '', // nameSoFar
    function (_traverseContext, child) {
      var childType = typeof child === 'undefined' ? 'undefined' : (0, _typeof3.default)(child);
      if (childType === 'string' || childType === 'number') {
        filteredChildren.push(child);
      }
    }
    // traverseContext
    );
    if (filteredChildren.length <= 1) {
      // children must be an array of nodes or a string or undefined
      // can't be an empty array
      children = filteredChildren.length ? String(filteredChildren[0]) : undefined;
    } else {
      children = filteredChildren;
    }
  }

  if (!props && internalInstance._currentElement && internalInstance._currentElement.props) {
    props = internalInstance._currentElement.props;
  }

  // != used deliberately here to catch undefined and null
  if (internalInstance._currentElement != null) {
    type = internalInstance._currentElement.type;
    if (internalInstance._currentElement.key) {
      key = String(internalInstance._currentElement.key);
    }
    source = internalInstance._currentElement._source;
    ref = internalInstance._currentElement.ref;
    if (typeof type === 'string') {
      name = type;
      if (internalInstance._nativeNode != null) {
        publicInstance = internalInstance._nativeNode;
      }
      if (internalInstance._hostNode != null) {
        publicInstance = internalInstance._hostNode;
      }
    } else if (typeof type === 'function') {
      nodeType = 'Composite';
      name = getDisplayName(type);
      // 0.14 top-level wrapper
      // TODO(jared): The backend should just act as if these don't exist.
      if (internalInstance._renderedComponent && (internalInstance._currentElement.props === internalInstance._renderedComponent._currentElement || internalInstance._currentElement.type.isReactTopLevelWrapper)) {
        nodeType = 'Wrapper';
      }
      if (name === null) {
        name = 'No display name';
      }
    } else if (typeof internalInstance._stringText === 'string') {
      nodeType = 'Text';
      text = internalInstance._stringText;
    } else {
      name = getDisplayName(type);
    }
  }

  if (internalInstance._instance) {
    var inst = internalInstance._instance;

    // A forceUpdate for stateless (functional) components.
    var forceUpdate = inst.forceUpdate || inst.updater && inst.updater.enqueueForceUpdate && function (cb) {
      inst.updater.enqueueForceUpdate(this, cb, 'forceUpdate');
    };
    updater = {
      setState: inst.setState && inst.setState.bind(inst),
      forceUpdate: forceUpdate && forceUpdate.bind(inst),
      setInProps: forceUpdate && setInProps.bind(null, internalInstance, forceUpdate),
      setInState: inst.forceUpdate && setInState.bind(null, inst),
      setInContext: forceUpdate && setInContext.bind(null, inst, forceUpdate)
    };
    if (typeof type === 'function') {
      publicInstance = inst;
    }

    // TODO: React ART currently falls in this bucket, but this doesn't
    // actually make sense and we should clean this up after stabilizing our
    // API for backends
    if (inst._renderedChildren) {
      children = childrenList(inst._renderedChildren);
    }
  }

  if (typeof internalInstance.setNativeProps === 'function') {
    // For editing styles in RN
    updater = {
      setNativeProps: function setNativeProps(nativeProps) {
        internalInstance.setNativeProps(nativeProps);
      }
    };
  }

  return {
    nodeType: nodeType,
    type: type,
    key: key,
    ref: ref,
    source: source,
    name: name,
    props: props,
    state: state,
    context: context,
    children: children,
    text: text,
    updater: updater,
    publicInstance: publicInstance
  };
}

function setInProps(internalInst, forceUpdate, path, value) {
  var element = internalInst._currentElement;
  internalInst._currentElement = (0, _extends3.default)({}, element, {
    props: copyWithSet(element.props, path, value)
  });
  forceUpdate.call(internalInst._instance);
}

function setInState(inst, path, value) {
  setIn(inst.state, path, value);
  inst.forceUpdate();
}

function setInContext(inst, forceUpdate, path, value) {
  setIn(inst.context, path, value);
  forceUpdate.call(inst);
}

function setIn(obj, path, value) {
  var last = path.pop();
  var parent = path.reduce(function (obj_, attr) {
    return obj_ ? obj_[attr] : null;
  }, obj);
  if (parent) {
    parent[last] = value;
  }
}

function childrenList(children) {
  var res = [];
  for (var name in children) {
    res.push(children[name]);
  }
  return res;
}

module.exports = getData;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _weakMap = __webpack_require__(57);

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FB_MODULE_RE = /^(.*) \[from (.*)\]$/;
var cachedDisplayNames = new _weakMap2.default();

function getDisplayName(type) {
  if (cachedDisplayNames.has(type)) {
    return cachedDisplayNames.get(type);
  }

  var displayName = void 0;

  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  if (typeof type.displayName === 'string') {
    displayName = type.displayName;
  }

  if (!displayName) {
    displayName = type.name || 'Unknown';
  }

  // Facebook-specific hack to turn "Image [from Image.react]" into just "Image".
  // We need displayName with module name for error reports but it clutters the DevTools.
  var match = displayName.match(FB_MODULE_RE);
  if (match) {
    var componentName = match[1];
    var moduleName = match[2];
    if (componentName && moduleName) {
      if (moduleName === componentName || moduleName.startsWith(componentName + '.')) {
        displayName = componentName;
      }
    }
  }

  cachedDisplayNames.set(type, displayName);
  return displayName;
}

module.exports = getDisplayName;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(92), __esModule: true };

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(81);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(56);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(55);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(32);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(6).f;
var create = __webpack_require__(21);
var redefineAll = __webpack_require__(39);
var ctx = __webpack_require__(12);
var anInstance = __webpack_require__(30);
var forOf = __webpack_require__(13);
var $iterDefine = __webpack_require__(37);
var step = __webpack_require__(67);
var setSpecies = __webpack_require__(110);
var DESCRIPTORS = __webpack_require__(5);
var fastKey = __webpack_require__(15).fastKey;
var validate = __webpack_require__(17);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(61);
var from = __webpack_require__(95);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(3).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(5) && !__webpack_require__(8)(function () {
  return Object.defineProperty(__webpack_require__(64)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(32);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(16);
var gOPS = __webpack_require__(38);
var pIE = __webpack_require__(22);
var toObject = __webpack_require__(25);
var IObject = __webpack_require__(36);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(8)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(70);
var hiddenKeys = __webpack_require__(35).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(9);
var toIObject = __webpack_require__(11);
var arrayIndexOf = __webpack_require__(96)(false);
var IE_PROTO = __webpack_require__(43)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(61);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(14);
module.exports = __webpack_require__(0).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(3);
var has = __webpack_require__(9);
var DESCRIPTORS = __webpack_require__(5);
var $export = __webpack_require__(2);
var redefine = __webpack_require__(40);
var META = __webpack_require__(15).KEY;
var $fails = __webpack_require__(8);
var shared = __webpack_require__(44);
var setToStringTag = __webpack_require__(24);
var uid = __webpack_require__(26);
var wks = __webpack_require__(1);
var wksExt = __webpack_require__(49);
var wksDefine = __webpack_require__(48);
var enumKeys = __webpack_require__(100);
var isArray = __webpack_require__(66);
var anObject = __webpack_require__(7);
var isObject = __webpack_require__(4);
var toIObject = __webpack_require__(11);
var toPrimitive = __webpack_require__(47);
var createDesc = __webpack_require__(23);
var _create = __webpack_require__(21);
var gOPNExt = __webpack_require__(107);
var $GOPD = __webpack_require__(106);
var $DP = __webpack_require__(6);
var $keys = __webpack_require__(16);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(69).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(22).f = $propertyIsEnumerable;
  __webpack_require__(38).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(20)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(10)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(19);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(80);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = __webpack_require__(29);

var _map2 = _interopRequireDefault(_map);

var _electron = __webpack_require__(134);

var _installReactHook = __webpack_require__(78);

var _installReactHook2 = _interopRequireDefault(_installReactHook);

var _componentsMap = __webpack_require__(133);

var _componentsMap2 = _interopRequireDefault(_componentsMap);

var _attachRenderer = __webpack_require__(75);

var _attachRenderer2 = _interopRequireDefault(_attachRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getData = __webpack_require__(52);

(0, _installReactHook2.default)();

// check devicePixelRatio
console.log('devicePixelRatio', window.devicePixelRatio);

var disposes = [];

window.ipc = _electron.ipcRenderer;

var container = void 0;
var render = null;
var rootNodeIDMap = new _map2.default();

window.rootNodeIDMap = rootNodeIDMap;

var updateQueue = [];

// We can not get styles form the context of react component.
// So we make it by ourselves.
var nodeIdForDom = new _map2.default();
var appxForNodeId = new _map2.default();

window.appxForNodeId = appxForNodeId;

// React devtools gloabl hook.
// The hook is setupped before the <head> dom ready,
// so it can not be install here.
// See installReactHook.js.
var globalHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

globalHook.on('root', function (_ref) {
  var renderer = _ref.renderer,
      internalInstance = _ref.internalInstance;
});
globalHook.on('unmount', function (_ref2) {
  var internalInstance = _ref2.internalInstance;
});
globalHook.on('mount', function (_ref3) {
  var internalInstance = _ref3.internalInstance,
      data = _ref3.data;
});
globalHook.on('update', function (_ref4) {
  var internalInstance = _ref4.internalInstance,
      data = _ref4.data;


  if (data.props && data.props.$tag && data.nodeType === 'Composite') {
    var oldProps = internalInstance.memoizedProps;
    var nodeId = appxForNodeId.get(internalInstance);
    // while nodeId is not found, maybe it is the owner of this instance.
    // so we get out of this intance to check once more.
    if (!nodeId) nodeId = appxForNodeId.get(internalInstance._debugOwner);
    if (nodeId) {
      if (!oldProps) {
        sendMessage({
          method: 'propsModified',
          payload: {
            nodeId: nodeId,
            props: filterProps(data.props.$tag, data.props)
          }
        });
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(oldProps)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (oldProps[key] !== data.props[key]) {
              sendMessage({
                method: 'propsModified',
                payload: {
                  nodeId: nodeId,
                  props: filterProps(data.props.$tag, data.props)
                }
              });
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }
});
globalHook.on('renderer-attached', function (_ref5) {
  var id = _ref5.id,
      renderer = _ref5.renderer,
      helpers = _ref5.helpers;

  helpers.walkTree(function (component, dataType) {}, function (instance) {});
});

function setupBackend(hook) {
  var oldReact = window.React && window.React.__internals;
  if (oldReact && (0, _keys2.default)(hook._renderers).length === 0) {
    hook.inject(oldReact);
  }

  for (var rid in hook._renderers) {
    hook.helpers[rid] = (0, _attachRenderer2.default)(hook, rid, hook._renderers[rid]);
    hook.emit('renderer-attached', { id: rid, renderer: hook._renderers[rid], helpers: hook.helpers[rid] });
  }

  hook.on('renderer', function (_ref6) {
    var id = _ref6.id,
        renderer = _ref6.renderer;

    hook.helpers[id] = (0, _attachRenderer2.default)(hook, id, renderer);
    hook.emit('renderer-attached', { id: id, renderer: renderer, helpers: hook.helpers[id] });
  });

  var shutdown = function shutdown() {
    for (var id in hook.helpers) {
      hook.helpers[id].cleanup();
    }
    hook.off('shutdown', shutdown);
  };
  hook.on('shutdown', shutdown);

  _electron.ipcRenderer.sendToHost('main', 'load-end');

  return true;
}

function findOwner(fiber) {
  if (fiber && fiber.memoizedProps.$tag) {
    return fiber;
  }
  return findOwner(fiber._debugOwner);
}

function handleTinyElemets(dom, getReactElementFromNative) {
  try {
    var fiber = getReactElementFromNative(dom);
    if (fiber && fiber.memoizedProps && fiber.memoizedProps.$tag) return fiber;
    return findOwner(fiber);
  } catch (e) {
    throw new Error(e);
  }
}

function handleStringChildren(children) {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children) && typeof children[0] === 'string') return children.join('');
}

function getTinyData(fiber) {
  var name = fiber.memoizedProps['$tag'];

  var props = getProps(fiber);
  if (!props) return null;

  // 这里需要特殊处理一些 DOM.Node 上面的数据从而使的该节点下面的 child 不被暴露出来
  switch (name) {
    case 'view':
    case 'scroll-view':
    case 'label':
    case 'navigator':
    case 'picker-view':
    case 'picker':
    case 'form':
    case 'radio-group':
    case 'checkbox-group':
    case 'swiper':
    case 'swiper-item':
      break;
    case 'text':
    case 'button':
      props['_childNodeCount'] = 1;
      props['_textValue'] = handleStringChildren(fiber.memoizedProps.children);
      break;
    default:
      props['_childNodeCount'] = 0;
      props['_childNodeValue'] = handleStringChildren(fiber.memoizedProps.children);
      break;
  }

  return {
    name: name,
    props: props
  };
};

function filterProps(name, props, noText) {
  var filteredProps = {};
  var allProps = _componentsMap2.default[name];
  (0, _keys2.default)(allProps && allProps.attributions || []).forEach(function (index) {
    var prop = allProps.attributions[index];
    var propKey = (prop.label || '').replace(/\-([a-z])/g, function (all, letter) {
      return letter.toUpperCase();
    });
    if (props[propKey] || props[propKey] !== 'none' || props[propKey] !== false) filteredProps[propKey] = props[propKey];
  });

  ['className'].forEach(function (prop) {
    if (props[prop] && props[prop] !== 'none' && props[prop].trim() !== 'a-' + name) filteredProps[prop] = props[prop].replace('a-' + name, '').trim();
  });

  if (!noText) filteredProps._textChildren = typeof props.children === 'string' ? props.children : '';

  return filteredProps;
}

function getProps(fiber) {
  var name = fiber.memoizedProps['$tag'];
  if (!fiber || !name) throw new Error('devtools: getProps not found the $tag from', element);
  var allProps = _componentsMap2.default[name];
  var props = filterProps(name, fiber.memoizedProps);

  try {
    var ariaProps = fiber.memoizedProps.$appx.getAriaProps();
    (0, _keys2.default)(ariaProps).forEach(function (key) {
      if (key.match(/^aria/)) props['' + key] = ariaProps[key];else props['aria-' + key] = ariaProps[key];
    });
  } catch (e) {}
  return props;
}

var sendMessage = function sendMessage(_ref7) {
  var method = _ref7.method,
      payload = _ref7.payload,
      error = _ref7.error;

  _electron.ipcRenderer.sendToHost('devtools', {
    method: method, payload: payload, error: error
  });
};

function mappingDomToNodeId(root, dom) {
  nodeIdForDom.set(root.nodeId, dom);
  if (root.children && root.children.length > 0) {
    root.children.forEach(function (next, index) {
      mappingDomToNodeId(next, dom.children[index]);
    });
  }
}

function mappingDomToNodeIdChildren(parent, children, getReactElementFromNative, nodeType) {
  if (!parent) return;
  var reactComponents = [];
  if (nodeType === 'swiper') {
    parent = parent.children[0].children[0];
  }
  if (nodeType === 'swiper-item') {
    parent = parent.children[0];
  }
  if (nodeType === 'picker-view-column') {
    parent = parent.children[2];
  }
  if (children && children.length > 0) {
    children.forEach(function (next, index) {
      reactComponents.push('');
      nodeIdForDom.set(next.nodeId, parent.children[index]);
      if (nodeType === 'swiper') {
        return reactComponents;
      }
      try {
        var fiber = handleTinyElemets(parent.children[index], getReactElementFromNative);
        var speHandled = elementSpecailHandler(fiber);
        if (nodeType !== 'picker-view-column' && nodeType !== 'picker-view') appxForNodeId.set(fiber, next.nodeId);
        var data = getTinyData(speHandled);
        var dom = parent.children[index];
        if (dom.id) {
          data.props.id = dom.id;
        }
        reactComponents[reactComponents.length - 1] = data;
      } catch (e) {
        console.error(e);
      }
    });
  }
  return reactComponents;
}

function elementSpecailHandler(fiber, id) {
  if (fiber.memoizedProps && fiber.memoizedProps.$tag === 'image') {
    return fiber._debugOwner;
  }
  return fiber;
}

function detectGetReactElementFromNative(dom) {
  var help = globalHook.helpers[render];
  if (help) {
    var reactComponent = null;
    try {
      reactComponent = help.getReactElementFromNative(dom);
    } catch (e) {
      console.error('detect', e);return {};
    }
    if (reactComponent) {
      return {
        getReactElementFromNative: help.getReactElementFromNative,
        rootReactDom: reactComponent
      };
    }
  }
  return {};
}

var count = 0;
var initReady = false;
var maxTryOut = 10;

function checkReactRenderFromHook(hook) {
  var ready = false;
  if (!hook || !hook._fiberRoots) return null;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(hook._fiberRoots)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var k = _step2.value;

      var fibers = hook._fiberRoots[k];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(fibers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var fiber = _step3.value;

          if (fiber.containerInfo && fiber.containerInfo.id === '__react-content') {
            ready = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (ready) return k;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return null;
}

function checkReactReady(callback) {
  if (count === maxTryOut) return callback(false);
  count++;
  try {
    var rootDom = document.getElementById('__react-content');
    render = checkReactRenderFromHook(globalHook);
    if (!render) throw new Error('react is not ready');

    var _detectGetReactElemen = detectGetReactElementFromNative(rootDom.children[0].children[0]),
        getReactElementFromNative = _detectGetReactElemen.getReactElementFromNative;

    if (getReactElementFromNative && window.__chromePort__) {
      count = 0;
      callback(true);
    } else {
      setTimeout(function () {
        checkReactReady(callback);
      }, 1000);
    }
  } catch (e) {
    setTimeout(function () {
      checkReactReady(callback);
    }, 1000);
  }
}

var messageHandler = {
  initOnce: function initOnce() {
    checkReactReady(function (ready) {
      if (ready) {
        initReady = true;
        sendMessage({
          method: 'initOnce',
          payload: {
            filePath: window.$page.getPagePath(),
            path: window.location.href
          }
        });
      } else {
        sendMessage({
          error: 'react is not ready'
        });
      }
    });
  },
  refresh: function refresh() {
    nodeIdForDom.clear();
    appxForNodeId.clear();
    rootNodeIDMap.clear();
    sendMessage({ method: 'switchTarget' });
  },
  setDocumentNodeIdOnce: function setDocumentNodeIdOnce(_ref8) {
    var root = _ref8.root;

    var rootDom = document.getElementById('__react-content');

    var _detectGetReactElemen2 = detectGetReactElementFromNative(rootDom.children[0]),
        rootReactDom = _detectGetReactElemen2.rootReactDom;

    nodeIdForDom.set(root.nodeId, rootDom.children[0]);
    updateQueue = [];
    sendMessage({
      method: 'setDocumentNodeIdOnce',
      payload: {}
    });
  },
  setChildNodeIdOnce: function setChildNodeIdOnce(_ref9) {
    var parentId = _ref9.parentId,
        payloads = _ref9.payloads,
        nodeType = _ref9.nodeType;

    var reactComponents = null;
    var realDom = nodeIdForDom.get(parentId);
    var rootDom = document.getElementById('__react-content');

    var _detectGetReactElemen3 = detectGetReactElementFromNative(realDom || rootDom.children[0]),
        getReactElementFromNative = _detectGetReactElemen3.getReactElementFromNative;

    if (getReactElementFromNative) {
      if (nodeIdForDom.size === 0 || !realDom) {
        nodeIdForDom.set(parentId, rootDom.children[0]);
        reactComponents = mappingDomToNodeIdChildren(rootDom.children[0], payloads, getReactElementFromNative);
      } else {
        reactComponents = mappingDomToNodeIdChildren(realDom, payloads, getReactElementFromNative, nodeType);
      }
    }
    sendMessage({
      method: 'setChildNodeIdOnce',
      payload: {
        data: reactComponents
      }
    });
  }
};

// handle all messages from devtools
_electron.ipcRenderer.on('devtools', function (event, args) {
  var method = args.method,
      payload = args.payload;

  if (!initReady) if (['refresh', 'initOnce'].indexOf(method) === -1) return sendMessage({ error: 'react is not ready' });
  if (messageHandler[method]) {
    messageHandler[method](payload);
  } else {
    throw new Error('Error: method ' + method + ' is not defined');
  }
});

setupBackend(globalHook);

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(73);

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _map = __webpack_require__(29);

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getData = __webpack_require__(52);
var attachRendererFiber = __webpack_require__(76);

/**
 * This takes care of patching the renderer to emit events on the global
 * `Hook`. The returned object has a `.cleanup` method to un-patch everything.
 */
function attachRenderer(hook, rid, renderer) {
  var rootNodeIDMap = new _map2.default();
  var extras = {};

  // React Fiber
  if (typeof renderer.findFiberByHostInstance === 'function') {
    return attachRendererFiber(hook, rid, renderer);
  }

  extras.getNativeFromReactElement = function (component) {
    return renderer.ComponentTree.getNodeFromInstance(component);
  };

  extras.getReactElementFromNative = function (node) {
    return renderer.ComponentTree.getClosestInstanceFromNode(node);
  };

  var oldMethods;
  var oldRenderComponent;
  var oldRenderRoot;

  // React DOM
  if (renderer.Mount._renderNewRootComponent) {
    oldRenderRoot = decorateResult(renderer.Mount, '_renderNewRootComponent', function (internalInstance) {
      hook.emit('root', { renderer: rid, internalInstance: internalInstance });
    });
  }

  if (renderer.Reconciler) {
    oldMethods = decorateMany(renderer.Reconciler, {
      mountComponent: function mountComponent(internalInstance, rootID, transaction, context) {
        var data = getData(internalInstance);
        rootNodeIDMap.set(internalInstance._rootNodeID, internalInstance);
        hook.emit('mount', { internalInstance: internalInstance, data: data, renderer: rid });
      },
      performUpdateIfNecessary: function performUpdateIfNecessary(internalInstance, nextChild, transaction, context) {
        hook.emit('update', { internalInstance: internalInstance, data: getData(internalInstance), renderer: rid });
      },
      receiveComponent: function receiveComponent(internalInstance, nextChild, transaction, context) {
        hook.emit('update', { internalInstance: internalInstance, data: getData(internalInstance), renderer: rid });
      },
      unmountComponent: function unmountComponent(internalInstance) {
        hook.emit('unmount', { internalInstance: internalInstance, renderer: rid });
        rootNodeIDMap.delete(internalInstance._rootNodeID, internalInstance);
      }
    });
  }

  extras.walkTree = function (visit, visitRoot) {
    var onMount = function onMount(component, data) {
      rootNodeIDMap.set(component._rootNodeID, component);
      visit(component, data);
    };
    walkRoots(renderer.Mount._instancesByReactRootID || renderer.Mount._instancesByContainerID, onMount, visitRoot, isPre013);
  };

  extras.cleanup = function () {
    if (oldMethods) {
      if (renderer.Component) {
        restoreMany(renderer.Component.Mixin, oldMethods);
      } else {
        restoreMany(renderer.Reconciler, oldMethods);
      }
    }
    if (oldRenderRoot) {
      renderer.Mount._renderNewRootComponent = oldRenderRoot;
    }
    if (oldRenderComponent) {
      renderer.Mount.renderComponent = oldRenderComponent;
    }
    oldMethods = null;
    oldRenderRoot = null;
    oldRenderComponent = null;
  };

  return extras;
}

function walkRoots(roots, onMount, onRoot, isPre013) {
  for (var name in roots) {
    walkNode(roots[name], onMount, isPre013);
    onRoot(roots[name]);
  }
}

function walkNode(internalInstance, onMount, isPre013) {
  var data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
  if (data.children && Array.isArray(data.children)) {
    data.children.forEach(function (child) {
      return walkNode(child, onMount, isPre013);
    });
  }
  onMount(internalInstance, data);
}

function decorateResult(obj, attr, fn) {
  var old = obj[attr];
  obj[attr] = function (instance) {
    var res = old.apply(this, arguments);
    fn(res);
    return res;
  };
  return old;
}

function decorate(obj, attr, fn) {
  var old = obj[attr];
  obj[attr] = function (instance) {
    var res = old.apply(this, arguments);
    fn.apply(this, arguments);
    return res;
  };
  return old;
}

function decorateMany(source, fns) {
  var olds = {};
  for (var name in fns) {
    olds[name] = decorate(source, name, fns[name]);
  }
  return olds;
}

function restoreMany(source, olds) {
  for (var name in olds) {
    source[name] = olds[name];
  }
}

module.exports = attachRenderer;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _set = __webpack_require__(54);

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDataFiber = __webpack_require__(77);

var _require = __webpack_require__(50),
    ClassComponent = _require.ClassComponent,
    HostRoot = _require.HostRoot;

// Inlined from ReactTypeOfSideEffect


var PerformedWork = 1;

function attachRendererFiber(hook, rid, renderer) {
  // This is a slightly annoying indirection.
  // It is currently necessary because DevTools wants
  // to use unique objects as keys for instances.
  // However fibers have two versions.
  // We use this set to remember first encountered fiber for
  // each conceptual instance.
  var opaqueNodes = new _set2.default();
  function getOpaqueNode(fiber) {
    if (opaqueNodes.has(fiber)) {
      return fiber;
    }
    var alternate = fiber.alternate;

    if (alternate != null && opaqueNodes.has(alternate)) {
      return alternate;
    }
    opaqueNodes.add(fiber);
    return fiber;
  }

  function hasDataChanged(prevFiber, nextFiber) {
    if (prevFiber.tag === ClassComponent) {
      // Skip if the class performed no work (shouldComponentUpdate bailout).
      // eslint-disable-next-line no-bitwise
      if ((nextFiber.effectTag & PerformedWork) !== PerformedWork) {
        return false;
      }

      // Only classes have context.
      if (prevFiber.stateNode.context !== nextFiber.stateNode.context) {
        return true;
      }
      // Force updating won't update state or props.
      if (nextFiber.updateQueue != null && nextFiber.updateQueue.hasForceUpdate) {
        return true;
      }
    }
    // Compare the fields that would result in observable changes in DevTools.
    // We don't compare type, tag, index, and key, because these are known to match.
    return prevFiber.memoizedProps !== nextFiber.memoizedProps || prevFiber.memoizedState !== nextFiber.memoizedState || prevFiber.ref !== nextFiber.ref || prevFiber._debugSource !== nextFiber._debugSource;
  }

  var pendingEvents = [];

  function flushPendingEvents() {
    var events = pendingEvents;
    pendingEvents = [];
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      hook.emit(event.type, event);
    }
  }

  function enqueueMount(fiber) {
    pendingEvents.push({
      internalInstance: getOpaqueNode(fiber),
      data: getDataFiber(fiber, getOpaqueNode),
      renderer: rid,
      type: 'mount'
    });

    var isRoot = fiber.tag === HostRoot;
    if (isRoot) {
      pendingEvents.push({
        internalInstance: getOpaqueNode(fiber),
        renderer: rid,
        type: 'root'
      });
    }
  }

  function enqueueUpdateIfNecessary(fiber, hasChildOrderChanged) {
    if (!hasChildOrderChanged && !hasDataChanged(fiber.alternate, fiber)) {
      return;
    }
    pendingEvents.push({
      internalInstance: getOpaqueNode(fiber),
      data: getDataFiber(fiber, getOpaqueNode),
      renderer: rid,
      type: 'update'
    });
  }

  function enqueueUnmount(fiber) {
    var isRoot = fiber.tag === HostRoot;
    var opaqueNode = getOpaqueNode(fiber);
    var event = {
      internalInstance: opaqueNode,
      renderer: rid,
      type: 'unmount'
    };
    if (isRoot) {
      pendingEvents.push(event);
    } else {
      // Non-root fibers are deleted during the commit phase.
      // They are deleted in the child-first order. However
      // DevTools currently expects deletions to be parent-first.
      // This is why we unshift deletions rather than push them.
      pendingEvents.unshift(event);
    }
    opaqueNodes.delete(opaqueNode);
  }

  function mountFiber(fiber) {
    // Depth-first.
    // Logs mounting of children first, parents later.
    var node = fiber;
    outer: while (true) {
      if (node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      enqueueMount(node);
      if (node == fiber) {
        return;
      }
      if (node.sibling) {
        node.sibling.return = node.return;
        node = node.sibling;
        continue;
      }
      while (node.return) {
        node = node.return;
        enqueueMount(node);
        if (node == fiber) {
          return;
        }
        if (node.sibling) {
          node.sibling.return = node.return;
          node = node.sibling;
          continue outer;
        }
      }
      return;
    }
  }

  function updateFiber(nextFiber, prevFiber) {
    var hasChildOrderChanged = false;
    if (nextFiber.child !== prevFiber.child) {
      // If the first child is different, we need to traverse them.
      // Each next child will be either a new child (mount) or an alternate (update).
      var nextChild = nextFiber.child;
      var prevChildAtSameIndex = prevFiber.child;
      while (nextChild) {
        // We already know children will be referentially different because
        // they are either new mounts or alternates of previous children.
        // Schedule updates and mounts depending on whether alternates exist.
        // We don't track deletions here because they are reported separately.
        if (nextChild.alternate) {
          var prevChild = nextChild.alternate;
          updateFiber(nextChild, prevChild);
          // However we also keep track if the order of the children matches
          // the previous order. They are always different referentially, but
          // if the instances line up conceptually we'll want to know that.
          if (!hasChildOrderChanged && prevChild !== prevChildAtSameIndex) {
            hasChildOrderChanged = true;
          }
        } else {
          mountFiber(nextChild);
          if (!hasChildOrderChanged) {
            hasChildOrderChanged = true;
          }
        }
        // Try the next child.
        nextChild = nextChild.sibling;
        // Advance the pointer in the previous list so that we can
        // keep comparing if they line up.
        if (!hasChildOrderChanged && prevChildAtSameIndex != null) {
          prevChildAtSameIndex = prevChildAtSameIndex.sibling;
        }
      }
      // If we have no more children, but used to, they don't line up.
      if (!hasChildOrderChanged && prevChildAtSameIndex != null) {
        hasChildOrderChanged = true;
      }
    }
    enqueueUpdateIfNecessary(nextFiber, hasChildOrderChanged);
  }

  function walkTree() {
    hook.getFiberRoots(rid).forEach(function (root) {
      // Hydrate all the roots for the first time.
      mountFiber(root.current);
    });
    flushPendingEvents();
  }

  function cleanup() {
    // We don't patch any methods so there is no cleanup.
  }

  function handleCommitFiberUnmount(fiber) {
    // This is not recursive.
    // We can't traverse fibers after unmounting so instead
    // we rely on React telling us about each unmount.
    // It will be flushed after the root is committed.
    enqueueUnmount(fiber);
  }

  function handleCommitFiberRoot(root) {
    var current = root.current;
    var alternate = current.alternate;
    if (alternate) {
      // TODO: relying on this seems a bit fishy.
      var wasMounted = alternate.memoizedState != null && alternate.memoizedState.element != null;
      var isMounted = current.memoizedState != null && current.memoizedState.element != null;
      if (!wasMounted && isMounted) {
        // Mount a new root.
        mountFiber(current);
      } else if (wasMounted && isMounted) {
        // Update an existing root.
        updateFiber(current, alternate);
      } else if (wasMounted && !isMounted) {
        // Unmount an existing root.
        enqueueUnmount(current);
      }
    } else {
      // Mount a new root.
      mountFiber(current);
    }
    // We're done here.
    flushPendingEvents();
  }

  // The naming is confusing.
  // They deal with opaque nodes (fibers), not elements.
  function getNativeFromReactElement(fiber) {
    try {
      var opaqueNode = fiber;
      var hostInstance = renderer.findHostInstanceByFiber(opaqueNode);
      return hostInstance;
    } catch (err) {
      // The fiber might have unmounted by now.
      return null;
    }
  }
  function getReactElementFromNative(hostInstance) {
    var fiber = renderer.findFiberByHostInstance(hostInstance);
    if (fiber != null) {
      // TODO: type fibers.
      var opaqueNode = getOpaqueNode(fiber);
      return opaqueNode;
    }
    return null;
  }
  return {
    getNativeFromReactElement: getNativeFromReactElement,
    getReactElementFromNative: getReactElementFromNative,
    handleCommitFiberRoot: handleCommitFiberRoot,
    handleCommitFiberUnmount: handleCommitFiberUnmount,
    cleanup: cleanup,
    walkTree: walkTree
  };
}

module.exports = attachRendererFiber;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _keys = __webpack_require__(19);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var copyWithSet = __webpack_require__(51);
var getDisplayName = __webpack_require__(53);

var _require = __webpack_require__(50),
    FunctionalComponent = _require.FunctionalComponent,
    ClassComponent = _require.ClassComponent,
    HostRoot = _require.HostRoot,
    HostPortal = _require.HostPortal,
    HostComponent = _require.HostComponent,
    HostText = _require.HostText,
    Fragment = _require.Fragment;

// TODO: we might want to change the data structure
// once we no longer suppport Stack versions of `getData`.


function getDataFiber(fiber, getOpaqueNode) {
  var type = fiber.type;
  var key = fiber.key;
  var ref = fiber.ref;
  var source = fiber._debugSource;
  var publicInstance = null;
  var props = null;
  var state = null;
  var children = null;
  var context = null;
  var updater = null;
  var nodeType = null;
  var name = null;
  var text = null;

  switch (fiber.tag) {
    case FunctionalComponent:
    case ClassComponent:
      nodeType = 'Composite';
      name = getDisplayName(fiber.type);
      publicInstance = fiber.stateNode;
      props = fiber.memoizedProps;
      state = fiber.memoizedState;
      if (publicInstance != null) {
        context = publicInstance.context;
        if (context && (0, _keys2.default)(context).length === 0) {
          context = null;
        }
      }
      var inst = publicInstance;
      if (inst) {
        updater = {
          setState: inst.setState && inst.setState.bind(inst),
          forceUpdate: inst.forceUpdate && inst.forceUpdate.bind(inst),
          setInProps: inst.forceUpdate && setInProps.bind(null, fiber),
          setInState: inst.forceUpdate && setInState.bind(null, inst),
          setInContext: inst.forceUpdate && setInContext.bind(null, inst)
        };
      }
      children = [];
      break;
    case HostRoot:
      nodeType = 'Wrapper';
      children = [];
      break;
    case HostPortal:
      nodeType = 'Portal';
      name = 'ReactPortal';
      props = {
        target: fiber.stateNode.containerInfo
      };
      children = [];
      break;
    case HostComponent:
      nodeType = 'Native';
      name = fiber.type;

      // TODO (bvaughn) we plan to remove this prefix anyway.
      // We can cut this special case out when it's gone.
      name = name.replace('topsecret-', '');

      publicInstance = fiber.stateNode;
      props = fiber.memoizedProps;
      if (typeof props.children === 'string' || typeof props.children === 'number') {
        children = props.children.toString();
      } else {
        children = [];
      }
      if (typeof fiber.stateNode.setNativeProps === 'function') {
        // For editing styles in RN
        updater = {
          setNativeProps: function setNativeProps(nativeProps) {
            fiber.stateNode.setNativeProps(nativeProps);
          }
        };
      }
      break;
    case HostText:
      nodeType = 'Text';
      text = fiber.memoizedProps;
      break;
    case Fragment:
      nodeType = 'Wrapper';
      children = [];
      break;
    default:
      // Coroutines and yields
      nodeType = 'Native';
      props = fiber.memoizedProps;
      name = 'TODO_NOT_IMPLEMENTED_YET';
      children = [];
      break;
  }

  if (Array.isArray(children)) {
    var child = fiber.child;
    while (child) {
      children.push(getOpaqueNode(child));
      child = child.sibling;
    }
  }

  return {
    nodeType: nodeType,
    type: type,
    key: key,
    ref: ref,
    source: source,
    name: name,
    props: props,
    state: state,
    context: context,
    children: children,
    text: text,
    updater: updater,
    publicInstance: publicInstance
  };
}

function setInProps(fiber, path, value) {
  var inst = fiber.stateNode;
  fiber.pendingProps = copyWithSet(inst.props, path, value);
  if (fiber.alternate) {
    // We don't know which fiber is the current one because DevTools may bail out of getDataFiber() call,
    // and so the data object may refer to another version of the fiber. Therefore we update pendingProps
    // on both. I hope that this is safe.
    fiber.alternate.pendingProps = fiber.pendingProps;
  }
  fiber.stateNode.forceUpdate();
}

function setInState(inst, path, value) {
  setIn(inst.state, path, value);
  inst.forceUpdate();
}

function setInContext(inst, path, value) {
  setIn(inst.context, path, value);
  inst.forceUpdate();
}

function setIn(obj, path, value) {
  var last = path.pop();
  var parent = path.reduce(function (obj_, attr) {
    return obj_ ? obj_[attr] : null;
  }, obj);
  if (parent) {
    parent[last] = value;
  }
}

module.exports = getDataFiber;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weakMap = __webpack_require__(57);

var _weakMap2 = _interopRequireDefault(_weakMap);

var _map = __webpack_require__(29);

var _map2 = _interopRequireDefault(_map);

var _create = __webpack_require__(82);

var _create2 = _interopRequireDefault(_create);

var _set = __webpack_require__(54);

var _set2 = _interopRequireDefault(_set);

exports.default = installGlobalReactHook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installGlobalReactHook() {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    return;
  }

  function detectReactBuildType(renderer) {
    try {
      if (typeof renderer.version === 'string') {
        // React DOM Fiber (16+)
        if (renderer.bundleType > 0) {
          // This is not a production build.
          // We are currently only using 0 (PROD) and 1 (DEV)
          // but might add 2 (PROFILE) in the future.
          return 'development';
        }

        // React 16 uses flat bundles. If we report the bundle as production
        // version, it means we also minified and envified it ourselves.
        return 'production';
        // Note: There is still a risk that the CommonJS entry point has not
        // been envified or uglified. In this case the user would have *both*
        // development and production bundle, but only the prod one would run.
        // This would be really bad. We have a separate check for this because
        // it happens *outside* of the renderer injection. See `checkDCE` below.
      }
      var toString = Function.prototype.toString;
      if (renderer.Mount && renderer.Mount._renderNewRootComponent) {
        // React DOM Stack
        var renderRootCode = toString.call(renderer.Mount._renderNewRootComponent);
        // Filter out bad results (if that is even possible):
        if (renderRootCode.indexOf('function') !== 0) {
          // Hope for the best if we're not sure.
          return 'production';
        }
        // Check for React DOM Stack < 15.1.0 in development.
        // If it contains "storedMeasure" call, it's wrapped in ReactPerf (DEV only).
        // This would be true even if it's minified, as method name still matches.
        if (renderRootCode.indexOf('storedMeasure') !== -1) {
          return 'development';
        }
        // For other versions (and configurations) it's not so easy.
        // Let's quickly exclude proper production builds.
        // If it contains a warning message, it's either a DEV build,
        // or an PROD build without proper dead code elimination.
        if (renderRootCode.indexOf('should be a pure function') !== -1) {
          // Now how do we tell a DEV build from a bad PROD build?
          // If we see NODE_ENV, we're going to assume this is a dev build
          // because most likely it is referring to an empty shim.
          if (renderRootCode.indexOf('NODE_ENV') !== -1) {
            return 'development';
          }
          // If we see "development", we're dealing with an envified DEV build
          // (such as the official React DEV UMD).
          if (renderRootCode.indexOf('development') !== -1) {
            return 'development';
          }
          // I've seen process.env.NODE_ENV !== 'production' being smartly
          // replaced by `true` in DEV by Webpack. I don't know how that
          // works but we can safely guard against it because `true` was
          // never used in the function source since it was written.
          if (renderRootCode.indexOf('true') !== -1) {
            return 'development';
          }
          // By now either it is a production build that has not been minified,
          // or (worse) this is a minified development build using non-standard
          // environment (e.g. "staging"). We're going to look at whether
          // the function argument name is mangled:
          if (
          // 0.13 to 15
          renderRootCode.indexOf('nextElement') !== -1 ||
          // 0.12
          renderRootCode.indexOf('nextComponent') !== -1) {
            // We can't be certain whether this is a development build or not,
            // but it is definitely unminified.
            return 'unminified';
          } else {
            // This is likely a minified development build.
            return 'development';
          }
        }
        // By now we know that it's envified and dead code elimination worked,
        // but what if it's still not minified? (Is this even possible?)
        // Let's check matches for the first argument name.
        if (
        // 0.13 to 15
        renderRootCode.indexOf('nextElement') !== -1 ||
        // 0.12
        renderRootCode.indexOf('nextComponent') !== -1) {
          return 'unminified';
        }
        // Seems like we're using the production version.
        // Now let's check if we're still on 0.14 or lower:
        if (renderRootCode.indexOf('._registerComponent') !== -1) {
          // TODO: we can remove the condition above once 16
          // is older than a year. Since this branch only runs
          // for Stack, we can flip it completely when Stack
          // is old enough. The branch for Fiber is above,
          // and it can check renderer.version directly.
          return 'outdated';
        }
        // We're all good.
        return 'production';
      }
    } catch (err) {
      // Weird environments may exist.
      // This code needs a higher fault tolerance
      // because it runs even with closed DevTools.
      // TODO: should we catch errors in all injected code, and not just this part?
    }
    return 'production';
  }

  var hasDetectedBadDCE = false;

  var hook = {
    // Shared between Stack and Fiber:
    _renderers: {},
    helpers: {},
    checkDCE: function checkDCE(fn) {
      // This runs for production versions of React.
      // Needs to be super safe.
      try {
        var toString = Function.prototype.toString;
        var code = toString.call(fn);
        // This is a string embedded in the passed function under DEV-only
        // condition. However the function executes only in PROD. Therefore,
        // if we see it, dead code elimination did not work.
        if (code.indexOf('^_^') > -1) {
          // Remember to report during next injection.
          hasDetectedBadDCE = true;
          // Bonus: throw an exception hoping that it gets picked up by
          // a reporting system. Not synchronously so that it doesn't break the
          // calling code.
          setTimeout(function () {
            throw new Error('React is running in production mode, but dead code ' + 'elimination has not been applied. Read how to correctly ' + 'configure React for production: ' + 'https://fb.me/react-perf-use-the-production-build');
          });
        }
      } catch (err) {}
    },
    inject: function inject(renderer) {
      var id = Math.random().toString(16).slice(2);
      hook._renderers[id] = renderer;
      var reactBuildType = hasDetectedBadDCE ? 'deadcode' : detectReactBuildType(renderer);
      hook.emit('renderer', { id: id, renderer: renderer, reactBuildType: reactBuildType });
      return id;
    },
    _listeners: {},
    sub: function sub(evt, fn) {
      hook.on(evt, fn);
      return function () {
        return hook.off(evt, fn);
      };
    },
    on: function on(evt, fn) {
      if (!hook._listeners[evt]) {
        hook._listeners[evt] = [];
      }
      hook._listeners[evt].push(fn);
    },
    off: function off(evt, fn) {
      if (!hook._listeners[evt]) {
        return;
      }
      var ix = hook._listeners[evt].indexOf(fn);
      if (ix !== -1) {
        hook._listeners[evt].splice(ix, 1);
      }
      if (!hook._listeners[evt].length) {
        hook._listeners[evt] = null;
      }
    },
    emit: function emit(evt, data) {
      if (hook._listeners[evt]) {
        hook._listeners[evt].map(function (fn) {
          return fn(data);
        });
      }
    },
    // Fiber-only:
    supportsFiber: true,
    _fiberRoots: {},
    getFiberRoots: function getFiberRoots(rendererID) {
      var roots = hook._fiberRoots;
      if (!roots[rendererID]) {
        roots[rendererID] = new _set2.default();
      }
      return roots[rendererID];
    },

    onCommitFiberUnmount: function onCommitFiberUnmount(rendererID, fiber) {
      // TODO: can we use hook for roots too?
      if (hook.helpers[rendererID]) {
        hook.helpers[rendererID].handleCommitFiberUnmount(fiber);
      }
    },
    onCommitFiberRoot: function onCommitFiberRoot(rendererID, root) {
      var mountedRoots = hook.getFiberRoots(rendererID);
      var current = root.current;
      var isKnownRoot = mountedRoots.has(root);
      var isUnmounting = current.memoizedState == null || current.memoizedState.element == null;
      // Keep track of mounted roots so we can hydrate when DevTools connect.
      if (!isKnownRoot && !isUnmounting) {
        mountedRoots.add(root);
      } else if (isKnownRoot && isUnmounting) {
        mountedRoots.delete(root);
      }
      if (hook.helpers[rendererID]) {
        hook.helpers[rendererID].handleCommitFiberRoot(root);
      }
    }
  };
  Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    value: hook
  });
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeObjectCreate = _create2.default;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeMap = _map2.default;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeWeakMap = _weakMap2.default;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeSet = _set2.default;
}
module.exports = exports['default'];

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */


var _keys = __webpack_require__(19);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(59);

var _typeof3 = _interopRequireDefault(_typeof2);

var _for = __webpack_require__(83);

var _for2 = _interopRequireDefault(_for);

var _iterator = __webpack_require__(56);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(55);

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var invariant = __webpack_require__(131);

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var ITERATOR_SYMBOL = typeof _symbol2.default === 'function' && _iterator2.default;
var REACT_ELEMENT_TYPE = typeof _symbol2.default === 'function' && _for2.default && (0, _for2.default)('react.element') || 0xeac7;

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if ((typeof component === 'undefined' ? 'undefined' : (0, _typeof3.default)(component)) === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * We do a copied the 'traverseAllChildrenImpl' method from
 * `React.Children` so that we don't pull in the whole React library.
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children === 'undefined' ? 'undefined' : (0, _typeof3.default)(children);

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = ITERATOR_SYMBOL && children[ITERATOR_SYMBOL] || children[FAUX_ITERATOR_SYMBOL];
    if (typeof iteratorFn === 'function') {
      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = ' If you meant to render a collection of children, use an array ' + 'instead.';
      var childrenString = '' + children;
      invariant(false, 'The React Devtools cannot render an object as a child. (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + (0, _keys2.default)(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

module.exports = traverseAllChildrenImpl;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(18);
__webpack_require__(28);
module.exports = __webpack_require__(113);


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(18);
__webpack_require__(115);
__webpack_require__(123);
__webpack_require__(122);
__webpack_require__(121);
module.exports = __webpack_require__(0).Map;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(116);
module.exports = __webpack_require__(0).Object.assign;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(117);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(118);
module.exports = __webpack_require__(0).Object.keys;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(18);
__webpack_require__(119);
__webpack_require__(126);
__webpack_require__(125);
__webpack_require__(124);
module.exports = __webpack_require__(0).Set;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(72);
module.exports = __webpack_require__(0).Symbol['for'];


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(72);
__webpack_require__(27);
__webpack_require__(127);
__webpack_require__(128);
module.exports = __webpack_require__(0).Symbol;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28);
__webpack_require__(18);
module.exports = __webpack_require__(49).f('iterator');


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
__webpack_require__(18);
__webpack_require__(120);
__webpack_require__(130);
__webpack_require__(129);
module.exports = __webpack_require__(0).WeakMap;


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(13);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(11);
var toLength = __webpack_require__(46);
var toAbsoluteIndex = __webpack_require__(112);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var isArray = __webpack_require__(66);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(97);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll = __webpack_require__(39);
var getWeak = __webpack_require__(15).getWeak;
var anObject = __webpack_require__(7);
var isObject = __webpack_require__(4);
var anInstance = __webpack_require__(30);
var forOf = __webpack_require__(13);
var createArrayMethod = __webpack_require__(31);
var $has = __webpack_require__(9);
var validate = __webpack_require__(17);
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(16);
var gOPS = __webpack_require__(38);
var pIE = __webpack_require__(22);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(3).document;
module.exports = document && document.documentElement;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(14);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(7);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(21);
var descriptor = __webpack_require__(23);
var setToStringTag = __webpack_require__(24);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(10)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(6);
var anObject = __webpack_require__(7);
var getKeys = __webpack_require__(16);

module.exports = __webpack_require__(5) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(22);
var createDesc = __webpack_require__(23);
var toIObject = __webpack_require__(11);
var toPrimitive = __webpack_require__(47);
var has = __webpack_require__(9);
var IE8_DOM_DEFINE = __webpack_require__(65);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(5) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(11);
var gOPN = __webpack_require__(69).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(9);
var toObject = __webpack_require__(25);
var IE_PROTO = __webpack_require__(43)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(2);
var core = __webpack_require__(0);
var fails = __webpack_require__(8);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(3);
var core = __webpack_require__(0);
var dP = __webpack_require__(6);
var DESCRIPTORS = __webpack_require__(5);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(45);
var defined = __webpack_require__(34);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(45);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7);
var get = __webpack_require__(71);
module.exports = __webpack_require__(0).getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(94);
var step = __webpack_require__(67);
var Iterators = __webpack_require__(14);
var toIObject = __webpack_require__(11);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(37)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(62);
var validate = __webpack_require__(17);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(33)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(2);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(68) });


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(2);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(21) });


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(25);
var $keys = __webpack_require__(16);

__webpack_require__(109)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(62);
var validate = __webpack_require__(17);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(33)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var each = __webpack_require__(31)(0);
var redefine = __webpack_require__(40);
var meta = __webpack_require__(15);
var assign = __webpack_require__(68);
var weak = __webpack_require__(99);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(8);
var validate = __webpack_require__(17);
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(33)(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(41)('Map');


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(42)('Map');


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(2);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(63)('Map') });


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(41)('Set');


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(42)('Set');


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(2);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(63)('Set') });


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(48)('asyncIterator');


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(48)('observable');


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
__webpack_require__(41)('WeakMap');


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
__webpack_require__(42)('WeakMap');


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(132)))

/***/ }),
/* 132 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 133 */
/***/ (function(module, exports) {

module.exports = {"audio":{"tag":"audio","attributions":[{"label":"id","type":"String","default":"","insertText":{"value":"id=\"{{}}\""},"documentation":"video 组件的唯一标识符"},{"label":"src","type":"String","default":"","insertText":{"value":"src=\"{{}}\""},"documentation":"要播放音频的资源地址"},{"label":"loop","type":"Boolean","default":"false","insertText":{"value":"loop=\"{{}}\""},"documentation":"是否循环播放"},{"label":"controls","type":"Boolean","default":"true","insertText":{"value":"controls=\"{{}}\""},"documentation":"是否显示默认控件"},{"label":"poster","type":"String","default":"默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效","insertText":{"value":"poster=\"{{默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效}}\""},"documentation":null},{"label":"name","type":"String","default":"未知音频","insertText":{"value":"name=\"{{未知音频}}\""},"documentation":"默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效"},{"label":"author","type":"String","default":"未知作者","insertText":{"value":"author=\"{{未知作者}}\""},"documentation":"默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效"},{"label":"onError","type":"EventHandle","default":"","insertText":{"value":"onError=\"{{}}\""},"documentation":"当发生错误时触发 error 事件，detail = {errMsg: MediaError.code}"},{"label":"onPlay","type":"EventHandle","default":"","insertText":{"value":"onPlay=\"{{}}\""},"documentation":"当开始/继续播放时触发play事件"},{"label":"onPause","type":"EventHandle","default":"","insertText":{"value":"onPause=\"{{}}\""},"documentation":"当暂停播放时触发 pause 事件"},{"label":"onTimeUpdate","type":"EventHandle","default":"","insertText":{"value":"onTimeUpdate=\"{{}}\""},"documentation":"当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration}"},{"label":"onEnded","type":"EventHandle","default":"","insertText":{"value":"onEnded=\"{{}}\""},"documentation":"当播放到末尾时触发 ended 事件"}],"mode":null,"desc":"音频。"},"button":{"tag":"button","attributions":[{"label":"size","type":"String","default":"default","insertText":{"value":"size=\"{{default}}\""},"documentation":"有效值 default, mini"},{"label":"type","type":"String","default":"default","insertText":{"value":"type=\"{{default}}\""},"documentation":"按钮的样式类型，有效值 primary, default, warn"},{"label":"plain","type":"Boolean","default":"false","insertText":{"value":"plain=\"{{}}\""},"documentation":"按钮是否镂空，背景色透明"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"},{"label":"loading","type":"Boolean","default":"false","insertText":{"value":"loading=\"{{}}\""},"documentation":"名称前是否带 loading 图标"},{"label":"form-type","type":"String","default":"","insertText":{"value":"form-type=\"{{}}\""},"documentation":"有效值：submit, reset，用于 "},{"label":"hover-class","type":"String","default":"button-hover","insertText":{"value":"hover-class=\"{{button-hover}}\""},"documentation":"指定按钮按下去的样式类。当 hover-class=\"none\" 时，没有点击态效果"},{"label":"hover-start-time","type":"Number","default":"20","insertText":{"value":"hover-start-time=\"{{20}}\""},"documentation":"按住后多久出现点击态，单位毫秒"},{"label":"hover-stay-time","type":"Number","default":"70","insertText":{"value":"hover-stay-time=\"{{70}}\""},"documentation":"手指松开后点击态保留时间，单位毫秒"}],"mode":null,"desc":"按钮。"},"canvas":{"tag":"canvas","attributions":[{"label":"id","type":"String","default":"","insertText":{"value":"id=\"{{}}\""},"documentation":"canvas  组件的唯一标识符"},{"label":"disable-scroll","type":"Boolean","default":"false","insertText":{"value":"disable-scroll=\"{{}}\""},"documentation":"当在 canvas 中移动时，禁止屏幕滚动以及下拉刷新"},{"label":"onTouchStart","type":"EventHandle","default":"","insertText":{"value":"onTouchStart=\"{{}}\""},"documentation":"手指触摸动作开始"},{"label":"onTouchMove","type":"EventHandle","default":"","insertText":{"value":"onTouchMove=\"{{}}\""},"documentation":"手指触摸后移动"},{"label":"onTouchEnd","type":"EventHandle","default":"","insertText":{"value":"onTouchEnd=\"{{}}\""},"documentation":"手指触摸动作结束"},{"label":"onTouchCancel","type":"EventHandle","default":"","insertText":{"value":"onTouchCancel=\"{{}}\""},"documentation":"手指触摸动作被打断，如来电提醒，弹窗"},{"label":"onLongTap","type":"EventHandle","default":"","insertText":{"value":"onLongTap=\"{{}}\""},"documentation":"手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动"}],"mode":null,"desc":"画布。"},"checkbox-group":{"tag":"checkbox-group","attributions":[{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"<checkbox-group />中选中项发生改变时触发 change 事件，detail = {value: 选中的checkbox项value的值}"}],"mode":null,"desc":"多项选择器，内部由多个checkbox组成"},"checkbox":{"tag":"checkbox","attributions":[{"label":"value","type":"String","default":"","insertText":{"value":"value=\"{{}}\""},"documentation":["checkbox"]},{"label":"checked","type":"Boolean","default":"false","insertText":{"value":"checked=\"{{}}\""},"documentation":"当前是否选中，可用来设置默认选中"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"},{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"发生改变时触发 change 事件，detail = {value: 该 checkbox 是否 checked}"}],"mode":null,"desc":"多选项目"},"form":{"tag":"form","attributions":[{"label":"onSubmit","type":"EventHandle","default":"","insertText":{"value":"onSubmit=\"{{}}\""},"documentation":"携带 form 中的数据触发 submit 事件，event.detail = {value : {'name': 'value'} , formId: ''}"},{"label":"onReset","type":"EventHandle","default":"","insertText":{"value":"onReset=\"{{}}\""},"documentation":"表单重置时会触发 reset 事件"}],"mode":null,"desc":"表单，将组件内的用户输入的 "},"icon":{"tag":"icon","attributions":[{"label":"type","type":"String","default":"","insertText":{"value":"type=\"{{}}\""},"documentation":"icon的类型，有效值：success, success_no_circle, info, warn, waiting, cancel, download, search, clear"},{"label":"size","type":"Number","default":"23","insertText":{"value":"size=\"{{23}}\""},"documentation":"icon的大小，单位px"},{"label":"color","type":"Color","default":"","insertText":{"value":"color=\"{{}}\""},"documentation":"icon的颜色，同css的colo"}],"mode":null,"desc":"图标。"},"image":{"tag":"image","attributions":[{"label":"src","type":"String","default":"","insertText":{"value":"src=\"{{}}\""},"documentation":"图片资源地址"},{"label":"mode","type":"String","default":"scaleToFill","insertText":{"value":"mode=\"{{scaleToFill}}\""},"documentation":"图片裁剪、缩放的模式"},{"label":"onError","type":"HandleEvent","default":"","insertText":{"value":"onError=\"{{}}\""},"documentation":"当错误发生时，发布到 AppService 的事件名，事件对象event.detail = {errMsg: 'something wrong'}"},{"label":"onLoad","type":"HandleEvent","default":"","insertText":{"value":"onLoad=\"{{}}\""},"documentation":"当图片载入完毕时，发布到 AppService 的事件名，事件对象event.detail = {height:'图片高度px', width:'图片宽度px'}"}],"mode":null,"desc":"图片。"},"input":{"tag":"input","attributions":[{"label":"value","type":"String","default":"","insertText":{"value":"value=\"{{}}\""},"documentation":"输入框的初始内容"},{"label":"type","type":"String","default":"text","insertText":{"value":"type=\"{{text}}\""},"documentation":"input 的类型，有效值：text, number, idcard, digit"},{"label":"password","type":"Boolean","default":"false","insertText":{"value":"password=\"{{}}\""},"documentation":"是否是密码类型"},{"label":"placeholder","type":"String","default":"","insertText":{"value":"placeholder=\"{{}}\""},"documentation":"输入框占位符"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"},{"label":"maxlength","type":"Number","default":"140","insertText":{"value":"maxlength=\"{{140}}\""},"documentation":"最大输入长度"},{"label":"focus","type":"Boolean","default":"false","insertText":{"value":"focus=\"{{}}\""},"documentation":"获取焦点"},{"label":"onInput","type":"EventHandle","default":"","insertText":{"value":"onInput=\"{{}}\""},"documentation":"当键盘输入时，触发input事件，event.detail = {value: value}"},{"label":"onConfirm","type":"EventHandle","default":"","insertText":{"value":"onConfirm=\"{{}}\""},"documentation":"当点击键盘完成时触发，event.detail = {value: value}"},{"label":"onFocus","type":"EventHandle","default":"","insertText":{"value":"onFocus=\"{{}}\""},"documentation":"输入框聚焦时触发，event.detail = {value: value}"},{"label":"onBlur","type":"EventHandle","default":"","insertText":{"value":"onBlur=\"{{}}\""},"documentation":"输入框失去焦点时触发，event.detail = {value: value}"}],"mode":null,"desc":"输入框。"},"label":{"tag":"label","attributions":[{"label":"for","type":"String","default":"绑定控件的 id","insertText":{"value":"for=\"{{绑定控件的 id}}\""},"documentation":null}],"mode":null,"desc":"用来改进表单组件的可用性，使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。"},"map":{"tag":"map","attributions":[{"label":"longitude","type":"Number","default":"","insertText":{"value":"longitude=\"{{}}\""},"documentation":"中心经度"},{"label":"latitude","type":"Number","default":"","insertText":{"value":"latitude=\"{{}}\""},"documentation":"中心纬度"},{"label":"scale","type":"Number","default":"16","insertText":{"value":"scale=\"{{16}}\""},"documentation":"缩放级别，取值范围为5-18"},{"label":"markers","type":"Array","default":"","insertText":{"value":"markers=\"{{}}\""},"documentation":"标记点"},{"label":"polyline","type":"Array","default":"","insertText":{"value":"polyline=\"{{}}\""},"documentation":"路线"},{"label":"circles","type":"Array","default":"","insertText":{"value":"circles=\"{{}}\""},"documentation":"圆"},{"label":"controls","type":"Array","default":"","insertText":{"value":"controls=\"{{}}\""},"documentation":"控件"},{"label":"polygon","type":"Array","default":"","insertText":{"value":"polygon=\"{{}}\""},"documentation":"多边形"},{"label":"include-points","type":"Array","default":"","insertText":{"value":"include-points=\"{{}}\""},"documentation":"缩放视野以包含所有给定的坐标点"},{"label":"show-location","type":"Boolean","default":"","insertText":{"value":"show-location=\"{{}}\""},"documentation":"显示带有方向的当前定位点"},{"label":"onMarkerTap","type":"EventHandle","default":"","insertText":{"value":"onMarkerTap=\"{{}}\""},"documentation":"点击标记点时触发"},{"label":"onControlTap","type":"EventHandle","default":"","insertText":{"value":"onControlTap=\"{{}}\""},"documentation":"点击控件时触发"},{"label":"onRegionChange","type":"EventHandle","default":"","insertText":{"value":"onRegionChange=\"{{}}\""},"documentation":"视野发生变化时触发"},{"label":"onTap","type":"EventHandle","default":"","insertText":{"value":"onTap=\"{{}}\""},"documentation":"点击地图时触发"}],"mode":null,"desc":"地图。"},"navigator":{"tag":"navigator","attributions":[{"label":"hover-class","type":"String","default":"none","insertText":{"value":"hover-class=\"{{none}}\""},"documentation":"点击时附加的类"},{"label":"hover-start-time","type":"Number","default":"","insertText":{"value":"hover-start-time=\"{{}}\""},"documentation":"按住后多久出现点击态，单位毫秒"},{"label":"hover-stay-time","type":"Number","default":"","insertText":{"value":"hover-stay-time=\"{{}}\""},"documentation":"手指松开后点击态保留时间，单位毫秒"},{"label":"url","type":"String","default":"","insertText":{"value":"url=\"{{}}\""},"documentation":"应用内的跳转链接"},{"label":"open-type","type":"String","default":"navigate","insertText":{"value":"open-type=\"{{navigate}}\""},"documentation":"跳转方式"}],"mode":null,"desc":"页面链接。"},"picker-view":{"tag":"picker-view","attributions":[{"label":"value","type":"Number Array","default":"","insertText":{"value":"value=\"{{}}\""},"documentation":"数组中的数字依次表示 picker-view 内的 picker-view-column 选择的第几项（下标从 0 开始），数字大于 picker-view-column 可选项长度时，选择最后一项。"},{"label":"indicatorStyle","type":"String","default":"","insertText":{"value":"indicatorStyle=\"{{}}\""},"documentation":"设置选择器中间选中框的样式"},{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"当滚动选择，value 改变时触发 change 事件，event.detail = {value: value}；value为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始）"}],"mode":null,"desc":"嵌入页面的滚动选择器。"},"picker":{"tag":"picker","attributions":[{"label":"value","type":"String","default":"","insertText":{"value":"value=\"{{}}\""},"documentation":"表示选中的日期，格式为\"YYYY-MM-DD\""},{"label":"start","type":"String","default":"","insertText":{"value":"start=\"{{}}\""},"documentation":"表示有效日期范围的开始，字符串格式为\"YYYY-MM-DD\""},{"label":"end","type":"String","default":"","insertText":{"value":"end=\"{{}}\""},"documentation":"表示有效日期范围的结束，字符串格式为\"YYYY-MM-DD\""},{"label":"fields","type":"String","default":"day","insertText":{"value":"fields=\"{{day}}\""},"documentation":"有效值 year,month,day，表示选择器的粒度"},{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"value 改变时触发 change 事件，event.detail = {value: value}"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"}],"mode":"date","desc":"日期选择器：mode = date"},"progress":{"tag":"progress","attributions":[{"label":"percent","type":"Float","default":"","insertText":{"value":"percent=\"{{}}\""},"documentation":"百分比0~100"},{"label":"show-info","type":"Boolean","default":"false","insertText":{"value":"show-info=\"{{}}\""},"documentation":"在进度条右侧显示百分比"},{"label":"stroke-width","type":"Number","default":"6","insertText":{"value":"stroke-width=\"{{6}}\""},"documentation":"进度条线的宽度，单位px"},{"label":"color","type":"Color","default":"#09BB07","insertText":{"value":"color=\"{{#09BB07}}\""},"documentation":"进度条颜色 （请使用 activeColor）"},{"label":"activeColor","type":"Color","default":"#09BB07","insertText":{"value":"activeColor=\"{{#09BB07}}\""},"documentation":"已选择的进度条的颜色"},{"label":"backgroundColor","type":"Color","default":"","insertText":{"value":"backgroundColor=\"{{}}\""},"documentation":"未选择的进度条的颜色"},{"label":"active","type":"Boolean","default":"false","insertText":{"value":"active=\"{{}}\""},"documentation":"进度条从左往右的动画"}],"mode":null,"desc":"进度条。"},"radio-group":{"tag":"radio-group","attributions":[{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"<radio-group/> 中的选中项发生变化时触发 change 事件，event.detail = {value: 选中项radio的value}"}],"mode":null,"desc":"单项选择器，内部由多个"},"radio":{"tag":"radio","attributions":[{"label":"value","type":"String","default":"","insertText":{"value":"value=\"{{}}\""},"documentation":["radio"]},{"label":"checked","type":"Boolean","default":"false","insertText":{"value":"checked=\"{{}}\""},"documentation":"当前是否选中"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"}],"mode":null,"desc":"单选项目"},"scroll-view":{"tag":"scroll-view","attributions":[{"label":"scroll-x","type":"Boolean","default":"false","insertText":{"value":"scroll-x=\"{{}}\""},"documentation":"允许横向滚动"},{"label":"scroll-y","type":"Boolean","default":"false","insertText":{"value":"scroll-y=\"{{}}\""},"documentation":"允许纵向滚动"},{"label":"upper-threshold","type":"Number","default":"50","insertText":{"value":"upper-threshold=\"{{50}}\""},"documentation":"距顶部/左边多远时（单位px），触发 scrolltoupper 事件"},{"label":"lower-threshold","type":"Number","default":"50","insertText":{"value":"lower-threshold=\"{{50}}\""},"documentation":"距底部/右边多远时（单位px），触发 scrolltolower 事件"},{"label":"scroll-top","type":"Number","default":"","insertText":{"value":"scroll-top=\"{{}}\""},"documentation":"设置竖向滚动条位置"},{"label":"scroll-left","type":"Number","default":"","insertText":{"value":"scroll-left=\"{{}}\""},"documentation":"设置横向滚动条位置"},{"label":"scroll-into-view","type":"String","default":"","insertText":{"value":"scroll-into-view=\"{{}}\""},"documentation":"值应为某子元素id，则滚动到该元素，元素顶部对齐滚动区域顶部"},{"label":"scroll-with-animation","type":"Boolean","default":"false","insertText":{"value":"scroll-with-animation=\"{{}}\""},"documentation":"在设置滚动条位置时使用动画过渡"},{"label":"onScrollToUpper","type":"EventHandle","default":"","insertText":{"value":"onScrollToUpper=\"{{}}\""},"documentation":"滚动到顶部/左边，会触发 scrolltoupper 事件"},{"label":"onScrollToLower","type":"EventHandle","default":"","insertText":{"value":"onScrollToLower=\"{{}}\""},"documentation":"滚动到底部/右边，会触发 scrolltolower 事件"},{"label":"onScroll","type":"EventHandle","default":"","insertText":{"value":"onScroll=\"{{}}\""},"documentation":"滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}"}],"mode":null,"desc":"可滚动视图区域。"},"slider":{"tag":"slider","attributions":[{"label":"min","type":"Number","default":"0","insertText":{"value":"min=\"{{0}}\""},"documentation":"最小值"},{"label":"max","type":"Number","default":"100","insertText":{"value":"max=\"{{100}}\""},"documentation":"最大值"},{"label":"step","type":"Number","default":"1","insertText":{"value":"step=\"{{1}}\""},"documentation":"步长，取值必须大于 0，并且可被(max - min)整除"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"},{"label":"value","type":"Number","default":"0","insertText":{"value":"value=\"{{0}}\""},"documentation":"当前取值"},{"label":"show-value","type":"Boolean","default":"false","insertText":{"value":"show-value=\"{{}}\""},"documentation":"是否显示当前 value"},{"label":"activeColor","type":"String","default":"","insertText":{"value":"activeColor=\"{{}}\""},"documentation":"已选择的颜色"},{"label":"backgroundColor","type":"String","default":"","insertText":{"value":"backgroundColor=\"{{}}\""},"documentation":"背景条的颜色"},{"label":"trackSize","type":"Number","default":"","insertText":{"value":"trackSize=\"{{}}\""},"documentation":"轨道线条高度"},{"label":"handleSize","type":"Number","default":"","insertText":{"value":"handleSize=\"{{}}\""},"documentation":"滑块大小"},{"label":"handleColor","type":"String","default":"","insertText":{"value":"handleColor=\"{{}}\""},"documentation":"滑块填充色"},{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"完成一次拖动后触发的事件，event.detail = {value: value}"}],"mode":null,"desc":"滑动选择器"},"swiper":{"tag":"swiper","attributions":[{"label":"indicator-dots","type":"Boolean","default":"false","insertText":{"value":"indicator-dots=\"{{}}\""},"documentation":"是否显示面板指示点"},{"label":"indicator-color","type":"Color","default":"rgba(0, 0, 0, .3)","insertText":{"value":"indicator-color=\"{{rgba(0, 0, 0, .3)}}\""},"documentation":"指示点颜色"},{"label":"indicator-active-color","type":"Color","default":"#000","insertText":{"value":"indicator-active-color=\"{{#000}}\""},"documentation":"当前选中的指示点颜色"},{"label":"autoplay","type":"Boolean","default":"false","insertText":{"value":"autoplay=\"{{}}\""},"documentation":"是否自动切换"},{"label":"current","type":"Number","default":"0","insertText":{"value":"current=\"{{0}}\""},"documentation":"当前所在页面的 index"},{"label":"duration","type":"Number","default":"500","insertText":{"value":"duration=\"{{500}}\""},"documentation":"滑动动画时长"},{"label":"interval","type":"Number","default":"5000","insertText":{"value":"interval=\"{{5000}}\""},"documentation":"自动切换时间间隔"},{"label":"circular","type":"Boolean","default":"false","insertText":{"value":"circular=\"{{}}\""},"documentation":"是否采用衔接滑动"},{"label":"onChange","type":"Function","default":"否","insertText":{"value":"onChange=\"{{否}}\""},"documentation":"current 改变时会触发 change 事件，event.detail = {current: current}"}],"mode":null,"desc":"滑块视图容器。"},"switch":{"tag":"switch","attributions":[{"label":"checked","type":"Boolean","default":"","insertText":{"value":"checked=\"{{}}\""},"documentation":"是否选中"},{"label":"disabled","type":"Boolean","default":"","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"},{"label":"onChange","type":"EventHandle","default":"","insertText":{"value":"onChange=\"{{}}\""},"documentation":"checked 改变时触发 change 事件，event.detail={ value:checked}"}],"mode":null,"desc":"单选项目"},"text":{"tag":"text","attributions":[{"label":"selectable","type":"Boolean","default":"false","insertText":{"value":"selectable=\"{{}}\""},"documentation":"文本是否可选"}],"mode":null,"desc":"文本。"},"textarea":{"tag":"textarea","attributions":[{"label":"value","type":"String","default":"","insertText":{"value":"value=\"{{}}\""},"documentation":"输入框的初始内容"},{"label":"placeholder","type":"String","default":"","insertText":{"value":"placeholder=\"{{}}\""},"documentation":"输入框占位符"},{"label":"disabled","type":"Boolean","default":"false","insertText":{"value":"disabled=\"{{}}\""},"documentation":"是否禁用"},{"label":"maxlength","type":"Number","default":"140","insertText":{"value":"maxlength=\"{{140}}\""},"documentation":"最大输入长度"},{"label":"auto-focus","type":"Boolean","default":"false","insertText":{"value":"auto-focus=\"{{}}\""},"documentation":"自动聚焦"},{"label":"focus","type":"Boolean","default":"false","insertText":{"value":"focus=\"{{}}\""},"documentation":"获取焦点"},{"label":"auto-height","type":"Boolean","default":"false","insertText":{"value":"auto-height=\"{{}}\""},"documentation":"是否自动增高"},{"label":"onInput","type":"EventHandle","default":"","insertText":{"value":"onInput=\"{{}}\""},"documentation":"当键盘输入时，触发input事件，event.detail = {value: value}，处理函数可以直接 return 一个字符串，将替换输入框的内容。"},{"label":"onFocus","type":"EventHandle","default":"","insertText":{"value":"onFocus=\"{{}}\""},"documentation":"输入框聚焦时触发，event.detail = {value: value}"},{"label":"onBlur","type":"EventHandle","default":"","insertText":{"value":"onBlur=\"{{}}\""},"documentation":"输入框失去焦点时触发，event.detail = {value: value}"},{"label":"onConfirm","type":"EventHandle","default":"","insertText":{"value":"onConfirm=\"{{}}\""},"documentation":"点击完成时， 触发 confirm 事件，event.detail = {value: value}"}],"mode":null,"desc":"输入框。"},"video":{"tag":"video","attributions":[{"label":"src","type":"String","default":"","insertText":{"value":"src=\"{{}}\""},"documentation":"要播放视频的资源地址"},{"label":"controls","type":"Boolean","default":"true","insertText":{"value":"controls=\"{{}}\""},"documentation":"是否显示默认播放控件（播放/暂停按钮、播放进度、时间）"},{"label":"autoplay","type":"Boolean","default":"false","insertText":{"value":"autoplay=\"{{}}\""},"documentation":"是否自动播放"},{"label":"duration","type":"Number","default":"","insertText":{"value":"duration=\"{{}}\""},"documentation":"指定视频时长，到点会暂停播放"},{"label":"onPlay","type":"EventHandle","default":"","insertText":{"value":"onPlay=\"{{}}\""},"documentation":"当开始/继续播放时触发play事件"},{"label":"onPause","type":"EventHandle","default":"","insertText":{"value":"onPause=\"{{}}\""},"documentation":"当暂停播放时触发 pause 事件"},{"label":"onEnded","type":"EventHandle","default":"","insertText":{"value":"onEnded=\"{{}}\""},"documentation":"当播放到末尾时触发 ended 事件"},{"label":"onTimeUpdate","type":"EventHandle","default":"","insertText":{"value":"onTimeUpdate=\"{{}}\""},"documentation":"播放进度变化时触发，event.detail = {currentTime: '当前播放时间'} 。触发频率应该在 250ms 一次"},{"label":"objectFit","type":"String","default":"contain","insertText":{"value":"objectFit=\"{{contain}}\""},"documentation":"当视频大小与 video 容器大小不一致时，视频的表现形式。contain：包含，fill：填充，cover：覆盖video标签认宽度300px、高度225px，设置宽高需要通过abridgess设置width和height。"},{"label":"poster","type":"String","default":"contain","insertText":{"value":"poster=\"{{contain}}\""},"documentation":"默认控件上的封面的图片资源地址"}],"mode":null,"desc":"视频。"},"view":{"tag":"view","attributions":[{"label":"hover-class","type":"String","default":"none","insertText":{"value":"hover-class=\"{{none}}\""},"documentation":"点击时附加的类"},{"label":"hover-start-time","type":"Number","default":"","insertText":{"value":"hover-start-time=\"{{}}\""},"documentation":"按住后多久出现点击态，单位毫秒"},{"label":"hover-stay-time","type":"Number","default":"","insertText":{"value":"hover-stay-time=\"{{}}\""},"documentation":"手指松开后点击态保留时间，单位毫秒"},{"label":"hidden","type":"boolean","default":"false","insertText":{"value":"hidden=\"{{false}}\""},"documentation":"是否隐藏"}],"mode":null,"desc":"视图容器。相当于 web 的 div 或者 react-native 的 View。"}}

/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ })
/******/ ]);