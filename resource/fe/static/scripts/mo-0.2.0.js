/*!
 * mo.js v0.2.0
 * http://mhbseal.com/api/mojs.html
 * (c) 2014-2015 Mu Haibao
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mo"] = factory();
	else
		root["mo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * webpack打包目前不能暴漏多个模块，并且他的requrie解析是静态的，所以这里暂时把全部模块挂在mo下，然后输出mo
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		"use strict";
	  return {
	    AbstractStorage: __webpack_require__(1),
	    AbstractStore: __webpack_require__(3),
	    LocalStore: __webpack_require__(5),
	    SessionStore: __webpack_require__(6),
	    common: __webpack_require__(2),
	    Cookie: __webpack_require__(7),
	    date: __webpack_require__(9),
	    es5: __webpack_require__(8),
	    IdCard: __webpack_require__(11),
	    objectPath: __webpack_require__(4),
	    ParseUrl: __webpack_require__(12),
	    pubSub: __webpack_require__(13),
	    rules: __webpack_require__(14),
	    util: __webpack_require__(10)
	  };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * storage的抽象类,主要存储的时候多些例如：tag、timeout、oldValue等字段，来强化storage.
	 *
	 * @author hbmu
	 * @date   2015/4/9
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (c) {
		"use strict";

		/**
		 * 保存缓存的失效时间
	   *
		 * @param {storage} 缓存代理
		 * @param {string} 保存所有缓存的失效时间map的缓存的key
		 * @param {string} 要保存失效时间的key
		 * @param {number} 失效时间
		 */
		function saveCacheTime(storage, timeMapKey, key, timeout) {
			var
				timeMapStr = storage.getItem(timeMapKey),
				timeMap = JSON.parse(timeMapStr) || [],
				isNewObj = true,
				i = 0,
				obj = {
					key: key,
					timeout: timeout
				};

			// 循环keys，如果有key则更新timeMap对应的key
			for (; i < timeMap.length; i++) {
				if (timeMap[i].key === key) {
					timeMap[i] = obj;
					isNewObj = false;
				}
			}

			isNewObj && timeMap.push(obj); // 如果是新的key，则push到timeMap中

			storage.setItem(timeMapKey, JSON.stringify(timeMap));
		}

		/**
		 * 在设置storage时超出容量时，删除离过期时间最近的缓存
	   *
		 * @param {storage} 缓存代理
		 * @param {string} 保存所有缓存的失效时间map的缓存的key
		 * @param {number} 删除的缓存的个数，默认5
		 */
		function removeOldestCache(storage, timeMapKey, num) {
			var
				i = 0,
				timeMapStr, timeMap, deletedKey, len;

			if (timeMapStr = storage.getItem(timeMapKey)) { // 存在timeMapKey的情况
				timeMap = JSON.parse(timeMapStr);
				if (num == null) num = 5; // 默认删除5个

				// 排序，排序比较耗时
				timeMap.sort(function (a, b) {
					return a.timeout - b.timeout
				});

				// 删除N个缓存
				deletedKey = timeMap.splice(0, num);
				for (len = deletedKey.length; i < num; i++) {
					storage.removeItem(deletedKey[i].key);
				}

				// 将剩余的key存入缓存中，没有则删除timeMap这个key
				timeMap.length ? storage.setItem(timeMapKey, JSON.stringify(timeMap)) : storage.removeItem(timeMapKey);
			} else { // 不存在timeMapKey的情况，则清除整个storage
				storage.clear();
			}
		}

		/**
		 * 构造最终存入对应key的value值
	   *
		 * @param  {string} value
		 * @param  {string} tag
		 * @param  {string} timeout
		 * @param  {string} 设置的是否是回滚数据
		 * @return {object} 包含2个param的对象
		 */
		function buildStorageObj(value, oldValue, tag, timeout) {
			var result = {
				timeout: timeout
			};
			if(value != null) result.value = value;
			if(oldValue != null)	result.oldValue = oldValue;
			if(tag != null) result.tag = tag;
			return result;
		}

		var
			AbstractStorage = c.baseClass(function (options) {
				this.options = c.extend({
					storage: null,
					timeMapKey: 'CACHE_TIME_MAP'
				}, options)
			}, {
				/**
				 * 设置数据
	       *
				 * @param  {string} key
				 * @param  {*} value
				 * @param  {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
				 * @param  {number} 可选,失效时间,默认 now+1天的时间戳
				 * @param  {string} 可选,默认false,是否设置回滚数据
				 * @return {boolean} 成功true,失败false
				 */
				set: function (key, value, tag, timeout, isOld) {
					// 参数校正
					var
						now = +new Date(),
						storage = this.options.storage,
						otherValue, oldValue;

					if (timeout == null) timeout = now + 24 * 60 * 60 * 1000; // 默认 now+1天
					if (tag == null || this.getTag(key) === tag) otherValue = this.get(key, tag, !isOld);

					if (isOld) { // 设置回滚数据
						oldValue = value;
						value = otherValue;
					} else {
						oldValue = otherValue;
					};

					try {
						storage.setItem(key, JSON.stringify(buildStorageObj(value, oldValue, tag, timeout)));
						saveCacheTime(storage, this.options.timeMapKey, key, timeout); // 保存缓存的失效时间
						return true;
					} catch (e) {
						if (e.name === 'QuotaExceededError') {
							// localstorage写满时，选择离过期时间最近的数据删除，但是如果缓存过多，此过程相对来说比较耗时，也可以选择写满时清除全部
							removeOldestCache(storage, this.options.timeMapKey);
							this.set(key, value, tag, timeout, isOld);
						}
						return false;
					}
				},
				/**
				 * 读取数据
	       *
				 * @param  {string} key
				 * @param  {string} tag标识,如果传递tag,get时会比较tag标识,不一致返回null
				 * @param  {boolean} 可选,默认false,是否读取回滚数据
				 * @return {*} 读取保存的数据
				 */
				get: function (key, tag, isOld) {
					var
						obj = this.options.storage.getItem(key),
						value = null;

					if (obj) {
						obj = JSON.parse(obj);
						if (obj.timeout >= +new Date()) {
							if (tag == null || tag && tag === obj.tag) {
								value = isOld ? obj.oldValue : obj.value;
							}
						}
					}

					return value;
				},
				/**
				 * 返回key的tag
	       *
				 * @param  {string} key
				 * @return {string} tag
				 */
				getTag: function (key) {
					var obj = this.options.storage.getItem(key);
					return obj ? JSON.parse(obj).tag : null;
				},
				/**
				 * 设置key的失效时间
	       *
				 * @param  {string} key
	       * @param  {number} timeout
				 * @return {boolean} 成功true,失败false
				 */
				setExpireTime: function (key, timeout) {
					var obj = this.options.storage.getItem(key);
					if (obj) {
						obj = JSON.parse(obj);
					  return this.set(key, obj.value, obj.tag, timeout);
					}
					return false;
				},
				/**
				 * 读取key的失效时间
	       *
				 * @param  {string} key
				 * @return {number} timeout
				 */
				getExpireTime: function (key) {
					var obj = this.options.storage.getItem(key);
					return obj ? JSON.parse(obj).timeout : null;
				},
				/**
				 * 清除指定key
	       *
				 * @param {string} key
				 */
				remove: function (key) {
					return this.options.storage.removeItem(key);
				},
				/**
				 * 清空所有storage内容
				 */
				clear: function () {
					return this.options.storage.clear();
				},
				/**
				 * 垃圾回收,清除掉过期数据和空数据(只处理通过AbstracStorage存储过的)
				 */
				gc: function () {
					var
						timeMapKey = this.options.timeMapKey,
						storage = this.options.storage,
						timeMapStr, timeMap, i = 0, len, key, value, TimeMapResult = [];

					if (timeMapStr = storage.getItem(timeMapKey)) {
						timeMap = JSON.parse(timeMapStr);
						len = timeMap.length;
						for (; i < len; i++) {
							value = timeMap[i];
							key = value.key;
							if (key !== 'GUID' && !this.get(key) && !this.get(key, null, true)) {
								this.remove(key);
							} else {
								TimeMapResult.push(value);
							}
						}
						// 将剩余的key存入缓存中，没有则删除timeMap这个key
						TimeMapResult.length ? storage.setItem(timeMapKey, JSON.stringify(TimeMapResult)) : storage.removeItem(timeMapKey);
					}
				}
			})

		return AbstractStorage;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 一些底层的方法
	 *
	 * @author hbmu
	 * @date   2015/2/3
	 *
	 * @name   common
	 * @example
	 * var foo, obj1, obj2, obj3;
	 *
	 * function Foo () {
	 *   this.a = 1
	 * };
	 * Foo.prototype.b = 2;
	 * foo = new Foo();
	 *
	 * obj1 = {
	 *   a: 1,
	 *   b: 2,
	 *   toString: 3,
	 *   isPrototypeOf: 4,
	 *   constructor: 5
	 * };
	 * obj2 = {
	 *   b: 22,
	 *   c: {
	 *     d: 6
	 *   }
	 * };
	 * obj3 = {
	 *   c: {
	 *     e: 7,
	 *     f: {
	 *       g: 8,
	 *       h: 9
	 *     }
	 *   }
	 * };
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		"use strict";

		var
			common = {},
			class2type = {},
			Ctor = function() {},
			ArrayProto = Array.prototype,
			StrProto = String.prototype,
			ObjProto = Object.prototype,
			nativeTrim = StrProto.trim,
	    nativeKeys = Object.keys,
			toString = ObjProto.toString,
			hasOwn = ObjProto.hasOwnProperty,
			nativeCreate = Object.create,
			nativeIsArray = ArrayProto.isArray,
			rWord = /[^,| ]+/g,
			// 在<IE9下，不枚举的bug
			hasEnumBug = !{toString: null}.propertyIsEnumerable('toString'),
			nonEnumerableProps = ['toString',	'toLocaleString', 'valueOf', 'hasOwnProperty',	'isPrototypeOf', 'propertyIsEnumerable', 'constructor']; // 分隔符正则

		// 判断数据类型基础方法
		function type(obj) {
			return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] : typeof obj;
		};

		'Boolean Number String Function Date RegExp Object Array'.replace(rWord, function(name) {
			var lowerName = name.toLowerCase();
			class2type['[object ' + name + ']'] = lowerName; // for common.type method
			common['is' + name] = function(obj) {
				return type(obj) === lowerName;
			};
		});

	  /**
	   * 判断是否是非继承属性
	   *
	   * @name has
	   * @grammar c.has(obj, key)
	   * @example
	   * c.has(foo, 'a') => true
	   * c.has(foo, 'b') => false
	   */
		common.has = function(obj, key) {
			return hasOwn.call(obj, key);
		};

		/**
	   * 兼容 IE8- 下有些不枚举的属性，例如'toString',	'toLocaleString', 'valueOf', 'hasOwnProperty',	'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
	   *
		 * @param {object} obj
		 * @param {function} iteratee
		 *   - param {*} value
		 *   - param {*} key
		 *   - param {object} forIn的第一个参数obj
		 * @param {object} iteratee的上下文,可选
	   *
	   * @name    forIn
	   * @grammar c.forIn(obj, iteratee[, context])
	   * @example
	   * c.forIn(obj1, function(v, k) {
	   *   console.log(k + ':' + v)
	   * })
	   * => 依次输出: 'a: 1', 'b: 2', 'toString: 3', 'isPrototypeOf: 4', 'constructor: 5'
		 */
		common.forIn = function(obj, cb, context) {
			for (var key in obj) if (cb.call(context, obj[key], key, obj) === false) return; // normal

			if (hasEnumBug) { // nonEnumerableProps
				var
					index = 0,
					len = nonEnumerableProps.length;

				for (; index < len; index++) {
	        if (common.has(obj, nonEnumerableProps[index]) && cb.call(context, obj[nonEnumerableProps[index]], nonEnumerableProps[index], obj) === false) return;
	      }
			}
		}

		/**
	   * 合并对象到第一个obj
	   *
		 * @param   {boolean} 是否深度复制,可选
		 * @param   {object|array} 目标对象
		 * @param.. {object|array} 需要extend的对象,可多个参数
		 * @return  {object|array} extend后的object
	   *
	   * @name    extend
	   * @grammar c.extend([isDeep,] obj1, obj2, obj3...)
	   * @example
	   * c.extend(obj1, obj2) => {a: 1, b: 22, c: {d: 6}, toString: 3, isPrototypeOf: 4, constructor: 5}
	   * // 浅拷贝
	   * c.extend(obj2, obj3) => {b: 22, c: {e: 7, f: {g: 8, h: 9}}}
	   * // 深度拷贝
	   * c.extend(true, obj1, obj2, obj3)
	   * => {a: 1, b: 22, c: {d: 6, e: 7, f: {g: 8, h: 9}}, toString: 3, isPrototypeOf: 4, constructor: 5}
		 */
		common.extend = function() {
			var
				src, source, deep, srcType, copyType, clone, copyIsArray,
				index = 1,
				args = arguments,
				len = args.length,
				target = args[0];

			// 校正参数
			deep = typeof target === 'boolean';
			if (deep) {
				index++;
				target = args[1];
			}

			// 如果只有一个参数,直接合并到调用的对象上
			if (index === len) {
				target = this;
				index--;
			}

			for (; index < len; index++) {
				source = arguments[index]; // 需要extend的参数

				if (source != null) {
					this.forIn(source, function(copy, prop) {
						src = target[prop];

						// 防止循环引用
						if (target === copy) {
							return false;
						}

						if (deep && (copyType = copy && type(copy)) && (copyType === 'object' && this.has(source, prop) || (copyIsArray = copyType === 'array'))) { // 深拷贝
	            srcType = src && type(src);
	            if (copyIsArray) {
	              copyIsArray = false;
	              clone = srcType === 'array' ? src : [];
	            } else {
	              clone = srcType === 'object' ? src : {};
	            }
							target[prop] = this.extend(deep, clone, copy);
						} else { // 浅拷贝
							if (copy !== undefined) {
								target[prop] = copy;
							}
						}
					}, this)
				}
			}

			return target;
		};

		common.extend({
	    /**
	     * 判断对象的类型
	     *
	     * @name    type
	     * @grammar c.type(*)
	     * @example
	     * c.type({a: 1}) => 'object'
	     * c.type('mojs') => 'string'
	     * c.type(2) => 'number'
	     */
			type: function(obj) {
				if (obj == null) {
					return obj + '';
				}
				return type(obj);
			},
	    /**
	     * 是否是Boolean类型
	     *
	     * @name isBoolean
	     * @grammar c.isBoolean(*)
	     * @example
	     * c.isBoolean({a: 1}) => false
	     */
	    /**
	     * 是否是Number类型
	     *
	     * @name isNumber
	     * @grammar c.isNumber(*)
	     */
	    /**
	     * 是否是String类型
	     *
	     * @name isString
	     * @grammar c.isString(*)
	     */
	    /**
	     * 是否是Function类型
	     *
	     * @name isFunction
	     * @grammar c.isFunction(*)
	     */
	    /**
	     * 是否是Date类型
	     *
	     * @name isDate
	     * @grammar c.isDate(*)
	     */
	    /**
	     * 是否是RegExp类型
	     *
	     * @name isRegExp
	     * @grammar c.isRegExp(*)
	     */
	    /**
	     * 是否是Object类型
	     *
	     * @name isObject
	     * @grammar c.isObject(*)
	     */
	    /**
	     * 是否是数组
	     *
	     * @name isArray
	     * @grammar c.isArray(*)
	     */
			isArray: nativeIsArray || function(obj) {
				return type(obj) === 'array';
			},
	    /**
	     * 是否是类数组, 例如nodelist,arguments,具有length并且keys为0.1.2...的obj
	     *
	     * @name    isArraylike
	     * @grammar c.isArraylike(*)
	     * @example
	     * c.isArraylike([1, 2, 3]) => true
	     * c.isArraylike({1: 1, 2: 2, 3: 3, length: 3}) => true
	     * c.isArraylike({1: 1, 2: 2, 3: 3}) => false
	     */
	    isArraylike: function(obj) {
	      var
	        len = obj.length,
	        type = this.type(obj);

	      return !!len || type === 'array' || typeof len === 'number' && len > 0 && (len - 1) in obj || len === 0;
	    },
	    /**
	     * 判断是否为NaN
	     *
	     * @name isNaN
	     * @grammar c.isNaN(*)
	     * @example
	     * c.isNaN(NaN) => true
	     * c.isNaN(undefined) => false
	     */
	    isNaN: function(obj) {
	      return obj === undefined ? false : isNaN(obj);
	    },
	    /**
	     * 返回obj的长度
	     *
	     * @name size
	     * @grammar c.size(obj)
	     * @example
	     * c.size([1, 2, 3]) => 3
	     * c.size({a: 1, b: 2}) => 2
	     */
			size: function(obj) {
				if (obj == null) return 0;
				return this.isArraylike(obj) ? obj.length : this.keys(obj).length;
			},
	    /**
	     * 去掉字符串前后的空
	     * @name    trim
	     * @grammar c.trim(text)
	     * @example
	     * c.trim(' abc defg ') => 'abc defg'
	     */
	    trim: function(text) {
	      if (nativeTrim) return nativeTrim.call(text);

	      text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	    },
	    /**
	     * 获取对象的key集合
	     *
	     * @name keys
	     * @grammar c.keys(obj)
	     * @example
	     * c.keys({a: 1, b: 2}) => ['a', 'b']
	     */
	    keys: function(obj) {
	      var
	        keys;
	      if (nativeKeys) return nativeKeys(obj);
	      keys = [];

	      this.forIn(obj, function(value, key) {
	        if (this.has(obj, key)) keys.push(key);
	      })

	      return keys;
	    },
	    /**
	     * 当前时间戳
	     *
	     * @name    now
	     * @grammar c.now()
	     */
	    now: Date.now || function() {
	      return +new Date();
	    },
	    /**
	     * 同console.log()
	     *
	     * @name log
	     * @grammar c.log(*)
	     */
	    log: function() {
	      window.console && Function.apply.call(console.log, console, arguments);
	    },
	    /**
	     * 同Object.create(prototype)
	     *
	     * @param  {object} prototype
	     * @return {object} 原型为参数prototype的对象
	     *
	     * @name    baseCreate
	     * @grammar c.baseCreate(prototype)
	     * @example
	     * c.baseCreate() => {}
	     * c.baseCreate({ a: Foo }).a => Foo
	     */
	    baseCreate: function(prototype) {
	      if (!this.isObject(prototype)) return {};
	      if (nativeCreate) return nativeCreate(prototype);
	      Ctor.prototype = prototype;
	      var result = new Ctor;
	      Ctor.prototype = null;
	      return result;
	    },
			/**
	     * 创建一个构造函数(继承、原型方法都可选,继承可以通过新构造函数的superCtor访问父级构造函数)
	     *
			 * @param  {function} (子级)构造函数
			 * @param  {object} 原型的方法集，可选
			 * @param  {function} 父级构造函数，可选
			 * @return {function} 新的构造函数
	     *
	     * @name    baseClass
	     * @grammar c.baseClass(subCtor, prototypes, superCtor)
	     * @example
	     * c.baseClass(A, {a: function() {}, b: function(){}}, B) => A继承B,并且prototype上添加方法a和b
	     * c.baseClass(A, {a: function() {}, b: function(){}}) => A的prototype上添加方法a和b
	     * c.baseClass(A, B) => A继承B
			 */
			baseClass: function(subCtor, prototypes, superCtor) {
				var
					noProtos = typeof arguments[1] !== 'object',
					Ctor, isInherit;

				// 参数校正
				if (noProtos) superCtor = prototypes;
				// 是否是调用继承
				isInherit = superCtor != null;

				// 输出的构造函数
				Ctor = function() {
					if (arguments.length) {
						isInherit && superCtor.apply(this, arguments);
						subCtor.apply(this, arguments);
					} else {
						isInherit && superCtor.call(this);
						subCtor.call(this);
					}
				};

				// subCtor继承superCtor的prototypes
				if (isInherit) {
					Ctor.superCtor = superCtor;
					Ctor.prototype = common.baseCreate(superCtor.prototype);
					Ctor.prototype.constructor = Ctor;
				}

				// 自定义的prototypes
	      common.forIn(prototypes, function(prototype, name) {
					Ctor.prototype[name] = prototype;
				})

				return Ctor;
			}
		});

		return common;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * store的抽象类,针对storage中的key,一般不使用该类,常用他的子类LocalStore(options.storage = window.localStorage)、SessionStore(options.storage = window.sessionStorage)
	 *
	 * @author hbmu
	 * @date   2015/4/10
	 *
	 * @name   AbstractStore
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(4), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (c, objectPath, AbstractStorage) {
		"use strict";

		/**
		 * 根据liftTime 计算要增加的毫秒数
	   *
		 * @param   {string} liftTime 单位D,H,M,S. eg. '24H'
		 * @return  {number} 根据liftTime计算要增加的毫秒数
		 */
		function getLifeTime(lifeTime) {
			var
				timeout,
				unit = lifeTime.charAt(lifeTime.length - 1),
				num = parseInt(lifeTime);

			unit = typeof unit === 'number' ? 'D' : unit.toUpperCase(); // 如果没有单位，给个默认值 ‘天’

			switch (unit) {
				case 'H': // 小时
					timeout = num * 60 * 60 * 1000;
					break;
				case 'M': // 分钟
					timeout = num * 60 * 1000;
					break;
				case 'S': // 秒
					timeout = num * 1000;
					break;
				default : // 默认为‘天’
					timeout = num * 24 * 60 * 60 * 1000;
			}

			return timeout;
		}

	  /**
	   * 构造函数
	   *
	   * @param {object} options
	   *   - storage         {storage} window.localStorage/window.sessionStorage
	   *   - key             {string} key
	   *   - lifetime        {string} 生命周期,默认'1H' 单位D,H,M,S. eg. '24H'
	   *   - rollbackEnabled {boolean} 是否回滚
	   *
	   * @name    AbstractStore
	   * @grammar new AbstractStore(options)
	   * @example
	   * var store = new AbstractStore({
	   *   storage: window.localStorage,
	   *   key: 'USER'
	   * }))
	   */
		var
			AbstractStore = c.baseClass(function (options) {
				this.options = c.extend({
	        storage: null,
					key: null,
					lifeTime: '1H',
					rollbackEnabled: false
				}, options);

	      this.init = function() {
	        this.proxy = new AbstractStorage({
	          storage: this.options.storage
	        })
	      }

	      this.init();
			}, {
				/**
	       * 设置this.key下的value
	       *
				 * @param  {*} value
				 * @param  {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
				 * @param  {string} 可选,默认false,是否设置回滚数据
				 * @return {boolean} 成功true,失败false
	       *
	       * @name    set
	       * @grammar store.set(value[, tag][, isOld])
				 */
				set: function (value, tag, isOld) {
					if (!this.options.rollbackEnabled && isOld) throw 'param rollbackEnabled is false'; // 如果不允许roolback,则不能设置回滚数据
					var timeout = +new Date() + getLifeTime(this.options.lifeTime);
					return this.proxy.set(this.options.key, value, tag, timeout, isOld);
				},
				/**
	       * 设置this.key下的value中name的value
	       *
				 * @param  {String} name 支持通过路径的方式，如'a.b.c'
				 * @param  {*} value
				 * @param  {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
				 * @param  {string} 可选,默认false,是否设置回滚数据
				 * @return {boolean} 成功true,失败false
	       *
	       * @name    setAttr
	       * @grammar store.setAttr(name, value[, tag][, isOld])
				 */
				setAttr: function (name, value, tag, isOld) {
					if (!this.options.rollbackEnabled && isOld) throw 'param rollbackEnabled is false'; // 如果不允许roolback,则不能设置回滚数据

					var
						i, objValue;

					// name是object时,遍历name执行setAttr然后return
					if (typeof name === 'object') {
						for (i in name) {
							if (name.hasOwnProperty(i)) this.setAttr(i, name[i], tag, isOld);
						}
						return;
					}

					objValue = this.get(tag, isOld) || {};
					objectPath.set(objValue, name, value);

					return this.set(objValue, tag, isOld);
				},
				/**
	       * 读取this.key下的value
	       *
				 * @param  {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
				 * @param  {string} 可选,默认false,是否设置回滚数据
				 * @return {*} value
	       *
	       * @name    get
	       * @grammar store.get([tag][, isOld])
				 */
				get: function (tag, isOld) {
					return this.proxy.get(this.options.key, tag, isOld);
				},
				/**
	       * 读取this.key下的value中name的value
	       *
				 * @param  {String} name 支持通过路径的方式，如'a.b.c'
				 * @param  {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
				 * @param  {string} 可选,默认false,是否设置回滚数据
				 * @return {*} value
	       *
	       * @name    getAttr
	       * @grammar store.getAttr(name[, tag][, isOld])
				 */
				getAttr: function (name, tag, isOld) {
					return objectPath.get(this.get(tag, isOld), name);
				},
				/**
	       * 获取tag
	       *
	       * @name    getTag
	       * @grammar store.getTag()
				 */
				getTag: function () {
					return this.proxy.getTag(this.options.key);
				},
				/**
	       * 移除存储对象
	       *
	       * @name    remove
	       * @grammar store.remove()
				 */
				remove: function () {
					return this.proxy.remove(this.options.key);
				},
				/**
	       * 设置失效时间
	       *
	       * @param  {number} timeout
	       *
	       * @name    setExpireTime
	       * @grammar store.setExpireTime()
				 */
				setExpireTime: function (timeout) {
					return this.proxy.setExpireTime(this.options.key, timeout);
				},
				/**
	       * 返回失效时间
	       *
	       * @name    getExpireTime
	       * @grammar store.getExpireTime()
				 */
				getExpireTime: function () {
					return this.proxy.getExpireTime(this.options.key);
				},
				/**
	       * 回滚至上个版本
	       *
				 * @param  {string} 可选,默认false,回滚后是否清除回滚数据
				 * @return {boolean} 成功true,失败false
	       *
	       * @name    rollback
	       * @grammar store.rollback([isClearOld])
				 */
				rollback: function (isClearOld) {
					var tag = this.getTag();
					if (this.options.rollbackEnabled) {
						if (this.set(this.get(null, true), tag)) { // 回滚成功
							isClearOld && this.set(null, tag, true);  // 需要清除oldVlue
							return true;
						}
					} else {
						throw 'param rollbackEnabled is false';
					}
				}
			})

		return AbstractStore;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 读取或设置object path下的value
	 *
	 * @author hbmu
	 * @date   2014/4/13
	 *
	 * @name   objectPath
	 * @example
	 * var obj = { f: { g: 'blog' } };
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		"use strict";

		var objectPath = {
			/**
	     * 设置object path下的value
	     *
			 * @param  {object} obj
			 * @param  {string} path
			 * @param  {*} value
			 * @return {boolean} 成功true,失败false
	     *
	     * @name    set
	     * @grammar objectPath.set(obj, path, value)
	     * @example
	     * objectPath.set(obj, 'a.d', 'mojs') => obj.a.d = 'mojs'
	     * objectPath.set(obj, 'a.b.e', 'modoc') => obj.a.b.e = 'modoc'
			 */
			set: function (obj, path, value) {
				if (!obj || !path) return false;

				var
					pathArr = path.split('.'),
					i = 0,
					len = pathArr.length;

				while(i < len - 1) { // 遍历
					var key = pathArr[i];
					if(obj[key] == null) obj[key] = {};
					if(typeof obj[key] !== 'object') return false; // 如果遍历到的value不是object、undefined、null则放弃操作
					obj = obj[key];
					i++;
				}

				if (value != null) {
					obj[pathArr[i]] = value;
				} else {
					delete obj[pathArr[i]];
				}

				return true;
			},
			/**
	     * 读取object path下的value
	     *
			 * @param  {object} obj
			 * @param  {string} path
			 * @return {*} value
	     *
	     * @name    get
	     * @grammar objectPath.set(obj, path)
	     * @example
	     * objectPath.get(obj, 'f.g') => 'blog'
	     * objectPath.get(obj, 'a.b.e') => 'mojs'
			 */
			get: function (obj, path) {
				if (!obj || !path) return null;

				var
					pathArr = path.split('.'),
					i = 0,
					len = pathArr.length;

				while(i < len) { // 遍历 .
					if ((obj = obj[pathArr[i++]]) == null) return null;
				}

				return obj;
			}
		}

		return objectPath;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * AbstractStore的子类
	 *
	 * @author hbmu
	 * @date   2015/4/17
	 *
	 * @name   LocalStore
	 * @example
	 * var store = new AbstractStore({
	 *   key: 'USER'
	 * })
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (c, AbstractStore) {
		"use strict";

		var
			LocalStore = c.baseClass(function (options) {
	      c.extend(this.options, options, {
	        storage: window.localStorage
	      })

	      this.init();
			}, AbstractStore);

		return LocalStore;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * AbstractStore的子类
	 *
	 * @author hbmu
	 * @date   2015/4/17
	 *
	 * @name   SessionStore
	 * @example
	 * var store = new AbstractStore({
	 *   key: 'USER'
	 * })
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (c, AbstractStore) {
		"use strict";

		var
			SessionStore = c.baseClass(function (options) {
				c.extend(this.options, options, {
	        proxy: window.sessionStorage
	      })

	      this.init();
			}, AbstractStore);

		return SessionStore;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 操作cookie的方法
	 *
	 * @author hbmu
	 * @date   2014/09/12
	 *
	 * @name   Cookie
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function(c, es5) {
		"use strict";

		function encode(str, isRaw) {
			return isRaw ? str : encodeURIComponent(str);
		};
		function decode(str, isRaw) {
			return isRaw ? str : decodeURIComponent(str);
		};
		function stringifyCookie(obj, isJson) {
			return encode(isJson ? JSON.stringify(obj) : String(obj));
		};
		function parseCookie(str, isJson) {
			return isJson ? JSON.parse(decode(str)) : decode(str);
		};

		/**
	   * 构造函数
	   *
		 * @param {object} options
		 *   - isRaw {boolean} 是否原生字符（不转码）, 默认为false
		 *   - isJson {boolean} 是否str->json, 默认为false
	   *
	   * @name Cookie
	   * @grammar new Cookie(options)
	   * @example
	   * var
	   *   cookie = new Cookie(),
	   *   cookie2 = new Cookie({isRaw: true, isJson: true});
		 */
		function Cookie(options) {
			this.options = c.extend({
				isRaw: false,
				isJson: false
			}, options);
		};

	  /**
	   * 设置cookie
	   *
	   * @param {string} name
	   * @param {*} value
	   * @param {obj} options
	   *   - expires {number|string} 失效时长,单位 ‘天’, 默认为Session
	   *   - path    {string} 路径,path只能设置当前path的子path, 默认为当前path
	   *   - domain  {string} 域,domain只能设置当前domain的子domain, 默认为当前domain
	   *   - secure  {boolean} 安全策略,只有https下能设置 ture or false, 默认为false
	   *
	   * @name    set
	   * @grammar cookie.set(name, value[, options])
	   * @example
	   * cookie.set('user', 'mo');
	   * cookie2.set('user2', {a: 'mojs', b: 'modoc'}, {expires: 1});
	   */
	  Cookie.prototype.set = function(name, value, options) {
	    var
	      options = options || {},
	      expires = new Date();

	    if(options.expires) expires.setTime(+expires + +options.expires * 864e+5);

	    document.cookie = [
	      encode(name, this.options.isRaw), '=', stringifyCookie(value, this.options.isJson),
	      options.expires ? '; expires=' + expires : '', // use expires attribute, max-age is not supported by IE
	      options.path    ? '; path=' + options.path : '',
	      options.domain  ? '; domain=' + options.domain : '',
	      options.secure  ? '; secure' : ''
	    ].join('');
	  };

		/**
	   * 读取cookie
	   *
		 * @param  {string} cookie的name
		 * @return {*} cookie的value
	   *
	   * @name    get
	   * @grammar cookie.get(name)
	   * @example
	   * cookie.get('user') => 'mo'
	   * cookie2.get('user2') => {a: 'mojs', b: 'modoc'}
		 */
		Cookie.prototype.get = function(name) {
			var
				cookieStr = document.cookie,
				cookies = cookieStr ? cookieStr.split('; ') : [],
				result = null;

			es5.each(cookies, function(cookie) {
				var
					parts = cookie.split('='),
					key = decode(parts[0], this.options.isRaw);

				if (name === key) {
					result = parseCookie(parts[1], this.options.isJson);
					return false;
				}
			}, this)

			return result;
		};

		/**
	   * 删除cookie
	   *
		 * @param {string} cookie的name
	   *
	   * @name    remove
	   * @grammar cookie.remove(name)
	   * @example
	   * cookie.remove('user')
		 */
		Cookie.prototype.remove = function(name) {
			this.set(name, '', {expires: -1});
		};

		return Cookie;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * es5 shim
	 * 其中each,map,filter,some,every可以应用到类数组,对象
	 * indexOf,lastIndexOf,reduce,reduceRight可以应用到类数组
	 *
	 *
	 * @author hbmu
	 * @date   2015/2/3
	 *
	 * @name   es5
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (c) {
		"use strict";

		var
			es5 = {},
			// 原型
			ArrayProto = Array.prototype,
			FuncProto = Function.prototype,
			// 原型方法
			slice = ArrayProto.slice,
			nativeBind = FuncProto.bind;

		// for reduce, reduceRight
		function createReduce(dir) {
			return function(array, cb, memo, context) {

				var
					len = array.length,
					index = dir > 0 ? 0 : len - 1;

				if(arguments.length < 3) { // 如果不存在memo,则把array[index]赋值给memo,并且跳过index这次iteratee
					memo = array[index];
					index += dir;
				}

				for (; index >= 0 && index < len; index += dir) {
					memo = cb.call(context, memo, array[index], index, array);
				}

				return memo;
			}
		};


		es5 = {
			/**
	     * 遍历类数组或者对象,如果想终止循环return false即可
	     *
			 * @param {arraylike|object} 类数组或者对象
			 * @param {function} 迭代函数
			 *   - param {*} value
			 *   - param {*} index|key
			 *   - param {array|object} each的第一个参数
			 * @param {object} iteratee的上下文,可选
	     *
	     * @name    each
	     * @grammar es5.each(obj, iteratee[, context])
			 */
			each: function(obj, cb, context) {
				var
					index = 0,
					len = obj.length;

				if (c.isArraylike(obj)) { // 类数组
					for (; index < len; index++) if (cb.call(context, obj[index], index, obj) === false) break; //执行并且判断返回是否为false,如果false则终止循环
				} else { // 对象
					c.forIn(obj, function(value, key) {
						if (c.has(obj, key) && cb.call(context, value, key, obj) === false) return false;
					})
				}
			},
			/**
	     * 遍历类数组或者对象,返回一个新数组(obj执行iteratee后的返回值的集合)
	     *
			 * @param  {arraylike|object} 类数组或者对象
			 * @param  {function} 迭代函数
			 *   - param {*} value
			 *   - param {*} index/key
			 *   - param {array|object} map的第一个参数
			 * @param  {object} iteratee的上下文,可选
			 * @return {array} 结果
	     *
	     * @name    map
	     * @grammar es5.map(obj, iteratee[, context])
			 */
			map: function(obj, cb, context) {
				var results = [];

				this.each(obj, function(value, index, obj) {
					results.push(cb.call(context, value, index, obj))
				});

				return results;
			},
			/**
	     * 遍历类数组或者对象,返回一个新数组(obj执行iteratee后返回值为真的value的元素的集合),其他同map
	     *
	     * @name filter
			 */
			filter: function(obj, cb, context) {
				var results = [];

				this.each(obj, function(value, index, obj) {
					cb.call(context, value, index, obj) && results.push(value)
				});

				return results;
			},
			/**
	     * 遍历类数组或者对象,obj执行iteratee后返回值如果有一个为真,则返回true,否则返回false,其他同map
	     *
	     * @name some
			 */
			some: function(obj, cb, context) {
				var result = false;

				this.each(obj, function(value, index, obj) {
					if(cb.call(context, value, index, obj) === true) {
						result = true;
						return false;
					}
				});

				return result;
			},
			/**
	     * 遍历类数组或者对象,obj执行iteratee后返回值如果全为真,则返回true,否则返回false,其他同map
	     *
	     * @name every
			 */
			every: function(obj, cb, context) {
				var result = true;

				this.each(obj, function(value, index, obj) {
					if(cb.call(context, value, index, obj) !== true) {
						return (result = false);
					}
				});

				return result;
			},
			/**
	     * 返回item在arraylike中的索引值(从0开始找),如果item不存在arraylike中就返回-1,原生不支持NaN
	     *
			 * @param  {arraylike} 需要查找的类数组
			 * @param  {*} 需要查找的元素
			 * @param  {number} 开始索引,可选
			 * @return {number} 查找到元素的索引值
	     *
	     * @name    indexOf
	     * @grammar es5.indexOf(array, item[, from])
			 */
			indexOf: function(array, item, from) {
				var
					index = 0,
					len = array.length;

				if (typeof from === 'number') {
					index = from < 0 ? Math.max(0, len + from) : from;
				}

				if (item !== item) { // 查找NaN(注：原生indexOf不能查找出NaN)
					for (; index < len; index++) if (c.isNaN(array[index])) return index;
				} else {
					for (; index < len; index++) if (array[index] === item) return index;
				}

				return -1;
			},
			/**
	     * 同indexOf,区别是从arraylike的末尾开始(从右到左)
	     *
			 * @name lastIndexOf
			 */
			lastIndexOf: function(array, item, from) {
				var index = array ? array.length : 0;

				if (typeof from == 'number') {
					index = from < 0 ? index + from + 1 : Math.min(index, from + 1);
				}

				if (item !== item) {
					while (--index >= 0) if (c.isNaN(array[index])) return index;
				} else {
					while (--index >= 0) if (array[index] === item) return index;
				}

				return -1;
			},
			/**
	     * 函数绑定
	     *
			 * @param   {function} 需要绑定上下文或者是添加参数的函数
			 * @param   {object} func的上下文
			 * @param.. {*} 需要添加的n个参数
			 * @return  {function} 绑定上下文或者是添加参数后函数
	     *
	     * @name    bind
	     * @grammar es5.bind(func, context[, arg1] [, arg2...])
			 */
			bind: function(func, context) {
				if (nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
				if (!c.isFunction(func)) throw new TypeError('Bind must be called on a function');
				// bind返回的函数应用分为普通函数和构造函数,如果以构造函数应用,则以构造函数原型创建的对象的实例为上下文,如果apply后,返回对象不是Object,则返回构造函数原型创建的对象
				var
					args = slice.call(arguments, 2),
					executeBound = function(bound, args) {
						var
							self = c.baseCreate(func.prototype),
							retult = func.apply(func instanceof bound ? self : context, args);

						return c.isObject(retult) ? retult : self;
					},
					bound = function() {
						return executeBound(bound, args.concat(slice.call(arguments)));
					};

				return bound;
			},
			/**
	     * 接收一个函数作为累加器,类数组中的每个值从左到右开始缩减，最终为一个值
	     *
	     * @param {arraylike} 类数组
	     * @param {function} 迭代函数
	     *   - param {*} previousValue
	     *   - param {*} currentValue
	     *   - param {*} index/key
	     *   - param {array|object} reduce的第一个参数
	     * @param {*} 可选,作为第一次调用iteratee的第一个参数,如果不存在,则把第一次要iteratee的value复制给memo,并且跳过index这次iteratee
	     * @param {object} iteratee的上下文,可选
	     *
	     * @name    reduce
	     * @grammar es5.reduce(arraylike, iteratee[, memo][, context])
			 */
			reduce: createReduce(1),
			/**
	     * 同reduce,区别是从类数组的末尾开始(从右到左)
	     *
			 * @name reduceRight
			 */
			reduceRight: createReduce(-1)
		};

		return es5;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 日期格式化、计算
	 *
	 * @author hbmu
	 * @date   2015/1/29
	 *
	 * @name   date
	 * @example
	 * var
	 *   birthday = new Date(), // 默认值,当前客户端时间Date实例
	 *   birthday2 = '/Date(562941040500+0800)/', // 非JS格式的时间戳,例如.NET
	 *   birthday3 = '1987/11/03 20:30:40', // 需要重新格式化的字符串,注意12小时制不支持
	 *   birthday4 = '1987/11/03', // 需要重新格式化的字符串
	 *   birthday5 = 562941040500, // 时间戳(number/string)
	 *   birthday6 = new Date('1987', '10', '03', '20', '30', '40', '500'); // Date实例
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (util) {
		"use strict";
		// 解析date,大部分
		function dateGetter(name, size, offset, trim) {
			offset = offset || 0;
			return function() {
				var value = this['get' + name]();

				// 这里是为了处理12小时制和month的+1
				if (offset > 0 || value > -offset) value += offset;
				if (value === 0 && offset == -12) value = 12;

				return util.pad(value, size, 0, false, trim);
			};
		};
		// 解析date,星期X
		function dayGetter(index) {
			return function() {
				var value = this.getDay();
				return dateFormats.day[index].split(',')[value];
			}
		};
		// 解析date,上下午
		function ampmGetter(index) {
			return function() {
				var ampm = dateFormats.ampm[index].split(',');
				return this.getHours() < 12 ? ampm[0] : ampm[1];
			}
		};
		// 解析date,季度
		function quarterGetter() {
			return Math.ceil((this.getMonth() + 1) / 3);
		};
		// 解析date,一年中的第几天
		function dayOfyearGetter(size) {
			return function() {
				var
					monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
					year = this.getFullYear(),
					month = this.getMonth(),
					day = this.getDate(),
					result = 0,
					i = 0;

				for (; i < month; i++) {
					result += monthArray[i];
				}
				result += day;

				//判断是否闰年
				if (month > 1 && (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
					result += 1;
				}

				return util.pad(result, size, 0);
			}
		};
		// 解析date,获取第几周
		function weekGetter(index, size) { // index(0-6, 0为星期天, 把周几当做一周的第一天)
			return function() {
				var
					firstDayOfFirstWeekOfYear = getFirstDayOfFirstWeekOfYear(this, index),
					firstDayOfThisWeek = getFirstDayOfThisWeek(this, index),
					diff = +firstDayOfThisWeek - +firstDayOfFirstWeekOfYear,
					result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

				return util.pad(result, size, 0);
			};
		};
		// 获取date所在年份,周的第一天
		function getFirstDayOfFirstWeekOfYear(date, index) {
			var
				year = date.getFullYear(),
				dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay(),
				diff = index - dayOfWeekOnFirst;

			if (diff > 0) diff -= 7;

			return new Date(year, 0, (1 + diff));
		};
		// 获取date所在周,周的第一天
		function getFirstDayOfThisWeek(date, index) { // index 同上
			var diff = index - date.getDay();

			if (diff > 0) diff -= 7;

			return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
		};
		// 处理参数date
		function dateHandler(date) {
			var
	      dArray, // 数组化后的日期
	      ret;

			if (typeof date === 'string') { // 如果date参数是string类型
				if (rNumberstring.test(date)) { // 如果date参数是number string类型
	        ret = new Date(date);
				} else { // 这里重新格式化,一般都是从服务端过来的数据,必须有年月日,并且顺序是年月日时分秒毫秒,并且7个值之间有间隔符,间隔符为\D
					dArray = date.match(rDatestring); // 从string中提取new Date需要的参数
					if(dArray.length < 3) { // 服务端时间戳,例如NET "/Date(562941040500+0800)/"
	          ret = new Date(+dArray[0]);
					} else { // 格式化过的
	          ret = new Date(dArray[0], dArray[1] - 1, dArray[2] || 1, dArray[3] || 0, dArray[4] || 0, dArray[5] || 0, dArray[6] || 0);
					}
				}
			} else if (typeof date === 'number' || Object.prototype.toString.call(date) === '[object Date]') { // 如果date参数是number类型、date类型
	      ret = new Date(date);
			} else if (date == null) { // 如果不存在date参数
	      ret = new Date();
			} else {
	      return false;
	    }

			return ret;
		}

		var rDatestring = /\d+/g;
		var rNumberstring = /^\d+$/;
		var dateFormats = {
			ampm: [
				'AM,PM',
				'am,am',
				'上午,下午'
			],
			day: [
				'周日,周一,周二,周三,周四,周五,周六',
				'星期日,星期一,星期二,星期三,星期四,星期五,星期六'
			]
		};

		// token 正则和格式化函数
		var rToken = /(\\?)([MQDdwYAaHhmsS]+)/g;
		var formatTokenFunctions = {
			M: dateGetter('Month', null, 1),
			MM: dateGetter('Month', 2, 1),
			Q: quarterGetter,
			D: dateGetter('Date'),
			DD: dateGetter('Date', 2),
			DDD: dayOfyearGetter(),
			DDDD: dayOfyearGetter(3),
			d: dateGetter('Day'),
			ddd: dayGetter(0),
			dddd: dayGetter(1),
			YY: dateGetter('FullYear', 2, null, true),
			YYYY: dateGetter('FullYear'),
			w: weekGetter(0),
			ww: weekGetter(0, 2),
			A: ampmGetter(0),
			a: ampmGetter(1),
			aa: ampmGetter(2),
			H: dateGetter('Hours'),
			HH: dateGetter('Hours', 2),
			h: dateGetter('Hours', null, -12),
			hh: dateGetter('Hours', 2, -12),
			m: dateGetter('Minutes'),
			mm: dateGetter('Minutes', 2),
			s: dateGetter('Seconds'),
			ss: dateGetter('Seconds', 2),
			S: dateGetter('Milliseconds'),
			SS: dateGetter('Milliseconds', 2),
			SSS: dateGetter('Milliseconds', 3)
		};

		var date = {
			/**
	     * 格式化日期
	     *
			 * @param  {number/string/date} 需要格式化的date
			 * @param  {string} token字符串
			 * @return {string} 格式化后的字符串
	     *
	     * @name    format
	     * @grammar date.format([date,] format)
	     * @example
	     * date.format(birthday6, 'YYYY-MM-DD HH:mm:ss:SSS') => '1987-11-03 20:30:40:500'
	     * date.format(birthday6, 'YY年M月D日 h时m分s秒 S毫秒 ddd') => '87年11月3日 8时30分40秒 500毫秒 周二'
	     * date.format(birthday6, '\\Q\\ww\\a,第Q季度,第ww周季度,A') => 'Qwwa,第4季度,第45周季度,PM'
	     *
	     * @more token映射表 参照 http://momentjs.com/docs/#/displaying/,只引用了其中一部分,涉及到中文的部分稍微有调整
	     * ==================================================================
	     *                          Token       Output
	     * Month                    M           1 2 ... 11 12
	     *                          MM          01 02 ... 11 12
	     * Quarter                  Q           1 2 3 4
	     * Day of Month             D           1 2 ... 30 31
	     *                          DD          01 02 ... 30 31
	     * Day of Year              DDD         1 2 ... 364 365
	     *                          DDDD        001 002 ... 364 365
	     * Day of Week              d           0 1 ... 5 6
	     *                          ddd         周日 周一 ... 周五 周六
	     *                          dddd        星期日 星期一 ... 星期五 星晴六
	     * Week of Year             w           1 2 ... 52 53
	     *                          ww          01 02 ... 52 53
	     * Year                     YY          70 71 ... 29 30
	     *                          YYYY        1970 1971 ... 2029 2030
	     * AM/PM                    A           AM PM
	     *                          a           am pm
	     *                          aa          上午 下午
	     * Hour                     H           0 1 ... 22 23
	     *                          HH          00 01 ... 22 23
	     *                          h           1 2 ... 11 12
	     *                          hh          01 02 ... 11 12
	     * Minute                   m           0 1 ... 58 59
	     *                          mm          00 01 ... 58 59
	     * Second                   s           0 1 ... 58 59
	     *                          ss          00 01 ... 58 59
	     * Fractional Second        S           0 1 ... 8 9
	     *                          SS          0 1 ... 98 99
	     *                          SSS         0 1 ... 998 999
	     * ==================================================================
			 */
			format: function(date, format) {
				if (arguments.length === 1) { // 修正参数
					format = date;
					date = null;
				}

				if(!(date = dateHandler(date))) return;

				return format.replace(rToken, function(match, escape, token) {
					if (escape) { // 如果是转义的则忽略，例如'\\Y'
						return token;
					}else {
						return formatTokenFunctions[token].call(date);
					}
				})
			}
		};

		/**
	   * 日期加减计算
	   *
	   * @param  {number|string|date} 需要格式化的date,不传默认为当前时间
		 * @param  {string} 单位['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds', 'Milliseconds', 'Time']
		 * @param  {number} n单位
		 * @return {Date} 计算后的结果
	   *
	   * @name    add/sub
	   * @grammar date.add([date,] name, number)/date.sub([date,] name, number)
	   * @example
	   * date.add(birthday6, 'Hours', 1) => Tue Nov 03 1987 21:30:40 GMT+0800 (CST)
	   * date.sub(birthday6, 'Minutes', 1) => Tue Nov 03 1987 20:29:40 GMT+0800 (CST)
		 */
		var computeFactory = function(method) {
			date[method] = function(date, name, num) {
				if (arguments.length === 2) { // 修正参数
					num = name;
					name = date;
					date = null;
				}
				date = dateHandler(date);
				method === 'sub' && (num = -num);
				date['set'+ name](date['get'+ name]() + num);
				return date;
			}
		};
		computeFactory('add');
		computeFactory('sub');

		return date;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 工具方法集
	 *
	 * @author hbmu
	 * @date   2014/10/20
	 *
	 * @name   utils
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		"use strict";
		// 随机生成一个4位字符
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}

		var utils = {
			/**
	     * 生成guid
	     *
	     * @return {string} guid
	     *
	     * @name    guid
	     * @grammar util.guid()
	     * @example
	     * util.guid() => 'd42fb5af-9b78-6320-9a79-327cb00ea561'
			 */
			guid: function() {
				return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
			},
			/**
	     * 字符串的长度和index计算
	     *
			 * @param  {string} 要计算的字符串
			 * @param  {number} 可选,字符串(双字节长度为2)的index
			 * @return {object} 返回对象
	     *   - length {number} 字符串(双字节长度为2)的长度
			 *   - index  {number} 字符串的index,如果参数index为空,则该字段无返回值
	     *
	     * @name    getByteInfo
	     * @grammar util.getByteInfo(str[, index])
	     * @example
	     * util.getByteInfo('我的生日是1987年11月03日', 5) => Object {length: 24, index: 2}
	     * util.getByteInfo('生日：1987-08-05') => Object {length: 16}
			 */
			getByteInfo: function(str, index) {
				var
					i = 0,
					len = str.length,
					ret = {
						length: 0
					};

				for (; i < len; i++) {
					if (str.charCodeAt(i) > 255) {
						ret.length += 2;
					}else {
						ret.length += 1;
					}
					if (index !== undefined && ret.index === undefined && ret.length > index) {
						ret.index = i;
					}
				}

				return ret;
			},
			/**
	     * 字符串填充
	     *
	     * @param  {string} 需要处理的字符串,非字符串会先转换为字符串
			 * @param  {number} 填充的长度,如果需要处理的字符串大于此参数,则放弃
			 * @param  {string} 可选,填充字符,非字符串会先转换为字符串,默认为空格字符
			 * @param  {boolean} 可选,左边还是右边,默认为false,左边
			 * @param  {boolean} 可选,字符串的长度超过参数len是否截取,默认为false
			 * @return {string} 处理后的字符串
	     *
	     * @name    pad
	     * @grammar util.pad(str, len[, fill][, right])
	     * @example
	     * util.pad('mo', 4, '-') => '--mo'
	     * util.pad(19871103, 14, 0, true) => '19871103000000'
	     * util.pad(19871103, 6, null, false, true) => '871103'
			 */
			pad: function(str, len, fill, right, trim) {
				str = str + '';

				if (!len || !trim && str.length >= len) return str;

				fill == null && (fill = '');

				fill = new Array(len + 1).join(fill);
				if (!right) {
					str = (fill + str).substr(-len);
				} else {
					str = (str + fill).substring(0, len);
				}

				return str;
			}
		};
		return utils;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 身份证的校验以及从从身份证号码中获取一些信息，例如出生日期，性别
	 *
	 * @author hbmu
	 * @date   2014/10/21
	 *
	 * @name   IdCard
	 * @more  身份证规则
	 * =====================================================================
	 * 身份证15位编码规则 -- dddddd yymmdd xx p
	 * dddddd : 地区码
	 * yymmdd : 出生年月日
	 * xx     : 顺序类编码，无法确定
	 * p      : 性别，奇数为男，偶数为女
	 *
	 * 身份证18位编码规则 -- dddddd yyyymmdd xxx y
	 * dddddd   : 地区码
	 * yyyymmdd : 出生年月日
	 * xxx      : 顺序类编码，无法确定，奇数为男，偶数为女
	 * y        : 校验码，该位数值可通过前17位计算获得
	 *
	 * 18位号码加权因子为          : WI = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
	 * 校验位集合                  : CODE = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2]
	 * 校验位index计算公式         : index = mod(∑(ai×Wi), 11)
	 * =====================================================================
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		"use strict";

		var
			WI = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1],
			CODE = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

		/**
	   * 构造函数
	   *
		 * @param {string} 身份证号,这里必须是string格式,因为身份证号超出了js的整数精度范围
	   *
	   * @name    IdCard
	   * @grammar new IdCard(num)
	   * @example
	   * var idCard = new IdCard('610125198711037137');
		 */
		function IdCard(num) {
			this.num = num;
		};

		/**
	   * 验证校验位,针对18位
	   *
		 * @return {boolean}
	   *
	   * @name checkCode
	   * @example
	   * idCard.checkCode() => true
		 */
		IdCard.prototype.checkCode = function() {
			var num = this.num;
			if (num.length === 18) {
				var
					sum = 0,
					i = 0;

				for(; i < 17; i++) {
					sum += WI[i] * num[i]
				};

				if (num[17].toUpperCase() !== String(CODE[sum % 11])) return false;
			}
			return true;
		};
		/**
	   * 验证出生日期
	   *
		 * @return {boolean}
	   *
	   * @name checkBirth
	   * @example
	   * idCard.checkBirth() => true
		 */
		IdCard.prototype.checkBirth = function() {
			var
				birth = this.getBirth(),
				date = new Date(birth.year, birth.month - 1, birth.day),
				newYear = date.getFullYear(),
				newMonth = date.getMonth() + 1,
				newDay = date.getDate(),
				now = new Date();
			if (+birth.year !== newYear || +birth.month !== newMonth || +birth.day !== newDay || date > now) return false;
			return true;
		};
		/**
	   * 获取出生日期
	   *
		 * @return {object} 返回对象
		 *   - year  {number}
		 *   - month {number}
		 *   - day   {number}
	   *
	   * @name getBirth
	   * @example
	   * idCard.getBirth() => {year: '1987', month: '11', day: '03'}
		 */
		IdCard.prototype.getBirth = function() {
			var num = this.num;
			if (num.length === 15) num = num.slice(0, 6) + "19" + num.slice(6, 16); // 修正15位的年月日
			return {
				year: num.slice(6, 10),
				month: num.slice(10, 12),
				day: num.slice(12, 14)
			};
		};
		/**
	   * 获取性别
	   *
		 * @return {string}
	   *
	   * @name getSex
	   * @example
	   * idCard.getSex() => '男'
		 */
		IdCard.prototype.getSex = function() {
			var sex, num = this.num;
			if(num.length === 18) {
				sex = num.substr(-2, 1) % 2;
			}else {
				sex = num.substr(-1, 1) % 2;
			}
			return sex ? '男' : '女';
		};

		return IdCard;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 解析url
	 * @author hbmu
	 * @date   2014/11/7
	 *
	 * @name   ParseUrl
	 * @more   url注解
	 * =====================================================================
	 *
	 * http://username:password&#64;www.example.com:80/path/file.name?query=string#anchor
	 * |__|   |______| |______| |_____________||_||___||________||___________||_____|
	 *  |        |        |            |       |   |         |         |        |
	 * protocol user   password      host  port directory  file      query   anchor
	 *       |_______________|                   |_____________|
	 *               |                                 |
	 *            userInfo                           path
	 *      |___________________________________||_________________________________|
	 *                        |                                   |
	 *                    authority                          relative
	 * |___________________________________________________________________________|
	 *                                         |
	 *                                       source
	 *
	 * =====================================================================
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		"use strict";

		var
			names = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
			// 匹配正则来自https://github.com/allmarkedup/purl/blob/master/purl.js中parser.loose
			rUrl = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;


	  /**
	   * 构造函数
	   *
	   * @param {string} 默认为location.href
	   *
	   * @name    ParseUrl
	   * @grammar new ParseUrl(url)
	   * @example
	   * var parseUrl = new ParseUrl('http://username:password&#64;www.example.com:80/path/file.name?query=string#anchor');
	   */
		function ParseUrl(url) {
			if (!url) url = window.location.href;

			var
				resources = rUrl.exec(url),
				result = this.result = {Attr: {}, Param: {}},
				query, i = 14;

			while (i--) result.Attr[names[i]] = resources[i] || '';

			if (query = result.Attr['query']) {
				query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
					if ($1) result.Param[$1] = $2;
				});
			};
		};

		/**
	   * 读取url中的attr,name为空,则返回所有attr
	   *
		 * @param  {string} name,可选 范围"source", "protocol", "authority", "userInfo", "user",
	   * "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"
		 * @return {string} value
	   *
	   * @name    getAttr
	   * @grammar parseUrl.getAttr([name])
	   * @example
	   * parseUrl.getAttr('port') => '80'
	   * url.getAttr('protocol') => 'http'
		 */
		ParseUrl.prototype.getAttr = function(name) {
			var attrs = this.result.Attr;
			return name ? attrs[name] : attrs;
		};

		/**
	   * 读取url中的param,name为空,则返回所有param
	   *
		 * @param  {string} name
		 * @return {string} value
	   *
	   * @name    getParam
	   * @grammar parseUrl.getParam([name])
	   * @example
	   * parseUrl.getParam() => {query: 'string'}
	   * parseUrl.getParam('query') => 'string'
		 */
		ParseUrl.prototype.getParam = function(name) {
			var params = this.result.Param;
			return name ? params[name] : params;
		};

		return ParseUrl;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * pub/sub 发布订阅
	 *
	 * @author hbmu
	 * @date   2015/4/30
	 *
	 * @name   pubSub
	 * @example
	 * var
	 *   data = [{
	 *     name: '熊大',
	 *     job: '阻止光头强砍树'
	 *   }, {
	 *     name: '熊二',
	 *     job: '调戏光头强'
	 *   }, {
	 *     name: '光头强',
	 *     job: '伐木'
	 *   }],
	 *   handler = handler = function(data) {
	 *     console.log(data.name + '应该' + data.job);
	 *   },
	 *   handler2 = function(data) {
	 *     console.log(data.name + '喜欢' + data.job);
	 *   };
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(8), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (es5, objectPath) {
		"use strict";

		var
			messages = {}, // 消息集合
			id = 0; // 处理句柄的id标识

		/**
		 * 订阅,私有方法
	   *
		 * @param {object} 消息集合(messages或者包含子message的message)
		 * @param {string} 消息
		 * @param {*} 执行订阅的handler时传入的data
		 */
		function _publish(messages, message, data) {
			var handlers = objectPath.get(messages, message);

			if (handlers) {
				es5.each(handlers, function(v, k) {
					// 循环messages, 若果key字符中包含'id_',则认为它是处理句柄handler,否则认为它是子message的obj,则再次调用pulish
					~k.indexOf('id_') ? v.handler.call(v.context, data) : _publish(handlers, k, data);
				}, this);
			}
		};

		var pubSub = {
			/**
	     * 发布
	     *
			 * @param {string} 消息,支持子message. eg. 'a.b.c'
			 * @param {*} 执行订阅的handler时传入的data
	     *
	     * @name    publish
	     * @grammar pubSub.publish(message, data)
			 */
			publish: function(message, data) {
				_publish(messages, message, data);
			},
			/**
	     * 订阅(注意,message不要包含'id_', eg. '...id_...')
	     *
			 * @param {string} 消息
			 * @param {function} 处理句柄
			 * @param {object} handler执行的上下文,可选
	     *
	     * @name    subscribe
	     * @grammar pubSub.subscribe(message, handler[, context])
	     * @example
	     * pubSub.subscribe('a', handler);
	     * pubSub.subscribe('a', handler2);
	     * pubSub.publish('a', data[0]);
	     * => '熊大应该阻止光头强砍树'
	     * => '熊大喜欢阻止光头强砍树'
	     * pubSub.subscribe('b', handler);
	     * pubSub.subscribe('b.b', handler2);
	     * pubSub.publish('b', data[1]);
	     * => '熊二应该调戏光头强'
	     * => '熊二喜欢调戏光头强'
	     * pubSub.subscribe('c', handler);
	     * pubSub.publish('c', data[2]);
	     * => '光头强应该伐木'
			 */
			subscribe: function(message, handler, context) {
				var handlers = objectPath.get(messages, message);

				if (handlers == null) objectPath.set(messages, message, handlers = {});
				handlers['id_' + id++] = {
					handler: handler,
					context: context
				};
			},
			/**
	     * 取消订阅(只能取消此message上的handler,不能作用于子message)
	     *
			 * @param {string} 消息
			 * @param {function} 处理句柄,可选,如果为空则清除message上的所有handler
	     *
	     * @name    unsubscribe
	     * @grammar pubSub.unsubscribe(message, handler)
	     * @example
	     * pubSub.unsubscribe('a', handler2);
	     * pubSub.publish('a', data[0]);
	     * => '熊大应该阻止光头强砍树'
	     * pubSub.unsubscribe('b');
	     * pubSub.publish('b', data[1]);
	     * => '熊二喜欢调戏光头强'
			 */
			unsubscribe: function(message, handler) {
				var
					handlers = objectPath.get(messages, message),
					result = {};

				if (handlers) {
					if (handler) { // handler存在则循环message,从handlers找出handler并删除.
						es5.each(handlers, function(v, k) {
							if (v.handler === handler) {
								delete handlers[k];
								return false;
							}
						});
					} else { // handler不存在则循环message,找出所有子message,最后重新set message.
						es5.each(handlers, function(v, k) {
							if (!~k.indexOf('id_')) result[k] = v;
						});
						objectPath.set(messages, message, result);
					}
				}
			},
			/**
	     * 清除某个message(包含子message)或者所有message的订阅
	     *
			 * @param {string} 消息,可选,如果message为空,则清除所有message.
	     *
	     * @name    clear
	     * @grammar pubSub.unsubscribe(message)
	     * @example
	     * pubSub.clear('b');
	     * pubSub.publish('b', data[1]);
	     * pubSub.clear();
	     * pubSub.publish('c', data[2]);
			 */
			clear: function(message) {
				if (message) {
					objectPath.set(messages, message, null);
				} else {
					messages = {};
				}
			}
		};

		return pubSub;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 常用的正则校验规则
	 *
	 * @author hbmu
	 * @date   2014/11/20
	 *
	 * @name   rules
	 * @example
	 * // 校验，返回值为true/false
	 * rules.isRequired('校验文本') // 必填
	 * rules.isChinese(..) // 中文
	 * rules.isDoubleByte(..) // 双字节
	 * rules.isZipcode(..) // 邮政编码
	 * rules.isQq(..) // QQ
	 * rules.isPicture(..) // 图片
	 * rules.isRar(..) // 压缩文件
	 * rules.isMobile(..) // 手机号
	 * rules.isMoney(..) // 金额（不能包含分隔符）
	 * rules.isEnglish(..) // 英文字母
	 * rules.isLowerCase(..) // 英文小写
	 * rules.isUpperCase(..) // 英文大写
	 * rules.isNumber(..) // 纯数字
	 * rules.isInteger(..) // 整数
	 * rules.isFloat(..) // 浮点数
	 * rules.isRealName(..) // 姓名（中英文）
	 * rules.isEmail(..) // 邮箱
	 * rules.isUrl(..) // 网址 http://mhbsesal.com
	 * rules.isIdCard(..) // 身份证
	 * rules.isPhone(..) // 座机（区号-主号-分机号）029-8784326-11316
	 * rules.isAreaNum(..) // 座机-区号
	 * rules.isHostNum(..) // 座机-主号
	 * rules.isExtensionNum(..) // 座机-分机号
	 * rules.isIp(..) // IP地址
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		"use strict";

		var rules = {
			isRequired: function(val) { return val !== '' },
			isChinese: function(val) { return /^[\u4e00-\u9fa5]+$/.test(val) },
			isDoubleByte: function(val) { return /[^\x00-\xff]/.test(val) },
			isZipcode: function(val) { return /^\d{6}$/.test(val) },
			isQq: function(val) { return /^[1-9]\d{4,9}$/.test(val) },
			isPicture: function(val) { return /\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(val) },
			isRar: function(val) { return /\.(rar|zip|7zip|tgz|)$/.test(val) },
			isMobile: function(val) { return /^1[34578]\d{9}$/.test(val) },
			isMoney: function(val) { return /^([1-9]\d*(\.\d{1,2})?|0\.\d{1,2})$/.test(val) },
			isEnglish: function(val) { return /^[A-Za-z]+$/.test(val) },
			isLowerCase: function(val) { return /^[a-z]+$/.test(val) },
			isUpperCase: function(val) { return /^[A-Z]+$/.test(val) },
			isNumber: function(val) { return /^\d+$/.test(val) },
			isInteger: function(val) { return /^-?[1-9]\d*$/.test(val) },
			isFloat: function(val) { return /^-?([1-9]\d*|0)\.\d+$/.test(val) },
			isRealName: function(val) { return /^[a-zA-Z\u4e00-\u9fa5]+$/.test(val) },
			isEmail: function(val) { return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val) },
			isUrl: function(val) { return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val) },
			isIdCard: function(val) { return /^(\d{15}|\d{17}[0-9a-zA-Z])$/.test(val) },
			isPhone: function(val) { return /^(\d{3,4}-)\d{7,8}(-\d{1,6})?$/.test(val) },
			isAreaNum: function(val) { return /^\d{3,4}$/.test(val) },
			isHostNum: function(val) { return /^\d{7,8}$/.test(val) },
			isExtensionNum: function(val) { return /^\d{1,6}$/.test(val) },
			isIp: function(val) { return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val) }
		};

		return rules;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
});
;