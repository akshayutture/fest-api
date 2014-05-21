﻿/*
Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
(function() {
	if (window.CKEDITOR && window.CKEDITOR.dom) return;
	window.CKEDITOR || (window.CKEDITOR = function() {
		var a = {
				timestamp: "E3OD",
				version: "4.4.0",
				revision: "98daef5",
				rnd: Math.floor(900 * Math.random()) + 100,
				_: {
					pending: []
				},
				status: "unloaded",
				basePath: function() {
					var a = window.CKEDITOR_BASEPATH || "";
					if (!a)
						for (var d = document.getElementsByTagName("script"), f = 0; f < d.length; f++) {
							var b = d[f].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
							if (b) {
								a = b[1];
								break
							}
						} - 1 == a.indexOf(":/") && "//" != a.slice(0, 2) && (a = 0 === a.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] +
							a : location.href.match(/^[^\?]*\/(?:)/)[0] + a);
					if (!a) throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
					return a
				}(),
				getUrl: function(a) {
					-1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a);
					this.timestamp && ("/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a)) && (a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
					return a
				},
				domReady: function() {
					function a() {
						try {
							document.addEventListener ? (document.removeEventListener("DOMContentLoaded",
								a, !1), d()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), d())
						} catch (f) {}
					}

					function d() {
						for (var a; a = f.shift();) a()
					}
					var f = [];
					return function(d) {
						f.push(d);
						"complete" === document.readyState && setTimeout(a, 1);
						if (1 == f.length)
							if (document.addEventListener) document.addEventListener("DOMContentLoaded", a, !1), window.addEventListener("load", a, !1);
							else if (document.attachEvent) {
							document.attachEvent("onreadystatechange", a);
							window.attachEvent("onload", a);
							d = !1;
							try {
								d = !window.frameElement
							} catch (b) {}
							if (document.documentElement.doScroll && d) {
								var e = function() {
									try {
										document.documentElement.doScroll("left")
									} catch (d) {
										setTimeout(e, 1);
										return
									}
									a()
								};
								e()
							}
						}
					}
				}()
			},
			e = window.CKEDITOR_GETURL;
		if (e) {
			var b = a.getUrl;
			a.getUrl = function(c) {
				return e.call(a, c) || b.call(a, c)
			}
		}
		return a
	}());
	CKEDITOR.event || (CKEDITOR.event = function() {}, CKEDITOR.event.implementOn = function(a) {
		var e = CKEDITOR.event.prototype,
			b;
		for (b in e) a[b] == void 0 && (a[b] = e[b])
	}, CKEDITOR.event.prototype = function() {
		function a(a) {
			var d = e(this);
			return d[a] || (d[a] = new b(a))
		}
		var e = function(a) {
				a = a.getPrivate && a.getPrivate() || a._ || (a._ = {});
				return a.events || (a.events = {})
			},
			b = function(a) {
				this.name = a;
				this.listeners = []
			};
		b.prototype = {
			getListenerIndex: function(a) {
				for (var d = 0, f = this.listeners; d < f.length; d++)
					if (f[d].fn == a) return d;
				return -1
			}
		};
		return {
			define: function(b, d) {
				var f = a.call(this, b);
				CKEDITOR.tools.extend(f, d, true)
			},
			on: function(b, d, f, e, n) {
				function i(a, o, s, q) {
					a = {
						name: b,
						sender: this,
						editor: a,
						data: o,
						listenerData: e,
						stop: s,
						cancel: q,
						removeListener: k
					};
					return d.call(f, a) === false ? false : a.data
				}

				function k() {
					s.removeListener(b, d)
				}
				var o = a.call(this, b);
				if (o.getListenerIndex(d) < 0) {
					o = o.listeners;
					f || (f = this);
					isNaN(n) && (n = 10);
					var s = this;
					i.fn = d;
					i.priority = n;
					for (var q = o.length - 1; q >= 0; q--)
						if (o[q].priority <= n) {
							o.splice(q + 1, 0, i);
							return {
								removeListener: k
							}
						}
					o.unshift(i)
				}
				return {
					removeListener: k
				}
			},
			once: function() {
				var a = arguments[1];
				arguments[1] = function(d) {
					d.removeListener();
					return a.apply(this, arguments)
				};
				return this.on.apply(this, arguments)
			},
			capture: function() {
				CKEDITOR.event.useCapture = 1;
				var a = this.on.apply(this, arguments);
				CKEDITOR.event.useCapture = 0;
				return a
			},
			fire: function() {
				var a = 0,
					d = function() {
						a = 1
					},
					f = 0,
					b = function() {
						f = 1
					};
				return function(n, i, k) {
					var o = e(this)[n],
						n = a,
						s = f;
					a = f = 0;
					if (o) {
						var q = o.listeners;
						if (q.length)
							for (var q = q.slice(0), u, g = 0; g < q.length; g++) {
								if (o.errorProof) try {
									u = q[g].call(this,
										k, i, d, b)
								} catch (p) {} else u = q[g].call(this, k, i, d, b);
								u === false ? f = 1 : typeof u != "undefined" && (i = u);
								if (a || f) break
							}
					}
					i = f ? false : typeof i == "undefined" ? true : i;
					a = n;
					f = s;
					return i
				}
			}(),
			fireOnce: function(a, d, f) {
				d = this.fire(a, d, f);
				delete e(this)[a];
				return d
			},
			removeListener: function(a, d) {
				var f = e(this)[a];
				if (f) {
					var b = f.getListenerIndex(d);
					b >= 0 && f.listeners.splice(b, 1)
				}
			},
			removeAllListeners: function() {
				var a = e(this),
					d;
				for (d in a) delete a[d]
			},
			hasListeners: function(a) {
				return (a = e(this)[a]) && a.listeners.length > 0
			}
		}
	}());
	CKEDITOR.editor || (CKEDITOR.editor = function() {
		CKEDITOR._.pending.push([this, arguments]);
		CKEDITOR.event.call(this)
	}, CKEDITOR.editor.prototype.fire = function(a, e) {
		a in {
			instanceReady: 1,
			loaded: 1
		} && (this[a] = true);
		return CKEDITOR.event.prototype.fire.call(this, a, e, this)
	}, CKEDITOR.editor.prototype.fireOnce = function(a, e) {
		a in {
			instanceReady: 1,
			loaded: 1
		} && (this[a] = true);
		return CKEDITOR.event.prototype.fireOnce.call(this, a, e, this)
	}, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype));
	CKEDITOR.env || (CKEDITOR.env = function() {
		var a = navigator.userAgent.toLowerCase(),
			e = {
				ie: a.indexOf("trident/") > -1,
				webkit: a.indexOf(" applewebkit/") > -1,
				air: a.indexOf(" adobeair/") > -1,
				mac: a.indexOf("macintosh") > -1,
				quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
				mobile: a.indexOf("mobile") > -1,
				iOS: /(ipad|iphone|ipod)/.test(a),
				isCustomDomain: function() {
					if (!this.ie) return false;
					var a = document.domain,
						f = window.location.hostname;
					return a != f && a != "[" + f + "]"
				},
				secure: location.protocol ==
					"https:"
			};
		e.gecko = navigator.product == "Gecko" && !e.webkit && !e.ie;
		if (e.webkit) a.indexOf("chrome") > -1 ? e.chrome = true : e.safari = true;
		var b = 0;
		if (e.ie) {
			b = e.quirks || !document.documentMode ? parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode;
			e.ie9Compat = b == 9;
			e.ie8Compat = b == 8;
			e.ie7Compat = b == 7;
			e.ie6Compat = b < 7 || e.quirks
		}
		if (e.gecko) {
			var c = a.match(/rv:([\d\.]+)/);
			if (c) {
				c = c[1].split(".");
				b = c[0] * 1E4 + (c[1] || 0) * 100 + (c[2] || 0) * 1
			}
		}
		e.air && (b = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
		e.webkit && (b = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
		e.version = b;
		e.isCompatible = e.iOS && b >= 534 || !e.mobile && (e.ie && b > 6 || e.gecko && b >= 2E4 || e.air && b >= 1 || e.webkit && b >= 522 || false);
		e.hidpi = window.devicePixelRatio >= 2;
		e.needsBrFiller = e.gecko || e.webkit || e.ie && b > 10;
		e.needsNbspFiller = e.ie && b < 11;
		e.cssClass = "cke_browser_" + (e.ie ? "ie" : e.gecko ? "gecko" : e.webkit ? "webkit" : "unknown");
		if (e.quirks) e.cssClass = e.cssClass + " cke_browser_quirks";
		if (e.ie) e.cssClass = e.cssClass + (" cke_browser_ie" + (e.quirks ? "6 cke_browser_iequirks" : e.version));
		if (e.air) e.cssClass = e.cssClass + " cke_browser_air";
		if (e.iOS) e.cssClass = e.cssClass + " cke_browser_ios";
		if (e.hidpi) e.cssClass = e.cssClass + " cke_hidpi";
		return e
	}());
	"unloaded" == CKEDITOR.status && function() {
		CKEDITOR.event.implementOn(CKEDITOR);
		CKEDITOR.loadFullCore = function() {
			if (CKEDITOR.status != "basic_ready") CKEDITOR.loadFullCore._load = 1;
			else {
				delete CKEDITOR.loadFullCore;
				var a = document.createElement("script");
				a.type = "text/javascript";
				a.src = CKEDITOR.basePath + "ckeditor.js";
				document.getElementsByTagName("head")[0].appendChild(a)
			}
		};
		CKEDITOR.loadFullCoreTimeout = 0;
		CKEDITOR.add = function(a) {
			(this._.pending || (this._.pending = [])).push(a)
		};
		(function() {
			CKEDITOR.domReady(function() {
				var a =
					CKEDITOR.loadFullCore,
					e = CKEDITOR.loadFullCoreTimeout;
				if (a) {
					CKEDITOR.status = "basic_ready";
					a && a._load ? a() : e && setTimeout(function() {
						CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
					}, e * 1E3)
				}
			})
		})();
		CKEDITOR.status = "basic_loaded"
	}();
	CKEDITOR.dom = {};
	(function() {
		var a = [],
			e = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "",
			b = /&/g,
			c = />/g,
			d = /</g,
			f = /"/g,
			h = /&amp;/g,
			n = /&gt;/g,
			i = /&lt;/g,
			k = /&quot;/g;
		CKEDITOR.on("reset", function() {
			a = []
		});
		CKEDITOR.tools = {
			arrayCompare: function(a, d) {
				if (!a && !d) return true;
				if (!a || !d || a.length != d.length) return false;
				for (var f = 0; f < a.length; f++)
					if (a[f] != d[f]) return false;
				return true
			},
			clone: function(a) {
				var d;
				if (a && a instanceof Array) {
					d = [];
					for (var f = 0; f < a.length; f++) d[f] = CKEDITOR.tools.clone(a[f]);
					return d
				}
				if (a === null || typeof a != "object" || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp) return a;
				d = new a.constructor;
				for (f in a) d[f] = CKEDITOR.tools.clone(a[f]);
				return d
			},
			capitalize: function(a, d) {
				return a.charAt(0).toUpperCase() + (d ? a.slice(1) : a.slice(1).toLowerCase())
			},
			extend: function(a) {
				var d = arguments.length,
					f, b;
				if (typeof(f = arguments[d - 1]) == "boolean") d--;
				else if (typeof(f = arguments[d - 2]) == "boolean") {
					b = arguments[d - 1];
					d = d - 2
				}
				for (var g = 1; g < d; g++) {
					var e =
						arguments[g],
						c;
					for (c in e)
						if (f === true || a[c] == void 0)
							if (!b || c in b) a[c] = e[c]
				}
				return a
			},
			prototypedCopy: function(a) {
				var d = function() {};
				d.prototype = a;
				return new d
			},
			copy: function(a) {
				var d = {},
					f;
				for (f in a) d[f] = a[f];
				return d
			},
			isArray: function(a) {
				return Object.prototype.toString.call(a) == "[object Array]"
			},
			isEmpty: function(a) {
				for (var d in a)
					if (a.hasOwnProperty(d)) return false;
				return true
			},
			cssVendorPrefix: function(a, d, f) {
				if (f) return e + a + ":" + d + ";" + a + ":" + d;
				f = {};
				f[a] = d;
				f[e + a] = d;
				return f
			},
			cssStyleToDomStyle: function() {
				var a =
					document.createElement("div").style,
					d = typeof a.cssFloat != "undefined" ? "cssFloat" : typeof a.styleFloat != "undefined" ? "styleFloat" : "float";
				return function(a) {
					return a == "float" ? d : a.replace(/-./g, function(a) {
						return a.substr(1).toUpperCase()
					})
				}
			}(),
			buildStyleHtml: function(a) {
				for (var a = [].concat(a), d, f = [], b = 0; b < a.length; b++)
					if (d = a[b]) /@import|[{}]/.test(d) ? f.push("<style>" + d + "</style>") : f.push('<link type="text/css" rel=stylesheet href="' + d + '">');
				return f.join("")
			},
			htmlEncode: function(a) {
				return ("" + a).replace(b,
					"&amp;").replace(c, "&gt;").replace(d, "&lt;")
			},
			htmlDecode: function(a) {
				return a.replace(h, "&").replace(n, ">").replace(i, "<")
			},
			htmlEncodeAttr: function(a) {
				return a.replace(f, "&quot;").replace(d, "&lt;").replace(c, "&gt;")
			},
			htmlDecodeAttr: function(a) {
				return a.replace(k, '"').replace(i, "<").replace(n, ">")
			},
			getNextNumber: function() {
				var a = 0;
				return function() {
					return ++a
				}
			}(),
			getNextId: function() {
				return "cke_" + this.getNextNumber()
			},
			override: function(a, d) {
				var f = d(a);
				f.prototype = a.prototype;
				return f
			},
			setTimeout: function(a,
				d, f, b, g) {
				g || (g = window);
				f || (f = g);
				return g.setTimeout(function() {
					b ? a.apply(f, [].concat(b)) : a.apply(f)
				}, d || 0)
			},
			trim: function() {
				var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
				return function(d) {
					return d.replace(a, "")
				}
			}(),
			ltrim: function() {
				var a = /^[ \t\n\r]+/g;
				return function(d) {
					return d.replace(a, "")
				}
			}(),
			rtrim: function() {
				var a = /[ \t\n\r]+$/g;
				return function(d) {
					return d.replace(a, "")
				}
			}(),
			indexOf: function(a, d) {
				if (typeof d == "function")
					for (var f = 0, b = a.length; f < b; f++) {
						if (d(a[f])) return f
					} else {
						if (a.indexOf) return a.indexOf(d);
						f = 0;
						for (b = a.length; f < b; f++)
							if (a[f] === d) return f
					}
				return -1
			},
			search: function(a, d) {
				var f = CKEDITOR.tools.indexOf(a, d);
				return f >= 0 ? a[f] : null
			},
			bind: function(a, d) {
				return function() {
					return a.apply(d, arguments)
				}
			},
			createClass: function(a) {
				var d = a.$,
					f = a.base,
					b = a.privates || a._,
					g = a.proto,
					a = a.statics;
				!d && (d = function() {
					f && this.base.apply(this, arguments)
				});
				if (b) var e = d,
					d = function() {
						var a = this._ || (this._ = {}),
							d;
						for (d in b) {
							var g = b[d];
							a[d] = typeof g == "function" ? CKEDITOR.tools.bind(g, this) : g
						}
						e.apply(this, arguments)
					};
				if (f) {
					d.prototype =
						this.prototypedCopy(f.prototype);
					d.prototype.constructor = d;
					d.base = f;
					d.baseProto = f.prototype;
					d.prototype.base = function() {
						this.base = f.prototype.base;
						f.apply(this, arguments);
						this.base = arguments.callee
					}
				}
				g && this.extend(d.prototype, g, true);
				a && this.extend(d, a, true);
				return d
			},
			addFunction: function(d, f) {
				return a.push(function() {
					return d.apply(f || this, arguments)
				}) - 1
			},
			removeFunction: function(d) {
				a[d] = null
			},
			callFunction: function(d) {
				var f = a[d];
				return f && f.apply(window, Array.prototype.slice.call(arguments, 1))
			},
			cssLength: function() {
				var a =
					/^-?\d+\.?\d*px$/,
					d;
				return function(f) {
					d = CKEDITOR.tools.trim(f + "") + "px";
					return a.test(d) ? d : f || ""
				}
			}(),
			convertToPx: function() {
				var a;
				return function(d) {
					if (!a) {
						a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
						CKEDITOR.document.getBody().append(a)
					}
					if (!/%$/.test(d)) {
						a.setStyle("width", d);
						return a.$.clientWidth
					}
					return d
				}
			}(),
			repeat: function(a, d) {
				return Array(d + 1).join(a)
			},
			tryThese: function() {
				for (var a,
					d = 0, f = arguments.length; d < f; d++) {
					var b = arguments[d];
					try {
						a = b();
						break
					} catch (g) {}
				}
				return a
			},
			genKey: function() {
				return Array.prototype.slice.call(arguments).join("-")
			},
			defer: function(a) {
				return function() {
					var d = arguments,
						f = this;
					window.setTimeout(function() {
						a.apply(f, d)
					}, 0)
				}
			},
			normalizeCssText: function(a, d) {
				var f = [],
					b, g = CKEDITOR.tools.parseCssText(a, true, d);
				for (b in g) f.push(b + ":" + g[b]);
				f.sort();
				return f.length ? f.join(";") + ";" : ""
			},
			convertRgbToHex: function(a) {
				return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi,
					function(a, d, f, g) {
						a = [d, f, g];
						for (d = 0; d < 3; d++) a[d] = ("0" + parseInt(a[d], 10).toString(16)).slice(-2);
						return "#" + a.join("")
					})
			},
			parseCssText: function(a, d, f) {
				var b = {};
				if (f) {
					f = new CKEDITOR.dom.element("span");
					f.setAttribute("style", a);
					a = CKEDITOR.tools.convertRgbToHex(f.getAttribute("style") || "")
				}
				if (!a || a == ";") return b;
				a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, f, o) {
					if (d) {
						f = f.toLowerCase();
						f == "font-family" && (o = o.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
						o = CKEDITOR.tools.trim(o)
					}
					b[f] = o
				});
				return b
			},
			writeCssText: function(a, d) {
				var f, b = [];
				for (f in a) b.push(f + ":" + a[f]);
				d && b.sort();
				return b.join("; ")
			},
			objectCompare: function(a, d, f) {
				var b;
				if (!a && !d) return true;
				if (!a || !d) return false;
				for (b in a)
					if (a[b] != d[b]) return false;
				if (!f)
					for (b in d)
						if (a[b] != d[b]) return false;
				return true
			},
			objectKeys: function(a) {
				var d = [],
					f;
				for (f in a) d.push(f);
				return d
			},
			convertArrayToObject: function(a, d) {
				var f = {};
				arguments.length == 1 && (d = true);
				for (var b = 0, g = a.length; b < g; ++b) f[a[b]] = d;
				return f
			},
			fixDomain: function() {
				for (var a;;) try {
					a = window.parent.document.domain;
					break
				} catch (d) {
					a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
					if (!a) break;
					document.domain = a
				}
				return !!a
			},
			eventsBuffer: function(a, d) {
				function f() {
					g = (new Date).getTime();
					b = false;
					d()
				}
				var b, g = 0;
				return {
					input: function() {
						if (!b) {
							var d = (new Date).getTime() - g;
							d < a ? b = setTimeout(f, a - d) : f()
						}
					},
					reset: function() {
						b && clearTimeout(b);
						b = g = 0
					}
				}
			},
			enableHtml5Elements: function(a, d) {
				for (var f = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data",
					"datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"
				], b = f.length, g; b--;) {
					g = a.createElement(f[b]);
					d && a.appendChild(g)
				}
			},
			checkIfAnyArrayItemMatches: function(a, d) {
				for (var f = 0, b = a.length; f < b; ++f)
					if (a[f].match(d)) return true;
				return false
			},
			checkIfAnyObjectPropertyMatches: function(a, d) {
				for (var f in a)
					if (f.match(d)) return true;
				return false
			},
			transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="
		}
	})();
	CKEDITOR.dtd = function() {
		var a = CKEDITOR.tools.extend,
			e = function(a, d) {
				for (var f = CKEDITOR.tools.clone(a), b = 1; b < arguments.length; b++) {
					var d = arguments[b],
						e;
					for (e in d) delete f[e]
				}
				return f
			},
			b = {},
			c = {},
			d = {
				address: 1,
				article: 1,
				aside: 1,
				blockquote: 1,
				details: 1,
				div: 1,
				dl: 1,
				fieldset: 1,
				figure: 1,
				footer: 1,
				form: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				header: 1,
				hgroup: 1,
				hr: 1,
				menu: 1,
				nav: 1,
				ol: 1,
				p: 1,
				pre: 1,
				section: 1,
				table: 1,
				ul: 1
			},
			f = {
				command: 1,
				link: 1,
				meta: 1,
				noscript: 1,
				script: 1,
				style: 1
			},
			h = {},
			n = {
				"#": 1
			},
			i = {
				center: 1,
				dir: 1,
				noframes: 1
			};
		a(b, {
			a: 1,
			abbr: 1,
			area: 1,
			audio: 1,
			b: 1,
			bdi: 1,
			bdo: 1,
			br: 1,
			button: 1,
			canvas: 1,
			cite: 1,
			code: 1,
			command: 1,
			datalist: 1,
			del: 1,
			dfn: 1,
			em: 1,
			embed: 1,
			i: 1,
			iframe: 1,
			img: 1,
			input: 1,
			ins: 1,
			kbd: 1,
			keygen: 1,
			label: 1,
			map: 1,
			mark: 1,
			meter: 1,
			noscript: 1,
			object: 1,
			output: 1,
			progress: 1,
			q: 1,
			ruby: 1,
			s: 1,
			samp: 1,
			script: 1,
			select: 1,
			small: 1,
			span: 1,
			strong: 1,
			sub: 1,
			sup: 1,
			textarea: 1,
			time: 1,
			u: 1,
			"var": 1,
			video: 1,
			wbr: 1
		}, n, {
			acronym: 1,
			applet: 1,
			basefont: 1,
			big: 1,
			font: 1,
			isindex: 1,
			strike: 1,
			style: 1,
			tt: 1
		});
		a(c, d, b, i);
		e = {
			a: e(b, {
				a: 1,
				button: 1
			}),
			abbr: b,
			address: c,
			area: h,
			article: a({
				style: 1
			}, c),
			aside: a({
				style: 1
			}, c),
			audio: a({
				source: 1,
				track: 1
			}, c),
			b: b,
			base: h,
			bdi: b,
			bdo: b,
			blockquote: c,
			body: c,
			br: h,
			button: e(b, {
				a: 1,
				button: 1
			}),
			canvas: b,
			caption: c,
			cite: b,
			code: b,
			col: h,
			colgroup: {
				col: 1
			},
			command: h,
			datalist: a({
				option: 1
			}, b),
			dd: c,
			del: b,
			details: a({
				summary: 1
			}, c),
			dfn: b,
			div: a({
				style: 1
			}, c),
			dl: {
				dt: 1,
				dd: 1
			},
			dt: c,
			em: b,
			embed: h,
			fieldset: a({
				legend: 1
			}, c),
			figcaption: c,
			figure: a({
				figcaption: 1
			}, c),
			footer: c,
			form: c,
			h1: b,
			h2: b,
			h3: b,
			h4: b,
			h5: b,
			h6: b,
			head: a({
				title: 1,
				base: 1
			}, f),
			header: c,
			hgroup: {
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1
			},
			hr: h,
			html: a({
				head: 1,
				body: 1
			}, c, f),
			i: b,
			iframe: n,
			img: h,
			input: h,
			ins: b,
			kbd: b,
			keygen: h,
			label: b,
			legend: b,
			li: c,
			link: h,
			map: c,
			mark: b,
			menu: a({
				li: 1
			}, c),
			meta: h,
			meter: e(b, {
				meter: 1
			}),
			nav: c,
			noscript: a({
				link: 1,
				meta: 1,
				style: 1
			}, b),
			object: a({
				param: 1
			}, b),
			ol: {
				li: 1
			},
			optgroup: {
				option: 1
			},
			option: n,
			output: b,
			p: b,
			param: h,
			pre: b,
			progress: e(b, {
				progress: 1
			}),
			q: b,
			rp: b,
			rt: b,
			ruby: a({
				rp: 1,
				rt: 1
			}, b),
			s: b,
			samp: b,
			script: n,
			section: a({
				style: 1
			}, c),
			select: {
				optgroup: 1,
				option: 1
			},
			small: b,
			source: h,
			span: b,
			strong: b,
			style: n,
			sub: b,
			summary: b,
			sup: b,
			table: {
				caption: 1,
				colgroup: 1,
				thead: 1,
				tfoot: 1,
				tbody: 1,
				tr: 1
			},
			tbody: {
				tr: 1
			},
			td: c,
			textarea: n,
			tfoot: {
				tr: 1
			},
			th: c,
			thead: {
				tr: 1
			},
			time: e(b, {
				time: 1
			}),
			title: n,
			tr: {
				th: 1,
				td: 1
			},
			track: h,
			u: b,
			ul: {
				li: 1
			},
			"var": b,
			video: a({
				source: 1,
				track: 1
			}, c),
			wbr: h,
			acronym: b,
			applet: a({
				param: 1
			}, c),
			basefont: h,
			big: b,
			center: c,
			dialog: h,
			dir: {
				li: 1
			},
			font: b,
			isindex: h,
			noframes: c,
			strike: b,
			tt: b
		};
		a(e, {
			$block: a({
				audio: 1,
				dd: 1,
				dt: 1,
				figcaption: 1,
				li: 1,
				video: 1
			}, d, i),
			$blockLimit: {
				article: 1,
				aside: 1,
				audio: 1,
				body: 1,
				caption: 1,
				details: 1,
				dir: 1,
				div: 1,
				dl: 1,
				fieldset: 1,
				figcaption: 1,
				figure: 1,
				footer: 1,
				form: 1,
				header: 1,
				hgroup: 1,
				menu: 1,
				nav: 1,
				ol: 1,
				section: 1,
				table: 1,
				td: 1,
				th: 1,
				tr: 1,
				ul: 1,
				video: 1
			},
			$cdata: {
				script: 1,
				style: 1
			},
			$editable: {
				address: 1,
				article: 1,
				aside: 1,
				blockquote: 1,
				body: 1,
				details: 1,
				div: 1,
				fieldset: 1,
				figcaption: 1,
				footer: 1,
				form: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				header: 1,
				hgroup: 1,
				nav: 1,
				p: 1,
				pre: 1,
				section: 1
			},
			$empty: {
				area: 1,
				base: 1,
				basefont: 1,
				br: 1,
				col: 1,
				command: 1,
				dialog: 1,
				embed: 1,
				hr: 1,
				img: 1,
				input: 1,
				isindex: 1,
				keygen: 1,
				link: 1,
				meta: 1,
				param: 1,
				source: 1,
				track: 1,
				wbr: 1
			},
			$inline: b,
			$list: {
				dl: 1,
				ol: 1,
				ul: 1
			},
			$listItem: {
				dd: 1,
				dt: 1,
				li: 1
			},
			$nonBodyContent: a({
				body: 1,
				head: 1,
				html: 1
			}, e.head),
			$nonEditable: {
				applet: 1,
				audio: 1,
				button: 1,
				embed: 1,
				iframe: 1,
				map: 1,
				object: 1,
				option: 1,
				param: 1,
				script: 1,
				textarea: 1,
				video: 1
			},
			$object: {
				applet: 1,
				audio: 1,
				button: 1,
				hr: 1,
				iframe: 1,
				img: 1,
				input: 1,
				object: 1,
				select: 1,
				table: 1,
				textarea: 1,
				video: 1
			},
			$removeEmpty: {
				abbr: 1,
				acronym: 1,
				b: 1,
				bdi: 1,
				bdo: 1,
				big: 1,
				cite: 1,
				code: 1,
				del: 1,
				dfn: 1,
				em: 1,
				font: 1,
				i: 1,
				ins: 1,
				label: 1,
				kbd: 1,
				mark: 1,
				meter: 1,
				output: 1,
				q: 1,
				ruby: 1,
				s: 1,
				samp: 1,
				small: 1,
				span: 1,
				strike: 1,
				strong: 1,
				sub: 1,
				sup: 1,
				time: 1,
				tt: 1,
				u: 1,
				"var": 1
			},
			$tabIndex: {
				a: 1,
				area: 1,
				button: 1,
				input: 1,
				object: 1,
				select: 1,
				textarea: 1
			},
			$tableContent: {
				caption: 1,
				col: 1,
				colgroup: 1,
				tbody: 1,
				td: 1,
				tfoot: 1,
				th: 1,
				thead: 1,
				tr: 1
			},
			$transparent: {
				a: 1,
				audio: 1,
				canvas: 1,
				del: 1,
				ins: 1,
				map: 1,
				noscript: 1,
				object: 1,
				video: 1
			},
			$intermediate: {
				caption: 1,
				colgroup: 1,
				dd: 1,
				dt: 1,
				figcaption: 1,
				legend: 1,
				li: 1,
				optgroup: 1,
				option: 1,
				rp: 1,
				rt: 1,
				summary: 1,
				tbody: 1,
				td: 1,
				tfoot: 1,
				th: 1,
				thead: 1,
				tr: 1
			}
		});
		return e
	}();
	CKEDITOR.dom.event = function(a) {
		this.$ = a
	};
	CKEDITOR.dom.event.prototype = {
		getKey: function() {
			return this.$.keyCode || this.$.which
		},
		getKeystroke: function() {
			var a = this.getKey();
			if (this.$.ctrlKey || this.$.metaKey) a = a + CKEDITOR.CTRL;
			this.$.shiftKey && (a = a + CKEDITOR.SHIFT);
			this.$.altKey && (a = a + CKEDITOR.ALT);
			return a
		},
		preventDefault: function(a) {
			var e = this.$;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			a && this.stopPropagation()
		},
		stopPropagation: function() {
			var a = this.$;
			a.stopPropagation ? a.stopPropagation() : a.cancelBubble = true
		},
		getTarget: function() {
			var a =
				this.$.target || this.$.srcElement;
			return a ? new CKEDITOR.dom.node(a) : null
		},
		getPhase: function() {
			return this.$.eventPhase || 2
		},
		getPageOffset: function() {
			var a = this.getTarget().getDocument().$;
			return {
				x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
				y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
			}
		}
	};
	CKEDITOR.CTRL = 1114112;
	CKEDITOR.SHIFT = 2228224;
	CKEDITOR.ALT = 4456448;
	CKEDITOR.EVENT_PHASE_CAPTURING = 1;
	CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
	CKEDITOR.EVENT_PHASE_BUBBLING = 3;
	CKEDITOR.dom.domObject = function(a) {
		if (a) this.$ = a
	};
	CKEDITOR.dom.domObject.prototype = function() {
		var a = function(a, b) {
			return function(c) {
				typeof CKEDITOR != "undefined" && a.fire(b, new CKEDITOR.dom.event(c))
			}
		};
		return {
			getPrivate: function() {
				var a;
				if (!(a = this.getCustomData("_"))) this.setCustomData("_", a = {});
				return a
			},
			on: function(e) {
				var b = this.getCustomData("_cke_nativeListeners");
				if (!b) {
					b = {};
					this.setCustomData("_cke_nativeListeners", b)
				}
				if (!b[e]) {
					b = b[e] = a(this, e);
					this.$.addEventListener ? this.$.addEventListener(e, b, !!CKEDITOR.event.useCapture) : this.$.attachEvent &&
						this.$.attachEvent("on" + e, b)
				}
				return CKEDITOR.event.prototype.on.apply(this, arguments)
			},
			removeListener: function(a) {
				CKEDITOR.event.prototype.removeListener.apply(this, arguments);
				if (!this.hasListeners(a)) {
					var b = this.getCustomData("_cke_nativeListeners"),
						c = b && b[a];
					if (c) {
						this.$.removeEventListener ? this.$.removeEventListener(a, c, false) : this.$.detachEvent && this.$.detachEvent("on" + a, c);
						delete b[a]
					}
				}
			},
			removeAllListeners: function() {
				var a = this.getCustomData("_cke_nativeListeners"),
					b;
				for (b in a) {
					var c = a[b];
					this.$.detachEvent ?
						this.$.detachEvent("on" + b, c) : this.$.removeEventListener && this.$.removeEventListener(b, c, false);
					delete a[b]
				}
				CKEDITOR.event.prototype.removeAllListeners.call(this)
			}
		}
	}();
	(function(a) {
		var e = {};
		CKEDITOR.on("reset", function() {
			e = {}
		});
		a.equals = function(a) {
			try {
				return a && a.$ === this.$
			} catch (c) {
				return false
			}
		};
		a.setCustomData = function(a, c) {
			var d = this.getUniqueId();
			(e[d] || (e[d] = {}))[a] = c;
			return this
		};
		a.getCustomData = function(a) {
			var c = this.$["data-cke-expando"];
			return (c = c && e[c]) && a in c ? c[a] : null
		};
		a.removeCustomData = function(a) {
			var c = this.$["data-cke-expando"],
				c = c && e[c],
				d, f;
			if (c) {
				d = c[a];
				f = a in c;
				delete c[a]
			}
			return f ? d : null
		};
		a.clearCustomData = function() {
			this.removeAllListeners();
			var a = this.$["data-cke-expando"];
			a && delete e[a]
		};
		a.getUniqueId = function() {
			return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
		};
		CKEDITOR.event.implementOn(a)
	})(CKEDITOR.dom.domObject.prototype);
	CKEDITOR.dom.node = function(a) {
		return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
	};
	CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject;
	CKEDITOR.NODE_ELEMENT = 1;
	CKEDITOR.NODE_DOCUMENT = 9;
	CKEDITOR.NODE_TEXT = 3;
	CKEDITOR.NODE_COMMENT = 8;
	CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;
	CKEDITOR.POSITION_IDENTICAL = 0;
	CKEDITOR.POSITION_DISCONNECTED = 1;
	CKEDITOR.POSITION_FOLLOWING = 2;
	CKEDITOR.POSITION_PRECEDING = 4;
	CKEDITOR.POSITION_IS_CONTAINED = 8;
	CKEDITOR.POSITION_CONTAINS = 16;
	CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
		appendTo: function(a, e) {
			a.append(this, e);
			return a
		},
		clone: function(a, e) {
			var b = this.$.cloneNode(a),
				c = function(d) {
					d["data-cke-expando"] && (d["data-cke-expando"] = false);
					if (d.nodeType == CKEDITOR.NODE_ELEMENT) {
						e || d.removeAttribute("id", false);
						if (a)
							for (var d = d.childNodes, f = 0; f < d.length; f++) c(d[f])
					}
				};
			c(b);
			return new CKEDITOR.dom.node(b)
		},
		hasPrevious: function() {
			return !!this.$.previousSibling
		},
		hasNext: function() {
			return !!this.$.nextSibling
		},
		insertAfter: function(a) {
			a.$.parentNode.insertBefore(this.$,
				a.$.nextSibling);
			return a
		},
		insertBefore: function(a) {
			a.$.parentNode.insertBefore(this.$, a.$);
			return a
		},
		insertBeforeMe: function(a) {
			this.$.parentNode.insertBefore(a.$, this.$);
			return a
		},
		getAddress: function(a) {
			for (var e = [], b = this.getDocument().$.documentElement, c = this.$; c && c != b;) {
				var d = c.parentNode;
				d && e.unshift(this.getIndex.call({
					$: c
				}, a));
				c = d
			}
			return e
		},
		getDocument: function() {
			return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
		},
		getIndex: function(a) {
			var e = this.$,
				b = -1,
				c;
			if (!this.$.parentNode) return b;
			do
				if (!a || !(e != this.$ && e.nodeType == CKEDITOR.NODE_TEXT && (c || !e.nodeValue))) {
					b++;
					c = e.nodeType == CKEDITOR.NODE_TEXT
				}
			while (e = e.previousSibling);
			return b
		},
		getNextSourceNode: function(a, e, b) {
			if (b && !b.call) var c = b,
				b = function(a) {
					return !a.equals(c)
				};
			var a = !a && this.getFirst && this.getFirst(),
				d;
			if (!a) {
				if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false) return null;
				a = this.getNext()
			}
			for (; !a && (d = (d || this).getParent());) {
				if (b && b(d, true) === false) return null;
				a = d.getNext()
			}
			return !a ||
				b && b(a) === false ? null : e && e != a.type ? a.getNextSourceNode(false, e, b) : a
		},
		getPreviousSourceNode: function(a, e, b) {
			if (b && !b.call) var c = b,
				b = function(a) {
					return !a.equals(c)
				};
			var a = !a && this.getLast && this.getLast(),
				d;
			if (!a) {
				if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false) return null;
				a = this.getPrevious()
			}
			for (; !a && (d = (d || this).getParent());) {
				if (b && b(d, true) === false) return null;
				a = d.getPrevious()
			}
			return !a || b && b(a) === false ? null : e && a.type != e ? a.getPreviousSourceNode(false, e, b) : a
		},
		getPrevious: function(a) {
			var e =
				this.$,
				b;
			do b = (e = e.previousSibling) && e.nodeType != 10 && new CKEDITOR.dom.node(e); while (b && a && !a(b));
			return b
		},
		getNext: function(a) {
			var e = this.$,
				b;
			do b = (e = e.nextSibling) && new CKEDITOR.dom.node(e); while (b && a && !a(b));
			return b
		},
		getParent: function(a) {
			var e = this.$.parentNode;
			return e && (e.nodeType == CKEDITOR.NODE_ELEMENT || a && e.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(e) : null
		},
		getParents: function(a) {
			var e = this,
				b = [];
			do b[a ? "push" : "unshift"](e); while (e = e.getParent());
			return b
		},
		getCommonAncestor: function(a) {
			if (a.equals(this)) return this;
			if (a.contains && a.contains(this)) return a;
			var e = this.contains ? this : this.getParent();
			do
				if (e.contains(a)) return e;
			while (e = e.getParent());
			return null
		},
		getPosition: function(a) {
			var e = this.$,
				b = a.$;
			if (e.compareDocumentPosition) return e.compareDocumentPosition(b);
			if (e == b) return CKEDITOR.POSITION_IDENTICAL;
			if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
				if (e.contains) {
					if (e.contains(b)) return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
					if (b.contains(e)) return CKEDITOR.POSITION_IS_CONTAINED +
						CKEDITOR.POSITION_FOLLOWING
				}
				if ("sourceIndex" in e) return e.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : e.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
			}
			for (var e = this.getAddress(), a = a.getAddress(), b = Math.min(e.length, a.length), c = 0; c <= b - 1; c++)
				if (e[c] != a[c]) {
					if (c < b) return e[c] < a[c] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
					break
				}
			return e.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED +
				CKEDITOR.POSITION_FOLLOWING
		},
		getAscendant: function(a, e) {
			var b = this.$,
				c;
			if (!e) b = b.parentNode;
			for (; b;) {
				if (b.nodeName && (c = b.nodeName.toLowerCase(), typeof a == "string" ? c == a : c in a)) return new CKEDITOR.dom.node(b);
				try {
					b = b.parentNode
				} catch (d) {
					b = null
				}
			}
			return null
		},
		hasAscendant: function(a, e) {
			var b = this.$;
			if (!e) b = b.parentNode;
			for (; b;) {
				if (b.nodeName && b.nodeName.toLowerCase() == a) return true;
				b = b.parentNode
			}
			return false
		},
		move: function(a, e) {
			a.append(this.remove(), e)
		},
		remove: function(a) {
			var e = this.$,
				b = e.parentNode;
			if (b) {
				if (a)
					for (; a = e.firstChild;) b.insertBefore(e.removeChild(a), e);
				b.removeChild(e)
			}
			return this
		},
		replace: function(a) {
			this.insertBefore(a);
			a.remove()
		},
		trim: function() {
			this.ltrim();
			this.rtrim()
		},
		ltrim: function() {
			for (var a; this.getFirst && (a = this.getFirst());) {
				if (a.type == CKEDITOR.NODE_TEXT) {
					var e = CKEDITOR.tools.ltrim(a.getText()),
						b = a.getLength();
					if (e) {
						if (e.length < b) {
							a.split(b - e.length);
							this.$.removeChild(this.$.firstChild)
						}
					} else {
						a.remove();
						continue
					}
				}
				break
			}
		},
		rtrim: function() {
			for (var a; this.getLast && (a =
				this.getLast());) {
				if (a.type == CKEDITOR.NODE_TEXT) {
					var e = CKEDITOR.tools.rtrim(a.getText()),
						b = a.getLength();
					if (e) {
						if (e.length < b) {
							a.split(e.length);
							this.$.lastChild.parentNode.removeChild(this.$.lastChild)
						}
					} else {
						a.remove();
						continue
					}
				}
				break
			}
			if (CKEDITOR.env.needsBrFiller)(a = this.$.lastChild) && (a.type == 1 && a.nodeName.toLowerCase() == "br") && a.parentNode.removeChild(a)
		},
		isReadOnly: function() {
			var a = this;
			this.type != CKEDITOR.NODE_ELEMENT && (a = this.getParent());
			if (a && typeof a.$.isContentEditable != "undefined") return !(a.$.isContentEditable ||
				a.data("cke-editable"));
			for (; a;) {
				if (a.data("cke-editable")) break;
				if (a.getAttribute("contentEditable") == "false") return true;
				if (a.getAttribute("contentEditable") == "true") break;
				a = a.getParent()
			}
			return !a
		}
	});
	CKEDITOR.dom.window = function(a) {
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
	CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
		focus: function() {
			this.$.focus()
		},
		getViewPaneSize: function() {
			var a = this.$.document,
				e = a.compatMode == "CSS1Compat";
			return {
				width: (e ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
				height: (e ? a.documentElement.clientHeight : a.body.clientHeight) || 0
			}
		},
		getScrollPosition: function() {
			var a = this.$;
			if ("pageXOffset" in a) return {
				x: a.pageXOffset || 0,
				y: a.pageYOffset || 0
			};
			a = a.document;
			return {
				x: a.documentElement.scrollLeft || a.body.scrollLeft || 0,
				y: a.documentElement.scrollTop ||
					a.body.scrollTop || 0
			}
		},
		getFrame: function() {
			var a = this.$.frameElement;
			return a ? new CKEDITOR.dom.element.get(a) : null
		}
	});
	CKEDITOR.dom.document = function(a) {
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
	CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
		type: CKEDITOR.NODE_DOCUMENT,
		appendStyleSheet: function(a) {
			if (this.$.createStyleSheet) this.$.createStyleSheet(a);
			else {
				var e = new CKEDITOR.dom.element("link");
				e.setAttributes({
					rel: "stylesheet",
					type: "text/css",
					href: a
				});
				this.getHead().append(e)
			}
		},
		appendStyleText: function(a) {
			if (this.$.createStyleSheet) {
				var e = this.$.createStyleSheet("");
				e.cssText = a
			} else {
				var b = new CKEDITOR.dom.element("style", this);
				b.append(new CKEDITOR.dom.text(a, this));
				this.getHead().append(b)
			}
			return e ||
				b.$.sheet
		},
		createElement: function(a, e) {
			var b = new CKEDITOR.dom.element(a, this);
			if (e) {
				e.attributes && b.setAttributes(e.attributes);
				e.styles && b.setStyles(e.styles)
			}
			return b
		},
		createText: function(a) {
			return new CKEDITOR.dom.text(a, this)
		},
		focus: function() {
			this.getWindow().focus()
		},
		getActive: function() {
			return new CKEDITOR.dom.element(this.$.activeElement)
		},
		getById: function(a) {
			return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null
		},
		getByAddress: function(a, e) {
			for (var b = this.$.documentElement, c =
				0; b && c < a.length; c++) {
				var d = a[c];
				if (e)
					for (var f = -1, h = 0; h < b.childNodes.length; h++) {
						var n = b.childNodes[h];
						if (!(e === true && n.nodeType == 3 && n.previousSibling && n.previousSibling.nodeType == 3)) {
							f++;
							if (f == d) {
								b = n;
								break
							}
						}
					} else b = b.childNodes[d]
			}
			return b ? new CKEDITOR.dom.node(b) : null
		},
		getElementsByTag: function(a, e) {
			if ((!CKEDITOR.env.ie || document.documentMode > 8) && e) a = e + ":" + a;
			return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
		},
		getHead: function() {
			var a = this.$.getElementsByTagName("head")[0];
			return a =
				a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true)
		},
		getBody: function() {
			return new CKEDITOR.dom.element(this.$.body)
		},
		getDocumentElement: function() {
			return new CKEDITOR.dom.element(this.$.documentElement)
		},
		getWindow: function() {
			return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView)
		},
		write: function(a) {
			this.$.open("text/html", "replace");
			CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain +
				")();<\/script>"));
			this.$.write(a);
			this.$.close()
		},
		find: function(a) {
			return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a))
		},
		findOne: function(a) {
			return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null
		},
		_getHtml5ShivFrag: function() {
			var a = this.getCustomData("html5ShivFrag");
			if (!a) {
				a = this.$.createDocumentFragment();
				CKEDITOR.tools.enableHtml5Elements(a, true);
				this.setCustomData("html5ShivFrag", a)
			}
			return a
		}
	});
	CKEDITOR.dom.nodeList = function(a) {
		this.$ = a
	};
	CKEDITOR.dom.nodeList.prototype = {
		count: function() {
			return this.$.length
		},
		getItem: function(a) {
			if (a < 0 || a >= this.$.length) return null;
			return (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
		}
	};
	CKEDITOR.dom.element = function(a, e) {
		typeof a == "string" && (a = (e ? e.$ : document).createElement(a));
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.element.get = function(a) {
		return (a = typeof a == "string" ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
	};
	CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
	CKEDITOR.dom.element.createFromHtml = function(a, e) {
		var b = new CKEDITOR.dom.element("div", e);
		b.setHtml(a);
		return b.getFirst().remove()
	};
	CKEDITOR.dom.element.setMarker = function(a, e, b, c) {
		var d = e.getCustomData("list_marker_id") || e.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),
			f = e.getCustomData("list_marker_names") || e.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
		a[d] = e;
		f[b] = 1;
		return e.setCustomData(b, c)
	};
	CKEDITOR.dom.element.clearAllMarkers = function(a) {
		for (var e in a) CKEDITOR.dom.element.clearMarkers(a, a[e], 1)
	};
	CKEDITOR.dom.element.clearMarkers = function(a, e, b) {
		var c = e.getCustomData("list_marker_names"),
			d = e.getCustomData("list_marker_id"),
			f;
		for (f in c) e.removeCustomData(f);
		e.removeCustomData("list_marker_names");
		if (b) {
			e.removeCustomData("list_marker_id");
			delete a[d]
		}
	};
	(function() {
		function a(a) {
			var f = true;
			if (!a.$.id) {
				a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
				f = false
			}
			return function() {
				f || a.removeAttribute("id")
			}
		}

		function e(a, f) {
			return "#" + a.$.id + " " + f.split(/,\s*/).join(", #" + a.$.id + " ")
		}

		function b(a) {
			for (var f = 0, b = 0, e = c[a].length; b < e; b++) f = f + (parseInt(this.getComputedStyle(c[a][b]) || 0, 10) || 0);
			return f
		}
		CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
			type: CKEDITOR.NODE_ELEMENT,
			addClass: function(a) {
				var f = this.$.className;
				f && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)",
					"").test(f) || (f = f + (" " + a)));
				this.$.className = f || a
			},
			removeClass: function(a) {
				var f = this.getAttribute("class");
				if (f) {
					a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
					if (a.test(f))(f = f.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", f) : this.removeAttribute("class")
				}
				return this
			},
			hasClass: function(a) {
				return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
			},
			append: function(a, f) {
				typeof a == "string" && (a = this.getDocument().createElement(a));
				f ? this.$.insertBefore(a.$, this.$.firstChild) :
					this.$.appendChild(a.$);
				return a
			},
			appendHtml: function(a) {
				if (this.$.childNodes.length) {
					var f = new CKEDITOR.dom.element("div", this.getDocument());
					f.setHtml(a);
					f.moveChildren(this)
				} else this.setHtml(a)
			},
			appendText: function(a) {
				this.$.text != void 0 ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
			},
			appendBogus: function(a) {
				if (a || CKEDITOR.env.needsBrFiller) {
					for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());) a = a.getPrevious();
					if (!a || !a.is || !a.is("br")) {
						a = this.getDocument().createElement("br");
						CKEDITOR.env.gecko && a.setAttribute("type", "_moz");
						this.append(a)
					}
				}
			},
			breakParent: function(a) {
				var f = new CKEDITOR.dom.range(this.getDocument());
				f.setStartAfter(this);
				f.setEndAfter(a);
				a = f.extractContents();
				f.insertNode(this.remove());
				a.insertAfterNode(this)
			},
			contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(a) {
				var f = this.$;
				return a.type != CKEDITOR.NODE_ELEMENT ? f.contains(a.getParent().$) : f != a.$ && f.contains(a.$)
			} : function(a) {
				return !!(this.$.compareDocumentPosition(a.$) & 16)
			},
			focus: function() {
				function a() {
					try {
						this.$.focus()
					} catch (d) {}
				}
				return function(f) {
					f ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
				}
			}(),
			getHtml: function() {
				var a = this.$.innerHTML;
				return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
			},
			getOuterHtml: function() {
				if (this.$.outerHTML) return this.$.outerHTML.replace(/<\?[^>]*>/, "");
				var a = this.$.ownerDocument.createElement("div");
				a.appendChild(this.$.cloneNode(true));
				return a.innerHTML
			},
			getClientRect: function() {
				var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
				!a.width && (a.width = a.right - a.left);
				!a.height &&
					(a.height = a.bottom - a.top);
				return a
			},
			setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function(a) {
				try {
					var f = this.$;
					if (this.getParent()) return f.innerHTML = a;
					var b = this.getDocument()._getHtml5ShivFrag();
					b.appendChild(f);
					f.innerHTML = a;
					b.removeChild(f);
					return a
				} catch (c) {
					this.$.innerHTML = "";
					f = new CKEDITOR.dom.element("body", this.getDocument());
					f.$.innerHTML = a;
					for (f = f.getChildren(); f.count();) this.append(f.getItem(0));
					return a
				}
			} : function(a) {
				return this.$.innerHTML = a
			},
			setText: function(a) {
				CKEDITOR.dom.element.prototype.setText =
					this.$.innerText != void 0 ? function(a) {
						return this.$.innerText = a
				} : function(a) {
					return this.$.textContent = a
				};
				return this.setText(a)
			},
			getAttribute: function() {
				var a = function(a) {
					return this.$.getAttribute(a, 2)
				};
				return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
					switch (a) {
						case "class":
							a = "className";
							break;
						case "http-equiv":
							a = "httpEquiv";
							break;
						case "name":
							return this.$.name;
						case "tabindex":
							a = this.$.getAttribute(a, 2);
							a !== 0 && this.$.tabIndex === 0 && (a = null);
							return a;
						case "checked":
							a =
								this.$.attributes.getNamedItem(a);
							return (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
						case "hspace":
						case "value":
							return this.$[a];
						case "style":
							return this.$.style.cssText;
						case "contenteditable":
						case "contentEditable":
							return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
					}
					return this.$.getAttribute(a, 2)
				} : a
			}(),
			getChildren: function() {
				return new CKEDITOR.dom.nodeList(this.$.childNodes)
			},
			getComputedStyle: CKEDITOR.env.ie ? function(a) {
				return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
			} : function(a) {
				var f = this.getWindow().$.getComputedStyle(this.$, null);
				return f ? f.getPropertyValue(a) : ""
			},
			getDtd: function() {
				var a = CKEDITOR.dtd[this.getName()];
				this.getDtd = function() {
					return a
				};
				return a
			},
			getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
			getTabIndex: CKEDITOR.env.ie ? function() {
				var a = this.$.tabIndex;
				a === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) && (a = -1);
				return a
			} : CKEDITOR.env.webkit ? function() {
				var a = this.$.tabIndex;
				if (a == void 0) {
					a =
						parseInt(this.getAttribute("tabindex"), 10);
					isNaN(a) && (a = -1)
				}
				return a
			} : function() {
				return this.$.tabIndex
			},
			getText: function() {
				return this.$.textContent || this.$.innerText || ""
			},
			getWindow: function() {
				return this.getDocument().getWindow()
			},
			getId: function() {
				return this.$.id || null
			},
			getNameAtt: function() {
				return this.$.name || null
			},
			getName: function() {
				var a = this.$.nodeName.toLowerCase();
				if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
					var f = this.$.scopeName;
					f != "HTML" && (a = f.toLowerCase() + ":" + a)
				}
				return (this.getName =
					function() {
						return a
					})()
			},
			getValue: function() {
				return this.$.value
			},
			getFirst: function(a) {
				var f = this.$.firstChild;
				(f = f && new CKEDITOR.dom.node(f)) && (a && !a(f)) && (f = f.getNext(a));
				return f
			},
			getLast: function(a) {
				var f = this.$.lastChild;
				(f = f && new CKEDITOR.dom.node(f)) && (a && !a(f)) && (f = f.getPrevious(a));
				return f
			},
			getStyle: function(a) {
				return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
			},
			is: function() {
				var a = this.getName();
				if (typeof arguments[0] == "object") return !!arguments[0][a];
				for (var f = 0; f < arguments.length; f++)
					if (arguments[f] ==
						a) return true;
				return false
			},
			isEditable: function(a) {
				var f = this.getName();
				if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[f] || CKEDITOR.dtd.$empty[f] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount()) return false;
				if (a !== false) {
					a = CKEDITOR.dtd[f] || CKEDITOR.dtd.span;
					return !(!a || !a["#"])
				}
				return true
			},
			isIdentical: function(a) {
				var f = this.clone(0, 1),
					a = a.clone(0, 1);
				f.removeAttributes(["_moz_dirty",
					"data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"
				]);
				a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
				if (f.$.isEqualNode) {
					f.$.style.cssText = CKEDITOR.tools.normalizeCssText(f.$.style.cssText);
					a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
					return f.$.isEqualNode(a.$)
				}
				f = f.getOuterHtml();
				a = a.getOuterHtml();
				if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
					var b = this.getParent();
					if (b.type == CKEDITOR.NODE_ELEMENT) {
						b =
							b.clone();
						b.setHtml(f);
						f = b.getHtml();
						b.setHtml(a);
						a = b.getHtml()
					}
				}
				return f == a
			},
			isVisible: function() {
				var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden",
					f, b;
				if (a && CKEDITOR.env.webkit) {
					f = this.getWindow();
					if (!f.equals(CKEDITOR.document.getWindow()) && (b = f.$.frameElement)) a = (new CKEDITOR.dom.element(b)).isVisible()
				}
				return !!a
			},
			isEmptyInlineRemoveable: function() {
				if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) return false;
				for (var a = this.getChildren(), f = 0, b = a.count(); f <
					b; f++) {
					var c = a.getItem(f);
					if (!(c.type == CKEDITOR.NODE_ELEMENT && c.data("cke-bookmark")) && (c.type == CKEDITOR.NODE_ELEMENT && !c.isEmptyInlineRemoveable() || c.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(c.getText()))) return false
				}
				return true
			},
			hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function() {
				for (var a = this.$.attributes, f = 0; f < a.length; f++) {
					var b = a[f];
					switch (b.nodeName) {
						case "class":
							if (this.getAttribute("class")) return true;
						case "data-cke-expando":
							continue;
						default:
							if (b.specified) return true
					}
				}
				return false
			} : function() {
				var a = this.$.attributes,
					f = a.length,
					b = {
						"data-cke-expando": 1,
						_moz_dirty: 1
					};
				return f > 0 && (f > 2 || !b[a[0].nodeName] || f == 2 && !b[a[1].nodeName])
			},
			hasAttribute: function() {
				function a(d) {
					d = this.$.attributes.getNamedItem(d);
					return !(!d || !d.specified)
				}
				return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function(f) {
					return f == "name" ? !!this.$.name : a.call(this, f)
				} : a
			}(),
			hide: function() {
				this.setStyle("display", "none")
			},
			moveChildren: function(a, f) {
				var b = this.$,
					a = a.$;
				if (b != a) {
					var c;
					if (f)
						for (; c = b.lastChild;) a.insertBefore(b.removeChild(c),
							a.firstChild);
					else
						for (; c = b.firstChild;) a.appendChild(b.removeChild(c))
				}
			},
			mergeSiblings: function() {
				function a(d, b, c) {
					if (b && b.type == CKEDITOR.NODE_ELEMENT) {
						for (var e = []; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();) {
							e.push(b);
							b = c ? b.getNext() : b.getPrevious();
							if (!b || b.type != CKEDITOR.NODE_ELEMENT) return
						}
						if (d.isIdentical(b)) {
							for (var k = c ? d.getLast() : d.getFirst(); e.length;) e.shift().move(d, !c);
							b.moveChildren(d, !c);
							b.remove();
							k && k.type == CKEDITOR.NODE_ELEMENT && k.mergeSiblings()
						}
					}
				}
				return function(f) {
					if (f ===
						false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
						a(this, this.getNext(), true);
						a(this, this.getPrevious())
					}
				}
			}(),
			show: function() {
				this.setStyles({
					display: "",
					visibility: ""
				})
			},
			setAttribute: function() {
				var a = function(a, d) {
					this.$.setAttribute(a, d);
					return this
				};
				return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(b, c) {
					b == "class" ? this.$.className = c : b == "style" ? this.$.style.cssText = c : b == "tabindex" ? this.$.tabIndex = c : b == "checked" ? this.$.checked = c : b == "contenteditable" ? a.call(this,
						"contentEditable", c) : a.apply(this, arguments);
					return this
				} : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(b, c) {
					if (b == "src" && c.match(/^http:\/\//)) try {
						a.apply(this, arguments)
					} catch (e) {} else a.apply(this, arguments);
					return this
				} : a
			}(),
			setAttributes: function(a) {
				for (var b in a) this.setAttribute(b, a[b]);
				return this
			},
			setValue: function(a) {
				this.$.value = a;
				return this
			},
			removeAttribute: function() {
				var a = function(a) {
					this.$.removeAttribute(a)
				};
				return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ?
					function(a) {
						a == "class" ? a = "className" : a == "tabindex" ? a = "tabIndex" : a == "contenteditable" && (a = "contentEditable");
						this.$.removeAttribute(a)
					} : a
			}(),
			removeAttributes: function(a) {
				if (CKEDITOR.tools.isArray(a))
					for (var b = 0; b < a.length; b++) this.removeAttribute(a[b]);
				else
					for (b in a) a.hasOwnProperty(b) && this.removeAttribute(b)
			},
			removeStyle: function(a) {
				var b = this.$.style;
				if (!b.removeProperty && (a == "border" || a == "margin" || a == "padding")) {
					var c = ["top", "left", "right", "bottom"],
						e;
					a == "border" && (e = ["color", "style", "width"]);
					for (var b = [], i = 0; i < c.length; i++)
						if (e)
							for (var k = 0; k < e.length; k++) b.push([a, c[i], e[k]].join("-"));
						else b.push([a, c[i]].join("-"));
					for (a = 0; a < b.length; a++) this.removeStyle(b[a])
				} else {
					b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
					this.$.style.cssText || this.removeAttribute("style")
				}
			},
			setStyle: function(a, b) {
				this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
				return this
			},
			setStyles: function(a) {
				for (var b in a) this.setStyle(b, a[b]);
				return this
			},
			setOpacity: function(a) {
				if (CKEDITOR.env.ie &&
					CKEDITOR.env.version < 9) {
					a = Math.round(a * 100);
					this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")
				} else this.setStyle("opacity", a)
			},
			unselectable: function() {
				this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
				if (CKEDITOR.env.ie) {
					this.setAttribute("unselectable", "on");
					for (var a, b = this.getElementsByTag("*"), c = 0, e = b.count(); c < e; c++) {
						a = b.getItem(c);
						a.setAttribute("unselectable", "on")
					}
				}
			},
			getPositionedAncestor: function() {
				for (var a = this; a.getName() != "html";) {
					if (a.getComputedStyle("position") !=
						"static") return a;
					a = a.getParent()
				}
				return null
			},
			getDocumentPosition: function(a) {
				var b = 0,
					c = 0,
					e = this.getDocument(),
					i = e.getBody(),
					k = e.$.compatMode == "BackCompat";
				if (document.documentElement.getBoundingClientRect) {
					var o = this.$.getBoundingClientRect(),
						s = e.$.documentElement,
						q = s.clientTop || i.$.clientTop || 0,
						u = s.clientLeft || i.$.clientLeft || 0,
						g = true;
					if (CKEDITOR.env.ie) {
						g = e.getDocumentElement().contains(this);
						e = e.getBody().contains(this);
						g = k && e || !k && g
					}
					if (g) {
						b = o.left + (!k && s.scrollLeft || i.$.scrollLeft);
						b = b - u;
						c =
							o.top + (!k && s.scrollTop || i.$.scrollTop);
						c = c - q
					}
				} else {
					i = this;
					for (e = null; i && !(i.getName() == "body" || i.getName() == "html");) {
						b = b + (i.$.offsetLeft - i.$.scrollLeft);
						c = c + (i.$.offsetTop - i.$.scrollTop);
						if (!i.equals(this)) {
							b = b + (i.$.clientLeft || 0);
							c = c + (i.$.clientTop || 0)
						}
						for (; e && !e.equals(i);) {
							b = b - e.$.scrollLeft;
							c = c - e.$.scrollTop;
							e = e.getParent()
						}
						e = i;
						i = (o = i.$.offsetParent) ? new CKEDITOR.dom.element(o) : null
					}
				} if (a) {
					i = this.getWindow();
					e = a.getWindow();
					if (!i.equals(e) && i.$.frameElement) {
						a = (new CKEDITOR.dom.element(i.$.frameElement)).getDocumentPosition(a);
						b = b + a.x;
						c = c + a.y
					}
				}
				if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !k) {
					b = b + (this.$.clientLeft ? 1 : 0);
					c = c + (this.$.clientTop ? 1 : 0)
				}
				return {
					x: b,
					y: c
				}
			},
			scrollIntoView: function(a) {
				var b = this.getParent();
				if (b) {
					do {
						(b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1);
						if (b.is("html")) {
							var c = b.getWindow();
							try {
								var e = c.$.frameElement;
								e && (b = new CKEDITOR.dom.element(e))
							} catch (i) {}
						}
					} while (b = b.getParent())
				}
			},
			scrollIntoParent: function(a, b, c) {
				var e, i, k, o;

				function s(b, g) {
					if (/body|html/.test(a.getName())) a.getWindow().$.scrollBy(b, g);
					else {
						a.$.scrollLeft = a.$.scrollLeft + b;
						a.$.scrollTop = a.$.scrollTop + g
					}
				}

				function q(a, b) {
					var d = {
						x: 0,
						y: 0
					};
					if (!a.is(g ? "body" : "html")) {
						var f = a.$.getBoundingClientRect();
						d.x = f.left;
						d.y = f.top
					}
					f = a.getWindow();
					if (!f.equals(b)) {
						f = q(CKEDITOR.dom.element.get(f.$.frameElement), b);
						d.x = d.x + f.x;
						d.y = d.y + f.y
					}
					return d
				}

				function u(a, b) {
					return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
				}!a &&
					(a = this.getWindow());
				k = a.getDocument();
				var g = k.$.compatMode == "BackCompat";
				a instanceof CKEDITOR.dom.window && (a = g ? k.getBody() : k.getDocumentElement());
				k = a.getWindow();
				i = q(this, k);
				var p = q(a, k),
					z = this.$.offsetHeight;
				e = this.$.offsetWidth;
				var A = a.$.clientHeight,
					m = a.$.clientWidth;
				k = i.x - u(this, "left") - p.x || 0;
				o = i.y - u(this, "top") - p.y || 0;
				e = i.x + e + u(this, "right") - (p.x + m) || 0;
				i = i.y + z + u(this, "bottom") - (p.y + A) || 0;
				if (o < 0 || i > 0) s(0, b === true ? o : b === false ? i : o < 0 ? o : i);
				if (c && (k < 0 || e > 0)) s(k < 0 ? k : e, 0)
			},
			setState: function(a, b,
				c) {
				b = b || "cke";
				switch (a) {
					case CKEDITOR.TRISTATE_ON:
						this.addClass(b + "_on");
						this.removeClass(b + "_off");
						this.removeClass(b + "_disabled");
						c && this.setAttribute("aria-pressed", true);
						c && this.removeAttribute("aria-disabled");
						break;
					case CKEDITOR.TRISTATE_DISABLED:
						this.addClass(b + "_disabled");
						this.removeClass(b + "_off");
						this.removeClass(b + "_on");
						c && this.setAttribute("aria-disabled", true);
						c && this.removeAttribute("aria-pressed");
						break;
					default:
						this.addClass(b + "_off");
						this.removeClass(b + "_on");
						this.removeClass(b +
							"_disabled");
						c && this.removeAttribute("aria-pressed");
						c && this.removeAttribute("aria-disabled")
				}
			},
			getFrameDocument: function() {
				var a = this.$;
				try {
					a.contentWindow.document
				} catch (b) {
					a.src = a.src
				}
				return a && new CKEDITOR.dom.document(a.contentWindow.document)
			},
			copyAttributes: function(a, b) {
				for (var c = this.$.attributes, b = b || {}, e = 0; e < c.length; e++) {
					var i = c[e],
						k = i.nodeName.toLowerCase(),
						o;
					if (!(k in b))
						if (k == "checked" && (o = this.getAttribute(k))) a.setAttribute(k, o);
						else if (i.specified || CKEDITOR.env.ie && i.nodeValue &&
						k == "value") {
						o = this.getAttribute(k);
						if (o === null) o = i.nodeValue;
						a.setAttribute(k, o)
					}
				}
				if (this.$.style.cssText !== "") a.$.style.cssText = this.$.style.cssText
			},
			renameNode: function(a) {
				if (this.getName() != a) {
					var b = this.getDocument(),
						a = new CKEDITOR.dom.element(a, b);
					this.copyAttributes(a);
					this.moveChildren(a);
					this.getParent() && this.$.parentNode.replaceChild(a.$, this.$);
					a.$["data-cke-expando"] = this.$["data-cke-expando"];
					this.$ = a.$;
					delete this.getName
				}
			},
			getChild: function() {
				function a(b, d) {
					var c = b.childNodes;
					if (d >=
						0 && d < c.length) return c[d]
				}
				return function(b) {
					var c = this.$;
					if (b.slice)
						for (; b.length > 0 && c;) c = a(c, b.shift());
					else c = a(c, b);
					return c ? new CKEDITOR.dom.node(c) : null
				}
			}(),
			getChildCount: function() {
				return this.$.childNodes.length
			},
			disableContextMenu: function() {
				this.on("contextmenu", function(a) {
					a.data.getTarget().hasClass("cke_enable_context_menu") || a.data.preventDefault()
				})
			},
			getDirection: function(a) {
				return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() && this.getParent().getDirection(1) ||
					this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
			},
			data: function(a, b) {
				a = "data-" + a;
				if (b === void 0) return this.getAttribute(a);
				b === false ? this.removeAttribute(a) : this.setAttribute(a, b);
				return null
			},
			getEditor: function() {
				var a = CKEDITOR.instances,
					b, c;
				for (b in a) {
					c = a[b];
					if (c.element.equals(this) && c.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) return c
				}
				return null
			},
			find: function(b) {
				var f = a(this),
					b = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(e(this, b)));
				f();
				return b
			},
			findOne: function(b) {
				var f = a(this),
					b = this.$.querySelector(e(this, b));
				f();
				return b ? new CKEDITOR.dom.element(b) : null
			},
			forEach: function(a, b, c) {
				if (!c && (!b || this.type == b)) var e = a(this);
				if (e !== false)
					for (var c = this.getChildren(), i = 0; i < c.count(); i++) {
						e = c.getItem(i);
						e.type == CKEDITOR.NODE_ELEMENT ? e.forEach(a, b) : (!b || e.type == b) && a(e)
					}
			}
		});
		var c = {
			width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
			height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
		};
		CKEDITOR.dom.element.prototype.setSize =
			function(a, c, e) {
				if (typeof c == "number") {
					if (e && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks)) c = c - b.call(this, a);
					this.setStyle(a, c + "px")
				}
		};
		CKEDITOR.dom.element.prototype.getSize = function(a, c) {
			var e = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
			c && (e = e - b.call(this, a));
			return e
		}
	})();
	CKEDITOR.dom.documentFragment = function(a) {
		a = a || CKEDITOR.document;
		this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a
	};
	CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
		type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
		insertAfterNode: function(a) {
			a = a.$;
			a.parentNode.insertBefore(this.$, a.nextSibling)
		}
	}, !0, {
		append: 1,
		appendBogus: 1,
		getFirst: 1,
		getLast: 1,
		getParent: 1,
		getNext: 1,
		getPrevious: 1,
		appendTo: 1,
		moveChildren: 1,
		insertBefore: 1,
		insertAfterNode: 1,
		replace: 1,
		trim: 1,
		type: 1,
		ltrim: 1,
		rtrim: 1,
		getDocument: 1,
		getChildCount: 1,
		getChild: 1,
		getChildren: 1
	});
	(function() {
		function a(a, b) {
			var c = this.range;
			if (this._.end) return null;
			if (!this._.start) {
				this._.start = 1;
				if (c.collapsed) {
					this.end();
					return null
				}
				c.optimize()
			}
			var g, d = c.startContainer;
			g = c.endContainer;
			var f = c.startOffset,
				e = c.endOffset,
				o, j = this.guard,
				l = this.type,
				v = a ? "getPreviousSourceNode" : "getNextSourceNode";
			if (!a && !this._.guardLTR) {
				var h = g.type == CKEDITOR.NODE_ELEMENT ? g : g.getParent(),
					r = g.type == CKEDITOR.NODE_ELEMENT ? g.getChild(e) : g.getNext();
				this._.guardLTR = function(a, b) {
					return (!b || !h.equals(a)) && (!r ||
						!a.equals(r)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
				}
			}
			if (a && !this._.guardRTL) {
				var i = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent(),
					k = d.type == CKEDITOR.NODE_ELEMENT ? f ? d.getChild(f - 1) : null : d.getPrevious();
				this._.guardRTL = function(a, b) {
					return (!b || !i.equals(a)) && (!k || !a.equals(k)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
				}
			}
			var n = a ? this._.guardRTL : this._.guardLTR;
			o = j ? function(a, b) {
				return n(a, b) === false ? false : j(a, b)
			} : n;
			if (this.current) g = this.current[v](false, l, o);
			else {
				if (a) g.type ==
					CKEDITOR.NODE_ELEMENT && (g = e > 0 ? g.getChild(e - 1) : o(g, true) === false ? null : g.getPreviousSourceNode(true, l, o));
				else {
					g = d;
					if (g.type == CKEDITOR.NODE_ELEMENT && !(g = g.getChild(f))) g = o(d, true) === false ? null : d.getNextSourceNode(true, l, o)
				}
				g && o(g) === false && (g = null)
			}
			for (; g && !this._.end;) {
				this.current = g;
				if (!this.evaluator || this.evaluator(g) !== false) {
					if (!b) return g
				} else if (b && this.evaluator) return false;
				g = g[v](false, l, o)
			}
			this.end();
			return this.current = null
		}

		function e(b) {
			for (var c, d = null; c = a.call(this, b);) d = c;
			return d
		}

		function b(a) {
			if (k(a)) return false;
			if (a.type == CKEDITOR.NODE_TEXT) return true;
			if (a.type == CKEDITOR.NODE_ELEMENT) {
				if (a.is(CKEDITOR.dtd.$inline) || a.getAttribute("contenteditable") == "false") return true;
				var b;
				if (b = !CKEDITOR.env.needsBrFiller)
					if (b = a.is(o)) a: {
						b = 0;
						for (var c = a.getChildCount(); b < c; ++b)
							if (!k(a.getChild(b))) {
								b = false;
								break a
							}
						b = true
					}
					if (b) return true
			}
			return false
		}
		CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
			$: function(a) {
				this.range = a;
				this._ = {}
			},
			proto: {
				end: function() {
					this._.end = 1
				},
				next: function() {
					return a.call(this)
				},
				previous: function() {
					return a.call(this, 1)
				},
				checkForward: function() {
					return a.call(this, 0, 1) !== false
				},
				checkBackward: function() {
					return a.call(this, 1, 1) !== false
				},
				lastForward: function() {
					return e.call(this)
				},
				lastBackward: function() {
					return e.call(this, 1)
				},
				reset: function() {
					delete this.current;
					this._ = {}
				}
			}
		});
		var c = {
				block: 1,
				"list-item": 1,
				table: 1,
				"table-row-group": 1,
				"table-header-group": 1,
				"table-footer-group": 1,
				"table-row": 1,
				"table-column-group": 1,
				"table-column": 1,
				"table-cell": 1,
				"table-caption": 1
			},
			d = {
				absolute: 1,
				fixed: 1
			};
		CKEDITOR.dom.element.prototype.isBlockBoundary = function(a) {
			return this.getComputedStyle("float") == "none" && !(this.getComputedStyle("position") in d) && c[this.getComputedStyle("display")] ? true : !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a))
		};
		CKEDITOR.dom.walker.blockBoundary = function(a) {
			return function(b) {
				return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
			}
		};
		CKEDITOR.dom.walker.listItemBoundary = function() {
			return this.blockBoundary({
				br: 1
			})
		};
		CKEDITOR.dom.walker.bookmark = function(a, b) {
			function c(a) {
				return a &&
					a.getName && a.getName() == "span" && a.data("cke-bookmark")
			}
			return function(g) {
				var d, f;
				d = g && g.type != CKEDITOR.NODE_ELEMENT && (f = g.getParent()) && c(f);
				d = a ? d : d || c(g);
				return !!(b ^ d)
			}
		};
		CKEDITOR.dom.walker.whitespaces = function(a) {
			return function(b) {
				var c;
				b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
				return !!(a ^ c)
			}
		};
		CKEDITOR.dom.walker.invisible = function(a) {
			var b = CKEDITOR.dom.walker.whitespaces();
			return function(c) {
				if (b(c)) c = 1;
				else {
					c.type == CKEDITOR.NODE_TEXT &&
						(c = c.getParent());
					c = !c.$.offsetHeight
				}
				return !!(a ^ c)
			}
		};
		CKEDITOR.dom.walker.nodeType = function(a, b) {
			return function(c) {
				return !!(b ^ c.type == a)
			}
		};
		CKEDITOR.dom.walker.bogus = function(a) {
			function b(a) {
				return !h(a) && !n(a)
			}
			return function(c) {
				var g = CKEDITOR.env.needsBrFiller ? c.is && c.is("br") : c.getText && f.test(c.getText());
				if (g) {
					g = c.getParent();
					c = c.getNext(b);
					g = g.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary())
				}
				return !!(a ^ g)
			}
		};
		CKEDITOR.dom.walker.temp = function(a) {
			return function(b) {
				b.type !=
					CKEDITOR.NODE_ELEMENT && (b = b.getParent());
				b = b && b.hasAttribute("data-cke-temp");
				return !!(a ^ b)
			}
		};
		var f = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
			h = CKEDITOR.dom.walker.whitespaces(),
			n = CKEDITOR.dom.walker.bookmark(),
			i = CKEDITOR.dom.walker.temp();
		CKEDITOR.dom.walker.ignored = function(a) {
			return function(b) {
				b = h(b) || n(b) || i(b);
				return !!(a ^ b)
			}
		};
		var k = CKEDITOR.dom.walker.ignored(),
			o = function(a) {
				var b = {},
					c;
				for (c in a) CKEDITOR.dtd[c]["#"] && (b[c] = 1);
				return b
			}(CKEDITOR.dtd.$block);
		CKEDITOR.dom.walker.editable = function(a) {
			return function(c) {
				return !!(a ^
					b(c))
			}
		};
		CKEDITOR.dom.element.prototype.getBogus = function() {
			var a = this;
			do a = a.getPreviousSourceNode(); while (n(a) || h(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty));
			return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && f.test(a.getText())) ? a : false
		}
	})();
	CKEDITOR.dom.range = function(a) {
		this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
		this.collapsed = true;
		var e = a instanceof CKEDITOR.dom.document;
		this.document = e ? a : a.getDocument();
		this.root = e ? a.getBody() : a
	};
	(function() {
		function a() {
			var a = false,
				b = CKEDITOR.dom.walker.whitespaces(),
				c = CKEDITOR.dom.walker.bookmark(true),
				d = CKEDITOR.dom.walker.bogus();
			return function(g) {
				if (c(g) || b(g)) return true;
				if (d(g) && !a) return a = true;
				return g.type == CKEDITOR.NODE_TEXT && (g.hasAscendant("pre") || CKEDITOR.tools.trim(g.getText()).length) || g.type == CKEDITOR.NODE_ELEMENT && !g.is(f) ? false : true
			}
		}

		function e(a) {
			var b = CKEDITOR.dom.walker.whitespaces(),
				c = CKEDITOR.dom.walker.bookmark(1);
			return function(d) {
				return c(d) || b(d) ? true : !a && h(d) ||
					d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$removeEmpty)
			}
		}

		function b(a) {
			return function() {
				var b;
				return this[a ? "getPreviousNode" : "getNextNode"](function(a) {
					!b && k(a) && (b = a);
					return i(a) && !(h(a) && a.equals(b))
				})
			}
		}
		var c = function(a) {
				a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
			},
			d = function(a, b, c, d) {
				a.optimizeBookmark();
				var g = a.startContainer,
					f = a.endContainer,
					e = a.startOffset,
					h = a.endOffset,
					m, j;
				if (f.type == CKEDITOR.NODE_TEXT) f = f.split(h);
				else if (f.getChildCount() > 0)
					if (h >= f.getChildCount()) {
						f = f.append(a.document.createText(""));
						j = true
					} else f = f.getChild(h);
				if (g.type == CKEDITOR.NODE_TEXT) {
					g.split(e);
					g.equals(f) && (f = g.getNext())
				} else if (e)
					if (e >= g.getChildCount()) {
						g = g.append(a.document.createText(""));
						m = true
					} else g = g.getChild(e).getPrevious();
				else {
					g = g.append(a.document.createText(""), 1);
					m = true
				}
				var e = g.getParents(),
					h = f.getParents(),
					l, v, i;
				for (l = 0; l < e.length; l++) {
					v = e[l];
					i = h[l];
					if (!v.equals(i)) break
				}
				for (var r = c, k, H, n, C = l; C < e.length; C++) {
					k =
						e[C];
					r && !k.equals(g) && (H = r.append(k.clone()));
					for (k = k.getNext(); k;) {
						if (k.equals(h[C]) || k.equals(f)) break;
						n = k.getNext();
						if (b == 2) r.append(k.clone(true));
						else {
							k.remove();
							b == 1 && r.append(k)
						}
						k = n
					}
					r && (r = H)
				}
				r = c;
				for (c = l; c < h.length; c++) {
					k = h[c];
					b > 0 && !k.equals(f) && (H = r.append(k.clone()));
					if (!e[c] || k.$.parentNode != e[c].$.parentNode)
						for (k = k.getPrevious(); k;) {
							if (k.equals(e[c]) || k.equals(g)) break;
							n = k.getPrevious();
							if (b == 2) r.$.insertBefore(k.$.cloneNode(true), r.$.firstChild);
							else {
								k.remove();
								b == 1 && r.$.insertBefore(k.$,
									r.$.firstChild)
							}
							k = n
						}
					r && (r = H)
				}
				if (b == 2) {
					v = a.startContainer;
					if (v.type == CKEDITOR.NODE_TEXT) {
						v.$.data = v.$.data + v.$.nextSibling.data;
						v.$.parentNode.removeChild(v.$.nextSibling)
					}
					a = a.endContainer;
					if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
						a.$.data = a.$.data + a.$.nextSibling.data;
						a.$.parentNode.removeChild(a.$.nextSibling)
					}
				} else {
					if (v && i && (g.$.parentNode != v.$.parentNode || f.$.parentNode != i.$.parentNode)) {
						b = i.getIndex();
						m && i.$.parentNode == g.$.parentNode && b--;
						if (d && v.type == CKEDITOR.NODE_ELEMENT) {
							d = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',
								a.document);
							d.insertAfter(v);
							v.mergeSiblings(false);
							a.moveToBookmark({
								startNode: d
							})
						} else a.setStart(i.getParent(), b)
					}
					a.collapse(true)
				}
				m && g.remove();
				j && f.$.parentNode && f.remove()
			},
			f = {
				abbr: 1,
				acronym: 1,
				b: 1,
				bdo: 1,
				big: 1,
				cite: 1,
				code: 1,
				del: 1,
				dfn: 1,
				em: 1,
				font: 1,
				i: 1,
				ins: 1,
				label: 1,
				kbd: 1,
				q: 1,
				samp: 1,
				small: 1,
				span: 1,
				strike: 1,
				strong: 1,
				sub: 1,
				sup: 1,
				tt: 1,
				u: 1,
				"var": 1
			},
			h = CKEDITOR.dom.walker.bogus(),
			n = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
			i = CKEDITOR.dom.walker.editable(),
			k = CKEDITOR.dom.walker.ignored(true);
		CKEDITOR.dom.range.prototype = {
			clone: function() {
				var a = new CKEDITOR.dom.range(this.root);
				a.startContainer = this.startContainer;
				a.startOffset = this.startOffset;
				a.endContainer = this.endContainer;
				a.endOffset = this.endOffset;
				a.collapsed = this.collapsed;
				return a
			},
			collapse: function(a) {
				if (a) {
					this.endContainer = this.startContainer;
					this.endOffset = this.startOffset
				} else {
					this.startContainer = this.endContainer;
					this.startOffset = this.endOffset
				}
				this.collapsed = true
			},
			cloneContents: function() {
				var a = new CKEDITOR.dom.documentFragment(this.document);
				this.collapsed ||
					d(this, 2, a);
				return a
			},
			deleteContents: function(a) {
				this.collapsed || d(this, 0, null, a)
			},
			extractContents: function(a) {
				var b = new CKEDITOR.dom.documentFragment(this.document);
				this.collapsed || d(this, 1, b, a);
				return b
			},
			createBookmark: function(a) {
				var b, c, d, g, f = this.collapsed;
				b = this.document.createElement("span");
				b.data("cke-bookmark", 1);
				b.setStyle("display", "none");
				b.setHtml("&nbsp;");
				if (a) {
					d = "cke_bm_" + CKEDITOR.tools.getNextNumber();
					b.setAttribute("id", d + (f ? "C" : "S"))
				}
				if (!f) {
					c = b.clone();
					c.setHtml("&nbsp;");
					a && c.setAttribute("id",
						d + "E");
					g = this.clone();
					g.collapse();
					g.insertNode(c)
				}
				g = this.clone();
				g.collapse(true);
				g.insertNode(b);
				if (c) {
					this.setStartAfter(b);
					this.setEndBefore(c)
				} else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
				return {
					startNode: a ? d + (f ? "C" : "S") : b,
					endNode: a ? d + "E" : c,
					serializable: a,
					collapsed: f
				}
			},
			createBookmark2: function() {
				function a(b) {
					var c = b.container,
						d = b.offset,
						g;
					g = c;
					var f = d;
					g = g.type != CKEDITOR.NODE_ELEMENT || f === 0 || f == g.getChildCount() ? 0 : g.getChild(f - 1).type == CKEDITOR.NODE_TEXT && g.getChild(f).type == CKEDITOR.NODE_TEXT;
					if (g) {
						c = c.getChild(d - 1);
						d = c.getLength()
					}
					c.type == CKEDITOR.NODE_ELEMENT && d > 1 && (d = c.getChild(d - 1).getIndex(true) + 1);
					if (c.type == CKEDITOR.NODE_TEXT) {
						g = c;
						for (f = 0;
							(g = g.getPrevious()) && g.type == CKEDITOR.NODE_TEXT;) f = f + g.getLength();
						d = d + f
					}
					b.container = c;
					b.offset = d
				}
				return function(b) {
					var c = this.collapsed,
						d = {
							container: this.startContainer,
							offset: this.startOffset
						},
						g = {
							container: this.endContainer,
							offset: this.endOffset
						};
					if (b) {
						a(d);
						c || a(g)
					}
					return {
						start: d.container.getAddress(b),
						end: c ? null : g.container.getAddress(b),
						startOffset: d.offset,
						endOffset: g.offset,
						normalized: b,
						collapsed: c,
						is2: true
					}
				}
			}(),
			moveToBookmark: function(a) {
				if (a.is2) {
					var b = this.document.getByAddress(a.start, a.normalized),
						c = a.startOffset,
						d = a.end && this.document.getByAddress(a.end, a.normalized),
						a = a.endOffset;
					this.setStart(b, c);
					d ? this.setEnd(d, a) : this.collapse(true)
				} else {
					b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
					a = c ? this.document.getById(a.endNode) : a.endNode;
					this.setStartBefore(b);
					b.remove();
					if (a) {
						this.setEndBefore(a);
						a.remove()
					} else this.collapse(true)
				}
			},
			getBoundaryNodes: function() {
				var a = this.startContainer,
					b = this.endContainer,
					c = this.startOffset,
					d = this.endOffset,
					g;
				if (a.type == CKEDITOR.NODE_ELEMENT) {
					g = a.getChildCount();
					if (g > c) a = a.getChild(c);
					else if (g < 1) a = a.getPreviousSourceNode();
					else {
						for (a = a.$; a.lastChild;) a = a.lastChild;
						a = new CKEDITOR.dom.node(a);
						a = a.getNextSourceNode() || a
					}
				}
				if (b.type == CKEDITOR.NODE_ELEMENT) {
					g = b.getChildCount();
					if (g > d) b = b.getChild(d).getPreviousSourceNode(true);
					else if (g < 1) b = b.getPreviousSourceNode();
					else {
						for (b = b.$; b.lastChild;) b =
							b.lastChild;
						b = new CKEDITOR.dom.node(b)
					}
				}
				a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
				return {
					startNode: a,
					endNode: b
				}
			},
			getCommonAncestor: function(a, b) {
				var c = this.startContainer,
					d = this.endContainer,
					c = c.equals(d) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
				return b && !c.is ? c.getParent() : c
			},
			optimize: function() {
				var a = this.startContainer,
					b = this.startOffset;
				a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) :
					this.setStartBefore(a));
				a = this.endContainer;
				b = this.endOffset;
				a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
			},
			optimizeBookmark: function() {
				var a = this.startContainer,
					b = this.endContainer;
				a.is && (a.is("span") && a.data("cke-bookmark")) && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
				b && (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
			},
			trim: function(a, b) {
				var c = this.startContainer,
					d = this.startOffset,
					g = this.collapsed;
				if ((!a || g) && c && c.type == CKEDITOR.NODE_TEXT) {
					if (d)
						if (d >= c.getLength()) {
							d = c.getIndex() + 1;
							c = c.getParent()
						} else {
							var f = c.split(d),
								d = c.getIndex() + 1,
								c = c.getParent();
							if (this.startContainer.equals(this.endContainer)) this.setEnd(f, this.endOffset - this.startOffset);
							else if (c.equals(this.endContainer)) this.endOffset = this.endOffset + 1
						} else {
						d = c.getIndex();
						c = c.getParent()
					}
					this.setStart(c, d);
					if (g) {
						this.collapse(true);
						return
					}
				}
				c = this.endContainer;
				d = this.endOffset;
				if (!b && !g && c && c.type == CKEDITOR.NODE_TEXT) {
					if (d) {
						d >= c.getLength() ||
							c.split(d);
						d = c.getIndex() + 1
					} else d = c.getIndex();
					c = c.getParent();
					this.setEnd(c, d)
				}
			},
			enlarge: function(a, b) {
				function c(a) {
					return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
				}
				var d = RegExp(/[^\s\ufeff]/);
				switch (a) {
					case CKEDITOR.ENLARGE_INLINE:
						var g = 1;
					case CKEDITOR.ENLARGE_ELEMENT:
						if (this.collapsed) break;
						var f = this.getCommonAncestor(),
							e = this.root,
							k, m, j, l, v, h = false,
							r, i;
						r = this.startContainer;
						var n = this.startOffset;
						if (r.type == CKEDITOR.NODE_TEXT) {
							if (n) {
								r = !CKEDITOR.tools.trim(r.substring(0,
									n)).length && r;
								h = !!r
							}
							if (r && !(l = r.getPrevious())) j = r.getParent()
						} else {
							n && (l = r.getChild(n - 1) || r.getLast());
							l || (j = r)
						}
						for (j = c(j); j || l;) {
							if (j && !l) {
								!v && j.equals(f) && (v = true);
								if (g ? j.isBlockBoundary() : !e.contains(j)) break;
								if (!h || j.getComputedStyle("display") != "inline") {
									h = false;
									v ? k = j : this.setStartBefore(j)
								}
								l = j.getPrevious()
							}
							for (; l;) {
								r = false;
								if (l.type == CKEDITOR.NODE_COMMENT) l = l.getPrevious();
								else {
									if (l.type == CKEDITOR.NODE_TEXT) {
										i = l.getText();
										d.test(i) && (l = null);
										r = /[\s\ufeff]$/.test(i)
									} else if ((l.$.offsetWidth >
										0 || b && l.is("br")) && !l.data("cke-bookmark"))
										if (h && CKEDITOR.dtd.$removeEmpty[l.getName()]) {
											i = l.getText();
											if (d.test(i)) l = null;
											else
												for (var n = l.$.getElementsByTagName("*"), G = 0, C; C = n[G++];)
													if (!CKEDITOR.dtd.$removeEmpty[C.nodeName.toLowerCase()]) {
														l = null;
														break
													}
											l && (r = !!i.length)
										} else l = null;
									r && (h ? v ? k = j : j && this.setStartBefore(j) : h = true);
									if (l) {
										r = l.getPrevious();
										if (!j && !r) {
											j = l;
											l = null;
											break
										}
										l = r
									} else j = null
								}
							}
							j && (j = c(j.getParent()))
						}
						r = this.endContainer;
						n = this.endOffset;
						j = l = null;
						v = h = false;
						var J = function(a, b) {
							var c =
								new CKEDITOR.dom.range(e);
							c.setStart(a, b);
							c.setEndAt(e, CKEDITOR.POSITION_BEFORE_END);
							var c = new CKEDITOR.dom.walker(c),
								g;
							for (c.guard = function(a) {
								return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary())
							}; g = c.next();) {
								if (g.type != CKEDITOR.NODE_TEXT) return false;
								i = g != a ? g.getText() : g.substring(b);
								if (d.test(i)) return false
							}
							return true
						};
						if (r.type == CKEDITOR.NODE_TEXT)
							if (CKEDITOR.tools.trim(r.substring(n)).length) h = true;
							else {
								h = !r.getLength();
								if (n == r.getLength()) {
									if (!(l = r.getNext())) j = r.getParent()
								} else J(r,
									n) && (j = r.getParent())
							} else(l = r.getChild(n)) || (j = r);
						for (; j || l;) {
							if (j && !l) {
								!v && j.equals(f) && (v = true);
								if (g ? j.isBlockBoundary() : !e.contains(j)) break;
								if (!h || j.getComputedStyle("display") != "inline") {
									h = false;
									v ? m = j : j && this.setEndAfter(j)
								}
								l = j.getNext()
							}
							for (; l;) {
								r = false;
								if (l.type == CKEDITOR.NODE_TEXT) {
									i = l.getText();
									J(l, 0) || (l = null);
									r = /^[\s\ufeff]/.test(i)
								} else if (l.type == CKEDITOR.NODE_ELEMENT) {
									if ((l.$.offsetWidth > 0 || b && l.is("br")) && !l.data("cke-bookmark"))
										if (h && CKEDITOR.dtd.$removeEmpty[l.getName()]) {
											i = l.getText();
											if (d.test(i)) l = null;
											else {
												n = l.$.getElementsByTagName("*");
												for (G = 0; C = n[G++];)
													if (!CKEDITOR.dtd.$removeEmpty[C.nodeName.toLowerCase()]) {
														l = null;
														break
													}
											}
											l && (r = !!i.length)
										} else l = null
								} else r = 1;
								r && h && (v ? m = j : this.setEndAfter(j));
								if (l) {
									r = l.getNext();
									if (!j && !r) {
										j = l;
										l = null;
										break
									}
									l = r
								} else j = null
							}
							j && (j = c(j.getParent()))
						}
						if (k && m) {
							f = k.contains(m) ? m : k;
							this.setStartBefore(f);
							this.setEndAfter(f)
						}
						break;
					case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
					case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
						j = new CKEDITOR.dom.range(this.root);
						e =
							this.root;
						j.setStartAt(e, CKEDITOR.POSITION_AFTER_START);
						j.setEnd(this.startContainer, this.startOffset);
						j = new CKEDITOR.dom.walker(j);
						var F, t, x = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
								br: 1
							} : null),
							y = null,
							B = function(a) {
								if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false")
									if (y) {
										if (y.equals(a)) {
											y = null;
											return
										}
									} else y = a;
								else if (y) return;
								var b = x(a);
								b || (F = a);
								return b
							},
							g = function(a) {
								var b = B(a);
								!b && (a.is && a.is("br")) && (t = a);
								return b
							};
						j.guard = B;
						j = j.lastBackward();
						F = F || e;
						this.setStartAt(F, !F.is("br") && (!j && this.checkStartOfBlock() || j && F.contains(j)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
						if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
							j = this.clone();
							j = new CKEDITOR.dom.walker(j);
							var w = CKEDITOR.dom.walker.whitespaces(),
								N = CKEDITOR.dom.walker.bookmark();
							j.evaluator = function(a) {
								return !w(a) && !N(a)
							};
							if ((j = j.previous()) && j.type == CKEDITOR.NODE_ELEMENT && j.is("br")) break
						}
						j = this.clone();
						j.collapse();
						j.setEndAt(e, CKEDITOR.POSITION_BEFORE_END);
						j = new CKEDITOR.dom.walker(j);
						j.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? g : B;
						F = null;
						j = j.lastForward();
						F = F || e;
						this.setEndAt(F, !j && this.checkEndOfBlock() || j && F.contains(j) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
						t && this.setEndAfter(t)
				}
			},
			shrink: function(a, b, c) {
				if (!this.collapsed) {
					var a = a || CKEDITOR.SHRINK_TEXT,
						d = this.clone(),
						g = this.startContainer,
						f = this.endContainer,
						e = this.startOffset,
						h = this.endOffset,
						m = 1,
						j = 1;
					if (g && g.type == CKEDITOR.NODE_TEXT)
						if (e)
							if (e >= g.getLength()) d.setStartAfter(g);
							else {
								d.setStartBefore(g);
								m = 0
							} else d.setStartBefore(g); if (f && f.type == CKEDITOR.NODE_TEXT)
						if (h)
							if (h >= f.getLength()) d.setEndAfter(f);
							else {
								d.setEndAfter(f);
								j = 0
							} else d.setEndBefore(f);
					var d = new CKEDITOR.dom.walker(d),
						l = CKEDITOR.dom.walker.bookmark();
					d.evaluator = function(b) {
						return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
					};
					var v;
					d.guard = function(b, g) {
						if (l(b)) return true;
						if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || g && b.equals(v) || c === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() ||
							b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable")) return false;
						!g && b.type == CKEDITOR.NODE_ELEMENT && (v = b);
						return true
					};
					if (m)(g = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(g, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
					if (j) {
						d.reset();
						(d = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(d, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
					}
					return !(!m && !j)
				}
			},
			insertNode: function(a) {
				this.optimizeBookmark();
				this.trim(false,
					true);
				var b = this.startContainer,
					c = b.getChild(this.startOffset);
				c ? a.insertBefore(c) : b.append(a);
				a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
				this.setStartBefore(a)
			},
			moveToPosition: function(a, b) {
				this.setStartAt(a, b);
				this.collapse(true)
			},
			moveToRange: function(a) {
				this.setStart(a.startContainer, a.startOffset);
				this.setEnd(a.endContainer, a.endOffset)
			},
			selectNodeContents: function(a) {
				this.setStart(a, 0);
				this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
			},
			setStart: function(a,
				b) {
				if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
					b = a.getIndex();
					a = a.getParent()
				}
				this.startContainer = a;
				this.startOffset = b;
				if (!this.endContainer) {
					this.endContainer = a;
					this.endOffset = b
				}
				c(this)
			},
			setEnd: function(a, b) {
				if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
					b = a.getIndex() + 1;
					a = a.getParent()
				}
				this.endContainer = a;
				this.endOffset = b;
				if (!this.startContainer) {
					this.startContainer = a;
					this.startOffset = b
				}
				c(this)
			},
			setStartAfter: function(a) {
				this.setStart(a.getParent(), a.getIndex() +
					1)
			},
			setStartBefore: function(a) {
				this.setStart(a.getParent(), a.getIndex())
			},
			setEndAfter: function(a) {
				this.setEnd(a.getParent(), a.getIndex() + 1)
			},
			setEndBefore: function(a) {
				this.setEnd(a.getParent(), a.getIndex())
			},
			setStartAt: function(a, b) {
				switch (b) {
					case CKEDITOR.POSITION_AFTER_START:
						this.setStart(a, 0);
						break;
					case CKEDITOR.POSITION_BEFORE_END:
						a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
						break;
					case CKEDITOR.POSITION_BEFORE_START:
						this.setStartBefore(a);
						break;
					case CKEDITOR.POSITION_AFTER_END:
						this.setStartAfter(a)
				}
				c(this)
			},
			setEndAt: function(a, b) {
				switch (b) {
					case CKEDITOR.POSITION_AFTER_START:
						this.setEnd(a, 0);
						break;
					case CKEDITOR.POSITION_BEFORE_END:
						a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
						break;
					case CKEDITOR.POSITION_BEFORE_START:
						this.setEndBefore(a);
						break;
					case CKEDITOR.POSITION_AFTER_END:
						this.setEndAfter(a)
				}
				c(this)
			},
			fixBlock: function(a, b) {
				var c = this.createBookmark(),
					d = this.document.createElement(b);
				this.collapse(a);
				this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
				this.extractContents().appendTo(d);
				d.trim();
				d.appendBogus();
				this.insertNode(d);
				this.moveToBookmark(c);
				return d
			},
			splitBlock: function(a) {
				var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
					c = new CKEDITOR.dom.elementPath(this.endContainer, this.root),
					d = b.block,
					g = c.block,
					f = null;
				if (!b.blockLimit.equals(c.blockLimit)) return null;
				if (a != "br") {
					if (!d) {
						d = this.fixBlock(true, a);
						g = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
					}
					g || (g = this.fixBlock(false, a))
				}
				a = d && this.checkStartOfBlock();
				b = g && this.checkEndOfBlock();
				this.deleteContents();
				if (d && d.equals(g))
					if (b) {
						f = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
						this.moveToPosition(g, CKEDITOR.POSITION_AFTER_END);
						g = null
					} else if (a) {
					f = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					this.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
					d = null
				} else {
					g = this.splitElement(d);
					d.is("ul", "ol") || d.appendBogus()
				}
				return {
					previousBlock: d,
					nextBlock: g,
					wasStartOfBlock: a,
					wasEndOfBlock: b,
					elementPath: f
				}
			},
			splitElement: function(a) {
				if (!this.collapsed) return null;
				this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
				var b = this.extractContents(),
					c = a.clone(false);
				b.appendTo(c);
				c.insertAfter(a);
				this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
				return c
			},
			removeEmptyBlocksAtEnd: function() {
				function a(d) {
					return function(a) {
						return b(a) || (c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) || d.is("table") && a.is("caption") ? false : true
					}
				}
				var b = CKEDITOR.dom.walker.whitespaces(),
					c = CKEDITOR.dom.walker.bookmark(false);
				return function(b) {
					for (var c = this.createBookmark(),
						d = this[b ? "endPath" : "startPath"](), f = d.block || d.blockLimit, e; f && !f.equals(d.root) && !f.getFirst(a(f));) {
						e = f.getParent();
						this[b ? "setEndAt" : "setStartAt"](f, CKEDITOR.POSITION_AFTER_END);
						f.remove(1);
						f = e
					}
					this.moveToBookmark(c)
				}
			}(),
			startPath: function() {
				return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
			},
			endPath: function() {
				return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
			},
			checkBoundaryOfElement: function(a, b) {
				var c = b == CKEDITOR.START,
					d = this.clone();
				d.collapse(c);
				d[c ? "setStartAt" :
					"setEndAt"](a, c ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
				d = new CKEDITOR.dom.walker(d);
				d.evaluator = e(c);
				return d[c ? "checkBackward" : "checkForward"]()
			},
			checkStartOfBlock: function() {
				var b = this.startContainer,
					c = this.startOffset;
				if (CKEDITOR.env.ie && c && b.type == CKEDITOR.NODE_TEXT) {
					b = CKEDITOR.tools.ltrim(b.substring(0, c));
					n.test(b) && this.trim(0, 1)
				}
				this.trim();
				b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
				c = this.clone();
				c.collapse(true);
				c.setStartAt(b.block || b.blockLimit,
					CKEDITOR.POSITION_AFTER_START);
				b = new CKEDITOR.dom.walker(c);
				b.evaluator = a();
				return b.checkBackward()
			},
			checkEndOfBlock: function() {
				var b = this.endContainer,
					c = this.endOffset;
				if (CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT) {
					b = CKEDITOR.tools.rtrim(b.substring(c));
					n.test(b) && this.trim(1, 0)
				}
				this.trim();
				b = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
				c = this.clone();
				c.collapse(false);
				c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END);
				b = new CKEDITOR.dom.walker(c);
				b.evaluator = a();
				return b.checkForward()
			},
			getPreviousNode: function(a, b, c) {
				var d = this.clone();
				d.collapse(1);
				d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
				c = new CKEDITOR.dom.walker(d);
				c.evaluator = a;
				c.guard = b;
				return c.previous()
			},
			getNextNode: function(a, b, c) {
				var d = this.clone();
				d.collapse();
				d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
				c = new CKEDITOR.dom.walker(d);
				c.evaluator = a;
				c.guard = b;
				return c.next()
			},
			checkReadOnly: function() {
				function a(b, c) {
					for (; b;) {
						if (b.type == CKEDITOR.NODE_ELEMENT) {
							if (b.getAttribute("contentEditable") ==
								"false" && !b.data("cke-editable")) return 0;
							if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c))) break
						}
						b = b.getParent()
					}
					return 1
				}
				return function() {
					var b = this.startContainer,
						c = this.endContainer;
					return !(a(b, c) && a(c, b))
				}
			}(),
			moveToElementEditablePosition: function(a, b) {
				if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
					this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
					return true
				}
				for (var c = 0; a;) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						b && this.endContainer &&
							this.checkEndOfBlock() && n.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
						c = 1;
						break
					}
					if (a.type == CKEDITOR.NODE_ELEMENT)
						if (a.isEditable()) {
							this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
							c = 1
						} else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock()) this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
					else if (a.getAttribute("contenteditable") == "false" &&
						a.is(CKEDITOR.dtd.$block)) {
						this.setStartBefore(a);
						this.setEndAfter(a);
						return true
					}
					var d = a,
						g = c,
						f = void 0;
					d.type == CKEDITOR.NODE_ELEMENT && d.isEditable(false) && (f = d[b ? "getLast" : "getFirst"](k));
					!g && !f && (f = d[b ? "getPrevious" : "getNext"](k));
					a = f
				}
				return !!c
			},
			moveToClosestEditablePosition: function(a, b) {
				var c = new CKEDITOR.dom.range(this.root),
					d = 0,
					g, f = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
				c.moveToPosition(a, f[b ? 0 : 1]);
				if (a.is(CKEDITOR.dtd.$block)) {
					if (g = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
						d =
							1;
						if (g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.$block) && g.getAttribute("contenteditable") == "false") {
							c.setStartAt(g, CKEDITOR.POSITION_BEFORE_START);
							c.setEndAt(g, CKEDITOR.POSITION_AFTER_END)
						} else c.moveToPosition(g, f[b ? 1 : 0])
					}
				} else d = 1;
				d && this.moveToRange(c);
				return !!d
			},
			moveToElementEditStart: function(a) {
				return this.moveToElementEditablePosition(a)
			},
			moveToElementEditEnd: function(a) {
				return this.moveToElementEditablePosition(a, true)
			},
			getEnclosedNode: function() {
				var a = this.clone();
				a.optimize();
				if (a.startContainer.type !=
					CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT) return null;
				var a = new CKEDITOR.dom.walker(a),
					b = CKEDITOR.dom.walker.bookmark(false, true),
					c = CKEDITOR.dom.walker.whitespaces(true);
				a.evaluator = function(a) {
					return c(a) && b(a)
				};
				var d = a.next();
				a.reset();
				return d && d.equals(a.previous()) ? d : null
			},
			getTouchedStartNode: function() {
				var a = this.startContainer;
				return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
			},
			getTouchedEndNode: function() {
				var a = this.endContainer;
				return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
			},
			getNextEditableNode: b(),
			getPreviousEditableNode: b(1),
			scrollIntoView: function() {
				var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document),
					b, c, d, g = this.clone();
				g.optimize();
				if (d = g.startContainer.type == CKEDITOR.NODE_TEXT) {
					c = g.startContainer.getText();
					b = g.startContainer.split(g.startOffset);
					a.insertAfter(g.startContainer)
				} else g.insertNode(a);
				a.scrollIntoView();
				if (d) {
					g.startContainer.setText(c);
					b.remove()
				}
				a.remove()
			}
		}
	})();
	CKEDITOR.POSITION_AFTER_START = 1;
	CKEDITOR.POSITION_BEFORE_END = 2;
	CKEDITOR.POSITION_BEFORE_START = 3;
	CKEDITOR.POSITION_AFTER_END = 4;
	CKEDITOR.ENLARGE_ELEMENT = 1;
	CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2;
	CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;
	CKEDITOR.ENLARGE_INLINE = 4;
	CKEDITOR.START = 1;
	CKEDITOR.END = 2;
	CKEDITOR.SHRINK_ELEMENT = 1;
	CKEDITOR.SHRINK_TEXT = 2;
	"use strict";
	(function() {
		function a(a) {
			if (!(arguments.length < 1)) {
				this.range = a;
				this.forceBrBreak = 0;
				this.enlargeBr = 1;
				this.enforceRealBlocks = 0;
				this._ || (this._ = {})
			}
		}

		function e(a, b, c) {
			for (a = a.getNextSourceNode(b, null, c); !f(a);) a = a.getNextSourceNode(b, null, c);
			return a
		}

		function b(a) {
			var b = [];
			a.forEach(function(a) {
				if (a.getAttribute("contenteditable") == "true") {
					b.push(a);
					return false
				}
			}, CKEDITOR.NODE_ELEMENT, true);
			return b
		}

		function c(a, d, f, e) {
			a: {
				e == void 0 && (e = b(f));
				for (var h; h = e.shift();)
					if (h.getDtd().p) {
						e = {
							element: h,
							remaining: e
						};
						break a
					}
				e = null
			}
			if (!e) return 0;
			if ((h = CKEDITOR.filter.instances[e.element.data("cke-filter")]) && !h.check(d)) return c(a, d, f, e.remaining);
			d = new CKEDITOR.dom.range(e.element);
			d.selectNodeContents(e.element);
			d = d.createIterator();
			d.enlargeBr = a.enlargeBr;
			d.enforceRealBlocks = a.enforceRealBlocks;
			d.activeFilter = d.filter = h;
			a._.nestedEditable = {
				element: e.element,
				container: f,
				remaining: e.remaining,
				iterator: d
			};
			return 1
		}
		var d = /^[\r\n\t ]+$/,
			f = CKEDITOR.dom.walker.bookmark(false, true),
			h = CKEDITOR.dom.walker.whitespaces(true),
			n = function(a) {
				return f(a) && h(a)
			};
		a.prototype = {
			getNextParagraph: function(a) {
				var b, h, s, q, u, a = a || "p";
				if (this._.nestedEditable) {
					if (b = this._.nestedEditable.iterator.getNextParagraph(a)) {
						this.activeFilter = this._.nestedEditable.iterator.activeFilter;
						return b
					}
					this.activeFilter = this.filter;
					if (c(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
						this.activeFilter = this._.nestedEditable.iterator.activeFilter;
						return this._.nestedEditable.iterator.getNextParagraph(a)
					}
					this._.nestedEditable =
						null
				}
				if (!this.range.root.getDtd()[a]) return null;
				if (!this._.started) {
					var g = this.range.clone();
					g.shrink(CKEDITOR.SHRINK_ELEMENT, true);
					h = g.endContainer.hasAscendant("pre", true) || g.startContainer.hasAscendant("pre", true);
					g.enlarge(this.forceBrBreak && !h || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					if (!g.collapsed) {
						h = new CKEDITOR.dom.walker(g.clone());
						var p = CKEDITOR.dom.walker.bookmark(true, true);
						h.evaluator = p;
						this._.nextNode = h.next();
						h = new CKEDITOR.dom.walker(g.clone());
						h.evaluator = p;
						h = h.previous();
						this._.lastNode = h.getNextSourceNode(true);
						if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
							p = this.range.clone();
							p.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
							if (p.checkEndOfBlock()) {
								p = new CKEDITOR.dom.elementPath(p.endContainer, p.root);
								this._.lastNode = (p.block || p.blockLimit).getNextSourceNode(true)
							}
						}
						if (!this._.lastNode || !g.root.contains(this._.lastNode)) {
							this._.lastNode =
								this._.docEndMarker = g.document.createText("");
							this._.lastNode.insertAfter(h)
						}
						g = null
					}
					this._.started = 1;
					h = g
				}
				p = this._.nextNode;
				g = this._.lastNode;
				for (this._.nextNode = null; p;) {
					var z = 0,
						A = p.hasAscendant("pre"),
						m = p.type != CKEDITOR.NODE_ELEMENT,
						j = 0;
					if (m) p.type == CKEDITOR.NODE_TEXT && d.test(p.getText()) && (m = 0);
					else {
						var l = p.getName();
						if (CKEDITOR.dtd.$block[l] && p.getAttribute("contenteditable") == "false") {
							b = p;
							c(this, a, b);
							break
						} else if (p.isBlockBoundary(this.forceBrBreak && !A && {
							br: 1
						})) {
							if (l == "br") m = 1;
							else if (!h && !p.getChildCount() &&
								l != "hr") {
								b = p;
								s = p.equals(g);
								break
							}
							if (h) {
								h.setEndAt(p, CKEDITOR.POSITION_BEFORE_START);
								if (l != "br") this._.nextNode = p
							}
							z = 1
						} else {
							if (p.getFirst()) {
								if (!h) {
									h = this.range.clone();
									h.setStartAt(p, CKEDITOR.POSITION_BEFORE_START)
								}
								p = p.getFirst();
								continue
							}
							m = 1
						}
					} if (m && !h) {
						h = this.range.clone();
						h.setStartAt(p, CKEDITOR.POSITION_BEFORE_START)
					}
					s = (!z || m) && p.equals(g);
					if (h && !z)
						for (; !p.getNext(n) && !s;) {
							l = p.getParent();
							if (l.isBlockBoundary(this.forceBrBreak && !A && {
								br: 1
							})) {
								z = 1;
								m = 0;
								s || l.equals(g);
								h.setEndAt(l, CKEDITOR.POSITION_BEFORE_END);
								break
							}
							p = l;
							m = 1;
							s = p.equals(g);
							j = 1
						}
					m && h.setEndAt(p, CKEDITOR.POSITION_AFTER_END);
					p = e(p, j, g);
					if ((s = !p) || z && h) break
				}
				if (!b) {
					if (!h) {
						this._.docEndMarker && this._.docEndMarker.remove();
						return this._.nextNode = null
					}
					b = new CKEDITOR.dom.elementPath(h.startContainer, h.root);
					p = b.blockLimit;
					z = {
						div: 1,
						th: 1,
						td: 1
					};
					b = b.block;
					if (!b && p && !this.enforceRealBlocks && z[p.getName()] && h.checkStartOfBlock() && h.checkEndOfBlock() && !p.equals(h.root)) b = p;
					else if (!b || this.enforceRealBlocks && b.getName() == "li") {
						b = this.range.document.createElement(a);
						h.extractContents().appendTo(b);
						b.trim();
						h.insertNode(b);
						q = u = true
					} else if (b.getName() != "li") {
						if (!h.checkStartOfBlock() || !h.checkEndOfBlock()) {
							b = b.clone(false);
							h.extractContents().appendTo(b);
							b.trim();
							u = h.splitBlock();
							q = !u.wasStartOfBlock;
							u = !u.wasEndOfBlock;
							h.insertNode(b)
						}
					} else if (!s) this._.nextNode = b.equals(g) ? null : e(h.getBoundaryNodes().endNode, 1, g)
				}
				if (q)(q = b.getPrevious()) && q.type == CKEDITOR.NODE_ELEMENT && (q.getName() == "br" ? q.remove() : q.getLast() && q.getLast().$.nodeName.toLowerCase() == "br" && q.getLast().remove());
				if (u)(q = b.getLast()) && q.type == CKEDITOR.NODE_ELEMENT && q.getName() == "br" && (!CKEDITOR.env.needsBrFiller || q.getPrevious(f) || q.getNext(f)) && q.remove();
				if (!this._.nextNode) this._.nextNode = s || b.equals(g) || !g ? null : e(b, 1, g);
				return b
			}
		};
		CKEDITOR.dom.range.prototype.createIterator = function() {
			return new a(this)
		}
	})();
	CKEDITOR.command = function(a, e) {
		this.uiItems = [];
		this.exec = function(b) {
			if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) return false;
			this.editorFocus && a.focus();
			return this.fire("exec") === false ? true : e.exec.call(this, a, b) !== false
		};
		this.refresh = function(a, b) {
			if (!this.readOnly && a.readOnly) return true;
			if (this.context && !b.isContextFor(this.context)) {
				this.disable();
				return true
			}
			if (!this.checkAllowed(true)) {
				this.disable();
				return true
			}
			this.startDisabled || this.enable();
			this.modes && !this.modes[a.mode] &&
				this.disable();
			return this.fire("refresh", {
				editor: a,
				path: b
			}) === false ? true : e.refresh && e.refresh.apply(this, arguments) !== false
		};
		var b;
		this.checkAllowed = function(c) {
			return !c && typeof b == "boolean" ? b : b = a.activeFilter.checkFeature(this)
		};
		CKEDITOR.tools.extend(this, e, {
			modes: {
				wysiwyg: 1
			},
			editorFocus: 1,
			contextSensitive: !!e.context,
			state: CKEDITOR.TRISTATE_DISABLED
		});
		CKEDITOR.event.call(this)
	};
	CKEDITOR.command.prototype = {
		enable: function() {
			this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState)
		},
		disable: function() {
			this.setState(CKEDITOR.TRISTATE_DISABLED)
		},
		setState: function(a) {
			if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) return false;
			this.previousState = this.state;
			this.state = a;
			this.fire("state");
			return true
		},
		toggleState: function() {
			this.state == CKEDITOR.TRISTATE_OFF ?
				this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
		}
	};
	CKEDITOR.event.implementOn(CKEDITOR.command.prototype);
	CKEDITOR.ENTER_P = 1;
	CKEDITOR.ENTER_BR = 2;
	CKEDITOR.ENTER_DIV = 3;
	CKEDITOR.config = {
		customConfig: "config.js",
		autoUpdateElement: !0,
		language: "",
		defaultLanguage: "en",
		contentsLangDirection: "",
		enterMode: CKEDITOR.ENTER_P,
		forceEnterMode: !1,
		shiftEnterMode: CKEDITOR.ENTER_BR,
		docType: "<!DOCTYPE html>",
		bodyId: "",
		bodyClass: "",
		fullPage: !1,
		height: 200,
		extraPlugins: "",
		removePlugins: "",
		protectedSource: [],
		tabIndex: 0,
		width: "",
		baseFloatZIndex: 1E4,
		blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
	};
	(function() {
		function a(a, b, c, d, g) {
			var f, e, a = [];
			for (f in b) {
				e = b[f];
				e = typeof e == "boolean" ? {} : typeof e == "function" ? {
					match: e
				} : J(e);
				if (f.charAt(0) != "$") e.elements = f;
				if (c) e.featureName = c.toLowerCase();
				var j = e;
				j.elements = h(j.elements, /\s+/) || null;
				j.propertiesOnly = j.propertiesOnly || j.elements === true;
				var m = /\s*,\s*/,
					p = void 0;
				for (p in y) {
					j[p] = h(j[p], m) || null;
					var l = j,
						r = B[p],
						w = h(j[B[p]], m),
						t = j[p],
						v = [],
						i = true,
						k = void 0;
					w ? i = false : w = {};
					for (k in t)
						if (k.charAt(0) == "!") {
							k = k.slice(1);
							v.push(k);
							w[k] = true;
							i = false
						}
					for (; k =
						v.pop();) {
						t[k] = t["!" + k];
						delete t["!" + k]
					}
					l[r] = (i ? false : w) || null
				}
				j.match = j.match || null;
				d.push(e);
				a.push(e)
			}
			for (var b = g.elements, g = g.generic, z, c = 0, d = a.length; c < d; ++c) {
				f = J(a[c]);
				e = f.classes === true || f.styles === true || f.attributes === true;
				j = f;
				p = r = m = void 0;
				for (m in y) j[m] = A(j[m]);
				l = true;
				for (p in B) {
					m = B[p];
					r = j[m];
					w = [];
					t = void 0;
					for (t in r) t.indexOf("*") > -1 ? w.push(RegExp("^" + t.replace(/\*/g, ".*") + "$")) : w.push(t);
					r = w;
					if (r.length) {
						j[m] = r;
						l = false
					}
				}
				j.nothingRequired = l;
				j.noProperties = !(j.attributes || j.classes || j.styles);
				if (f.elements === true || f.elements === null) g[e ? "unshift" : "push"](f);
				else {
					j = f.elements;
					delete f.elements;
					for (z in j)
						if (b[z]) b[z][e ? "unshift" : "push"](f);
						else b[z] = [f]
				}
			}
		}

		function e(a, c, d, g) {
			if (!a.match || a.match(c))
				if (g || n(a, c)) {
					if (!a.propertiesOnly) d.valid = true;
					if (!d.allAttributes) d.allAttributes = b(a.attributes, c.attributes, d.validAttributes);
					if (!d.allStyles) d.allStyles = b(a.styles, c.styles, d.validStyles);
					if (!d.allClasses) {
						a = a.classes;
						c = c.classes;
						g = d.validClasses;
						if (a)
							if (a === true) a = true;
							else {
								for (var f = 0,
									e = c.length, j; f < e; ++f) {
									j = c[f];
									g[j] || (g[j] = a(j))
								}
								a = false
							} else a = false;
						d.allClasses = a
					}
				}
		}

		function b(a, b, c) {
			if (!a) return false;
			if (a === true) return true;
			for (var d in b) c[d] || (c[d] = a(d));
			return false
		}

		function c(a, b, c) {
			if (!a.match || a.match(b)) {
				if (a.noProperties) return false;
				c.hadInvalidAttribute = d(a.attributes, b.attributes) || c.hadInvalidAttribute;
				c.hadInvalidStyle = d(a.styles, b.styles) || c.hadInvalidStyle;
				a = a.classes;
				b = b.classes;
				if (a) {
					for (var g = false, f = a === true, e = b.length; e--;)
						if (f || a(b[e])) {
							b.splice(e, 1);
							g =
								true
						}
					a = g
				} else a = false;
				c.hadInvalidClass = a || c.hadInvalidClass
			}
		}

		function d(a, b) {
			if (!a) return false;
			var c = false,
				d = a === true,
				g;
			for (g in b)
				if (d || a(g)) {
					delete b[g];
					c = true
				}
			return c
		}

		function f(a, b, c) {
			if (a.disabled || a.customConfig && !c || !b) return false;
			a._.cachedChecks = {};
			return true
		}

		function h(a, b) {
			if (!a) return false;
			if (a === true) return a;
			if (typeof a == "string") {
				a = F(a);
				return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b))
			}
			if (CKEDITOR.tools.isArray(a)) return a.length ? CKEDITOR.tools.convertArrayToObject(a) :
				false;
			var c = {},
				d = 0,
				g;
			for (g in a) {
				c[g] = a[g];
				d++
			}
			return d ? c : false
		}

		function n(a, b) {
			if (a.nothingRequired) return true;
			var c, d, g, f;
			if (g = a.requiredClasses) {
				f = b.classes;
				for (c = 0; c < g.length; ++c) {
					d = g[c];
					if (typeof d == "string") {
						if (CKEDITOR.tools.indexOf(f, d) == -1) return false
					} else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(f, d)) return false
				}
			}
			return i(b.styles, a.requiredStyles) && i(b.attributes, a.requiredAttributes)
		}

		function i(a, b) {
			if (!b) return true;
			for (var c = 0, d; c < b.length; ++c) {
				d = b[c];
				if (typeof d == "string") {
					if (!(d in
						a)) return false
				} else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, d)) return false
			}
			return true
		}

		function k(a) {
			if (!a) return {};
			for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;) b[a.shift()] = t;
			return b
		}

		function o(a) {
			for (var b, c, d, g, f = {}, e = 1, a = F(a); b = a.match(w);) {
				if (c = b[2]) {
					d = s(c, "styles");
					g = s(c, "attrs");
					c = s(c, "classes")
				} else d = g = c = null;
				f["$" + e++] = {
					elements: b[1],
					classes: c,
					styles: d,
					attributes: g
				};
				a = a.slice(b[0].length)
			}
			return f
		}

		function s(a, b) {
			var c = a.match(N[b]);
			return c ? F(c[1]) : null
		}

		function q(a) {
			var b =
				a.styleBackup = a.attributes.style,
				c = a.classBackup = a.attributes["class"];
			if (!a.styles) a.styles = CKEDITOR.tools.parseCssText(b || "", 1);
			if (!a.classes) a.classes = c ? c.split(/\s+/) : []
		}

		function u(a, b, d, g) {
			var f = 0,
				j;
			if (g.toHtml) b.name = b.name.replace(M, "$1");
			if (g.doCallbacks && a.elementCallbacks) {
				a: for (var m = a.elementCallbacks, l = 0, h = m.length, r; l < h; ++l)
					if (r = m[l](b)) {
						j = r;
						break a
					}
				if (j) return j
			}
			if (g.doTransform)
				if (j = a._.transformations[b.name]) {
					q(b);
					for (m = 0; m < j.length; ++m) v(a, b, j[m]);
					p(b)
				}
			if (g.doFilter) {
				a: {
					m = b.name;
					l = a._;
					a = l.allowedRules.elements[m];
					j = l.allowedRules.generic;
					m = l.disallowedRules.elements[m];
					l = l.disallowedRules.generic;
					h = g.skipRequired;
					r = {
						valid: false,
						validAttributes: {},
						validClasses: {},
						validStyles: {},
						allAttributes: false,
						allClasses: false,
						allStyles: false,
						hadInvalidAttribute: false,
						hadInvalidClass: false,
						hadInvalidStyle: false
					};
					var w, t;
					if (!a && !j) a = null;
					else {
						q(b);
						if (m) {
							w = 0;
							for (t = m.length; w < t; ++w)
								if (c(m[w], b, r) === false) {
									a = null;
									break a
								}
						}
						if (l) {
							w = 0;
							for (t = l.length; w < t; ++w) c(l[w], b, r)
						}
						if (a) {
							w = 0;
							for (t = a.length; w <
								t; ++w) e(a[w], b, r, h)
						}
						if (j) {
							w = 0;
							for (t = j.length; w < t; ++w) e(j[w], b, r, h)
						}
						a = r
					}
				}
				if (!a) {
					d.push(b);
					return C
				}
				if (!a.valid) {
					d.push(b);
					return C
				}
				t = a.validAttributes;
				var i = a.validStyles;
				j = a.validClasses;
				var m = b.attributes,
					k = b.styles,
					l = b.classes,
					h = b.classBackup,
					B = b.styleBackup,
					y, x, N = [];
				r = [];
				var n = /^data-cke-/;
				w = false;
				delete m.style;
				delete m["class"];
				delete b.classBackup;
				delete b.styleBackup;
				if (!a.allAttributes)
					for (y in m)
						if (!t[y])
							if (n.test(y)) {
								if (y != (x = y.replace(/^data-cke-saved-/, "")) && !t[x]) {
									delete m[y];
									w = true
								}
							} else {
								delete m[y];
								w = true
							}
				if (!a.allStyles || a.hadInvalidStyle) {
					for (y in k) a.allStyles || i[y] ? N.push(y + ":" + k[y]) : w = true;
					if (N.length) m.style = N.sort().join("; ")
				} else if (B) m.style = B;
				if (!a.allClasses || a.hadInvalidClass) {
					for (y = 0; y < l.length; ++y)(a.allClasses || j[l[y]]) && r.push(l[y]);
					r.length && (m["class"] = r.sort().join(" "));
					h && r.length < h.split(/\s+/).length && (w = true)
				} else h && (m["class"] = h);
				w && (f = C);
				if (!g.skipFinalValidation && !z(b)) {
					d.push(b);
					return C
				}
			}
			if (g.toHtml) b.name = b.name.replace(D, "cke:$1");
			return f
		}

		function g(a) {
			var b =
				[],
				c;
			for (c in a) c.indexOf("*") > -1 && b.push(c.replace(/\*/g, ".*"));
			return b.length ? RegExp("^(?:" + b.join("|") + ")$") : null
		}

		function p(a) {
			var b = a.attributes,
				c;
			delete b.style;
			delete b["class"];
			if (c = CKEDITOR.tools.writeCssText(a.styles, true)) b.style = c;
			a.classes.length && (b["class"] = a.classes.sort().join(" "))
		}

		function z(a) {
			switch (a.name) {
				case "a":
					if (!a.children.length && !a.attributes.name) return false;
					break;
				case "img":
					if (!a.attributes.src) return false
			}
			return true
		}

		function A(a) {
			if (!a) return false;
			if (a === true) return true;
			var b = g(a);
			return function(c) {
				return c in a || b && c.match(b)
			}
		}

		function m() {
			return new CKEDITOR.htmlParser.element("br")
		}

		function j(a) {
			return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || G.$block[a.name])
		}

		function l(a, b, c) {
			var d = a.name;
			if (G.$empty[d] || !a.children.length)
				if (d == "hr" && b == "br") a.replaceWith(m());
				else {
					a.parent && c.push({
						check: "it",
						el: a.parent
					});
					a.remove()
				} else if (G.$block[d] || d == "tr")
				if (b == "br") {
					if (a.previous && !j(a.previous)) {
						b = m();
						b.insertBefore(a)
					}
					if (a.next && !j(a.next)) {
						b = m();
						b.insertAfter(a)
					}
					a.replaceWithChildren()
				} else {
					var d =
						a.children,
						g;
					b: {
						g = G[b];
						for (var f = 0, e = d.length, l; f < e; ++f) {
							l = d[f];
							if (l.type == CKEDITOR.NODE_ELEMENT && !g[l.name]) {
								g = false;
								break b
							}
						}
						g = true
					}
					if (g) {
						a.name = b;
						a.attributes = {};
						c.push({
							check: "parent-down",
							el: a
						})
					} else {
						g = a.parent;
						for (var f = g.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || g.name == "body", p, e = d.length; e > 0;) {
							l = d[--e];
							if (f && (l.type == CKEDITOR.NODE_TEXT || l.type == CKEDITOR.NODE_ELEMENT && G.$inline[l.name])) {
								if (!p) {
									p = new CKEDITOR.htmlParser.element(b);
									p.insertAfter(a);
									c.push({
										check: "parent-down",
										el: p
									})
								}
								p.add(l, 0)
							} else {
								p =
									null;
								l.insertAfter(a);
								g.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && (l.type == CKEDITOR.NODE_ELEMENT && !G[g.name][l.name]) && c.push({
									check: "el-up",
									el: l
								})
							}
						}
						a.remove()
					}
				} else if (d == "style") a.remove();
			else {
				a.parent && c.push({
					check: "it",
					el: a.parent
				});
				a.replaceWithChildren()
			}
		}

		function v(a, b, c) {
			var d, g;
			for (d = 0; d < c.length; ++d) {
				g = c[d];
				if ((!g.check || a.check(g.check, false)) && (!g.left || g.left(b))) {
					g.right(b, ba);
					break
				}
			}
		}

		function P(a, b) {
			var c = b.getDefinition(),
				d = c.attributes,
				g = c.styles,
				f, e, j, m;
			if (a.name != c.element) return false;
			for (f in d)
				if (f == "class") {
					c = d[f].split(/\s+/);
					for (j = a.classes.join("|"); m = c.pop();)
						if (j.indexOf(m) == -1) return false
				} else if (a.attributes[f] != d[f]) return false;
			for (e in g)
				if (a.styles[e] != g[e]) return false;
			return true
		}

		function r(a, b) {
			var c, d;
			if (typeof a == "string") c = a;
			else if (a instanceof CKEDITOR.style) d = a;
			else {
				c = a[0];
				d = a[1]
			}
			return [{
				element: c,
				left: d,
				right: function(a, c) {
					c.transform(a, b)
				}
			}]
		}

		function L(a) {
			return function(b) {
				return P(b, a)
			}
		}

		function H(a) {
			return function(b, c) {
				c[a](b)
			}
		}
		var G = CKEDITOR.dtd,
			C = 1,
			J = CKEDITOR.tools.copy,
			F = CKEDITOR.tools.trim,
			t = "cke-test",
			x = ["", "p", "br", "div"];
		CKEDITOR.FILTER_SKIP_TREE = 2;
		CKEDITOR.filter = function(a) {
			this.allowedContent = [];
			this.disallowedContent = [];
			this.elementCallbacks = null;
			this.disabled = false;
			this.editor = null;
			this.id = CKEDITOR.tools.getNextNumber();
			this._ = {
				allowedRules: {
					elements: {},
					generic: []
				},
				disallowedRules: {
					elements: {},
					generic: []
				},
				transformations: {},
				cachedTests: {}
			};
			CKEDITOR.filter.instances[this.id] = this;
			if (a instanceof CKEDITOR.editor) {
				a = this.editor = a;
				this.customConfig = true;
				var b = a.config.allowedContent;
				if (b === true) this.disabled = true;
				else {
					if (!b) this.customConfig = false;
					this.allow(b, "config", 1);
					this.allow(a.config.extraAllowedContent, "extra", 1);
					this.allow(x[a.enterMode] + " " + x[a.shiftEnterMode], "default", 1);
					this.disallow(a.config.disallowedContent)
				}
			} else {
				this.customConfig = false;
				this.allow(a, "default", 1)
			}
		};
		CKEDITOR.filter.instances = {};
		CKEDITOR.filter.prototype = {
			allow: function(b, c, d) {
				if (!f(this, b, d)) return false;
				var g, e;
				if (typeof b == "string") b = o(b);
				else if (b instanceof CKEDITOR.style) {
					if (b.toAllowedContentRules) return this.allow(b.toAllowedContentRules(this.editor), c, d);
					g = b.getDefinition();
					b = {};
					d = g.attributes;
					b[g.element] = g = {
						styles: g.styles,
						requiredStyles: g.styles && CKEDITOR.tools.objectKeys(g.styles)
					};
					if (d) {
						d = J(d);
						g.classes = d["class"] ? d["class"].split(/\s+/) : null;
						g.requiredClasses = g.classes;
						delete d["class"];
						g.attributes = d;
						g.requiredAttributes = d && CKEDITOR.tools.objectKeys(d)
					}
				} else if (CKEDITOR.tools.isArray(b)) {
					for (g = 0; g < b.length; ++g) e = this.allow(b[g],
						c, d);
					return e
				}
				a(this, b, c, this.allowedContent, this._.allowedRules);
				return true
			},
			applyTo: function(a, b, c, d) {
				if (this.disabled) return false;
				var g = this,
					f = [],
					e = this.editor && this.editor.config.protectedSource,
					j, m = false,
					p = {
						doFilter: !c,
						doTransform: true,
						doCallbacks: true,
						toHtml: b
					};
				a.forEach(function(a) {
					if (a.type == CKEDITOR.NODE_ELEMENT) {
						if (a.attributes["data-cke-filter"] == "off") return false;
						if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) {
							j = u(g, a, f, p);
							if (j & C) m =
								true;
							else if (j & 2) return false
						}
					} else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
						var c;
						a: {
							var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
							c = [];
							var l, h, w;
							if (e)
								for (h = 0; h < e.length; ++h)
									if ((w = d.match(e[h])) && w[0].length == d.length) {
										c = true;
										break a
									}
							d = CKEDITOR.htmlParser.fragment.fromHtml(d);
							d.children.length == 1 && (l = d.children[0]).type == CKEDITOR.NODE_ELEMENT && u(g, l, c, p);
							c = !c.length
						}
						c || f.push(a)
					}
				}, null, true);
				f.length && (m = true);
				for (var h, a = [], d = x[d || (this.editor ?
					this.editor.enterMode : CKEDITOR.ENTER_P)]; c = f.pop();) c.type == CKEDITOR.NODE_ELEMENT ? l(c, d, a) : c.remove();
				for (; h = a.pop();) {
					c = h.el;
					if (c.parent) switch (h.check) {
						case "it":
							G.$removeEmpty[c.name] && !c.children.length ? l(c, d, a) : z(c) || l(c, d, a);
							break;
						case "el-up":
							c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !G[c.parent.name][c.name] && l(c, d, a);
							break;
						case "parent-down":
							c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !G[c.parent.name][c.name] && l(c.parent, d, a)
					}
				}
				return m
			},
			checkFeature: function(a) {
				if (this.disabled ||
					!a) return true;
				a.toFeature && (a = a.toFeature(this.editor));
				return !a.requiredContent || this.check(a.requiredContent)
			},
			disable: function() {
				this.disabled = true
			},
			disallow: function(b) {
				if (!f(this, b, true)) return false;
				typeof b == "string" && (b = o(b));
				a(this, b, null, this.disallowedContent, this._.disallowedRules);
				return true
			},
			addContentForms: function(a) {
				if (!this.disabled && a) {
					var b, c, d = [],
						g;
					for (b = 0; b < a.length && !g; ++b) {
						c = a[b];
						if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c)) g = c
					}
					if (g) {
						for (b = 0; b < a.length; ++b) d.push(r(a[b],
							g));
						this.addTransformations(d)
					}
				}
			},
			addElementCallback: function(a) {
				if (!this.elementCallbacks) this.elementCallbacks = [];
				this.elementCallbacks.push(a)
			},
			addFeature: function(a) {
				if (this.disabled || !a) return true;
				a.toFeature && (a = a.toFeature(this.editor));
				this.allow(a.allowedContent, a.name);
				this.addTransformations(a.contentTransformations);
				this.addContentForms(a.contentForms);
				return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : true
			},
			addTransformations: function(a) {
				var b,
					c;
				if (!this.disabled && a) {
					var d = this._.transformations,
						g;
					for (g = 0; g < a.length; ++g) {
						b = a[g];
						var f = void 0,
							e = void 0,
							j = void 0,
							m = void 0,
							l = void 0,
							p = void 0;
						c = [];
						for (e = 0; e < b.length; ++e) {
							j = b[e];
							if (typeof j == "string") {
								j = j.split(/\s*:\s*/);
								m = j[0];
								l = null;
								p = j[1]
							} else {
								m = j.check;
								l = j.left;
								p = j.right
							} if (!f) {
								f = j;
								f = f.element ? f.element : m ? m.match(/^([a-z0-9]+)/i)[0] : f.left.getDefinition().element
							}
							l instanceof CKEDITOR.style && (l = L(l));
							c.push({
								check: m == f ? null : m,
								left: l,
								right: typeof p == "string" ? H(p) : p
							})
						}
						b = f;
						d[b] || (d[b] = []);
						d[b].push(c)
					}
				}
			},
			check: function(a, b, c) {
				if (this.disabled) return true;
				if (CKEDITOR.tools.isArray(a)) {
					for (var d = a.length; d--;)
						if (this.check(a[d], b, c)) return true;
					return false
				}
				var g, f;
				if (typeof a == "string") {
					f = a + "<" + (b === false ? "0" : "1") + (c ? "1" : "0") + ">";
					if (f in this._.cachedChecks) return this._.cachedChecks[f];
					d = o(a).$1;
					g = d.styles;
					var e = d.classes;
					d.name = d.elements;
					d.classes = e = e ? e.split(/\s*,\s*/) : [];
					d.styles = k(g);
					d.attributes = k(d.attributes);
					d.children = [];
					e.length && (d.attributes["class"] = e.join(" "));
					if (g) d.attributes.style =
						CKEDITOR.tools.writeCssText(d.styles);
					g = d
				} else {
					d = a.getDefinition();
					g = d.styles;
					e = d.attributes || {};
					if (g) {
						g = J(g);
						e.style = CKEDITOR.tools.writeCssText(g, true)
					} else g = {};
					g = {
						name: d.element,
						attributes: e,
						classes: e["class"] ? e["class"].split(/\s+/) : [],
						styles: g,
						children: []
					}
				}
				var e = CKEDITOR.tools.clone(g),
					j = [],
					m;
				if (b !== false && (m = this._.transformations[g.name])) {
					for (d = 0; d < m.length; ++d) v(this, g, m[d]);
					p(g)
				}
				u(this, e, j, {
					doFilter: true,
					doTransform: b !== false,
					skipRequired: !c,
					skipFinalValidation: !c
				});
				b = j.length > 0 ? false :
					CKEDITOR.tools.objectCompare(g.attributes, e.attributes, true) ? true : false;
				typeof a == "string" && (this._.cachedChecks[f] = b);
				return b
			},
			getAllowedEnterMode: function() {
				var a = ["p", "div", "br"],
					b = {
						p: CKEDITOR.ENTER_P,
						div: CKEDITOR.ENTER_DIV,
						br: CKEDITOR.ENTER_BR
					};
				return function(c, d) {
					var g = a.slice(),
						f;
					if (this.check(x[c])) return c;
					for (d || (g = g.reverse()); f = g.pop();)
						if (this.check(f)) return b[f];
					return CKEDITOR.ENTER_BR
				}
			}()
		};
		var y = {
				styles: 1,
				attributes: 1,
				classes: 1
			},
			B = {
				styles: "requiredStyles",
				attributes: "requiredAttributes",
				classes: "requiredClasses"
			},
			w = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
			N = {
				styles: /{([^}]+)}/,
				attrs: /\[([^\]]+)\]/,
				classes: /\(([^\)]+)\)/
			},
			M = /^cke:(object|embed|param)$/,
			D = /^(object|embed|param)$/,
			ba = CKEDITOR.filter.transformationsTools = {
				sizeToStyle: function(a) {
					this.lengthToStyle(a, "width");
					this.lengthToStyle(a, "height")
				},
				sizeToAttribute: function(a) {
					this.lengthToAttribute(a, "width");
					this.lengthToAttribute(a, "height")
				},
				lengthToStyle: function(a,
					b, c) {
					c = c || b;
					if (!(c in a.styles)) {
						var d = a.attributes[b];
						if (d) {
							/^\d+$/.test(d) && (d = d + "px");
							a.styles[c] = d
						}
					}
					delete a.attributes[b]
				},
				lengthToAttribute: function(a, b, c) {
					c = c || b;
					if (!(c in a.attributes)) {
						var d = a.styles[b],
							g = d && d.match(/^(\d+)(?:\.\d*)?px$/);
						g ? a.attributes[c] = g[1] : d == t && (a.attributes[c] = t)
					}
					delete a.styles[b]
				},
				alignmentToStyle: function(a) {
					if (!("float" in a.styles)) {
						var b = a.attributes.align;
						if (b == "left" || b == "right") a.styles["float"] = b
					}
					delete a.attributes.align
				},
				alignmentToAttribute: function(a) {
					if (!("align" in
						a.attributes)) {
						var b = a.styles["float"];
						if (b == "left" || b == "right") a.attributes.align = b
					}
					delete a.styles["float"]
				},
				matchesStyle: P,
				transform: function(a, b) {
					if (typeof b == "string") a.name = b;
					else {
						var c = b.getDefinition(),
							d = c.styles,
							g = c.attributes,
							f, e, j, m;
						a.name = c.element;
						for (f in g)
							if (f == "class") {
								c = a.classes.join("|");
								for (j = g[f].split(/\s+/); m = j.pop();) c.indexOf(m) == -1 && a.classes.push(m)
							} else a.attributes[f] = g[f];
						for (e in d) a.styles[e] = d[e]
					}
				}
			}
	})();
	(function() {
		CKEDITOR.focusManager = function(a) {
			if (a.focusManager) return a.focusManager;
			this.hasFocus = false;
			this.currentActive = null;
			this._ = {
				editor: a
			};
			return this
		};
		CKEDITOR.focusManager._ = {
			blurDelay: 200
		};
		CKEDITOR.focusManager.prototype = {
			focus: function(a) {
				this._.timer && clearTimeout(this._.timer);
				if (a) this.currentActive = a;
				if (!this.hasFocus && !this._.locked) {
					(a = CKEDITOR.currentInstance) && a.focusManager.blur(1);
					this.hasFocus = true;
					(a = this._.editor.container) && a.addClass("cke_focus");
					this._.editor.fire("focus")
				}
			},
			lock: function() {
				this._.locked = 1
			},
			unlock: function() {
				delete this._.locked
			},
			blur: function(a) {
				function e() {
					if (this.hasFocus) {
						this.hasFocus = false;
						var a = this._.editor.container;
						a && a.removeClass("cke_focus");
						this._.editor.fire("blur")
					}
				}
				if (!this._.locked) {
					this._.timer && clearTimeout(this._.timer);
					var b = CKEDITOR.focusManager._.blurDelay;
					a || !b ? e.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function() {
						delete this._.timer;
						e.call(this)
					}, b, this)
				}
			},
			add: function(a, e) {
				var b = a.getCustomData("focusmanager");
				if (!b ||
					b != this) {
					b && b.remove(a);
					var b = "focus",
						c = "blur";
					if (e)
						if (CKEDITOR.env.ie) {
							b = "focusin";
							c = "focusout"
						} else CKEDITOR.event.useCapture = 1;
					var d = {
						blur: function() {
							a.equals(this.currentActive) && this.blur()
						},
						focus: function() {
							this.focus(a)
						}
					};
					a.on(b, d.focus, this);
					a.on(c, d.blur, this);
					if (e) CKEDITOR.event.useCapture = 0;
					a.setCustomData("focusmanager", this);
					a.setCustomData("focusmanager_handlers", d)
				}
			},
			remove: function(a) {
				a.removeCustomData("focusmanager");
				var e = a.removeCustomData("focusmanager_handlers");
				a.removeListener("blur",
					e.blur);
				a.removeListener("focus", e.focus)
			}
		}
	})();
	CKEDITOR.keystrokeHandler = function(a) {
		if (a.keystrokeHandler) return a.keystrokeHandler;
		this.keystrokes = {};
		this.blockedKeystrokes = {};
		this._ = {
			editor: a
		};
		return this
	};
	(function() {
		var a, e = function(b) {
				var b = b.data,
					d = b.getKeystroke(),
					f = this.keystrokes[d],
					e = this._.editor;
				a = e.fire("key", {
					keyCode: d
				}) === false;
				if (!a) {
					f && (a = e.execCommand(f, {
						from: "keystrokeHandler"
					}) !== false);
					a || (a = !!this.blockedKeystrokes[d])
				}
				a && b.preventDefault(true);
				return !a
			},
			b = function(b) {
				if (a) {
					a = false;
					b.data.preventDefault(true)
				}
			};
		CKEDITOR.keystrokeHandler.prototype = {
			attach: function(a) {
				a.on("keydown", e, this);
				if (CKEDITOR.env.gecko && CKEDITOR.env.mac) a.on("keypress", b, this)
			}
		}
	})();
	(function() {
		CKEDITOR.lang = {
			languages: {
				af: 1,
				ar: 1,
				bg: 1,
				bn: 1,
				bs: 1,
				ca: 1,
				cs: 1,
				cy: 1,
				da: 1,
				de: 1,
				el: 1,
				"en-au": 1,
				"en-ca": 1,
				"en-gb": 1,
				en: 1,
				eo: 1,
				es: 1,
				et: 1,
				eu: 1,
				fa: 1,
				fi: 1,
				fo: 1,
				"fr-ca": 1,
				fr: 1,
				gl: 1,
				gu: 1,
				he: 1,
				hi: 1,
				hr: 1,
				hu: 1,
				id: 1,
				is: 1,
				it: 1,
				ja: 1,
				ka: 1,
				km: 1,
				ko: 1,
				ku: 1,
				lt: 1,
				lv: 1,
				mk: 1,
				mn: 1,
				ms: 1,
				nb: 1,
				nl: 1,
				no: 1,
				pl: 1,
				"pt-br": 1,
				pt: 1,
				ro: 1,
				ru: 1,
				si: 1,
				sk: 1,
				sl: 1,
				sq: 1,
				"sr-latn": 1,
				sr: 1,
				sv: 1,
				th: 1,
				tr: 1,
				tt: 1,
				ug: 1,
				uk: 1,
				vi: 1,
				"zh-cn": 1,
				zh: 1
			},
			rtl: {
				ar: 1,
				fa: 1,
				he: 1,
				ku: 1,
				ug: 1
			},
			load: function(a, e, b) {
				if (!a || !CKEDITOR.lang.languages[a]) a = this.detect(e,
					a);
				this[a] ? b(a, this[a]) : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), function() {
					this[a].dir = this.rtl[a] ? "rtl" : "ltr";
					b(a, this[a])
				}, this)
			},
			detect: function(a, e) {
				var b = this.languages,
					e = e || navigator.userLanguage || navigator.language || a,
					c = e.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
					d = c[1],
					c = c[2];
				b[d + "-" + c] ? d = d + "-" + c : b[d] || (d = null);
				CKEDITOR.lang.detect = d ? function() {
					return d
				} : function(a) {
					return a
				};
				return d || a
			}
		}
	})();
	CKEDITOR.scriptLoader = function() {
		var a = {},
			e = {};
		return {
			load: function(b, c, d, f) {
				var h = typeof b == "string";
				h && (b = [b]);
				d || (d = CKEDITOR);
				var n = b.length,
					i = [],
					k = [],
					o = function(a) {
						c && (h ? c.call(d, a) : c.call(d, i, k))
					};
				if (n === 0) o(true);
				else {
					var s = function(a, b) {
							(b ? i : k).push(a);
							if (--n <= 0) {
								f && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
								o(b)
							}
						},
						q = function(b, c) {
							a[b] = 1;
							var d = e[b];
							delete e[b];
							for (var g = 0; g < d.length; g++) d[g](b, c)
						},
						u = function(b) {
							if (a[b]) s(b, true);
							else {
								var d = e[b] || (e[b] = []);
								d.push(s);
								if (!(d.length >
									1)) {
									var g = new CKEDITOR.dom.element("script");
									g.setAttributes({
										type: "text/javascript",
										src: b
									});
									if (c)
										if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) g.$.onreadystatechange = function() {
											if (g.$.readyState == "loaded" || g.$.readyState == "complete") {
												g.$.onreadystatechange = null;
												q(b, true)
											}
										};
										else {
											g.$.onload = function() {
												setTimeout(function() {
													q(b, true)
												}, 0)
											};
											g.$.onerror = function() {
												q(b, false)
											}
										}
									g.appendTo(CKEDITOR.document.getHead())
								}
							}
						};
					f && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
					for (var g = 0; g < n; g++) u(b[g])
				}
			},
			queue: function() {
				function a() {
					var b;
					(b = c[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0)
				}
				var c = [];
				return function(d, f) {
					var e = this;
					c.push({
						scriptUrl: d,
						callback: function() {
							f && f.apply(this, arguments);
							c.shift();
							a.call(e)
						}
					});
					c.length == 1 && a.call(this)
				}
			}()
		}
	}();
	CKEDITOR.resourceManager = function(a, e) {
		this.basePath = a;
		this.fileName = e;
		this.registered = {};
		this.loaded = {};
		this.externals = {};
		this._ = {
			waitingList: {}
		}
	};
	CKEDITOR.resourceManager.prototype = {
		add: function(a, e) {
			if (this.registered[a]) throw '[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
			var b = this.registered[a] = e || {};
			b.name = a;
			b.path = this.getPath(a);
			CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
			return this.get(a)
		},
		get: function(a) {
			return this.registered[a] || null
		},
		getPath: function(a) {
			var e = this.externals[a];
			return CKEDITOR.getUrl(e && e.dir || this.basePath + a + "/")
		},
		getFilePath: function(a) {
			var e = this.externals[a];
			return CKEDITOR.getUrl(this.getPath(a) + (e ? e.file : this.fileName + ".js"))
		},
		addExternal: function(a, e, b) {
			for (var a = a.split(","), c = 0; c < a.length; c++) {
				var d = a[c];
				b || (e = e.replace(/[^\/]+$/, function(a) {
					b = a;
					return ""
				}));
				this.externals[d] = {
					dir: e,
					file: b || this.fileName + ".js"
				}
			}
		},
		load: function(a, e, b) {
			CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
			for (var c = this.loaded, d = this.registered, f = [], h = {}, n = {}, i = 0; i < a.length; i++) {
				var k = a[i];
				if (k)
					if (!c[k] && !d[k]) {
						var o = this.getFilePath(k);
						f.push(o);
						o in h || (h[o] = []);
						h[o].push(k)
					} else n[k] =
						this.get(k)
			}
			CKEDITOR.scriptLoader.load(f, function(a, d) {
				if (d.length) throw '[CKEDITOR.resourceManager.load] Resource name "' + h[d[0]].join(",") + '" was not found at "' + d[0] + '".';
				for (var f = 0; f < a.length; f++)
					for (var g = h[a[f]], p = 0; p < g.length; p++) {
						var i = g[p];
						n[i] = this.get(i);
						c[i] = 1
					}
				e.call(b, n)
			}, this)
		}
	};
	CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
	CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function(a) {
		var e = {};
		return function(b, c, d) {
			var f = {},
				h = function(b) {
					a.call(this, b, function(a) {
						CKEDITOR.tools.extend(f, a);
						var b = [],
							n;
						for (n in a) {
							var s = a[n],
								q = s && s.requires;
							if (!e[n]) {
								if (s.icons)
									for (var u = s.icons.split(","), g = u.length; g--;) CKEDITOR.skin.addIcon(u[g], s.path + "icons/" + (CKEDITOR.env.hidpi && s.hidpi ? "hidpi/" : "") + u[g] + ".png");
								e[n] = 1
							}
							if (q) {
								q.split && (q = q.split(","));
								for (s = 0; s < q.length; s++) f[q[s]] || b.push(q[s])
							}
						}
						if (b.length) h.call(this,
							b);
						else {
							for (n in f) {
								s = f[n];
								if (s.onLoad && !s.onLoad._called) {
									s.onLoad() === false && delete f[n];
									s.onLoad._called = 1
								}
							}
							c && c.call(d || window, f)
						}
					}, this)
				};
			h.call(this, b)
		}
	});
	CKEDITOR.plugins.setLang = function(a, e, b) {
		var c = this.get(a),
			a = c.langEntries || (c.langEntries = {}),
			c = c.lang || (c.lang = []);
		c.split && (c = c.split(","));
		CKEDITOR.tools.indexOf(c, e) == -1 && c.push(e);
		a[e] = b
	};
	CKEDITOR.ui = function(a) {
		if (a.ui) return a.ui;
		this.items = {};
		this.instances = {};
		this.editor = a;
		this._ = {
			handlers: {}
		};
		return this
	};
	CKEDITOR.ui.prototype = {
		add: function(a, e, b) {
			b.name = a.toLowerCase();
			var c = this.items[a] = {
				type: e,
				command: b.command || null,
				args: Array.prototype.slice.call(arguments, 2)
			};
			CKEDITOR.tools.extend(c, b)
		},
		get: function(a) {
			return this.instances[a]
		},
		create: function(a) {
			var e = this.items[a],
				b = e && this._.handlers[e.type],
				c = e && e.command && this.editor.getCommand(e.command),
				b = b && b.create.apply(this, e.args);
			this.instances[a] = b;
			c && c.uiItems.push(b);
			if (b && !b.type) b.type = e.type;
			return b
		},
		addHandler: function(a, e) {
			this._.handlers[a] =
				e
		},
		space: function(a) {
			return CKEDITOR.document.getById(this.spaceId(a))
		},
		spaceId: function(a) {
			return this.editor.id + "_" + a
		}
	};
	CKEDITOR.event.implementOn(CKEDITOR.ui);
	(function() {
		function a(a, c, f) {
			CKEDITOR.event.call(this);
			a = a && CKEDITOR.tools.clone(a);
			if (c !== void 0) {
				if (c instanceof CKEDITOR.dom.element) {
					if (!f) throw Error("One of the element modes must be specified.");
				} else throw Error("Expect element of type CKEDITOR.dom.element."); if (CKEDITOR.env.ie && CKEDITOR.env.quirks && f == CKEDITOR.ELEMENT_MODE_INLINE) throw Error("Inline element mode is not supported on IE quirks.");
				if (!(f == CKEDITOR.ELEMENT_MODE_INLINE ? c.is(CKEDITOR.dtd.$editable) || c.is("textarea") : f == CKEDITOR.ELEMENT_MODE_REPLACE ?
					!c.is(CKEDITOR.dtd.$nonBodyContent) : 1)) throw Error('The specified element mode is not supported on element: "' + c.getName() + '".');
				this.element = c;
				this.elementMode = f;
				this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (c.getId() || c.getNameAtt())
			} else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
			this._ = {};
			this.commands = {};
			this.templates = {};
			this.name = this.name || e();
			this.id = CKEDITOR.tools.getNextId();
			this.status = "unloaded";
			this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
			this.ui = new CKEDITOR.ui(this);
			this.focusManager = new CKEDITOR.focusManager(this);
			this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
			this.on("readOnly", b);
			this.on("selectionChange", function(a) {
				d(this, a.data.path)
			});
			this.on("activeFilterChange", function() {
				d(this, this.elementPath(), true)
			});
			this.on("mode", b);
			this.on("instanceReady", function() {
				this.config.startupFocus && this.focus()
			});
			CKEDITOR.fire("instanceCreated", null, this);
			CKEDITOR.add(this);
			CKEDITOR.tools.setTimeout(function() {
				h(this, a)
			}, 0, this)
		}

		function e() {
			do var a = "editor" +
				++q; while (CKEDITOR.instances[a]);
			return a
		}

		function b() {
			var a = this.commands,
				b;
			for (b in a) c(this, a[b])
		}

		function c(a, b) {
			b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
		}

		function d(a, b, c) {
			if (b) {
				var d, f, e = a.commands;
				for (f in e) {
					d = e[f];
					(c || d.contextSensitive) && d.refresh(a, b)
				}
			}
		}

		function f(a) {
			var b = a.config.customConfig;
			if (!b) return false;
			var b = CKEDITOR.getUrl(b),
				c = u[b] || (u[b] = {});
			if (c.fn) {
				c.fn.call(a, a.config);
				(CKEDITOR.getUrl(a.config.customConfig) == b ||
					!f(a)) && a.fireOnce("customConfigLoaded")
			} else CKEDITOR.scriptLoader.queue(b, function() {
				c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {};
				f(a)
			});
			return true
		}

		function h(a, b) {
			a.on("customConfigLoaded", function() {
				if (b) {
					if (b.on)
						for (var c in b.on) a.on(c, b.on[c]);
					CKEDITOR.tools.extend(a.config, b, true);
					delete a.config.on
				}
				c = a.config;
				a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode ==
					CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
				a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
				a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
				a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
				a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
				if (c.skin) CKEDITOR.skinName = c.skin;
				a.fireOnce("configLoaded");
				a.dataProcessor =
					new CKEDITOR.htmlDataProcessor(a);
				a.filter = a.activeFilter = new CKEDITOR.filter(a);
				n(a)
			});
			if (b && b.customConfig != void 0) a.config.customConfig = b.customConfig;
			f(a) || a.fireOnce("customConfigLoaded")
		}

		function n(a) {
			CKEDITOR.skin.loadPart("editor", function() {
				i(a)
			})
		}

		function i(a) {
			CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, c) {
				var d = a.config.title;
				a.langCode = b;
				a.lang = CKEDITOR.tools.prototypedCopy(c);
				a.title = typeof d == "string" || d === false ? d : [a.lang.editor, a.name].join(", ");
				if (!a.config.contentsLangDirection) a.config.contentsLangDirection =
					a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
				a.fire("langLoaded");
				k(a)
			})
		}

		function k(a) {
			a.getStylesSet(function(b) {
				a.once("loaded", function() {
					a.fire("stylesSet", {
						styles: b
					})
				}, null, null, 1);
				o(a)
			})
		}

		function o(a) {
			var b = a.config,
				c = b.plugins,
				d = b.extraPlugins,
				f = b.removePlugins;
			if (d) var e = RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
				c = c.replace(e, ""),
				c = c + ("," + d);
			if (f) var l = RegExp("(?:^|,)(?:" + f.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
				c = c.replace(l, "");
			CKEDITOR.env.air &&
				(c = c + ",adobeair");
			CKEDITOR.plugins.load(c.split(","), function(c) {
				var d = [],
					f = [],
					e = [];
				a.plugins = c;
				for (var j in c) {
					var m = c[j],
						h = m.lang,
						i = null,
						k = m.requires,
						t;
					CKEDITOR.tools.isArray(k) && (k = k.join(","));
					if (k && (t = k.match(l)))
						for (; k = t.pop();) CKEDITOR.tools.setTimeout(function(a, b) {
							throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
						}, 0, null, [k, j]);
					if (h && !a.lang[j]) {
						h.split && (h = h.split(","));
						if (CKEDITOR.tools.indexOf(h, a.langCode) >=
							0) i = a.langCode;
						else {
							i = a.langCode.replace(/-.*/, "");
							i = i != a.langCode && CKEDITOR.tools.indexOf(h, i) >= 0 ? i : CKEDITOR.tools.indexOf(h, "en") >= 0 ? "en" : h[0]
						} if (!m.langEntries || !m.langEntries[i]) e.push(CKEDITOR.getUrl(m.path + "lang/" + i + ".js"));
						else {
							a.lang[j] = m.langEntries[i];
							i = null
						}
					}
					f.push(i);
					d.push(m)
				}
				CKEDITOR.scriptLoader.load(e, function() {
					for (var c = ["beforeInit", "init", "afterInit"], e = 0; e < c.length; e++)
						for (var j = 0; j < d.length; j++) {
							var m = d[j];
							e === 0 && (f[j] && m.lang && m.langEntries) && (a.lang[m.name] = m.langEntries[f[j]]);
							if (m[c[e]]) m[c[e]](a)
						}
					a.fireOnce("pluginsLoaded");
					b.keystrokes && a.setKeystroke(a.config.keystrokes);
					for (j = 0; j < a.config.blockedKeystrokes.length; j++) a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[j]] = 1;
					a.status = "loaded";
					a.fireOnce("loaded");
					CKEDITOR.fire("instanceLoaded", null, a)
				})
			})
		}

		function s() {
			var a = this.element;
			if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
				var b = this.getData();
				this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
				a.is("textarea") ? a.setValue(b) :
					a.setHtml(b);
				return true
			}
			return false
		}
		a.prototype = CKEDITOR.editor.prototype;
		CKEDITOR.editor = a;
		var q = 0,
			u = {};
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			addCommand: function(a, b) {
				b.name = a.toLowerCase();
				var d = new CKEDITOR.command(this, b);
				this.mode && c(this, d);
				return this.commands[a] = d
			},
			_attachToForm: function() {
				var a = this,
					b = a.element,
					c = new CKEDITOR.dom.element(b.$.form);
				if (b.is("textarea") && c) {
					var d = function(c) {
						a.updateElement();
						a._.required && (!b.getValue() && a.fire("required") === false) && c.data.preventDefault()
					};
					c.on("submit", d);
					if (c.$.submit && c.$.submit.call && c.$.submit.apply) c.$.submit = CKEDITOR.tools.override(c.$.submit, function(a) {
						return function() {
							d();
							a.apply ? a.apply(this) : a()
						}
					});
					a.on("destroy", function() {
						c.removeListener("submit", d)
					})
				}
			},
			destroy: function(a) {
				this.fire("beforeDestroy");
				!a && s.call(this);
				this.editable(null);
				this.status = "destroyed";
				this.fire("destroy");
				this.removeAllListeners();
				CKEDITOR.remove(this);
				CKEDITOR.fire("instanceDestroyed", null, this)
			},
			elementPath: function(a) {
				if (!a) {
					a = this.getSelection();
					if (!a) return null;
					a = a.getStartElement()
				}
				return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
			},
			createRange: function() {
				var a = this.editable();
				return a ? new CKEDITOR.dom.range(a) : null
			},
			execCommand: function(a, b) {
				var c = this.getCommand(a),
					d = {
						name: a,
						commandData: b,
						command: c
					};
				if (c && c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", d) !== false) {
					d.returnValue = c.exec(d.commandData);
					if (!c.async && this.fire("afterCommandExec", d) !== false) return d.returnValue
				}
				return false
			},
			getCommand: function(a) {
				return this.commands[a]
			},
			getData: function(a) {
				!a && this.fire("beforeGetData");
				var b = this._.data;
				if (typeof b != "string") b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
				b = {
					dataValue: b
				};
				!a && this.fire("getData", b);
				return b.dataValue
			},
			getSnapshot: function() {
				var a = this.fire("getSnapshot");
				if (typeof a != "string") {
					var b = this.element;
					b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
				}
				return a
			},
			loadSnapshot: function(a) {
				this.fire("loadSnapshot",
					a)
			},
			setData: function(a, b, c) {
				!c && this.fire("saveSnapshot");
				if (b || !c) this.once("dataReady", function(a) {
					c || this.fire("saveSnapshot");
					b && b.call(a.editor)
				});
				a = {
					dataValue: a
				};
				!c && this.fire("setData", a);
				this._.data = a.dataValue;
				!c && this.fire("afterSetData", a)
			},
			setReadOnly: function(a) {
				a = a == void 0 || a;
				if (this.readOnly != a) {
					this.readOnly = a;
					this.keystrokeHandler.blockedKeystrokes[8] = +a;
					this.editable().setReadOnly(a);
					this.fire("readOnly")
				}
			},
			insertHtml: function(a, b) {
				this.fire("insertHtml", {
					dataValue: a,
					mode: b
				})
			},
			insertText: function(a) {
				this.fire("insertText",
					a)
			},
			insertElement: function(a) {
				this.fire("insertElement", a)
			},
			focus: function() {
				this.fire("beforeFocus")
			},
			checkDirty: function() {
				return this.status == "ready" && this._.previousValue !== this.getSnapshot()
			},
			resetDirty: function() {
				this._.previousValue = this.getSnapshot()
			},
			updateElement: function() {
				return s.call(this)
			},
			setKeystroke: function() {
				for (var a = this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
					[].slice.call(arguments, 0)
				], c, d, f = b.length; f--;) {
					c = b[f];
					d = 0;
					if (CKEDITOR.tools.isArray(c)) {
						d =
							c[1];
						c = c[0]
					}
					d ? a[c] = d : delete a[c]
				}
			},
			addFeature: function(a) {
				return this.filter.addFeature(a)
			},
			setActiveFilter: function(a) {
				if (!a) a = this.filter;
				if (this.activeFilter !== a) {
					this.activeFilter = a;
					this.fire("activeFilterChange");
					a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, true))
				}
			},
			setActiveEnterMode: function(a, b) {
				a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
				b = b ? this.blockless ? CKEDITOR.ENTER_BR :
					b : this.shiftEnterMode;
				if (this.activeEnterMode != a || this.activeShiftEnterMode != b) {
					this.activeEnterMode = a;
					this.activeShiftEnterMode = b;
					this.fire("activeEnterModeChange")
				}
			}
		})
	})();
	CKEDITOR.ELEMENT_MODE_NONE = 0;
	CKEDITOR.ELEMENT_MODE_REPLACE = 1;
	CKEDITOR.ELEMENT_MODE_APPENDTO = 2;
	CKEDITOR.ELEMENT_MODE_INLINE = 3;
	CKEDITOR.htmlParser = function() {
		this._ = {
			htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")
		}
	};
	(function() {
		var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
			e = {
				checked: 1,
				compact: 1,
				declare: 1,
				defer: 1,
				disabled: 1,
				ismap: 1,
				multiple: 1,
				nohref: 1,
				noresize: 1,
				noshade: 1,
				nowrap: 1,
				readonly: 1,
				selected: 1
			};
		CKEDITOR.htmlParser.prototype = {
			onTagOpen: function() {},
			onTagClose: function() {},
			onText: function() {},
			onCDATA: function() {},
			onComment: function() {},
			parse: function(b) {
				for (var c, d, f = 0, h; c = this._.htmlPartsRegex.exec(b);) {
					d = c.index;
					if (d > f) {
						f = b.substring(f, d);
						if (h) h.push(f);
						else this.onText(f)
					}
					f =
						this._.htmlPartsRegex.lastIndex;
					if (d = c[1]) {
						d = d.toLowerCase();
						if (h && CKEDITOR.dtd.$cdata[d]) {
							this.onCDATA(h.join(""));
							h = null
						}
						if (!h) {
							this.onTagClose(d);
							continue
						}
					}
					if (h) h.push(c[0]);
					else if (d = c[3]) {
						d = d.toLowerCase();
						if (!/="/.test(d)) {
							var n = {},
								i;
							c = c[4];
							var k = !!(c && c.charAt(c.length - 1) == "/");
							if (c)
								for (; i = a.exec(c);) {
									var o = i[1].toLowerCase();
									i = i[2] || i[3] || i[4] || "";
									n[o] = !i && e[o] ? o : CKEDITOR.tools.htmlDecodeAttr(i)
								}
							this.onTagOpen(d, n, k);
							!h && CKEDITOR.dtd.$cdata[d] && (h = [])
						}
					} else if (d = c[2]) this.onComment(d)
				}
				if (b.length >
					f) this.onText(b.substring(f, b.length))
			}
		}
	})();
	CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
		$: function() {
			this._ = {
				output: []
			}
		},
		proto: {
			openTag: function(a) {
				this._.output.push("<", a)
			},
			openTagClose: function(a, e) {
				e ? this._.output.push(" />") : this._.output.push(">")
			},
			attribute: function(a, e) {
				typeof e == "string" && (e = CKEDITOR.tools.htmlEncodeAttr(e));
				this._.output.push(" ", a, '="', e, '"')
			},
			closeTag: function(a) {
				this._.output.push("</", a, ">")
			},
			text: function(a) {
				this._.output.push(a)
			},
			comment: function(a) {
				this._.output.push("<\!--", a, "--\>")
			},
			write: function(a) {
				this._.output.push(a)
			},
			reset: function() {
				this._.output = [];
				this._.indent = false
			},
			getHtml: function(a) {
				var e = this._.output.join("");
				a && this.reset();
				return e
			}
		}
	});
	"use strict";
	(function() {
		CKEDITOR.htmlParser.node = function() {};
		CKEDITOR.htmlParser.node.prototype = {
			remove: function() {
				var a = this.parent.children,
					e = CKEDITOR.tools.indexOf(a, this),
					b = this.previous,
					c = this.next;
				b && (b.next = c);
				c && (c.previous = b);
				a.splice(e, 1);
				this.parent = null
			},
			replaceWith: function(a) {
				var e = this.parent.children,
					b = CKEDITOR.tools.indexOf(e, this),
					c = a.previous = this.previous,
					d = a.next = this.next;
				c && (c.next = a);
				d && (d.previous = a);
				e[b] = a;
				a.parent = this.parent;
				this.parent = null
			},
			insertAfter: function(a) {
				var e = a.parent.children,
					b = CKEDITOR.tools.indexOf(e, a),
					c = a.next;
				e.splice(b + 1, 0, this);
				this.next = a.next;
				this.previous = a;
				a.next = this;
				c && (c.previous = this);
				this.parent = a.parent
			},
			insertBefore: function(a) {
				var e = a.parent.children,
					b = CKEDITOR.tools.indexOf(e, a);
				e.splice(b, 0, this);
				this.next = a;
				(this.previous = a.previous) && (a.previous.next = this);
				a.previous = this;
				this.parent = a.parent
			},
			getAscendant: function(a) {
				var e = typeof a == "function" ? a : typeof a == "string" ? function(b) {
						return b.name == a
					} : function(b) {
						return b.name in a
					},
					b = this.parent;
				for (; b &&
					b.type == CKEDITOR.NODE_ELEMENT;) {
					if (e(b)) return b;
					b = b.parent
				}
				return null
			},
			wrapWith: function(a) {
				this.replaceWith(a);
				a.add(this);
				return a
			},
			getIndex: function() {
				return CKEDITOR.tools.indexOf(this.parent.children, this)
			},
			getFilterContext: function(a) {
				return a || {}
			}
		}
	})();
	"use strict";
	CKEDITOR.htmlParser.comment = function(a) {
		this.value = a;
		this._ = {
			isBlockLike: false
		}
	};
	CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
		type: CKEDITOR.NODE_COMMENT,
		filter: function(a, e) {
			var b = this.value;
			if (!(b = a.onComment(e, b, this))) {
				this.remove();
				return false
			}
			if (typeof b != "string") {
				this.replaceWith(b);
				return false
			}
			this.value = b;
			return true
		},
		writeHtml: function(a, e) {
			e && this.filter(e);
			a.comment(this.value)
		}
	});
	"use strict";
	(function() {
		CKEDITOR.htmlParser.text = function(a) {
			this.value = a;
			this._ = {
				isBlockLike: false
			}
		};
		CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_TEXT,
			filter: function(a, e) {
				if (!(this.value = a.onText(e, this.value, this))) {
					this.remove();
					return false
				}
			},
			writeHtml: function(a, e) {
				e && this.filter(e);
				a.text(this.value)
			}
		})
	})();
	"use strict";
	(function() {
		CKEDITOR.htmlParser.cdata = function(a) {
			this.value = a
		};
		CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_TEXT,
			filter: function() {},
			writeHtml: function(a) {
				a.write(this.value)
			}
		})
	})();
	"use strict";
	CKEDITOR.htmlParser.fragment = function() {
		this.children = [];
		this.parent = null;
		this._ = {
			isBlockLike: true,
			hasInlineStarted: false
		}
	};
	(function() {
		function a(a) {
			return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
		}
		var e = CKEDITOR.tools.extend({
				table: 1,
				ul: 1,
				ol: 1,
				dl: 1
			}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl),
			b = {
				ol: 1,
				ul: 1
			},
			c = CKEDITOR.tools.extend({}, {
				html: 1
			}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
				style: 1,
				script: 1
			}),
			d = {
				ul: "li",
				ol: "li",
				dl: "dd",
				table: "tbody",
				tbody: "tr",
				thead: "tr",
				tfoot: "tr",
				tr: "td"
			};
		CKEDITOR.htmlParser.fragment.fromHtml =
			function(f, h, n) {
				function i(a) {
					var b;
					if (z.length > 0)
						for (var c = 0; c < z.length; c++) {
							var d = z[c],
								f = d.name,
								e = CKEDITOR.dtd[f],
								g = m.name && CKEDITOR.dtd[m.name];
							if ((!g || g[f]) && (!a || !e || e[a] || !CKEDITOR.dtd[a])) {
								if (!b) {
									k();
									b = 1
								}
								d = d.clone();
								d.parent = m;
								m = d;
								z.splice(c, 1);
								c--
							} else if (f == m.name) {
								s(m, m.parent, 1);
								c--
							}
						}
				}

				function k() {
					for (; A.length;) s(A.shift(), m)
				}

				function o(a) {
					if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
						var b = a.children.length,
							c = a.children[b - 1],
							d;
						if (c && c.type == CKEDITOR.NODE_TEXT)(d = CKEDITOR.tools.rtrim(c.value)) ?
							c.value = d : a.children.length = b - 1
					}
				}

				function s(b, c, d) {
					var c = c || m || p,
						f = m;
					if (b.previous === void 0) {
						if (q(c, b)) {
							m = c;
							g.onTagOpen(n, {});
							b.returnPoint = c = m
						}
						o(b);
						(!a(b) || b.children.length) && c.add(b);
						b.name == "pre" && (l = false);
						b.name == "textarea" && (j = false)
					}
					if (b.returnPoint) {
						m = b.returnPoint;
						delete b.returnPoint
					} else m = d ? c : f
				}

				function q(a, b) {
					if ((a == p || a.name == "body") && n && (!a.name || CKEDITOR.dtd[a.name][n])) {
						var c, d;
						return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline &&
							!(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
					}
				}

				function u(a, b) {
					return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
				}
				var g = new CKEDITOR.htmlParser,
					p = h instanceof CKEDITOR.htmlParser.element ? h : typeof h == "string" ? new CKEDITOR.htmlParser.element(h) : new CKEDITOR.htmlParser.fragment,
					z = [],
					A = [],
					m = p,
					j = p.name == "textarea",
					l = p.name == "pre";
				g.onTagOpen = function(d, f, h, p) {
					f = new CKEDITOR.htmlParser.element(d, f);
					if (f.isUnknown && h) f.isEmpty =
						true;
					f.isOptionalClose = p;
					if (a(f)) z.push(f);
					else {
						if (d == "pre") l = true;
						else {
							if (d == "br" && l) {
								m.add(new CKEDITOR.htmlParser.text("\n"));
								return
							}
							d == "textarea" && (j = true)
						} if (d == "br") A.push(f);
						else {
							for (;;) {
								p = (h = m.name) ? CKEDITOR.dtd[h] || (m._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c;
								if (!f.isUnknown && !m.isUnknown && !p[d])
									if (m.isOptionalClose) g.onTagClose(h);
									else if (d in b && h in b) {
									h = m.children;
									(h = h[h.length - 1]) && h.name == "li" || s(h = new CKEDITOR.htmlParser.element("li"), m);
									!f.returnPoint && (f.returnPoint = m);
									m = h
								} else if (d in CKEDITOR.dtd.$listItem && !u(d, h)) g.onTagOpen(d == "li" ? "ul" : "dl", {}, 0, 1);
								else if (h in e && !u(d, h)) {
									!f.returnPoint && (f.returnPoint = m);
									m = m.parent
								} else {
									h in CKEDITOR.dtd.$inline && z.unshift(m);
									if (m.parent) s(m, m.parent, 1);
									else {
										f.isOrphan = 1;
										break
									}
								} else break
							}
							i(d);
							k();
							f.parent = m;
							f.isEmpty ? s(f) : m = f
						}
					}
				};
				g.onTagClose = function(a) {
					for (var b = z.length - 1; b >= 0; b--)
						if (a == z[b].name) {
							z.splice(b, 1);
							return
						}
					for (var c = [], d = [], f = m; f != p && f.name != a;) {
						f._.isBlockLike || d.unshift(f);
						c.push(f);
						f = f.returnPoint || f.parent
					}
					if (f !=
						p) {
						for (b = 0; b < c.length; b++) {
							var e = c[b];
							s(e, e.parent)
						}
						m = f;
						f._.isBlockLike && k();
						s(f, f.parent);
						if (f == m) m = m.parent;
						z = z.concat(d)
					}
					a == "body" && (n = false)
				};
				g.onText = function(a) {
					if ((!m._.hasInlineStarted || A.length) && !l && !j) {
						a = CKEDITOR.tools.ltrim(a);
						if (a.length === 0) return
					}
					var b = m.name,
						f = b ? CKEDITOR.dtd[b] || (m._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c;
					if (!j && !f["#"] && b in e) {
						g.onTagOpen(d[b] || "");
						g.onText(a)
					} else {
						k();
						i();
						!l && !j && (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
						a = new CKEDITOR.htmlParser.text(a);
						if (q(m, a)) this.onTagOpen(n, {}, 0, 1);
						m.add(a)
					}
				};
				g.onCDATA = function(a) {
					m.add(new CKEDITOR.htmlParser.cdata(a))
				};
				g.onComment = function(a) {
					k();
					i();
					m.add(new CKEDITOR.htmlParser.comment(a))
				};
				g.parse(f);
				for (k(); m != p;) s(m, m.parent, 1);
				o(p);
				return p
		};
		CKEDITOR.htmlParser.fragment.prototype = {
			type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
			add: function(a, b) {
				isNaN(b) && (b = this.children.length);
				var c = b > 0 ? this.children[b - 1] : null;
				if (c) {
					if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT) {
						c.value = CKEDITOR.tools.rtrim(c.value);
						if (c.value.length ===
							0) {
							this.children.pop();
							this.add(a);
							return
						}
					}
					c.next = a
				}
				a.previous = c;
				a.parent = this;
				this.children.splice(b, 0, a);
				if (!this._.hasInlineStarted) this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
			},
			filter: function(a, b) {
				b = this.getFilterContext(b);
				a.onRoot(b, this);
				this.filterChildren(a, false, b)
			},
			filterChildren: function(a, b, c) {
				if (this.childrenFilteredBy != a.id) {
					c = this.getFilterContext(c);
					if (b && !this.parent) a.onRoot(c, this);
					this.childrenFilteredBy = a.id;
					for (b = 0; b < this.children.length; b++) this.children[b].filter(a,
						c) === false && b--
				}
			},
			writeHtml: function(a, b) {
				b && this.filter(b);
				this.writeChildrenHtml(a)
			},
			writeChildrenHtml: function(a, b, c) {
				var d = this.getFilterContext();
				if (c && !this.parent && b) b.onRoot(d, this);
				b && this.filterChildren(b, false, d);
				b = 0;
				c = this.children;
				for (d = c.length; b < d; b++) c[b].writeHtml(a)
			},
			forEach: function(a, b, c) {
				if (!c && (!b || this.type == b)) var d = a(this);
				if (d !== false)
					for (var c = this.children, e = 0; e < c.length; e++) {
						d = c[e];
						d.type == CKEDITOR.NODE_ELEMENT ? d.forEach(a, b) : (!b || d.type == b) && a(d)
					}
			},
			getFilterContext: function(a) {
				return a || {}
			}
		}
	})();
	"use strict";
	(function() {
		function a() {
			this.rules = []
		}

		function e(b, c, d, f) {
			var e, n;
			for (e in c) {
				(n = b[e]) || (n = b[e] = new a);
				n.add(c[e], d, f)
			}
		}
		CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
			$: function(b) {
				this.id = CKEDITOR.tools.getNextNumber();
				this.elementNameRules = new a;
				this.attributeNameRules = new a;
				this.elementsRules = {};
				this.attributesRules = {};
				this.textRules = new a;
				this.commentRules = new a;
				this.rootRules = new a;
				b && this.addRules(b, 10)
			},
			proto: {
				addRules: function(a, c) {
					var d;
					if (typeof c == "number") d = c;
					else if (c && "priority" in
						c) d = c.priority;
					typeof d != "number" && (d = 10);
					typeof c != "object" && (c = {});
					a.elementNames && this.elementNameRules.addMany(a.elementNames, d, c);
					a.attributeNames && this.attributeNameRules.addMany(a.attributeNames, d, c);
					a.elements && e(this.elementsRules, a.elements, d, c);
					a.attributes && e(this.attributesRules, a.attributes, d, c);
					a.text && this.textRules.add(a.text, d, c);
					a.comment && this.commentRules.add(a.comment, d, c);
					a.root && this.rootRules.add(a.root, d, c)
				},
				applyTo: function(a) {
					a.filter(this)
				},
				onElementName: function(a, c) {
					return this.elementNameRules.execOnName(a,
						c)
				},
				onAttributeName: function(a, c) {
					return this.attributeNameRules.execOnName(a, c)
				},
				onText: function(a, c, d) {
					return this.textRules.exec(a, c, d)
				},
				onComment: function(a, c, d) {
					return this.commentRules.exec(a, c, d)
				},
				onRoot: function(a, c) {
					return this.rootRules.exec(a, c)
				},
				onElement: function(a, c) {
					for (var d = [this.elementsRules["^"], this.elementsRules[c.name], this.elementsRules.$], f, e = 0; e < 3; e++)
						if (f = d[e]) {
							f = f.exec(a, c, this);
							if (f === false) return null;
							if (f && f != c) return this.onNode(a, f);
							if (c.parent && !c.name) break
						}
					return c
				},
				onNode: function(a, c) {
					var d = c.type;
					return d == CKEDITOR.NODE_ELEMENT ? this.onElement(a, c) : d == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, c.value)) : d == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, c.value)) : null
				},
				onAttribute: function(a, c, d, f) {
					return (d = this.attributesRules[d]) ? d.exec(a, f, c, this) : f
				}
			}
		});
		CKEDITOR.htmlParser.filterRulesGroup = a;
		a.prototype = {
			add: function(a, c, d) {
				this.rules.splice(this.findIndex(c), 0, {
					value: a,
					priority: c,
					options: d
				})
			},
			addMany: function(a,
				c, d) {
				for (var f = [this.findIndex(c), 0], e = 0, n = a.length; e < n; e++) f.push({
					value: a[e],
					priority: c,
					options: d
				});
				this.rules.splice.apply(this.rules, f)
			},
			findIndex: function(a) {
				for (var c = this.rules, d = c.length - 1; d >= 0 && a < c[d].priority;) d--;
				return d + 1
			},
			exec: function(a, c) {
				var d = c instanceof CKEDITOR.htmlParser.node || c instanceof CKEDITOR.htmlParser.fragment,
					f = Array.prototype.slice.call(arguments, 1),
					e = this.rules,
					n = e.length,
					i, k, o, s;
				for (s = 0; s < n; s++) {
					if (d) {
						i = c.type;
						k = c.name
					}
					o = e[s];
					if (!(a.nonEditable && !o.options.applyToAll ||
						a.nestedEditable && o.options.excludeNestedEditable)) {
						o = o.value.apply(null, f);
						if (o === false || d && o && (o.name != k || o.type != i)) return o;
						o != void 0 && (f[0] = c = o)
					}
				}
				return c
			},
			execOnName: function(a, c) {
				for (var d = 0, f = this.rules, e = f.length, n; c && d < e; d++) {
					n = f[d];
					!(a.nonEditable && !n.options.applyToAll || a.nestedEditable && n.options.excludeNestedEditable) && (c = c.replace(n.value[0], n.value[1]))
				}
				return c
			}
		}
	})();
	(function() {
		function a(a, e) {
			function g(a) {
				return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {
					"data-cke-bogus": 1
				})
			}

			function j(a, d) {
				return function(e) {
					if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
						var j = [],
							m = b(e),
							l, w;
						if (m)
							for (t(m, 1) && j.push(m); m;) {
								if (f(m) && (l = c(m)) && t(l))
									if ((w = c(l)) && !f(w)) j.push(l);
									else {
										g(p).insertAfter(l);
										l.remove()
									}
								m = m.previous
							}
						for (m = 0; m < j.length; m++) j[m].remove();
						if (j = typeof d == "function" ? d(e) !== false : d)
							if (!p && !CKEDITOR.env.needsBrFiller &&
								e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) j = false;
							else if (!p && !CKEDITOR.env.needsBrFiller && (document.documentMode > 7 || e.name in CKEDITOR.dtd.tr || e.name in CKEDITOR.dtd.$listItem)) j = false;
						else {
							j = b(e);
							j = !j || e.name == "form" && j.name == "input"
						}
						j && e.add(g(a))
					}
				}
			}

			function t(a, b) {
				if ((!p || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"]) return true;
				var c;
				if (a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(z))) {
					if (c.index) {
						(new CKEDITOR.htmlParser.text(a.value.substring(0,
							c.index))).insertBefore(a);
						a.value = c[0]
					}
					if (!CKEDITOR.env.needsBrFiller && p && (!b || a.parent.name in i)) return true;
					if (!p)
						if ((c = a.previous) && c.name == "br" || !c || f(c)) return true
				}
				return false
			}
			var r = {
					elements: {}
				},
				p = e == "html",
				i = CKEDITOR.tools.extend({}, l),
				k;
			for (k in i) "#" in m[k] || delete i[k];
			for (k in i) r.elements[k] = j(p, a.config.fillEmptyBlocks !== false);
			r.root = j(p);
			r.elements.br = function(a) {
				return function(b) {
					if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
						var e = b.attributes;
						if ("data-cke-bogus" in e || "data-cke-eol" in
							e) delete e["data-cke-bogus"];
						else {
							for (e = b.next; e && d(e);) e = e.next;
							var j = c(b);
							!e && f(b.parent) ? h(b.parent, g(a)) : f(e) && (j && !f(j)) && g(a).insertBefore(e)
						}
					}
				}
			}(p);
			return r
		}

		function e(a, b) {
			return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false
		}

		function b(a) {
			for (a = a.children[a.children.length - 1]; a && d(a);) a = a.previous;
			return a
		}

		function c(a) {
			for (a = a.previous; a && d(a);) a = a.previous;
			return a
		}

		function d(a) {
			return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT &&
				a.attributes["data-cke-bookmark"]
		}

		function f(a) {
			return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in l || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
		}

		function h(a, b) {
			var c = a.children[a.children.length - 1];
			a.children.push(b);
			b.parent = a;
			if (c) {
				c.next = b;
				b.previous = c
			}
		}

		function n(a) {
			a = a.attributes;
			a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
			a.contenteditable = "false"
		}

		function i(a) {
			a = a.attributes;
			switch (a["data-cke-editable"]) {
				case "true":
					a.contenteditable = "true";
					break;
				case "1":
					delete a.contenteditable
			}
		}

		function k(a) {
			return a.replace(H, function(a, b, c) {
				return "<" + b + c.replace(G, function(a, b) {
					return C.test(b) && c.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
				}) + ">"
			})
		}

		function o(a, b) {
			return a.replace(b, function(a, b, c) {
				a.indexOf("<textarea") === 0 && (a = b + u(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
				return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
			})
		}

		function s(a) {
			return a.replace(t, function(a, b) {
				return decodeURIComponent(b)
			})
		}

		function q(a) {
			return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g,
				function(a) {
					return "<\!--" + A + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
				})
		}

		function u(a) {
			return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function(a, b) {
				return decodeURIComponent(b)
			})
		}

		function g(a, b) {
			var c = b._.dataStore;
			return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(a, b) {
				return decodeURIComponent(b)
			}).replace(/\{cke_protected_(\d+)\}/g, function(a, b) {
				return c && c[b] || ""
			})
		}

		function p(a, b) {
			for (var c = [], d = b.config.protectedSource, f = b._.dataStore || (b._.dataStore = {
				id: 1
			}), e = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g, d = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(d), a = a.replace(/<\!--[\s\S]*?--\>/g, function(a) {
				return "<\!--{cke_tempcomment}" + (c.push(a) - 1) + "--\>"
			}), g = 0; g < d.length; g++) a = a.replace(d[g], function(a) {
				a = a.replace(e, function(a, b, d) {
					return c[d]
				});
				return /cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (c.push(a) - 1) + "--\>"
			});
			a = a.replace(e, function(a, b, d) {
				return "<\!--" + A + (b ? "{C}" : "") + encodeURIComponent(c[d]).replace(/--/g, "%2D%2D") +
					"--\>"
			});
			return a.replace(/<\w([^'">]+|'[^']*'|"[^"]*")+>/g, function(a) {
				return a.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function(a, b) {
					f[f.id] = decodeURIComponent(b);
					return "{cke_protected_" + f.id+++"}"
				})
			})
		}
		CKEDITOR.htmlDataProcessor = function(b) {
			var c, d, f = this;
			this.editor = b;
			this.dataFilter = c = new CKEDITOR.htmlParser.filter;
			this.htmlFilter = d = new CKEDITOR.htmlParser.filter;
			this.writer = new CKEDITOR.htmlParser.basicWriter;
			c.addRules(v);
			c.addRules(P, {
				applyToAll: true
			});
			c.addRules(a(b, "data"), {
				applyToAll: true
			});
			d.addRules(r);
			d.addRules(L, {
				applyToAll: true
			});
			d.addRules(a(b, "html"), {
				applyToAll: true
			});
			b.on("toHtml", function(a) {
				var a = a.data,
					c = a.dataValue,
					c = p(c, b),
					c = o(c, F),
					c = k(c),
					c = o(c, J),
					c = c.replace(x, "$1cke:$2"),
					c = c.replace(B, "<cke:$1$2></cke:$1>"),
					c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
					c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2"),
					d = a.context || b.editable().getName(),
					f;
				if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && d == "pre") {
					d = "div";
					c = "<pre>" + c + "</pre>";
					f = 1
				}
				d = b.document.createElement(d);
				d.setHtml("a" + c);
				c = d.getHtml().substr(1);
				c = c.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
				f && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
				c = c.replace(y, "$1$2");
				c = s(c);
				c = u(c);
				a.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, a.fixForBody === false ? false : e(a.enterMode, b.config.autoParagraph))
			}, null, null, 5);
			b.on("toHtml", function(a) {
				a.data.filter.applyTo(a.data.dataValue, true, a.data.dontFilter, a.data.enterMode) && b.fire("dataFiltered")
			}, null, null, 6);
			b.on("toHtml", function(a) {
				a.data.dataValue.filterChildren(f.dataFilter,
					true)
			}, null, null, 10);
			b.on("toHtml", function(a) {
				var a = a.data,
					b = a.dataValue,
					c = new CKEDITOR.htmlParser.basicWriter;
				b.writeChildrenHtml(c);
				b = c.getHtml(true);
				a.dataValue = q(b)
			}, null, null, 15);
			b.on("toDataFormat", function(a) {
				var c = a.data.dataValue;
				a.data.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/^<br *\/?>/i, ""));
				a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.data.context, e(a.data.enterMode, b.config.autoParagraph))
			}, null, null, 5);
			b.on("toDataFormat", function(a) {
				a.data.dataValue.filterChildren(f.htmlFilter,
					true)
			}, null, null, 10);
			b.on("toDataFormat", function(a) {
				a.data.filter.applyTo(a.data.dataValue, false, true)
			}, null, null, 11);
			b.on("toDataFormat", function(a) {
				var c = a.data.dataValue,
					d = f.writer;
				d.reset();
				c.writeChildrenHtml(d);
				c = d.getHtml(true);
				c = u(c);
				c = g(c, b);
				a.data.dataValue = c
			}, null, null, 15)
		};
		CKEDITOR.htmlDataProcessor.prototype = {
			toHtml: function(a, b, c, d) {
				var f = this.editor,
					e, g, j;
				if (b && typeof b == "object") {
					e = b.context;
					c = b.fixForBody;
					d = b.dontFilter;
					g = b.filter;
					j = b.enterMode
				} else e = b;
				!e && e !== null && (e = f.editable().getName());
				return f.fire("toHtml", {
					dataValue: a,
					context: e,
					fixForBody: c,
					dontFilter: d,
					filter: g || f.filter,
					enterMode: j || f.enterMode
				}).dataValue
			},
			toDataFormat: function(a, b) {
				var c, d, f;
				if (b) {
					c = b.context;
					d = b.filter;
					f = b.enterMode
				}!c && c !== null && (c = this.editor.editable().getName());
				return this.editor.fire("toDataFormat", {
					dataValue: a,
					filter: d || this.editor.filter,
					context: c,
					enterMode: f || this.editor.enterMode
				}).dataValue
			}
		};
		var z = /(?:&nbsp;|\xa0)$/,
			A = "{cke_protected}",
			m = CKEDITOR.dtd,
			j = ["caption", "colgroup", "col", "thead", "tfoot",
				"tbody"
			],
			l = CKEDITOR.tools.extend({}, m.$blockLimit, m.$block),
			v = {
				elements: {
					input: n,
					textarea: n
				}
			},
			P = {
				attributeNames: [
					[/^on/, "data-cke-pa-on"],
					[/^data-cke-expando$/, ""]
				]
			},
			r = {
				elements: {
					embed: function(a) {
						var b = a.parent;
						if (b && b.name == "object") {
							var c = b.attributes.width,
								b = b.attributes.height;
							if (c) a.attributes.width = c;
							if (b) a.attributes.height = b
						}
					},
					a: function(a) {
						if (!a.children.length && !a.attributes.name && !a.attributes["data-cke-saved-name"]) return false
					}
				}
			},
			L = {
				elementNames: [
					[/^cke:/, ""],
					[/^\?xml:namespace$/, ""]
				],
				attributeNames: [
					[/^data-cke-(saved|pa)-/, ""],
					[/^data-cke-.*/, ""],
					["hidefocus", ""]
				],
				elements: {
					$: function(a) {
						var b = a.attributes;
						if (b) {
							if (b["data-cke-temp"]) return false;
							for (var c = ["name", "href", "src"], d, f = 0; f < c.length; f++) {
								d = "data-cke-saved-" + c[f];
								d in b && delete b[c[f]]
							}
						}
						return a
					},
					table: function(a) {
						a.children.slice(0).sort(function(a, b) {
							var c, d;
							if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
								c = CKEDITOR.tools.indexOf(j, a.name);
								d = CKEDITOR.tools.indexOf(j, b.name)
							}
							if (!(c > -1 && d > -1 && c != d)) {
								c = a.parent ? a.getIndex() :
									-1;
								d = b.parent ? b.getIndex() : -1
							}
							return c > d ? 1 : -1
						})
					},
					param: function(a) {
						a.children = [];
						a.isEmpty = true;
						return a
					},
					span: function(a) {
						a.attributes["class"] == "Apple-style-span" && delete a.name
					},
					html: function(a) {
						delete a.attributes.contenteditable;
						delete a.attributes["class"]
					},
					body: function(a) {
						delete a.attributes.spellcheck;
						delete a.attributes.contenteditable
					},
					style: function(a) {
						var b = a.children[0];
						if (b && b.value) b.value = CKEDITOR.tools.trim(b.value);
						if (!a.attributes.type) a.attributes.type = "text/css"
					},
					title: function(a) {
						var b =
							a.children[0];
						!b && h(a, b = new CKEDITOR.htmlParser.text);
						b.value = a.attributes["data-cke-title"] || ""
					},
					input: i,
					textarea: i
				},
				attributes: {
					"class": function(a) {
						return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
					}
				}
			};
		if (CKEDITOR.env.ie) L.attributes.style = function(a) {
			return a.replace(/(^|;)([^\:]+)/g, function(a) {
				return a.toLowerCase()
			})
		};
		var H = /<(a|area|img|input|source)\b([^>]*)>/gi,
			G = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
			C = /^(href|src|name)$/i,
			J = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
			F = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,
			t = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
			x = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
			y = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,
			B = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
	})();
	"use strict";
	CKEDITOR.htmlParser.element = function(a, e) {
		this.name = a;
		this.attributes = e || {};
		this.children = [];
		var b = a || "",
			c = b.match(/^cke:(.*)/);
		c && (b = c[1]);
		b = !(!CKEDITOR.dtd.$nonBodyContent[b] && !CKEDITOR.dtd.$block[b] && !CKEDITOR.dtd.$listItem[b] && !CKEDITOR.dtd.$tableContent[b] && !(CKEDITOR.dtd.$nonEditable[b] || b == "br"));
		this.isEmpty = !!CKEDITOR.dtd.$empty[a];
		this.isUnknown = !CKEDITOR.dtd[a];
		this._ = {
			isBlockLike: b,
			hasInlineStarted: this.isEmpty || !b
		}
	};
	CKEDITOR.htmlParser.cssStyle = function(a) {
		var e = {};
		((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, d) {
			c == "font-family" && (d = d.replace(/["']/g, ""));
			e[c.toLowerCase()] = d
		});
		return {
			rules: e,
			populate: function(a) {
				var c = this.toString();
				if (c) a instanceof CKEDITOR.dom.element ? a.setAttribute("style", c) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = c : a.style = c
			},
			toString: function() {
				var a = [],
					c;
				for (c in e) e[c] && a.push(c, ":", e[c], ";");
				return a.join("")
			}
		}
	};
	(function() {
		function a(a) {
			return function(b) {
				return b.type == CKEDITOR.NODE_ELEMENT && (typeof a == "string" ? b.name == a : b.name in a)
			}
		}
		var e = function(a, b) {
				a = a[0];
				b = b[0];
				return a < b ? -1 : a > b ? 1 : 0
			},
			b = CKEDITOR.htmlParser.fragment.prototype;
		CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_ELEMENT,
			add: b.add,
			clone: function() {
				return new CKEDITOR.htmlParser.element(this.name, this.attributes)
			},
			filter: function(a, b) {
				var f = this,
					e, n, b = f.getFilterContext(b);
				if (b.off) return true;
				if (!f.parent) a.onRoot(b, f);
				for (;;) {
					e = f.name;
					if (!(n = a.onElementName(b, e))) {
						this.remove();
						return false
					}
					f.name = n;
					if (!(f = a.onElement(b, f))) {
						this.remove();
						return false
					}
					if (f !== this) {
						this.replaceWith(f);
						return false
					}
					if (f.name == e) break;
					if (f.type != CKEDITOR.NODE_ELEMENT) {
						this.replaceWith(f);
						return false
					}
					if (!f.name) {
						this.replaceWithChildren();
						return false
					}
				}
				e = f.attributes;
				var i, k;
				for (i in e) {
					k = i;
					for (n = e[i];;)
						if (k = a.onAttributeName(b, i))
							if (k != i) {
								delete e[i];
								i = k
							} else break;
					else {
						delete e[i];
						break
					}
					k && ((n = a.onAttribute(b,
						f, k, n)) === false ? delete e[k] : e[k] = n)
				}
				f.isEmpty || this.filterChildren(a, false, b);
				return true
			},
			filterChildren: b.filterChildren,
			writeHtml: function(a, b) {
				b && this.filter(b);
				var f = this.name,
					h = [],
					n = this.attributes,
					i, k;
				a.openTag(f, n);
				for (i in n) h.push([i, n[i]]);
				a.sortAttributes && h.sort(e);
				i = 0;
				for (k = h.length; i < k; i++) {
					n = h[i];
					a.attribute(n[0], n[1])
				}
				a.openTagClose(f, this.isEmpty);
				this.writeChildrenHtml(a);
				this.isEmpty || a.closeTag(f)
			},
			writeChildrenHtml: b.writeChildrenHtml,
			replaceWithChildren: function() {
				for (var a =
					this.children, b = a.length; b;) a[--b].insertAfter(this);
				this.remove()
			},
			forEach: b.forEach,
			getFirst: function(b) {
				if (!b) return this.children.length ? this.children[0] : null;
				typeof b != "function" && (b = a(b));
				for (var d = 0, f = this.children.length; d < f; ++d)
					if (b(this.children[d])) return this.children[d];
				return null
			},
			getHtml: function() {
				var a = new CKEDITOR.htmlParser.basicWriter;
				this.writeChildrenHtml(a);
				return a.getHtml()
			},
			setHtml: function(a) {
				for (var a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children, b = 0,
					f = a.length; b < f; ++b) a[b].parent = this
			},
			getOuterHtml: function() {
				var a = new CKEDITOR.htmlParser.basicWriter;
				this.writeHtml(a);
				return a.getHtml()
			},
			split: function(a) {
				for (var b = this.children.splice(a, this.children.length - a), f = this.clone(), e = 0; e < b.length; ++e) b[e].parent = f;
				f.children = b;
				if (b[0]) b[0].previous = null;
				if (a > 0) this.children[a - 1].next = null;
				this.parent.add(f, this.getIndex() + 1);
				return f
			},
			addClass: function(a) {
				if (!this.hasClass(a)) {
					var b = this.attributes["class"] || "";
					this.attributes["class"] = b + (b ? " " : "") +
						a
				}
			},
			removeClass: function(a) {
				var b = this.attributes["class"];
				if (b)(b = CKEDITOR.tools.trim(b.replace(RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"]
			},
			hasClass: function(a) {
				var b = this.attributes["class"];
				return !b ? false : RegExp("(?:^|\\s)" + a + "(?=\\s|$)").test(b)
			},
			getFilterContext: function(a) {
				var b = [];
				a || (a = {
					off: false,
					nonEditable: false,
					nestedEditable: false
				});
				!a.off && this.attributes["data-cke-processor"] == "off" && b.push("off", true);
				!a.nonEditable && this.attributes.contenteditable ==
					"false" ? b.push("nonEditable", true) : this.name != "body" && (!a.nestedEditable && this.attributes.contenteditable == "true") && b.push("nestedEditable", true);
				if (b.length)
					for (var a = CKEDITOR.tools.copy(a), f = 0; f < b.length; f = f + 2) a[b[f]] = b[f + 1];
				return a
			}
		}, true)
	})();
	(function() {
		var a = {},
			e = /{([^}]+)}/g,
			b = /([\\'])/g,
			c = /\n/g,
			d = /\r/g;
		CKEDITOR.template = function(f) {
			if (a[f]) this.output = a[f];
			else {
				var h = f.replace(b, "\\$1").replace(c, "\\n").replace(d, "\\r").replace(e, function(a, b) {
					return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
				});
				this.output = a[f] = Function("data", "buffer", "return buffer?buffer.push('" + h + "'):['" + h + "'].join('');")
			}
		}
	})();
	delete CKEDITOR.loadFullCore;
	CKEDITOR.instances = {};
	CKEDITOR.document = new CKEDITOR.dom.document(document);
	CKEDITOR.add = function(a) {
		CKEDITOR.instances[a.name] = a;
		a.on("focus", function() {
			if (CKEDITOR.currentInstance != a) {
				CKEDITOR.currentInstance = a;
				CKEDITOR.fire("currentInstance")
			}
		});
		a.on("blur", function() {
			if (CKEDITOR.currentInstance == a) {
				CKEDITOR.currentInstance = null;
				CKEDITOR.fire("currentInstance")
			}
		});
		CKEDITOR.fire("instance", null, a)
	};
	CKEDITOR.remove = function(a) {
		delete CKEDITOR.instances[a.name]
	};
	(function() {
		var a = {};
		CKEDITOR.addTemplate = function(e, b) {
			var c = a[e];
			if (c) return c;
			c = {
				name: e,
				source: b
			};
			CKEDITOR.fire("template", c);
			return a[e] = new CKEDITOR.template(c.source)
		};
		CKEDITOR.getTemplate = function(e) {
			return a[e]
		}
	})();
	(function() {
		var a = [];
		CKEDITOR.addCss = function(e) {
			a.push(e)
		};
		CKEDITOR.getCss = function() {
			return a.join("\n")
		}
	})();
	CKEDITOR.on("instanceDestroyed", function() {
		CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
	});
	CKEDITOR.TRISTATE_ON = 1;
	CKEDITOR.TRISTATE_OFF = 2;
	CKEDITOR.TRISTATE_DISABLED = 0;
	(function() {
		CKEDITOR.inline = function(a, e) {
			if (!CKEDITOR.env.isCompatible) return null;
			a = CKEDITOR.dom.element.get(a);
			if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
			var b = new CKEDITOR.editor(e, a, CKEDITOR.ELEMENT_MODE_INLINE),
				c = a.is("textarea") ? a : null;
			if (c) {
				b.setData(c.getValue(), null, true);
				a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!b.readOnly + '" class="cke_textarea_inline">' + c.getValue() + "</div>", CKEDITOR.document);
				a.insertAfter(c);
				c.hide();
				c.$.form && b._attachToForm()
			} else b.setData(a.getHtml(), null, true);
			b.on("loaded", function() {
				b.fire("uiReady");
				b.editable(a);
				b.container = a;
				b.setData(b.getData(1));
				b.resetDirty();
				b.fire("contentDom");
				b.mode = "wysiwyg";
				b.fire("mode");
				b.status = "ready";
				b.fireOnce("instanceReady");
				CKEDITOR.fire("instanceReady", null, b)
			}, null, null, 1E4);
			b.on("destroy", function() {
				if (c) {
					b.container.clearCustomData();
					b.container.remove();
					c.show()
				}
				b.element.clearCustomData();
				delete b.element
			});
			return b
		};
		CKEDITOR.inlineAll = function() {
			var a, e, b;
			for (b in CKEDITOR.dtd.$editable)
				for (var c = CKEDITOR.document.getElementsByTag(b), d = 0, f = c.count(); d < f; d++) {
					a = c.getItem(d);
					if (a.getAttribute("contenteditable") == "true") {
						e = {
							element: a,
							config: {}
						};
						CKEDITOR.fire("inline", e) !== false && CKEDITOR.inline(a, e.config)
					}
				}
		};
		CKEDITOR.domReady(function() {
			!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
		})
	})();
	CKEDITOR.replaceClass = "ckeditor";
	(function() {
		function a(a, c, h, n) {
			if (!CKEDITOR.env.isCompatible) return null;
			a = CKEDITOR.dom.element.get(a);
			if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
			var i = new CKEDITOR.editor(c, a, n);
			if (n == CKEDITOR.ELEMENT_MODE_REPLACE) {
				a.setStyle("visibility", "hidden");
				i._.required = a.hasAttribute("required");
				a.removeAttribute("required")
			}
			h && i.setData(h, null, true);
			i.on("loaded", function() {
				b(i);
				n == CKEDITOR.ELEMENT_MODE_REPLACE && (i.config.autoUpdateElement &&
					a.$.form) && i._attachToForm();
				i.setMode(i.config.startupMode, function() {
					i.resetDirty();
					i.status = "ready";
					i.fireOnce("instanceReady");
					CKEDITOR.fire("instanceReady", null, i)
				})
			});
			i.on("destroy", e);
			return i
		}

		function e() {
			var a = this.container,
				b = this.element;
			if (a) {
				a.clearCustomData();
				a.remove()
			}
			if (b) {
				b.clearCustomData();
				if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
					b.show();
					this._.required && b.setAttribute("required", "required")
				}
				delete this.element
			}
		}

		function b(a) {
			var b = a.name,
				e = a.element,
				n = a.elementMode,
				i = a.fire("uiSpace", {
					space: "top",
					html: ""
				}).html,
				k = a.fire("uiSpace", {
					space: "bottom",
					html: ""
				}).html;
			c || (c = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
			b = CKEDITOR.dom.element.createFromHtml(c.output({
				id: a.id,
				name: b,
				langDir: a.lang.dir,
				langCode: a.langCode,
				voiceLabel: [a.lang.editor, a.name].join(", "),
				topHtml: i ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + i + "</span>" : "",
				contentId: a.ui.spaceId("contents"),
				bottomHtml: k ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + k + "</span>" : "",
				outerEl: CKEDITOR.env.ie ? "span" : "div"
			}));
			if (n == CKEDITOR.ELEMENT_MODE_REPLACE) {
				e.hide();
				b.insertAfter(e)
			} else e.append(b);
			a.container = b;
			i && a.ui.space("top").unselectable();
			k && a.ui.space("bottom").unselectable();
			e = a.config.width;
			n = a.config.height;
			e && b.setStyle("width", CKEDITOR.tools.cssLength(e));
			n && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(n));
			b.disableContextMenu();
			CKEDITOR.env.webkit && b.on("focus", function() {
				a.focus()
			});
			a.fireOnce("uiReady")
		}
		CKEDITOR.replace = function(b, c) {
			return a(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE)
		};
		CKEDITOR.appendTo = function(b, c, e) {
			return a(b,
				c, e, CKEDITOR.ELEMENT_MODE_APPENDTO)
		};
		CKEDITOR.replaceAll = function() {
			for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
				var c = null,
					e = a[b];
				if (e.name || e.id) {
					if (typeof arguments[0] == "string") {
						if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(e.className)) continue
					} else if (typeof arguments[0] == "function") {
						c = {};
						if (arguments[0](e, c) === false) continue
					}
					this.replace(e, c)
				}
			}
		};
		CKEDITOR.editor.prototype.addMode = function(a, b) {
			(this._.modes || (this._.modes = {}))[a] = b
		};
		CKEDITOR.editor.prototype.setMode =
			function(a, b) {
				var c = this,
					e = this._.modes;
				if (!(a == c.mode || !e || !e[a])) {
					c.fire("beforeSetMode", a);
					if (c.mode) {
						var i = c.checkDirty(),
							e = c._.previousModeData,
							k, o = 0;
						c.fire("beforeModeUnload");
						c.editable(0);
						c._.previousMode = c.mode;
						c._.previousModeData = k = c.getData(1);
						if (c.mode == "source" && e == k) {
							c.fire("lockSnapshot", {
								forceUpdate: true
							});
							o = 1
						}
						c.ui.space("contents").setHtml("");
						c.mode = ""
					} else c._.previousModeData = c.getData(1);
					this._.modes[a](function() {
						c.mode = a;
						i !== void 0 && !i && c.resetDirty();
						o ? c.fire("unlockSnapshot") :
							a == "wysiwyg" && c.fire("saveSnapshot");
						setTimeout(function() {
							c.fire("mode");
							b && b.call(c)
						}, 0)
					})
				}
		};
		CKEDITOR.editor.prototype.resize = function(a, b, c, e) {
			var i = this.container,
				k = this.ui.space("contents"),
				o = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement,
				e = e ? i.getChild(1) : i;
			e.setSize("width", a, true);
			o && (o.style.width = "1%");
			k.setStyle("height", Math.max(b - (c ? 0 : (e.$.offsetHeight || 0) - (k.$.clientHeight || 0)), 0) + "px");
			o && (o.style.width = "100%");
			this.fire("resize")
		};
		CKEDITOR.editor.prototype.getResizable =
			function(a) {
				return a ? this.ui.space("contents") : this.container
		};
		var c;
		CKEDITOR.domReady(function() {
			CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
		})
	})();
	CKEDITOR.config.startupMode = "wysiwyg";
	(function() {
		function a(a) {
			var b = a.editor,
				d = a.data.path,
				f = d.blockLimit,
				m = a.data.selection,
				j = m.getRanges()[0],
				l;
			if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)
				if (m = e(m, d)) {
					m.appendBogus();
					l = CKEDITOR.env.ie
				}
			if (b.config.autoParagraph !== false && b.activeEnterMode != CKEDITOR.ENTER_BR && b.editable().equals(f) && !d.block && j.collapsed && !j.getCommonAncestor().isReadOnly()) {
				d = j.clone();
				d.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
				f = new CKEDITOR.dom.walker(d);
				f.guard = function(a) {
					return !c(a) || a.type ==
						CKEDITOR.NODE_COMMENT || a.isReadOnly()
				};
				if (!f.checkForward() || d.checkStartOfBlock() && d.checkEndOfBlock()) {
					b = j.fixBlock(true, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
					if (!CKEDITOR.env.needsBrFiller)(b = b.getFirst(c)) && (b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/)) && b.remove();
					l = 1;
					a.cancel()
				}
			}
			l && j.select()
		}

		function e(a, b) {
			if (a.isFake) return 0;
			var d = b.block || b.blockLimit,
				e = d && d.getLast(c);
			if (d && d.isBlockBoundary() && (!e || !(e.type == CKEDITOR.NODE_ELEMENT &&
				e.isBlockBoundary())) && !d.is("pre") && !d.getBogus()) return d
		}

		function b(a) {
			var b = a.data.getTarget();
			if (b.is("input")) {
				b = b.getAttribute("type");
				(b == "submit" || b == "reset") && a.data.preventDefault()
			}
		}

		function c(a) {
			return o(a) && s(a)
		}

		function d(a, b) {
			return function(c) {
				var d = CKEDITOR.dom.element.get(c.data.$.toElement || c.data.$.fromElement || c.data.$.relatedTarget);
				(!d || !b.equals(d) && !b.contains(d)) && a.call(this, c)
			}
		}

		function f(a) {
			var b, d = a.getRanges()[0],
				e = a.root,
				f = {
					table: 1,
					ul: 1,
					ol: 1,
					dl: 1
				};
			if (d.startPath().contains(f)) {
				var a =
					function(a) {
						return function(d, e) {
							e && (d.type == CKEDITOR.NODE_ELEMENT && d.is(f)) && (b = d);
							if (!e && c(d) && (!a || !i(d))) return false
						}
					},
					j = d.clone();
				j.collapse(1);
				j.setStartAt(e, CKEDITOR.POSITION_AFTER_START);
				e = new CKEDITOR.dom.walker(j);
				e.guard = a();
				e.checkBackward();
				if (b) {
					j = d.clone();
					j.collapse();
					j.setEndAt(b, CKEDITOR.POSITION_AFTER_END);
					e = new CKEDITOR.dom.walker(j);
					e.guard = a(true);
					b = false;
					e.checkForward();
					return b
				}
			}
			return null
		}

		function h(a) {
			a.editor.focus();
			a.editor.fire("saveSnapshot")
		}

		function n(a) {
			var b =
				a.editor;
			b.getSelection().scrollIntoView();
			setTimeout(function() {
				b.fire("saveSnapshot")
			}, 0)
		}
		CKEDITOR.editable = CKEDITOR.tools.createClass({
			base: CKEDITOR.dom.element,
			$: function(a, b) {
				this.base(b.$ || b);
				this.editor = a;
				this.status = "unloaded";
				this.hasFocus = false;
				this.setup()
			},
			proto: {
				focus: function() {
					var a;
					if (CKEDITOR.env.webkit && !this.hasFocus) {
						a = this.editor._.previousActive || this.getDocument().getActive();
						if (this.contains(a)) {
							a.focus();
							return
						}
					}
					try {
						this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ?
							"setActive" : "focus"]()
					} catch (b) {
						if (!CKEDITOR.env.ie) throw b;
					}
					if (CKEDITOR.env.safari && !this.isInline()) {
						a = CKEDITOR.document.getActive();
						a.equals(this.getWindow().getFrame()) || this.getWindow().focus()
					}
				},
				on: function(a, b) {
					var c = Array.prototype.slice.call(arguments, 0);
					if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
						a = a == "focus" ? "focusin" : "focusout";
						b = d(b, this);
						c[0] = a;
						c[1] = b
					}
					return CKEDITOR.dom.element.prototype.on.apply(this, c)
				},
				attachListener: function(a, b, c, d, e, f) {
					!this._.listeners && (this._.listeners = []);
					var l = Array.prototype.slice.call(arguments, 1),
						l = a.on.apply(a, l);
					this._.listeners.push(l);
					return l
				},
				clearListeners: function() {
					var a = this._.listeners;
					try {
						for (; a.length;) a.pop().removeListener()
					} catch (b) {}
				},
				restoreAttrs: function() {
					var a = this._.attrChanges,
						b, c;
					for (c in a)
						if (a.hasOwnProperty(c)) {
							b = a[c];
							b !== null ? this.setAttribute(c, b) : this.removeAttribute(c)
						}
				},
				attachClass: function(a) {
					var b = this.getCustomData("classes");
					if (!this.hasClass(a)) {
						!b && (b = []);
						b.push(a);
						this.setCustomData("classes", b);
						this.addClass(a)
					}
				},
				changeAttr: function(a, b) {
					var c = this.getAttribute(a);
					if (b !== c) {
						!this._.attrChanges && (this._.attrChanges = {});
						a in this._.attrChanges || (this._.attrChanges[a] = c);
						this.setAttribute(a, b)
					}
				},
				insertHtml: function(a, b) {
					h(this);
					q(this, b || "html", a)
				},
				insertText: function(a) {
					h(this);
					var b = this.editor,
						c = b.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b.activeEnterMode,
						b = c == CKEDITOR.ENTER_BR,
						d = CKEDITOR.tools,
						a = d.htmlEncode(a.replace(/\r\n/g, "\n")),
						a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"),
						c = c == CKEDITOR.ENTER_P ? "p" : "div";
					if (!b) {
						var e = /\n{2}/g;
						if (e.test(a)) var f = "<" + c + ">",
							l = "</" + c + ">",
							a = f + a.replace(e, function() {
								return l + f
							}) + l
					}
					a = a.replace(/\n/g, "<br>");
					b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function(a) {
						return d.repeat(a, 2)
					}));
					a = a.replace(/^ | $/g, "&nbsp;");
					a = a.replace(/(>|\s) /g, function(a, b) {
						return b + "&nbsp;"
					}).replace(/ (?=<)/g, "&nbsp;");
					q(this, "text", a)
				},
				insertElement: function(a, b) {
					b ? this.insertElementIntoRange(a, b) : this.insertElementIntoSelection(a)
				},
				insertElementIntoRange: function(a,
					b) {
					var c = this.editor,
						d = c.config.enterMode,
						e = a.getName(),
						f = CKEDITOR.dtd.$block[e];
					if (b.checkReadOnly()) return false;
					b.deleteContents(1);
					b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({
						tr: 1,
						table: 1,
						tbody: 1,
						thead: 1,
						tfoot: 1
					}) && u(b);
					var l, h;
					if (f)
						for (;
							(l = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[l.getName()]) && (!h || !h[e]);)
							if (l.getName() in CKEDITOR.dtd.span) b.splitElement(l);
							else if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
						b.setStartBefore(l);
						b.collapse(true);
						l.remove()
					} else b.splitBlock(d ==
						CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
					b.insertNode(a);
					return true
				},
				insertElementIntoSelection: function(a) {
					var b = this.editor,
						d = b.activeEnterMode,
						b = b.getSelection(),
						e = b.getRanges()[0],
						f = a.getName(),
						f = CKEDITOR.dtd.$block[f];
					h(this);
					if (this.insertElementIntoRange(a, e)) {
						e.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
						if (f)
							if ((f = a.getNext(function(a) {
								return c(a) && !i(a)
							})) && f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block)) f.getDtd()["#"] ? e.moveToElementEditStart(f) : e.moveToElementEditEnd(a);
							else if (!f && d != CKEDITOR.ENTER_BR) {
							f = e.fixBlock(true, d == CKEDITOR.ENTER_DIV ? "div" : "p");
							e.moveToElementEditStart(f)
						}
					}
					b.selectRanges([e]);
					n(this)
				},
				setData: function(a, b) {
					b || (a = this.editor.dataProcessor.toHtml(a));
					this.setHtml(a);
					if (this.status == "unloaded") this.status = "ready";
					this.editor.fire("dataReady")
				},
				getData: function(a) {
					var b = this.getHtml();
					a || (b = this.editor.dataProcessor.toDataFormat(b));
					return b
				},
				setReadOnly: function(a) {
					this.setAttribute("contenteditable", !a)
				},
				detach: function() {
					this.removeClass("cke_editable");
					this.status = "detached";
					var a = this.editor;
					this._.detach();
					delete a.document;
					delete a.window
				},
				isInline: function() {
					return this.getDocument().equals(CKEDITOR.document)
				},
				setup: function() {
					var a = this.editor;
					this.attachListener(a, "beforeGetData", function() {
						var b = this.getData();
						this.is("textarea") || a.config.ignoreEmptyParagraph !== false && (b = b.replace(k, function(a, b) {
							return b
						}));
						a.setData(b, null, 1)
					}, this);
					this.attachListener(a, "getSnapshot", function(a) {
						a.data = this.getData(1)
					}, this);
					this.attachListener(a, "afterSetData",
						function() {
							this.setData(a.getData(1))
						}, this);
					this.attachListener(a, "loadSnapshot", function(a) {
						this.setData(a.data, 1)
					}, this);
					this.attachListener(a, "beforeFocus", function() {
						var b = a.getSelection();
						(b = b && b.getNative()) && b.type == "Control" || this.focus()
					}, this);
					this.attachListener(a, "insertHtml", function(a) {
						this.insertHtml(a.data.dataValue, a.data.mode)
					}, this);
					this.attachListener(a, "insertElement", function(a) {
						this.insertElement(a.data)
					}, this);
					this.attachListener(a, "insertText", function(a) {
							this.insertText(a.data)
						},
						this);
					this.setReadOnly(a.readOnly);
					this.attachClass("cke_editable");
					this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
					this.attachClass("cke_contents_" + a.config.contentsLangDirection);
					a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
					a.keystrokeHandler.attach(this);
					this.on("blur", function() {
						this.hasFocus = false
					}, null, null, -1);
					this.on("focus", function() {
						this.hasFocus =
							true
					}, null, null, -1);
					a.focusManager.add(this);
					if (this.equals(CKEDITOR.document.getActive())) {
						this.hasFocus = true;
						a.once("contentDom", function() {
							a.focusManager.focus()
						})
					}
					this.isInline() && this.changeAttr("tabindex", a.tabIndex);
					if (!this.is("textarea")) {
						a.document = this.getDocument();
						a.window = this.getWindow();
						var d = a.document;
						this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
						var e = a.config.contentsLangDirection;
						this.getDirection(1) != e && this.changeAttr("dir", e);
						var h = CKEDITOR.getCss();
						if (h) {
							e =
								d.getHead();
							if (!e.getCustomData("stylesheet")) {
								h = d.appendStyleText(h);
								h = new CKEDITOR.dom.element(h.ownerNode || h.owningElement);
								e.setCustomData("stylesheet", h);
								h.data("cke-temp", 1)
							}
						}
						e = d.getCustomData("stylesheet_ref") || 0;
						d.setCustomData("stylesheet_ref", e + 1);
						this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
						this.attachListener(this, "click", function(a) {
							var a = a.data,
								b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
							b && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
						});
						var m = {
							8: 1,
							46: 1
						};
						this.attachListener(a, "key", function(b) {
							if (a.readOnly) return true;
							var c = b.data.keyCode,
								d;
							if (c in m) {
								var b = a.getSelection(),
									e, r = b.getRanges()[0],
									h = r.startPath(),
									i, k, p, c = c == 8;
								if (CKEDITOR.env.ie && CKEDITOR.env.version < 11 && (e = b.getSelectedElement()) || (e = f(b))) {
									a.fire("saveSnapshot");
									r.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START);
									e.remove();
									r.select();
									a.fire("saveSnapshot");
									d = 1
								} else if (r.collapsed)
									if ((i = h.block) && (p = i[c ? "getPrevious" : "getNext"](o)) && p.type == CKEDITOR.NODE_ELEMENT && p.is("table") &&
										r[c ? "checkStartOfBlock" : "checkEndOfBlock"]()) {
										a.fire("saveSnapshot");
										r[c ? "checkEndOfBlock" : "checkStartOfBlock"]() && i.remove();
										r["moveToElementEdit" + (c ? "End" : "Start")](p);
										r.select();
										a.fire("saveSnapshot");
										d = 1
									} else if (h.blockLimit && h.blockLimit.is("td") && (k = h.blockLimit.getAscendant("table")) && r.checkBoundaryOfElement(k, c ? CKEDITOR.START : CKEDITOR.END) && (p = k[c ? "getPrevious" : "getNext"](o))) {
									a.fire("saveSnapshot");
									r["moveToElementEdit" + (c ? "End" : "Start")](p);
									r.checkStartOfBlock() && r.checkEndOfBlock() ? p.remove() :
										r.select();
									a.fire("saveSnapshot");
									d = 1
								} else if ((k = h.contains(["td", "th", "caption"])) && r.checkBoundaryOfElement(k, c ? CKEDITOR.START : CKEDITOR.END)) d = 1
							}
							return !d
						});
						a.blockless && (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) && this.attachListener(this, "keyup", function(b) {
							if (b.data.getKeystroke() in m && !this.getFirst(c)) {
								this.appendBogus();
								b = a.createRange();
								b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
								b.select()
							}
						});
						this.attachListener(this, "dblclick", function(b) {
							if (a.readOnly) return false;
							b = {
								element: b.data.getTarget()
							};
							a.fire("doubleclick", b)
						});
						CKEDITOR.env.ie && this.attachListener(this, "click", b);
						CKEDITOR.env.ie || this.attachListener(this, "mousedown", function(b) {
							var c = b.data.getTarget();
							if (c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly()) {
								a.getSelection().selectElement(c);
								c.is("input", "textarea", "select") && b.data.preventDefault()
							}
						});
						CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function(b) {
							if (b.data.$.button == 2) {
								b = b.data.getTarget();
								if (!b.getOuterHtml().replace(k, "")) {
									var c = a.createRange();
									c.moveToElementEditStart(b);
									c.select(true)
								}
							}
						});
						if (CKEDITOR.env.webkit) {
							this.attachListener(this, "click", function(a) {
								a.data.getTarget().is("input", "select") && a.data.preventDefault()
							});
							this.attachListener(this, "mouseup", function(a) {
								a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
							})
						}
					}
				}
			},
			_: {
				detach: function() {
					this.editor.setData(this.editor.getData(), 0, 1);
					this.clearListeners();
					this.restoreAttrs();
					var a;
					if (a = this.removeCustomData("classes"))
						for (; a.length;) this.removeClass(a.pop());
					if (!this.is("textarea")) {
						a =
							this.getDocument();
						var b = a.getHead();
						if (b.getCustomData("stylesheet")) {
							var c = a.getCustomData("stylesheet_ref");
							if (--c) a.setCustomData("stylesheet_ref", c);
							else {
								a.removeCustomData("stylesheet_ref");
								b.removeCustomData("stylesheet").remove()
							}
						}
					}
					this.editor.fire("contentDomUnload");
					delete this.editor
				}
			}
		});
		CKEDITOR.editor.prototype.editable = function(a) {
			var b = this._.editable;
			if (b && a) return 0;
			if (arguments.length) b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(),
				null);
			return b
		};
		var i = CKEDITOR.dom.walker.bogus(),
			k = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,
			o = CKEDITOR.dom.walker.whitespaces(true),
			s = CKEDITOR.dom.walker.bookmark(false, true);
		CKEDITOR.on("instanceLoaded", function(b) {
			var c = b.editor;
			c.on("insertElement", function(a) {
				a = a.data;
				if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
					a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ?
						"true" : "1");
					a.setAttribute("contentEditable", false)
				}
			});
			c.on("selectionChange", function(b) {
				if (!c.readOnly) {
					var d = c.getSelection();
					if (d && !d.isLocked) {
						d = c.checkDirty();
						c.fire("lockSnapshot");
						a(b);
						c.fire("unlockSnapshot");
						!d && c.resetDirty()
					}
				}
			})
		});
		CKEDITOR.on("instanceCreated", function(a) {
			var b = a.editor;
			b.on("mode", function() {
				var a = b.editable();
				if (a && a.isInline()) {
					var c = b.title;
					a.changeAttr("role", "textbox");
					a.changeAttr("aria-label", c);
					c && a.changeAttr("title", c);
					if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ?
						"top" : "contents")) {
						var d = CKEDITOR.tools.getNextId(),
							e = CKEDITOR.dom.element.createFromHtml('<span id="' + d + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
						c.append(e);
						a.changeAttr("aria-describedby", d)
					}
				}
			})
		});
		CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
		var q = function() {
				function a(b) {
					return b.type == CKEDITOR.NODE_ELEMENT
				}

				function b(c, d) {
					var e, f, j, m, t = [],
						r = d.range.startContainer;
					e = d.range.startPath();
					for (var r =
						l[r.getName()], h = 0, k = c.getChildren(), i = k.count(), v = -1, o = -1, n = 0, s = e.contains(l.$list); h < i; ++h) {
						e = k.getItem(h);
						if (a(e)) {
							j = e.getName();
							if (s && j in CKEDITOR.dtd.$list) t = t.concat(b(e, d));
							else {
								m = !!r[j];
								if (j == "br" && e.data("cke-eol") && (!h || h == i - 1)) {
									n = (f = h ? t[h - 1].node : k.getItem(h + 1)) && (!a(f) || !f.is("br"));
									f = f && a(f) && l.$block[f.getName()]
								}
								v == -1 && !m && (v = h);
								m || (o = h);
								t.push({
									isElement: 1,
									isLineBreak: n,
									isBlock: e.isBlockBoundary(),
									hasBlockSibling: f,
									node: e,
									name: j,
									allowed: m
								});
								f = n = 0
							}
						} else t.push({
							isElement: 0,
							node: e,
							allowed: 1
						})
					}
					if (v > -1) t[v].firstNotAllowed = 1;
					if (o > -1) t[o].lastNotAllowed = 1;
					return t
				}

				function d(b, c) {
					var e = [],
						f = b.getChildren(),
						j = f.count(),
						m, t = 0,
						r = l[c],
						h = !b.is(l.$inline) || b.is("br");
					for (h && e.push(" "); t < j; t++) {
						m = f.getItem(t);
						a(m) && !m.is(r) ? e = e.concat(d(m, c)) : e.push(m)
					}
					h && e.push(" ");
					return e
				}

				function e(b) {
					return b && a(b) && (b.is(l.$removeEmpty) || b.is("a") && !b.isBlockBoundary())
				}

				function f(b, c, d, e) {
					var j = b.clone(),
						l, t;
					j.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
					if ((l = (new CKEDITOR.dom.walker(j)).next()) &&
						a(l) && h[l.getName()] && (t = l.getPrevious()) && a(t) && !t.getParent().equals(b.startContainer) && d.contains(t) && e.contains(l) && l.isIdentical(t)) {
						l.moveChildren(t);
						l.remove();
						f(b, c, d, e)
					}
				}

				function j(b, c) {
					function d(b, c) {
						if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) {
							b.remove();
							return 1
						}
					}
					var e = c.endContainer.getChild(c.endOffset),
						f = c.endContainer.getChild(c.endOffset - 1);
					e && d(e, b[b.length - 1]);
					if (f && d(f, b[0])) {
						c.setEnd(c.endContainer, c.endOffset - 1);
						c.collapse()
					}
				}
				var l = CKEDITOR.dtd,
					h = {
						p: 1,
						div: 1,
						h1: 1,
						h2: 1,
						h3: 1,
						h4: 1,
						h5: 1,
						h6: 1,
						ul: 1,
						ol: 1,
						li: 1,
						pre: 1,
						dl: 1,
						blockquote: 1
					},
					k = {
						p: 1,
						div: 1,
						h1: 1,
						h2: 1,
						h3: 1,
						h4: 1,
						h5: 1,
						h6: 1
					},
					r = CKEDITOR.tools.extend({}, l.$inline);
				delete r.br;
				return function(h, i, v) {
					var o = h.editor;
					h.getDocument();
					var s = o.getSelection().getRanges()[0],
						q = false;
					if (i == "unfiltered_html") {
						i = "html";
						q = true
					}
					if (!s.checkReadOnly()) {
						var t = (new CKEDITOR.dom.elementPath(s.startContainer, s.root)).blockLimit || s.root,
							i = {
								type: i,
								dontFilter: q,
								editable: h,
								editor: o,
								range: s,
								blockLimit: t,
								mergeCandidates: [],
								zombies: []
							},
							o = i.range,
							q = i.mergeCandidates,
							x, y, B, w;
						if (i.type == "text" && o.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
							x = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", o.document);
							o.insertNode(x);
							o.setStartAfter(x)
						}
						y = new CKEDITOR.dom.elementPath(o.startContainer);
						i.endPath = B = new CKEDITOR.dom.elementPath(o.endContainer);
						if (!o.collapsed) {
							var t = B.block || B.blockLimit,
								N = o.getCommonAncestor();
							t && (!t.equals(N) && !t.contains(N) && o.checkEndOfBlock()) && i.zombies.push(t);
							o.deleteContents()
						}
						for (;
							(w = a(o.startContainer) &&
								o.startContainer.getChild(o.startOffset - 1)) && a(w) && w.isBlockBoundary() && y.contains(w);) o.moveToPosition(w, CKEDITOR.POSITION_BEFORE_END);
						f(o, i.blockLimit, y, B);
						if (x) {
							o.setEndBefore(x);
							o.collapse();
							x.remove()
						}
						x = o.startPath();
						if (t = x.contains(e, false, 1)) {
							o.splitElement(t);
							i.inlineStylesRoot = t;
							i.inlineStylesPeak = x.lastElement
						}
						x = o.createBookmark();
						(t = x.startNode.getPrevious(c)) && a(t) && e(t) && q.push(t);
						(t = x.startNode.getNext(c)) && a(t) && e(t) && q.push(t);
						for (t = x.startNode;
							(t = t.getParent()) && e(t);) q.push(t);
						o.moveToBookmark(x);
						if (x = v) {
							x = i.range;
							if (i.type == "text" && i.inlineStylesRoot) {
								w = i.inlineStylesPeak;
								o = w.getDocument().createText("{cke-peak}");
								for (q = i.inlineStylesRoot.getParent(); !w.equals(q);) {
									o = o.appendTo(w.clone());
									w = w.getParent()
								}
								v = o.getOuterHtml().split("{cke-peak}").join(v)
							}
							w = i.blockLimit.getName();
							if (/^\s+|\s+$/.test(v) && "span" in CKEDITOR.dtd[w]) var M = '<span data-cke-marker="1">&nbsp;</span>',
								v = M + v + M;
							v = i.editor.dataProcessor.toHtml(v, {
								context: null,
								fixForBody: false,
								dontFilter: i.dontFilter,
								filter: i.editor.activeFilter,
								enterMode: i.editor.activeEnterMode
							});
							w = x.document.createElement("body");
							w.setHtml(v);
							if (M) {
								w.getFirst().remove();
								w.getLast().remove()
							}
							if ((M = x.startPath().block) && !(M.getChildCount() == 1 && M.getBogus())) a: {
								var D;
								if (w.getChildCount() == 1 && a(D = w.getFirst()) && D.is(k)) {
									M = D.getElementsByTag("*");
									x = 0;
									for (q = M.count(); x < q; x++) {
										o = M.getItem(x);
										if (!o.is(r)) break a
									}
									D.moveChildren(D.getParent(1));
									D.remove()
								}
							}
							i.dataWrapper = w;
							x = v
						}
						if (x) {
							D = i.range;
							var M = D.document,
								u, v = i.blockLimit;
							x = 0;
							var I;
							w = [];
							var E, Q, q = o = 0,
								K, S;
							y = D.startContainer;
							var t = i.endPath.elements[0],
								T;
							B = t.getPosition(y);
							N = !!t.getCommonAncestor(y) && B != CKEDITOR.POSITION_IDENTICAL && !(B & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
							y = b(i.dataWrapper, i);
							for (j(y, D); x < y.length; x++) {
								B = y[x];
								if (u = B.isLineBreak) {
									u = D;
									K = v;
									var O = void 0,
										W = void 0;
									if (B.hasBlockSibling) u = 1;
									else {
										O = u.startContainer.getAscendant(l.$block, 1);
										if (!O || !O.is({
											div: 1,
											p: 1
										})) u = 0;
										else {
											W = O.getPosition(K);
											if (W == CKEDITOR.POSITION_IDENTICAL || W == CKEDITOR.POSITION_CONTAINS) u = 0;
											else {
												K = u.splitElement(O);
												u.moveToPosition(K,
													CKEDITOR.POSITION_AFTER_START);
												u = 1
											}
										}
									}
								}
								if (u) q = x > 0;
								else {
									u = D.startPath();
									if (!B.isBlock && i.editor.config.autoParagraph !== false && (i.editor.activeEnterMode != CKEDITOR.ENTER_BR && i.editor.editable().equals(u.blockLimit) && !u.block) && (Q = i.editor.activeEnterMode != CKEDITOR.ENTER_BR && i.editor.config.autoParagraph !== false ? i.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false)) {
										Q = M.createElement(Q);
										Q.appendBogus();
										D.insertNode(Q);
										CKEDITOR.env.needsBrFiller && (I = Q.getBogus()) && I.remove();
										D.moveToPosition(Q,
											CKEDITOR.POSITION_BEFORE_END)
									}
									if ((u = D.startPath().block) && !u.equals(E)) {
										if (I = u.getBogus()) {
											I.remove();
											w.push(u)
										}
										E = u
									}
									B.firstNotAllowed && (o = 1);
									if (o && B.isElement) {
										u = D.startContainer;
										for (K = null; u && !l[u.getName()][B.name];) {
											if (u.equals(v)) {
												u = null;
												break
											}
											K = u;
											u = u.getParent()
										}
										if (u) {
											if (K) {
												S = D.splitElement(K);
												i.zombies.push(S);
												i.zombies.push(K)
											}
										} else {
											K = v.getName();
											T = !x;
											u = x == y.length - 1;
											K = d(B.node, K);
											for (var O = [], W = K.length, X = 0, Z = void 0, $ = 0, aa = -1; X < W; X++) {
												Z = K[X];
												if (Z == " ") {
													if (!$ && (!T || X)) {
														O.push(new CKEDITOR.dom.text(" "));
														aa = O.length
													}
													$ = 1
												} else {
													O.push(Z);
													$ = 0
												}
											}
											u && aa == O.length && O.pop();
											T = O
										}
									}
									if (T) {
										for (; u = T.pop();) D.insertNode(u);
										T = 0
									} else D.insertNode(B.node); if (B.lastNotAllowed && x < y.length - 1) {
										(S = N ? t : S) && D.setEndAt(S, CKEDITOR.POSITION_AFTER_START);
										o = 0
									}
									D.collapse()
								}
							}
							i.dontMoveCaret = q;
							i.bogusNeededBlocks = w
						}
						I = i.range;
						var U;
						S = i.bogusNeededBlocks;
						for (T = I.createBookmark(); E = i.zombies.pop();)
							if (E.getParent()) {
								Q = I.clone();
								Q.moveToElementEditStart(E);
								Q.removeEmptyBlocksAtEnd()
							}
						if (S)
							for (; E = S.pop();) CKEDITOR.env.needsBrFiller ? E.appendBogus() :
								E.append(I.document.createText(" "));
						for (; E = i.mergeCandidates.pop();) E.mergeSiblings();
						I.moveToBookmark(T);
						if (!i.dontMoveCaret) {
							for (E = a(I.startContainer) && I.startContainer.getChild(I.startOffset - 1); E && a(E) && !E.is(l.$empty);) {
								if (E.isBlockBoundary()) I.moveToPosition(E, CKEDITOR.POSITION_BEFORE_END);
								else {
									if (e(E) && E.getHtml().match(/(\s|&nbsp;)$/g)) {
										U = null;
										break
									}
									U = I.clone();
									U.moveToPosition(E, CKEDITOR.POSITION_BEFORE_END)
								}
								E = E.getLast(c)
							}
							U && I.moveToRange(U)
						}
						s.select();
						n(h)
					}
				}
			}(),
			u = function() {
				function a(b) {
					b =
						new CKEDITOR.dom.walker(b);
					b.guard = function(a, b) {
						if (b) return false;
						if (a.type == CKEDITOR.NODE_ELEMENT) return a.is(CKEDITOR.dtd.$tableContent)
					};
					b.evaluator = function(a) {
						return a.type == CKEDITOR.NODE_ELEMENT
					};
					return b
				}

				function b(a, c, d) {
					c = a.getDocument().createElement(c);
					a.append(c, d);
					return c
				}

				function c(a) {
					var b = a.count(),
						d;
					for (b; b-- > 0;) {
						d = a.getItem(b);
						if (!CKEDITOR.tools.trim(d.getHtml())) {
							d.appendBogus();
							CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && d.getChildCount()) && d.getFirst().remove()
						}
					}
				}
				return function(d) {
					var e =
						d.startContainer,
						f = e.getAscendant("table", 1),
						l = false;
					c(f.getElementsByTag("td"));
					c(f.getElementsByTag("th"));
					f = d.clone();
					f.setStart(e, 0);
					f = a(f).lastBackward();
					if (!f) {
						f = d.clone();
						f.setEndAt(e, CKEDITOR.POSITION_BEFORE_END);
						f = a(f).lastForward();
						l = true
					}
					f || (f = e);
					if (f.is("table")) {
						d.setStartAt(f, CKEDITOR.POSITION_BEFORE_START);
						d.collapse(true);
						f.remove()
					} else {
						f.is({
							tbody: 1,
							thead: 1,
							tfoot: 1
						}) && (f = b(f, "tr", l));
						f.is("tr") && (f = b(f, f.getParent().is("thead") ? "th" : "td", l));
						(e = f.getBogus()) && e.remove();
						d.moveToPosition(f,
							l ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END)
					}
				}
			}()
	})();
	(function() {
		function a() {
			var a = this._.fakeSelection,
				b;
			if (a) {
				b = this.getSelection(1);
				if (!b || !b.isHidden()) {
					a.reset();
					a = 0
				}
			}
			if (!a) {
				a = b || this.getSelection(1);
				if (!a || a.getType() == CKEDITOR.SELECTION_NONE) return
			}
			this.fire("selectionCheck", a);
			b = this.elementPath();
			if (!b.compare(this._.selectionPreviousPath)) {
				if (CKEDITOR.env.webkit) this._.previousActive = this.document.getActive();
				this._.selectionPreviousPath = b;
				this.fire("selectionChange", {
					selection: a,
					path: b
				})
			}
		}

		function e() {
			q = true;
			if (!s) {
				b.call(this);
				s = CKEDITOR.tools.setTimeout(b,
					200, this)
			}
		}

		function b() {
			s = null;
			if (q) {
				CKEDITOR.tools.setTimeout(a, 0, this);
				q = false
			}
		}

		function c(a) {
			function b(c, d) {
				return !c || c.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (d ? "End" : "Start")](c)
			}
			if (!(a.root instanceof CKEDITOR.editable)) return false;
			var c = a.startContainer,
				d = a.getPreviousNode(u, null, c),
				e = a.getNextNode(u, null, c);
			return b(d) || b(e, 1) || !d && !e && !(c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? true : false
		}

		function d(a) {
			return a.getCustomData("cke-fillingChar")
		}

		function f(a, b) {
			var c = a && a.removeCustomData("cke-fillingChar");
			if (c) {
				if (b !== false) {
					var d, e = a.getDocument().getSelection().getNative(),
						f = e && e.type != "None" && e.getRangeAt(0);
					if (c.getLength() > 1 && f && f.intersectsNode(c.$)) {
						d = [e.anchorOffset, e.focusOffset];
						f = e.focusNode == c.$ && e.focusOffset > 0;
						e.anchorNode == c.$ && e.anchorOffset > 0 && d[0]--;
						f && d[1]--;
						var g;
						f = e;
						if (!f.isCollapsed) {
							g = f.getRangeAt(0);
							g.setStart(f.anchorNode, f.anchorOffset);
							g.setEnd(f.focusNode, f.focusOffset);
							g = g.collapsed
						}
						g && d.unshift(d.pop())
					}
				}
				c.setText(h(c.getText()));
				if (d) {
					c = e.getRangeAt(0);
					c.setStart(c.startContainer, d[0]);
					c.setEnd(c.startContainer, d[1]);
					e.removeAllRanges();
					e.addRange(c)
				}
			}
		}

		function h(a) {
			return a.replace(/\u200B( )?/g, function(a) {
				return a[1] ? " " : ""
			})
		}

		function n(a, b, c) {
			var d = a.on("focus", function(a) {
				a.cancel()
			}, null, null, -100);
			if (CKEDITOR.env.ie) var e = a.getDocument().on("selectionchange", function(a) {
				a.cancel()
			}, null, null, -100);
			else {
				var f = new CKEDITOR.dom.range(a);
				f.moveToElementEditStart(a);
				var g = a.getDocument().$.createRange();
				g.setStart(f.startContainer.$,
					f.startOffset);
				g.collapse(1);
				b.removeAllRanges();
				b.addRange(g)
			}
			c && a.focus();
			d.removeListener();
			e && e.removeListener()
		}

		function i(a) {
			var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a.document);
			a.fire("lockSnapshot");
			a.editable().append(b);
			var c = a.getSelection(1),
				d = a.createRange(),
				e = c.root.on("selectionchange", function(a) {
					a.cancel()
				}, null, null, 0);
			d.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
			d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
			c.selectRanges([d]);
			e.removeListener();
			a.fire("unlockSnapshot");
			a._.hiddenSelectionContainer = b
		}

		function k(a) {
			var b = {
				37: 1,
				39: 1,
				8: 1,
				46: 1
			};
			return function(c) {
				var d = c.data.getKeystroke();
				if (b[d]) {
					var e = a.getSelection().getRanges(),
						f = e[0];
					if (e.length == 1 && f.collapsed)
						if ((d = f[d < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && d.type == CKEDITOR.NODE_ELEMENT && d.getAttribute("contenteditable") == "false") {
							a.getSelection().fake(d);
							c.data.preventDefault();
							c.cancel()
						}
				}
			}
		}

		function o(a) {
			for (var b = 0; b < a.length; b++) {
				var c = a[b];
				c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
				if (!c.collapsed) {
					if (c.startContainer.isReadOnly())
						for (var d = c.startContainer, e; d;) {
							if ((e = d.type == CKEDITOR.NODE_ELEMENT) && d.is("body") || !d.isReadOnly()) break;
							e && d.getAttribute("contentEditable") == "false" && c.setStartAfter(d);
							d = d.getParent()
						}
					d = c.startContainer;
					e = c.endContainer;
					var f = c.startOffset,
						g = c.endOffset,
						h = c.clone();
					d && d.type == CKEDITOR.NODE_TEXT && (f >= d.getLength() ? h.setStartAfter(d) : h.setStartBefore(d));
					e && e.type == CKEDITOR.NODE_TEXT && (g ? h.setEndAfter(e) : h.setEndBefore(e));
					d = new CKEDITOR.dom.walker(h);
					d.evaluator = function(d) {
						if (d.type == CKEDITOR.NODE_ELEMENT && d.isReadOnly()) {
							var e = c.clone();
							c.setEndBefore(d);
							c.collapsed && a.splice(b--, 1);
							if (!(d.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
								e.setStartAfter(d);
								e.collapsed || a.splice(b + 1, 0, e)
							}
							return true
						}
						return false
					};
					d.next()
				}
			}
			return a
		}
		var s, q, u = CKEDITOR.dom.walker.invisible(1),
			g = function() {
				function a(b) {
					return function(a) {
						var c = a.editor.createRange();
						c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]);
						return false
					}
				}

				function b(a) {
					return function(b) {
						var c = b.editor,
							d = c.createRange(),
							e;
						if (!(e = d.moveToClosestEditablePosition(b.selected, a))) e = d.moveToClosestEditablePosition(b.selected, !a);
						e && c.getSelection().selectRanges([d]);
						c.fire("saveSnapshot");
						b.selected.remove();
						if (!e) {
							d.moveToElementEditablePosition(c.editable());
							c.getSelection().selectRanges([d])
						}
						c.fire("saveSnapshot");
						return false
					}
				}
				var c = a(),
					d = a(1);
				return {
					37: c,
					38: c,
					39: d,
					40: d,
					8: b(),
					46: b(1)
				}
			}();
		CKEDITOR.on("instanceCreated", function(b) {
			function c() {
				var a = d.getSelection();
				a && a.removeAllRanges()
			}
			var d = b.editor;
			d.on("contentDom", function() {
				var b = d.document,
					c = CKEDITOR.document,
					g = d.editable(),
					j = b.getBody(),
					m = b.getDocumentElement(),
					h = g.isInline(),
					i, o;
				CKEDITOR.env.gecko && g.attachListener(g, "focus", function(a) {
						a.removeListener();
						if (i !== 0)
							if ((a = d.getSelection().getNative()) && a.isCollapsed && a.anchorNode == g.$) {
								a = d.createRange();
								a.moveToElementEditStart(g);
								a.select()
							}
					},
					null, null, -2);
				g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
					i && CKEDITOR.env.webkit && (i = d._.previousActive && d._.previousActive.equals(b.getActive()));
					d.unlockSelection(i);
					i = 0
				}, null, null, -1);
				g.attachListener(g, "mousedown", function() {
					i = 0
				});
				if (CKEDITOR.env.ie || h) {
					var n = function() {
						o = new CKEDITOR.dom.selection(d.getSelection());
						o.lock()
					};
					p ? g.attachListener(g, "beforedeactivate", n, null, null, -1) : g.attachListener(d, "selectionCheck", n, null, null, -1);
					g.attachListener(g, CKEDITOR.env.webkit ?
						"DOMFocusOut" : "blur", function() {
							d.lockSelection(o);
							i = 1
						}, null, null, -1);
					g.attachListener(g, "mousedown", function() {
						i = 0
					})
				}
				if (CKEDITOR.env.ie && !h) {
					var t;
					g.attachListener(g, "mousedown", function(a) {
						if (a.data.$.button == 2) {
							a = d.document.getSelection();
							if (!a || a.getType() == CKEDITOR.SELECTION_NONE) t = d.window.getScrollPosition()
						}
					});
					g.attachListener(g, "mouseup", function(a) {
						if (a.data.$.button == 2 && t) {
							d.document.$.documentElement.scrollLeft = t.x;
							d.document.$.documentElement.scrollTop = t.y
						}
						t = null
					});
					if (b.$.compatMode !=
						"BackCompat") {
						if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) m.on("mousedown", function(a) {
							function b(a) {
								a = a.data.$;
								if (e) {
									var c = j.$.createTextRange();
									try {
										c.moveToPoint(a.x, a.y)
									} catch (d) {}
									e.setEndPoint(g.compareEndPoints("StartToStart", c) < 0 ? "EndToEnd" : "StartToStart", c);
									e.select()
								}
							}

							function d() {
								m.removeListener("mousemove", b);
								c.removeListener("mouseup", d);
								m.removeListener("mouseup", d);
								e.select()
							}
							a = a.data;
							if (a.getTarget().is("html") && a.$.y < m.$.clientHeight && a.$.x < m.$.clientWidth) {
								var e = j.$.createTextRange();
								try {
									e.moveToPoint(a.$.x, a.$.y)
								} catch (f) {}
								var g = e.duplicate();
								m.on("mousemove", b);
								c.on("mouseup", d);
								m.on("mouseup", d)
							}
						});
						if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
							m.on("mousedown", function(a) {
								if (a.data.getTarget().is("html")) {
									c.on("mouseup", x);
									m.on("mouseup", x)
								}
							});
							var x = function() {
								c.removeListener("mouseup", x);
								m.removeListener("mouseup", x);
								var a = CKEDITOR.document.$.selection,
									d = a.createRange();
								a.type != "None" && d.parentElement().ownerDocument == b.$ && d.select()
							}
						}
					}
				}
				g.attachListener(g, "selectionchange",
					a, d);
				g.attachListener(g, "keyup", e, d);
				g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
					d.forceNextSelectionCheck();
					d.selectionChange(1)
				});
				if (h && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
					var y;
					g.attachListener(g, "mousedown", function() {
						y = 1
					});
					g.attachListener(b.getDocumentElement(), "mouseup", function() {
						y && e.call(d);
						y = 0
					})
				} else g.attachListener(CKEDITOR.env.ie ? g : b.getDocumentElement(), "mouseup", e, d);
				CKEDITOR.env.webkit && g.attachListener(b, "keydown", function(a) {
						switch (a.data.getKey()) {
							case 13:
							case 33:
							case 34:
							case 35:
							case 36:
							case 37:
							case 39:
							case 8:
							case 45:
							case 46:
								f(g)
						}
					},
					null, null, -1);
				g.attachListener(g, "keydown", k(d), null, null, -1)
			});
			d.on("setData", function() {
				d.unlockSelection();
				CKEDITOR.env.webkit && c()
			});
			d.on("contentDomUnload", function() {
				d.unlockSelection()
			});
			if (CKEDITOR.env.ie9Compat) d.on("beforeDestroy", c, null, null, 9);
			d.on("dataReady", function() {
				delete d._.fakeSelection;
				delete d._.hiddenSelectionContainer;
				d.selectionChange(1)
			});
			d.on("loadSnapshot", function() {
				var a = d.editable().getLast(function(a) {
					return a.type == CKEDITOR.NODE_ELEMENT
				});
				a && a.hasAttribute("data-cke-hidden-sel") &&
					a.remove()
			}, null, null, 100);
			d.on("key", function(a) {
				if (d.mode == "wysiwyg") {
					var b = d.getSelection();
					if (b.isFake) {
						var c = g[a.data.keyCode];
						if (c) return c({
							editor: d,
							selected: b.getSelectedElement(),
							selection: b,
							keyEvent: a
						})
					}
				}
			})
		});
		CKEDITOR.on("instanceReady", function(a) {
			var b = a.editor;
			if (CKEDITOR.env.webkit) {
				b.on("selectionChange", function() {
					var a = b.editable(),
						c = d(a);
					c && (c.getCustomData("ready") ? f(a) : c.setCustomData("ready", 1))
				}, null, null, -1);
				b.on("beforeSetMode", function() {
					f(b.editable())
				}, null, null, -1);
				var c,
					e, a = function() {
						var a = b.editable();
						if (a)
							if (a = d(a)) {
								var f = b.document.$.defaultView.getSelection();
								f.type == "Caret" && f.anchorNode == a.$ && (e = 1);
								c = a.getText();
								a.setText(h(c))
							}
					},
					g = function() {
						var a = b.editable();
						if (a)
							if (a = d(a)) {
								a.setText(c);
								if (e) {
									b.document.$.defaultView.getSelection().setPosition(a.$, a.getLength());
									e = 0
								}
							}
					};
				b.on("beforeUndoImage", a);
				b.on("afterUndoImage", g);
				b.on("beforeGetData", a, null, null, 0);
				b.on("getData", g)
			}
		});
		CKEDITOR.editor.prototype.selectionChange = function(b) {
			(b ? a : e).call(this)
		};
		CKEDITOR.editor.prototype.getSelection =
			function(a) {
				if ((this._.savedSelection || this._.fakeSelection) && !a) return this._.savedSelection || this._.fakeSelection;
				return (a = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(a) : null
		};
		CKEDITOR.editor.prototype.lockSelection = function(a) {
			a = a || this.getSelection(1);
			if (a.getType() != CKEDITOR.SELECTION_NONE) {
				!a.isLocked && a.lock();
				this._.savedSelection = a;
				return true
			}
			return false
		};
		CKEDITOR.editor.prototype.unlockSelection = function(a) {
			var b = this._.savedSelection;
			if (b) {
				b.unlock(a);
				delete this._.savedSelection;
				return true
			}
			return false
		};
		CKEDITOR.editor.prototype.forceNextSelectionCheck = function() {
			delete this._.selectionPreviousPath
		};
		CKEDITOR.dom.document.prototype.getSelection = function() {
			return new CKEDITOR.dom.selection(this)
		};
		CKEDITOR.dom.range.prototype.select = function() {
			var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
			a.selectRanges([this]);
			return a
		};
		CKEDITOR.SELECTION_NONE = 1;
		CKEDITOR.SELECTION_TEXT = 2;
		CKEDITOR.SELECTION_ELEMENT = 3;
		var p =
			typeof window.getSelection != "function",
			z = 1;
		CKEDITOR.dom.selection = function(a) {
			if (a instanceof CKEDITOR.dom.selection) var b = a,
				a = a.root;
			var c = a instanceof CKEDITOR.dom.element;
			this.rev = b ? b.rev : z++;
			this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
			this.root = a = c ? a : this.document.getBody();
			this.isLocked = 0;
			this._ = {
				cache: {}
			};
			if (b) {
				CKEDITOR.tools.extend(this._.cache, b._.cache);
				this.isFake = b.isFake;
				this.isLocked = b.isLocked;
				return this
			}
			b = p ? this.document.$.selection : this.document.getWindow().$.getSelection();
			if (CKEDITOR.env.webkit)(b.type == "None" && this.document.getActive().equals(a) || b.type == "Caret" && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && n(a, b);
			else if (CKEDITOR.env.gecko) b && (this.document.getActive().equals(a) && b.anchorNode && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && n(a, b, true);
			else if (CKEDITOR.env.ie) {
				var d;
				try {
					d = this.document.getActive()
				} catch (e) {}
				if (p) b.type == "None" && (d && d.equals(this.document.getDocumentElement())) && n(a, null, true);
				else {
					(b = b && b.anchorNode) && (b = new CKEDITOR.dom.node(b));
					d && (d.equals(this.document.getDocumentElement()) && b && (a.equals(b) || a.contains(b))) && n(a, null, true)
				}
			}
			d = this.getNative();
			var f, g;
			if (d)
				if (d.getRangeAt) f = (g = d.rangeCount && d.getRangeAt(0)) && new CKEDITOR.dom.node(g.commonAncestorContainer);
				else {
					try {
						g = d.createRange()
					} catch (h) {}
					f = g && CKEDITOR.dom.element.get(g.item && g.item(0) || g.parentElement())
				}
			if (!f || !(f.type == CKEDITOR.NODE_ELEMENT || f.type == CKEDITOR.NODE_TEXT) || !this.root.equals(f) && !this.root.contains(f)) {
				this._.cache.type = CKEDITOR.SELECTION_NONE;
				this._.cache.startElement =
					null;
				this._.cache.selectedElement = null;
				this._.cache.selectedText = "";
				this._.cache.ranges = new CKEDITOR.dom.rangeList
			}
			return this
		};
		var A = {
			img: 1,
			hr: 1,
			li: 1,
			table: 1,
			tr: 1,
			td: 1,
			th: 1,
			embed: 1,
			object: 1,
			ol: 1,
			ul: 1,
			a: 1,
			input: 1,
			form: 1,
			select: 1,
			textarea: 1,
			button: 1,
			fieldset: 1,
			thead: 1,
			tfoot: 1
		};
		CKEDITOR.dom.selection.prototype = {
			getNative: function() {
				return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = p ? this.document.$.selection : this.document.getWindow().$.getSelection()
			},
			getType: p ? function() {
				var a =
					this._.cache;
				if (a.type) return a.type;
				var b = CKEDITOR.SELECTION_NONE;
				try {
					var c = this.getNative(),
						d = c.type;
					if (d == "Text") b = CKEDITOR.SELECTION_TEXT;
					if (d == "Control") b = CKEDITOR.SELECTION_ELEMENT;
					if (c.createRange().parentElement()) b = CKEDITOR.SELECTION_TEXT
				} catch (e) {}
				return a.type = b
			} : function() {
				var a = this._.cache;
				if (a.type) return a.type;
				var b = CKEDITOR.SELECTION_TEXT,
					c = this.getNative();
				if (!c || !c.rangeCount) b = CKEDITOR.SELECTION_NONE;
				else if (c.rangeCount == 1) {
					var c = c.getRangeAt(0),
						d = c.startContainer;
					if (d == c.endContainer &&
						d.nodeType == 1 && c.endOffset - c.startOffset == 1 && A[d.childNodes[c.startOffset].nodeName.toLowerCase()]) b = CKEDITOR.SELECTION_ELEMENT
				}
				return a.type = b
			},
			getRanges: function() {
				var a = p ? function() {
					function a(b) {
						return (new CKEDITOR.dom.node(b)).getIndex()
					}
					var b = function(b, c) {
						b = b.duplicate();
						b.collapse(c);
						var d = b.parentElement();
						if (!d.hasChildNodes()) return {
							container: d,
							offset: 0
						};
						for (var e = d.children, f, g, h = b.duplicate(), i = 0, m = e.length - 1, t = -1, l, k; i <= m;) {
							t = Math.floor((i + m) / 2);
							f = e[t];
							h.moveToElementText(f);
							l = h.compareEndPoints("StartToStart",
								b);
							if (l > 0) m = t - 1;
							else if (l < 0) i = t + 1;
							else return {
								container: d,
								offset: a(f)
							}
						}
						if (t == -1 || t == e.length - 1 && l < 0) {
							h.moveToElementText(d);
							h.setEndPoint("StartToStart", b);
							h = h.text.replace(/(\r\n|\r)/g, "\n").length;
							e = d.childNodes;
							if (!h) {
								f = e[e.length - 1];
								return f.nodeType != CKEDITOR.NODE_TEXT ? {
									container: d,
									offset: e.length
								} : {
									container: f,
									offset: f.nodeValue.length
								}
							}
							for (d = e.length; h > 0 && d > 0;) {
								g = e[--d];
								if (g.nodeType == CKEDITOR.NODE_TEXT) {
									k = g;
									h = h - g.nodeValue.length
								}
							}
							return {
								container: k,
								offset: -h
							}
						}
						h.collapse(l > 0 ? true : false);
						h.setEndPoint(l >
							0 ? "StartToStart" : "EndToStart", b);
						h = h.text.replace(/(\r\n|\r)/g, "\n").length;
						if (!h) return {
							container: d,
							offset: a(f) + (l > 0 ? 0 : 1)
						};
						for (; h > 0;) try {
							g = f[l > 0 ? "previousSibling" : "nextSibling"];
							if (g.nodeType == CKEDITOR.NODE_TEXT) {
								h = h - g.nodeValue.length;
								k = g
							}
							f = g
						} catch (o) {
							return {
								container: d,
								offset: a(f)
							}
						}
						return {
							container: k,
							offset: l > 0 ? -h : k.nodeValue.length + h
						}
					};
					return function() {
						var a = this.getNative(),
							c = a && a.createRange(),
							d = this.getType();
						if (!a) return [];
						if (d == CKEDITOR.SELECTION_TEXT) {
							a = new CKEDITOR.dom.range(this.root);
							d = b(c, true);
							a.setStart(new CKEDITOR.dom.node(d.container), d.offset);
							d = b(c);
							a.setEnd(new CKEDITOR.dom.node(d.container), d.offset);
							a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse();
							return [a]
						}
						if (d == CKEDITOR.SELECTION_ELEMENT) {
							for (var d = [], e = 0; e < c.length; e++) {
								for (var f = c.item(e), g = f.parentNode, h = 0, a = new CKEDITOR.dom.range(this.root); h < g.childNodes.length && g.childNodes[h] != f; h++);
								a.setStart(new CKEDITOR.dom.node(g), h);
								a.setEnd(new CKEDITOR.dom.node(g),
									h + 1);
								d.push(a)
							}
							return d
						}
						return []
					}
				}() : function() {
					var a = [],
						b, c = this.getNative();
					if (!c) return a;
					for (var d = 0; d < c.rangeCount; d++) {
						var e = c.getRangeAt(d);
						b = new CKEDITOR.dom.range(this.root);
						b.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset);
						b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
						a.push(b)
					}
					return a
				};
				return function(b) {
					var c = this._.cache,
						d = c.ranges;
					if (!d) c.ranges = d = new CKEDITOR.dom.rangeList(a.call(this));
					return !b ? d : o(new CKEDITOR.dom.rangeList(d.slice()))
				}
			}(),
			getStartElement: function() {
				var a =
					this._.cache;
				if (a.startElement !== void 0) return a.startElement;
				var b;
				switch (this.getType()) {
					case CKEDITOR.SELECTION_ELEMENT:
						return this.getSelectedElement();
					case CKEDITOR.SELECTION_TEXT:
						var c = this.getRanges()[0];
						if (c) {
							if (c.collapsed) {
								b = c.startContainer;
								b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
							} else {
								for (c.optimize();;) {
									b = c.startContainer;
									if (c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary()) c.setStartAfter(b);
									else break
								}
								b = c.startContainer;
								if (b.type != CKEDITOR.NODE_ELEMENT) return b.getParent();
								b = b.getChild(c.startOffset);
								if (!b || b.type != CKEDITOR.NODE_ELEMENT) b = c.startContainer;
								else
									for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) {
										b = c;
										c = c.getFirst()
									}
							}
							b = b.$
						}
				}
				return a.startElement = b ? new CKEDITOR.dom.element(b) : null
			},
			getSelectedElement: function() {
				var a = this._.cache;
				if (a.selectedElement !== void 0) return a.selectedElement;
				var b = this,
					c = CKEDITOR.tools.tryThese(function() {
						return b.getNative().createRange().item(0)
					}, function() {
						for (var a = b.getRanges()[0].clone(), c, d, e = 2; e && (!(c = a.getEnclosedNode()) ||
							!(c.type == CKEDITOR.NODE_ELEMENT && A[c.getName()] && (d = c))); e--) a.shrink(CKEDITOR.SHRINK_ELEMENT);
						return d && d.$
					});
				return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
			},
			getSelectedText: function() {
				var a = this._.cache;
				if (a.selectedText !== void 0) return a.selectedText;
				var b = this.getNative(),
					b = p ? b.type == "Control" ? "" : b.createRange().text : b.toString();
				return a.selectedText = b
			},
			lock: function() {
				this.getRanges();
				this.getStartElement();
				this.getSelectedElement();
				this.getSelectedText();
				this._.cache.nativeSel =
					null;
				this.isLocked = 1
			},
			unlock: function(a) {
				if (this.isLocked) {
					if (a) var b = this.getSelectedElement(),
						c = !b && this.getRanges(),
						d = this.isFake;
					this.isLocked = 0;
					this.reset();
					if (a)(a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (d ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
				}
			},
			reset: function() {
				this._.cache = {};
				this.isFake = 0;
				var a = this.root.editor;
				if (a && a._.fakeSelection && this.rev == a._.fakeSelection.rev) {
					delete a._.fakeSelection;
					var b = a._.hiddenSelectionContainer;
					if (b) {
						a.fire("lockSnapshot");
						b.remove();
						a.fire("unlockSnapshot")
					}
					delete a._.hiddenSelectionContainer
				}
				this.rev = z++
			},
			selectElement: function(a) {
				var b = new CKEDITOR.dom.range(this.root);
				b.setStartBefore(a);
				b.setEndAfter(a);
				this.selectRanges([b])
			},
			selectRanges: function(a) {
				var b = this.root.editor,
					b = b && b._.hiddenSelectionContainer;
				this.reset();
				if (b)
					for (var b = this.root, d, e = 0; e < a.length; ++e) {
						d = a[e];
						if (d.endContainer.equals(b)) d.endOffset = Math.min(d.endOffset, b.getChildCount())
					}
				if (a.length)
					if (this.isLocked) {
						var g = CKEDITOR.document.getActive();
						this.unlock();
						this.selectRanges(a);
						this.lock();
						!g.equals(this.root) && g.focus()
					} else {
						var h;
						a: {
							var i, k;
							if (a.length == 1 && !(k = a[0]).collapsed && (h = k.getEnclosedNode()) && h.type == CKEDITOR.NODE_ELEMENT) {
								k = k.clone();
								k.shrink(CKEDITOR.SHRINK_ELEMENT, true);
								if ((i = k.getEnclosedNode()) && i.type == CKEDITOR.NODE_ELEMENT) h = i;
								if (h.getAttribute("contenteditable") == "false") break a
							}
							h = void 0
						}
						if (h) this.fake(h);
						else {
							if (p) {
								k = CKEDITOR.dom.walker.whitespaces(true);
								i = /\ufeff|\u00a0/;
								b = {
									table: 1,
									tbody: 1,
									tr: 1
								};
								if (a.length > 1) {
									h = a[a.length -
										1];
									a[0].setEnd(h.endContainer, h.endOffset)
								}
								h = a[0];
								var a = h.collapsed,
									o, n, q;
								if ((d = h.getEnclosedNode()) && d.type == CKEDITOR.NODE_ELEMENT && d.getName() in A && (!d.is("a") || !d.getText())) try {
									q = d.$.createControlRange();
									q.addElement(d.$);
									q.select();
									return
								} catch (s) {}(h.startContainer.type == CKEDITOR.NODE_ELEMENT && h.startContainer.getName() in b || h.endContainer.type == CKEDITOR.NODE_ELEMENT && h.endContainer.getName() in b) && h.shrink(CKEDITOR.NODE_ELEMENT, true);
								q = h.createBookmark();
								b = q.startNode;
								if (!a) g = q.endNode;
								q = h.document.$.body.createTextRange();
								q.moveToElementText(b.$);
								q.moveStart("character", 1);
								if (g) {
									i = h.document.$.body.createTextRange();
									i.moveToElementText(g.$);
									q.setEndPoint("EndToEnd", i);
									q.moveEnd("character", -1)
								} else {
									o = b.getNext(k);
									n = b.hasAscendant("pre");
									o = !(o && o.getText && o.getText().match(i)) && (n || !b.hasPrevious() || b.getPrevious().is && b.getPrevious().is("br"));
									n = h.document.createElement("span");
									n.setHtml("&#65279;");
									n.insertBefore(b);
									o && h.document.createText("﻿").insertBefore(b)
								}
								h.setStartBefore(b);
								b.remove();
								if (a) {
									if (o) {
										q.moveStart("character", -1);
										q.select();
										h.document.$.selection.clear()
									} else q.select();
									h.moveToPosition(n, CKEDITOR.POSITION_BEFORE_START);
									n.remove()
								} else {
									h.setEndBefore(g);
									g.remove();
									q.select()
								}
							} else {
								g = this.getNative();
								if (!g) return;
								this.removeAllRanges();
								for (q = 0; q < a.length; q++) {
									if (q < a.length - 1) {
										o = a[q];
										n = a[q + 1];
										i = o.clone();
										i.setStart(o.endContainer, o.endOffset);
										i.setEnd(n.startContainer, n.startOffset);
										if (!i.collapsed) {
											i.shrink(CKEDITOR.NODE_ELEMENT, true);
											h = i.getCommonAncestor();
											i = i.getEnclosedNode();
											if (h.isReadOnly() || i &&
												i.isReadOnly()) {
												n.setStart(o.startContainer, o.startOffset);
												a.splice(q--, 1);
												continue
											}
										}
									}
									h = a[q];
									n = this.document.$.createRange();
									if (h.collapsed && CKEDITOR.env.webkit && c(h)) {
										o = this.root;
										f(o, false);
										i = o.getDocument().createText("​");
										o.setCustomData("cke-fillingChar", i);
										h.insertNode(i);
										if ((o = i.getNext()) && !i.getPrevious() && o.type == CKEDITOR.NODE_ELEMENT && o.getName() == "br") {
											f(this.root);
											h.moveToPosition(o, CKEDITOR.POSITION_BEFORE_START)
										} else h.moveToPosition(i, CKEDITOR.POSITION_AFTER_END)
									}
									n.setStart(h.startContainer.$,
										h.startOffset);
									try {
										n.setEnd(h.endContainer.$, h.endOffset)
									} catch (t) {
										if (t.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
											h.collapse(1);
											n.setEnd(h.endContainer.$, h.endOffset)
										} else throw t;
									}
									g.addRange(n)
								}
							}
							this.reset();
							this.root.fire("selectionchange")
						}
					}
			},
			fake: function(a) {
				var b = this.root.editor;
				this.reset();
				i(b);
				var c = this._.cache,
					d = new CKEDITOR.dom.range(this.root);
				d.setStartBefore(a);
				d.setEndAfter(a);
				c.ranges = new CKEDITOR.dom.rangeList(d);
				c.selectedElement = c.startElement = a;
				c.type = CKEDITOR.SELECTION_ELEMENT;
				c.selectedText = c.nativeSel = null;
				this.isFake = 1;
				this.rev = z++;
				b._.fakeSelection = this;
				this.root.fire("selectionchange")
			},
			isHidden: function() {
				var a = this.getCommonAncestor();
				a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent());
				return !(!a || !a.data("cke-hidden-sel"))
			},
			createBookmarks: function(a) {
				a = this.getRanges().createBookmarks(a);
				this.isFake && (a.isFake = 1);
				return a
			},
			createBookmarks2: function(a) {
				a = this.getRanges().createBookmarks2(a);
				this.isFake && (a.isFake = 1);
				return a
			},
			selectBookmarks: function(a) {
				for (var b =
					[], c = 0; c < a.length; c++) {
					var d = new CKEDITOR.dom.range(this.root);
					d.moveToBookmark(a[c]);
					b.push(d)
				}
				a.isFake ? this.fake(b[0].getEnclosedNode()) : this.selectRanges(b);
				return this
			},
			getCommonAncestor: function() {
				var a = this.getRanges();
				return !a.length ? null : a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
			},
			scrollIntoView: function() {
				this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
			},
			removeAllRanges: function() {
				if (this.getType() != CKEDITOR.SELECTION_NONE) {
					var a = this.getNative();
					try {
						a && a[p ? "empty" : "removeAllRanges"]()
					} catch (b) {}
					this.reset()
				}
			}
		}
	})();
	"use strict";
	CKEDITOR.STYLE_BLOCK = 1;
	CKEDITOR.STYLE_INLINE = 2;
	CKEDITOR.STYLE_OBJECT = 3;
	(function() {
		function a(a, b) {
			for (var c, d; a = a.getParent();) {
				if (a.equals(b)) break;
				if (a.getAttribute("data-nostyle")) c = a;
				else if (!d) {
					var e = a.getAttribute("contentEditable");
					e == "false" ? c = a : e == "true" && (d = 1)
				}
			}
			return c
		}

		function e(b) {
			var d = b.document;
			if (b.collapsed) {
				d = z(this, d);
				b.insertNode(d);
				b.moveToPosition(d, CKEDITOR.POSITION_BEFORE_END)
			} else {
				var f = this.element,
					g = this._.definition,
					h, i = g.ignoreReadonly,
					k = i || g.includeReadonly;
				k == void 0 && (k = b.root.getCustomData("cke_includeReadonly"));
				var j = CKEDITOR.dtd[f];
				if (!j) {
					h = true;
					j = CKEDITOR.dtd.span
				}
				b.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
				b.trim();
				var o = b.createBookmark(),
					l = o.startNode,
					m = o.endNode,
					n = l,
					p;
				if (!i) {
					var q = b.getCommonAncestor(),
						i = a(l, q),
						q = a(m, q);
					i && (n = i.getNextSourceNode(true));
					q && (m = q)
				}
				for (n.getPosition(m) == CKEDITOR.POSITION_FOLLOWING && (n = 0); n;) {
					i = false;
					if (n.equals(m)) {
						n = null;
						i = true
					} else {
						var s = n.type == CKEDITOR.NODE_ELEMENT ? n.getName() : null,
							q = s && n.getAttribute("contentEditable") == "false",
							r = s && n.getAttribute("data-nostyle");
						if (s && n.data("cke-bookmark")) {
							n =
								n.getNextSourceNode(true);
							continue
						}
						if (q && k && CKEDITOR.dtd.$block[s])
							for (var v = n, A = c(v), C = void 0, H = A.length, P = 0, v = H && new CKEDITOR.dom.range(v.getDocument()); P < H; ++P) {
								var C = A[P],
									U = CKEDITOR.filter.instances[C.data("cke-filter")];
								if (U ? U.check(this) : 1) {
									v.selectNodeContents(C);
									e.call(this, v)
								}
							}
						A = s ? !j[s] || r ? 0 : q && !k ? 0 : (n.getPosition(m) | J) == J && (!g.childRule || g.childRule(n)) : 1;
						if (A)
							if ((A = n.getParent()) && ((A.getDtd() || CKEDITOR.dtd.span)[f] || h) && (!g.parentRule || g.parentRule(A))) {
								if (!p && (!s || !CKEDITOR.dtd.$removeEmpty[s] ||
									(n.getPosition(m) | J) == J)) {
									p = b.clone();
									p.setStartBefore(n)
								}
								s = n.type;
								if (s == CKEDITOR.NODE_TEXT || q || s == CKEDITOR.NODE_ELEMENT && !n.getChildCount()) {
									for (var s = n, L;
										(i = !s.getNext(G)) && (L = s.getParent(), j[L.getName()]) && (L.getPosition(l) | F) == F && (!g.childRule || g.childRule(L));) s = L;
									p.setEndAfter(s)
								}
							} else i = true;
						else i = true;
						n = n.getNextSourceNode(r || q)
					} if (i && p && !p.collapsed) {
						for (var i = z(this, d), q = i.hasAttributes(), r = p.getCommonAncestor(), s = {}, A = {}, C = {}, H = {}, V, R, Y; i && r;) {
							if (r.getName() == f) {
								for (V in g.attributes)
									if (!H[V] &&
										(Y = r.getAttribute(R))) i.getAttribute(V) == Y ? A[V] = 1 : H[V] = 1;
								for (R in g.styles)
									if (!C[R] && (Y = r.getStyle(R))) i.getStyle(R) == Y ? s[R] = 1 : C[R] = 1
							}
							r = r.getParent()
						}
						for (V in A) i.removeAttribute(V);
						for (R in s) i.removeStyle(R);
						q && !i.hasAttributes() && (i = null);
						if (i) {
							p.extractContents().appendTo(i);
							p.insertNode(i);
							u.call(this, i);
							i.mergeSiblings();
							CKEDITOR.env.ie || i.$.normalize()
						} else {
							i = new CKEDITOR.dom.element("span");
							p.extractContents().appendTo(i);
							p.insertNode(i);
							u.call(this, i);
							i.remove(true)
						}
						p = null
					}
				}
				b.moveToBookmark(o);
				b.shrink(CKEDITOR.SHRINK_TEXT);
				b.shrink(CKEDITOR.NODE_ELEMENT, true)
			}
		}

		function b(a) {
			function b() {
				for (var a = new CKEDITOR.dom.elementPath(d.getParent()), c = new CKEDITOR.dom.elementPath(o.getParent()), e = null, f = null, g = 0; g < a.elements.length; g++) {
					var h = a.elements[g];
					if (h == a.block || h == a.blockLimit) break;
					l.checkElementRemovable(h) && (e = h)
				}
				for (g = 0; g < c.elements.length; g++) {
					h = c.elements[g];
					if (h == c.block || h == c.blockLimit) break;
					l.checkElementRemovable(h) && (f = h)
				}
				f && o.breakParent(f);
				e && d.breakParent(e)
			}
			a.enlarge(CKEDITOR.ENLARGE_INLINE,
				1);
			var c = a.createBookmark(),
				d = c.startNode;
			if (a.collapsed) {
				for (var e = new CKEDITOR.dom.elementPath(d.getParent(), a.root), f, h = 0, i; h < e.elements.length && (i = e.elements[h]); h++) {
					if (i == e.block || i == e.blockLimit) break;
					if (this.checkElementRemovable(i)) {
						var k;
						if (a.collapsed && (a.checkBoundaryOfElement(i, CKEDITOR.END) || (k = a.checkBoundaryOfElement(i, CKEDITOR.START)))) {
							f = i;
							f.match = k ? "start" : "end"
						} else {
							i.mergeSiblings();
							i.is(this.element) ? q.call(this, i) : g(i, j(this)[i.getName()])
						}
					}
				}
				if (f) {
					i = d;
					for (h = 0;; h++) {
						k = e.elements[h];
						if (k.equals(f)) break;
						else if (k.match) continue;
						else k = k.clone();
						k.append(i);
						i = k
					}
					i[f.match == "start" ? "insertBefore" : "insertAfter"](f)
				}
			} else {
				var o = c.endNode,
					l = this;
				b();
				for (e = d; !e.equals(o);) {
					f = e.getNextSourceNode();
					if (e.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(e)) {
						e.getName() == this.element ? q.call(this, e) : g(e, j(this)[e.getName()]);
						if (f.type == CKEDITOR.NODE_ELEMENT && f.contains(d)) {
							b();
							f = d.getNext()
						}
					}
					e = f
				}
			}
			a.moveToBookmark(c);
			a.shrink(CKEDITOR.NODE_ELEMENT, true)
		}

		function c(a) {
			var b = [];
			a.forEach(function(a) {
				if (a.getAttribute("contenteditable") ==
					"true") {
					b.push(a);
					return false
				}
			}, CKEDITOR.NODE_ELEMENT, true);
			return b
		}

		function d(a) {
			var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
			(a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && A(a, this)
		}

		function f(a) {
			var b = a.getCommonAncestor(true, true);
			if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
				var b = this._.definition,
					c = b.attributes;
				if (c)
					for (var d in c) a.removeAttribute(d, c[d]);
				if (b.styles)
					for (var e in b.styles) b.styles.hasOwnProperty(e) &&
						a.removeStyle(e)
			}
		}

		function h(a) {
			var b = a.createBookmark(true),
				c = a.createIterator();
			c.enforceRealBlocks = true;
			if (this._.enterMode) c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
			for (var d, e = a.document, f; d = c.getNextParagraph();)
				if (!d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1)) {
					f = z(this, e, d);
					i(d, f)
				}
			a.moveToBookmark(b)
		}

		function n(a) {
			var b = a.createBookmark(1),
				c = a.createIterator();
			c.enforceRealBlocks = true;
			c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
			for (var d, e; d = c.getNextParagraph();)
				if (this.checkElementRemovable(d))
					if (d.is("pre")) {
						(e =
							this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && d.copyAttributes(e);
						i(d, e)
					} else q.call(this, d);
			a.moveToBookmark(b)
		}

		function i(a, b) {
			var c = !b;
			if (c) {
				b = a.getDocument().createElement("div");
				a.copyAttributes(b)
			}
			var d = b && b.is("pre"),
				e = a.is("pre"),
				f = !d && e;
			if (d && !e) {
				e = b;
				(f = a.getBogus()) && f.remove();
				f = a.getHtml();
				f = o(f, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
				f = f.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
				f = f.replace(/([ \t\n\r]+|&nbsp;)/g,
					" ");
				f = f.replace(/<br\b[^>]*>/gi, "\n");
				if (CKEDITOR.env.ie) {
					var g = a.getDocument().createElement("div");
					g.append(e);
					e.$.outerHTML = "<pre>" + f + "</pre>";
					e.copyAttributes(g.getFirst());
					e = g.getFirst().remove()
				} else e.setHtml(f);
				b = e
			} else f ? b = s(c ? [a.getHtml()] : k(a), b) : a.moveChildren(b);
			b.replace(a);
			if (d) {
				var c = b,
					h;
				if ((h = c.getPrevious(C)) && h.type == CKEDITOR.NODE_ELEMENT && h.is("pre")) {
					d = o(h.getHtml(), /\n$/, "") + "\n\n" + o(c.getHtml(), /^\n/, "");
					CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + d + "</pre>" : c.setHtml(d);
					h.remove()
				}
			} else c &&
				p(b)
		}

		function k(a) {
			a.getName();
			var b = [];
			o(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, c) {
				return b + "</pre>" + c + "<pre>"
			}).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, c) {
				b.push(c)
			});
			return b
		}

		function o(a, b, c) {
			var d = "",
				e = "",
				a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(a, b, c) {
					b && (d = b);
					c && (e = c);
					return ""
				});
			return d + a.replace(b, c) + e
		}

		function s(a, b) {
			var c;
			a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
			for (var d = 0; d < a.length; d++) {
				var e = a[d],
					e = e.replace(/(\r\n|\r)/g, "\n"),
					e = o(e, /^[ \t]*\n/, ""),
					e = o(e, /\n$/, ""),
					e = o(e, /^[ \t]+|[ \t]+$/g, function(a, b) {
						return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
					}),
					e = e.replace(/\n/g, "<br>"),
					e = e.replace(/[ \t]{2,}/g, function(a) {
						return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
					});
				if (c) {
					var f = b.clone();
					f.setHtml(e);
					c.append(f)
				} else b.setHtml(e)
			}
			return c || b
		}

		function q(a, b) {
			var c = this._.definition,
				d = c.attributes,
				c = c.styles,
				e = j(this)[a.getName()],
				f = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(c),
				h;
			for (h in d)
				if (!((h == "class" || this._.definition.fullMatch) && a.getAttribute(h) != l(h, d[h])) && !(b && h.slice(0, 5) == "data-")) {
					f = a.hasAttribute(h);
					a.removeAttribute(h)
				}
			for (var i in c)
				if (!(this._.definition.fullMatch && a.getStyle(i) != l(i, c[i], true))) {
					f = f || !!a.getStyle(i);
					a.removeStyle(i)
				}
			g(a, e, P[a.getName()]);
			f && (this._.definition.alwaysRemoveElement ? p(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode ==
				CKEDITOR.ENTER_BR && !a.hasAttributes() ? p(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
		}

		function u(a) {
			for (var b = j(this), c = a.getElementsByTag(this.element), d, e = c.count(); --e >= 0;) {
				d = c.getItem(e);
				d.isReadOnly() || q.call(this, d, true)
			}
			for (var f in b)
				if (f != this.element) {
					c = a.getElementsByTag(f);
					for (e = c.count() - 1; e >= 0; e--) {
						d = c.getItem(e);
						d.isReadOnly() || g(d, b[f])
					}
				}
		}

		function g(a, b, c) {
			if (b = b && b.attributes)
				for (var d = 0; d < b.length; d++) {
					var e = b[d][0],
						f;
					if (f = a.getAttribute(e)) {
						var g = b[d][1];
						(g === null ||
							g.test && g.test(f) || typeof g == "string" && f == g) && a.removeAttribute(e)
					}
				}
			c || p(a)
		}

		function p(a, b) {
			if (!a.hasAttributes() || b)
				if (CKEDITOR.dtd.$block[a.getName()]) {
					var c = a.getPrevious(C),
						d = a.getNext(C);
					c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({
						br: 1
					})) && a.append("br", 1);
					d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({
						br: 1
					})) && a.append("br");
					a.remove(true)
				} else {
					c = a.getFirst();
					d = a.getLast();
					a.remove(true);
					if (c) {
						c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings();
						d && (!c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT) &&
							d.mergeSiblings()
					}
				}
		}

		function z(a, b, c) {
			var d;
			d = a.element;
			d == "*" && (d = "span");
			d = new CKEDITOR.dom.element(d, b);
			c && c.copyAttributes(d);
			d = A(d, a);
			b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
			return d
		}

		function A(a, b) {
			var c = b._.definition,
				d = c.attributes,
				c = CKEDITOR.style.getStyleText(c);
			if (d)
				for (var e in d) a.setAttribute(e, d[e]);
			c && a.setAttribute("style", c);
			return a
		}

		function m(a, b) {
			for (var c in a) a[c] = a[c].replace(H, function(a,
				c) {
				return b[c]
			})
		}

		function j(a) {
			if (a._.overrides) return a._.overrides;
			var b = a._.overrides = {},
				c = a._.definition.overrides;
			if (c) {
				CKEDITOR.tools.isArray(c) || (c = [c]);
				for (var d = 0; d < c.length; d++) {
					var e = c[d],
						f, g;
					if (typeof e == "string") f = e.toLowerCase();
					else {
						f = e.element ? e.element.toLowerCase() : a.element;
						g = e.attributes
					}
					e = b[f] || (b[f] = {});
					if (g) {
						var e = e.attributes = e.attributes || [],
							h;
						for (h in g) e.push([h.toLowerCase(), g[h]])
					}
				}
			}
			return b
		}

		function l(a, b, c) {
			var d = new CKEDITOR.dom.element("span");
			d[c ? "setStyle" : "setAttribute"](a,
				b);
			return d[c ? "getStyle" : "getAttribute"](a)
		}

		function v(a, b, c) {
			for (var d = a.document, e = a.getRanges(), b = b ? this.removeFromRange : this.applyToRange, f, g = e.createIterator(); f = g.getNextRange();) b.call(this, f, c);
			a.selectRanges(e);
			d.removeCustomData("doc_processing_style")
		}
		var P = {
				address: 1,
				div: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				p: 1,
				pre: 1,
				section: 1,
				header: 1,
				footer: 1,
				nav: 1,
				article: 1,
				aside: 1,
				figure: 1,
				dialog: 1,
				hgroup: 1,
				time: 1,
				meter: 1,
				menu: 1,
				command: 1,
				keygen: 1,
				output: 1,
				progress: 1,
				details: 1,
				datagrid: 1,
				datalist: 1
			},
			r = {
				a: 1,
				embed: 1,
				hr: 1,
				img: 1,
				li: 1,
				object: 1,
				ol: 1,
				table: 1,
				td: 1,
				tr: 1,
				th: 1,
				ul: 1,
				dl: 1,
				dt: 1,
				dd: 1,
				form: 1,
				audio: 1,
				video: 1
			},
			L = /\s*(?:;\s*|$)/,
			H = /#\((.+?)\)/g,
			G = CKEDITOR.dom.walker.bookmark(0, 1),
			C = CKEDITOR.dom.walker.whitespaces(1);
		CKEDITOR.style = function(a, b) {
			if (typeof a.type == "string") return new CKEDITOR.style.customHandlers[a.type](a);
			var c = a.attributes;
			if (c && c.style) {
				a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
				delete c.style
			}
			if (b) {
				a = CKEDITOR.tools.clone(a);
				m(a.attributes,
					b);
				m(a.styles, b)
			}
			c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
			this.type = a.type || (P[c] ? CKEDITOR.STYLE_BLOCK : r[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
			if (typeof this.element == "object") this.type = CKEDITOR.STYLE_OBJECT;
			this._ = {
				definition: a
			}
		};
		CKEDITOR.style.prototype = {
			apply: function(a) {
				if (a instanceof CKEDITOR.dom.document) return v.call(this, a.getSelection());
				if (this.checkApplicable(a.elementPath(), a)) {
					var b = this._.enterMode;
					if (!b) this._.enterMode = a.activeEnterMode;
					v.call(this, a.getSelection(), 0, a);
					this._.enterMode = b
				}
			},
			remove: function(a) {
				if (a instanceof CKEDITOR.dom.document) return v.call(this, a.getSelection(), 1);
				if (this.checkApplicable(a.elementPath(), a)) {
					var b = this._.enterMode;
					if (!b) this._.enterMode = a.activeEnterMode;
					v.call(this, a.getSelection(), 1, a);
					this._.enterMode = b
				}
			},
			applyToRange: function(a) {
				this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? e : this.type == CKEDITOR.STYLE_BLOCK ? h : this.type == CKEDITOR.STYLE_OBJECT ? d : null;
				return this.applyToRange(a)
			},
			removeFromRange: function(a) {
				this.removeFromRange =
					this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? n : this.type == CKEDITOR.STYLE_OBJECT ? f : null;
				return this.removeFromRange(a)
			},
			applyToObject: function(a) {
				A(a, this)
			},
			checkActive: function(a, b) {
				switch (this.type) {
					case CKEDITOR.STYLE_BLOCK:
						return this.checkElementRemovable(a.block || a.blockLimit, true, b);
					case CKEDITOR.STYLE_OBJECT:
					case CKEDITOR.STYLE_INLINE:
						for (var c = a.elements, d = 0, e; d < c.length; d++) {
							e = c[d];
							if (!(this.type == CKEDITOR.STYLE_INLINE && (e == a.block || e == a.blockLimit))) {
								if (this.type ==
									CKEDITOR.STYLE_OBJECT) {
									var f = e.getName();
									if (!(typeof this.element == "string" ? f == this.element : f in this.element)) continue
								}
								if (this.checkElementRemovable(e, true, b)) return true
							}
						}
				}
				return false
			},
			checkApplicable: function(a, b, c) {
				b && b instanceof CKEDITOR.filter && (c = b);
				if (c && !c.check(this)) return false;
				switch (this.type) {
					case CKEDITOR.STYLE_OBJECT:
						return !!a.contains(this.element);
					case CKEDITOR.STYLE_BLOCK:
						return !!a.blockLimit.getDtd()[this.element]
				}
				return true
			},
			checkElementMatch: function(a, b) {
				var c = this._.definition;
				if (!a || !c.ignoreReadonly && a.isReadOnly()) return false;
				var d = a.getName();
				if (typeof this.element == "string" ? d == this.element : d in this.element) {
					if (!b && !a.hasAttributes()) return true;
					if (d = c._AC) c = d;
					else {
						var d = {},
							e = 0,
							f = c.attributes;
						if (f)
							for (var g in f) {
								e++;
								d[g] = f[g]
							}
						if (g = CKEDITOR.style.getStyleText(c)) {
							d.style || e++;
							d.style = g
						}
						d._length = e;
						c = c._AC = d
					} if (c._length) {
						for (var h in c)
							if (h != "_length") {
								e = a.getAttribute(h) || "";
								if (h == "style") a: {
									d = c[h];
									typeof d == "string" && (d = CKEDITOR.tools.parseCssText(d));
									typeof e ==
										"string" && (e = CKEDITOR.tools.parseCssText(e, true));
									g = void 0;
									for (g in d)
										if (!(g in e && (e[g] == d[g] || d[g] == "inherit" || e[g] == "inherit"))) {
											d = false;
											break a
										}
									d = true
								} else d = c[h] == e;
								if (d) {
									if (!b) return true
								} else if (b) return false
							}
						if (b) return true
					} else return true
				}
				return false
			},
			checkElementRemovable: function(a, b, c) {
				if (this.checkElementMatch(a, b, c)) return true;
				if (b = j(this)[a.getName()]) {
					var d;
					if (!(b = b.attributes)) return true;
					for (c = 0; c < b.length; c++) {
						d = b[c][0];
						if (d = a.getAttribute(d)) {
							var e = b[c][1];
							if (e === null || typeof e ==
								"string" && d == e || e.test(d)) return true
						}
					}
				}
				return false
			},
			buildPreview: function(a) {
				var b = this._.definition,
					c = [],
					d = b.element;
				d == "bdo" && (d = "span");
				var c = ["<", d],
					e = b.attributes;
				if (e)
					for (var f in e) c.push(" ", f, '="', e[f], '"');
				(e = CKEDITOR.style.getStyleText(b)) && c.push(' style="', e, '"');
				c.push(">", a || b.name, "</", d, ">");
				return c.join("")
			},
			getDefinition: function() {
				return this._.definition
			}
		};
		CKEDITOR.style.getStyleText = function(a) {
			var b = a._ST;
			if (b) return b;
			var b = a.styles,
				c = a.attributes && a.attributes.style || "",
				d = "";
			c.length && (c = c.replace(L, ";"));
			for (var e in b) {
				var f = b[e],
					g = (e + ":" + f).replace(L, ";");
				f == "inherit" ? d = d + g : c = c + g
			}
			c.length && (c = CKEDITOR.tools.normalizeCssText(c, true));
			return a._ST = c + d
		};
		CKEDITOR.style.customHandlers = {};
		CKEDITOR.style.addCustomHandler = function(a) {
			var b = function(a) {
				this._ = {
					definition: a
				};
				this.setup && this.setup(a)
			};
			b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {
				assignedTo: CKEDITOR.STYLE_OBJECT
			}, a, true);
			return this.customHandlers[a.type] = b
		};
		var J = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
			F = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
	})();
	CKEDITOR.styleCommand = function(a, e) {
		this.requiredContent = this.allowedContent = this.style = a;
		CKEDITOR.tools.extend(this, e, true)
	};
	CKEDITOR.styleCommand.prototype.exec = function(a) {
		a.focus();
		this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style)
	};
	CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
	CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
	CKEDITOR.loadStylesSet = function(a, e, b) {
		CKEDITOR.stylesSet.addExternal(a, e, "");
		CKEDITOR.stylesSet.load(a, b)
	};
	CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
		attachStyleStateChange: function(a, e) {
			var b = this._.styleStateChangeCallbacks;
			if (!b) {
				b = this._.styleStateChangeCallbacks = [];
				this.on("selectionChange", function(a) {
					for (var d = 0; d < b.length; d++) {
						var e = b[d],
							h = e.style.checkActive(a.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						e.fn.call(this, h)
					}
				})
			}
			b.push({
				style: a,
				fn: e
			})
		},
		applyStyle: function(a) {
			a.apply(this)
		},
		removeStyle: function(a) {
			a.remove(this)
		},
		getStylesSet: function(a) {
			if (this._.stylesDefinitions) a(this._.stylesDefinitions);
			else {
				var e = this,
					b = e.config.stylesCombo_stylesSet || e.config.stylesSet;
				if (b === false) a(null);
				else if (b instanceof Array) {
					e._.stylesDefinitions = b;
					a(b)
				} else {
					b || (b = "default");
					var b = b.split(":"),
						c = b[0];
					CKEDITOR.stylesSet.addExternal(c, b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
					CKEDITOR.stylesSet.load(c, function(b) {
						e._.stylesDefinitions = b[c];
						a(e._.stylesDefinitions)
					})
				}
			}
		}
	});
	CKEDITOR.dom.comment = function(a, e) {
		typeof a == "string" && (a = (e ? e.$ : document).createComment(a));
		CKEDITOR.dom.domObject.call(this, a)
	};
	CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node;
	CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
		type: CKEDITOR.NODE_COMMENT,
		getOuterHtml: function() {
			return "<\!--" + this.$.nodeValue + "--\>"
		}
	});
	"use strict";
	(function() {
		var a = {},
			e = {},
			b;
		for (b in CKEDITOR.dtd.$blockLimit) b in CKEDITOR.dtd.$list || (a[b] = 1);
		for (b in CKEDITOR.dtd.$block) b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (e[b] = 1);
		CKEDITOR.dom.elementPath = function(b, d) {
			var f = null,
				h = null,
				n = [],
				i = b,
				k, d = d || b.getDocument().getBody();
			do
				if (i.type == CKEDITOR.NODE_ELEMENT) {
					n.push(i);
					if (!this.lastElement) {
						this.lastElement = i;
						if (i.is(CKEDITOR.dtd.$object) || i.getAttribute("contenteditable") == "false") continue
					}
					if (i.equals(d)) break;
					if (!h) {
						k = i.getName();
						i.getAttribute("contenteditable") == "true" ? h = i : !f && e[k] && (f = i);
						if (a[k]) {
							var o;
							if (o = !f) {
								if (k = k == "div") {
									a: {
										k = i.getChildren();
										o = 0;
										for (var s = k.count(); o < s; o++) {
											var q = k.getItem(o);
											if (q.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[q.getName()]) {
												k = true;
												break a
											}
										}
										k = false
									}
									k = !k
								}
								o = k
							}
							o ? f = i : h = i
						}
					}
				}
			while (i = i.getParent());
			h || (h = d);
			this.block = f;
			this.blockLimit = h;
			this.root = d;
			this.elements = n
		}
	})();
	CKEDITOR.dom.elementPath.prototype = {
		compare: function(a) {
			var e = this.elements,
				a = a && a.elements;
			if (!a || e.length != a.length) return false;
			for (var b = 0; b < e.length; b++)
				if (!e[b].equals(a[b])) return false;
			return true
		},
		contains: function(a, e, b) {
			var c;
			typeof a == "string" && (c = function(b) {
				return b.getName() == a
			});
			a instanceof CKEDITOR.dom.element ? c = function(b) {
				return b.equals(a)
			} : CKEDITOR.tools.isArray(a) ? c = function(b) {
				return CKEDITOR.tools.indexOf(a, b.getName()) > -1
			} : typeof a == "function" ? c = a : typeof a == "object" && (c =
				function(b) {
					return b.getName() in a
				});
			var d = this.elements,
				f = d.length;
			e && f--;
			if (b) {
				d = Array.prototype.slice.call(d, 0);
				d.reverse()
			}
			for (e = 0; e < f; e++)
				if (c(d[e])) return d[e];
			return null
		},
		isContextFor: function(a) {
			var e;
			if (a in CKEDITOR.dtd.$block) {
				e = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
				return !!e.getDtd()[a]
			}
			return true
		},
		direction: function() {
			return (this.block || this.blockLimit || this.root).getDirection(1)
		}
	};
	CKEDITOR.dom.text = function(a, e) {
		typeof a == "string" && (a = (e ? e.$ : document).createTextNode(a));
		this.$ = a
	};
	CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node;
	CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
		type: CKEDITOR.NODE_TEXT,
		getLength: function() {
			return this.$.nodeValue.length
		},
		getText: function() {
			return this.$.nodeValue
		},
		setText: function(a) {
			this.$.nodeValue = a
		},
		split: function(a) {
			var e = this.$.parentNode,
				b = e.childNodes.length,
				c = this.getLength(),
				d = this.getDocument(),
				f = new CKEDITOR.dom.text(this.$.splitText(a), d);
			if (e.childNodes.length == b)
				if (a >= c) {
					f = d.createText("");
					f.insertAfter(this)
				} else {
					a = d.createText("");
					a.insertAfter(f);
					a.remove()
				}
			return f
		},
		substring: function(a,
			e) {
			return typeof e != "number" ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, e)
		}
	});
	(function() {
		function a(a, c, d) {
			var e = a.serializable,
				h = c[d ? "endContainer" : "startContainer"],
				n = d ? "endOffset" : "startOffset",
				i = e ? c.document.getById(a.startNode) : a.startNode,
				a = e ? c.document.getById(a.endNode) : a.endNode;
			if (h.equals(i.getPrevious())) {
				c.startOffset = c.startOffset - h.getLength() - a.getPrevious().getLength();
				h = a.getNext()
			} else if (h.equals(a.getPrevious())) {
				c.startOffset = c.startOffset - h.getLength();
				h = a.getNext()
			}
			h.equals(i.getParent()) && c[n]++;
			h.equals(a.getParent()) && c[n]++;
			c[d ? "endContainer" : "startContainer"] =
				h;
			return c
		}
		CKEDITOR.dom.rangeList = function(a) {
			if (a instanceof CKEDITOR.dom.rangeList) return a;
			a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
			return CKEDITOR.tools.extend(a, e)
		};
		var e = {
			createIterator: function() {
				var a = this,
					c = CKEDITOR.dom.walker.bookmark(),
					d = [],
					e;
				return {
					getNextRange: function(h) {
						e = e == void 0 ? 0 : e + 1;
						var n = a[e];
						if (n && a.length > 1) {
							if (!e)
								for (var i = a.length - 1; i >= 0; i--) d.unshift(a[i].createBookmark(true));
							if (h)
								for (var k = 0; a[e + k + 1];) {
									for (var o = n.document, h = 0, i = o.getById(d[k].endNode), o = o.getById(d[k +
										1].startNode);;) {
										i = i.getNextSourceNode(false);
										if (o.equals(i)) h = 1;
										else if (c(i) || i.type == CKEDITOR.NODE_ELEMENT && i.isBlockBoundary()) continue;
										break
									}
									if (!h) break;
									k++
								}
							for (n.moveToBookmark(d.shift()); k--;) {
								i = a[++e];
								i.moveToBookmark(d.shift());
								n.setEnd(i.endContainer, i.endOffset)
							}
						}
						return n
					}
				}
			},
			createBookmarks: function(b) {
				for (var c = [], d, e = 0; e < this.length; e++) {
					c.push(d = this[e].createBookmark(b, true));
					for (var h = e + 1; h < this.length; h++) {
						this[h] = a(d, this[h]);
						this[h] = a(d, this[h], true)
					}
				}
				return c
			},
			createBookmarks2: function(a) {
				for (var c =
					[], d = 0; d < this.length; d++) c.push(this[d].createBookmark2(a));
				return c
			},
			moveToBookmarks: function(a) {
				for (var c = 0; c < this.length; c++) this[c].moveToBookmark(a[c])
			}
		}
	})();
	(function() {
		function a() {
			return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
		}

		function e(b) {
			var c = CKEDITOR.skin["ua_" + b],
				d = CKEDITOR.env;
			if (c)
				for (var c = c.split(",").sort(function(a, b) {
					return a > b ? -1 : 1
				}), e = 0, f; e < c.length; e++) {
					f = c[e];
					if (d.ie && (f.replace(/^ie/, "") == d.version || d.quirks && f == "iequirks")) f = "ie";
					if (d[f]) {
						b = b + ("_" + c[e]);
						break
					}
				}
			return CKEDITOR.getUrl(a() + b + ".css")
		}

		function b(a, b) {
			if (!f[a]) {
				CKEDITOR.document.appendStyleSheet(e(a));
				f[a] = 1
			}
			b && b()
		}

		function c(a) {
			var b = a.getById(h);
			if (!b) {
				b = a.getHead().append("style");
				b.setAttribute("id", h);
				b.setAttribute("type", "text/css")
			}
			return b
		}

		function d(a, b, c) {
			var d, e, f;
			if (CKEDITOR.env.webkit) {
				b = b.split("}").slice(0, -1);
				for (e = 0; e < b.length; e++) b[e] = b[e].split("{")
			}
			for (var h = 0; h < a.length; h++)
				if (CKEDITOR.env.webkit)
					for (e = 0; e < b.length; e++) {
						f = b[e][1];
						for (d = 0; d < c.length; d++) f = f.replace(c[d][0], c[d][1]);
						a[h].$.sheet.addRule(b[e][0], f)
					} else {
						f = b;
						for (d = 0; d < c.length; d++) f = f.replace(c[d][0], c[d][1]);
						CKEDITOR.env.ie &&
							CKEDITOR.env.version < 11 ? a[h].$.styleSheet.cssText = a[h].$.styleSheet.cssText + f : a[h].$.innerHTML = a[h].$.innerHTML + f
					}
		}
		var f = {};
		CKEDITOR.skin = {
			path: a,
			loadPart: function(c, d) {
				CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function() {
					b(c, d)
				}) : b(c, d)
			},
			getPath: function(a) {
				return CKEDITOR.getUrl(e(a))
			},
			icons: {},
			addIcon: function(a, b, c, d) {
				a = a.toLowerCase();
				this.icons[a] || (this.icons[a] = {
					path: b,
					offset: c || 0,
					bgsize: d || "16px"
				})
			},
			getIconStyle: function(a,
				b, c, d, e) {
				var f;
				if (a) {
					a = a.toLowerCase();
					b && (f = this.icons[a + "-rtl"]);
					f || (f = this.icons[a])
				}
				a = c || f && f.path || "";
				d = d || f && f.offset;
				e = e || f && f.bgsize || "16px";
				return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;background-size:" + e + ";"
			}
		};
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			getUiColor: function() {
				return this.uiColor
			},
			setUiColor: function(a) {
				var b = c(CKEDITOR.document);
				return (this.setUiColor = function(a) {
					var c = CKEDITOR.skin.chameleon,
						e = [
							[i, a]
						];
					this.uiColor = a;
					d([b], c(this,
						"editor"), e);
					d(n, c(this, "panel"), e)
				}).call(this, a)
			}
		});
		var h = "cke_ui_color",
			n = [],
			i = /\$color/g;
		CKEDITOR.on("instanceLoaded", function(a) {
			if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
				var b = a.editor,
					a = function(a) {
						a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
						if (!a.getById("cke_ui_color")) {
							a = c(a);
							n.push(a);
							var e = b.getUiColor();
							e && d([a], CKEDITOR.skin.chameleon(b, "panel"), [
								[i, e]
							])
						}
					};
				b.on("panelShow", a);
				b.on("menuShow", a);
				b.config.uiColor && b.setUiColor(b.config.uiColor)
			}
		})
	})();
	(function() {
		if (CKEDITOR.env.webkit) CKEDITOR.env.hc = false;
		else {
			var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
			a.appendTo(CKEDITOR.document.getHead());
			try {
				var e = a.getComputedStyle("border-top-color"),
					b = a.getComputedStyle("border-right-color");
				CKEDITOR.env.hc = !!(e && e == b)
			} catch (c) {
				CKEDITOR.env.hc = false
			}
			a.remove()
		} if (CKEDITOR.env.hc) CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
		CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
		CKEDITOR.status = "loaded";
		CKEDITOR.fireOnce("loaded");
		if (a = CKEDITOR._.pending) {
			delete CKEDITOR._.pending;
			for (e = 0; e < a.length; e++) {
				CKEDITOR.editor.prototype.constructor.apply(a[e][0], a[e][1]);
				CKEDITOR.add(a[e][0])
			}
		}
	})();
	/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
	CKEDITOR.skin.name = "moono";
	CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
	CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8";
	CKEDITOR.skin.chameleon = function() {
		var b = function() {
				return function(b, e) {
					for (var a = b.match(/[^#]./g), c = 0; 3 > c; c++) {
						var f = a,
							h = c,
							d;
						d = parseInt(a[c], 16);
						d = ("0" + (0 > e ? 0 | d * (1 + e) : 0 | d + (255 - d) * e).toString(16)).slice(-2);
						f[h] = d
					}
					return "#" + a.join("")
				}
			}(),
			c = function() {
				var b = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
				return function(c,
					a) {
					return b.output({
						from: c,
						to: a
					})
				}
			}(),
			f = {
				editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
				panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
			};
		return function(g, e) {
			var a = g.uiColor,
				a = {
					id: "." + g.id,
					defaultBorder: b(a, -0.1),
					defaultGradient: c(b(a, 0.9), a),
					lightGradient: c(b(a, 1), b(a, 0.7)),
					mediumGradient: c(b(a, 0.8), b(a, 0.5)),
					ckeButtonOn: c(b(a, 0.6), b(a, 0.7)),
					ckeResizer: b(a, -0.4),
					ckeToolbarSeparator: b(a, 0.5),
					ckeColorauto: b(a, 0.8),
					dialogBody: b(a, 0.7),
					dialogTabSelected: c("#FFFFFF", "#FFFFFF"),
					dialogTabSelectedBorder: "#FFF",
					elementsPathColor: b(a, -0.6),
					elementsPathBg: a,
					menubuttonIcon: b(a, 0.5),
					menubuttonIconHover: b(a, 0.3)
				};
			return f[e].output(a).replace(/\[/g,
				"{").replace(/\]/g, "}")
		}
	}();
	CKEDITOR.plugins.add("dialogui", {
		onLoad: function() {
			var i = function(b) {
					this._ || (this._ = {});
					this._["default"] = this._.initValue = b["default"] || "";
					this._.required = b.required || !1;
					for (var a = [this._], d = 1; d < arguments.length; d++) a.push(arguments[d]);
					a.push(!0);
					CKEDITOR.tools.extend.apply(CKEDITOR.tools, a);
					return this._
				},
				r = {
					build: function(b, a, d) {
						return new CKEDITOR.ui.dialog.textInput(b, a, d)
					}
				},
				l = {
					build: function(b, a, d) {
						return new CKEDITOR.ui.dialog[a.type](b, a, d)
					}
				},
				n = {
					isChanged: function() {
						return this.getValue() !=
							this.getInitValue()
					},
					reset: function(b) {
						this.setValue(this.getInitValue(), b)
					},
					setInitValue: function() {
						this._.initValue = this.getValue()
					},
					resetInitValue: function() {
						this._.initValue = this._["default"]
					},
					getInitValue: function() {
						return this._.initValue
					}
				},
				o = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
					onChange: function(b, a) {
						this._.domOnChangeRegistered || (b.on("load", function() {
							this.getInputElement().on("change", function() {
									b.parts.dialog.isVisible() && this.fire("change", {
										value: this.getValue()
									})
								},
								this)
						}, this), this._.domOnChangeRegistered = !0);
						this.on("change", a)
					}
				}, !0),
				s = /^on([A-Z]\w+)/,
				p = function(b) {
					for (var a in b)(s.test(a) || "title" == a || "type" == a) && delete b[a];
					return b
				};
			CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
				labeledElement: function(b, a, d, e) {
					if (!(4 > arguments.length)) {
						var c = i.call(this, a);
						c.labelId = CKEDITOR.tools.getNextId() + "_label";
						this._.children = [];
						CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "div", null, {
							role: "presentation"
						}, function() {
							var f = [],
								d = a.required ? " cke_required" : "";
							"horizontal" !=
								a.labelLayout ? f.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + c.labelId + '"', c.inputId ? ' for="' + c.inputId + '"' : "", (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", a.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', a.controlStyle ? ' style="' + a.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + c.labelId + '">', e.call(this, b, a), "</div>") : (d = {
									type: "hbox",
									widths: a.widths,
									padding: 0,
									children: [{
										type: "html",
										html: '<label class="cke_dialog_ui_labeled_label' + d + '" id="' + c.labelId +
											'" for="' + c.inputId + '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(a.label) + "</span>"
									}, {
										type: "html",
										html: '<span class="cke_dialog_ui_labeled_content"' + (a.controlStyle ? ' style="' + a.controlStyle + '"' : "") + ">" + e.call(this, b, a) + "</span>"
									}]
								}, CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, f));
							return f.join("")
						})
					}
				},
				textInput: function(b, a, d) {
					if (!(3 > arguments.length)) {
						i.call(this, a);
						var e = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput",
							c = {
								"class": "cke_dialog_ui_input_" +
									a.type,
								id: e,
								type: a.type
							};
						a.validate && (this.validate = a.validate);
						a.maxLength && (c.maxlength = a.maxLength);
						a.size && (c.size = a.size);
						a.inputStyle && (c.style = a.inputStyle);
						var f = this,
							h = !1;
						b.on("load", function() {
							f.getInputElement().on("keydown", function(a) {
								a.data.getKeystroke() == 13 && (h = true)
							});
							f.getInputElement().on("keyup", function(a) {
								if (a.data.getKeystroke() == 13 && h) {
									b.getButton("ok") && setTimeout(function() {
										b.getButton("ok").click()
									}, 0);
									h = false
								}
							}, null, null, 1E3)
						});
						CKEDITOR.ui.dialog.labeledElement.call(this,
							b, a, d, function() {
								var b = ['<div class="cke_dialog_ui_input_', a.type, '" role="presentation"'];
								a.width && b.push('style="width:' + a.width + '" ');
								b.push("><input ");
								c["aria-labelledby"] = this._.labelId;
								this._.required && (c["aria-required"] = this._.required);
								for (var d in c) b.push(d + '="' + c[d] + '" ');
								b.push(" /></div>");
								return b.join("")
							})
					}
				},
				textarea: function(b, a, d) {
					if (!(3 > arguments.length)) {
						i.call(this, a);
						var e = this,
							c = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea",
							f = {};
						a.validate && (this.validate = a.validate);
						f.rows = a.rows || 5;
						f.cols = a.cols || 20;
						f["class"] = "cke_dialog_ui_input_textarea " + (a["class"] || "");
						"undefined" != typeof a.inputStyle && (f.style = a.inputStyle);
						a.dir && (f.dir = a.dir);
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							f["aria-labelledby"] = this._.labelId;
							this._.required && (f["aria-required"] = this._.required);
							var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', c, '" '],
								b;
							for (b in f) a.push(b + '="' + CKEDITOR.tools.htmlEncode(f[b]) + '" ');
							a.push(">", CKEDITOR.tools.htmlEncode(e._["default"]),
								"</textarea></div>");
							return a.join("")
						})
					}
				},
				checkbox: function(b, a, d) {
					if (!(3 > arguments.length)) {
						var e = i.call(this, a, {
							"default": !!a["default"]
						});
						a.validate && (this.validate = a.validate);
						CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "span", null, null, function() {
							var c = CKEDITOR.tools.extend({}, a, {
									id: a.id ? a.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
								}, true),
								d = [],
								h = CKEDITOR.tools.getNextId() + "_label",
								g = {
									"class": "cke_dialog_ui_checkbox_input",
									type: "checkbox",
									"aria-labelledby": h
								};
							p(c);
							if (a["default"]) g.checked =
								"checked";
							if (typeof c.inputStyle != "undefined") c.style = c.inputStyle;
							e.checkbox = new CKEDITOR.ui.dialog.uiElement(b, c, d, "input", null, g);
							d.push(' <label id="', h, '" for="', g.id, '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(a.label), "</label>");
							return d.join("")
						})
					}
				},
				radio: function(b, a, d) {
					if (!(3 > arguments.length)) {
						i.call(this, a);
						this._["default"] || (this._["default"] = this._.initValue = a.items[0][1]);
						a.validate && (this.validate = a.valdiate);
						var e = [],
							c = this;
						CKEDITOR.ui.dialog.labeledElement.call(this,
							b, a, d, function() {
								for (var d = [], h = [], g = (a.id ? a.id : CKEDITOR.tools.getNextId()) + "_radio", k = 0; k < a.items.length; k++) {
									var j = a.items[k],
										i = j[2] !== void 0 ? j[2] : j[0],
										l = j[1] !== void 0 ? j[1] : j[0],
										m = CKEDITOR.tools.getNextId() + "_radio_input",
										n = m + "_label",
										m = CKEDITOR.tools.extend({}, a, {
											id: m,
											title: null,
											type: null
										}, true),
										i = CKEDITOR.tools.extend({}, m, {
											title: i
										}, true),
										o = {
											type: "radio",
											"class": "cke_dialog_ui_radio_input",
											name: g,
											value: l,
											"aria-labelledby": n
										},
										q = [];
									if (c._["default"] == l) o.checked = "checked";
									p(m);
									p(i);
									if (typeof m.inputStyle !=
										"undefined") m.style = m.inputStyle;
									m.keyboardFocusable = true;
									e.push(new CKEDITOR.ui.dialog.uiElement(b, m, q, "input", null, o));
									q.push(" ");
									new CKEDITOR.ui.dialog.uiElement(b, i, q, "label", null, {
										id: n,
										"for": o.id
									}, j[0]);
									d.push(q.join(""))
								}
								new CKEDITOR.ui.dialog.hbox(b, e, d, h);
								return h.join("")
							});
						this._.children = e
					}
				},
				button: function(b, a, d) {
					if (arguments.length) {
						"function" == typeof a && (a = a(b.getParentEditor()));
						i.call(this, a, {
							disabled: a.disabled || !1
						});
						CKEDITOR.event.implementOn(this);
						var e = this;
						b.on("load", function() {
							var a =
								this.getElement();
							(function() {
								a.on("click", function(a) {
									e.click();
									a.data.preventDefault()
								});
								a.on("keydown", function(a) {
									a.data.getKeystroke() in {
										32: 1
									} && (e.click(), a.data.preventDefault())
								})
							})();
							a.unselectable()
						}, this);
						var c = CKEDITOR.tools.extend({}, a);
						delete c.style;
						var f = CKEDITOR.tools.getNextId() + "_label";
						CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "a", null, {
								style: a.style,
								href: "javascript:void(0)",
								title: a.label,
								hidefocus: "true",
								"class": a["class"],
								role: "button",
								"aria-labelledby": f
							}, '<span id="' + f +
							'" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(a.label) + "</span>")
					}
				},
				select: function(b, a, d) {
					if (!(3 > arguments.length)) {
						var e = i.call(this, a);
						a.validate && (this.validate = a.validate);
						e.inputId = CKEDITOR.tools.getNextId() + "_select";
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							var c = CKEDITOR.tools.extend({}, a, {
									id: a.id ? a.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
								}, true),
								d = [],
								h = [],
								g = {
									id: e.inputId,
									"class": "cke_dialog_ui_input_select",
									"aria-labelledby": this._.labelId
								};
							d.push('<div class="cke_dialog_ui_input_',
								a.type, '" role="presentation"');
							a.width && d.push('style="width:' + a.width + '" ');
							d.push(">");
							if (a.size != void 0) g.size = a.size;
							if (a.multiple != void 0) g.multiple = a.multiple;
							p(c);
							for (var k = 0, j; k < a.items.length && (j = a.items[k]); k++) h.push('<option value="', CKEDITOR.tools.htmlEncode(j[1] !== void 0 ? j[1] : j[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(j[0]));
							if (typeof c.inputStyle != "undefined") c.style = c.inputStyle;
							e.select = new CKEDITOR.ui.dialog.uiElement(b, c, d, "select", null, g, h.join(""));
							d.push("</div>");
							return d.join("")
						})
					}
				},
				file: function(b, a, d) {
					if (!(3 > arguments.length)) {
						void 0 === a["default"] && (a["default"] = "");
						var e = CKEDITOR.tools.extend(i.call(this, a), {
							definition: a,
							buttons: []
						});
						a.validate && (this.validate = a.validate);
						b.on("load", function() {
							CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file")
						});
						CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function() {
							e.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
							var b = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="',
								e.frameId, '" title="', a.label, '" src="javascript:void('
							];
							b.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
							b.push(')"></iframe>');
							return b.join("")
						})
					}
				},
				fileButton: function(b, a, d) {
					if (!(3 > arguments.length)) {
						i.call(this, a);
						var e = this;
						a.validate && (this.validate = a.validate);
						var c = CKEDITOR.tools.extend({}, a),
							f = c.onClick;
						c.className = (c.className ? c.className + " " : "") + "cke_dialog_ui_button";
						c.onClick = function(c) {
							var d =
								a["for"];
							if (!f || f.call(this, c) !== false) {
								b.getContentElement(d[0], d[1]).submit();
								this.disable()
							}
						};
						b.on("load", function() {
							b.getContentElement(a["for"][0], a["for"][1])._.buttons.push(e)
						});
						CKEDITOR.ui.dialog.button.call(this, b, c, d)
					}
				},
				html: function() {
					var b = /^\s*<[\w:]+\s+([^>]*)?>/,
						a = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
						d = /\/$/;
					return function(e, c, f) {
						if (!(3 > arguments.length)) {
							var h = [],
								g = c.html;
							"<" != g.charAt(0) && (g = "<span>" + g + "</span>");
							var k = c.focus;
							if (k) {
								var j = this.focus;
								this.focus = function() {
									("function" ==
										typeof k ? k : j).call(this);
									this.fire("focus")
								};
								c.isFocusable && (this.isFocusable = this.isFocusable);
								this.keyboardFocusable = !0
							}
							CKEDITOR.ui.dialog.uiElement.call(this, e, c, h, "span", null, null, "");
							h = h.join("").match(b);
							g = g.match(a) || ["", "", ""];
							d.test(g[1]) && (g[1] = g[1].slice(0, -1), g[2] = "/" + g[2]);
							f.push([g[1], " ", h[1] || "", g[2]].join(""))
						}
					}
				}(),
				fieldset: function(b, a, d, e, c) {
					var f = c.label;
					this._ = {
						children: a
					};
					CKEDITOR.ui.dialog.uiElement.call(this, b, c, e, "fieldset", null, null, function() {
						var a = [];
						f && a.push("<legend" +
							(c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + f + "</legend>");
						for (var b = 0; b < d.length; b++) a.push(d[b]);
						return a.join("")
					})
				}
			}, !0);
			CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
			CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				setLabel: function(b) {
					var a = CKEDITOR.document.getById(this._.labelId);
					1 > a.getChildCount() ? (new CKEDITOR.dom.text(b, CKEDITOR.document)).appendTo(a) : a.getChild(0).$.nodeValue = b;
					return this
				},
				getLabel: function() {
					var b =
						CKEDITOR.document.getById(this._.labelId);
					return !b || 1 > b.getChildCount() ? "" : b.getChild(0).getText()
				},
				eventProcessors: o
			}, !0);
			CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				click: function() {
					return !this._.disabled ? this.fire("click", {
						dialog: this._.dialog
					}) : !1
				},
				enable: function() {
					this._.disabled = !1;
					var b = this.getElement();
					b && b.removeClass("cke_disabled")
				},
				disable: function() {
					this._.disabled = !0;
					this.getElement().addClass("cke_disabled")
				},
				isVisible: function() {
					return this.getElement().getFirst().isVisible()
				},
				isEnabled: function() {
					return !this._.disabled
				},
				eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
					onClick: function(b, a) {
						this.on("click", function() {
							a.apply(this, arguments)
						})
					}
				}, !0),
				accessKeyUp: function() {
					this.click()
				},
				accessKeyDown: function() {
					this.focus()
				},
				keyboardFocusable: !0
			}, !0);
			CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
				getInputElement: function() {
					return CKEDITOR.document.getById(this._.inputId)
				},
				focus: function() {
					var b = this.selectParentTab();
					setTimeout(function() {
						var a = b.getInputElement();
						a && a.$.focus()
					}, 0)
				},
				select: function() {
					var b = this.selectParentTab();
					setTimeout(function() {
						var a = b.getInputElement();
						a && (a.$.focus(), a.$.select())
					}, 0)
				},
				accessKeyUp: function() {
					this.select()
				},
				setValue: function(b) {
					!b && (b = "");
					return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments)
				},
				keyboardFocusable: !0
			}, n, !0);
			CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
			CKEDITOR.ui.dialog.select.prototype =
				CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
					getInputElement: function() {
						return this._.select.getElement()
					},
					add: function(b, a, d) {
						var e = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document),
							c = this.getInputElement().$;
						e.$.text = b;
						e.$.value = void 0 === a || null === a ? b : a;
						void 0 === d || null === d ? CKEDITOR.env.ie ? c.add(e.$) : c.add(e.$, null) : c.add(e.$, d);
						return this
					},
					remove: function(b) {
						this.getInputElement().$.remove(b);
						return this
					},
					clear: function() {
						for (var b = this.getInputElement().$; 0 <
							b.length;) b.remove(0);
						return this
					},
					keyboardFocusable: !0
				}, n, !0);
			CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				getInputElement: function() {
					return this._.checkbox.getElement()
				},
				setValue: function(b, a) {
					this.getInputElement().$.checked = b;
					!a && this.fire("change", {
						value: b
					})
				},
				getValue: function() {
					return this.getInputElement().$.checked
				},
				accessKeyUp: function() {
					this.setValue(!this.getValue())
				},
				eventProcessors: {
					onChange: function(b, a) {
						if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version) return o.onChange.apply(this,
							arguments);
						b.on("load", function() {
							var a = this._.checkbox.getElement();
							a.on("propertychange", function(b) {
								b = b.data.$;
								"checked" == b.propertyName && this.fire("change", {
									value: a.$.checked
								})
							}, this)
						}, this);
						this.on("change", a);
						return null
					}
				},
				keyboardFocusable: !0
			}, n, !0);
			CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				setValue: function(b, a) {
					for (var d = this._.children, e, c = 0; c < d.length && (e = d[c]); c++) e.getElement().$.checked = e.getValue() == b;
					!a && this.fire("change", {
						value: b
					})
				},
				getValue: function() {
					for (var b = this._.children, a = 0; a < b.length; a++)
						if (b[a].getElement().$.checked) return b[a].getValue();
					return null
				},
				accessKeyUp: function() {
					var b = this._.children,
						a;
					for (a = 0; a < b.length; a++)
						if (b[a].getElement().$.checked) {
							b[a].getElement().focus();
							return
						}
					b[0].getElement().focus()
				},
				eventProcessors: {
					onChange: function(b, a) {
						if (CKEDITOR.env.ie) b.on("load", function() {
							for (var a = this._.children, b = this, c = 0; c < a.length; c++) a[c].getElement().on("propertychange", function(a) {
								a = a.data.$;
								"checked" == a.propertyName &&
									this.$.checked && b.fire("change", {
										value: this.getAttribute("value")
									})
							})
						}, this), this.on("change", a);
						else return o.onChange.apply(this, arguments);
						return null
					}
				}
			}, n, !0);
			CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, n, {
				getInputElement: function() {
					var b = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
					return 0 < b.$.forms.length ? new CKEDITOR.dom.element(b.$.forms[0].elements[0]) : this.getElement()
				},
				submit: function() {
					this.getInputElement().getParent().$.submit();
					return this
				},
				getAction: function() {
					return this.getInputElement().getParent().$.action
				},
				registerEvents: function(b) {
					var a = /^on([A-Z]\w+)/,
						d, e = function(a, b, c, d) {
							a.on("formLoaded", function() {
								a.getInputElement().on(c, d, a)
							})
						},
						c;
					for (c in b)
						if (d = c.match(a)) this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, b[c]) : e(this, this._.dialog, d[1].toLowerCase(), b[c]);
					return this
				},
				reset: function() {
					function b() {
						d.$.open();
						var b = "";
						e.size && (b = e.size - (CKEDITOR.env.ie ? 7 : 0));
						var i = a.frameId + "_input";
						d.$.write(['<html dir="' + g + '" lang="' + k + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + g + '" lang="' + k + '" action="', CKEDITOR.tools.htmlEncode(e.action), '"><label id="', a.labelId, '" for="', i, '" style="display:none">', CKEDITOR.tools.htmlEncode(e.label), '</label><input style="width:100%" id="', i, '" aria-labelledby="', a.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(e.id || "cke_upload"),
							'" size="', CKEDITOR.tools.htmlEncode(0 < b ? b : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + f + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + h + ")}", "<\/script>"
						].join(""));
						d.$.close();
						for (b = 0; b < c.length; b++) c[b].enable()
					}
					var a = this._,
						d = CKEDITOR.document.getById(a.frameId).getFrameDocument(),
						e = a.definition,
						c = a.buttons,
						f = this.formLoadedNumber,
						h = this.formUnloadNumber,
						g = a.dialog._.editor.lang.dir,
						k = a.dialog._.editor.langCode;
					f || (f = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
						this.fire("formLoaded")
					}, this), h = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
						this.getInputElement().clearCustomData()
					}, this), this.getDialog()._.editor.on("destroy", function() {
						CKEDITOR.tools.removeFunction(f);
						CKEDITOR.tools.removeFunction(h)
					}));
					CKEDITOR.env.gecko ? setTimeout(b, 500) : b()
				},
				getValue: function() {
					return this.getInputElement().$.value || ""
				},
				setInitValue: function() {
					this._.initValue =
						""
				},
				eventProcessors: {
					onChange: function(b, a) {
						this._.domOnChangeRegistered || (this.on("formLoaded", function() {
							this.getInputElement().on("change", function() {
								this.fire("change", {
									value: this.getValue()
								})
							}, this)
						}, this), this._.domOnChangeRegistered = !0);
						this.on("change", a)
					}
				},
				keyboardFocusable: !0
			}, !0);
			CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
			CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
			CKEDITOR.dialog.addUIElement("text", r);
			CKEDITOR.dialog.addUIElement("password",
				r);
			CKEDITOR.dialog.addUIElement("textarea", l);
			CKEDITOR.dialog.addUIElement("checkbox", l);
			CKEDITOR.dialog.addUIElement("radio", l);
			CKEDITOR.dialog.addUIElement("button", l);
			CKEDITOR.dialog.addUIElement("select", l);
			CKEDITOR.dialog.addUIElement("file", l);
			CKEDITOR.dialog.addUIElement("fileButton", l);
			CKEDITOR.dialog.addUIElement("html", l);
			CKEDITOR.dialog.addUIElement("fieldset", {
				build: function(b, a, d) {
					for (var e = a.children, c, f = [], h = [], g = 0; g < e.length && (c = e[g]); g++) {
						var i = [];
						f.push(i);
						h.push(CKEDITOR.dialog._.uiElementBuilders[c.type].build(b,
							c, i))
					}
					return new CKEDITOR.ui.dialog[a.type](b, h, f, d, a)
				}
			})
		}
	});
	CKEDITOR.DIALOG_RESIZE_NONE = 0;
	CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
	CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
	CKEDITOR.DIALOG_RESIZE_BOTH = 3;
	(function() {
		function t() {
			for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)
				if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
			return null
		}

		function u() {
			for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++)
				if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
			return null
		}

		function G(a, b) {
			for (var c = a.$.getElementsByTagName("input"),
				e = 0, d = c.length; e < d; e++) {
				var g = new CKEDITOR.dom.element(c[e]);
				"text" == g.getAttribute("type").toLowerCase() && (b ? (g.setAttribute("value", g.getCustomData("fake_value") || ""), g.removeCustomData("fake_value")) : (g.setCustomData("fake_value", g.getAttribute("value")), g.setAttribute("value", "")))
			}
		}

		function P(a, b) {
			var c = this.getInputElement();
			c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", !0));
			a || (this.select ? this.select() : this.focus());
			b && alert(b);
			this.fire("validated", {
				valid: a,
				msg: b
			})
		}

		function Q() {
			var a = this.getInputElement();
			a && a.removeAttribute("aria-invalid")
		}

		function R(a) {
			var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", S).output({
					id: CKEDITOR.tools.getNextNumber(),
					editorId: a.id,
					langDir: a.lang.dir,
					langCode: a.langCode,
					editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
					closeTitle: a.lang.common.close,
					hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
				})),
				b = a.getChild([0, 0, 0, 0, 0]),
				c = b.getChild(0),
				e = b.getChild(1);
			if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
				var d =
					"javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
				CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + d + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
			}
			c.unselectable();
			e.unselectable();
			return {
				element: a,
				parts: {
					dialog: a.getChild(0),
					title: c,
					close: e,
					tabs: b.getChild(2),
					contents: b.getChild([3, 0, 0, 0]),
					footer: b.getChild([3, 0, 1, 0])
				}
			}
		}

		function H(a, b, c) {
			this.element = b;
			this.focusIndex = c;
			this.tabIndex =
				0;
			this.isFocusable = function() {
				return !b.getAttribute("disabled") && b.isVisible()
			};
			this.focus = function() {
				a._.currentFocusIndex = this.focusIndex;
				this.element.focus()
			};
			b.on("keydown", function(a) {
				a.data.getKeystroke() in {
					32: 1,
					13: 1
				} && this.fire("click")
			});
			b.on("focus", function() {
				this.fire("mouseover")
			});
			b.on("blur", function() {
				this.fire("mouseout")
			})
		}

		function T(a) {
			function b() {
				a.layout()
			}
			var c = CKEDITOR.document.getWindow();
			c.on("resize", b);
			a.on("hide", function() {
				c.removeListener("resize", b)
			})
		}

		function I(a, b) {
			this._ = {
				dialog: a
			};
			CKEDITOR.tools.extend(this, b)
		}

		function U(a) {
			function b(b) {
				var c = a.getSize(),
					i = CKEDITOR.document.getWindow().getViewPaneSize(),
					o = b.data.$.screenX,
					j = b.data.$.screenY,
					n = o - e.x,
					l = j - e.y;
				e = {
					x: o,
					y: j
				};
				d.x += n;
				d.y += l;
				a.move(d.x + h[3] < f ? -h[3] : d.x - h[1] > i.width - c.width - f ? i.width - c.width + ("rtl" == g.lang.dir ? 0 : h[1]) : d.x, d.y + h[0] < f ? -h[0] : d.y - h[2] > i.height - c.height - f ? i.height - c.height + h[2] : d.y, 1);
				b.data.preventDefault()
			}

			function c() {
				CKEDITOR.document.removeListener("mousemove", b);
				CKEDITOR.document.removeListener("mouseup",
					c);
				if (CKEDITOR.env.ie6Compat) {
					var a = q.getChild(0).getFrameDocument();
					a.removeListener("mousemove", b);
					a.removeListener("mouseup", c)
				}
			}
			var e = null,
				d = null;
			a.getElement().getFirst();
			var g = a.getParentEditor(),
				f = g.config.dialog_magnetDistance,
				h = CKEDITOR.skin.margins || [0, 0, 0, 0];
			"undefined" == typeof f && (f = 20);
			a.parts.title.on("mousedown", function(f) {
				e = {
					x: f.data.$.screenX,
					y: f.data.$.screenY
				};
				CKEDITOR.document.on("mousemove", b);
				CKEDITOR.document.on("mouseup", c);
				d = a.getPosition();
				if (CKEDITOR.env.ie6Compat) {
					var h =
						q.getChild(0).getFrameDocument();
					h.on("mousemove", b);
					h.on("mouseup", c)
				}
				f.data.preventDefault()
			}, a)
		}

		function V(a) {
			var b, c;

			function e(d) {
				var e = "rtl" == h.lang.dir,
					j = o.width,
					C = o.height,
					D = j + (d.data.$.screenX - b) * (e ? -1 : 1) * (a._.moved ? 1 : 2),
					n = C + (d.data.$.screenY - c) * (a._.moved ? 1 : 2),
					x = a._.element.getFirst(),
					x = e && x.getComputedStyle("right"),
					y = a.getPosition();
				y.y + n > i.height && (n = i.height - y.y);
				if ((e ? x : y.x) + D > i.width) D = i.width - (e ? x : y.x);
				if (f == CKEDITOR.DIALOG_RESIZE_WIDTH || f == CKEDITOR.DIALOG_RESIZE_BOTH) j = Math.max(g.minWidth ||
					0, D - m);
				if (f == CKEDITOR.DIALOG_RESIZE_HEIGHT || f == CKEDITOR.DIALOG_RESIZE_BOTH) C = Math.max(g.minHeight || 0, n - k);
				a.resize(j, C);
				a._.moved || a.layout();
				d.data.preventDefault()
			}

			function d() {
				CKEDITOR.document.removeListener("mouseup", d);
				CKEDITOR.document.removeListener("mousemove", e);
				j && (j.remove(), j = null);
				if (CKEDITOR.env.ie6Compat) {
					var a = q.getChild(0).getFrameDocument();
					a.removeListener("mouseup", d);
					a.removeListener("mousemove", e)
				}
			}
			var g = a.definition,
				f = g.resizable;
			if (f != CKEDITOR.DIALOG_RESIZE_NONE) {
				var h = a.getParentEditor(),
					m, k, i, o, j, n = CKEDITOR.tools.addFunction(function(f) {
						o = a.getSize();
						var h = a.parts.contents;
						h.$.getElementsByTagName("iframe").length && (j = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>'), h.append(j));
						k = o.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
						m = o.width - a.parts.contents.getSize("width", 1);
						b = f.screenX;
						c = f.screenY;
						i = CKEDITOR.document.getWindow().getViewPaneSize();
						CKEDITOR.document.on("mousemove", e);
						CKEDITOR.document.on("mouseup", d);
						CKEDITOR.env.ie6Compat && (h = q.getChild(0).getFrameDocument(), h.on("mousemove", e), h.on("mouseup", d));
						f.preventDefault && f.preventDefault()
					});
				a.on("load", function() {
					var b = "";
					f == CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : f == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
					b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + h.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(h.lang.common.resize) +
						'" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event )">' + ("ltr" == h.lang.dir ? "◢" : "◣") + "</div>");
					a.parts.footer.append(b, 1)
				});
				h.on("destroy", function() {
					CKEDITOR.tools.removeFunction(n)
				})
			}
		}

		function E(a) {
			a.data.preventDefault(1)
		}

		function J(a) {
			var b = CKEDITOR.document.getWindow(),
				c = a.config,
				e = c.dialog_backgroundCoverColor || "white",
				d = c.dialog_backgroundCoverOpacity,
				g = c.baseFloatZIndex,
				c = CKEDITOR.tools.genKey(e, d, g),
				f = w[c];
			f ? f.show() : (g = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ?
					"absolute" : "fixed", "; z-index: ", g, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + e : "", '" class="cke_dialog_background_cover">'
				], CKEDITOR.env.ie6Compat && (e = "<html><body style=\\'background-color:" + e + ";\\'></body></html>", g.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:'), g.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + e + "' );document.close();") + "})())"), g.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')),
				g.push("</div>"), f = CKEDITOR.dom.element.createFromHtml(g.join("")), f.setOpacity(void 0 != d ? d : 0.5), f.on("keydown", E), f.on("keypress", E), f.on("keyup", E), f.appendTo(CKEDITOR.document.getBody()), w[c] = f);
			a.focusManager.add(f);
			q = f;
			var a = function() {
					var a = b.getViewPaneSize();
					f.setStyles({
						width: a.width + "px",
						height: a.height + "px"
					})
				},
				h = function() {
					var a = b.getScrollPosition(),
						c = CKEDITOR.dialog._.currentTop;
					f.setStyles({
						left: a.x + "px",
						top: a.y + "px"
					});
					if (c) {
						do {
							a = c.getPosition();
							c.move(a.x, a.y)
						} while (c = c._.parentDialog)
					}
				};
			F = a;
			b.on("resize", a);
			a();
			(!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && f.focus();
			if (CKEDITOR.env.ie6Compat) {
				var m = function() {
					h();
					arguments.callee.prevScrollHandler.apply(this, arguments)
				};
				b.$.setTimeout(function() {
					m.prevScrollHandler = window.onscroll || function() {};
					window.onscroll = m
				}, 0);
				h()
			}
		}

		function K(a) {
			q && (a.focusManager.remove(q), a = CKEDITOR.document.getWindow(), q.hide(), a.removeListener("resize", F), CKEDITOR.env.ie6Compat && a.$.setTimeout(function() {
				window.onscroll = window.onscroll && window.onscroll.prevScrollHandler ||
					null
			}, 0), F = null)
		}
		var r = CKEDITOR.tools.cssLength,
			S = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
		CKEDITOR.dialog = function(a, b) {
			function c() {
				var a = l._.focusList;
				a.sort(function(a, b) {
					return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
				});
				for (var b = a.length, c = 0; c < b; c++) a[c].focusIndex = c
			}

			function e(a) {
				var b = l._.focusList,
					a = a || 0;
				if (!(1 > b.length)) {
					var c = l._.currentFocusIndex;
					try {
						b[c].getInputElement().$.blur()
					} catch (f) {}
					for (var d = c = (c + a + b.length) % b.length; a && !b[d].isFocusable() && !(d = (d + a + b.length) % b.length, d == c););
					b[d].focus();
					"text" == b[d].type && b[d].select()
				}
			}

			function d(b) {
				if (l ==
					CKEDITOR.dialog._.currentTop) {
					var c = b.data.getKeystroke(),
						d = "rtl" == a.lang.dir;
					o = j = 0;
					if (9 == c || c == CKEDITOR.SHIFT + 9) c = c == CKEDITOR.SHIFT + 9, l._.tabBarMode ? (c = c ? t.call(l) : u.call(l), l.selectPage(c), l._.tabs[c][0].focus()) : e(c ? -1 : 1), o = 1;
					else if (c == CKEDITOR.ALT + 121 && !l._.tabBarMode && 1 < l.getPageCount()) l._.tabBarMode = !0, l._.tabs[l._.currentTabId][0].focus(), o = 1;
					else if ((37 == c || 39 == c) && l._.tabBarMode) c = c == (d ? 39 : 37) ? t.call(l) : u.call(l), l.selectPage(c), l._.tabs[c][0].focus(), o = 1;
					else if ((13 == c || 32 == c) && l._.tabBarMode) this.selectPage(this._.currentTabId),
						this._.tabBarMode = !1, this._.currentFocusIndex = -1, e(1), o = 1;
					else if (13 == c) {
						c = b.data.getTarget();
						if (!c.is("a", "button", "select", "textarea") && (!c.is("input") || "button" != c.$.type))(c = this.getButton("ok")) && CKEDITOR.tools.setTimeout(c.click, 0, c), o = 1;
						j = 1
					} else if (27 == c)(c = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(c.click, 0, c) : !1 !== this.fire("cancel", {
						hide: !0
					}).hide && this.hide(), j = 1;
					else return;
					g(b)
				}
			}

			function g(a) {
				o ? a.data.preventDefault(1) : j && a.data.stopPropagation()
			}
			var f = CKEDITOR.dialog._.dialogDefinitions[b],
				h = CKEDITOR.tools.clone(W),
				m = a.config.dialog_buttonsOrder || "OS",
				k = a.lang.dir,
				i = {},
				o, j;
			("OS" == m && CKEDITOR.env.mac || "rtl" == m && "ltr" == k || "ltr" == m && "rtl" == k) && h.buttons.reverse();
			f = CKEDITOR.tools.extend(f(a), h);
			f = CKEDITOR.tools.clone(f);
			f = new L(this, f);
			h = R(a);
			this._ = {
				editor: a,
				element: h.element,
				name: b,
				contentSize: {
					width: 0,
					height: 0
				},
				size: {
					width: 0,
					height: 0
				},
				contents: {},
				buttons: {},
				accessKeyMap: {},
				tabs: {},
				tabIdList: [],
				currentTabId: null,
				currentTabIndex: null,
				pageCount: 0,
				lastTab: null,
				tabBarMode: !1,
				focusList: [],
				currentFocusIndex: 0,
				hasFocus: !1
			};
			this.parts = h.parts;
			CKEDITOR.tools.setTimeout(function() {
				a.fire("ariaWidget", this.parts.contents)
			}, 0, this);
			h = {
				position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
				top: 0,
				visibility: "hidden"
			};
			h["rtl" == k ? "right" : "left"] = 0;
			this.parts.dialog.setStyles(h);
			CKEDITOR.event.call(this);
			this.definition = f = CKEDITOR.fire("dialogDefinition", {
				name: b,
				definition: f
			}, a).definition;
			if (!("removeDialogTabs" in a._) && a.config.removeDialogTabs) {
				h = a.config.removeDialogTabs.split(";");
				for (k = 0; k <
					h.length; k++)
					if (m = h[k].split(":"), 2 == m.length) {
						var n = m[0];
						i[n] || (i[n] = []);
						i[n].push(m[1])
					}
				a._.removeDialogTabs = i
			}
			if (a._.removeDialogTabs && (i = a._.removeDialogTabs[b]))
				for (k = 0; k < i.length; k++) f.removeContents(i[k]);
			if (f.onLoad) this.on("load", f.onLoad);
			if (f.onShow) this.on("show", f.onShow);
			if (f.onHide) this.on("hide", f.onHide);
			if (f.onOk) this.on("ok", function(b) {
				a.fire("saveSnapshot");
				setTimeout(function() {
					a.fire("saveSnapshot")
				}, 0);
				!1 === f.onOk.call(this, b) && (b.data.hide = !1)
			});
			if (f.onCancel) this.on("cancel",
				function(a) {
					!1 === f.onCancel.call(this, a) && (a.data.hide = !1)
				});
			var l = this,
				p = function(a) {
					var b = l._.contents,
						c = !1,
						d;
					for (d in b)
						for (var f in b[d])
							if (c = a.call(this, b[d][f])) return
				};
			this.on("ok", function(a) {
				p(function(b) {
					if (b.validate) {
						var c = b.validate(this),
							d = "string" == typeof c || !1 === c;
						d && (a.data.hide = !1, a.stop());
						P.call(b, !d, "string" == typeof c ? c : void 0);
						return d
					}
				})
			}, this, null, 0);
			this.on("cancel", function(b) {
				p(function(c) {
					if (c.isChanged()) return !a.config.dialog_noConfirmCancel && !confirm(a.lang.common.confirmCancel) &&
						(b.data.hide = !1), !0
				})
			}, this, null, 0);
			this.parts.close.on("click", function(a) {
				!1 !== this.fire("cancel", {
					hide: !0
				}).hide && this.hide();
				a.data.preventDefault()
			}, this);
			this.changeFocus = e;
			var v = this._.element;
			a.focusManager.add(v, 1);
			this.on("show", function() {
				v.on("keydown", d, this);
				if (CKEDITOR.env.gecko) v.on("keypress", g, this)
			});
			this.on("hide", function() {
				v.removeListener("keydown", d);
				CKEDITOR.env.gecko && v.removeListener("keypress", g);
				p(function(a) {
					Q.apply(a)
				})
			});
			this.on("iframeAdded", function(a) {
				(new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown",
					d, this, null, 0)
			});
			this.on("show", function() {
				c();
				if (a.config.dialog_startupFocusTab && 1 < l._.pageCount) l._.tabBarMode = !0, l._.tabs[l._.currentTabId][0].focus();
				else if (!this._.hasFocus)
					if (this._.currentFocusIndex = -1, f.onFocus) {
						var b = f.onFocus.call(this);
						b && b.focus()
					} else e(1)
			}, this, null, 4294967295);
			if (CKEDITOR.env.ie6Compat) this.on("load", function() {
				var a = this.getElement(),
					b = a.getFirst();
				b.remove();
				b.appendTo(a)
			}, this);
			U(this);
			V(this);
			(new CKEDITOR.dom.text(f.title, CKEDITOR.document)).appendTo(this.parts.title);
			for (k = 0; k < f.contents.length; k++)(i = f.contents[k]) && this.addPage(i);
			this.parts.tabs.on("click", function(a) {
				var b = a.data.getTarget();
				b.hasClass("cke_dialog_tab") && (b = b.$.id, this.selectPage(b.substring(4, b.lastIndexOf("_"))), this._.tabBarMode && (this._.tabBarMode = !1, this._.currentFocusIndex = -1, e(1)), a.data.preventDefault())
			}, this);
			k = [];
			i = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
				type: "hbox",
				className: "cke_dialog_footer_buttons",
				widths: [],
				children: f.buttons
			}, k).getChild();
			this.parts.footer.setHtml(k.join(""));
			for (k = 0; k < i.length; k++) this._.buttons[i[k].id] = i[k]
		};
		CKEDITOR.dialog.prototype = {
			destroy: function() {
				this.hide();
				this._.element.remove()
			},
			resize: function() {
				return function(a, b) {
					if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b)) CKEDITOR.dialog.fire("resize", {
						dialog: this,
						width: a,
						height: b
					}, this._.editor), this.fire("resize", {
						width: a,
						height: b
					}, this._.editor), this.parts.contents.setStyles({
						width: a + "px",
						height: b + "px"
					}), "rtl" == this._.editor.lang.dir && this._.position && (this._.position.x =
						CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10)), this._.contentSize = {
						width: a,
						height: b
					}
				}
			}(),
			getSize: function() {
				var a = this._.element.getFirst();
				return {
					width: a.$.offsetWidth || 0,
					height: a.$.offsetHeight || 0
				}
			},
			move: function(a, b, c) {
				var e = this._.element.getFirst(),
					d = "rtl" == this._.editor.lang.dir,
					g = "fixed" == e.getComputedStyle("position");
				CKEDITOR.env.ie && e.setStyle("zoom", "100%");
				if (!g || !this._.position || !(this._.position.x ==
					a && this._.position.y == b)) this._.position = {
					x: a,
					y: b
				}, g || (g = CKEDITOR.document.getWindow().getScrollPosition(), a += g.x, b += g.y), d && (g = this.getSize(), a = CKEDITOR.document.getWindow().getViewPaneSize().width - g.width - a), b = {
					top: (0 < b ? b : 0) + "px"
				}, b[d ? "right" : "left"] = (0 < a ? a : 0) + "px", e.setStyles(b), c && (this._.moved = 1)
			},
			getPosition: function() {
				return CKEDITOR.tools.extend({}, this._.position)
			},
			show: function() {
				var a = this._.element,
					b = this.definition;
				!a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) :
					a.setStyle("display", "block");
				this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
				this.reset();
				this.selectPage(this.definition.contents[0].id);
				null === CKEDITOR.dialog._.currentZIndex && (CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex);
				this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex += 10);
				null === CKEDITOR.dialog._.currentTop ? (CKEDITOR.dialog._.currentTop = this,
					this._.parentDialog = null, J(this._.editor)) : (this._.parentDialog = CKEDITOR.dialog._.currentTop, this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2), CKEDITOR.dialog._.currentTop = this);
				a.on("keydown", M);
				a.on("keyup", N);
				this._.hasFocus = !1;
				for (var c in b.contents)
					if (b.contents[c]) {
						var a = b.contents[c],
							e = this._.tabs[a.id],
							d = a.requiredContent,
							g = 0;
						if (e) {
							for (var f in this._.contents[a.id]) {
								var h = this._.contents[a.id][f];
								"hbox" == h.type || ("vbox" == h.type ||
									!h.getInputElement()) || (h.requiredContent && !this._.editor.activeFilter.check(h.requiredContent) ? h.disable() : (h.enable(), g++))
							}!g || d && !this._.editor.activeFilter.check(d) ? e[0].addClass("cke_dialog_tab_disabled") : e[0].removeClass("cke_dialog_tab_disabled")
						}
					}
				CKEDITOR.tools.setTimeout(function() {
					this.layout();
					T(this);
					this.parts.dialog.setStyle("visibility", "");
					this.fireOnce("load", {});
					CKEDITOR.ui.fire("ready", this);
					this.fire("show", {});
					this._.editor.fire("dialogShow", this);
					this._.parentDialog || this._.editor.focusManager.lock();
					this.foreach(function(a) {
						a.setInitValue && a.setInitValue()
					})
				}, 100, this)
			},
			layout: function() {
				var a = this.parts.dialog,
					b = this.getSize(),
					c = CKEDITOR.document.getWindow().getViewPaneSize(),
					e = (c.width - b.width) / 2,
					d = (c.height - b.height) / 2;
				CKEDITOR.env.ie6Compat || (b.height + (0 < d ? d : 0) > c.height || b.width + (0 < e ? e : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
				this.move(this._.moved ? this._.position.x : e, this._.moved ? this._.position.y : d)
			},
			foreach: function(a) {
				for (var b in this._.contents)
					for (var c in this._.contents[b]) a.call(this,
						this._.contents[b][c]);
				return this
			},
			reset: function() {
				var a = function(a) {
					a.reset && a.reset(1)
				};
				return function() {
					this.foreach(a);
					return this
				}
			}(),
			setupContent: function() {
				var a = arguments;
				this.foreach(function(b) {
					b.setup && b.setup.apply(b, a)
				})
			},
			commitContent: function() {
				var a = arguments;
				this.foreach(function(b) {
					CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
					b.commit && b.commit.apply(b, a)
				})
			},
			hide: function() {
				if (this.parts.dialog.isVisible()) {
					this.fire("hide", {});
					this._.editor.fire("dialogHide",
						this);
					this.selectPage(this._.tabIdList[0]);
					var a = this._.element;
					a.setStyle("display", "none");
					this.parts.dialog.setStyle("visibility", "hidden");
					for (X(this); CKEDITOR.dialog._.currentTop != this;) CKEDITOR.dialog._.currentTop.hide();
					if (this._.parentDialog) {
						var b = this._.parentDialog.getElement().getFirst();
						b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
					} else K(this._.editor); if (CKEDITOR.dialog._.currentTop = this._.parentDialog) CKEDITOR.dialog._.currentZIndex -=
						10;
					else {
						CKEDITOR.dialog._.currentZIndex = null;
						a.removeListener("keydown", M);
						a.removeListener("keyup", N);
						var c = this._.editor;
						c.focus();
						setTimeout(function() {
							c.focusManager.unlock()
						}, 0)
					}
					delete this._.parentDialog;
					this.foreach(function(a) {
						a.resetInitValue && a.resetInitValue()
					})
				}
			},
			addPage: function(a) {
				if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
					for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", e = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
						type: "vbox",
						className: "cke_dialog_page_contents",
						children: a.elements,
						expand: !!a.expand,
						padding: a.padding,
						style: a.style || "width: 100%;"
					}, b), d = this._.contents[a.id] = {}, g = e.getChild(), f = 0; e = g.shift();)!e.notAllowed && ("hbox" != e.type && "vbox" != e.type) && f++, d[e.id] = e, "function" == typeof e.getChild && g.push.apply(g, e.getChild());
					f || (a.hidden = !0);
					b = CKEDITOR.dom.element.createFromHtml(b.join(""));
					b.setAttribute("role", "tabpanel");
					e = CKEDITOR.env;
					d = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
					c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"',
						0 < this._.pageCount ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', d, '"', e.gecko && !e.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"
					].join(""));
					b.setAttribute("aria-labelledby", d);
					this._.tabs[a.id] = [c, b];
					this._.tabIdList.push(a.id);
					!a.hidden && this._.pageCount++;
					this._.lastTab = c;
					this.updateStyle();
					b.setAttribute("name", a.id);
					b.appendTo(this.parts.contents);
					c.unselectable();
					this.parts.tabs.append(c);
					a.accessKey && (O(this, this, "CTRL+" +
						a.accessKey, Y, Z), this._.accessKeyMap["CTRL+" + a.accessKey] = a.id)
				}
			},
			selectPage: function(a) {
				if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && !1 !== this.fire("selectPage", {
					page: a,
					currentPage: this._.currentTabId
				})) {
					for (var b in this._.tabs) {
						var c = this._.tabs[b][0],
							e = this._.tabs[b][1];
						b != a && (c.removeClass("cke_dialog_tab_selected"), e.hide());
						e.setAttribute("aria-hidden", b != a)
					}
					var d = this._.tabs[a];
					d[0].addClass("cke_dialog_tab_selected");
					CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ?
						(G(d[1]), d[1].show(), setTimeout(function() {
						G(d[1], 1)
					}, 0)) : d[1].show();
					this._.currentTabId = a;
					this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
				}
			},
			updateStyle: function() {
				this.parts.dialog[(1 === this._.pageCount ? "add" : "remove") + "Class"]("cke_single_page")
			},
			hidePage: function(a) {
				var b = this._.tabs[a] && this._.tabs[a][0];
				b && (1 != this._.pageCount && b.isVisible()) && (a == this._.currentTabId && this.selectPage(t.call(this)), b.hide(), this._.pageCount--, this.updateStyle())
			},
			showPage: function(a) {
				if (a = this._.tabs[a] &&
					this._.tabs[a][0]) a.show(), this._.pageCount++, this.updateStyle()
			},
			getElement: function() {
				return this._.element
			},
			getName: function() {
				return this._.name
			},
			getContentElement: function(a, b) {
				var c = this._.contents[a];
				return c && c[b]
			},
			getValueOf: function(a, b) {
				return this.getContentElement(a, b).getValue()
			},
			setValueOf: function(a, b, c) {
				return this.getContentElement(a, b).setValue(c)
			},
			getButton: function(a) {
				return this._.buttons[a]
			},
			click: function(a) {
				return this._.buttons[a].click()
			},
			disableButton: function(a) {
				return this._.buttons[a].disable()
			},
			enableButton: function(a) {
				return this._.buttons[a].enable()
			},
			getPageCount: function() {
				return this._.pageCount
			},
			getParentEditor: function() {
				return this._.editor
			},
			getSelectedElement: function() {
				return this.getParentEditor().getSelection().getSelectedElement()
			},
			addFocusable: function(a, b) {
				if ("undefined" == typeof b) b = this._.focusList.length, this._.focusList.push(new H(this, a, b));
				else {
					this._.focusList.splice(b, 0, new H(this, a, b));
					for (var c = b + 1; c < this._.focusList.length; c++) this._.focusList[c].focusIndex++
				}
			}
		};
		CKEDITOR.tools.extend(CKEDITOR.dialog, {
			add: function(a, b) {
				if (!this._.dialogDefinitions[a] || "function" == typeof b) this._.dialogDefinitions[a] = b
			},
			exists: function(a) {
				return !!this._.dialogDefinitions[a]
			},
			getCurrent: function() {
				return CKEDITOR.dialog._.currentTop
			},
			isTabEnabled: function(a, b, c) {
				a = a.config.removeDialogTabs;
				return !(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
			},
			okButton: function() {
				var a = function(a, c) {
					c = c || {};
					return CKEDITOR.tools.extend({
						id: "ok",
						type: "button",
						label: a.lang.common.ok,
						"class": "cke_dialog_ui_button_ok",
						onClick: function(a) {
							a = a.data.dialog;
							!1 !== a.fire("ok", {
								hide: !0
							}).hide && a.hide()
						}
					}, c, !0)
				};
				a.type = "button";
				a.override = function(b) {
					return CKEDITOR.tools.extend(function(c) {
						return a(c, b)
					}, {
						type: "button"
					}, !0)
				};
				return a
			}(),
			cancelButton: function() {
				var a = function(a, c) {
					c = c || {};
					return CKEDITOR.tools.extend({
						id: "cancel",
						type: "button",
						label: a.lang.common.cancel,
						"class": "cke_dialog_ui_button_cancel",
						onClick: function(a) {
							a = a.data.dialog;
							!1 !== a.fire("cancel", {
								hide: !0
							}).hide && a.hide()
						}
					}, c, !0)
				};
				a.type = "button";
				a.override =
					function(b) {
						return CKEDITOR.tools.extend(function(c) {
							return a(c, b)
						}, {
							type: "button"
						}, !0)
				};
				return a
			}(),
			addUIElement: function(a, b) {
				this._.uiElementBuilders[a] = b
			}
		});
		CKEDITOR.dialog._ = {
			uiElementBuilders: {},
			dialogDefinitions: {},
			currentTop: null,
			currentZIndex: null
		};
		CKEDITOR.event.implementOn(CKEDITOR.dialog);
		CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
		var W = {
				resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
				minWidth: 600,
				minHeight: 400,
				buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
			},
			z = function(a,
				b, c) {
				for (var e = 0, d; d = a[e]; e++)
					if (d.id == b || c && d[c] && (d = z(d[c], b, c))) return d;
				return null
			},
			A = function(a, b, c, e, d) {
				if (c) {
					for (var g = 0, f; f = a[g]; g++) {
						if (f.id == c) return a.splice(g, 0, b), b;
						if (e && f[e] && (f = A(f[e], b, c, e, !0))) return f
					}
					if (d) return null
				}
				a.push(b);
				return b
			},
			B = function(a, b, c) {
				for (var e = 0, d; d = a[e]; e++) {
					if (d.id == b) return a.splice(e, 1);
					if (c && d[c] && (d = B(d[c], b, c))) return d
				}
				return null
			},
			L = function(a, b) {
				this.dialog = a;
				for (var c = b.contents, e = 0, d; d = c[e]; e++) c[e] = d && new I(a, d);
				CKEDITOR.tools.extend(this, b)
			};
		L.prototype = {
			getContents: function(a) {
				return z(this.contents, a)
			},
			getButton: function(a) {
				return z(this.buttons, a)
			},
			addContents: function(a, b) {
				return A(this.contents, a, b)
			},
			addButton: function(a, b) {
				return A(this.buttons, a, b)
			},
			removeContents: function(a) {
				B(this.contents, a)
			},
			removeButton: function(a) {
				B(this.buttons, a)
			}
		};
		I.prototype = {
			get: function(a) {
				return z(this.elements, a, "children")
			},
			add: function(a, b) {
				return A(this.elements, a, b, "children")
			},
			remove: function(a) {
				B(this.elements, a, "children")
			}
		};
		var F, w = {},
			q, s = {},
			M = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey,
					c = a.data.$.altKey,
					e = a.data.$.shiftKey,
					d = String.fromCharCode(a.data.$.keyCode);
				if ((b = s[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length) b = b[b.length - 1], b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key), a.data.preventDefault()
			},
			N = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey,
					c = a.data.$.altKey,
					e = a.data.$.shiftKey,
					d = String.fromCharCode(a.data.$.keyCode);
				if ((b = s[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length) b = b[b.length -
					1], b.keyup && (b.keyup.call(b.uiElement, b.dialog, b.key), a.data.preventDefault())
			},
			O = function(a, b, c, e, d) {
				(s[c] || (s[c] = [])).push({
					uiElement: a,
					dialog: b,
					key: c,
					keyup: d || a.accessKeyUp,
					keydown: e || a.accessKeyDown
				})
			},
			X = function(a) {
				for (var b in s) {
					for (var c = s[b], e = c.length - 1; 0 <= e; e--)(c[e].dialog == a || c[e].uiElement == a) && c.splice(e, 1);
					0 === c.length && delete s[b]
				}
			},
			Z = function(a, b) {
				a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
			},
			Y = function() {};
		(function() {
			CKEDITOR.ui.dialog = {
				uiElement: function(a, b, c, e, d, g,
					f) {
					if (!(4 > arguments.length)) {
						var h = (e.call ? e(b) : e) || "div",
							m = ["<", h, " "],
							k = (d && d.call ? d(b) : d) || {},
							i = (g && g.call ? g(b) : g) || {},
							o = (f && f.call ? f.call(this, a, b) : f) || "",
							j = this.domId = i.id || CKEDITOR.tools.getNextId() + "_uiElement";
						this.id = b.id;
						b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent) && (k.display = "none", this.notAllowed = !0);
						i.id = j;
						var n = {};
						b.type && (n["cke_dialog_ui_" + b.type] = 1);
						b.className && (n[b.className] = 1);
						b.disabled && (n.cke_disabled = 1);
						for (var l = i["class"] && i["class"].split ? i["class"].split(" ") :
							[], j = 0; j < l.length; j++) l[j] && (n[l[j]] = 1);
						l = [];
						for (j in n) l.push(j);
						i["class"] = l.join(" ");
						b.title && (i.title = b.title);
						n = (b.style || "").split(";");
						b.align && (l = b.align, k["margin-left"] = "left" == l ? 0 : "auto", k["margin-right"] = "right" == l ? 0 : "auto");
						for (j in k) n.push(j + ":" + k[j]);
						b.hidden && n.push("display:none");
						for (j = n.length - 1; 0 <= j; j--) "" === n[j] && n.splice(j, 1);
						0 < n.length && (i.style = (i.style ? i.style + "; " : "") + n.join("; "));
						for (j in i) m.push(j + '="' + CKEDITOR.tools.htmlEncode(i[j]) + '" ');
						m.push(">", o, "</", h, ">");
						c.push(m.join(""));
						(this._ || (this._ = {})).dialog = a;
						"boolean" == typeof b.isChanged && (this.isChanged = function() {
							return b.isChanged
						});
						"function" == typeof b.isChanged && (this.isChanged = b.isChanged);
						"function" == typeof b.setValue && (this.setValue = CKEDITOR.tools.override(this.setValue, function(a) {
							return function(c) {
								a.call(this, b.setValue.call(this, c))
							}
						}));
						"function" == typeof b.getValue && (this.getValue = CKEDITOR.tools.override(this.getValue, function(a) {
							return function() {
								return b.getValue.call(this, a.call(this))
							}
						}));
						CKEDITOR.event.implementOn(this);
						this.registerEvents(b);
						this.accessKeyUp && (this.accessKeyDown && b.accessKey) && O(this, a, "CTRL+" + b.accessKey);
						var p = this;
						a.on("load", function() {
							var b = p.getInputElement();
							if (b) {
								var c = p.type in {
									checkbox: 1,
									ratio: 1
								} && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
								b.on("focus", function() {
									a._.tabBarMode = false;
									a._.hasFocus = true;
									p.fire("focus");
									c && this.addClass(c)
								});
								b.on("blur", function() {
									p.fire("blur");
									c && this.removeClass(c)
								})
							}
						});
						CKEDITOR.tools.extend(this,
							b);
						this.keyboardFocusable && (this.tabIndex = b.tabIndex || 0, this.focusIndex = a._.focusList.push(this) - 1, this.on("focus", function() {
							a._.currentFocusIndex = p.focusIndex
						}))
					}
				},
				hbox: function(a, b, c, e, d) {
					if (!(4 > arguments.length)) {
						this._ || (this._ = {});
						var g = this._.children = b,
							f = d && d.widths || null,
							h = d && d.height || null,
							m, k = {
								role: "presentation"
							};
						d && d.align && (k.align = d.align);
						CKEDITOR.ui.dialog.uiElement.call(this, a, d || {
							type: "hbox"
						}, e, "table", {}, k, function() {
							var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
							for (m = 0; m < c.length; m++) {
								var b =
									"cke_dialog_ui_hbox_child",
									e = [];
								0 === m && (b = "cke_dialog_ui_hbox_first");
								m == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
								a.push('<td class="', b, '" role="presentation" ');
								f ? f[m] && e.push("width:" + r(f[m])) : e.push("width:" + Math.floor(100 / c.length) + "%");
								h && e.push("height:" + r(h));
								d && void 0 != d.padding && e.push("padding:" + r(d.padding));
								CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[m].align) && e.push("text-align:" + g[m].align);
								0 < e.length && a.push('style="' + e.join("; ") + '" ');
								a.push(">", c[m], "</td>")
							}
							a.push("</tr></tbody>");
							return a.join("")
						})
					}
				},
				vbox: function(a, b, c, e, d) {
					if (!(3 > arguments.length)) {
						this._ || (this._ = {});
						var g = this._.children = b,
							f = d && d.width || null,
							h = d && d.heights || null;
						CKEDITOR.ui.dialog.uiElement.call(this, a, d || {
							type: "vbox"
						}, e, "div", null, {
							role: "presentation"
						}, function() {
							var b = ['<table role="presentation" cellspacing="0" border="0" '];
							b.push('style="');
							d && d.expand && b.push("height:100%;");
							b.push("width:" + r(f || "100%"), ";");
							CKEDITOR.env.webkit && b.push("float:none;");
							b.push('"');
							b.push('align="', CKEDITOR.tools.htmlEncode(d &&
								d.align || ("ltr" == a.getParentEditor().lang.dir ? "left" : "right")), '" ');
							b.push("><tbody>");
							for (var e = 0; e < c.length; e++) {
								var i = [];
								b.push('<tr><td role="presentation" ');
								f && i.push("width:" + r(f || "100%"));
								h ? i.push("height:" + r(h[e])) : d && d.expand && i.push("height:" + Math.floor(100 / c.length) + "%");
								d && void 0 != d.padding && i.push("padding:" + r(d.padding));
								CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[e].align) && i.push("text-align:" + g[e].align);
								0 < i.length && b.push('style="', i.join("; "), '" ');
								b.push(' class="cke_dialog_ui_vbox_child">',
									c[e], "</td></tr>")
							}
							b.push("</tbody></table>");
							return b.join("")
						})
					}
				}
			}
		})();
		CKEDITOR.ui.dialog.uiElement.prototype = {
			getElement: function() {
				return CKEDITOR.document.getById(this.domId)
			},
			getInputElement: function() {
				return this.getElement()
			},
			getDialog: function() {
				return this._.dialog
			},
			setValue: function(a, b) {
				this.getInputElement().setValue(a);
				!b && this.fire("change", {
					value: a
				});
				return this
			},
			getValue: function() {
				return this.getInputElement().getValue()
			},
			isChanged: function() {
				return !1
			},
			selectParentTab: function() {
				for (var a =
						this.getInputElement();
					(a = a.getParent()) && -1 == a.$.className.search("cke_dialog_page_contents"););
				if (!a) return this;
				a = a.getAttribute("name");
				this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
				return this
			},
			focus: function() {
				this.selectParentTab().getInputElement().focus();
				return this
			},
			registerEvents: function(a) {
				var b = /^on([A-Z]\w+)/,
					c, e = function(a, b, c, d) {
						b.on("load", function() {
							a.getInputElement().on(c, d, a)
						})
					},
					d;
				for (d in a)
					if (c = d.match(b)) this.eventProcessors[d] ? this.eventProcessors[d].call(this,
						this._.dialog, a[d]) : e(this, this._.dialog, c[1].toLowerCase(), a[d]);
				return this
			},
			eventProcessors: {
				onLoad: function(a, b) {
					a.on("load", b, this)
				},
				onShow: function(a, b) {
					a.on("show", b, this)
				},
				onHide: function(a, b) {
					a.on("hide", b, this)
				}
			},
			accessKeyDown: function() {
				this.focus()
			},
			accessKeyUp: function() {},
			disable: function() {
				var a = this.getElement();
				this.getInputElement().setAttribute("disabled", "true");
				a.addClass("cke_disabled")
			},
			enable: function() {
				var a = this.getElement();
				this.getInputElement().removeAttribute("disabled");
				a.removeClass("cke_disabled")
			},
			isEnabled: function() {
				return !this.getElement().hasClass("cke_disabled")
			},
			isVisible: function() {
				return this.getInputElement().isVisible()
			},
			isFocusable: function() {
				return !this.isEnabled() || !this.isVisible() ? !1 : !0
			}
		};
		CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
			getChild: function(a) {
				if (1 > arguments.length) return this._.children.concat();
				a.splice || (a = [a]);
				return 2 > a.length ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ?
					this._.children[a[0]].getChild(a.slice(1, a.length)) : null
			}
		}, !0);
		CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
		(function() {
			var a = {
				build: function(a, c, e) {
					for (var d = c.children, g, f = [], h = [], m = 0; m < d.length && (g = d[m]); m++) {
						var k = [];
						f.push(k);
						h.push(CKEDITOR.dialog._.uiElementBuilders[g.type].build(a, g, k))
					}
					return new CKEDITOR.ui.dialog[c.type](a, h, f, e, c)
				}
			};
			CKEDITOR.dialog.addUIElement("hbox", a);
			CKEDITOR.dialog.addUIElement("vbox", a)
		})();
		CKEDITOR.dialogCommand = function(a, b) {
			this.dialogName = a;
			CKEDITOR.tools.extend(this, b, !0)
		};
		CKEDITOR.dialogCommand.prototype = {
			exec: function(a) {
				a.openDialog(this.dialogName)
			},
			canUndo: !1,
			editorFocus: 1
		};
		(function() {
			var a = /^([a]|[^a])+$/,
				b = /^\d*$/,
				c = /^\d*(?:\.\d+)?$/,
				e = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
				d = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
				g = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
			CKEDITOR.VALIDATE_OR = 1;
			CKEDITOR.VALIDATE_AND = 2;
			CKEDITOR.dialog.validate = {
				functions: function() {
					var a = arguments;
					return function() {
						var b = this && this.getValue ? this.getValue() :
							a[0],
							c = void 0,
							d = CKEDITOR.VALIDATE_AND,
							e = [],
							g;
						for (g = 0; g < a.length; g++)
							if ("function" == typeof a[g]) e.push(a[g]);
							else break;
						g < a.length && "string" == typeof a[g] && (c = a[g], g++);
						g < a.length && "number" == typeof a[g] && (d = a[g]);
						var j = d == CKEDITOR.VALIDATE_AND ? !0 : !1;
						for (g = 0; g < e.length; g++) j = d == CKEDITOR.VALIDATE_AND ? j && e[g](b) : j || e[g](b);
						return !j ? c : !0
					}
				},
				regex: function(a, b) {
					return function(c) {
						c = this && this.getValue ? this.getValue() : c;
						return !a.test(c) ? b : !0
					}
				},
				notEmpty: function(b) {
					return this.regex(a, b)
				},
				integer: function(a) {
					return this.regex(b,
						a)
				},
				number: function(a) {
					return this.regex(c, a)
				},
				cssLength: function(a) {
					return this.functions(function(a) {
						return d.test(CKEDITOR.tools.trim(a))
					}, a)
				},
				htmlLength: function(a) {
					return this.functions(function(a) {
						return e.test(CKEDITOR.tools.trim(a))
					}, a)
				},
				inlineStyle: function(a) {
					return this.functions(function(a) {
						return g.test(CKEDITOR.tools.trim(a))
					}, a)
				},
				equals: function(a, b) {
					return this.functions(function(b) {
						return b == a
					}, b)
				},
				notEqual: function(a, b) {
					return this.functions(function(b) {
						return b != a
					}, b)
				}
			};
			CKEDITOR.on("instanceDestroyed",
				function(a) {
					if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
						for (var b; b = CKEDITOR.dialog._.currentTop;) b.hide();
						for (var c in w) w[c].remove();
						w = {}
					}
					var a = a.editor._.storedDialogs,
						d;
					for (d in a) a[d].destroy()
				})
		})();
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			openDialog: function(a, b) {
				var c = null,
					e = CKEDITOR.dialog._.dialogDefinitions[a];
				null === CKEDITOR.dialog._.currentTop && J(this);
				if ("function" == typeof e) c = this._.storedDialogs || (this._.storedDialogs = {}), c = c[a] || (c[a] = new CKEDITOR.dialog(this, a)), b && b.call(c,
					c), c.show();
				else {
					if ("failed" == e) throw K(this), Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
					"string" == typeof e && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e), function() {
						"function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
						this.openDialog(a, b)
					}, this, 0, 1)
				}
				CKEDITOR.skin.loadPart("dialog");
				return c
			}
		})
	})();
	CKEDITOR.plugins.add("dialog", {
		requires: "dialogui",
		init: function(t) {
			t.on("doubleclick", function(u) {
				u.data.dialog && t.openDialog(u.data.dialog)
			}, null, null, 999)
		}
	});
	CKEDITOR.plugins.add("about", {
		requires: "dialog",
		init: function(a) {
			var b = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
			b.modes = {
				wysiwyg: 1,
				source: 1
			};
			b.canUndo = !1;
			b.readOnly = 1;
			a.ui.addButton && a.ui.addButton("About", {
				label: a.lang.about.title,
				command: "about",
				toolbar: "about"
			});
			CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
		}
	});
	(function() {
		CKEDITOR.plugins.add("a11yhelp", {
			requires: "dialog",
			availableLangs: {
				ar: 1,
				bg: 1,
				ca: 1,
				cs: 1,
				cy: 1,
				da: 1,
				de: 1,
				el: 1,
				en: 1,
				"en-gb": 1,
				eo: 1,
				es: 1,
				et: 1,
				fa: 1,
				fi: 1,
				fr: 1,
				"fr-ca": 1,
				gl: 1,
				gu: 1,
				he: 1,
				hi: 1,
				hr: 1,
				hu: 1,
				id: 1,
				it: 1,
				ja: 1,
				km: 1,
				ko: 1,
				ku: 1,
				lt: 1,
				lv: 1,
				mk: 1,
				mn: 1,
				nb: 1,
				nl: 1,
				no: 1,
				pl: 1,
				pt: 1,
				"pt-br": 1,
				ro: 1,
				ru: 1,
				si: 1,
				sk: 1,
				sl: 1,
				sq: 1,
				sr: 1,
				"sr-latn": 1,
				sv: 1,
				th: 1,
				tr: 1,
				tt: 1,
				ug: 1,
				uk: 1,
				vi: 1,
				zh: 1,
				"zh-cn": 1
			},
			init: function(b) {
				var c = this;
				b.addCommand("a11yHelp", {
					exec: function() {
						var a = b.langCode,
							a = c.availableLangs[a] ? a : c.availableLangs[a.replace(/-.*/,
								"")] ? a.replace(/-.*/, "") : "en";
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + a + ".js"), function() {
							b.lang.a11yhelp = c.langEntries[a];
							b.openDialog("a11yHelp")
						})
					},
					modes: {
						wysiwyg: 1,
						source: 1
					},
					readOnly: 1,
					canUndo: !1
				});
				b.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
				CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js")
			}
		})
	})();
	CKEDITOR.plugins.add("basicstyles", {
		init: function(c) {
			var e = 0,
				d = function(g, d, b, a) {
					if (a) {
						var a = new CKEDITOR.style(a),
							f = h[b];
						f.unshift(a);
						c.attachStyleStateChange(a, function(a) {
							!c.readOnly && c.getCommand(b).setState(a)
						});
						c.addCommand(b, new CKEDITOR.styleCommand(a, {
							contentForms: f
						}));
						c.ui.addButton && c.ui.addButton(g, {
							label: d,
							command: b,
							toolbar: "basicstyles," + (e += 10)
						})
					}
				},
				h = {
					bold: ["strong", "b", ["span",
						function(a) {
							a = a.styles["font-weight"];
							return "bold" == a || 700 <= +a
						}
					]],
					italic: ["em", "i", ["span",
						function(a) {
							return "italic" ==
								a.styles["font-style"]
						}
					]],
					underline: ["u", ["span",
						function(a) {
							return "underline" == a.styles["text-decoration"]
						}
					]],
					strike: ["s", "strike", ["span",
						function(a) {
							return "line-through" == a.styles["text-decoration"]
						}
					]],
					subscript: ["sub"],
					superscript: ["sup"]
				},
				b = c.config,
				a = c.lang.basicstyles;
			d("Bold", a.bold, "bold", b.coreStyles_bold);
			d("Italic", a.italic, "italic", b.coreStyles_italic);
			d("Underline", a.underline, "underline", b.coreStyles_underline);
			d("Strike", a.strike, "strike", b.coreStyles_strike);
			d("Subscript", a.subscript,
				"subscript", b.coreStyles_subscript);
			d("Superscript", a.superscript, "superscript", b.coreStyles_superscript);
			c.setKeystroke([
				[CKEDITOR.CTRL + 66, "bold"],
				[CKEDITOR.CTRL + 73, "italic"],
				[CKEDITOR.CTRL + 85, "underline"]
			])
		}
	});
	CKEDITOR.config.coreStyles_bold = {
		element: "strong",
		overrides: "b"
	};
	CKEDITOR.config.coreStyles_italic = {
		element: "em",
		overrides: "i"
	};
	CKEDITOR.config.coreStyles_underline = {
		element: "u"
	};
	CKEDITOR.config.coreStyles_strike = {
		element: "s",
		overrides: "strike"
	};
	CKEDITOR.config.coreStyles_subscript = {
		element: "sub"
	};
	CKEDITOR.config.coreStyles_superscript = {
		element: "sup"
	};
	(function() {
		var k = {
			exec: function(g) {
				var a = g.getCommand("blockquote").state,
					i = g.getSelection(),
					c = i && i.getRanges()[0];
				if (c) {
					var h = i.createBookmarks();
					if (CKEDITOR.env.ie) {
						var e = h[0].startNode,
							b = h[0].endNode,
							d;
						if (e && "blockquote" == e.getParent().getName())
							for (d = e; d = d.getNext();)
								if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
									e.move(d, !0);
									break
								}
						if (b && "blockquote" == b.getParent().getName())
							for (d = b; d = d.getPrevious();)
								if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
									b.move(d);
									break
								}
					}
					var f = c.createIterator();
					f.enlargeBr = g.config.enterMode != CKEDITOR.ENTER_BR;
					if (a == CKEDITOR.TRISTATE_OFF) {
						for (e = []; a = f.getNextParagraph();) e.push(a);
						1 > e.length && (a = g.document.createElement(g.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), b = h.shift(), c.insertNode(a), a.append(new CKEDITOR.dom.text("﻿", g.document)), c.moveToBookmark(b), c.selectNodeContents(a), c.collapse(!0), b = c.createBookmark(), e.push(a), h.unshift(b));
						d = e[0].getParent();
						c = [];
						for (b = 0; b < e.length; b++) a = e[b], d = d.getCommonAncestor(a.getParent());
						for (a = {
							table: 1,
							tbody: 1,
							tr: 1,
							ol: 1,
							ul: 1
						}; a[d.getName()];) d = d.getParent();
						for (b = null; 0 < e.length;) {
							for (a = e.shift(); !a.getParent().equals(d);) a = a.getParent();
							a.equals(b) || c.push(a);
							b = a
						}
						for (; 0 < c.length;)
							if (a = c.shift(), "blockquote" == a.getName()) {
								for (b = new CKEDITOR.dom.documentFragment(g.document); a.getFirst();) b.append(a.getFirst().remove()), e.push(b.getLast());
								b.replace(a)
							} else e.push(a);
						c = g.document.createElement("blockquote");
						for (c.insertBefore(e[0]); 0 < e.length;) a = e.shift(), c.append(a)
					} else if (a == CKEDITOR.TRISTATE_ON) {
						b = [];
						for (d = {}; a = f.getNextParagraph();) {
							for (e = c = null; a.getParent();) {
								if ("blockquote" == a.getParent().getName()) {
									c = a.getParent();
									e = a;
									break
								}
								a = a.getParent()
							}
							c && (e && !e.getCustomData("blockquote_moveout")) && (b.push(e), CKEDITOR.dom.element.setMarker(d, e, "blockquote_moveout", !0))
						}
						CKEDITOR.dom.element.clearAllMarkers(d);
						a = [];
						e = [];
						for (d = {}; 0 < b.length;) f = b.shift(), c = f.getParent(), f.getPrevious() ? f.getNext() ? (f.breakParent(f.getParent()), e.push(f.getNext())) : f.remove().insertAfter(c) : f.remove().insertBefore(c), c.getCustomData("blockquote_processed") ||
							(e.push(c), CKEDITOR.dom.element.setMarker(d, c, "blockquote_processed", !0)), a.push(f);
						CKEDITOR.dom.element.clearAllMarkers(d);
						for (b = e.length - 1; 0 <= b; b--) {
							c = e[b];
							a: {
								d = c;
								for (var f = 0, k = d.getChildCount(), j = void 0; f < k && (j = d.getChild(f)); f++)
									if (j.type == CKEDITOR.NODE_ELEMENT && j.isBlockBoundary()) {
										d = !1;
										break a
									}
								d = !0
							}
							d && c.remove()
						}
						if (g.config.enterMode == CKEDITOR.ENTER_BR)
							for (c = !0; a.length;)
								if (f = a.shift(), "div" == f.getName()) {
									b = new CKEDITOR.dom.documentFragment(g.document);
									c && (f.getPrevious() && !(f.getPrevious().type ==
										CKEDITOR.NODE_ELEMENT && f.getPrevious().isBlockBoundary())) && b.append(g.document.createElement("br"));
									for (c = f.getNext() && !(f.getNext().type == CKEDITOR.NODE_ELEMENT && f.getNext().isBlockBoundary()); f.getFirst();) f.getFirst().remove().appendTo(b);
									c && b.append(g.document.createElement("br"));
									b.replace(f);
									c = !1
								}
					}
					i.selectBookmarks(h);
					g.focus()
				}
			},
			refresh: function(g, a) {
				this.setState(g.elementPath(a.block || a.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
			},
			context: "blockquote",
			allowedContent: "blockquote",
			requiredContent: "blockquote"
		};
		CKEDITOR.plugins.add("blockquote", {
			init: function(g) {
				g.blockless || (g.addCommand("blockquote", k), g.ui.addButton && g.ui.addButton("Blockquote", {
					label: g.lang.blockquote.toolbar,
					command: "blockquote",
					toolbar: "blocks,10"
				}))
			}
		})
	})();
	(function() {
		function v(b) {
			function a() {
				var e = b.editable();
				e.on(p, function(b) {
					(!CKEDITOR.env.ie || !n) && u(b)
				});
				CKEDITOR.env.ie && e.on("paste", function(e) {
					q || (g(), e.data.preventDefault(), u(e), h("paste") || b.openDialog("paste"))
				});
				CKEDITOR.env.ie && (e.on("contextmenu", i, null, null, 0), e.on("beforepaste", function(b) {
					b.data && !b.data.$.ctrlKey && i()
				}, null, null, 0));
				e.on("beforecut", function() {
					!n && j(b)
				});
				var a;
				e.attachListener(CKEDITOR.env.ie ? e : b.document.getDocumentElement(), "mouseup", function() {
					a = setTimeout(function() {
							r()
						},
						0)
				});
				b.on("destroy", function() {
					clearTimeout(a)
				});
				e.on("keyup", r)
			}

			function c(e) {
				return {
					type: e,
					canUndo: "cut" == e,
					startDisabled: !0,
					exec: function() {
						"cut" == this.type && j();
						var e;
						var a = this.type;
						if (CKEDITOR.env.ie) e = h(a);
						else try {
							e = b.document.$.execCommand(a, !1, null)
						} catch (d) {
							e = !1
						}
						e || alert(b.lang.clipboard[this.type + "Error"]);
						return e
					}
				}
			}

			function d() {
				return {
					canUndo: !1,
					async: !0,
					exec: function(b, a) {
						var d = function(a, d) {
								a && f(a.type, a.dataValue, !!d);
								b.fire("afterCommandExec", {
									name: "paste",
									command: c,
									returnValue: !!a
								})
							},
							c = this;
						"string" == typeof a ? d({
							type: "auto",
							dataValue: a
						}, 1) : b.getClipboardData(d)
					}
				}
			}

			function g() {
				q = 1;
				setTimeout(function() {
					q = 0
				}, 100)
			}

			function i() {
				n = 1;
				setTimeout(function() {
					n = 0
				}, 10)
			}

			function h(e) {
				var a = b.document,
					d = a.getBody(),
					c = !1,
					j = function() {
						c = !0
					};
				d.on(e, j);
				(7 < CKEDITOR.env.version ? a.$ : a.$.selection.createRange()).execCommand(e);
				d.removeListener(e, j);
				return c
			}

			function f(e, a, d) {
				e = {
					type: e
				};
				if (d && !1 === b.fire("beforePaste", e) || !a) return !1;
				e.dataValue = a;
				return b.fire("paste", e)
			}

			function j() {
				if (CKEDITOR.env.ie &&
					!CKEDITOR.env.quirks) {
					var e = b.getSelection(),
						a, d, c;
					if (e.getType() == CKEDITOR.SELECTION_ELEMENT && (a = e.getSelectedElement())) d = e.getRanges()[0], c = b.document.createText(""), c.insertBefore(a), d.setStartBefore(c), d.setEndAfter(a), e.selectRanges([d]), setTimeout(function() {
						a.getParent() && (c.remove(), e.selectElement(a))
					}, 0)
				}
			}

			function l(a, d) {
				var c = b.document,
					j = b.editable(),
					l = function(b) {
						b.cancel()
					},
					g;
				if (!c.getById("cke_pastebin")) {
					var i = b.getSelection(),
						s = i.createBookmarks(),
						k = new CKEDITOR.dom.element((CKEDITOR.env.webkit ||
							j.is("body")) && !CKEDITOR.env.ie ? "body" : "div", c);
					k.setAttributes({
						id: "cke_pastebin",
						"data-cke-temp": "1"
					});
					var f = 0,
						c = c.getWindow();
					CKEDITOR.env.webkit ? (j.append(k), k.addClass("cke_editable"), j.is("body") || (f = "static" != j.getComputedStyle("position") ? j : CKEDITOR.dom.element.get(j.$.offsetParent), f = f.getDocumentPosition().y)) : j.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(k);
					k.setStyles({
						position: "absolute",
						top: c.getScrollPosition().y - f + 10 + "px",
						width: "1px",
						height: Math.max(1, c.getViewPaneSize().height -
							20) + "px",
						overflow: "hidden",
						margin: 0,
						padding: 0
					});
					(f = k.getParent().isReadOnly()) ? (k.setOpacity(0), k.setAttribute("contenteditable", !0)) : k.setStyle("ltr" == b.config.contentsLangDirection ? "left" : "right", "-1000px");
					b.on("selectionChange", l, null, null, 0);
					if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) g = j.once("blur", l, null, null, -100);
					f && k.focus();
					f = new CKEDITOR.dom.range(k);
					f.selectNodeContents(k);
					var h = f.select();
					CKEDITOR.env.ie && (g = j.once("blur", function() {
						b.lockSelection(h)
					}));
					var m = CKEDITOR.document.getWindow().getScrollPosition().y;
					setTimeout(function() {
						if (CKEDITOR.env.webkit) CKEDITOR.document.getBody().$.scrollTop = m;
						g && g.removeListener();
						CKEDITOR.env.ie && j.focus();
						i.selectBookmarks(s);
						k.remove();
						var a;
						if (CKEDITOR.env.webkit && (a = k.getFirst()) && a.is && a.hasClass("Apple-style-span")) k = a;
						b.removeListener("selectionChange", l);
						d(k.getHtml())
					}, 0)
				}
			}

			function s() {
				if (CKEDITOR.env.ie) {
					b.focus();
					g();
					var a = b.focusManager;
					a.lock();
					if (b.editable().fire(p) && !h("paste")) return a.unlock(), !1;
					a.unlock()
				} else try {
					if (b.editable().fire(p) && !b.document.$.execCommand("Paste", !1, null)) throw 0;
				} catch (d) {
					return !1
				}
				return !0
			}

			function o(a) {
				if ("wysiwyg" == b.mode) switch (a.data.keyCode) {
					case CKEDITOR.CTRL + 86:
					case CKEDITOR.SHIFT + 45:
						a = b.editable();
						g();
						!CKEDITOR.env.ie && a.fire("beforepaste");
						break;
					case CKEDITOR.CTRL + 88:
					case CKEDITOR.SHIFT + 46:
						b.fire("saveSnapshot"), setTimeout(function() {
							b.fire("saveSnapshot")
						}, 50)
				}
			}

			function u(a) {
				var d = {
						type: "auto"
					},
					c = b.fire("beforePaste", d);
				l(a, function(b) {
					b = b.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
					c && f(d.type, b, 0, 1)
				})
			}

			function r() {
				if ("wysiwyg" ==
					b.mode) {
					var a = m("paste");
					b.getCommand("cut").setState(m("cut"));
					b.getCommand("copy").setState(m("copy"));
					b.getCommand("paste").setState(a);
					b.fire("pasteState", a)
				}
			}

			function m(a) {
				if (t && a in {
					paste: 1,
					cut: 1
				}) return CKEDITOR.TRISTATE_DISABLED;
				if ("paste" == a) return CKEDITOR.TRISTATE_OFF;
				var a = b.getSelection(),
					d = a.getRanges();
				return a.getType() == CKEDITOR.SELECTION_NONE || 1 == d.length && d[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
			}
			var n = 0,
				q = 0,
				t = 0,
				p = CKEDITOR.env.ie ? "beforepaste" : "paste";
			(function() {
				b.on("key",
					o);
				b.on("contentDom", a);
				b.on("selectionChange", function(b) {
					t = b.data.selection.getRanges()[0].checkReadOnly();
					r()
				});
				b.contextMenu && b.contextMenu.addListener(function(b, a) {
					t = a.getRanges()[0].checkReadOnly();
					return {
						cut: m("cut"),
						copy: m("copy"),
						paste: m("paste")
					}
				})
			})();
			(function() {
				function a(d, c, j, e, l) {
					var g = b.lang.clipboard[c];
					b.addCommand(c, j);
					b.ui.addButton && b.ui.addButton(d, {
						label: g,
						command: c,
						toolbar: "clipboard," + e
					});
					b.addMenuItems && b.addMenuItem(c, {
						label: g,
						command: c,
						group: "clipboard",
						order: l
					})
				}
				a("Cut",
					"cut", c("cut"), 10, 1);
				a("Copy", "copy", c("copy"), 20, 4);
				a("Paste", "paste", d(), 30, 8)
			})();
			b.getClipboardData = function(a, d) {
				function c(a) {
					a.removeListener();
					a.cancel();
					d(a.data)
				}

				function j(a) {
					a.removeListener();
					a.cancel();
					i = !0;
					d({
						type: f,
						dataValue: a.data
					})
				}

				function l() {
					this.customTitle = a && a.title
				}
				var g = !1,
					f = "auto",
					i = !1;
				d || (d = a, a = null);
				b.on("paste", c, null, null, 0);
				b.on("beforePaste", function(a) {
					a.removeListener();
					g = true;
					f = a.data.type
				}, null, null, 1E3);
				!1 === s() && (b.removeListener("paste", c), g && b.fire("pasteDialog",
					l) ? (b.on("pasteDialogCommit", j), b.on("dialogHide", function(a) {
					a.removeListener();
					a.data.removeListener("pasteDialogCommit", j);
					setTimeout(function() {
						i || d(null)
					}, 10)
				})) : d(null))
			}
		}

		function w(b) {
			if (CKEDITOR.env.webkit) {
				if (!b.match(/^[^<]*$/g) && !b.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) return "html"
			} else if (CKEDITOR.env.ie) {
				if (!b.match(/^([^<]|<br( ?\/)?>)*$/gi) && !b.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) return "html"
			} else if (CKEDITOR.env.gecko) {
				if (!b.match(/^([^<]|<br( ?\/)?>)*$/gi)) return "html"
			} else return "html";
			return "htmlifiedtext"
		}

		function x(b, a) {
			function c(a) {
				return CKEDITOR.tools.repeat("</p><p>", ~~ (a / 2)) + (1 == a % 2 ? "<br>" : "")
			}
			a = a.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
			a = a.replace(/<\/?[A-Z]+>/g, function(a) {
				return a.toLowerCase()
			});
			if (a.match(/^[^<]$/)) return a;
			CKEDITOR.env.webkit && -1 < a.indexOf("<div>") && (a = a.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>"), a.match(/<div>(<br>|)<\/div>/) && (a = "<p>" +
				a.replace(/(<div>(<br>|)<\/div>)+/g, function(a) {
					return c(a.split("</div><div>").length + 1)
				}) + "</p>"), a = a.replace(/<\/div><div>/g, "<br>"), a = a.replace(/<\/?div>/g, ""));
			CKEDITOR.env.gecko && b.enterMode != CKEDITOR.ENTER_BR && (CKEDITOR.env.gecko && (a = a.replace(/^<br><br>$/, "<br>")), -1 < a.indexOf("<br><br>") && (a = "<p>" + a.replace(/(<br>){2,}/g, function(a) {
				return c(a.length / 4)
			}) + "</p>"));
			return o(b, a)
		}

		function y() {
			var b = new CKEDITOR.htmlParser.filter,
				a = {
					blockquote: 1,
					dl: 1,
					fieldset: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					ol: 1,
					p: 1,
					table: 1,
					ul: 1
				},
				c = CKEDITOR.tools.extend({
					br: 0
				}, CKEDITOR.dtd.$inline),
				d = {
					p: 1,
					br: 1,
					"cke:br": 1
				},
				g = CKEDITOR.dtd,
				i = CKEDITOR.tools.extend({
					area: 1,
					basefont: 1,
					embed: 1,
					iframe: 1,
					map: 1,
					object: 1,
					param: 1
				}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata),
				h = function(a) {
					delete a.name;
					a.add(new CKEDITOR.htmlParser.text(" "))
				},
				f = function(a) {
					for (var b = a, c;
						(b = b.next) && b.name && b.name.match(/^h\d$/);) {
						c = new CKEDITOR.htmlParser.element("cke:br");
						c.isEmpty = !0;
						for (a.add(c); c = b.children.shift();) a.add(c)
					}
				};
			b.addRules({
				elements: {
					h1: f,
					h2: f,
					h3: f,
					h4: f,
					h5: f,
					h6: f,
					img: function(a) {
						var a = CKEDITOR.tools.trim(a.attributes.alt || ""),
							b = " ";
						a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
						return new CKEDITOR.htmlParser.text(b)
					},
					td: h,
					th: h,
					$: function(b) {
						var f = b.name,
							h;
						if (i[f]) return !1;
						b.attributes = {};
						if ("br" == f) return b;
						if (a[f]) b.name = "p";
						else if (c[f]) delete b.name;
						else if (g[f]) {
							h = new CKEDITOR.htmlParser.element("cke:br");
							h.isEmpty = !0;
							if (CKEDITOR.dtd.$empty[f]) return h;
							b.add(h, 0);
							h = h.clone();
							h.isEmpty = !0;
							b.add(h);
							delete b.name
						}
						d[b.name] ||
							delete b.name;
						return b
					}
				}
			}, {
				applyToAll: !0
			});
			return b
		}

		function z(b, a, c) {
			var a = new CKEDITOR.htmlParser.fragment.fromHtml(a),
				d = new CKEDITOR.htmlParser.basicWriter;
			a.writeHtml(d, c);
			var a = d.getHtml(),
				a = a.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""),
				g = 0,
				a = a.replace(/<\/?p>/g, function(a) {
					if ("<p>" == a) {
						if (1 < ++g) return "</p><p>"
					} else if (0 <
						--g) return "</p><p>";
					return a
				}).replace(/<p><\/p>/g, "");
			return o(b, a)
		}

		function o(b, a) {
			b.enterMode == CKEDITOR.ENTER_BR ? a = a.replace(/(<\/p><p>)+/g, function(a) {
				return CKEDITOR.tools.repeat("<br>", 2 * (a.length / 7))
			}).replace(/<\/?p>/g, "") : b.enterMode == CKEDITOR.ENTER_DIV && (a = a.replace(/<(\/)?p>/g, "<$1div>"));
			return a
		}
		CKEDITOR.plugins.add("clipboard", {
			requires: "dialog",
			init: function(b) {
				var a;
				v(b);
				CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
				b.on("paste", function(a) {
					var b = a.data.dataValue,
						g = CKEDITOR.dtd.$block; - 1 < b.indexOf("Apple-") && (b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " "), "html" != a.data.type && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(a, b) {
						return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
					})), -1 < b.indexOf('<br class="Apple-interchange-newline">') && (a.data.startsWithEOL = 1, a.data.preSniffing = "html", b = b.replace(/<br class="Apple-interchange-newline">/, "")), b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1"));
					if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
						var i,
							h, f = new CKEDITOR.dom.element("div");
						for (f.setHtml(b); 1 == f.getChildCount() && (i = f.getFirst()) && i.type == CKEDITOR.NODE_ELEMENT && (i.hasClass("cke_editable") || i.hasClass("cke_contents"));) f = h = i;
						h && (b = h.getHtml().replace(/<br>$/i, ""))
					}
					CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, d) {
						if (d.toLowerCase() in g) {
							a.data.preSniffing = "html";
							return "<" + d
						}
						return b
					}) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function(b, d) {
						if (d in g) {
							a.data.endsWithEOL = 1;
							return "</" + d + ">"
						}
						return b
					}) :
						CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
					a.data.dataValue = b
				}, null, null, 3);
				b.on("paste", function(c) {
					var c = c.data,
						d = c.type,
						g = c.dataValue,
						i, h = b.config.clipboard_defaultContentType || "html";
					i = "html" == d || "html" == c.preSniffing ? "html" : w(g);
					"htmlifiedtext" == i ? g = x(b.config, g) : "text" == d && "html" == i && (g = z(b.config, g, a || (a = y(b))));
					c.startsWithEOL && (g = '<br data-cke-eol="1">' + g);
					c.endsWithEOL && (g += '<br data-cke-eol="1">');
					"auto" == d && (d = "html" == i || "html" == h ? "html" : "text");
					c.type = d;
					c.dataValue = g;
					delete c.preSniffing;
					delete c.startsWithEOL;
					delete c.endsWithEOL
				}, null, null, 6);
				b.on("paste", function(a) {
					a = a.data;
					b.insertHtml(a.dataValue, a.type);
					setTimeout(function() {
						b.fire("afterPaste")
					}, 0)
				}, null, null, 1E3);
				b.on("pasteDialog", function(a) {
					setTimeout(function() {
						b.openDialog("paste", a.data)
					}, 0)
				})
			}
		})
	})();
	(function() {
		CKEDITOR.plugins.add("panel", {
			beforeInit: function(a) {
				a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
			}
		});
		CKEDITOR.UI_PANEL = "panel";
		CKEDITOR.ui.panel = function(a, b) {
			b && CKEDITOR.tools.extend(this, b);
			CKEDITOR.tools.extend(this, {
				className: "",
				css: []
			});
			this.id = CKEDITOR.tools.getNextId();
			this.document = a;
			this.isFramed = this.forceIFrame || this.css.length;
			this._ = {
				blocks: {}
			}
		};
		CKEDITOR.ui.panel.handler = {
			create: function(a) {
				return new CKEDITOR.ui.panel(a)
			}
		};
		var f = CKEDITOR.addTemplate("panel",
				'<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'),
			g = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
			h = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
		CKEDITOR.ui.panel.prototype = {
			render: function(a, b) {
				this.getHolderElement = function() {
					var a = this._.holder;
					if (!a) {
						if (this.isFramed) {
							var a = this.document.getById(this.id + "_frame"),
								b = a.getParent(),
								a = a.getFrameDocument();
							CKEDITOR.env.iOS && b.setStyles({
								overflow: "scroll",
								"-webkit-overflow-scrolling": "touch"
							});
							b = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
								this.isLoaded = !0;
								if (this.onLoad) this.onLoad()
							}, this));
							a.write(h.output(CKEDITOR.tools.extend({
								css: CKEDITOR.tools.buildStyleHtml(this.css),
								onload: "window.parent.CKEDITOR.tools.callFunction(" +
									b + ");"
							}, d)));
							a.getWindow().$.CKEDITOR = CKEDITOR;
							a.on("keydown", function(a) {
								var b = a.data.getKeystroke(),
									c = this.document.getById(this.id).getAttribute("dir");
								this._.onKeyDown && !1 === this._.onKeyDown(b) ? a.data.preventDefault() : (27 == b || b == ("rtl" == c ? 39 : 37)) && this.onEscape && !1 === this.onEscape(b) && a.data.preventDefault()
							}, this);
							a = a.getBody();
							a.unselectable();
							CKEDITOR.env.air && CKEDITOR.tools.callFunction(b)
						} else a = this.document.getById(this.id);
						this._.holder = a
					}
					return a
				};
				var d = {
					editorId: a.id,
					id: this.id,
					langCode: a.langCode,
					dir: a.lang.dir,
					cls: this.className,
					frame: "",
					env: CKEDITOR.env.cssClass,
					"z-index": a.config.baseFloatZIndex + 1
				};
				if (this.isFramed) {
					var e = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
					d.frame = g.output({
						id: this.id + "_frame",
						src: e
					})
				}
				e = f.output(d);
				b && b.push(e);
				return e
			},
			addBlock: function(a, b) {
				b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(),
					b);
				this._.currentBlock || this.showBlock(a);
				return b
			},
			getBlock: function(a) {
				return this._.blocks[a]
			},
			showBlock: function(a) {
				var a = this._.blocks[a],
					b = this._.currentBlock,
					d = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
				b && b.hide();
				this._.currentBlock = a;
				CKEDITOR.fire("ariaWidget", d);
				a._.focusIndex = -1;
				this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
				a.show();
				return a
			},
			destroy: function() {
				this.element && this.element.remove()
			}
		};
		CKEDITOR.ui.panel.block =
			CKEDITOR.tools.createClass({
				$: function(a, b) {
					this.element = a.append(a.getDocument().createElement("div", {
						attributes: {
							tabindex: -1,
							"class": "cke_panel_block"
						},
						styles: {
							display: "none"
						}
					}));
					b && CKEDITOR.tools.extend(this, b);
					this.element.setAttributes({
						role: this.attributes.role || "presentation",
						"aria-label": this.attributes["aria-label"],
						title: this.attributes.title || this.attributes["aria-label"]
					});
					this.keys = {};
					this._.focusIndex = -1;
					this.element.disableContextMenu()
				},
				_: {
					markItem: function(a) {
						-1 != a && (a = this.element.getElementsByTag("a").getItem(this._.focusIndex =
							a), CKEDITOR.env.webkit && a.getDocument().getWindow().focus(), a.focus(), this.onMark && this.onMark(a))
					}
				},
				proto: {
					show: function() {
						this.element.setStyle("display", "")
					},
					hide: function() {
						(!this.onHide || !0 !== this.onHide.call(this)) && this.element.setStyle("display", "none")
					},
					onKeyDown: function(a, b) {
						var d = this.keys[a];
						switch (d) {
							case "next":
								for (var e = this._.focusIndex, d = this.element.getElementsByTag("a"), c; c = d.getItem(++e);)
									if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
										this._.focusIndex = e;
										c.focus();
										break
									}
								return !c &&
									!b ? (this._.focusIndex = -1, this.onKeyDown(a, 1)) : !1;
							case "prev":
								e = this._.focusIndex;
								for (d = this.element.getElementsByTag("a"); 0 < e && (c = d.getItem(--e));) {
									if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
										this._.focusIndex = e;
										c.focus();
										break
									}
									c = null
								}
								return !c && !b ? (this._.focusIndex = d.count(), this.onKeyDown(a, 1)) : !1;
							case "click":
							case "mouseup":
								return e = this._.focusIndex, (c = 0 <= e && this.element.getElementsByTag("a").getItem(e)) && (c.$[d] ? c.$[d]() : c.$["on" + d]()), !1
						}
						return !0
					}
				}
			})
	})();
	CKEDITOR.plugins.add("floatpanel", {
		requires: "panel"
	});
	(function() {
		function q(a, b, c, i, f) {
			var f = CKEDITOR.tools.genKey(b.getUniqueId(), c.getUniqueId(), a.lang.dir, a.uiColor || "", i.css || "", f || ""),
				h = g[f];
			h || (h = g[f] = new CKEDITOR.ui.panel(b, i), h.element = c.append(CKEDITOR.dom.element.createFromHtml(h.render(a), b)), h.element.setStyles({
				display: "none",
				position: "absolute"
			}));
			return h
		}
		var g = {};
		CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
			$: function(a, b, c, i) {
				function f() {
					d.hide()
				}
				c.forceIFrame = 1;
				c.toolbarRelated && a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE &&
					(b = CKEDITOR.document.getById("cke_" + a.name));
				var h = b.getDocument(),
					i = q(a, h, b, c, i || 0),
					j = i.element,
					l = j.getFirst(),
					d = this;
				j.disableContextMenu();
				this.element = j;
				this._ = {
					editor: a,
					panel: i,
					parentElement: b,
					definition: c,
					document: h,
					iframe: l,
					children: [],
					dir: a.lang.dir
				};
				a.on("mode", f);
				a.on("resize", f);
				h.getWindow().on("resize", f)
			},
			proto: {
				addBlock: function(a, b) {
					return this._.panel.addBlock(a, b)
				},
				addListBlock: function(a, b) {
					return this._.panel.addListBlock(a, b)
				},
				getBlock: function(a) {
					return this._.panel.getBlock(a)
				},
				showBlock: function(a, b, c, i, f, h) {
					var j = this._.panel,
						l = j.showBlock(a);
					this.allowBlur(!1);
					a = this._.editor.editable();
					this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
					var d = this.element,
						a = this._.iframe,
						a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow),
						g = d.getDocument(),
						o = this._.parentElement.getPositionedAncestor(),
						p = b.getDocumentPosition(g),
						g = o ? o.getDocumentPosition(g) : {
							x: 0,
							y: 0
						},
						m = "rtl" == this._.dir,
						e = p.x + (i || 0) - g.x,
						k = p.y + (f || 0) - g.y;
					if (m && (1 == c ||
						4 == c)) e += b.$.offsetWidth;
					else if (!m && (2 == c || 3 == c)) e += b.$.offsetWidth - 1;
					if (3 == c || 4 == c) k += b.$.offsetHeight - 1;
					this._.panel._.offsetParentId = b.getId();
					d.setStyles({
						top: k + "px",
						left: 0,
						display: ""
					});
					d.setOpacity(0);
					d.getFirst().removeStyle("width");
					this._.editor.focusManager.add(a);
					this._.blurSet || (CKEDITOR.event.useCapture = !0, a.on("blur", function(a) {
						this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && (this.visible && !this._.activeChild) && (delete this._.returnFocus, this.hide())
					}, this), a.on("focus",
						function() {
							this._.focused = !0;
							this.hideChild();
							this.allowBlur(!0)
						}, this), CKEDITOR.event.useCapture = !1, this._.blurSet = 1);
					j.onEscape = CKEDITOR.tools.bind(function(a) {
						if (this.onEscape && this.onEscape(a) === false) return false
					}, this);
					CKEDITOR.tools.setTimeout(function() {
							var a = CKEDITOR.tools.bind(function() {
								d.removeStyle("width");
								if (l.autoSize) {
									var a = l.element.getDocument(),
										a = (CKEDITOR.env.webkit ? l.element : a.getBody()).$.scrollWidth;
									CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((d.$.offsetWidth || 0) - (d.$.clientWidth ||
										0) + 3));
									d.setStyle("width", a + 10 + "px");
									a = l.element.$.scrollHeight;
									CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((d.$.offsetHeight || 0) - (d.$.clientHeight || 0) + 3));
									d.setStyle("height", a + "px");
									j._.currentBlock.element.setStyle("display", "none").removeStyle("display")
								} else d.removeStyle("height");
								m && (e = e - d.$.offsetWidth);
								d.setStyle("left", e + "px");
								var b = j.element.getWindow(),
									a = d.$.getBoundingClientRect(),
									b = b.getViewPaneSize(),
									c = a.width || a.right - a.left,
									f = a.height || a.bottom - a.top,
									i = m ? a.right : b.width - a.left,
									g = m ? b.width - a.right : a.left;
								m ? i < c && (e = g > c ? e + c : b.width > c ? e - a.left : e - a.right + b.width) : i < c && (e = g > c ? e - c : b.width > c ? e - a.right + b.width : e - a.left);
								c = a.top;
								b.height - a.top < f && (k = c > f ? k - f : b.height > f ? k - a.bottom + b.height : k - a.top);
								if (CKEDITOR.env.ie) {
									b = a = new CKEDITOR.dom.element(d.$.offsetParent);
									b.getName() == "html" && (b = b.getDocument().getBody());
									b.getComputedStyle("direction") == "rtl" && (e = CKEDITOR.env.ie8Compat ? e - d.getDocument().getDocumentElement().$.scrollLeft * 2 : e - (a.$.scrollWidth - a.$.clientWidth))
								}
								var a = d.getFirst(),
									n;
								(n = a.getCustomData("activePanel")) && n.onHide && n.onHide.call(this, 1);
								a.setCustomData("activePanel", this);
								d.setStyles({
									top: k + "px",
									left: e + "px"
								});
								d.setOpacity(1);
								h && h()
							}, this);
							j.isLoaded ? a() : j.onLoad = a;
							CKEDITOR.tools.setTimeout(function() {
								var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
								this.focus();
								l.element.focus();
								if (CKEDITOR.env.webkit) CKEDITOR.document.getBody().$.scrollTop = a;
								this.allowBlur(true);
								this._.editor.fire("panelShow", this)
							}, 0, this)
						}, CKEDITOR.env.air ? 200 :
						0, this);
					this.visible = 1;
					this.onShow && this.onShow.call(this)
				},
				focus: function() {
					if (CKEDITOR.env.webkit) {
						var a = CKEDITOR.document.getActive();
						!a.equals(this._.iframe) && a.$.blur()
					}(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
				},
				blur: function() {
					var a = this._.iframe.getFrameDocument().getActive();
					a.is("a") && (this._.lastFocused = a)
				},
				hide: function(a) {
					if (this.visible && (!this.onHide || !0 !== this.onHide.call(this))) {
						this.hideChild();
						CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
						this.element.setStyle("display", "none");
						this.visible = 0;
						this.element.getFirst().removeCustomData("activePanel");
						if (a = a && this._.returnFocus) CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(), a.focus();
						delete this._.lastFocused;
						this._.editor.fire("panelHide", this)
					}
				},
				allowBlur: function(a) {
					var b = this._.panel;
					void 0 != a && (b.allowBlur = a);
					return b.allowBlur
				},
				showAsChild: function(a, b, c, g, f, h) {
					this._.activeChild == a && a._.panel._.offsetParentId == c.getId() || (this.hideChild(), a.onHide = CKEDITOR.tools.bind(function() {
						CKEDITOR.tools.setTimeout(function() {
							this._.focused ||
								this.hide()
						}, 0, this)
					}, this), this._.activeChild = a, this._.focused = !1, a.showBlock(b, c, g, f, h), this.blur(), (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function() {
						a.element.getChild(0).$.style.cssText += ""
					}, 100))
				},
				hideChild: function(a) {
					var b = this._.activeChild;
					b && (delete b.onHide, delete this._.activeChild, b.hide(), a && this.focus())
				}
			}
		});
		CKEDITOR.on("instanceDestroyed", function() {
			var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances),
				b;
			for (b in g) {
				var c = g[b];
				a ? c.destroy() : c.element.hide()
			}
			a && (g = {})
		})
	})();
	CKEDITOR.plugins.add("menu", {
		requires: "floatpanel",
		beforeInit: function(g) {
			for (var h = g.config.menu_groups.split(","), m = g._.menuGroups = {}, l = g._.menuItems = {}, a = 0; a < h.length; a++) m[h[a]] = a + 1;
			g.addMenuGroup = function(b, a) {
				m[b] = a || 100
			};
			g.addMenuItem = function(a, c) {
				m[c.group] && (l[a] = new CKEDITOR.menuItem(this, a, c))
			};
			g.addMenuItems = function(a) {
				for (var c in a) this.addMenuItem(c, a[c])
			};
			g.getMenuItem = function(a) {
				return l[a]
			};
			g.removeMenuItem = function(a) {
				delete l[a]
			}
		}
	});
	(function() {
		function g(a) {
			a.sort(function(a, c) {
				return a.group < c.group ? -1 : a.group > c.group ? 1 : a.order < c.order ? -1 : a.order > c.order ? 1 : 0
			})
		}
		var h = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (h += ' onkeypress="return false;"');
		CKEDITOR.env.gecko &&
			(h += ' onblur="this.style.cssText = this.style.cssText;"');
		var h = h + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'),
			m = CKEDITOR.addTemplate("menuItem", h + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
			l = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
		CKEDITOR.menu = CKEDITOR.tools.createClass({
			$: function(a, b) {
				b = this._.definition = b || {};
				this.id = CKEDITOR.tools.getNextId();
				this.editor = a;
				this.items = [];
				this._.listeners = [];
				this._.level = b.level || 1;
				var c = CKEDITOR.tools.extend({}, b.panel, {
						css: [CKEDITOR.skin.getPath("editor")],
						level: this._.level - 1,
						block: {}
					}),
					k = c.block.attributes = c.attributes || {};
				!k.role && (k.role = "menu");
				this._.panelDefinition = c
			},
			_: {
				onShow: function() {
					var a =
						this.editor.getSelection(),
						b = a && a.getStartElement(),
						c = this.editor.elementPath(),
						k = this._.listeners;
					this.removeAll();
					for (var e = 0; e < k.length; e++) {
						var j = k[e](b, a, c);
						if (j)
							for (var i in j) {
								var f = this.editor.getMenuItem(i);
								if (f && (!f.command || this.editor.getCommand(f.command).state)) f.state = j[i], this.add(f)
							}
					}
				},
				onClick: function(a) {
					this.hide();
					if (a.onClick) a.onClick();
					else a.command && this.editor.execCommand(a.command)
				},
				onEscape: function(a) {
					var b = this.parent;
					b ? b._.panel.hideChild(1) : 27 == a && this.hide(1);
					return !1
				},
				onHide: function() {
					this.onHide && this.onHide()
				},
				showSubMenu: function(a) {
					var b = this._.subMenu,
						c = this.items[a];
					if (c = c.getItems && c.getItems()) {
						b ? b.removeAll() : (b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
							level: this._.level + 1
						}, !0)), b.parent = this, b._.onClick = CKEDITOR.tools.bind(this._.onClick, this));
						for (var k in c) {
							var e = this.editor.getMenuItem(k);
							e && (e.state = c[k], b.add(e))
						}
						var j = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + a));
						setTimeout(function() {
							b.show(j,
								2)
						}, 0)
					} else this._.panel.hideChild(1)
				}
			},
			proto: {
				add: function(a) {
					a.order || (a.order = this.items.length);
					this.items.push(a)
				},
				removeAll: function() {
					this.items = []
				},
				show: function(a, b, c, k) {
					if (!this.parent && (this._.onShow(), !this.items.length)) return;
					var b = b || ("rtl" == this.editor.lang.dir ? 2 : 1),
						e = this.items,
						j = this.editor,
						i = this._.panel,
						f = this._.element;
					if (!i) {
						i = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
						i.onEscape = CKEDITOR.tools.bind(function(a) {
							if (!1 ===
								this._.onEscape(a)) return !1
						}, this);
						i.onShow = function() {
							i._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
						};
						i.onHide = CKEDITOR.tools.bind(function() {
							this._.onHide && this._.onHide()
						}, this);
						f = i.addBlock(this.id, this._.panelDefinition.block);
						f.autoSize = !0;
						var d = f.keys;
						d[40] = "next";
						d[9] = "next";
						d[38] = "prev";
						d[CKEDITOR.SHIFT + 9] = "prev";
						d["rtl" == j.lang.dir ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
						d[32] = CKEDITOR.env.ie ? "mouseup" : "click";
						CKEDITOR.env.ie && (d[13] = "mouseup");
						f = this._.element =
							f.element;
						d = f.getDocument();
						d.getBody().setStyle("overflow", "hidden");
						d.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
						this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
							clearTimeout(this._.showSubTimeout);
							this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, j.config.menu_subMenuDelay || 400, this, [a])
						}, this);
						this._.itemOutFn = CKEDITOR.tools.addFunction(function() {
							clearTimeout(this._.showSubTimeout)
						}, this);
						this._.itemClickFn = CKEDITOR.tools.addFunction(function(a) {
							var b =
								this.items[a];
							if (b.state == CKEDITOR.TRISTATE_DISABLED) this.hide(1);
							else if (b.getItems) this._.showSubMenu(a);
							else this._.onClick(b)
						}, this)
					}
					g(e);
					for (var d = j.elementPath(), d = ['<div class="cke_menu' + (d && d.direction() != j.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], h = e.length, m = h && e[0].group, l = 0; l < h; l++) {
						var n = e[l];
						m != n.group && (d.push('<div class="cke_menuseparator" role="separator"></div>'), m = n.group);
						n.render(this, l, d)
					}
					d.push("</div>");
					f.setHtml(d.join(""));
					CKEDITOR.ui.fire("ready",
						this);
					this.parent ? this.parent._.panel.showAsChild(i, this.id, a, b, c, k) : i.showBlock(this.id, a, b, c, k);
					j.fire("menuShow", [i])
				},
				addListener: function(a) {
					this._.listeners.push(a)
				},
				hide: function(a) {
					this._.onHide && this._.onHide();
					this._.panel && this._.panel.hide(a)
				}
			}
		});
		CKEDITOR.menuItem = CKEDITOR.tools.createClass({
			$: function(a, b, c) {
				CKEDITOR.tools.extend(this, c, {
					order: 0,
					className: "cke_menubutton__" + b
				});
				this.group = a._.menuGroups[this.group];
				this.editor = a;
				this.name = b
			},
			proto: {
				render: function(a, b, c) {
					var h = a.id + ("" +
							b),
						e = "undefined" == typeof this.state ? CKEDITOR.TRISTATE_OFF : this.state,
						j = "",
						i = e == CKEDITOR.TRISTATE_ON ? "on" : e == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
					this.role in {
						menuitemcheckbox: 1,
						menuitemradio: 1
					} && (j = ' aria-checked="' + (e == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
					var f = this.getItems,
						d = "&#" + ("rtl" == this.editor.lang.dir ? "9668" : "9658") + ";",
						g = this.name;
					this.icon && !/\./.test(this.icon) && (g = this.icon);
					a = {
						id: h,
						name: this.name,
						iconName: g,
						label: this.label,
						cls: this.className || "",
						state: i,
						hasPopup: f ? "true" : "false",
						disabled: e == CKEDITOR.TRISTATE_DISABLED,
						title: this.label,
						href: "javascript:void('" + (this.label || "").replace("'") + "')",
						hoverFn: a._.itemOverFn,
						moveOutFn: a._.itemOutFn,
						clickFn: a._.itemClickFn,
						index: b,
						iconStyle: CKEDITOR.skin.getIconStyle(g, "rtl" == this.editor.lang.dir, g == this.icon ? null : this.icon, this.iconOffset),
						arrowHtml: f ? l.output({
							label: d
						}) : "",
						role: this.role ? this.role : "menuitem",
						ariaChecked: j
					};
					m.output(a, c)
				}
			}
		})
	})();
	CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";
	CKEDITOR.plugins.add("contextmenu", {
		requires: "menu",
		onLoad: function() {
			CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
				base: CKEDITOR.menu,
				$: function(a) {
					this.base.call(this, a, {
						panel: {
							className: "cke_menu_panel",
							attributes: {
								"aria-label": a.lang.contextmenu.options
							}
						}
					})
				},
				proto: {
					addTarget: function(a, c) {
						a.on("contextmenu", function(a) {
							var a = a.data,
								b = CKEDITOR.env.webkit ? d : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
							if (!c || !b) {
								a.preventDefault();
								var e = a.getTarget().getDocument(),
									f = a.getTarget().getDocument().getDocumentElement(),
									b = !e.equals(CKEDITOR.document),
									e = e.getWindow().getScrollPosition(),
									g = b ? a.$.clientX : a.$.pageX || e.x + a.$.clientX,
									h = b ? a.$.clientY : a.$.pageY || e.y + a.$.clientY;
								CKEDITOR.tools.setTimeout(function() {
									this.open(f, null, g, h)
								}, CKEDITOR.env.ie ? 200 : 0, this)
							}
						}, this);
						if (CKEDITOR.env.webkit) {
							var d, b = function() {
								d = 0
							};
							a.on("keydown", function(a) {
								d = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
							});
							a.on("keyup", b);
							a.on("contextmenu", b)
						}
					},
					open: function(a, c, d, b) {
						this.editor.focus();
						a = a || CKEDITOR.document.getDocumentElement();
						this.editor.selectionChange(1);
						this.show(a, c, d, b)
					}
				}
			})
		},
		beforeInit: function(a) {
			var c = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
			a.on("contentDom", function() {
				c.addTarget(a.editable(), !1 !== a.config.browserContextMenuOnCtrl)
			});
			a.addCommand("contextMenu", {
				exec: function() {
					a.contextMenu.open(a.document.getBody())
				}
			});
			a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
			a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
		}
	});
	CKEDITOR.plugins.add("resize", {
		init: function(b) {
			var f, g, n, o, a = b.config,
				q = b.ui.spaceId("resizer"),
				h = b.element ? b.element.getDirection(1) : "ltr";
			!a.resize_dir && (a.resize_dir = "vertical");
			void 0 == a.resize_maxWidth && (a.resize_maxWidth = 3E3);
			void 0 == a.resize_maxHeight && (a.resize_maxHeight = 3E3);
			void 0 == a.resize_minWidth && (a.resize_minWidth = 750);
			void 0 == a.resize_minHeight && (a.resize_minHeight = 250);
			if (!1 !== a.resize_enabled) {
				var c = null,
					i = ("both" == a.resize_dir || "horizontal" == a.resize_dir) && a.resize_minWidth != a.resize_maxWidth,
					l = ("both" == a.resize_dir || "vertical" == a.resize_dir) && a.resize_minHeight != a.resize_maxHeight,
					j = function(d) {
						var e = f,
							m = g,
							c = e + (d.data.$.screenX - n) * ("rtl" == h ? -1 : 1),
							d = m + (d.data.$.screenY - o);
						i && (e = Math.max(a.resize_minWidth, Math.min(c, a.resize_maxWidth)));
						l && (m = Math.max(a.resize_minHeight, Math.min(d, a.resize_maxHeight)));
						b.resize(i ? e : null, m)
					},
					k = function() {
						CKEDITOR.document.removeListener("mousemove", j);
						CKEDITOR.document.removeListener("mouseup", k);
						b.document && (b.document.removeListener("mousemove", j), b.document.removeListener("mouseup",
							k))
					},
					p = CKEDITOR.tools.addFunction(function(d) {
						c || (c = b.getResizable());
						f = c.$.offsetWidth || 0;
						g = c.$.offsetHeight || 0;
						n = d.screenX;
						o = d.screenY;
						a.resize_minWidth > f && (a.resize_minWidth = f);
						a.resize_minHeight > g && (a.resize_minHeight = g);
						CKEDITOR.document.on("mousemove", j);
						CKEDITOR.document.on("mouseup", k);
						b.document && (b.document.on("mousemove", j), b.document.on("mouseup", k));
						d.preventDefault && d.preventDefault()
					});
				b.on("destroy", function() {
					CKEDITOR.tools.removeFunction(p)
				});
				b.on("uiSpace", function(a) {
					if ("bottom" ==
						a.data.space) {
						var e = "";
						i && !l && (e = " cke_resizer_horizontal");
						!i && l && (e = " cke_resizer_vertical");
						var c = '<span id="' + q + '" class="cke_resizer' + e + " cke_resizer_" + h + '" title="' + CKEDITOR.tools.htmlEncode(b.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + p + ', event)">' + ("ltr" == h ? "◢" : "◣") + "</span>";
						"ltr" == h && "ltr" == e ? a.data.html += c : a.data.html = c + a.data.html
					}
				}, b, null, 100);
				b.on("maximize", function(a) {
					b.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
				})
			}
		}
	});
	(function() {
		var c = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (c += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
		var c = c + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' +
				(CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'),
			c = c + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>',
			m = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"),
			n = CKEDITOR.addTemplate("button", c);
		CKEDITOR.plugins.add("button", {
			beforeInit: function(a) {
				a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
			}
		});
		CKEDITOR.UI_BUTTON = "button";
		CKEDITOR.ui.button = function(a) {
			CKEDITOR.tools.extend(this, a, {
				title: a.label,
				click: a.click || function(b) {
					b.execCommand(a.command)
				}
			});
			this._ = {}
		};
		CKEDITOR.ui.button.handler = {
			create: function(a) {
				return new CKEDITOR.ui.button(a)
			}
		};
		CKEDITOR.ui.button.prototype = {
			render: function(a, b) {
				var c = CKEDITOR.env,
					i = this._.id = CKEDITOR.tools.getNextId(),
					f = "",
					e = this.command,
					k;
				this._.editor = a;
				var d = {
						id: i,
						button: this,
						editor: a,
						focus: function() {
							CKEDITOR.document.getById(i).focus()
						},
						execute: function() {
							this.button.click(a)
						},
						attach: function(a) {
							this.button.attach(a)
						}
					},
					o = CKEDITOR.tools.addFunction(function(a) {
						if (d.onkey) return a = new CKEDITOR.dom.event(a), !1 !== d.onkey(d, a.getKeystroke())
					}),
					p = CKEDITOR.tools.addFunction(function(a) {
						var b;
						d.onfocus && (b = !1 !== d.onfocus(d, new CKEDITOR.dom.event(a)));
						return b
					}),
					l = 0;
				d.clickFn = k = CKEDITOR.tools.addFunction(function() {
					l && (a.unlockSelection(1), l = 0);
					d.execute()
				});
				if (this.modes) {
					var j = {},
						g = function() {
							var b = a.mode;
							b && (b = this.modes[b] ? void 0 != j[b] ? j[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, b = a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b, this.setState(b), this.refresh && this.refresh())
						};
					a.on("beforeModeUnload", function() {
						a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED && (j[a.mode] = this._.state)
					}, this);
					a.on("activeFilterChange", g, this);
					a.on("mode", g, this);
					!this.readOnly && a.on("readOnly", g, this)
				} else if (e && (e = a.getCommand(e))) e.on("state", function() {
						this.setState(e.state)
					},
					this), f += e.state == CKEDITOR.TRISTATE_ON ? "on" : e.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
				if (this.directional) a.on("contentDirChanged", function(b) {
					var c = CKEDITOR.document.getById(this._.id),
						d = c.getFirst(),
						b = b.data;
					b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl");
					d.setAttribute("style", CKEDITOR.skin.getIconStyle(h, "rtl" == b, this.icon, this.iconOffset))
				}, this);
				e || (f += "off");
				var h = g = this.name || this.command;
				this.icon && !/\./.test(this.icon) && (h = this.icon, this.icon =
					null);
				c = {
					id: i,
					name: g,
					iconName: h,
					label: this.label,
					cls: this.className || "",
					state: f,
					ariaDisabled: "disabled" == f ? "true" : "false",
					title: this.title,
					titleJs: c.gecko && !c.hc ? "" : (this.title || "").replace("'", ""),
					hasArrow: this.hasArrow ? "true" : "false",
					keydownFn: o,
					focusFn: p,
					clickFn: k,
					style: CKEDITOR.skin.getIconStyle(h, "rtl" == a.lang.dir, this.icon, this.iconOffset),
					arrowHtml: this.hasArrow ? m.output() : ""
				};
				n.output(c, b);
				if (this.onRender) this.onRender();
				return d
			},
			setState: function(a) {
				if (this._.state == a) return !1;
				this._.state =
					a;
				var b = CKEDITOR.document.getById(this._.id);
				return b ? (b.setState(a, "cke_button"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled"), this.hasArrow ? (a = a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label, CKEDITOR.document.getById(this._.id + "_label").setText(a)) : a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", !0) : b.removeAttribute("aria-pressed"), !0) : !1
			},
			getState: function() {
				return this._.state
			},
			toFeature: function(a) {
				if (this._.feature) return this._.feature;
				var b = this;
				!this.allowedContent && (!this.requiredContent && this.command) && (b = a.getCommand(this.command) || b);
				return this._.feature = b
			}
		};
		CKEDITOR.ui.prototype.addButton = function(a, b) {
			this.add(a, CKEDITOR.UI_BUTTON, b)
		}
	})();
	(function() {
		function w(a) {
			function d() {
				for (var b = g(), e = CKEDITOR.tools.clone(a.config.toolbarGroups) || n(a), f = 0; f < e.length; f++) {
					var k = e[f];
					if ("/" != k) {
						"string" == typeof k && (k = e[f] = {
							name: k
						});
						var i, d = k.groups;
						if (d)
							for (var h = 0; h < d.length; h++) i = d[h], (i = b[i]) && c(k, i);
						(i = b[k.name]) && c(k, i)
					}
				}
				return e
			}

			function g() {
				var b = {},
					c, f, e;
				for (c in a.ui.items) f = a.ui.items[c], e = f.toolbar || "others", e = e.split(","), f = e[0], e = parseInt(e[1] || -1, 10), b[f] || (b[f] = []), b[f].push({
					name: c,
					order: e
				});
				for (f in b) b[f] = b[f].sort(function(b,
					a) {
					return b.order == a.order ? 0 : 0 > a.order ? -1 : 0 > b.order ? 1 : b.order < a.order ? -1 : 1
				});
				return b
			}

			function c(c, e) {
				if (e.length) {
					c.items ? c.items.push(a.ui.create("-")) : c.items = [];
					for (var f; f = e.shift();)
						if (f = "string" == typeof f ? f : f.name, !b || -1 == CKEDITOR.tools.indexOf(b, f))(f = a.ui.create(f)) && a.addFeature(f) && c.items.push(f)
				}
			}

			function h(b) {
				var a = [],
					e, d, h;
				for (e = 0; e < b.length; ++e) d = b[e], h = {}, "/" == d ? a.push(d) : CKEDITOR.tools.isArray(d) ? (c(h, CKEDITOR.tools.clone(d)), a.push(h)) : d.items && (c(h, CKEDITOR.tools.clone(d.items)),
					h.name = d.name, a.push(h));
				return a
			}
			var b = a.config.removeButtons,
				b = b && b.split(","),
				e = a.config.toolbar;
			"string" == typeof e && (e = a.config["toolbar_" + e]);
			return a.toolbar = e ? h(e) : d()
		}

		function n(a) {
			return a._.toolbarGroups || (a._.toolbarGroups = [{
				name: "document",
				groups: ["mode", "document", "doctools"]
			}, {
				name: "clipboard",
				groups: ["clipboard", "undo"]
			}, {
				name: "editing",
				groups: ["find", "selection", "spellchecker"]
			}, {
				name: "forms"
			}, "/", {
				name: "basicstyles",
				groups: ["basicstyles", "cleanup"]
			}, {
				name: "paragraph",
				groups: ["list",
					"indent", "blocks", "align", "bidi"
				]
			}, {
				name: "links"
			}, {
				name: "insert"
			}, "/", {
				name: "styles"
			}, {
				name: "colors"
			}, {
				name: "tools"
			}, {
				name: "others"
			}, {
				name: "about"
			}])
		}
		var u = function() {
			this.toolbars = [];
			this.focusCommandExecuted = !1
		};
		u.prototype.focus = function() {
			for (var a = 0, d; d = this.toolbars[a++];)
				for (var g = 0, c; c = d.items[g++];)
					if (c.focus) {
						c.focus();
						return
					}
		};
		var x = {
			modes: {
				wysiwyg: 1,
				source: 1
			},
			readOnly: 1,
			exec: function(a) {
				a.toolbox && (a.toolbox.focusCommandExecuted = !0, CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function() {
						a.toolbox.focus()
					},
					100) : a.toolbox.focus())
			}
		};
		CKEDITOR.plugins.add("toolbar", {
			requires: "button",
			init: function(a) {
				var d, g = function(c, h) {
					var b, e = "rtl" == a.lang.dir,
						j = a.config.toolbarGroupCycling,
						o = e ? 37 : 39,
						e = e ? 39 : 37,
						j = void 0 === j || j;
					switch (h) {
						case 9:
						case CKEDITOR.SHIFT + 9:
							for (; !b || !b.items.length;)
								if (b = 9 == h ? (b ? b.next : c.toolbar.next) || a.toolbox.toolbars[0] : (b ? b.previous : c.toolbar.previous) || a.toolbox.toolbars[a.toolbox.toolbars.length - 1], b.items.length)
									for (c = b.items[d ? b.items.length - 1 : 0]; c && !c.focus;)(c = d ? c.previous : c.next) ||
										(b = 0);
							c && c.focus();
							return !1;
						case o:
							b = c;
							do b = b.next, !b && j && (b = c.toolbar.items[0]); while (b && !b.focus);
							b ? b.focus() : g(c, 9);
							return !1;
						case 40:
							return c.button && c.button.hasArrow ? (a.once("panelShow", function(b) {
								b.data._.panel._.currentBlock.onKeyDown(40)
							}), c.execute()) : g(c, 40 == h ? o : e), !1;
						case e:
						case 38:
							b = c;
							do b = b.previous, !b && j && (b = c.toolbar.items[c.toolbar.items.length - 1]); while (b && !b.focus);
							b ? b.focus() : (d = 1, g(c, CKEDITOR.SHIFT + 9), d = 0);
							return !1;
						case 27:
							return a.focus(), !1;
						case 13:
						case 32:
							return c.execute(), !1
					}
					return !0
				};
				a.on("uiSpace", function(c) {
					if (c.data.space == a.config.toolbarLocation) {
						c.removeListener();
						a.toolbox = new u;
						var d = CKEDITOR.tools.getNextId(),
							b = ['<span id="', d, '" class="cke_voice_label">', a.lang.toolbar.toolbars, "</span>", '<span id="' + a.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', d, '" onmousedown="return false;">'],
							d = !1 !== a.config.toolbarStartupExpanded,
							e, j;
						a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && b.push('<span class="cke_toolbox_main"' +
							(d ? ">" : ' style="display:none">'));
						for (var o = a.toolbox.toolbars, f = w(a), k = 0; k < f.length; k++) {
							var i, l = 0,
								r, m = f[k],
								s;
							if (m)
								if (e && (b.push("</span>"), j = e = 0), "/" === m) b.push('<span class="cke_toolbar_break"></span>');
								else {
									s = m.items || m;
									for (var t = 0; t < s.length; t++) {
										var p = s[t],
											n;
										if (p)
											if (p.type == CKEDITOR.UI_SEPARATOR) j = e && p;
											else {
												n = !1 !== p.canGroup;
												if (!l) {
													i = CKEDITOR.tools.getNextId();
													l = {
														id: i,
														items: []
													};
													r = m.name && (a.lang.toolbar.toolbarGroups[m.name] || m.name);
													b.push('<span id="', i, '" class="cke_toolbar"', r ? ' aria-labelledby="' +
														i + '_label"' : "", ' role="toolbar">');
													r && b.push('<span id="', i, '_label" class="cke_voice_label">', r, "</span>");
													b.push('<span class="cke_toolbar_start"></span>');
													var q = o.push(l) - 1;
													0 < q && (l.previous = o[q - 1], l.previous.next = l)
												}
												n ? e || (b.push('<span class="cke_toolgroup" role="presentation">'), e = 1) : e && (b.push("</span>"), e = 0);
												i = function(c) {
													c = c.render(a, b);
													q = l.items.push(c) - 1;
													if (q > 0) {
														c.previous = l.items[q - 1];
														c.previous.next = c
													}
													c.toolbar = l;
													c.onkey = g;
													c.onfocus = function() {
														a.toolbox.focusCommandExecuted || a.focus()
													}
												};
												j && (i(j), j = 0);
												i(p)
											}
									}
									e && (b.push("</span>"), j = e = 0);
									l && b.push('<span class="cke_toolbar_end"></span></span>')
								}
						}
						a.config.toolbarCanCollapse && b.push("</span>");
						if (a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
							var v = CKEDITOR.tools.addFunction(function() {
								a.execCommand("toolbarCollapse")
							});
							a.on("destroy", function() {
								CKEDITOR.tools.removeFunction(v)
							});
							a.addCommand("toolbarCollapse", {
								readOnly: 1,
								exec: function(b) {
									var a = b.ui.space("toolbar_collapser"),
										c = a.getPrevious(),
										e = b.ui.space("contents"),
										d = c.getParent(),
										f = parseInt(e.$.style.height, 10),
										h = d.$.offsetHeight,
										g = a.hasClass("cke_toolbox_collapser_min");
									g ? (c.show(), a.removeClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarCollapse)) : (c.hide(), a.addClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarExpand));
									a.getFirst().setText(g ? "▲" : "◀");
									e.setStyle("height", f - (d.$.offsetHeight - h) + "px");
									b.fire("resize")
								},
								modes: {
									wysiwyg: 1,
									source: 1
								}
							});
							a.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ?
								189 : 109), "toolbarCollapse");
							b.push('<a title="' + (d ? a.lang.toolbar.toolbarCollapse : a.lang.toolbar.toolbarExpand) + '" id="' + a.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
							d || b.push(" cke_toolbox_collapser_min");
							b.push('" onclick="CKEDITOR.tools.callFunction(' + v + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>")
						}
						b.push("</span>");
						c.data.html += b.join("")
					}
				});
				a.on("destroy", function() {
					if (this.toolbox) {
						var a, d = 0,
							b, e, g;
						for (a = this.toolbox.toolbars; d < a.length; d++) {
							e = a[d].items;
							for (b = 0; b < e.length; b++) g = e[b], g.clickFn && CKEDITOR.tools.removeFunction(g.clickFn), g.keyDownFn && CKEDITOR.tools.removeFunction(g.keyDownFn)
						}
					}
				});
				a.on("uiReady", function() {
					var c = a.ui.space("toolbox");
					c && a.focusManager.add(c, 1)
				});
				a.addCommand("toolbarFocus", x);
				a.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
				a.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
				a.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
					create: function() {
						return {
							render: function(a, d) {
								d.push('<span class="cke_toolbar_separator" role="separator"></span>');
								return {}
							}
						}
					}
				})
			}
		});
		CKEDITOR.ui.prototype.addToolbarGroup = function(a, d, g) {
			var c = n(this.editor),
				h = 0 === d,
				b = {
					name: a
				};
			if (g) {
				if (g = CKEDITOR.tools.search(c, function(a) {
					return a.name == g
				})) {
					!g.groups && (g.groups = []);
					if (d && (d = CKEDITOR.tools.indexOf(g.groups, d), 0 <= d)) {
						g.groups.splice(d + 1, 0, a);
						return
					}
					h ? g.groups.splice(0, 0, a) : g.groups.push(a);
					return
				}
				d = null
			}
			d && (d = CKEDITOR.tools.indexOf(c, function(a) {
				return a.name == d
			}));
			h ? c.splice(0, 0, a) : "number" == typeof d ? c.splice(d + 1, 0, b) : c.push(a)
		}
	})();
	CKEDITOR.UI_SEPARATOR = "separator";
	CKEDITOR.config.toolbarLocation = "top";
	(function() {
		var k;

		function n(a, c) {
			function j(d) {
				d = i.list[d];
				if (d.equals(a.editable()) || "true" == d.getAttribute("contenteditable")) {
					var e = a.createRange();
					e.selectNodeContents(d);
					e.select()
				} else a.getSelection().selectElement(d);
				a.focus()
			}

			function s() {
				l && l.setHtml(o);
				delete i.list
			}
			var m = a.ui.spaceId("path"),
				l, i = a._.elementsPath,
				n = i.idBase;
			c.html += '<span id="' + m + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + m + '" class="cke_path" role="group" aria-labelledby="' + m +
				'_label">' + o + "</span>";
			a.on("uiReady", function() {
				var d = a.ui.space("path");
				d && a.focusManager.add(d, 1)
			});
			i.onClick = j;
			var t = CKEDITOR.tools.addFunction(j),
				u = CKEDITOR.tools.addFunction(function(d, e) {
					var g = i.idBase,
						b, e = new CKEDITOR.dom.event(e);
					b = "rtl" == a.lang.dir;
					switch (e.getKeystroke()) {
						case b ? 39:
							37 :
						case 9:
							return (b = CKEDITOR.document.getById(g + (d + 1))) || (b = CKEDITOR.document.getById(g + "0")), b.focus(), !1;
						case b ? 37:
							39 :
						case CKEDITOR.SHIFT + 9:
							return (b = CKEDITOR.document.getById(g + (d - 1))) || (b = CKEDITOR.document.getById(g +
								(i.list.length - 1))), b.focus(), !1;
						case 27:
							return a.focus(), !1;
						case 13:
						case 32:
							return j(d), !1
					}
					return !0
				});
			a.on("selectionChange", function() {
				a.editable();
				for (var d = [], e = i.list = [], g = [], b = i.filters, c = !0, j = a.elementPath().elements, f, k = j.length; k--;) {
					var h = j[k],
						p = 0;
					f = h.data("cke-display-name") ? h.data("cke-display-name") : h.data("cke-real-element-type") ? h.data("cke-real-element-type") : h.getName();
					c = h.hasAttribute("contenteditable") ? "true" == h.getAttribute("contenteditable") : c;
					!c && !h.hasAttribute("contenteditable") &&
						(p = 1);
					for (var q = 0; q < b.length; q++) {
						var r = b[q](h, f);
						if (!1 === r) {
							p = 1;
							break
						}
						f = r || f
					}
					p || (e.unshift(h), g.unshift(f))
				}
				e = e.length;
				for (b = 0; b < e; b++) f = g[b], c = a.lang.elementspath.eleTitle.replace(/%1/, f), f = v.output({
					id: n + b,
					label: c,
					text: f,
					jsTitle: "javascript:void('" + f + "')",
					index: b,
					keyDownFn: u,
					clickFn: t
				}), d.unshift(f);
				l || (l = CKEDITOR.document.getById(m));
				g = l;
				g.setHtml(d.join("") + o);
				a.fire("elementsPathUpdate", {
					space: g
				})
			});
			a.on("readOnly", s);
			a.on("contentDomUnload", s);
			a.addCommand("elementsPathFocus", k);
			a.setKeystroke(CKEDITOR.ALT +
				122, "elementsPathFocus")
		}
		k = {
			editorFocus: !1,
			readOnly: 1,
			exec: function(a) {
				(a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
			}
		};
		var o = '<span class="cke_path_empty">&nbsp;</span>',
			c = "";
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (c += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
		var v = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' +
			c + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
		CKEDITOR.plugins.add("elementspath", {
			init: function(a) {
				a._.elementsPath = {
					idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
					filters: []
				};
				a.on("uiSpace", function(c) {
					"bottom" == c.data.space && n(a, c.data)
				})
			}
		})
	})();
	(function() {
		function l(e, c, b) {
			b = e.config.forceEnterMode || b;
			"wysiwyg" == e.mode && (c || (c = e.activeEnterMode), e.elementPath().isContextFor("p") || (c = CKEDITOR.ENTER_BR, b = 1), e.fire("saveSnapshot"), c == CKEDITOR.ENTER_BR ? o(e, c, null, b) : p(e, c, null, b), e.fire("saveSnapshot"))
		}

		function q(e) {
			for (var e = e.getSelection().getRanges(!0), c = e.length - 1; 0 < c; c--) e[c].deleteContents();
			return e[0]
		}
		CKEDITOR.plugins.add("enterkey", {
			init: function(e) {
				e.addCommand("enter", {
					modes: {
						wysiwyg: 1
					},
					editorFocus: !1,
					exec: function(c) {
						l(c)
					}
				});
				e.addCommand("shiftEnter", {
					modes: {
						wysiwyg: 1
					},
					editorFocus: !1,
					exec: function(c) {
						l(c, c.activeShiftEnterMode, 1)
					}
				});
				e.setKeystroke([
					[13, "enter"],
					[CKEDITOR.SHIFT + 13, "shiftEnter"]
				])
			}
		});
		var t = CKEDITOR.dom.walker.whitespaces(),
			u = CKEDITOR.dom.walker.bookmark();
		CKEDITOR.plugins.enterkey = {
			enterBlock: function(e, c, b, i) {
				if (b = b || q(e)) {
					var f = b.document,
						j = b.checkStartOfBlock(),
						h = b.checkEndOfBlock(),
						a = e.elementPath(b.startContainer).block,
						k = c == CKEDITOR.ENTER_DIV ? "div" : "p",
						d;
					if (j && h) {
						if (a && (a.is("li") || a.getParent().is("li"))) {
							b =
								a.getParent();
							d = b.getParent();
							var i = !a.hasPrevious(),
								m = !a.hasNext(),
								k = e.getSelection(),
								g = k.createBookmarks(),
								j = a.getDirection(1),
								h = a.getAttribute("class"),
								n = a.getAttribute("style"),
								l = d.getDirection(1) != j,
								e = e.enterMode != CKEDITOR.ENTER_BR || l || n || h;
							if (d.is("li"))
								if (i || m) a[i ? "insertBefore" : "insertAfter"](d);
								else a.breakParent(d);
							else {
								if (e)
									if (d = f.createElement(c == CKEDITOR.ENTER_P ? "p" : "div"), l && d.setAttribute("dir", j), n && d.setAttribute("style", n), h && d.setAttribute("class", h), a.moveChildren(d), i || m) d[i ?
										"insertBefore" : "insertAfter"](b);
									else a.breakParent(b), d.insertAfter(b);
								else if (a.appendBogus(!0), i || m)
									for (; f = a[i ? "getFirst" : "getLast"]();) f[i ? "insertBefore" : "insertAfter"](b);
								else
									for (a.breakParent(b); f = a.getLast();) f.insertAfter(b);
								a.remove()
							}
							k.selectBookmarks(g);
							return
						}
						if (a && a.getParent().is("blockquote")) {
							a.breakParent(a.getParent());
							a.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || a.getPrevious().remove();
							a.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || a.getNext().remove();
							b.moveToElementEditStart(a);
							b.select();
							return
						}
					} else if (a && a.is("pre") && !h) {
						o(e, c, b, i);
						return
					}
					if (h = b.splitBlock(k)) {
						c = h.previousBlock;
						a = h.nextBlock;
						e = h.wasStartOfBlock;
						j = h.wasEndOfBlock;
						if (a) g = a.getParent(), g.is("li") && (a.breakParent(g), a.move(a.getNext(), 1));
						else if (c && (g = c.getParent()) && g.is("li")) c.breakParent(g), g = c.getNext(), b.moveToElementEditStart(g), c.move(c.getPrevious());
						if (!e && !j) a.is("li") && (d = b.clone(), d.selectNodeContents(a), d = new CKEDITOR.dom.walker(d), d.evaluator = function(a) {
							return !(u(a) ||
								t(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))
						}, (g = d.next()) && (g.type == CKEDITOR.NODE_ELEMENT && g.is("ul", "ol")) && (CKEDITOR.env.needsBrFiller ? f.createElement("br") : f.createText(" ")).insertBefore(g)), a && b.moveToElementEditStart(a);
						else {
							if (c) {
								if (c.is("li") || !r.test(c.getName()) && !c.is("pre")) d = c.clone()
							} else a && (d = a.clone());
							d ? i && !d.is("li") && d.renameNode(k) : g && g.is("li") ? d = g : (d = f.createElement(k), c && (m = c.getDirection()) && d.setAttribute("dir",
								m));
							if (f = h.elementPath) {
								i = 0;
								for (k = f.elements.length; i < k; i++) {
									g = f.elements[i];
									if (g.equals(f.block) || g.equals(f.blockLimit)) break;
									CKEDITOR.dtd.$removeEmpty[g.getName()] && (g = g.clone(), d.moveChildren(g), d.append(g))
								}
							}
							d.appendBogus();
							d.getParent() || b.insertNode(d);
							d.is("li") && d.removeAttribute("value");
							if (CKEDITOR.env.ie && e && (!j || !c.getChildCount())) b.moveToElementEditStart(j ? c : d), b.select();
							b.moveToElementEditStart(e && !j ? a : d)
						}
						b.select();
						b.scrollIntoView()
					}
				}
			},
			enterBr: function(e, c, b, i) {
				if (b = b || q(e)) {
					var f =
						b.document,
						j = b.checkEndOfBlock(),
						h = new CKEDITOR.dom.elementPath(e.getSelection().getStartElement()),
						a = h.block,
						h = a && h.block.getName();
					!i && "li" == h ? p(e, c, b, i) : (!i && j && r.test(h) ? (j = a.getDirection()) ? (f = f.createElement("div"), f.setAttribute("dir", j), f.insertAfter(a), b.setStart(f, 0)) : (f.createElement("br").insertAfter(a), CKEDITOR.env.gecko && f.createText("").insertAfter(a), b.setStartAt(a.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)) : (a = "pre" == h && CKEDITOR.env.ie &&
						8 > CKEDITOR.env.version ? f.createText("\r") : f.createElement("br"), b.deleteContents(), b.insertNode(a), CKEDITOR.env.needsBrFiller ? (f.createText("﻿").insertAfter(a), j && a.getParent().appendBogus(), a.getNext().$.nodeValue = "", b.setStartAt(a.getNext(), CKEDITOR.POSITION_AFTER_START)) : b.setStartAt(a, CKEDITOR.POSITION_AFTER_END)), b.collapse(!0), b.select(), b.scrollIntoView())
				}
			}
		};
		var s = CKEDITOR.plugins.enterkey,
			o = s.enterBr,
			p = s.enterBlock,
			r = /^h[1-6]$/
	})();
	(function() {
		function j(a, b) {
			var d = {},
				e = [],
				f = {
					nbsp: " ",
					shy: "­",
					gt: ">",
					lt: "<",
					amp: "&",
					apos: "'",
					quot: '"'
				},
				a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(a, h) {
					var c = b ? "&" + h + ";" : f[h];
					d[c] = b ? f[h] : "&" + h + ";";
					e.push(c);
					return ""
				});
			if (!b && a) {
				var a = a.split(","),
					c = document.createElement("div"),
					g;
				c.innerHTML = "&" + a.join(";&") + ";";
				g = c.innerHTML;
				c = null;
				for (c = 0; c < g.length; c++) {
					var i = g.charAt(c);
					d[i] = "&" + a[c] + ";";
					e.push(i)
				}
			}
			d.regex = e.join(b ? "|" : "");
			return d
		}
		CKEDITOR.plugins.add("entities", {
			afterInit: function(a) {
				var b =
					a.config;
				if (a = (a = a.dataProcessor) && a.htmlFilter) {
					var d = [];
					!1 !== b.basicEntities && d.push("nbsp,gt,lt,amp");
					b.entities && (d.length && d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"),
						b.entities_latin && d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"), b.entities_greek && d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"),
						b.entities_additional && d.push(b.entities_additional));
					var e = j(d.join(",")),
						f = e.regex ? "[" + e.regex + "]" : "a^";
					delete e.regex;
					b.entities && b.entities_processNumerical && (f = "[^ -~]|" + f);
					var f = RegExp(f, "g"),
						c = function(a) {
							return b.entities_processNumerical == "force" || !e[a] ? "&#" + a.charCodeAt(0) + ";" : e[a]
						},
						g = j("nbsp,gt,lt,amp,shy", !0),
						i = RegExp(g.regex, "g"),
						k = function(a) {
							return g[a]
						};
					a.addRules({
						text: function(a) {
							return a.replace(i, k).replace(f, c)
						}
					}, {
						applyToAll: !0,
						excludeNestedEditable: !0
					})
				}
			}
		})
	})();
	CKEDITOR.config.basicEntities = !0;
	CKEDITOR.config.entities = !0;
	CKEDITOR.config.entities_latin = !0;
	CKEDITOR.config.entities_greek = !0;
	CKEDITOR.config.entities_additional = "#39";
	CKEDITOR.plugins.add("popup");
	CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
		popup: function(e, a, b, d) {
			a = a || "80%";
			b = b || "70%";
			"string" == typeof a && (1 < a.length && "%" == a.substr(a.length - 1, 1)) && (a = parseInt(window.screen.width * parseInt(a, 10) / 100, 10));
			"string" == typeof b && (1 < b.length && "%" == b.substr(b.length - 1, 1)) && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
			640 > a && (a = 640);
			420 > b && (b = 420);
			var f = parseInt((window.screen.height - b) / 2, 10),
				g = parseInt((window.screen.width - a) / 2, 10),
				d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" +
				a + ",height=" + b + ",top=" + f + ",left=" + g,
				c = window.open("", null, d, !0);
			if (!c) return !1;
			try {
				-1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") && (c.moveTo(g, f), c.resizeTo(a, b)), c.focus(), c.location.href = e
			} catch (h) {
				window.open(e, null, d, !0)
			}
			return !0
		}
	});
	(function() {
		function g(a, c) {
			var d = [];
			if (c)
				for (var b in c) d.push(b + "=" + encodeURIComponent(c[b]));
			else return a;
			return a + (-1 != a.indexOf("?") ? "&" : "?") + d.join("&")
		}

		function i(a) {
			a += "";
			return a.charAt(0).toUpperCase() + a.substr(1)
		}

		function k() {
			var a = this.getDialog(),
				c = a.getParentEditor();
			c._.filebrowserSe = this;
			var d = c.config["filebrowser" + i(a.getName()) + "WindowWidth"] || c.config.filebrowserWindowWidth || "80%",
				a = c.config["filebrowser" + i(a.getName()) + "WindowHeight"] || c.config.filebrowserWindowHeight || "70%",
				b = this.filebrowser.params || {};
			b.CKEditor = c.name;
			b.CKEditorFuncNum = c._.filebrowserFn;
			b.langCode || (b.langCode = c.langCode);
			b = g(this.filebrowser.url, b);
			c.popup(b, d, a, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures)
		}

		function l() {
			var a = this.getDialog();
			a.getParentEditor()._.filebrowserSe = this;
			return !a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? !1 : !0
		}

		function m(a, c, d) {
			var b = d.params || {};
			b.CKEditor = a.name;
			b.CKEditorFuncNum = a._.filebrowserFn;
			b.langCode || (b.langCode = a.langCode);
			c.action = g(d.url, b);
			c.filebrowser = d
		}

		function j(a, c, d, b) {
			if (b && b.length)
				for (var e, g = b.length; g--;)
					if (e = b[g], ("hbox" == e.type || "vbox" == e.type || "fieldset" == e.type) && j(a, c, d, e.children), e.filebrowser)
						if ("string" == typeof e.filebrowser && (e.filebrowser = {
							action: "fileButton" == e.type ? "QuickUpload" : "Browse",
							target: e.filebrowser
						}), "Browse" == e.filebrowser.action) {
							var f = e.filebrowser.url;
							void 0 === f && (f = a.config["filebrowser" +
								i(c) + "BrowseUrl"], void 0 === f && (f = a.config.filebrowserBrowseUrl));
							f && (e.onClick = k, e.filebrowser.url = f, e.hidden = !1)
						} else if ("QuickUpload" == e.filebrowser.action && e["for"] && (f = e.filebrowser.url, void 0 === f && (f = a.config["filebrowser" + i(c) + "UploadUrl"], void 0 === f && (f = a.config.filebrowserUploadUrl)), f)) {
				var h = e.onClick;
				e.onClick = function(a) {
					var b = a.sender;
					return h && h.call(b, a) === false ? false : l.call(b, a)
				};
				e.filebrowser.url = f;
				e.hidden = !1;
				m(a, d.getContents(e["for"][0]).get(e["for"][1]), e.filebrowser)
			}
		}

		function h(a,
			c, d) {
			if (-1 !== d.indexOf(";")) {
				for (var d = d.split(";"), b = 0; b < d.length; b++)
					if (h(a, c, d[b])) return !0;
				return !1
			}
			return (a = a.getContents(c).get(d).filebrowser) && a.url
		}

		function n(a, c) {
			var d = this._.filebrowserSe.getDialog(),
				b = this._.filebrowserSe["for"],
				e = this._.filebrowserSe.filebrowser.onSelect;
			b && d.getContentElement(b[0], b[1]).reset();
			if (!("function" == typeof c && !1 === c.call(this._.filebrowserSe)) && !(e && !1 === e.call(this._.filebrowserSe, a, c)) && ("string" == typeof c && c && alert(c), a && (b = this._.filebrowserSe, d = b.getDialog(),
				b = b.filebrowser.target || null)))
				if (b = b.split(":"), e = d.getContentElement(b[0], b[1])) e.setValue(a), d.selectPage(b[0])
		}
		CKEDITOR.plugins.add("filebrowser", {
			requires: "popup",
			init: function(a) {
				a._.filebrowserFn = CKEDITOR.tools.addFunction(n, a);
				a.on("destroy", function() {
					CKEDITOR.tools.removeFunction(this._.filebrowserFn)
				})
			}
		});
		CKEDITOR.on("dialogDefinition", function(a) {
			if (a.editor.plugins.filebrowser)
				for (var c = a.data.definition, d, b = 0; b < c.contents.length; ++b)
					if (d = c.contents[b]) j(a.editor, a.data.name, c, d.elements),
						d.hidden && d.filebrowser && (d.hidden = !h(c, d.id, d.filebrowser))
		})
	})();
	(function() {
		function q(a) {
			var i = a.config,
				l = a.fire("uiSpace", {
					space: "top",
					html: ""
				}).html,
				o = function() {
					function f(a, c, e) {
						b.setStyle(c, t(e));
						b.setStyle("position", a)
					}

					function e(a) {
						var b = r.getDocumentPosition();
						switch (a) {
							case "top":
								f("absolute", "top", b.y - m - n);
								break;
							case "pin":
								f("fixed", "top", q);
								break;
							case "bottom":
								f("absolute", "top", b.y + (c.height || c.bottom - c.top) + n)
						}
						j = a
					}
					var j, r, k, c, h, m, s, l = i.floatSpaceDockedOffsetX || 0,
						n = i.floatSpaceDockedOffsetY || 0,
						p = i.floatSpacePinnedOffsetX || 0,
						q = i.floatSpacePinnedOffsetY ||
						0;
					return function(d) {
						if (r = a.editable())
							if (d && "focus" == d.name && b.show(), b.removeStyle("left"), b.removeStyle("right"), k = b.getClientRect(), c = r.getClientRect(), h = g.getViewPaneSize(), m = k.height, s = "pageXOffset" in g.$ ? g.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft, j) {
								m + n <= c.top ? e("top") : m + n > h.height - c.bottom ? e("pin") : e("bottom");
								var d = h.width / 2,
									d = 0 < c.left && c.right < h.width && c.width > k.width ? "rtl" == a.config.contentsLangDirection ? "right" : "left" : d - c.left > c.right - d ? "left" : "right",
									f;
								k.width > h.width ?
									(d = "left", f = 0) : (f = "left" == d ? 0 < c.left ? c.left : 0 : c.right < h.width ? h.width - c.right : 0, f + k.width > h.width && (d = "left" == d ? "right" : "left", f = 0));
								b.setStyle(d, t(("pin" == j ? p : l) + f + ("pin" == j ? 0 : "left" == d ? s : -s)))
							} else j = "pin", e("pin"), o(d)
					}
				}();
			if (l) {
				var b = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(u.output({
						content: l,
						id: a.id,
						langDir: a.lang.dir,
						langCode: a.langCode,
						name: a.name,
						style: "display:none;z-index:" + (i.baseFloatZIndex - 1),
						topId: a.ui.spaceId("top"),
						voiceLabel: a.lang.editorPanel + ", " +
							a.name
					}))),
					p = CKEDITOR.tools.eventsBuffer(500, o),
					e = CKEDITOR.tools.eventsBuffer(100, o);
				b.unselectable();
				b.on("mousedown", function(a) {
					a = a.data;
					a.getTarget().hasAscendant("a", 1) || a.preventDefault()
				});
				a.on("focus", function(b) {
					o(b);
					a.on("change", p.input);
					g.on("scroll", e.input);
					g.on("resize", e.input)
				});
				a.on("blur", function() {
					b.hide();
					a.removeListener("change", p.input);
					g.removeListener("scroll", e.input);
					g.removeListener("resize", e.input)
				});
				a.on("destroy", function() {
					g.removeListener("scroll", e.input);
					g.removeListener("resize",
						e.input);
					b.clearCustomData();
					b.remove()
				});
				a.focusManager.hasFocus && b.show();
				a.focusManager.add(b, 1)
			}
		}
		var u = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'),
			g = CKEDITOR.document.getWindow(),
			t = CKEDITOR.tools.cssLength;
		CKEDITOR.plugins.add("floatingspace", {
			init: function(a) {
				a.on("loaded", function() {
					q(this)
				}, null, null, 20)
			}
		})
	})();
	CKEDITOR.plugins.add("listblock", {
		requires: "panel",
		onLoad: function() {
			var f = CKEDITOR.addTemplate("panel-list", '<ul role="presentation" class="cke_panel_list">{items}</ul>'),
				g = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),
				h = CKEDITOR.addTemplate("panel-list-group",
					'<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>'),
				i = /\'/g;
			CKEDITOR.ui.panel.prototype.addListBlock = function(a, b) {
				return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
			};
			CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
				base: CKEDITOR.ui.panel.block,
				$: function(a, b) {
					var b = b || {},
						c = b.attributes || (b.attributes = {});
					(this.multiSelect = !!b.multiSelect) && (c["aria-multiselectable"] = !0);
					!c.role && (c.role = "listbox");
					this.base.apply(this, arguments);
					this.element.setAttribute("role",
						c.role);
					c = this.keys;
					c[40] = "next";
					c[9] = "next";
					c[38] = "prev";
					c[CKEDITOR.SHIFT + 9] = "prev";
					c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
					CKEDITOR.env.ie && (c[13] = "mouseup");
					this._.pendingHtml = [];
					this._.pendingList = [];
					this._.items = {};
					this._.groups = {}
				},
				_: {
					close: function() {
						if (this._.started) {
							var a = f.output({
								items: this._.pendingList.join("")
							});
							this._.pendingList = [];
							this._.pendingHtml.push(a);
							delete this._.started
						}
					},
					getClick: function() {
						this._.click || (this._.click = CKEDITOR.tools.addFunction(function(a) {
							var b = this.toggle(a);
							if (this.onClick) this.onClick(a, b)
						}, this));
						return this._.click
					}
				},
				proto: {
					add: function(a, b, c) {
						var d = CKEDITOR.tools.getNextId();
						this._.started || (this._.started = 1, this._.size = this._.size || 0);
						this._.items[a] = d;
						var e;
						e = CKEDITOR.tools.htmlEncodeAttr(a).replace(i, "\\'");
						a = {
							id: d,
							val: e,
							onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick",
							clickFn: this._.getClick(),
							title: CKEDITOR.tools.htmlEncodeAttr(c || a),
							text: b || a
						};
						this._.pendingList.push(g.output(a))
					},
					startGroup: function(a) {
						this._.close();
						var b = CKEDITOR.tools.getNextId();
						this._.groups[a] = b;
						this._.pendingHtml.push(h.output({
							id: b,
							label: a
						}))
					},
					commit: function() {
						this._.close();
						this.element.appendHtml(this._.pendingHtml.join(""));
						delete this._.size;
						this._.pendingHtml = []
					},
					toggle: function(a) {
						var b = this.isMarked(a);
						b ? this.unmark(a) : this.mark(a);
						return !b
					},
					hideGroup: function(a) {
						var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
						a && (a.setStyle("display", "none"), b && "ul" == b.getName() && b.setStyle("display", "none"))
					},
					hideItem: function(a) {
						this.element.getDocument().getById(this._.items[a]).setStyle("display",
							"none")
					},
					showAll: function() {
						var a = this._.items,
							b = this._.groups,
							c = this.element.getDocument(),
							d;
						for (d in a) c.getById(a[d]).setStyle("display", "");
						for (var e in b) a = c.getById(b[e]), d = a.getNext(), a.setStyle("display", ""), d && "ul" == d.getName() && d.setStyle("display", "")
					},
					mark: function(a) {
						this.multiSelect || this.unmarkAll();
						var a = this._.items[a],
							b = this.element.getDocument().getById(a);
						b.addClass("cke_selected");
						this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", !0);
						this.onMark && this.onMark(b)
					},
					unmark: function(a) {
						var b = this.element.getDocument(),
							a = this._.items[a],
							c = b.getById(a);
						c.removeClass("cke_selected");
						b.getById(a + "_option").removeAttribute("aria-selected");
						this.onUnmark && this.onUnmark(c)
					},
					unmarkAll: function() {
						var a = this._.items,
							b = this.element.getDocument(),
							c;
						for (c in a) {
							var d = a[c];
							b.getById(d).removeClass("cke_selected");
							b.getById(d + "_option").removeAttribute("aria-selected")
						}
						this.onUnmark && this.onUnmark()
					},
					isMarked: function(a) {
						return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
					},
					focus: function(a) {
						this._.focusIndex = -1;
						var b = this.element.getElementsByTag("a"),
							c, d = -1;
						if (a)
							for (c = this.element.getDocument().getById(this._.items[a]).getFirst(); a = b.getItem(++d);) {
								if (a.equals(c)) {
									this._.focusIndex = d;
									break
								}
							} else this.element.focus();
						c && setTimeout(function() {
							c.focus()
						}, 0)
					}
				}
			})
		}
	});
	CKEDITOR.plugins.add("richcombo", {
		requires: "floatpanel,listblock,button",
		beforeInit: function(d) {
			d.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
		}
	});
	(function() {
		var d = '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" hidefocus=true title="{title}" tabindex="-1"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : '" href="javascript:void(\'{titleJs}\')"') + ' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';
		CKEDITOR.env.gecko && CKEDITOR.env.mac && (d += ' onkeypress="return false;"');
		CKEDITOR.env.gecko && (d += ' onblur="this.style.cssText = this.style.cssText;"');
		var d = d + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"),
			i = CKEDITOR.addTemplate("combo", d);
		CKEDITOR.UI_RICHCOMBO = "richcombo";
		CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
			$: function(a) {
				CKEDITOR.tools.extend(this, a, {
					canGroup: !1,
					title: a.label,
					modes: {
						wysiwyg: 1
					},
					editorFocus: 1
				});
				a = this.panel || {};
				delete this.panel;
				this.id = CKEDITOR.tools.getNextNumber();
				this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
				a.className = "cke_combopanel";
				a.block = {
					multiSelect: a.multiSelect,
					attributes: a.attributes
				};
				a.toolbarRelated = !0;
				this._ = {
					panelDefinition: a,
					items: {}
				}
			},
			proto: {
				renderHtml: function(a) {
					var b = [];
					this.render(a, b);
					return b.join("")
				},
				render: function(a, b) {
					function g() {
						var c = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
						a.readOnly && !this.readOnly && (c = CKEDITOR.TRISTATE_DISABLED);
						this.setState(c);
						this.setValue("");
						c != CKEDITOR.TRISTATE_DISABLED && this.refresh && this.refresh()
					}
					var d = CKEDITOR.env,
						h = "cke_" + this.id,
						e = CKEDITOR.tools.addFunction(function(b) {
							j && (a.unlockSelection(1), j = 0);
							c.execute(b)
						}, this),
						f = this,
						c = {
							id: h,
							combo: this,
							focus: function() {
								CKEDITOR.document.getById(h).getChild(1).focus()
							},
							execute: function(c) {
								var b = f._;
								if (b.state != CKEDITOR.TRISTATE_DISABLED)
									if (f.createPanel(a), b.on) b.panel.hide();
									else {
										f.commit();
										var d = f.getValue();
										d ? b.list.mark(d) : b.list.unmarkAll();
										b.panel.showBlock(f.id, new CKEDITOR.dom.element(c), 4)
									}
							},
							clickFn: e
						};
					a.on("activeFilterChange", g, this);
					a.on("mode", g, this);
					a.on("selectionChange", g, this);
					!this.readOnly && a.on("readOnly", g, this);
					var k = CKEDITOR.tools.addFunction(function(b, d) {
							var b = new CKEDITOR.dom.event(b),
								g = b.getKeystroke();
							if (40 == g) a.once("panelShow", function(a) {
								a.data._.panel._.currentBlock.onKeyDown(40)
							});
							switch (g) {
								case 13:
								case 32:
								case 40:
									CKEDITOR.tools.callFunction(e, d);
									break;
								default:
									c.onkey(c, g)
							}
							b.preventDefault()
						}),
						l = CKEDITOR.tools.addFunction(function() {
							c.onfocus && c.onfocus()
						}),
						j = 0;
					c.keyDownFn = k;
					d = {
						id: h,
						name: this.name || this.command,
						label: this.label,
						title: this.title,
						cls: this.className || "",
						titleJs: d.gecko && !d.hc ? "" : (this.title || "").replace("'", ""),
						keydownFn: k,
						focusFn: l,
						clickFn: e
					};
					i.output(d, b);
					if (this.onRender) this.onRender();
					return c
				},
				createPanel: function(a) {
					if (!this._.panel) {
						var b = this._.panelDefinition,
							d = this._.panelDefinition.block,
							i = b.parent || CKEDITOR.document.getBody(),
							h = "cke_combopanel__" + this.name,
							e = new CKEDITOR.ui.floatPanel(a, i, b),
							f = e.addListBlock(this.id, d),
							c = this;
						e.onShow = function() {
							this.element.addClass(h);
							c.setState(CKEDITOR.TRISTATE_ON);
							c._.on = 1;
							c.editorFocus && !a.focusManager.hasFocus && a.focus();
							if (c.onOpen) c.onOpen();
							a.once("panelShow", function() {
								f.focus(!f.multiSelect && c.getValue())
							})
						};
						e.onHide = function(b) {
							this.element.removeClass(h);
							c.setState(c.modes && c.modes[a.mode] ? CKEDITOR.TRISTATE_OFF :
								CKEDITOR.TRISTATE_DISABLED);
							c._.on = 0;
							if (!b && c.onClose) c.onClose()
						};
						e.onEscape = function() {
							e.hide(1)
						};
						f.onClick = function(a, b) {
							c.onClick && c.onClick.call(c, a, b);
							e.hide()
						};
						this._.panel = e;
						this._.list = f;
						e.getBlock(this.id).onHide = function() {
							c._.on = 0;
							c.setState(CKEDITOR.TRISTATE_OFF)
						};
						this.init && this.init()
					}
				},
				setValue: function(a, b) {
					this._.value = a;
					var d = this.document.getById("cke_" + this.id + "_text");
					d && (!a && !b ? (b = this.label, d.addClass("cke_combo_inlinelabel")) : d.removeClass("cke_combo_inlinelabel"), d.setText("undefined" !=
						typeof b ? b : a))
				},
				getValue: function() {
					return this._.value || ""
				},
				unmarkAll: function() {
					this._.list.unmarkAll()
				},
				mark: function(a) {
					this._.list.mark(a)
				},
				hideItem: function(a) {
					this._.list.hideItem(a)
				},
				hideGroup: function(a) {
					this._.list.hideGroup(a)
				},
				showAll: function() {
					this._.list.showAll()
				},
				add: function(a, b, d) {
					this._.items[a] = d || a;
					this._.list.add(a, b, d)
				},
				startGroup: function(a) {
					this._.list.startGroup(a)
				},
				commit: function() {
					this._.committed || (this._.list.commit(), this._.committed = 1, CKEDITOR.ui.fire("ready", this));
					this._.committed = 1
				},
				setState: function(a) {
					if (this._.state != a) {
						var b = this.document.getById("cke_" + this.id);
						b.setState(a, "cke_combo");
						a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled");
						this._.state = a
					}
				},
				getState: function() {
					return this._.state
				},
				enable: function() {
					this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
				},
				disable: function() {
					this._.state != CKEDITOR.TRISTATE_DISABLED && (this._.lastState = this._.state, this.setState(CKEDITOR.TRISTATE_DISABLED))
				}
			},
			statics: {
				handler: {
					create: function(a) {
						return new CKEDITOR.ui.richCombo(a)
					}
				}
			}
		});
		CKEDITOR.ui.prototype.addRichCombo = function(a, b) {
			this.add(a, CKEDITOR.UI_RICHCOMBO, b)
		}
	})();
	CKEDITOR.plugins.add("format", {
		requires: "richcombo",
		init: function(a) {
			if (!a.blockless) {
				for (var f = a.config, c = a.lang.format, j = f.format_tags.split(";"), d = {}, k = 0, l = [], g = 0; g < j.length; g++) {
					var h = j[g],
						i = new CKEDITOR.style(f["format_" + h]);
					if (!a.filter.customConfig || a.filter.check(i)) k++, d[h] = i, d[h]._.enterMode = a.config.enterMode, l.push(i)
				}
				0 !== k && a.ui.addRichCombo("Format", {
					label: c.label,
					title: c.panelTitle,
					toolbar: "styles,20",
					allowedContent: l,
					panel: {
						css: [CKEDITOR.skin.getPath("editor")].concat(f.contentsCss),
						multiSelect: !1,
						attributes: {
							"aria-label": c.panelTitle
						}
					},
					init: function() {
						this.startGroup(c.panelTitle);
						for (var a in d) {
							var e = c["tag_" + a];
							this.add(a, d[a].buildPreview(e), e)
						}
					},
					onClick: function(b) {
						a.focus();
						a.fire("saveSnapshot");
						var b = d[b],
							e = a.elementPath();
						a[b.checkActive(e, a) ? "removeStyle" : "applyStyle"](b);
						setTimeout(function() {
							a.fire("saveSnapshot")
						}, 0)
					},
					onRender: function() {
						a.on("selectionChange", function(b) {
							var e = this.getValue(),
								b = b.data.path;
							this.refresh();
							for (var c in d)
								if (d[c].checkActive(b, a)) {
									c !=
										e && this.setValue(c, a.lang.format["tag_" + c]);
									return
								}
							this.setValue("")
						}, this)
					},
					onOpen: function() {
						this.showAll();
						for (var b in d) a.activeFilter.check(d[b]) || this.hideItem(b)
					},
					refresh: function() {
						var b = a.elementPath();
						if (b) {
							if (b.isContextFor("p"))
								for (var c in d)
									if (a.activeFilter.check(d[c])) return;
							this.setState(CKEDITOR.TRISTATE_DISABLED)
						}
					}
				})
			}
		}
	});
	CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div";
	CKEDITOR.config.format_p = {
		element: "p"
	};
	CKEDITOR.config.format_div = {
		element: "div"
	};
	CKEDITOR.config.format_pre = {
		element: "pre"
	};
	CKEDITOR.config.format_address = {
		element: "address"
	};
	CKEDITOR.config.format_h1 = {
		element: "h1"
	};
	CKEDITOR.config.format_h2 = {
		element: "h2"
	};
	CKEDITOR.config.format_h3 = {
		element: "h3"
	};
	CKEDITOR.config.format_h4 = {
		element: "h4"
	};
	CKEDITOR.config.format_h5 = {
		element: "h5"
	};
	CKEDITOR.config.format_h6 = {
		element: "h6"
	};
	(function() {
		var b = {
			canUndo: !1,
			exec: function(a) {
				var b = a.document.createElement("hr");
				a.insertElement(b)
			},
			allowedContent: "hr",
			requiredContent: "hr"
		};
		CKEDITOR.plugins.add("horizontalrule", {
			init: function(a) {
				a.blockless || (a.addCommand("horizontalrule", b), a.ui.addButton && a.ui.addButton("HorizontalRule", {
					label: a.lang.horizontalrule.toolbar,
					command: "horizontalrule",
					toolbar: "insert,40"
				}))
			}
		})
	})();
	CKEDITOR.plugins.add("htmlwriter", {
		init: function(b) {
			var a = new CKEDITOR.htmlWriter;
			a.forceSimpleAmpersand = b.config.forceSimpleAmpersand;
			a.indentationChars = b.config.dataIndentationChars || "\t";
			b.dataProcessor.writer = a
		}
	});
	CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
		base: CKEDITOR.htmlParser.basicWriter,
		$: function() {
			this.base();
			this.indentationChars = "\t";
			this.selfClosingEnd = " />";
			this.lineBreakChars = "\n";
			this.sortAttributes = 1;
			this._.indent = 0;
			this._.indentation = "";
			this._.inPre = 0;
			this._.rules = {};
			var b = CKEDITOR.dtd,
				a;
			for (a in CKEDITOR.tools.extend({}, b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent)) this.setRules(a, {
				indent: !b[a]["#"],
				breakBeforeOpen: 1,
				breakBeforeClose: !b[a]["#"],
				breakAfterClose: 1,
				needsSpace: a in
					b.$block && !(a in {
						li: 1,
						dt: 1,
						dd: 1
					})
			});
			this.setRules("br", {
				breakAfterOpen: 1
			});
			this.setRules("title", {
				indent: 0,
				breakAfterOpen: 0
			});
			this.setRules("style", {
				indent: 0,
				breakBeforeClose: 1
			});
			this.setRules("pre", {
				breakAfterOpen: 1,
				indent: 0
			})
		},
		proto: {
			openTag: function(b) {
				var a = this._.rules[b];
				this._.afterCloser && (a && a.needsSpace && this._.needsSpace) && this._.output.push("\n");
				this._.indent ? this.indentation() : a && a.breakBeforeOpen && (this.lineBreak(), this.indentation());
				this._.output.push("<", b);
				this._.afterCloser = 0
			},
			openTagClose: function(b, a) {
				var c = this._.rules[b];
				a ? (this._.output.push(this.selfClosingEnd), c && c.breakAfterClose && (this._.needsSpace = c.needsSpace)) : (this._.output.push(">"), c && c.indent && (this._.indentation += this.indentationChars));
				c && c.breakAfterOpen && this.lineBreak();
				"pre" == b && (this._.inPre = 1)
			},
			attribute: function(b, a) {
				"string" == typeof a && (this.forceSimpleAmpersand && (a = a.replace(/&amp;/g, "&")), a = CKEDITOR.tools.htmlEncodeAttr(a));
				this._.output.push(" ", b, '="', a, '"')
			},
			closeTag: function(b) {
				var a = this._.rules[b];
				a && a.indent && (this._.indentation = this._.indentation.substr(this.indentationChars.length));
				this._.indent ? this.indentation() : a && a.breakBeforeClose && (this.lineBreak(), this.indentation());
				this._.output.push("</", b, ">");
				"pre" == b && (this._.inPre = 0);
				a && a.breakAfterClose && (this.lineBreak(), this._.needsSpace = a.needsSpace);
				this._.afterCloser = 1
			},
			text: function(b) {
				this._.indent && (this.indentation(), !this._.inPre && (b = CKEDITOR.tools.ltrim(b)));
				this._.output.push(b)
			},
			comment: function(b) {
				this._.indent && this.indentation();
				this._.output.push("<\!--", b, "--\>")
			},
			lineBreak: function() {
				!this._.inPre && 0 < this._.output.length && this._.output.push(this.lineBreakChars);
				this._.indent = 1
			},
			indentation: function() {
				!this._.inPre && this._.indentation && this._.output.push(this._.indentation);
				this._.indent = 0
			},
			reset: function() {
				this._.output = [];
				this._.indent = 0;
				this._.indentation = "";
				this._.afterCloser = 0;
				this._.inPre = 0
			},
			setRules: function(b, a) {
				var c = this._.rules[b];
				c ? CKEDITOR.tools.extend(c, a, !0) : this._.rules[b] = a
			}
		}
	});
	(function() {
		function k(a) {
			var d = this.editor,
				b = a.document,
				c = b.body;
			(a = b.getElementById("cke_actscrpt")) && a.parentNode.removeChild(a);
			(a = b.getElementById("cke_shimscrpt")) && a.parentNode.removeChild(a);
			CKEDITOR.env.gecko && (c.contentEditable = !1, 2E4 > CKEDITOR.env.version && (c.innerHTML = c.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, ""), setTimeout(function() {
				var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(b));
				a.setStart(new CKEDITOR.dom.node(c), 0);
				d.getSelection().selectRanges([a])
			}, 0)));
			c.contentEditable = !0;
			CKEDITOR.env.ie && (c.hideFocus = !0, c.disabled = !0, c.removeAttribute("disabled"));
			delete this._.isLoadingData;
			this.$ = c;
			b = new CKEDITOR.dom.document(b);
			this.setup();
			CKEDITOR.env.ie && (b.getDocumentElement().addClass(b.$.compatMode), d.config.enterMode != CKEDITOR.ENTER_P && this.attachListener(b, "selectionchange", function() {
				var a = b.getBody(),
					c = d.getSelection(),
					e = c && c.getRanges()[0];
				e && (a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function() {
					e = d.getSelection().getRanges()[0];
					if (!e.startContainer.equals("body")) {
						a.getFirst().remove(1);
						e.moveToElementEditEnd(a);
						e.select()
					}
				}, 0)
			}));
			if (CKEDITOR.env.webkit || CKEDITOR.env.ie && 10 < CKEDITOR.env.version) b.getDocumentElement().on("mousedown", function(a) {
				a.data.getTarget().is("html") && setTimeout(function() {
					d.editable().focus()
				})
			});
			try {
				d.document.$.execCommand("2D-position", !1, !0)
			} catch (e) {}
			try {
				d.document.$.execCommand("enableInlineTableEditing", !1, !d.config.disableNativeTableHandles)
			} catch (g) {}
			if (d.config.disableObjectResizing) try {
				this.getDocument().$.execCommand("enableObjectResizing", !1, !1)
			} catch (f) {
				this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function(a) {
					a.data.preventDefault()
				})
			}(CKEDITOR.env.gecko || CKEDITOR.env.ie && "CSS1Compat" == d.document.$.compatMode) && this.attachListener(this, "keydown", function(a) {
				var b = a.data.getKeystroke();
				if (b == 33 || b == 34)
					if (CKEDITOR.env.ie) setTimeout(function() {
						d.getSelection().scrollIntoView()
					}, 0);
					else if (d.window.$.innerHeight > this.$.offsetHeight) {
					var c = d.createRange();
					c[b == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
					c.select();
					a.data.preventDefault()
				}
			});
			CKEDITOR.env.ie && this.attachListener(b, "blur", function() {
				try {
					b.$.selection.empty()
				} catch (a) {}
			});
			d.document.getElementsByTag("title").getItem(0).data("cke-title", d.document.$.title);
			CKEDITOR.env.ie && (d.document.$.title = this._.docTitle);
			CKEDITOR.tools.setTimeout(function() {
				if (this.status == "unloaded") this.status = "ready";
				d.fire("contentDom");
				if (this._.isPendingFocus) {
					d.focus();
					this._.isPendingFocus = false
				}
				setTimeout(function() {
					d.fire("dataReady")
				}, 0);
				CKEDITOR.env.ie &&
					setTimeout(function() {
						if (d.document) {
							var a = d.document.$.body;
							a.runtimeStyle.marginBottom = "0px";
							a.runtimeStyle.marginBottom = ""
						}
					}, 1E3)
			}, 0, this)
		}

		function l() {
			var a = [];
			if (8 <= CKEDITOR.document.$.documentMode) {
				a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
				var d = [],
					b;
				for (b in CKEDITOR.dtd.$removeEmpty) d.push("html.CSS1Compat " + b + "[contenteditable=false]");
				a.push(d.join(",") + "{display:inline-block}")
			} else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
			a.push("html{cursor:text;*cursor:auto}");
			a.push("img,input,textarea{cursor:default}");
			return a.join("\n")
		}
		CKEDITOR.plugins.add("wysiwygarea", {
			init: function(a) {
				a.config.fullPage && a.addFeature({
					allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
					requiredContent: "body"
				});
				a.addMode("wysiwyg", function(d) {
					function b(b) {
						b && b.removeListener();
						a.editable(new j(a, e.$.contentWindow.document.body));
						a.setData(a.getData(1), d)
					}
					var c = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain +
							")();" : "") + "document.close();",
						c = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(c) + "}())" : "",
						e = CKEDITOR.dom.element.createFromHtml('<iframe src="' + c + '" frameBorder="0"></iframe>');
					e.setStyles({
						width: "100%",
						height: "100%"
					});
					e.addClass("cke_wysiwyg_frame cke_reset");
					var g = a.ui.space("contents");
					g.append(e);
					if (c = CKEDITOR.env.ie || CKEDITOR.env.gecko) e.on("load", b);
					var f = a.title,
						h = a.lang.common.editorHelp;
					f && (CKEDITOR.env.ie && (f += ", " + h), e.setAttribute("title",
						f));
					var f = CKEDITOR.tools.getNextId(),
						i = CKEDITOR.dom.element.createFromHtml('<span id="' + f + '" class="cke_voice_label">' + h + "</span>");
					g.append(i, 1);
					a.on("beforeModeUnload", function(a) {
						a.removeListener();
						i.remove()
					});
					e.setAttributes({
						"aria-describedby": f,
						tabIndex: a.tabIndex,
						allowTransparency: "true"
					});
					!c && b();
					CKEDITOR.env.webkit && (c = function() {
						g.setStyle("width", "100%");
						e.hide();
						e.setSize("width", g.getSize("width"));
						g.removeStyle("width");
						e.show()
					}, e.setCustomData("onResize", c), CKEDITOR.document.getWindow().on("resize",
						c));
					a.fire("ariaWidget", e)
				})
			}
		});
		CKEDITOR.editor.prototype.addContentsCss = function(a) {
			var d = this.config,
				b = d.contentsCss;
			CKEDITOR.tools.isArray(b) || (d.contentsCss = b ? [b] : []);
			d.contentsCss.push(a)
		};
		var j = CKEDITOR.tools.createClass({
			$: function(a) {
				this.base.apply(this, arguments);
				this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(a) {
					CKEDITOR.tools.setTimeout(k, 0, this, a)
				}, this);
				this._.docTitle = this.getWindow().getFrame().getAttribute("title")
			},
			base: CKEDITOR.editable,
			proto: {
				setData: function(a, d) {
					var b =
						this.editor;
					if (d) this.setHtml(a), b.fire("dataReady");
					else {
						this._.isLoadingData = !0;
						b._.dataStore = {
							id: 1
						};
						var c = b.config,
							e = c.fullPage,
							g = c.docType,
							f = CKEDITOR.tools.buildStyleHtml(l()).replace(/<style>/, '<style data-cke-temp="1">');
						e || (f += CKEDITOR.tools.buildStyleHtml(b.config.contentsCss));
						var h = c.baseHref ? '<base href="' + c.baseHref + '" data-cke-temp="1" />' : "";
						e && (a = a.replace(/<!DOCTYPE[^>]*>/i, function(a) {
							b.docType = g = a;
							return ""
						}).replace(/<\?xml\s[^\?]*\?>/i, function(a) {
							b.xmlDeclaration = a;
							return ""
						}));
						a = b.dataProcessor.toHtml(a);
						e ? (/<body[\s|>]/.test(a) || (a = "<body>" + a), /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>"), h && (a = a.replace(/<head>/, "$&" + h)), a = a.replace(/<\/head\s*>/, f + "$&"), a = g + a) : a = c.docType + '<html dir="' + c.contentsLangDirection + '" lang="' + (c.contentsLanguage || b.langCode) + '"><head><title>' + this._.docTitle + "</title>" + h + f + "</head><body" +
							(c.bodyId ? ' id="' + c.bodyId + '"' : "") + (c.bodyClass ? ' class="' + c.bodyClass + '"' : "") + ">" + a + "</body></html>";
						CKEDITOR.env.gecko && (a = a.replace(/<body/, '<body contenteditable="true" '), 2E4 > CKEDITOR.env.version && (a = a.replace(/<body[^>]*>/, "$&<\!-- cke-content-start --\>")));
						c = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" +
							(CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
						CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (c += '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)<\/script>');
						a = a.replace(/(?=\s*<\/(:?head)>)/, c);
						this.clearCustomData();
						this.clearListeners();
						b.fire("contentDomUnload");
						var i = this.getDocument();
						try {
							i.write(a)
						} catch (j) {
							setTimeout(function() {
								i.write(a)
							}, 0)
						}
					}
				},
				getData: function(a) {
					if (a) return this.getHtml();
					var a =
						this.editor,
						d = a.config,
						b = d.fullPage,
						c = b && a.docType,
						e = b && a.xmlDeclaration,
						g = this.getDocument(),
						b = b ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
					CKEDITOR.env.gecko && d.enterMode != CKEDITOR.ENTER_BR && (b = b.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
					b = a.dataProcessor.toDataFormat(b);
					e && (b = e + "\n" + b);
					c && (b = c + "\n" + b);
					return b
				},
				focus: function() {
					this._.isLoadingData ? this._.isPendingFocus = !0 : j.baseProto.focus.call(this)
				},
				detach: function() {
					var a = this.editor,
						d = a.document,
						a = a.window.getFrame();
					j.baseProto.detach.call(this);
					this.clearCustomData();
					d.getDocumentElement().clearCustomData();
					a.clearCustomData();
					CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
					(d = a.removeCustomData("onResize")) && d.removeListener();
					a.remove()
				}
			}
		})
	})();
	CKEDITOR.config.disableObjectResizing = !1;
	CKEDITOR.config.disableNativeTableHandles = !0;
	CKEDITOR.config.disableNativeSpellChecker = !0;
	CKEDITOR.config.contentsCss = CKEDITOR.getUrl("contents.css");
	(function() {
		function e(b, a) {
			a || (a = b.getSelection().getSelectedElement());
			if (a && a.is("img") && !a.data("cke-realelement") && !a.isReadOnly()) return a
		}

		function f(b) {
			var a = b.getStyle("float");
			if ("inherit" == a || "none" == a) a = 0;
			a || (a = b.getAttribute("align"));
			return a
		}
		CKEDITOR.plugins.add("image", {
			requires: "dialog",
			init: function(b) {
				if (!b.plugins.image2) {
					CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
					var a = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
					CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (a = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
					b.addCommand("image", new CKEDITOR.dialogCommand("image", {
						allowedContent: a,
						requiredContent: "img[alt,src]",
						contentTransformations: [
							["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
							["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
						]
					}));
					b.ui.addButton && b.ui.addButton("Image", {
						label: b.lang.common.image,
						command: "image",
						toolbar: "insert,10"
					});
					b.on("doubleclick", function(b) {
						var a =
							b.data.element;
						a.is("img") && (!a.data("cke-realelement") && !a.isReadOnly()) && (b.data.dialog = "image")
					});
					b.addMenuItems && b.addMenuItems({
						image: {
							label: b.lang.image.menu,
							command: "image",
							group: "image"
						}
					});
					b.contextMenu && b.contextMenu.addListener(function(a) {
						if (e(b, a)) return {
							image: CKEDITOR.TRISTATE_OFF
						}
					})
				}
			},
			afterInit: function(b) {
				function a(a) {
					var d = b.getCommand("justify" + a);
					if (d) {
						if ("left" == a || "right" == a) d.on("exec", function(d) {
							var c = e(b),
								g;
							c && (g = f(c), g == a ? (c.removeStyle("float"), a == f(c) && c.removeAttribute("align")) :
								c.setStyle("float", a), d.cancel())
						});
						d.on("refresh", function(d) {
							var c = e(b);
							c && (c = f(c), this.setState(c == a ? CKEDITOR.TRISTATE_ON : "right" == a || "left" == a ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), d.cancel())
						})
					}
				}
				b.plugins.image2 || (a("left"), a("right"), a("center"), a("block"))
			}
		})
	})();
	CKEDITOR.config.image_removeLinkByEmptyURL = !0;
	(function() {
		function k(a, b) {
			var e, f;
			b.on("refresh", function(a) {
				var b = [i],
					c;
				for (c in a.data.states) b.push(a.data.states[c]);
				this.setState(CKEDITOR.tools.search(b, m) ? m : i)
			}, b, null, 100);
			b.on("exec", function(b) {
				e = a.getSelection();
				f = e.createBookmarks(1);
				b.data || (b.data = {});
				b.data.done = !1
			}, b, null, 0);
			b.on("exec", function() {
				a.forceNextSelectionCheck();
				e.selectBookmarks(f)
			}, b, null, 100)
		}
		var i = CKEDITOR.TRISTATE_DISABLED,
			m = CKEDITOR.TRISTATE_OFF;
		CKEDITOR.plugins.add("indent", {
			init: function(a) {
				var b = CKEDITOR.plugins.indent.genericDefinition;
				k(a, a.addCommand("indent", new b(!0)));
				k(a, a.addCommand("outdent", new b));
				a.ui.addButton && (a.ui.addButton("Indent", {
					label: a.lang.indent.indent,
					command: "indent",
					directional: !0,
					toolbar: "indent,20"
				}), a.ui.addButton("Outdent", {
					label: a.lang.indent.outdent,
					command: "outdent",
					directional: !0,
					toolbar: "indent,10"
				}));
				a.on("dirChanged", function(b) {
					var f = a.createRange(),
						j = b.data.node;
					f.setStartBefore(j);
					f.setEndAfter(j);
					for (var l = new CKEDITOR.dom.walker(f), c; c = l.next();)
						if (c.type == CKEDITOR.NODE_ELEMENT)
							if (!c.equals(j) &&
								c.getDirection()) {
								f.setStartAfter(c);
								l = new CKEDITOR.dom.walker(f)
							} else {
								var d = a.config.indentClasses;
								if (d)
									for (var g = b.data.dir == "ltr" ? ["_rtl", ""] : ["", "_rtl"], h = 0; h < d.length; h++)
										if (c.hasClass(d[h] + g[0])) {
											c.removeClass(d[h] + g[0]);
											c.addClass(d[h] + g[1])
										}
								d = c.getStyle("margin-right");
								g = c.getStyle("margin-left");
								d ? c.setStyle("margin-left", d) : c.removeStyle("margin-left");
								g ? c.setStyle("margin-right", g) : c.removeStyle("margin-right")
							}
				})
			}
		});
		CKEDITOR.plugins.indent = {
			genericDefinition: function(a) {
				this.isIndent = !!a;
				this.startDisabled = !this.isIndent
			},
			specificDefinition: function(a, b, e) {
				this.name = b;
				this.editor = a;
				this.jobs = {};
				this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR;
				this.isIndent = !!e;
				this.relatedGlobal = e ? "indent" : "outdent";
				this.indentKey = e ? 9 : CKEDITOR.SHIFT + 9;
				this.database = {}
			},
			registerCommands: function(a, b) {
				a.on("pluginsLoaded", function() {
					for (var a in b)(function(a, b) {
						var e = a.getCommand(b.relatedGlobal),
							c;
						for (c in b.jobs) e.on("exec", function(d) {
							d.data.done || (a.fire("lockSnapshot"), b.execJob(a, c) && (d.data.done = !0), a.fire("unlockSnapshot"), CKEDITOR.dom.element.clearAllMarkers(b.database))
						}, this, null, c), e.on("refresh", function(d) {
							d.data.states || (d.data.states = {});
							d.data.states[b.name + "@" + c] = b.refreshJob(a, c, d.data.path)
						}, this, null, c);
						a.addFeature(b)
					})(this, b[a])
				})
			}
		};
		CKEDITOR.plugins.indent.genericDefinition.prototype = {
			context: "p",
			exec: function() {}
		};
		CKEDITOR.plugins.indent.specificDefinition.prototype = {
			execJob: function(a, b) {
				var e = this.jobs[b];
				if (e.state != i) return e.exec.call(this, a)
			},
			refreshJob: function(a,
				b, e) {
				b = this.jobs[b];
				b.state = a.activeFilter.checkFeature(this) ? b.refresh.call(this, a, e) : i;
				return b.state
			},
			getContext: function(a) {
				return a.contains(this.context)
			}
		}
	})();
	(function() {
		function s(e) {
			function g(b) {
				for (var f = d.startContainer, a = d.endContainer; f && !f.getParent().equals(b);) f = f.getParent();
				for (; a && !a.getParent().equals(b);) a = a.getParent();
				if (!f || !a) return !1;
				for (var h = f, f = [], c = !1; !c;) h.equals(a) && (c = !0), f.push(h), h = h.getNext();
				if (1 > f.length) return !1;
				h = b.getParents(!0);
				for (a = 0; a < h.length; a++)
					if (h[a].getName && k[h[a].getName()]) {
						b = h[a];
						break
					}
				for (var h = n.isIndent ? 1 : -1, a = f[0], f = f[f.length - 1], c = CKEDITOR.plugins.list.listToArray(b, o), g = c[f.getCustomData("listarray_index")].indent,
					a = a.getCustomData("listarray_index"); a <= f.getCustomData("listarray_index"); a++)
					if (c[a].indent += h, 0 < h) {
						var l = c[a].parent;
						c[a].parent = new CKEDITOR.dom.element(l.getName(), l.getDocument())
					}
				for (a = f.getCustomData("listarray_index") + 1; a < c.length && c[a].indent > g; a++) c[a].indent += h;
				f = CKEDITOR.plugins.list.arrayToList(c, o, null, e.config.enterMode, b.getDirection());
				if (!n.isIndent) {
					var i;
					if ((i = b.getParent()) && i.is("li"))
						for (var h = f.listNode.getChildren(), m = [], j, a = h.count() - 1; 0 <= a; a--)(j = h.getItem(a)) && (j.is &&
							j.is("li")) && m.push(j)
				}
				f && f.listNode.replace(b);
				if (m && m.length)
					for (a = 0; a < m.length; a++) {
						for (j = b = m[a];
							(j = j.getNext()) && j.is && j.getName() in k;) CKEDITOR.env.needsNbspFiller && !b.getFirst(t) && b.append(d.document.createText(" ")), b.append(j);
						b.insertAfter(i)
					}
				f && e.fire("contentDomInvalidated");
				return !0
			}
			for (var n = this, o = this.database, k = this.context, l = e.getSelection(), l = (l && l.getRanges()).createIterator(), d; d = l.getNextRange();) {
				for (var b = d.getCommonAncestor(); b && !(b.type == CKEDITOR.NODE_ELEMENT && k[b.getName()]);) b =
					b.getParent();
				b || (b = d.startPath().contains(k)) && d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
				if (!b) {
					var c = d.getEnclosedNode();
					c && (c.type == CKEDITOR.NODE_ELEMENT && c.getName() in k) && (d.setStartAt(c, CKEDITOR.POSITION_AFTER_START), d.setEndAt(c, CKEDITOR.POSITION_BEFORE_END), b = c)
				}
				b && (d.startContainer.type == CKEDITOR.NODE_ELEMENT && d.startContainer.getName() in k) && (c = new CKEDITOR.dom.walker(d), c.evaluator = i, d.startContainer = c.next());
				b && (d.endContainer.type == CKEDITOR.NODE_ELEMENT && d.endContainer.getName() in k) &&
					(c = new CKEDITOR.dom.walker(d), c.evaluator = i, d.endContainer = c.previous());
				if (b) return g(b)
			}
			return 0
		}

		function p(e, g) {
			g || (g = e.contains(this.context));
			return g && e.block && e.block.equals(g.getFirst(i))
		}

		function i(e) {
			return e.type == CKEDITOR.NODE_ELEMENT && e.is("li")
		}

		function t(e) {
			return u(e) && v(e)
		}
		var u = CKEDITOR.dom.walker.whitespaces(!0),
			v = CKEDITOR.dom.walker.bookmark(!1, !0),
			q = CKEDITOR.TRISTATE_DISABLED,
			r = CKEDITOR.TRISTATE_OFF;
		CKEDITOR.plugins.add("indentlist", {
			requires: "indent",
			init: function(e) {
				function g(e,
					g) {
					i.specificDefinition.apply(this, arguments);
					this.requiredContent = ["ul", "ol"];
					e.on("key", function(g) {
						if ("wysiwyg" == e.mode && g.data.keyCode == this.indentKey) {
							var d = this.getContext(e.elementPath());
							if (d && (!this.isIndent || !p.call(this, e.elementPath(), d))) e.execCommand(this.relatedGlobal), g.cancel()
						}
					}, this);
					this.jobs[this.isIndent ? 10 : 30] = {
						refresh: this.isIndent ? function(e, d) {
							var b = this.getContext(d),
								c = p.call(this, d, b);
							return !b || !this.isIndent || c ? q : r
						} : function(e, d) {
							return !this.getContext(d) || this.isIndent ?
								q : r
						},
						exec: CKEDITOR.tools.bind(s, this)
					}
				}
				var i = CKEDITOR.plugins.indent;
				i.registerCommands(e, {
					indentlist: new g(e, "indentlist", !0),
					outdentlist: new g(e, "outdentlist")
				});
				CKEDITOR.tools.extend(g.prototype, i.specificDefinition.prototype, {
					context: {
						ol: 1,
						ul: 1
					}
				})
			}
		})
	})();
	(function() {
		function g(a, b) {
			var c = j.exec(a),
				d = j.exec(b);
			if (c) {
				if (!c[2] && "px" == d[2]) return d[1];
				if ("px" == c[2] && !d[2]) return d[1] + "px"
			}
			return b
		}
		var i = CKEDITOR.htmlParser.cssStyle,
			h = CKEDITOR.tools.cssLength,
			j = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
			k = {
				elements: {
					$: function(a) {
						var b = a.attributes;
						if ((b = (b = (b = b && b["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(b))) && b.children[0]) && a.attributes["data-cke-resizable"]) {
							var c = (new i(a)).rules,
								a = b.attributes,
								d = c.width,
								c =
								c.height;
							d && (a.width = g(a.width, d));
							c && (a.height = g(a.height, c))
						}
						return b
					}
				}
			};
		CKEDITOR.plugins.add("fakeobjects", {
			init: function(a) {
				a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
			},
			afterInit: function(a) {
				(a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(k)
			}
		});
		CKEDITOR.editor.prototype.createFakeElement = function(a, b, c, d) {
			var e = this.lang.fakeobjects,
				e = e[c] || e.unknown,
				b = {
					"class": b,
					"data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
					"data-cke-real-node-type": a.type,
					alt: e,
					title: e,
					align: a.getAttribute("align") || ""
				};
			CKEDITOR.env.hc || (b.src = CKEDITOR.tools.transparentImageData);
			c && (b["data-cke-real-element-type"] = c);
			d && (b["data-cke-resizable"] = d, c = new i, d = a.getAttribute("width"), a = a.getAttribute("height"), d && (c.rules.width = h(d)), a && (c.rules.height = h(a)), c.populate(b));
			return this.document.createElement("img", {
				attributes: b
			})
		};
		CKEDITOR.editor.prototype.createFakeParserElement = function(a, b, c, d) {
			var e = this.lang.fakeobjects,
				e = e[c] || e.unknown,
				f;
			f = new CKEDITOR.htmlParser.basicWriter;
			a.writeHtml(f);
			f = f.getHtml();
			b = {
				"class": b,
				"data-cke-realelement": encodeURIComponent(f),
				"data-cke-real-node-type": a.type,
				alt: e,
				title: e,
				align: a.attributes.align || ""
			};
			CKEDITOR.env.hc || (b.src = CKEDITOR.tools.transparentImageData);
			c && (b["data-cke-real-element-type"] = c);
			d && (b["data-cke-resizable"] = d, d = a.attributes, a = new i, c = d.width, d = d.height, void 0 != c && (a.rules.width = h(c)), void 0 != d && (a.rules.height = h(d)), a.populate(b));
			return new CKEDITOR.htmlParser.element("img", b)
		};
		CKEDITOR.editor.prototype.restoreRealElement =
			function(a) {
				if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) return null;
				var b = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
				if (a.data("cke-resizable")) {
					var c = a.getStyle("width"),
						a = a.getStyle("height");
					c && b.setAttribute("width", g(b.getAttribute("width"), c));
					a && b.setAttribute("height", g(b.getAttribute("height"), a))
				}
				return b
		}
	})();
	(function() {
		function m(c) {
			return c.replace(/'/g, "\\$&")
		}

		function n(c) {
			for (var b, a = c.length, f = [], e = 0; e < a; e++) b = c.charCodeAt(e), f.push(b);
			return "String.fromCharCode(" + f.join(",") + ")"
		}

		function o(c, b) {
			var a = c.plugins.link,
				f = a.compiledProtectionFunction.params,
				e, d;
			d = [a.compiledProtectionFunction.name, "("];
			for (var g = 0; g < f.length; g++) a = f[g].toLowerCase(), e = b[a], 0 < g && d.push(","), d.push("'", e ? m(encodeURIComponent(b[a])) : "", "'");
			d.push(")");
			return d.join("")
		}

		function l(c) {
			var c = c.config.emailProtection || "",
				b;
			c && "encode" != c && (b = {}, c.replace(/^([^(]+)\(([^)]+)\)$/, function(a, c, e) {
				b.name = c;
				b.params = [];
				e.replace(/[^,\s]+/g, function(a) {
					b.params.push(a)
				})
			}));
			return b
		}
		CKEDITOR.plugins.add("link", {
			requires: "dialog,fakeobjects",
			onLoad: function() {
				function c(b) {
					return a.replace(/%1/g, "rtl" == b ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
				}
				var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
					a = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
				CKEDITOR.addCss(c("ltr") + c("rtl"))
			},
			init: function(c) {
				var b = "a[!href]";
				CKEDITOR.dialog.isTabEnabled(c, "link", "advanced") && (b = b.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
				CKEDITOR.dialog.isTabEnabled(c, "link", "target") && (b = b.replace("]",
					",target,onclick]"));
				c.addCommand("link", new CKEDITOR.dialogCommand("link", {
					allowedContent: b,
					requiredContent: "a[href]"
				}));
				c.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
					allowedContent: "a[!name,id]",
					requiredContent: "a[name]"
				}));
				c.addCommand("unlink", new CKEDITOR.unlinkCommand);
				c.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
				c.setKeystroke(CKEDITOR.CTRL + 76, "link");
				c.ui.addButton && (c.ui.addButton("Link", {
					label: c.lang.link.toolbar,
					command: "link",
					toolbar: "links,10"
				}), c.ui.addButton("Unlink", {
					label: c.lang.link.unlink,
					command: "unlink",
					toolbar: "links,20"
				}), c.ui.addButton("Anchor", {
					label: c.lang.link.anchor.toolbar,
					command: "anchor",
					toolbar: "links,30"
				}));
				CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
				CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
				c.on("doubleclick", function(a) {
					var b = CKEDITOR.plugins.link.getSelectedLink(c) || a.data.element;
					if (!b.isReadOnly())
						if (b.is("a")) {
							a.data.dialog = b.getAttribute("name") && (!b.getAttribute("href") || !b.getChildCount()) ? "anchor" : "link";
							a.data.link = b
						} else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, b)) a.data.dialog = "anchor"
				}, null, null, 0);
				c.on("doubleclick", function(a) {
					a.data.dialog == "link" && a.data.link && c.getSelection().selectElement(a.data.link)
				}, null, null, 20);
				c.addMenuItems && c.addMenuItems({
					anchor: {
						label: c.lang.link.anchor.menu,
						command: "anchor",
						group: "anchor",
						order: 1
					},
					removeAnchor: {
						label: c.lang.link.anchor.remove,
						command: "removeAnchor",
						group: "anchor",
						order: 5
					},
					link: {
						label: c.lang.link.menu,
						command: "link",
						group: "link",
						order: 1
					},
					unlink: {
						label: c.lang.link.unlink,
						command: "unlink",
						group: "link",
						order: 5
					}
				});
				c.contextMenu && c.contextMenu.addListener(function(a) {
					if (!a || a.isReadOnly()) return null;
					a = CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, a);
					if (!a && !(a = CKEDITOR.plugins.link.getSelectedLink(c))) return null;
					var b = {};
					a.getAttribute("href") && a.getChildCount() && (b = {
						link: CKEDITOR.TRISTATE_OFF,
						unlink: CKEDITOR.TRISTATE_OFF
					});
					if (a && a.hasAttribute("name")) b.anchor = b.removeAnchor = CKEDITOR.TRISTATE_OFF;
					return b
				});
				this.compiledProtectionFunction =
					l(c)
			},
			afterInit: function(c) {
				c.dataProcessor.dataFilter.addRules({
					elements: {
						a: function(a) {
							return !a.attributes.name ? null : !a.children.length ? c.createFakeParserElement(a, "cke_anchor", "anchor") : null
						}
					}
				});
				var b = c._.elementsPath && c._.elementsPath.filters;
				b && b.push(function(a, b) {
					if ("a" == b && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, a) || a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount()))) return "anchor"
				})
			}
		});
		var p = /^javascript:/,
			q = /^mailto:([^?]+)(?:\?(.+))?$/,
			r = /subject=([^;?:@&=$,\/]*)/,
			s = /body=([^;?:@&=$,\/]*)/,
			t = /^#(.*)$/,
			u = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
			v = /^(_(?:self|top|parent|blank))$/,
			w = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
			x = /^javascript:([^(]+)\(([^)]+)\)$/,
			y = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
			z = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
			j = {
				id: "advId",
				dir: "advLangDir",
				accessKey: "advAccessKey",
				name: "advName",
				lang: "advLangCode",
				tabindex: "advTabIndex",
				title: "advTitle",
				type: "advContentType",
				"class": "advCSSClasses",
				charset: "advCharset",
				style: "advStyles",
				rel: "advRel"
			};
		CKEDITOR.plugins.link = {
			getSelectedLink: function(c) {
				var b = c.getSelection(),
					a = b.getSelectedElement();
				return a && a.is("a") ? a : (b = b.getRanges()[0]) ? (b.shrink(CKEDITOR.SHRINK_TEXT), c.elementPath(b.getCommonAncestor()).contains("a", 1)) : null
			},
			getEditorAnchors: function(c) {
				for (var b = c.editable(), a = b.isInline() && !c.plugins.divarea ? c.document : b, b = a.getElementsByTag("a"), a = a.getElementsByTag("img"), f = [], e = 0, d; d = b.getItem(e++);)
					if (d.data("cke-saved-name") ||
						d.hasAttribute("name")) f.push({
						name: d.data("cke-saved-name") || d.getAttribute("name"),
						id: d.getAttribute("id")
					});
				for (e = 0; d = a.getItem(e++);)(d = this.tryRestoreFakeAnchor(c, d)) && f.push({
					name: d.getAttribute("name"),
					id: d.getAttribute("id")
				});
				return f
			},
			fakeAnchor: !0,
			tryRestoreFakeAnchor: function(c, b) {
				if (b && b.data("cke-real-element-type") && "anchor" == b.data("cke-real-element-type")) {
					var a = c.restoreRealElement(b);
					if (a.data("cke-saved-name")) return a
				}
			},
			parseLinkAttributes: function(c, b) {
				var a = b && (b.data("cke-saved-href") ||
						b.getAttribute("href")) || "",
					f = c.plugins.link.compiledProtectionFunction,
					e = c.config.emailProtection,
					d, g = {};
				a.match(p) && ("encode" == e ? a = a.replace(w, function(a, b, c) {
					return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + (c && c.replace(/\\'/g, "'"))
				}) : e && a.replace(x, function(a, b, c) {
					if (b == f.name) {
						g.type = "email";
						for (var a = g.email = {}, b = /(^')|('$)/g, c = c.match(/[^,\s]+/g), d = c.length, e, h, i = 0; i < d; i++) e = decodeURIComponent, h = c[i].replace(b, "").replace(/\\'/g, "'"), h = e(h), e = f.params[i].toLowerCase(), a[e] = h;
						a.address = [a.name, a.domain].join("@")
					}
				}));
				if (!g.type)
					if (e = a.match(t)) g.type = "anchor", g.anchor = {}, g.anchor.name = g.anchor.id = e[1];
					else if (e = a.match(q)) {
					d = a.match(r);
					a = a.match(s);
					g.type = "email";
					var i = g.email = {};
					i.address = e[1];
					d && (i.subject = decodeURIComponent(d[1]));
					a && (i.body = decodeURIComponent(a[1]))
				} else if (a && (d = a.match(u))) g.type = "url", g.url = {}, g.url.protocol = d[1], g.url.url = d[2];
				if (b) {
					if (a = b.getAttribute("target")) g.target = {
						type: a.match(v) ? a : "frame",
						name: a
					};
					else if (a = (a = b.data("cke-pa-onclick") ||
						b.getAttribute("onclick")) && a.match(y))
						for (g.target = {
							type: "popup",
							name: a[1]
						}; e = z.exec(a[2]);)("yes" == e[2] || "1" == e[2]) && !(e[1] in {
							height: 1,
							width: 1,
							top: 1,
							left: 1
						}) ? g.target[e[1]] = !0 : isFinite(e[2]) && (g.target[e[1]] = e[2]);
					var a = {},
						h;
					for (h in j)(e = b.getAttribute(h)) && (a[j[h]] = e);
					if (h = b.data("cke-saved-name") || a.advName) a.advName = h;
					CKEDITOR.tools.isEmpty(a) || (g.advanced = a)
				}
				h = CKEDITOR.plugins.link.getEditorAnchors(c);
				h.length && (g.anchors = h);
				return g
			},
			getLinkAttributes: function(c, b) {
				var a = c.config.emailProtection ||
					"",
					f = {};
				switch (b.type) {
					case "url":
						var a = b.url && void 0 != b.url.protocol ? b.url.protocol : "http://",
							e = b.url && CKEDITOR.tools.trim(b.url.url) || "";
						f["data-cke-saved-href"] = 0 === e.indexOf("/") ? e : a + e;
						break;
					case "anchor":
						a = b.anchor && b.anchor.id;
						f["data-cke-saved-href"] = "#" + (b.anchor && b.anchor.name || a || "");
						break;
					case "email":
						var d = b.email,
							e = d.address;
						switch (a) {
							case "":
							case "encode":
								var g = encodeURIComponent(d.subject || ""),
									i = encodeURIComponent(d.body || ""),
									d = [];
								g && d.push("subject=" + g);
								i && d.push("body=" + i);
								d = d.length ?
									"?" + d.join("&") : "";
								"encode" == a ? (a = ["javascript:void(location.href='mailto:'+", n(e)], d && a.push("+'", m(d), "'"), a.push(")")) : a = ["mailto:", e, d];
								break;
							default:
								a = e.split("@", 2), d.name = a[0], d.domain = a[1], a = ["javascript:", o(c, d)]
						}
						f["data-cke-saved-href"] = a.join("")
				}
				if (b.target)
					if ("popup" == b.target.type) {
						for (var a = ["window.open(this.href, '", b.target.name || "", "', '"], h = "resizable status location toolbar menubar fullscreen scrollbars dependent".split(" "), e = h.length, g = function(a) {
							b.target[a] && h.push(a + "=" +
								b.target[a])
						}, d = 0; d < e; d++) h[d] += b.target[h[d]] ? "=yes" : "=no";
						g("width");
						g("left");
						g("height");
						g("top");
						a.push(h.join(","), "'); return false;");
						f["data-cke-pa-onclick"] = a.join("")
					} else "notSet" != b.target.type && b.target.name && (f.target = b.target.name);
				if (b.advanced) {
					for (var k in j)(a = b.advanced[j[k]]) && (f[k] = a);
					f.name && (f["data-cke-saved-name"] = f.name)
				}
				f["data-cke-saved-href"] && (f.href = f["data-cke-saved-href"]);
				k = CKEDITOR.tools.extend({
						target: 1,
						onclick: 1,
						"data-cke-pa-onclick": 1,
						"data-cke-saved-name": 1
					},
					j);
				for (var l in f) delete k[l];
				return {
					set: f,
					removed: CKEDITOR.tools.objectKeys(k)
				}
			}
		};
		CKEDITOR.unlinkCommand = function() {};
		CKEDITOR.unlinkCommand.prototype = {
			exec: function(c) {
				var b = new CKEDITOR.style({
					element: "a",
					type: CKEDITOR.STYLE_INLINE,
					alwaysRemoveElement: 1
				});
				c.removeStyle(b)
			},
			refresh: function(c, b) {
				var a = b.lastElement && b.lastElement.getAscendant("a", !0);
				a && "a" == a.getName() && a.getAttribute("href") && a.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
			},
			contextSensitive: 1,
			startDisabled: 1,
			requiredContent: "a[href]"
		};
		CKEDITOR.removeAnchorCommand = function() {};
		CKEDITOR.removeAnchorCommand.prototype = {
			exec: function(c) {
				var b = c.getSelection(),
					a = b.createBookmarks(),
					f;
				if (b && (f = b.getSelectedElement()) && (!f.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(c, f) : f.is("a"))) f.remove(1);
				else if (f = CKEDITOR.plugins.link.getSelectedLink(c)) f.hasAttribute("href") ? (f.removeAttributes({
					name: 1,
					"data-cke-saved-name": 1
				}), f.removeClass("cke_anchor")) : f.remove(1);
				b.selectBookmarks(a)
			},
			requiredContent: "a[name]"
		};
		CKEDITOR.tools.extend(CKEDITOR.config, {
			linkShowAdvancedTab: !0,
			linkShowTargetTab: !0
		})
	})();
	(function() {
		function E(c, j, e) {
			function b(b) {
				if ((d = a[b ? "getFirst" : "getLast"]()) && (!d.is || !d.isBlockBoundary()) && (m = j.root[b ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(!0))) && (!m.is || !m.isBlockBoundary({
					br: 1
				}))) c.document.createElement("br")[b ? "insertBefore" : "insertAfter"](d)
			}
			for (var k = CKEDITOR.plugins.list.listToArray(j.root, e), g = [], h = 0; h < j.contents.length; h++) {
				var f = j.contents[h];
				if ((f = f.getAscendant("li", !0)) && !f.getCustomData("list_item_processed")) g.push(f), CKEDITOR.dom.element.setMarker(e,
					f, "list_item_processed", !0)
			}
			f = null;
			for (h = 0; h < g.length; h++) f = g[h].getCustomData("listarray_index"), k[f].indent = -1;
			for (h = f + 1; h < k.length; h++)
				if (k[h].indent > k[h - 1].indent + 1) {
					g = k[h - 1].indent + 1 - k[h].indent;
					for (f = k[h].indent; k[h] && k[h].indent >= f;) k[h].indent += g, h++;
					h--
				}
			var a = CKEDITOR.plugins.list.arrayToList(k, e, null, c.config.enterMode, j.root.getAttribute("dir")).listNode,
				d, m;
			b(!0);
			b();
			a.replace(j.root);
			c.fire("contentDomInvalidated")
		}

		function x(c, j) {
			this.name = c;
			this.context = this.type = j;
			this.allowedContent =
				j + " li";
			this.requiredContent = j
		}

		function A(c, j, e, b) {
			for (var k, g; k = c[b ? "getLast" : "getFirst"](F);)(g = k.getDirection(1)) !== j.getDirection(1) && k.setAttribute("dir", g), k.remove(), e ? k[b ? "insertBefore" : "insertAfter"](e) : j.append(k, b)
		}

		function B(c) {
			var j;
			(j = function(e) {
				var b = c[e ? "getPrevious" : "getNext"](q);
				b && (b.type == CKEDITOR.NODE_ELEMENT && b.is(c.getName())) && (A(c, b, null, !e), c.remove(), c = b)
			})();
			j(1)
		}

		function C(c) {
			return c.type == CKEDITOR.NODE_ELEMENT && (c.getName() in CKEDITOR.dtd.$block || c.getName() in CKEDITOR.dtd.$listItem) &&
				CKEDITOR.dtd[c.getName()]["#"]
		}

		function y(c, j, e) {
			c.fire("saveSnapshot");
			e.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
			var b = e.extractContents();
			j.trim(!1, !0);
			var k = j.createBookmark(),
				g = new CKEDITOR.dom.elementPath(j.startContainer),
				h = g.block,
				g = g.lastElement.getAscendant("li", 1) || h,
				f = new CKEDITOR.dom.elementPath(e.startContainer),
				a = f.contains(CKEDITOR.dtd.$listItem),
				f = f.contains(CKEDITOR.dtd.$list);
			h ? (h = h.getBogus()) && h.remove() : f && (h = f.getPrevious(q)) && v(h) && h.remove();
			(h = b.getLast()) && (h.type ==
				CKEDITOR.NODE_ELEMENT && h.is("br")) && h.remove();
			(h = j.startContainer.getChild(j.startOffset)) ? b.insertBefore(h) : j.startContainer.append(b);
			if (a && (b = w(a))) g.contains(a) ? (A(b, a.getParent(), a), b.remove()) : g.append(b);
			for (; e.checkStartOfBlock() && e.checkEndOfBlock();) {
				f = e.startPath();
				b = f.block;
				if (!b) break;
				b.is("li") && (g = b.getParent(), b.equals(g.getLast(q)) && b.equals(g.getFirst(q)) && (b = g));
				e.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
				b.remove()
			}
			e = e.clone();
			b = c.editable();
			e.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
			e = new CKEDITOR.dom.walker(e);
			e.evaluator = function(a) {
				return q(a) && !v(a)
			};
			(e = e.next()) && (e.type == CKEDITOR.NODE_ELEMENT && e.getName() in CKEDITOR.dtd.$list) && B(e);
			j.moveToBookmark(k);
			j.select();
			c.fire("saveSnapshot")
		}

		function w(c) {
			return (c = c.getLast(q)) && c.type == CKEDITOR.NODE_ELEMENT && c.getName() in r ? c : null
		}
		var r = {
				ol: 1,
				ul: 1
			},
			G = CKEDITOR.dom.walker.whitespaces(),
			D = CKEDITOR.dom.walker.bookmark(),
			q = function(c) {
				return !(G(c) || D(c))
			},
			v = CKEDITOR.dom.walker.bogus();
		CKEDITOR.plugins.list = {
			listToArray: function(c,
				j, e, b, k) {
				if (!r[c.getName()]) return [];
				b || (b = 0);
				e || (e = []);
				for (var g = 0, h = c.getChildCount(); g < h; g++) {
					var f = c.getChild(g);
					f.type == CKEDITOR.NODE_ELEMENT && f.getName() in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(f, j, e, b + 1);
					if ("li" == f.$.nodeName.toLowerCase()) {
						var a = {
							parent: c,
							indent: b,
							element: f,
							contents: []
						};
						k ? a.grandparent = k : (a.grandparent = c.getParent(), a.grandparent && "li" == a.grandparent.$.nodeName.toLowerCase() && (a.grandparent = a.grandparent.getParent()));
						j && CKEDITOR.dom.element.setMarker(j, f,
							"listarray_index", e.length);
						e.push(a);
						for (var d = 0, m = f.getChildCount(), i; d < m; d++) i = f.getChild(d), i.type == CKEDITOR.NODE_ELEMENT && r[i.getName()] ? CKEDITOR.plugins.list.listToArray(i, j, e, b + 1, a.grandparent) : a.contents.push(i)
					}
				}
				return e
			},
			arrayToList: function(c, j, e, b, k) {
				e || (e = 0);
				if (!c || c.length < e + 1) return null;
				for (var g, h = c[e].parent.getDocument(), f = new CKEDITOR.dom.documentFragment(h), a = null, d = e, m = Math.max(c[e].indent, 0), i = null, n, l, p = b == CKEDITOR.ENTER_P ? "p" : "div";;) {
					var o = c[d];
					g = o.grandparent;
					n = o.element.getDirection(1);
					if (o.indent == m) {
						if (!a || c[d].parent.getName() != a.getName()) a = c[d].parent.clone(!1, 1), k && a.setAttribute("dir", k), f.append(a);
						i = a.append(o.element.clone(0, 1));
						n != a.getDirection(1) && i.setAttribute("dir", n);
						for (g = 0; g < o.contents.length; g++) i.append(o.contents[g].clone(1, 1));
						d++
					} else if (o.indent == Math.max(m, 0) + 1) o = c[d - 1].element.getDirection(1), d = CKEDITOR.plugins.list.arrayToList(c, null, d, b, o != n ? n : null), !i.getChildCount() && (CKEDITOR.env.needsNbspFiller && !(7 < h.$.documentMode)) && i.append(h.createText(" ")),
						i.append(d.listNode), d = d.nextIndex;
					else if (-1 == o.indent && !e && g) {
						r[g.getName()] ? (i = o.element.clone(!1, !0), n != g.getDirection(1) && i.setAttribute("dir", n)) : i = new CKEDITOR.dom.documentFragment(h);
						var a = g.getDirection(1) != n,
							u = o.element,
							z = u.getAttribute("class"),
							v = u.getAttribute("style"),
							w = i.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (b != CKEDITOR.ENTER_BR || a || v || z),
							s, x = o.contents.length,
							t;
						for (g = 0; g < x; g++)
							if (s = o.contents[g], D(s) && 1 < x) w ? t = s.clone(1, 1) : i.append(s.clone(1, 1));
							else if (s.type == CKEDITOR.NODE_ELEMENT &&
							s.isBlockBoundary()) {
							a && !s.getDirection() && s.setAttribute("dir", n);
							l = s;
							var y = u.getAttribute("style");
							y && l.setAttribute("style", y.replace(/([^;])$/, "$1;") + (l.getAttribute("style") || ""));
							z && s.addClass(z);
							l = null;
							t && (i.append(t), t = null);
							i.append(s.clone(1, 1))
						} else w ? (l || (l = h.createElement(p), i.append(l), a && l.setAttribute("dir", n)), v && l.setAttribute("style", v), z && l.setAttribute("class", z), t && (l.append(t), t = null), l.append(s.clone(1, 1))) : i.append(s.clone(1, 1));
						t && ((l || i).append(t), t = null);
						i.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT &&
							d != c.length - 1 && (CKEDITOR.env.needsBrFiller && (n = i.getLast()) && (n.type == CKEDITOR.NODE_ELEMENT && n.is("br")) && n.remove(), n = i.getLast(q), (!n || !(n.type == CKEDITOR.NODE_ELEMENT && n.is(CKEDITOR.dtd.$block))) && i.append(h.createElement("br")));
						n = i.$.nodeName.toLowerCase();
						("div" == n || "p" == n) && i.appendBogus();
						f.append(i);
						a = null;
						d++
					} else return null;
					l = null;
					if (c.length <= d || Math.max(c[d].indent, 0) < m) break
				}
				if (j)
					for (c = f.getFirst(); c;) {
						if (c.type == CKEDITOR.NODE_ELEMENT && (CKEDITOR.dom.element.clearMarkers(j, c), c.getName() in
							CKEDITOR.dtd.$listItem && (e = c, h = k = b = void 0, b = e.getDirection()))) {
							for (k = e.getParent(); k && !(h = k.getDirection());) k = k.getParent();
							b == h && e.removeAttribute("dir")
						}
						c = c.getNextSourceNode()
					}
				return {
					listNode: f,
					nextIndex: d
				}
			}
		};
		var H = /^h[1-6]$/,
			F = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
		x.prototype = {
			exec: function(c) {
				this.refresh(c, c.elementPath());
				var j = c.config,
					e = c.getSelection(),
					b = e && e.getRanges();
				if (this.state == CKEDITOR.TRISTATE_OFF) {
					var k = c.editable();
					if (k.getFirst(q)) {
						var g = 1 == b.length && b[0];
						(j =
							g && g.getEnclosedNode()) && (j.is && this.type == j.getName()) && this.setState(CKEDITOR.TRISTATE_ON)
					} else j.enterMode == CKEDITOR.ENTER_BR ? k.appendBogus() : b[0].fixBlock(1, j.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), e.selectRanges(b)
				}
				for (var j = e.createBookmarks(!0), k = [], h = {}, b = b.createIterator(), f = 0;
					(g = b.getNextRange()) && ++f;) {
					var a = g.getBoundaryNodes(),
						d = a.startNode,
						m = a.endNode;
					d.type == CKEDITOR.NODE_ELEMENT && "td" == d.getName() && g.setStartAt(a.startNode, CKEDITOR.POSITION_AFTER_START);
					m.type == CKEDITOR.NODE_ELEMENT &&
						"td" == m.getName() && g.setEndAt(a.endNode, CKEDITOR.POSITION_BEFORE_END);
					g = g.createIterator();
					for (g.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; a = g.getNextParagraph();)
						if (!a.getCustomData("list_block")) {
							CKEDITOR.dom.element.setMarker(h, a, "list_block", 1);
							for (var i = c.elementPath(a), d = i.elements, m = 0, i = i.blockLimit, n, l = d.length - 1; 0 <= l && (n = d[l]); l--)
								if (r[n.getName()] && i.contains(n)) {
									i.removeCustomData("list_group_object_" + f);
									(d = n.getCustomData("list_group_object")) ? d.contents.push(a) : (d = {
											root: n,
											contents: [a]
										},
										k.push(d), CKEDITOR.dom.element.setMarker(h, n, "list_group_object", d));
									m = 1;
									break
								}
							m || (m = i, m.getCustomData("list_group_object_" + f) ? m.getCustomData("list_group_object_" + f).contents.push(a) : (d = {
								root: m,
								contents: [a]
							}, CKEDITOR.dom.element.setMarker(h, m, "list_group_object_" + f, d), k.push(d)))
						}
				}
				for (n = []; 0 < k.length;)
					if (d = k.shift(), this.state == CKEDITOR.TRISTATE_OFF)
						if (r[d.root.getName()]) {
							b = c;
							f = d;
							d = h;
							g = n;
							m = CKEDITOR.plugins.list.listToArray(f.root, d);
							i = [];
							for (a = 0; a < f.contents.length; a++)
								if (l = f.contents[a], (l = l.getAscendant("li", !0)) && !l.getCustomData("list_item_processed")) i.push(l), CKEDITOR.dom.element.setMarker(d, l, "list_item_processed", !0);
							for (var l = f.root.getDocument(), p = void 0, o = void 0, a = 0; a < i.length; a++) {
								var u = i[a].getCustomData("listarray_index"),
									p = m[u].parent;
								p.is(this.type) || (o = l.createElement(this.type), p.copyAttributes(o, {
									start: 1,
									type: 1
								}), o.removeStyle("list-style-type"), m[u].parent = o)
							}
							d = CKEDITOR.plugins.list.arrayToList(m, d, null, b.config.enterMode);
							m = void 0;
							i = d.listNode.getChildCount();
							for (a = 0; a < i && (m = d.listNode.getChild(a)); a++) m.getName() ==
								this.type && g.push(m);
							d.listNode.replace(f.root);
							b.fire("contentDomInvalidated")
						} else {
							m = c;
							a = d;
							g = n;
							i = a.contents;
							b = a.root.getDocument();
							f = [];
							1 == i.length && i[0].equals(a.root) && (d = b.createElement("div"), i[0].moveChildren && i[0].moveChildren(d), i[0].append(d), i[0] = d);
							a = a.contents[0].getParent();
							for (l = 0; l < i.length; l++) a = a.getCommonAncestor(i[l].getParent());
							p = m.config.useComputedState;
							m = d = void 0;
							p = void 0 === p || p;
							for (l = 0; l < i.length; l++)
								for (o = i[l]; u = o.getParent();) {
									if (u.equals(a)) {
										f.push(o);
										!m && o.getDirection() &&
											(m = 1);
										o = o.getDirection(p);
										null !== d && (d = d && d != o ? null : o);
										break
									}
									o = u
								}
							if (!(1 > f.length)) {
								i = f[f.length - 1].getNext();
								l = b.createElement(this.type);
								g.push(l);
								for (p = g = void 0; f.length;) g = f.shift(), p = b.createElement("li"), g.is("pre") || H.test(g.getName()) || "false" == g.getAttribute("contenteditable") ? g.appendTo(p) : (g.copyAttributes(p), d && g.getDirection() && (p.removeStyle("direction"), p.removeAttribute("dir")), g.moveChildren(p), g.remove()), p.appendTo(l);
								d && m && l.setAttribute("dir", d);
								i ? l.insertBefore(i) : l.appendTo(a)
							}
						} else this.state ==
					CKEDITOR.TRISTATE_ON && r[d.root.getName()] && E.call(this, c, d, h);
				for (l = 0; l < n.length; l++) B(n[l]);
				CKEDITOR.dom.element.clearAllMarkers(h);
				e.selectBookmarks(j);
				c.focus()
			},
			refresh: function(c, j) {
				var e = j.contains(r, 1),
					b = j.blockLimit || j.root;
				e && b.contains(e) ? this.setState(e.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
			}
		};
		CKEDITOR.plugins.add("list", {
			requires: "indentlist",
			init: function(c) {
				c.blockless || (c.addCommand("numberedlist", new x("numberedlist", "ol")), c.addCommand("bulletedlist",
					new x("bulletedlist", "ul")), c.ui.addButton && (c.ui.addButton("NumberedList", {
					label: c.lang.list.numberedlist,
					command: "numberedlist",
					directional: !0,
					toolbar: "list,10"
				}), c.ui.addButton("BulletedList", {
					label: c.lang.list.bulletedlist,
					command: "bulletedlist",
					directional: !0,
					toolbar: "list,20"
				})), c.on("key", function(j) {
					var e = j.data.keyCode;
					if (c.mode == "wysiwyg" && e in {
						8: 1,
						46: 1
					}) {
						var b = c.getSelection().getRanges()[0],
							k = b && b.startPath();
						if (b && b.collapsed) {
							var g = e == 8,
								h = c.editable(),
								f = new CKEDITOR.dom.walker(b.clone());
							f.evaluator = function(a) {
								return q(a) && !v(a)
							};
							f.guard = function(a, b) {
								return !(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
							};
							e = b.clone();
							if (g) {
								var a, d;
								if ((a = k.contains(r)) && b.checkBoundaryOfElement(a, CKEDITOR.START) && (a = a.getParent()) && a.is("li") && (a = w(a))) {
									d = a;
									a = a.getPrevious(q);
									e.moveToPosition(a && v(a) ? a : d, CKEDITOR.POSITION_BEFORE_START)
								} else {
									f.range.setStartAt(h, CKEDITOR.POSITION_AFTER_START);
									f.range.setEnd(b.startContainer, b.startOffset);
									if ((a = f.previous()) && a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in
										r || a.is("li"))) {
										if (!a.is("li")) {
											f.range.selectNodeContents(a);
											f.reset();
											f.evaluator = C;
											a = f.previous()
										}
										d = a;
										e.moveToElementEditEnd(d)
									}
								} if (d) {
									y(c, e, b);
									j.cancel()
								} else if ((e = k.contains(r)) && b.checkBoundaryOfElement(e, CKEDITOR.START)) {
									d = e.getFirst(q);
									if (b.checkBoundaryOfElement(d, CKEDITOR.START)) {
										a = e.getPrevious(q);
										if (w(d)) {
											if (a) {
												b.moveToElementEditEnd(a);
												b.select()
											}
										} else c.execCommand("outdent");
										j.cancel()
									}
								}
							} else if (d = k.contains("li")) {
								f.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
								h = (k = d.getLast(q)) &&
									C(k) ? k : d;
								d = 0;
								if ((a = f.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.getName() in r && a.equals(k)) {
									d = 1;
									a = f.next()
								} else b.checkBoundaryOfElement(h, CKEDITOR.END) && (d = 1); if (d && a) {
									b = b.clone();
									b.moveToElementEditStart(a);
									y(c, e, b);
									j.cancel()
								}
							} else {
								f.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
								if ((a = f.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.is(r)) {
									a = a.getFirst(q);
									if (k.block && b.checkStartOfBlock() && b.checkEndOfBlock()) {
										k.block.remove();
										b.moveToElementEditStart(a);
										b.select()
									} else if (w(a)) {
										b.moveToElementEditStart(a);
										b.select()
									} else {
										b = b.clone();
										b.moveToElementEditStart(a);
										y(c, e, b)
									}
									j.cancel()
								}
							}
							setTimeout(function() {
								c.selectionChange(1)
							})
						}
					}
				}))
			}
		})
	})();
	(function() {
		function Q(a, c, d) {
			return m(c) && m(d) && d.equals(c.getNext(function(a) {
				return !(z(a) || A(a) || p(a))
			}))
		}

		function u(a) {
			this.upper = a[0];
			this.lower = a[1];
			this.set.apply(this, a.slice(2))
		}

		function J(a) {
			var c = a.element;
			if (c && m(c) && (c = c.getAscendant(a.triggers, !0)) && a.editable.contains(c)) {
				var d = K(c, !0);
				if ("true" == d.getAttribute("contenteditable")) return c;
				if (d.is(a.triggers)) return d
			}
			return null
		}

		function ga(a, c, d) {
			o(a, c);
			o(a, d);
			a = c.size.bottom;
			d = d.size.top;
			return a && d ? 0 | (a + d) / 2 : a || d
		}

		function r(a, c,
			d) {
			return c = c[d ? "getPrevious" : "getNext"](function(b) {
				return b && b.type == CKEDITOR.NODE_TEXT && !z(b) || m(b) && !p(b) && !v(a, b)
			})
		}

		function K(a, c) {
			if (a.data("cke-editable")) return null;
			for (c || (a = a.getParent()); a && !a.data("cke-editable");) {
				if (a.hasAttribute("contenteditable")) return a;
				a = a.getParent()
			}
			return null
		}

		function ha(a) {
			var c = a.doc,
				d = B('<span contenteditable="false" style="' + L + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>', c),
				b = this.path + "images/" + (n.hidpi ? "hidpi/" : "") + "icon.png";
			q(d, {
				attach: function() {
					this.wrap.getParent() || this.wrap.appendTo(a.editable, !0);
					return this
				},
				lineChildren: [q(B('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', c), {
					base: L + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + b + ") center no-repeat " + a.boxColor + ";cursor:pointer;" + (n.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : "") + (n.hidpi ? "background-size: 9px 10px;" : ""),
					looks: ["top:-8px;" + CKEDITOR.tools.cssVendorPrefix("border-radius",
						"2px", 1), "top:-17px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px 2px 0px 0px", 1), "top:-1px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "0px 0px 2px 2px", 1)]
				}), q(B(R, c), {
					base: S + "left:0px;border-left-color:" + a.boxColor + ";",
					looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]
				}), q(B(R, c), {
					base: S + "right:0px;border-right-color:" + a.boxColor + ";",
					looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]
				})],
				detach: function() {
					this.wrap.getParent() && this.wrap.remove();
					return this
				},
				mouseNear: function() {
					o(a, this);
					var b = a.holdDistance,
						c = this.size;
					return c && a.mouse.y > c.top - b && a.mouse.y < c.bottom + b && a.mouse.x > c.left - b && a.mouse.x < c.right + b ? !0 : !1
				},
				place: function() {
					var b = a.view,
						c = a.editable,
						d = a.trigger,
						h = d.upper,
						g = d.lower,
						j = h || g,
						l = j.getParent(),
						k = {};
					this.trigger = d;
					h && o(a, h, !0);
					g && o(a, g, !0);
					o(a, l, !0);
					a.inInlineMode && C(a, !0);
					l.equals(c) ? (k.left = b.scroll.x, k.right = -b.scroll.x, k.width = "") : (k.left = j.size.left - j.size.margin.left +
						b.scroll.x - (a.inInlineMode ? b.editable.left + b.editable.border.left : 0), k.width = j.size.outerWidth + j.size.margin.left + j.size.margin.right + b.scroll.x, k.right = "");
					h && g ? k.top = h.size.margin.bottom === g.size.margin.top ? 0 | h.size.bottom + h.size.margin.bottom / 2 : h.size.margin.bottom < g.size.margin.top ? h.size.bottom + h.size.margin.bottom : h.size.bottom + h.size.margin.bottom - g.size.margin.top : h ? g || (k.top = h.size.bottom + h.size.margin.bottom) : k.top = g.size.top - g.size.margin.top;
					d.is(x) || k.top > b.scroll.y - 15 && k.top < b.scroll.y +
						5 ? (k.top = a.inInlineMode ? 0 : b.scroll.y, this.look(x)) : d.is(y) || k.top > b.pane.bottom - 5 && k.top < b.pane.bottom + 15 ? (k.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1, this.look(y)) : (a.inInlineMode && (k.top -= b.editable.top + b.editable.border.top), this.look(s));
					a.inInlineMode && (k.top--, k.top += b.editable.scroll.top, k.left += b.editable.scroll.left);
					for (var T in k) k[T] = CKEDITOR.tools.cssLength(k[T]);
					this.setStyles(k)
				},
				look: function(a) {
					if (this.oldLook != a) {
						for (var b =
							this.lineChildren.length, c; b--;)(c = this.lineChildren[b]).setAttribute("style", c.base + c.looks[0 | a / 2]);
						this.oldLook = a
					}
				},
				wrap: new M("span", a.doc)
			});
			for (c = d.lineChildren.length; c--;) d.lineChildren[c].appendTo(d);
			d.look(s);
			d.appendTo(d.wrap);
			d.unselectable();
			d.lineChildren[0].on("mouseup", function(b) {
				d.detach();
				N(a, function(b) {
					var c = a.line.trigger;
					b[c.is(D) ? "insertBefore" : "insertAfter"](c.is(D) ? c.lower : c.upper)
				}, !0);
				a.editor.focus();
				!n.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
				b.data.preventDefault(!0)
			});
			d.on("mousedown", function(a) {
				a.data.preventDefault(!0)
			});
			a.line = d
		}

		function N(a, c, d) {
			var b = new CKEDITOR.dom.range(a.doc),
				e = a.editor,
				f;
			n.ie && a.enterMode == CKEDITOR.ENTER_BR ? f = a.doc.createText(E) : (f = (f = K(a.element, !0)) && f.data("cke-enter-mode") || a.enterMode, f = new M(F[f], a.doc), f.is("br") || a.doc.createText(E).appendTo(f));
			d && e.fire("saveSnapshot");
			c(f);
			b.moveToPosition(f, CKEDITOR.POSITION_AFTER_START);
			e.getSelection().selectRanges([b]);
			a.hotNode = f;
			d && e.fire("saveSnapshot")
		}

		function U(a, c) {
			return {
				canUndo: !0,
				modes: {
					wysiwyg: 1
				},
				exec: function() {
					function d(b) {
						var d = n.ie && 9 > n.version ? " " : E,
							f = a.hotNode && a.hotNode.getText() == d && a.element.equals(a.hotNode) && a.lastCmdDirection === !!c;
						N(a, function(d) {
							f && a.hotNode && a.hotNode.remove();
							d[c ? "insertAfter" : "insertBefore"](b);
							d.setAttributes({
								"data-cke-magicline-hot": 1,
								"data-cke-magicline-dir": !!c
							});
							a.lastCmdDirection = !!c
						});
						!n.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
						a.line.detach()
					}
					return function(b) {
						var b = b.getSelection().getStartElement(),
							e, b =
							b.getAscendant(V, 1);
						if (!W(a, b) && b && !b.equals(a.editable) && !b.contains(a.editable)) {
							if ((e = K(b)) && "false" == e.getAttribute("contenteditable")) b = e;
							a.element = b;
							e = r(a, b, !c);
							var f;
							m(e) && e.is(a.triggers) && e.is(ia) && (!r(a, e, !c) || (f = r(a, e, !c)) && m(f) && f.is(a.triggers)) ? d(e) : (f = J(a, b), m(f) && (r(a, f, !c) ? (b = r(a, f, !c)) && (m(b) && b.is(a.triggers)) && d(f) : d(f)))
						}
					}
				}()
			}
		}

		function v(a, c) {
			if (!c || !(c.type == CKEDITOR.NODE_ELEMENT && c.$)) return !1;
			var d = a.line;
			return d.wrap.equals(c) || d.wrap.contains(c)
		}

		function m(a) {
			return a &&
				a.type == CKEDITOR.NODE_ELEMENT && a.$
		}

		function p(a) {
			if (!m(a)) return !1;
			var c;
			if (!(c = X(a))) m(a) ? (c = {
				left: 1,
				right: 1,
				center: 1
			}, c = !(!c[a.getComputedStyle("float")] && !c[a.getAttribute("align")])) : c = !1;
			return c
		}

		function X(a) {
			return !!{
				absolute: 1,
				fixed: 1
			}[a.getComputedStyle("position")]
		}

		function G(a, c) {
			return m(c) ? c.is(a.triggers) : null
		}

		function W(a, c) {
			if (!c) return !1;
			for (var d = c.getParents(1), b = d.length; b--;)
				for (var e = a.tabuList.length; e--;)
					if (d[b].hasAttribute(a.tabuList[e])) return !0;
			return !1
		}

		function ja(a, c,
			d) {
			c = c[d ? "getLast" : "getFirst"](function(b) {
				return a.isRelevant(b) && !b.is(ka)
			});
			if (!c) return !1;
			o(a, c);
			return d ? c.size.top > a.mouse.y : c.size.bottom < a.mouse.y
		}

		function Y(a) {
			var c = a.editable,
				d = a.mouse,
				b = a.view,
				e = a.triggerOffset;
			C(a);
			var f = d.y > (a.inInlineMode ? b.editable.top + b.editable.height / 2 : Math.min(b.editable.height, b.pane.height) / 2),
				c = c[f ? "getLast" : "getFirst"](function(a) {
					return !(z(a) || A(a))
				});
			if (!c) return null;
			v(a, c) && (c = a.line.wrap[f ? "getPrevious" : "getNext"](function(a) {
				return !(z(a) || A(a))
			}));
			if (!m(c) ||
				p(c) || !G(a, c)) return null;
			o(a, c);
			return !f && 0 <= c.size.top && 0 < d.y && d.y < c.size.top + e ? (a = a.inInlineMode || 0 === b.scroll.y ? x : s, new u([null, c, D, H, a])) : f && c.size.bottom <= b.pane.height && d.y > c.size.bottom - e && d.y < b.pane.height ? (a = a.inInlineMode || c.size.bottom > b.pane.height - e && c.size.bottom < b.pane.height ? y : s, new u([c, null, Z, H, a])) : null
		}

		function $(a) {
			var c = a.mouse,
				d = a.view,
				b = a.triggerOffset,
				e = J(a);
			if (!e) return null;
			o(a, e);
			var b = Math.min(b, 0 | e.size.outerHeight / 2),
				f = [],
				i, h;
			if (c.y > e.size.top - 1 && c.y < e.size.top + b) h = !1;
			else if (c.y > e.size.bottom - b && c.y < e.size.bottom + 1) h = !0;
			else return null; if (p(e) || ja(a, e, h) || e.getParent().is(aa)) return null;
			var g = r(a, e, !h);
			if (g) {
				if (g && g.type == CKEDITOR.NODE_TEXT) return null;
				if (m(g)) {
					if (p(g) || !G(a, g) || g.getParent().is(aa)) return null;
					f = [g, e][h ? "reverse" : "concat"]().concat([O, H])
				}
			} else e.equals(a.editable[h ? "getLast" : "getFirst"](a.isRelevant)) ? (C(a), h && c.y > e.size.bottom - b && c.y < d.pane.height && e.size.bottom > d.pane.height - b && e.size.bottom < d.pane.height ? i = y : 0 < c.y && c.y < e.size.top + b &&
				(i = x)) : i = s, f = [null, e][h ? "reverse" : "concat"]().concat([h ? Z : D, H, i, e.equals(a.editable[h ? "getLast" : "getFirst"](a.isRelevant)) ? h ? y : x : s]);
			return 0 in f ? new u(f) : null
		}

		function P(a, c, d, b) {
			for (var e = function() {
				var b = n.ie ? c.$.currentStyle : a.win.$.getComputedStyle(c.$, "");
				return n.ie ? function(a) {
					return b[CKEDITOR.tools.cssStyleToDomStyle(a)]
				} : function(a) {
					return b.getPropertyValue(a)
				}
			}(), f = c.getDocumentPosition(), i = {}, h = {}, g = {}, j = {}, l = t.length; l--;) i[t[l]] = parseInt(e("border-" + t[l] + "-width"), 10) || 0, g[t[l]] =
				parseInt(e("padding-" + t[l]), 10) || 0, h[t[l]] = parseInt(e("margin-" + t[l]), 10) || 0;
			(!d || b) && I(a, b);
			j.top = f.y - (d ? 0 : a.view.scroll.y);
			j.left = f.x - (d ? 0 : a.view.scroll.x);
			j.outerWidth = c.$.offsetWidth;
			j.outerHeight = c.$.offsetHeight;
			j.height = j.outerHeight - (g.top + g.bottom + i.top + i.bottom);
			j.width = j.outerWidth - (g.left + g.right + i.left + i.right);
			j.bottom = j.top + j.outerHeight;
			j.right = j.left + j.outerWidth;
			a.inInlineMode && (j.scroll = {
				top: c.$.scrollTop,
				left: c.$.scrollLeft
			});
			return q({
					border: i,
					padding: g,
					margin: h,
					ignoreScroll: d
				},
				j, !0)
		}

		function o(a, c, d) {
			if (!m(c)) return c.size = null;
			if (c.size) {
				if (c.size.ignoreScroll == d && c.size.date > new Date - ba) return null
			} else c.size = {};
			return q(c.size, P(a, c, d), {
				date: +new Date
			}, !0)
		}

		function C(a, c) {
			a.view.editable = P(a, a.editable, c, !0)
		}

		function I(a, c) {
			a.view || (a.view = {});
			var d = a.view;
			if (c || !(d && d.date > new Date - ba)) {
				var b = a.win,
					d = b.getScrollPosition(),
					b = b.getViewPaneSize();
				q(a.view, {
					scroll: {
						x: d.x,
						y: d.y,
						width: a.doc.$.documentElement.scrollWidth - b.width,
						height: a.doc.$.documentElement.scrollHeight -
							b.height
					},
					pane: {
						width: b.width,
						height: b.height,
						bottom: b.height + d.y
					},
					date: +new Date
				}, !0)
			}
		}

		function la(a, c, d, b) {
			for (var e = b, f = b, i = 0, h = !1, g = !1, j = a.view.pane.height, l = a.mouse; l.y + i < j && 0 < l.y - i;) {
				h || (h = c(e, b));
				g || (g = c(f, b));
				!h && 0 < l.y - i && (e = d(a, {
					x: l.x,
					y: l.y - i
				}));
				!g && l.y + i < j && (f = d(a, {
					x: l.x,
					y: l.y + i
				}));
				if (h && g) break;
				i += 2
			}
			return new u([e, f, null, null])
		}
		CKEDITOR.plugins.add("magicline", {
			init: function(a) {
				var c = a.config,
					d = c.magicline_triggerOffset || 30,
					b = {
						editor: a,
						enterMode: c.enterMode,
						triggerOffset: d,
						holdDistance: 0 |
							d * (c.magicline_holdDistance || 0.5),
						boxColor: c.magicline_color || "#ff0000",
						rtl: "rtl" == c.contentsLangDirection,
						tabuList: ["data-cke-hidden-sel"].concat(c.magicline_tabuList || []),
						triggers: c.magicline_everywhere ? V : {
							table: 1,
							hr: 1,
							div: 1,
							ul: 1,
							ol: 1,
							dl: 1,
							form: 1,
							blockquote: 1
						}
					},
					e, f, i;
				b.isRelevant = function(a) {
					return m(a) && !v(b, a) && !p(a)
				};
				a.on("contentDom", function() {
					var d = a.editable(),
						g = a.document,
						j = a.window;
					q(b, {
						editable: d,
						inInlineMode: d.isInline(),
						doc: g,
						win: j,
						hotNode: null
					}, !0);
					b.boundary = b.inInlineMode ? b.editable :
						b.doc.getDocumentElement();
					d.is(w.$inline) || (b.inInlineMode && !X(d) && d.setStyles({
						position: "relative",
						top: null,
						left: null
					}), ha.call(this, b), I(b), d.attachListener(a, "beforeUndoImage", function() {
						b.line.detach()
					}), d.attachListener(a, "beforeGetData", function() {
						b.line.wrap.getParent() && (b.line.detach(), a.once("getData", function() {
							b.line.attach()
						}, null, null, 1E3))
					}, null, null, 0), d.attachListener(b.inInlineMode ? g : g.getWindow().getFrame(), "mouseout", function(c) {
						if ("wysiwyg" == a.mode)
							if (b.inInlineMode) {
								var d = c.data.$.clientX,
									c = c.data.$.clientY;
								I(b);
								C(b, !0);
								var e = b.view.editable,
									f = b.view.scroll;
								if (!(d > e.left - f.x && d < e.right - f.x) || !(c > e.top - f.y && c < e.bottom - f.y)) clearTimeout(i), i = null, b.line.detach()
							} else clearTimeout(i), i = null, b.line.detach()
					}), d.attachListener(d, "keyup", function() {
						b.hiddenMode = 0
					}), d.attachListener(d, "keydown", function(c) {
						if ("wysiwyg" == a.mode) switch (c = c.data.getKeystroke(), a.getSelection().getStartElement(), c) {
							case 2228240:
							case 16:
								b.hiddenMode = 1, b.line.detach()
						}
					}), d.attachListener(b.inInlineMode ? d : g, "mousemove",
						function(c) {
							f = !0;
							if (!("wysiwyg" != a.mode || a.readOnly || i)) {
								var d = {
									x: c.data.$.clientX,
									y: c.data.$.clientY
								};
								i = setTimeout(function() {
									b.mouse = d;
									i = b.trigger = null;
									I(b);
									if (f && !b.hiddenMode && a.focusManager.hasFocus && !b.line.mouseNear() && (b.element = ca(b, !0)))(b.trigger = Y(b) || $(b) || da(b)) && !W(b, b.trigger.upper || b.trigger.lower) ? b.line.attach().place() : (b.trigger = null, b.line.detach()), f = !1
								}, 30)
							}
						}), d.attachListener(j, "scroll", function() {
						"wysiwyg" == a.mode && (b.line.detach(), n.webkit && (b.hiddenMode = 1, clearTimeout(e),
							e = setTimeout(function() {
								b.mouseDown || (b.hiddenMode = 0)
							}, 50)))
					}), d.attachListener(ea ? g : j, "mousedown", function() {
						"wysiwyg" == a.mode && (b.line.detach(), b.hiddenMode = 1, b.mouseDown = 1)
					}), d.attachListener(ea ? g : j, "mouseup", function() {
						b.hiddenMode = 0;
						b.mouseDown = 0
					}), a.addCommand("accessPreviousSpace", U(b)), a.addCommand("accessNextSpace", U(b, !0)), a.setKeystroke([
						[c.magicline_keystrokePrevious, "accessPreviousSpace"],
						[c.magicline_keystrokeNext, "accessNextSpace"]
					]), a.on("loadSnapshot", function() {
						var c, d, e, f;
						for (f in {
							p: 1,
							br: 1,
							div: 1
						}) {
							c = a.document.getElementsByTag(f);
							for (e = c.count(); e--;)
								if ((d = c.getItem(e)).data("cke-magicline-hot")) {
									b.hotNode = d;
									b.lastCmdDirection = "true" === d.data("cke-magicline-dir") ? !0 : !1;
									return
								}
						}
					}), this.backdoor = {
						accessFocusSpace: N,
						boxTrigger: u,
						isLine: v,
						getAscendantTrigger: J,
						getNonEmptyNeighbour: r,
						getSize: P,
						that: b,
						triggerEdge: $,
						triggerEditable: Y,
						triggerExpand: da
					})
				}, this)
			}
		});
		var q = CKEDITOR.tools.extend,
			M = CKEDITOR.dom.element,
			B = M.createFromHtml,
			n = CKEDITOR.env,
			ea = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
			w = CKEDITOR.dtd,
			F = {},
			D = 128,
			Z = 64,
			O = 32,
			H = 16,
			fa = 8,
			x = 4,
			y = 2,
			s = 1,
			E = " ",
			aa = w.$listItem,
			ka = w.$tableContent,
			ia = q({}, w.$nonEditable, w.$empty),
			V = w.$block,
			ba = 100,
			L = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
			S = L + "border-color:transparent;display:block;border-style:solid;",
			R = "<span>" + E + "</span>";
		F[CKEDITOR.ENTER_BR] = "br";
		F[CKEDITOR.ENTER_P] = "p";
		F[CKEDITOR.ENTER_DIV] = "div";
		u.prototype = {
			set: function(a, c, d) {
				this.properties = a +
					c + (d || s);
				return this
			},
			is: function(a) {
				return (this.properties & a) == a
			}
		};
		var ca = function() {
				return function(a, c, d) {
					if (!a.mouse) return null;
					var b = a.doc,
						e = a.line.wrap,
						d = d || a.mouse,
						f = new CKEDITOR.dom.element(b.$.elementFromPoint(d.x, d.y));
					c && v(a, f) && (e.hide(), f = new CKEDITOR.dom.element(b.$.elementFromPoint(d.x, d.y)), e.show());
					return !f || !(f.type == CKEDITOR.NODE_ELEMENT && f.$) || n.ie && 9 > n.version && !a.boundary.equals(f) && !a.boundary.contains(f) ? null : f
				}
			}(),
			z = CKEDITOR.dom.walker.whitespaces(),
			A = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
			da = function() {
				function a(a) {
					var b = a.element,
						e, f, i;
					if (!m(b) || b.contains(a.editable) || b.isReadOnly()) return null;
					i = la(a, function(a, b) {
						return !b.equals(a)
					}, function(a, b) {
						return ca(a, !0, b)
					}, b);
					e = i.upper;
					f = i.lower;
					if (Q(a, e, f)) return i.set(O, fa);
					if (e && b.contains(e))
						for (; !e.getParent().equals(b);) e = e.getParent();
					else e = b.getFirst(function(b) {
						return c(a, b)
					}); if (f && b.contains(f))
						for (; !f.getParent().equals(b);) f = f.getParent();
					else f = b.getLast(function(b) {
						return c(a, b)
					}); if (!e || !f) return null;
					o(a, e);
					o(a, f);
					if (!(a.mouse.y >
						e.size.top && a.mouse.y < f.size.bottom)) return null;
					for (var b = Number.MAX_VALUE, h, g, j, l; f && !f.equals(e) && (g = e.getNext(a.isRelevant));) h = Math.abs(ga(a, e, g) - a.mouse.y), h < b && (b = h, j = e, l = g), e = g, o(a, e);
					if (!j || !l || !(a.mouse.y > j.size.top && a.mouse.y < l.size.bottom)) return null;
					i.upper = j;
					i.lower = l;
					return i.set(O, fa)
				}

				function c(a, b) {
					return !(b && b.type == CKEDITOR.NODE_TEXT || A(b) || p(b) || v(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
				}
				return function(c) {
					var b = a(c),
						e;
					if (e = b) {
						e = b.upper;
						var f = b.lower;
						e = !e || !f || p(f) ||
							p(e) || f.equals(e) || e.equals(f) || f.contains(e) || e.contains(f) ? !1 : G(c, e) && G(c, f) && Q(c, e, f) ? !0 : !1
					}
					return e ? b : null
				}
			}(),
			t = ["top", "left", "right", "bottom"]
	})();
	CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 51;
	CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 52;
	(function() {
		function l(a) {
			if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) return [];
			for (var e = [], f = ["style", "className"], b = 0; b < f.length; b++) {
				var d = a.$.elements.namedItem(f[b]);
				d && (d = new CKEDITOR.dom.element(d), e.push([d, d.nextSibling]), d.remove())
			}
			return e
		}

		function o(a, e) {
			if (a && !(a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) && 0 < e.length)
				for (var f = e.length - 1; 0 <= f; f--) {
					var b = e[f][0],
						d = e[f][1];
					d ? b.insertBefore(d) : b.appendTo(a)
				}
		}

		function n(a, e) {
			var f = l(a),
				b = {},
				d = a.$;
			e || (b["class"] = d.className ||
				"", d.className = "");
			b.inline = d.style.cssText || "";
			e || (d.style.cssText = "position: static; overflow: visible");
			o(f);
			return b
		}

		function p(a, e) {
			var f = l(a),
				b = a.$;
			"class" in e && (b.className = e["class"]);
			"inline" in e && (b.style.cssText = e.inline);
			o(f)
		}

		function q(a) {
			if (!a.editable().isInline()) {
				var e = CKEDITOR.instances,
					f;
				for (f in e) {
					var b = e[f];
					"wysiwyg" == b.mode && !b.readOnly && (b = b.document.getBody(), b.setAttribute("contentEditable", !1), b.setAttribute("contentEditable", !0))
				}
				a.editable().hasFocus && (a.toolbox.focus(),
					a.focus())
			}
		}
		CKEDITOR.plugins.add("maximize", {
			init: function(a) {
				function e() {
					var b = d.getViewPaneSize();
					a.resize(b.width, b.height, null, !0)
				}
				if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
					var f = a.lang,
						b = CKEDITOR.document,
						d = b.getWindow(),
						j, k, m, l = CKEDITOR.TRISTATE_OFF;
					a.addCommand("maximize", {
						modes: {
							wysiwyg: !CKEDITOR.env.iOS,
							source: !CKEDITOR.env.iOS
						},
						readOnly: 1,
						editorFocus: !1,
						exec: function() {
							var h = a.container.getChild(1),
								g = a.ui.space("contents");
							if ("wysiwyg" == a.mode) {
								var c = a.getSelection();
								j = c && c.getRanges();
								k = d.getScrollPosition()
							} else {
								var i = a.editable().$;
								j = !CKEDITOR.env.ie && [i.selectionStart, i.selectionEnd];
								k = [i.scrollLeft, i.scrollTop]
							} if (this.state == CKEDITOR.TRISTATE_OFF) {
								d.on("resize", e);
								m = d.getScrollPosition();
								for (c = a.container; c = c.getParent();) c.setCustomData("maximize_saved_styles", n(c)), c.setStyle("z-index", a.config.baseFloatZIndex - 5);
								g.setCustomData("maximize_saved_styles", n(g, !0));
								h.setCustomData("maximize_saved_styles", n(h, !0));
								g = {
									overflow: CKEDITOR.env.webkit ? "" : "hidden",
									width: 0,
									height: 0
								};
								b.getDocumentElement().setStyles(g);
								!CKEDITOR.env.gecko && b.getDocumentElement().setStyle("position", "fixed");
								(!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && b.getBody().setStyles(g);
								CKEDITOR.env.ie ? setTimeout(function() {
									d.$.scrollTo(0, 0)
								}, 0) : d.$.scrollTo(0, 0);
								h.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
								h.$.offsetLeft;
								h.setStyles({
									"z-index": a.config.baseFloatZIndex - 5,
									left: "0px",
									top: "0px"
								});
								h.addClass("cke_maximized");
								e();
								g = h.getDocumentPosition();
								h.setStyles({
									left: -1 *
										g.x + "px",
									top: -1 * g.y + "px"
								});
								CKEDITOR.env.gecko && q(a)
							} else if (this.state == CKEDITOR.TRISTATE_ON) {
								d.removeListener("resize", e);
								g = [g, h];
								for (c = 0; c < g.length; c++) p(g[c], g[c].getCustomData("maximize_saved_styles")), g[c].removeCustomData("maximize_saved_styles");
								for (c = a.container; c = c.getParent();) p(c, c.getCustomData("maximize_saved_styles")), c.removeCustomData("maximize_saved_styles");
								CKEDITOR.env.ie ? setTimeout(function() {
									d.$.scrollTo(m.x, m.y)
								}, 0) : d.$.scrollTo(m.x, m.y);
								h.removeClass("cke_maximized");
								CKEDITOR.env.webkit &&
									(h.setStyle("display", "inline"), setTimeout(function() {
									h.setStyle("display", "block")
								}, 0));
								a.fire("resize")
							}
							this.toggleState();
							if (c = this.uiItems[0]) g = this.state == CKEDITOR.TRISTATE_OFF ? f.maximize.maximize : f.maximize.minimize, c = CKEDITOR.document.getById(c._.id), c.getChild(1).setHtml(g), c.setAttribute("title", g), c.setAttribute("href", 'javascript:void("' + g + '");');
							"wysiwyg" == a.mode ? j ? (CKEDITOR.env.gecko && q(a), a.getSelection().selectRanges(j), (i = a.getSelection().getStartElement()) && i.scrollIntoView(!0)) :
								d.$.scrollTo(k.x, k.y) : (j && (i.selectionStart = j[0], i.selectionEnd = j[1]), i.scrollLeft = k[0], i.scrollTop = k[1]);
							j = k = null;
							l = this.state;
							a.fire("maximize", this.state)
						},
						canUndo: !1
					});
					a.ui.addButton && a.ui.addButton("Maximize", {
						label: f.maximize.maximize,
						command: "maximize",
						toolbar: "tools,10"
					});
					a.on("mode", function() {
						var b = a.getCommand("maximize");
						b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : l)
					}, null, null, 100)
				}
			}
		})
	})();
	(function() {
		var c = {
			canUndo: !1,
			async: !0,
			exec: function(a) {
				a.getClipboardData({
					title: a.lang.pastetext.title
				}, function(b) {
					b && a.fire("paste", {
						type: "text",
						dataValue: b.dataValue
					});
					a.fire("afterCommandExec", {
						name: "pastetext",
						command: c,
						returnValue: !!b
					})
				})
			}
		};
		CKEDITOR.plugins.add("pastetext", {
			requires: "clipboard",
			init: function(a) {
				a.addCommand("pastetext", c);
				a.ui.addButton && a.ui.addButton("PasteText", {
					label: a.lang.pastetext.button,
					command: "pastetext",
					toolbar: "clipboard,40"
				});
				if (a.config.forcePasteAsPlainText) a.on("beforePaste",
					function(a) {
						"html" != a.data.type && (a.data.type = "text")
					});
				a.on("pasteState", function(b) {
					a.getCommand("pastetext").setState(b.data)
				})
			}
		})
	})();
	(function() {
		function h(a, d, f) {
			var b = CKEDITOR.cleanWord;
			b ? f() : (a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || d + "filter/default.js"), CKEDITOR.scriptLoader.load(a, f, null, !0));
			return !b
		}

		function i(a) {
			a.data.type = "html"
		}
		CKEDITOR.plugins.add("pastefromword", {
			requires: "clipboard",
			init: function(a) {
				var d = 0,
					f = this.path;
				a.addCommand("pastefromword", {
					canUndo: !1,
					async: !0,
					exec: function(a) {
						var e = this;
						d = 1;
						a.once("beforePaste", i);
						a.getClipboardData({
							title: a.lang.pastefromword.title
						}, function(c) {
							c && a.fire("paste", {
								type: "html",
								dataValue: c.dataValue
							});
							a.fire("afterCommandExec", {
								name: "pastefromword",
								command: e,
								returnValue: !!c
							})
						})
					}
				});
				a.ui.addButton && a.ui.addButton("PasteFromWord", {
					label: a.lang.pastefromword.toolbar,
					command: "pastefromword",
					toolbar: "clipboard,50"
				});
				a.on("pasteState", function(b) {
					a.getCommand("pastefromword").setState(b.data)
				});
				a.on("paste", function(b) {
					var e = b.data,
						c = e.dataValue;
					if (c && (d || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(c))) {
						var g = h(a, f, function() {
							if (g) a.fire("paste", e);
							else if (!a.config.pasteFromWordPromptCleanup || d || confirm(a.lang.pastefromword.confirmCleanup)) e.dataValue = CKEDITOR.cleanWord(c, a)
						});
						g && b.cancel()
					}
				}, null, null, 3)
			}
		})
	})();
	CKEDITOR.plugins.add("removeformat", {
		init: function(a) {
			a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
			a.ui.addButton && a.ui.addButton("RemoveFormat", {
				label: a.lang.removeformat.toolbar,
				command: "removeFormat",
				toolbar: "cleanup,10"
			})
		}
	});
	CKEDITOR.plugins.removeformat = {
		commands: {
			removeformat: {
				exec: function(a) {
					for (var h = a._.removeFormatRegex || (a._.removeFormatRegex = RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), e = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")), f = CKEDITOR.plugins.removeformat.filter, k = a.getSelection().getRanges(1), l = k.createIterator(), c; c = l.getNextRange();) {
						c.collapsed || c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
						var i = c.createBookmark(),
							b = i.startNode,
							j = i.endNode,
							d = function(b) {
								for (var c = a.elementPath(b), e = c.elements, d = 1, g;
									(g = e[d]) && !g.equals(c.block) && !g.equals(c.blockLimit); d++) h.test(g.getName()) && f(a, g) && b.breakParent(g)
							};
						d(b);
						if (j) {
							d(j);
							for (b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT); b && !b.equals(j);) d = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT), !("img" == b.getName() && b.data("cke-realelement")) && f(a, b) && (h.test(b.getName()) ? b.remove(1) : (b.removeAttributes(e), a.fire("removeFormatCleanup", b))), b = d
						}
						c.moveToBookmark(i)
					}
					a.forceNextSelectionCheck();
					a.getSelection().selectRanges(k)
				}
			}
		},
		filter: function(a, h) {
			for (var e = a._.removeFormatFilters || [], f = 0; f < e.length; f++)
				if (!1 === e[f](h)) return !1;
			return !0
		}
	};
	CKEDITOR.editor.prototype.addRemoveFormatFilter = function(a) {
		this._.removeFormatFilters || (this._.removeFormatFilters = []);
		this._.removeFormatFilters.push(a)
	};
	CKEDITOR.config.removeFormatTags = "b,big,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var";
	CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign";
	(function() {
		var f = {
			preserveState: !0,
			editorFocus: !1,
			readOnly: 1,
			exec: function(a) {
				this.toggleState();
				this.refresh(a)
			},
			refresh: function(a) {
				if (a.document) {
					var b = this.state == CKEDITOR.TRISTATE_ON ? "attachClass" : "removeClass";
					a.editable()[b]("cke_show_borders")
				}
			}
		};
		CKEDITOR.plugins.add("showborders", {
			modes: {
				wysiwyg: 1
			},
			onLoad: function() {
				var a;
				a = (CKEDITOR.env.ie6Compat ? [".%1 table.%2,", ".%1 table.%2 td, .%1 table.%2 th", "{", "border : #d3d3d3 1px dotted", "}"] : ".%1 table.%2,;.%1 table.%2 > tr > td, .%1 table.%2 > tr > th,;.%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,;.%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,;.%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th;{;border : #d3d3d3 1px dotted;}".split(";")).join("").replace(/%2/g,
					"cke_show_border").replace(/%1/g, "cke_show_borders ");
				CKEDITOR.addCss(a)
			},
			init: function(a) {
				var b = a.addCommand("showborders", f);
				b.canUndo = !1;
				!1 !== a.config.startupShowBorders && b.setState(CKEDITOR.TRISTATE_ON);
				a.on("mode", function() {
					b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
				}, null, null, 100);
				a.on("contentDom", function() {
					b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
				});
				a.on("removeFormatCleanup", function(d) {
					d = d.data;
					a.getCommand("showborders").state == CKEDITOR.TRISTATE_ON && (d.is("table") && (!d.hasAttribute("border") ||
						0 >= parseInt(d.getAttribute("border"), 10))) && d.addClass("cke_show_border")
				})
			},
			afterInit: function(a) {
				var b = a.dataProcessor,
					a = b && b.dataFilter,
					b = b && b.htmlFilter;
				a && a.addRules({
					elements: {
						table: function(a) {
							var a = a.attributes,
								b = a["class"],
								c = parseInt(a.border, 10);
							if ((!c || 0 >= c) && (!b || -1 == b.indexOf("cke_show_border"))) a["class"] = (b || "") + " cke_show_border"
						}
					}
				});
				b && b.addRules({
					elements: {
						table: function(a) {
							var a = a.attributes,
								b = a["class"];
							b && (a["class"] = b.replace("cke_show_border", "").replace(/\s{2}/, " ").replace(/^\s+|\s+$/,
								""))
						}
					}
				})
			}
		});
		CKEDITOR.on("dialogDefinition", function(a) {
			var b = a.data.name;
			if ("table" == b || "tableProperties" == b)
				if (a = a.data.definition, b = a.getContents("info").get("txtBorder"), b.commit = CKEDITOR.tools.override(b.commit, function(a) {
					return function(b, c) {
						a.apply(this, arguments);
						var e = parseInt(this.getValue(), 10);
						c[!e || 0 >= e ? "addClass" : "removeClass"]("cke_show_border")
					}
				}), a = (a = a.getContents("advanced")) && a.get("advCSSClasses")) a.setup = CKEDITOR.tools.override(a.setup, function(a) {
					return function() {
						a.apply(this,
							arguments);
						this.setValue(this.getValue().replace(/cke_show_border/, ""))
					}
				}), a.commit = CKEDITOR.tools.override(a.commit, function(a) {
					return function(b, c) {
						a.apply(this, arguments);
						parseInt(c.getAttribute("border"), 10) || c.addClass("cke_show_border")
					}
				})
		})
	})();
	(function() {
		CKEDITOR.plugins.add("sourcearea", {
			init: function(a) {
				function d() {
					this.hide();
					this.setStyle("height", this.getParent().$.clientHeight + "px");
					this.setStyle("width", this.getParent().$.clientWidth + "px");
					this.show()
				}
				if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
					var e = CKEDITOR.plugins.sourcearea;
					a.addMode("source", function(e) {
						var b = a.ui.space("contents").getDocument().createElement("textarea");
						b.setStyles(CKEDITOR.tools.extend({
							width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
							height: "100%",
							resize: "none",
							outline: "none",
							"text-align": "left"
						}, CKEDITOR.tools.cssVendorPrefix("tab-size", a.config.sourceAreaTabSize || 4)));
						b.setAttribute("dir", "ltr");
						b.addClass("cke_source cke_reset cke_enable_context_menu");
						a.ui.space("contents").append(b);
						b = a.editable(new c(a, b));
						b.setData(a.getData(1));
						CKEDITOR.env.ie && (b.attachListener(a, "resize", d, b), b.attachListener(CKEDITOR.document.getWindow(), "resize", d, b), CKEDITOR.tools.setTimeout(d, 0, b));
						a.fire("ariaWidget", this);
						e()
					});
					a.addCommand("source", e.commands.source);
					a.ui.addButton &&
						a.ui.addButton("Source", {
							label: a.lang.sourcearea.toolbar,
							command: "source",
							toolbar: "mode,10"
						});
					a.on("mode", function() {
						a.getCommand("source").setState("source" == a.mode ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
					})
				}
			}
		});
		var c = CKEDITOR.tools.createClass({
			base: CKEDITOR.editable,
			proto: {
				setData: function(a) {
					this.setValue(a);
					this.status = "ready";
					this.editor.fire("dataReady")
				},
				getData: function() {
					return this.getValue()
				},
				insertHtml: function() {},
				insertElement: function() {},
				insertText: function() {},
				setReadOnly: function(a) {
					this[(a ?
						"set" : "remove") + "Attribute"]("readOnly", "readonly")
				},
				detach: function() {
					c.baseProto.detach.call(this);
					this.clearCustomData();
					this.remove()
				}
			}
		})
	})();
	CKEDITOR.plugins.sourcearea = {
		commands: {
			source: {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				editorFocus: !1,
				readOnly: 1,
				exec: function(c) {
					"wysiwyg" == c.mode && c.fire("saveSnapshot");
					c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
					c.setMode("source" == c.mode ? "wysiwyg" : "source")
				},
				canUndo: !1
			}
		}
	};
	CKEDITOR.plugins.add("specialchar", {
		availableLangs: {
			ar: 1,
			bg: 1,
			ca: 1,
			cs: 1,
			cy: 1,
			de: 1,
			el: 1,
			en: 1,
			"en-gb": 1,
			eo: 1,
			es: 1,
			et: 1,
			fa: 1,
			fi: 1,
			fr: 1,
			"fr-ca": 1,
			gl: 1,
			he: 1,
			hr: 1,
			hu: 1,
			id: 1,
			it: 1,
			ja: 1,
			km: 1,
			ku: 1,
			lv: 1,
			nb: 1,
			nl: 1,
			no: 1,
			pl: 1,
			pt: 1,
			"pt-br": 1,
			ru: 1,
			si: 1,
			sk: 1,
			sl: 1,
			sq: 1,
			sv: 1,
			th: 1,
			tr: 1,
			tt: 1,
			ug: 1,
			uk: 1,
			vi: 1,
			zh: 1,
			"zh-cn": 1
		},
		requires: "dialog",
		init: function(a) {
			var c = this;
			CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
			a.addCommand("specialchar", {
				exec: function() {
					var b = a.langCode,
						b = c.availableLangs[b] ?
						b : c.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
					CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + b + ".js"), function() {
						CKEDITOR.tools.extend(a.lang.specialchar, c.langEntries[b]);
						a.openDialog("specialchar")
					})
				},
				modes: {
					wysiwyg: 1
				},
				canUndo: !1
			});
			a.ui.addButton && a.ui.addButton("SpecialChar", {
				label: a.lang.specialchar.toolbar,
				command: "specialchar",
				toolbar: "insert,50"
			})
		}
	});
	CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" ");
	CKEDITOR.plugins.add("menubutton", {
		requires: "button,menu",
		onLoad: function() {
			var d = function(c) {
				var a = this._,
					b = a.menu;
				a.state !== CKEDITOR.TRISTATE_DISABLED && (a.on && b ? b.hide() : (a.previousState = a.state, b || (b = a.menu = new CKEDITOR.menu(c, {
						panel: {
							className: "cke_menu_panel",
							attributes: {
								"aria-label": c.lang.common.options
							}
						}
					}), b.onHide = CKEDITOR.tools.bind(function() {
						var b = this.command ? c.getCommand(this.command).modes : this.modes;
						this.setState(!b || b[c.mode] ? a.previousState : CKEDITOR.TRISTATE_DISABLED);
						a.on = 0
					}, this),
					this.onMenu && b.addListener(this.onMenu)), this.setState(CKEDITOR.TRISTATE_ON), a.on = 1, setTimeout(function() {
					b.show(CKEDITOR.document.getById(a.id), 4)
				}, 0)))
			};
			CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({
				base: CKEDITOR.ui.button,
				$: function(c) {
					delete c.panel;
					this.base(c);
					this.hasArrow = !0;
					this.click = d
				},
				statics: {
					handler: {
						create: function(c) {
							return new CKEDITOR.ui.menuButton(c)
						}
					}
				}
			})
		},
		beforeInit: function(d) {
			d.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler)
		}
	});
	CKEDITOR.UI_MENUBUTTON = "menubutton";
	CKEDITOR.plugins.add("scayt", {
		requires: "menubutton,dialog",
		tabToOpen: null,
		dialogName: "scaytDialog",
		init: function(a) {
			var d = this,
				c = CKEDITOR.plugins.scayt;
			this.bindEvents(a);
			this.parseConfig(a);
			this.addRule(a);
			CKEDITOR.dialog.add(this.dialogName, CKEDITOR.getUrl(this.path + "dialogs/options.js"));
			this.addMenuItems(a);
			var b = a.lang.scayt,
				f = CKEDITOR.env;
			a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {
				label: b.text_title,
				title: b.text_title,
				modes: {
					wysiwyg: !(f.ie && (8 > f.version || f.quirks))
				},
				toolbar: "spellchecker,20",
				refresh: function() {
					var b = a.ui.instances.Scayt.getState();
					a.scayt && (b = c.state[a.name] ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
					a.fire("scaytButtonState", b)
				},
				onRender: function() {
					var c = this;
					a.on("scaytButtonState", function(a) {
						void 0 !== typeof a.data && c.setState(a.data)
					})
				},
				onMenu: function() {
					var b = a.scayt;
					a.getMenuItem("scaytToggle").label = a.lang.scayt[b && c.state[a.name] ? "btn_disable" : "btn_enable"];
					b = {
						scaytToggle: CKEDITOR.TRISTATE_OFF,
						scaytOptions: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						scaytLangs: b ?
							CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						scaytDict: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						scaytAbout: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
						WSC: a.plugins.wsc ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
					};
					a.config.scayt_uiTabs[0] || delete b.scaytOptions;
					a.config.scayt_uiTabs[1] || delete b.scaytLangs;
					a.config.scayt_uiTabs[2] || delete b.scaytDict;
					return b
				}
			});
			a.contextMenu && a.addMenuItems && (a.contextMenu.addListener(function() {
				var c = a.scayt,
					b;
				if (c) {
					var h = c.getSelectionNode();
					if (h = h ? h.getAttribute(c.getNodeAttribute()) : h) b = d.menuGenerator(a, h, d), c.showBanner("." + a.contextMenu._.definition.panel.className.split(" ").join(" ."))
				}
				return b
			}), a.contextMenu._.onHide = CKEDITOR.tools.override(a.contextMenu._.onHide, function(c) {
				return function() {
					var b = a.scayt;
					b && b.hideBanner();
					return c.apply(this)
				}
			}))
		},
		addMenuItems: function(a) {
			var d = this,
				c = CKEDITOR.plugins.scayt;
			a.addMenuGroup("scaytButton");
			var b = a.config.scayt_contextMenuItemsOrder.split("|");
			if (b && b.length)
				for (var f = 0; f < b.length; f++) a.addMenuGroup("scayt_" +
					b[f], f - 10);
			b = {
				scaytToggle: {
					label: a.lang.scayt.btn_enable,
					group: "scaytButton",
					onClick: function() {
						var b = a.scayt;
						c.state[a.name] = !c.state[a.name];
						!0 === c.state[a.name] ? b || c.createScayt(a) : b && c.destroy(a)
					}
				},
				scaytAbout: {
					label: a.lang.scayt.btn_about,
					group: "scaytButton",
					onClick: function() {
						a.scayt.tabToOpen = "about";
						a.lockSelection();
						a.openDialog(d.dialogName)
					}
				},
				scaytOptions: {
					label: a.lang.scayt.btn_options,
					group: "scaytButton",
					onClick: function() {
						a.scayt.tabToOpen = "options";
						a.lockSelection();
						a.openDialog(d.dialogName)
					}
				},
				scaytLangs: {
					label: a.lang.scayt.btn_langs,
					group: "scaytButton",
					onClick: function() {
						a.scayt.tabToOpen = "langs";
						a.lockSelection();
						a.openDialog(d.dialogName)
					}
				},
				scaytDict: {
					label: a.lang.scayt.btn_dictionaries,
					group: "scaytButton",
					onClick: function() {
						a.scayt.tabToOpen = "dictionaries";
						a.lockSelection();
						a.openDialog(d.dialogName)
					}
				}
			};
			a.plugins.wsc && (b.WSC = {
				label: a.lang.wsc.toolbar,
				group: "scaytButton",
				onClick: function() {
					var c = CKEDITOR.plugins.scayt,
						b = a.scayt,
						d = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() :
						a.document.getBody().getText();
					(d = d.replace(/\s/g, "")) ? (b && (c.state[a.name] && b.setMarkupPaused) && b.setMarkupPaused(!0), a.lockSelection(), a.execCommand("checkspell")) : alert("Nothing to check!")
				}
			});
			a.addMenuItems(b)
		},
		bindEvents: function(a) {
			var d = CKEDITOR.plugins.scayt,
				c = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE;
			CKEDITOR.on("dialogDefinition", function(a) {
				if ("scaytDialog" === a.data.name) a.data.definition.dialog.on("cancel", function() {
					return !1
				}, this, null, -1)
			});
			var b = function() {
					a.scayt && d.destroy(a)
				},
				f = function() {
					d.state[a.name] && !a.readOnly && d.createScayt(a)
				},
				g = function() {
					c ? (a.on("blur", b), a.on("focus", f), a.focusManager.hasFocus && f()) : f()
				};
			a.on("contentDom", g);
			a.on("beforeCommandExec", function(c) {
				if (c.data.name in d.options.disablingCommandExec && "wysiwyg" == a.mode) {
					if (c = a.scayt) d.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)
				} else if ("bold" === c.data.name || "italic" === c.data.name || "underline" === c.data.name || "strike" === c.data.name || "subscript" === c.data.name || "superscript" === c.data.name)
					if (c =
						a.scayt) c.removeMarkupInSelectionNode(), c.fire("startSpellCheck")
			});
			a.on("beforeSetMode", function(c) {
				if ("source" == c.data && (c = a.scayt)) d.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)
			});
			a.on("afterCommandExec", function(c) {
				var b;
				if ("wysiwyg" == a.mode && ("undo" == c.data.name || "redo" == c.data.name))(b = a.scayt) && setTimeout(function() {
					b.fire("startSpellCheck")
				}, 250)
			});
			a.on("readOnly", function(c) {
				var b;
				c && (b = a.scayt, !0 === c.editor.readOnly ? b && b.fire("removeMarkupInDocument", {}) : b ? b.fire("startSpellCheck") :
					"wysiwyg" == c.editor.mode && !0 === d.state[c.editor.name] && (d.createScayt(a), c.editor.fire("scaytButtonState", CKEDITOR.TRISTATE_ON)))
			});
			a.on("beforeDestroy", b);
			a.on("setData", function() {
				b();
				a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && g()
			}, this, null, 50);
			a.on("insertElement", function() {
				var c = a.scayt;
				c && (c.removeMarkupInSelectionNode(), c.fire("startSpellCheck"))
			}, this, null, 50);
			a.on("insertHtml", function() {
				var c = a.scayt;
				c && (c.removeMarkupInSelectionNode(), c.fire("startSpellCheck"))
			}, this, null, 50);
			a.on("scaytDialogShown",
				function(c) {
					c.data.selectPage(a.scayt.tabToOpen)
				})
		},
		parseConfig: function(a) {
			var d = CKEDITOR.plugins.scayt;
			d.replaceOldOptionsNames(a.config);
			"boolean" !== typeof a.config.scayt_autoStartup && (a.config.scayt_autoStartup = !1);
			d.state[a.name] = a.config.scayt_autoStartup;
			a.config.scayt_contextCommands || (a.config.scayt_contextCommands = "ignore|ignoreall|add");
			a.config.scayt_contextMenuItemsOrder || (a.config.scayt_contextMenuItemsOrder = "suggest|moresuggest|control");
			a.config.scayt_sLang || (a.config.scayt_sLang =
				"en_US");
			if (void 0 === a.config.scayt_maxSuggestions || "number" != typeof a.config.scayt_maxSuggestions || 0 > a.config.scayt_maxSuggestions) a.config.scayt_maxSuggestions = 5;
			if (void 0 === a.config.scayt_customDictionaryIds || "string" !== typeof a.config.scayt_customDictionaryIds) a.config.scayt_customDictionaryIds = "";
			if (void 0 === a.config.scayt_userDictionaryName || "string" !== typeof a.config.scayt_userDictionaryName) a.config.scayt_userDictionaryName = null;
			if ("string" === typeof a.config.scayt_uiTabs && 3 === a.config.scayt_uiTabs.split(",").length) {
				var c =
					[],
					b = [];
				a.config.scayt_uiTabs = a.config.scayt_uiTabs.split(",");
				CKEDITOR.tools.search(a.config.scayt_uiTabs, function(a) {
					if (Number(a) === 1 || Number(a) === 0) {
						b.push(true);
						c.push(Number(a))
					} else b.push(false)
				});
				a.config.scayt_uiTabs = null === CKEDITOR.tools.search(b, !1) ? c : [1, 1, 1]
			} else a.config.scayt_uiTabs = [1, 1, 1];
			"string" != typeof a.config.scayt_serviceProtocol && (a.config.scayt_serviceProtocol = null);
			"string" != typeof a.config.scayt_serviceHost && (a.config.scayt_serviceHost = null);
			"string" != typeof a.config.scayt_servicePort &&
				(a.config.scayt_servicePort = null);
			"string" != typeof a.config.scayt_servicePath && (a.config.scayt_servicePath = null);
			a.config.scayt_moreSuggestions || (a.config.scayt_moreSuggestions = "on");
			"string" !== typeof a.config.scayt_customerId && (a.config.scayt_customerId = "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2");
			"string" !== typeof a.config.scayt_srcUrl && (d = document.location.protocol, d = -1 != d.search(/https?:/) ? d : "http:", a.config.scayt_srcUrl = d + "//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js");
			"boolean" !== typeof CKEDITOR.config.scayt_handleCheckDirty && (CKEDITOR.config.scayt_handleCheckDirty = !0);
			"boolean" !== typeof CKEDITOR.config.scayt_handleUndoRedo && (CKEDITOR.config.scayt_handleUndoRedo = !0)
		},
		addRule: function(a) {
			var d = a.dataProcessor,
				c = d && d.htmlFilter,
				b = a._.elementsPath && a._.elementsPath.filters,
				d = d && d.dataFilter,
				f = a.addRemoveFormatFilter,
				g = function(c) {
					var b = CKEDITOR.plugins.scayt;
					if (a.scayt && c.hasAttribute(b.options.data_attribute_name)) return !1
				},
				e = function(c) {
					var b = CKEDITOR.plugins.scayt,
						d = !0;
					a.scayt && c.hasAttribute(b.options.data_attribute_name) && (d = !1);
					return d
				};
			b && b.push(g);
			d && d.addRules({
				elements: {
					span: function(c) {
						var b = CKEDITOR.plugins.scayt;
						b && (b.state[a.name] && c.classes && CKEDITOR.tools.search(c.classes, b.options.misspelled_word_class)) && (c.classes && c.parent.type === CKEDITOR.NODE_DOCUMENT_FRAGMENT ? (delete c.attributes.style, delete c.name) : delete c.classes[CKEDITOR.tools.indexOf(c.classes, b.options.misspelled_word_class)]);
						return c
					}
				}
			});
			c && c.addRules({
				elements: {
					span: function(c) {
						var b =
							CKEDITOR.plugins.scayt;
						b && (b.state[a.name] && c.hasClass(b.options.misspelled_word_class) && c.attributes[b.options.data_attribute_name]) && (c.removeClass(b.options.misspelled_word_class), delete c.attributes[b.options.data_attribute_name], delete c.name);
						return c
					}
				}
			});
			f && f.call(a, e)
		},
		scaytMenuDefinition: function(a) {
			var d = this,
				a = a.scayt;
			return {
				scayt_ignore: {
					label: a.getLocal("btn_ignore"),
					group: "scayt_control",
					order: 1,
					exec: function(a) {
						a.scayt.ignoreWord()
					}
				},
				scayt_ignoreall: {
					label: a.getLocal("btn_ignoreAll"),
					group: "scayt_control",
					order: 2,
					exec: function(a) {
						a.scayt.ignoreAllWords()
					}
				},
				scayt_add: {
					label: a.getLocal("btn_addWord"),
					group: "scayt_control",
					order: 3,
					exec: function(a) {
						var b = a.scayt;
						setTimeout(function() {
							b.addWordToUserDictionary()
						}, 10)
					}
				},
				option: {
					label: a.getLocal("btn_options"),
					group: "scayt_control",
					order: 4,
					exec: function(a) {
						a.scayt.tabToOpen = "options";
						a.lockSelection();
						a.openDialog(d.dialogName)
					},
					verification: function(a) {
						return 1 == a.config.scayt_uiTabs[0] ? !0 : !1
					}
				},
				language: {
					label: a.getLocal("btn_langs"),
					group: "scayt_control",
					order: 5,
					exec: function(a) {
						a.scayt.tabToOpen = "langs";
						a.lockSelection();
						a.openDialog(d.dialogName)
					},
					verification: function(a) {
						return 1 == a.config.scayt_uiTabs[1] ? !0 : !1
					}
				},
				dictionary: {
					label: a.getLocal("btn_dictionaries"),
					group: "scayt_control",
					order: 6,
					exec: function(a) {
						a.scayt.tabToOpen = "dictionaries";
						a.lockSelection();
						a.openDialog(d.dialogName)
					},
					verification: function(a) {
						return 1 == a.config.scayt_uiTabs[2] ? !0 : !1
					}
				},
				about: {
					label: a.getLocal("btn_about"),
					group: "scayt_control",
					order: 7,
					exec: function(a) {
						a.scayt.tabToOpen =
							"about";
						a.lockSelection();
						a.openDialog(d.dialogName)
					}
				}
			}
		},
		buildSuggestionMenuItems: function(a, d) {
			var c = {},
				b = {},
				f = a.scayt;
			if (0 < d.length && "no_any_suggestions" !== d[0])
				for (var g = 0; g < d.length; g++) {
					var e = "scayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[g].replace(" ", "_");
					a.addCommand(e, this.createCommand(CKEDITOR.plugins.scayt.suggestions[g]));
					g < a.config.scayt_maxSuggestions ? (a.addMenuItem(e, {
						label: d[g],
						command: e,
						group: "scayt_suggest",
						order: g + 1
					}), c[e] = CKEDITOR.TRISTATE_OFF) : (a.addMenuItem(e, {
						label: d[g],
						command: e,
						group: "scayt_moresuggest",
						order: g + 1
					}), b[e] = CKEDITOR.TRISTATE_OFF, "on" === a.config.scayt_moreSuggestions && (a.addMenuItem("scayt_moresuggest", {
						label: f.getLocal("btn_moreSuggestions"),
						group: "scayt_moresuggest",
						order: 10,
						getItems: function() {
							return b
						}
					}), c.scayt_moresuggest = CKEDITOR.TRISTATE_OFF))
				} else c.no_scayt_suggest = CKEDITOR.TRISTATE_DISABLED, a.addCommand("no_scayt_suggest", {
					exec: function() {}
				}), a.addMenuItem("no_scayt_suggest", {
					label: f.getLocal("btn_noSuggestions") || "no_scayt_suggest",
					command: "no_scayt_suggest",
					group: "scayt_suggest",
					order: 0
				});
			return c
		},
		menuGenerator: function(a, d) {
			var c = a.scayt,
				b = this.scaytMenuDefinition(a),
				f = {},
				g = a.config.scayt_contextCommands.split("|");
			c.fire("getSuggestionsList", {
				lang: c.getLang(),
				word: d
			});
			f = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions);
			if ("off" == a.config.scayt_contextCommands) return f;
			for (var e in b) - 1 == CKEDITOR.tools.indexOf(g, e.replace("scayt_", "")) && "all" != a.config.scayt_contextCommands || (f[e] = CKEDITOR.TRISTATE_OFF, "function" === typeof b[e].verification &&
				!b[e].verification(a) && delete f[e], a.addCommand(e, {
					exec: b[e].exec
				}), a.addMenuItem(e, {
					label: a.lang.scayt[b[e].label] || b[e].label,
					command: e,
					group: b[e].group,
					order: b[e].order
				}));
			return f
		},
		createCommand: function(a) {
			return {
				exec: function(d) {
					d.scayt.replaceSelectionNode({
						word: a
					})
				}
			}
		}
	});
	CKEDITOR.plugins.scayt = {
		state: {},
		suggestions: [],
		loadingHelper: {
			loadOrder: []
		},
		isLoading: !1,
		options: {
			disablingCommandExec: {
				source: !0,
				newpage: !0,
				templates: !0
			},
			data_attribute_name: "data-scayt-word",
			misspelled_word_class: "scayt-misspell-word"
		},
		backCompatibilityMap: {
			scayt_service_protocol: "scayt_serviceProtocol",
			scayt_service_host: "scayt_serviceHost",
			scayt_service_port: "scayt_servicePort",
			scayt_service_path: "scayt_servicePath",
			scayt_customerid: "scayt_customerId"
		},
		replaceOldOptionsNames: function(a) {
			for (var d in a) d in
				this.backCompatibilityMap && (a[this.backCompatibilityMap[d]] = a[d], delete a[d])
		},
		createScayt: function(a) {
			var d = this;
			this.loadScaytLibrary(a, function(a) {
				var b = {
					lang: a.config.scayt_sLang,
					container: "BODY" == a.editable().$.nodeName ? a.document.getWindow().$.frameElement : a.editable().$,
					customDictionary: a.config.scayt_customDictionaryIds,
					userDictionaryName: a.config.scayt_userDictionaryName,
					localization: a.langCode,
					customer_id: a.config.scayt_customerId,
					data_attribute_name: d.options.data_attribute_name,
					misspelled_word_class: d.options.misspelled_word_class
				};
				a.config.scayt_serviceProtocol && (b.service_protocol = a.config.scayt_serviceProtocol);
				a.config.scayt_serviceHost && (b.service_host = a.config.scayt_serviceHost);
				a.config.scayt_servicePort && (b.service_port = a.config.scayt_servicePort);
				a.config.scayt_servicePath && (b.service_path = a.config.scayt_servicePath);
				b = new SCAYT.CKSCAYT(b, function() {}, function() {});
				b.subscribe("suggestionListSend", function(a) {
					for (var b = {}, c = [], d = 0; d < a.suggestionList.length; d++)
						if (!b[a.suggestionList[d]]) {
							b[a.suggestionList[d]] = a.suggestionList[d];
							c.push(a.suggestionList[d])
						}
					CKEDITOR.plugins.scayt.suggestions = c
				});
				a.scayt = b;
				a.fire("scaytButtonState", a.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON)
			})
		},
		destroy: function(a) {
			a.scayt && a.scayt.destroy();
			delete a.scayt;
			a.fire("scaytButtonState", CKEDITOR.TRISTATE_OFF)
		},
		loadScaytLibrary: function(a, d) {
			var c = this;
			"undefined" === typeof window.SCAYT || "function" !== typeof window.SCAYT.CKSCAYT ? (this.loadingHelper[a.name] = d, this.loadingHelper.loadOrder.push(a.name), CKEDITOR.scriptLoader.load(a.config.scayt_srcUrl,
				function() {
					var a;
					CKEDITOR.fireOnce("scaytReady");
					for (var d = 0; d < c.loadingHelper.loadOrder.length; d++) {
						a = c.loadingHelper.loadOrder[d];
						if ("function" === typeof c.loadingHelper[a]) c.loadingHelper[a](CKEDITOR.instances[a]);
						delete c.loadingHelper[a]
					}
					c.loadingHelper.loadOrder = []
				})) : window.SCAYT && "function" === typeof window.SCAYT.CKSCAYT && (CKEDITOR.fireOnce("scaytReady"), a.scayt || "function" === typeof d && d(a))
		}
	};
	CKEDITOR.on("scaytReady", function() {
		if (!0 === CKEDITOR.config.scayt_handleCheckDirty) {
			var a = CKEDITOR.editor.prototype;
			a.checkDirty = CKEDITOR.tools.override(a.checkDirty, function(a) {
				return function() {
					var b = null,
						d = this.scayt;
					if (!CKEDITOR.plugins.scayt || !CKEDITOR.plugins.scayt.state[this.name] || !this.scayt) b = a.call(this);
					else if (b = "ready" == this.status) var g = d.removeMarkupFromString(this.getSnapshot()),
						d = d.removeMarkupFromString(this._.previousValue),
						b = b && d !== g;
					return b
				}
			});
			a.resetDirty = CKEDITOR.tools.override(a.resetDirty,
				function(a) {
					return function() {
						var b = this.scayt;
						!CKEDITOR.plugins.scayt || !CKEDITOR.plugins.scayt.state[this.name] || !this.scayt ? a.call(this) : this._.previousValue = b.removeMarkupFromString(this.getSnapshot())
					}
				})
		}
		if (!0 === CKEDITOR.config.scayt_handleUndoRedo) {
			var a = CKEDITOR.plugins.undo.Image.prototype,
				d = "function" == typeof a.equalsContent ? "equalsContent" : "equals";
			a[d] = CKEDITOR.tools.override(a[d], function(a) {
				return function(b) {
					var d = b.editor.scayt,
						g = this.contents,
						e = b.contents,
						h = null;
					CKEDITOR.plugins.scayt &&
						(CKEDITOR.plugins.scayt.state[b.editor.name] && b.editor.scayt) && (this.contents = d.removeMarkupFromString(g) || "", b.contents = d.removeMarkupFromString(e) || "");
					h = a.apply(this, arguments);
					this.contents = g;
					b.contents = e;
					return h
				}
			})
		}
	});
	(function() {
		CKEDITOR.plugins.add("stylescombo", {
			requires: "richcombo",
			init: function(c) {
				var j = c.config,
					g = c.lang.stylescombo,
					f = {},
					i = [],
					k = [];
				c.on("stylesSet", function(b) {
					if (b = b.data.styles) {
						for (var a, h, d, e = 0, l = b.length; e < l; e++)
							if (a = b[e], !(c.blockless && a.element in CKEDITOR.dtd.$block) && (h = a.name, a = new CKEDITOR.style(a), !c.filter.customConfig || c.filter.check(a))) a._name = h, a._.enterMode = j.enterMode, a._.type = d = a.assignedTo || a.type, a._.weight = e + 1E3 * (d == CKEDITOR.STYLE_OBJECT ? 1 : d == CKEDITOR.STYLE_BLOCK ? 2 : 3),
								f[h] = a, i.push(a), k.push(a);
						i.sort(function(a, b) {
							return a._.weight - b._.weight
						})
					}
				});
				c.ui.addRichCombo("Styles", {
					label: g.label,
					title: g.panelTitle,
					toolbar: "styles,10",
					allowedContent: k,
					panel: {
						css: [CKEDITOR.skin.getPath("editor")].concat(j.contentsCss),
						multiSelect: !0,
						attributes: {
							"aria-label": g.panelTitle
						}
					},
					init: function() {
						var b, a, c, d, e, f;
						e = 0;
						for (f = i.length; e < f; e++) b = i[e], a = b._name, d = b._.type, d != c && (this.startGroup(g["panelTitle" + d]), c = d), this.add(a, b.type == CKEDITOR.STYLE_OBJECT ? a : b.buildPreview(), a);
						this.commit()
					},
					onClick: function(b) {
						c.focus();
						c.fire("saveSnapshot");
						var b = f[b],
							a = c.elementPath();
						c[b.checkActive(a, c) ? "removeStyle" : "applyStyle"](b);
						c.fire("saveSnapshot")
					},
					onRender: function() {
						c.on("selectionChange", function(b) {
							for (var a = this.getValue(), b = b.data.path.elements, h = 0, d = b.length, e; h < d; h++) {
								e = b[h];
								for (var g in f)
									if (f[g].checkElementRemovable(e, !0, c)) {
										g != a && this.setValue(g);
										return
									}
							}
							this.setValue("")
						}, this)
					},
					onOpen: function() {
						var b = c.getSelection().getSelectedElement(),
							b = c.elementPath(b),
							a = [0, 0, 0, 0];
						this.showAll();
						this.unmarkAll();
						for (var h in f) {
							var d = f[h],
								e = d._.type;
							d.checkApplicable(b, c, c.activeFilter) ? a[e]++ : this.hideItem(h);
							d.checkActive(b, c) && this.mark(h)
						}
						a[CKEDITOR.STYLE_BLOCK] || this.hideGroup(g["panelTitle" + CKEDITOR.STYLE_BLOCK]);
						a[CKEDITOR.STYLE_INLINE] || this.hideGroup(g["panelTitle" + CKEDITOR.STYLE_INLINE]);
						a[CKEDITOR.STYLE_OBJECT] || this.hideGroup(g["panelTitle" + CKEDITOR.STYLE_OBJECT])
					},
					refresh: function() {
						var b = c.elementPath();
						if (b) {
							for (var a in f)
								if (f[a].checkApplicable(b, c, c.activeFilter)) return;
							this.setState(CKEDITOR.TRISTATE_DISABLED)
						}
					},
					reset: function() {
						f = {};
						i = []
					}
				})
			}
		})
	})();
	(function() {
		function i(c) {
			return {
				editorFocus: !1,
				canUndo: !1,
				modes: {
					wysiwyg: 1
				},
				exec: function(d) {
					if (d.editable().hasFocus) {
						var e = d.getSelection(),
							b;
						if (b = (new CKEDITOR.dom.elementPath(e.getCommonAncestor(), e.root)).contains({
							td: 1,
							th: 1
						}, 1)) {
							var e = d.createRange(),
								a = CKEDITOR.tools.tryThese(function() {
									var a = b.getParent().$.cells[b.$.cellIndex + (c ? -1 : 1)];
									a.parentNode.parentNode;
									return a
								}, function() {
									var a = b.getParent(),
										a = a.getAscendant("table").$.rows[a.$.rowIndex + (c ? -1 : 1)];
									return a.cells[c ? a.cells.length - 1 :
										0]
								});
							if (!a && !c) {
								for (var f = b.getAscendant("table").$, a = b.getParent().$.cells, f = new CKEDITOR.dom.element(f.insertRow(-1), d.document), g = 0, h = a.length; g < h; g++) f.append((new CKEDITOR.dom.element(a[g], d.document)).clone(!1, !1)).appendBogus();
								e.moveToElementEditStart(f)
							} else if (a) a = new CKEDITOR.dom.element(a), e.moveToElementEditStart(a), (!e.checkStartOfBlock() || !e.checkEndOfBlock()) && e.selectNodeContents(a);
							else return !0;
							e.select(!0);
							return !0
						}
					}
					return !1
				}
			}
		}
		var h = {
				editorFocus: !1,
				modes: {
					wysiwyg: 1,
					source: 1
				}
			},
			g = {
				exec: function(c) {
					c.container.focusNext(!0, c.tabIndex)
				}
			},
			f = {
				exec: function(c) {
					c.container.focusPrevious(!0, c.tabIndex)
				}
			};
		CKEDITOR.plugins.add("tab", {
			init: function(c) {
				for (var d = !1 !== c.config.enableTabKeyTools, e = c.config.tabSpaces || 0, b = ""; e--;) b += " ";
				if (b) c.on("key", function(a) {
					9 == a.data.keyCode && (c.insertHtml(b), a.cancel())
				});
				if (d) c.on("key", function(a) {
					(9 == a.data.keyCode && c.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && c.execCommand("selectPreviousCell")) && a.cancel()
				});
				c.addCommand("blur",
					CKEDITOR.tools.extend(g, h));
				c.addCommand("blurBack", CKEDITOR.tools.extend(f, h));
				c.addCommand("selectNextCell", i());
				c.addCommand("selectPreviousCell", i(!0))
			}
		})
	})();
	CKEDITOR.dom.element.prototype.focusNext = function(i, h) {
		var g = void 0 === h ? this.getTabIndex() : h,
			f, c, d, e, b, a;
		if (0 >= g)
			for (b = this.getNextSourceNode(i, CKEDITOR.NODE_ELEMENT); b;) {
				if (b.isVisible() && 0 === b.getTabIndex()) {
					d = b;
					break
				}
				b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT)
			} else
				for (b = this.getDocument().getBody().getFirst(); b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
					if (!f)
						if (!c && b.equals(this)) {
							if (c = !0, i) {
								if (!(b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
								f = 1
							}
						} else c && !this.contains(b) &&
							(f = 1);
					if (b.isVisible() && !(0 > (a = b.getTabIndex()))) {
						if (f && a == g) {
							d = b;
							break
						}
						a > g && (!d || !e || a < e) ? (d = b, e = a) : !d && 0 === a && (d = b, e = a)
					}
				}
		d && d.focus()
	};
	CKEDITOR.dom.element.prototype.focusPrevious = function(i, h) {
		for (var g = void 0 === h ? this.getTabIndex() : h, f, c, d, e = 0, b, a = this.getDocument().getBody().getLast(); a = a.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
			if (!f)
				if (!c && a.equals(this)) {
					if (c = !0, i) {
						if (!(a = a.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
						f = 1
					}
				} else c && !this.contains(a) && (f = 1);
			if (a.isVisible() && !(0 > (b = a.getTabIndex())))
				if (0 >= g) {
					if (f && 0 === b) {
						d = a;
						break
					}
					b > e && (d = a, e = b)
				} else {
					if (f && b == g) {
						d = a;
						break
					}
					if (b < g && (!d || b > e)) d = a, e = b
				}
		}
		d && d.focus()
	};
	CKEDITOR.plugins.add("table", {
		requires: "dialog",
		init: function(a) {
			function d(a) {
				return CKEDITOR.tools.extend(a || {}, {
					contextSensitive: 1,
					refresh: function(a, e) {
						this.setState(e.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
					}
				})
			}
			if (!a.blockless) {
				var b = a.lang.table;
				a.addCommand("table", new CKEDITOR.dialogCommand("table", {
					context: "table",
					allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" + (a.plugins.dialogadvtab ?
						"table" + a.plugins.dialogadvtab.allowedContent() : ""),
					requiredContent: "table",
					contentTransformations: [
						["table{width}: sizeToStyle", "table[width]: sizeToAttribute"]
					]
				}));
				a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", d()));
				a.addCommand("tableDelete", d({
					exec: function(a) {
						var c = a.elementPath().contains("table", 1);
						if (c) {
							var b = c.getParent();
							1 == b.getChildCount() && !b.is("body", "td", "th") && (c = b);
							a = a.createRange();
							a.moveToPosition(c, CKEDITOR.POSITION_BEFORE_START);
							c.remove();
							a.select()
						}
					}
				}));
				a.ui.addButton && a.ui.addButton("Table", {
					label: b.toolbar,
					command: "table",
					toolbar: "insert,30"
				});
				CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
				CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
				a.addMenuItems && a.addMenuItems({
					table: {
						label: b.menu,
						command: "tableProperties",
						group: "table",
						order: 5
					},
					tabledelete: {
						label: b.deleteTable,
						command: "tableDelete",
						group: "table",
						order: 1
					}
				});
				a.on("doubleclick", function(a) {
					a.data.element.is("table") && (a.data.dialog = "tableProperties")
				});
				a.contextMenu &&
					a.contextMenu.addListener(function() {
						return {
							tabledelete: CKEDITOR.TRISTATE_OFF,
							table: CKEDITOR.TRISTATE_OFF
						}
					})
			}
		}
	});
	(function() {
		function p(e) {
			function d(a) {
				!(0 < b.length) && (a.type == CKEDITOR.NODE_ELEMENT && y.test(a.getName()) && !a.getCustomData("selected_cell")) && (CKEDITOR.dom.element.setMarker(c, a, "selected_cell", !0), b.push(a))
			}
			for (var e = e.getRanges(), b = [], c = {}, a = 0; a < e.length; a++) {
				var f = e[a];
				if (f.collapsed) f = f.getCommonAncestor(), (f = f.getAscendant("td", !0) || f.getAscendant("th", !0)) && b.push(f);
				else {
					var f = new CKEDITOR.dom.walker(f),
						g;
					for (f.guard = d; g = f.next();)
						if (g.type != CKEDITOR.NODE_ELEMENT || !g.is(CKEDITOR.dtd.table))
							if ((g =
								g.getAscendant("td", !0) || g.getAscendant("th", !0)) && !g.getCustomData("selected_cell")) CKEDITOR.dom.element.setMarker(c, g, "selected_cell", !0), b.push(g)
				}
			}
			CKEDITOR.dom.element.clearAllMarkers(c);
			return b
		}

		function o(e, d) {
			for (var b = p(e), c = b[0], a = c.getAscendant("table"), c = c.getDocument(), f = b[0].getParent(), g = f.$.rowIndex, b = b[b.length - 1], h = b.getParent().$.rowIndex + b.$.rowSpan - 1, b = new CKEDITOR.dom.element(a.$.rows[h]), g = d ? g : h, f = d ? f : b, b = CKEDITOR.tools.buildTableMap(a), a = b[g], g = d ? b[g - 1] : b[g + 1], b = b[0].length,
				c = c.createElement("tr"), h = 0; a[h] && h < b; h++) {
				var i;
				1 < a[h].rowSpan && g && a[h] == g[h] ? (i = a[h], i.rowSpan += 1) : (i = (new CKEDITOR.dom.element(a[h])).clone(), i.removeAttribute("rowSpan"), i.appendBogus(), c.append(i), i = i.$);
				h += i.colSpan - 1
			}
			d ? c.insertBefore(f) : c.insertAfter(f)
		}

		function q(e) {
			if (e instanceof CKEDITOR.dom.selection) {
				for (var d = p(e), b = d[0].getAscendant("table"), c = CKEDITOR.tools.buildTableMap(b), e = d[0].getParent().$.rowIndex, d = d[d.length - 1], a = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [], f = e; f <= a; f++) {
					for (var g =
						c[f], h = new CKEDITOR.dom.element(b.$.rows[f]), i = 0; i < g.length; i++) {
						var j = new CKEDITOR.dom.element(g[i]),
							l = j.getParent().$.rowIndex;
						1 == j.$.rowSpan ? j.remove() : (j.$.rowSpan -= 1, l == f && (l = c[f + 1], l[i - 1] ? j.insertAfter(new CKEDITOR.dom.element(l[i - 1])) : (new CKEDITOR.dom.element(b.$.rows[f + 1])).append(j, 1)));
						i += j.$.colSpan - 1
					}
					d.push(h)
				}
				c = b.$.rows;
				b = new CKEDITOR.dom.element(c[a + 1] || (0 < e ? c[e - 1] : null) || b.$.parentNode);
				for (f = d.length; 0 <= f; f--) q(d[f]);
				return b
			}
			e instanceof CKEDITOR.dom.element && (b = e.getAscendant("table"),
				1 == b.$.rows.length ? b.remove() : e.remove());
			return null
		}

		function r(e, d) {
			for (var b = d ? Infinity : 0, c = 0; c < e.length; c++) {
				var a;
				a = e[c];
				for (var f = d, g = a.getParent().$.cells, h = 0, i = 0; i < g.length; i++) {
					var j = g[i],
						h = h + (f ? 1 : j.colSpan);
					if (j == a.$) break
				}
				a = h - 1;
				if (d ? a < b : a > b) b = a
			}
			return b
		}

		function k(e, d) {
			for (var b = p(e), c = b[0].getAscendant("table"), a = r(b, 1), b = r(b), a = d ? a : b, f = CKEDITOR.tools.buildTableMap(c), c = [], b = [], g = f.length, h = 0; h < g; h++) c.push(f[h][a]), b.push(d ? f[h][a - 1] : f[h][a + 1]);
			for (h = 0; h < g; h++) c[h] && (1 < c[h].colSpan &&
				b[h] == c[h] ? (a = c[h], a.colSpan += 1) : (a = (new CKEDITOR.dom.element(c[h])).clone(), a.removeAttribute("colSpan"), a.appendBogus(), a[d ? "insertBefore" : "insertAfter"].call(a, new CKEDITOR.dom.element(c[h])), a = a.$), h += a.rowSpan - 1)
		}

		function u(e, d) {
			var b = e.getStartElement();
			if (b = b.getAscendant("td", 1) || b.getAscendant("th", 1)) {
				var c = b.clone();
				c.appendBogus();
				d ? c.insertBefore(b) : c.insertAfter(b)
			}
		}

		function t(e) {
			if (e instanceof CKEDITOR.dom.selection) {
				var e = p(e),
					d = e[0] && e[0].getAscendant("table"),
					b;
				a: {
					var c = 0;
					b = e.length -
						1;
					for (var a = {}, f, g; f = e[c++];) CKEDITOR.dom.element.setMarker(a, f, "delete_cell", !0);
					for (c = 0; f = e[c++];)
						if ((g = f.getPrevious()) && !g.getCustomData("delete_cell") || (g = f.getNext()) && !g.getCustomData("delete_cell")) {
							CKEDITOR.dom.element.clearAllMarkers(a);
							b = g;
							break a
						}
					CKEDITOR.dom.element.clearAllMarkers(a);
					g = e[0].getParent();
					(g = g.getPrevious()) ? b = g.getLast() : (g = e[b].getParent(), b = (g = g.getNext()) ? g.getChild(0) : null)
				}
				for (g = e.length - 1; 0 <= g; g--) t(e[g]);
				b ? m(b, !0) : d && d.remove()
			} else e instanceof CKEDITOR.dom.element &&
				(d = e.getParent(), 1 == d.getChildCount() ? d.remove() : e.remove())
		}

		function m(e, d) {
			var b = e.getDocument(),
				c = CKEDITOR.document;
			CKEDITOR.env.ie && 10 == CKEDITOR.env.version && (c.focus(), b.focus());
			b = new CKEDITOR.dom.range(b);
			if (!b["moveToElementEdit" + (d ? "End" : "Start")](e)) b.selectNodeContents(e), b.collapse(d ? !1 : !0);
			b.select(!0)
		}

		function v(e, d, b) {
			e = e[d];
			if ("undefined" == typeof b) return e;
			for (d = 0; e && d < e.length; d++) {
				if (b.is && e[d] == b.$) return d;
				if (d == b) return new CKEDITOR.dom.element(e[d])
			}
			return b.is ? -1 : null
		}

		function s(e,
			d, b) {
			var c = p(e),
				a;
			if ((d ? 1 != c.length : 2 > c.length) || (a = e.getCommonAncestor()) && a.type == CKEDITOR.NODE_ELEMENT && a.is("table")) return !1;
			var f, e = c[0];
			a = e.getAscendant("table");
			var g = CKEDITOR.tools.buildTableMap(a),
				h = g.length,
				i = g[0].length,
				j = e.getParent().$.rowIndex,
				l = v(g, j, e);
			if (d) {
				var n;
				try {
					var m = parseInt(e.getAttribute("rowspan"), 10) || 1;
					f = parseInt(e.getAttribute("colspan"), 10) || 1;
					n = g["up" == d ? j - m : "down" == d ? j + m : j]["left" == d ? l - f : "right" == d ? l + f : l]
				} catch (z) {
					return !1
				}
				if (!n || e.$ == n) return !1;
				c["up" == d || "left" ==
					d ? "unshift" : "push"](new CKEDITOR.dom.element(n))
			}
			for (var d = e.getDocument(), o = j, m = n = 0, q = !b && new CKEDITOR.dom.documentFragment(d), s = 0, d = 0; d < c.length; d++) {
				f = c[d];
				var k = f.getParent(),
					t = f.getFirst(),
					r = f.$.colSpan,
					u = f.$.rowSpan,
					k = k.$.rowIndex,
					w = v(g, k, f),
					s = s + r * u,
					m = Math.max(m, w - l + r);
				n = Math.max(n, k - j + u);
				if (!b) {
					r = f;
					(u = r.getBogus()) && u.remove();
					r.trim();
					if (f.getChildren().count()) {
						if (k != o && t && (!t.isBlockBoundary || !t.isBlockBoundary({
							br: 1
						})))(o = q.getLast(CKEDITOR.dom.walker.whitespaces(!0))) && (!o.is || !o.is("br")) &&
							q.append("br");
						f.moveChildren(q)
					}
					d ? f.remove() : f.setHtml("")
				}
				o = k
			}
			if (b) return n * m == s;
			q.moveChildren(e);
			e.appendBogus();
			m >= i ? e.removeAttribute("rowSpan") : e.$.rowSpan = n;
			n >= h ? e.removeAttribute("colSpan") : e.$.colSpan = m;
			b = new CKEDITOR.dom.nodeList(a.$.rows);
			c = b.count();
			for (d = c - 1; 0 <= d; d--) a = b.getItem(d), a.$.cells.length || (a.remove(), c++);
			return e
		}

		function w(e, d) {
			var b = p(e);
			if (1 < b.length) return !1;
			if (d) return !0;
			var b = b[0],
				c = b.getParent(),
				a = c.getAscendant("table"),
				f = CKEDITOR.tools.buildTableMap(a),
				g = c.$.rowIndex,
				h = v(f, g, b),
				i = b.$.rowSpan,
				j;
			if (1 < i) {
				j = Math.ceil(i / 2);
				for (var i = Math.floor(i / 2), c = g + j, a = new CKEDITOR.dom.element(a.$.rows[c]), f = v(f, c), l, c = b.clone(), g = 0; g < f.length; g++)
					if (l = f[g], l.parentNode == a.$ && g > h) {
						c.insertBefore(new CKEDITOR.dom.element(l));
						break
					} else l = null;
				l || a.append(c)
			} else {
				i = j = 1;
				a = c.clone();
				a.insertAfter(c);
				a.append(c = b.clone());
				l = v(f, g);
				for (h = 0; h < l.length; h++) l[h].rowSpan++
			}
			c.appendBogus();
			b.$.rowSpan = j;
			c.$.rowSpan = i;
			1 == j && b.removeAttribute("rowSpan");
			1 == i && c.removeAttribute("rowSpan");
			return c
		}

		function x(e, d) {
			var b = p(e);
			if (1 < b.length) return !1;
			if (d) return !0;
			var b = b[0],
				c = b.getParent(),
				a = c.getAscendant("table"),
				a = CKEDITOR.tools.buildTableMap(a),
				f = v(a, c.$.rowIndex, b),
				g = b.$.colSpan;
			if (1 < g) c = Math.ceil(g / 2), g = Math.floor(g / 2);
			else {
				for (var g = c = 1, h = [], i = 0; i < a.length; i++) {
					var j = a[i];
					h.push(j[f]);
					1 < j[f].rowSpan && (i += j[f].rowSpan - 1)
				}
				for (a = 0; a < h.length; a++) h[a].colSpan++
			}
			a = b.clone();
			a.insertAfter(b);
			a.appendBogus();
			b.$.colSpan = c;
			a.$.colSpan = g;
			1 == c && b.removeAttribute("colSpan");
			1 == g && a.removeAttribute("colSpan");
			return a
		}
		var y = /^(?:td|th)$/;
		CKEDITOR.plugins.tabletools = {
			requires: "table,dialog,contextmenu",
			init: function(e) {
				function d(a) {
					return CKEDITOR.tools.extend(a || {}, {
						contextSensitive: 1,
						refresh: function(a, b) {
							this.setState(b.contains({
								td: 1,
								th: 1
							}, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
						}
					})
				}

				function b(a, b) {
					var c = e.addCommand(a, b);
					e.addFeature(c)
				}
				var c = e.lang.table;
				b("cellProperties", new CKEDITOR.dialogCommand("cellProperties", d({
					allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
					requiredContent: "table"
				})));
				CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
				b("rowDelete", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						m(q(a))
					}
				}));
				b("rowInsertBefore", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						o(a, !0)
					}
				}));
				b("rowInsertAfter", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						o(a)
					}
				}));
				b("columnDelete", d({
					requiredContent: "table",
					exec: function(a) {
						for (var a = a.getSelection(), a = p(a), b = a[0], c = a[a.length - 1], a = b.getAscendant("table"),
							d = CKEDITOR.tools.buildTableMap(a), e, j, l = [], n = 0, o = d.length; n < o; n++)
							for (var k = 0, q = d[n].length; k < q; k++) d[n][k] == b.$ && (e = k), d[n][k] == c.$ && (j = k);
						for (n = e; n <= j; n++)
							for (k = 0; k < d.length; k++) c = d[k], b = new CKEDITOR.dom.element(a.$.rows[k]), c = new CKEDITOR.dom.element(c[n]), c.$ && (1 == c.$.colSpan ? c.remove() : c.$.colSpan -= 1, k += c.$.rowSpan - 1, b.$.cells.length || l.push(b));
						j = a.$.rows[0] && a.$.rows[0].cells;
						e = new CKEDITOR.dom.element(j[e] || (e ? j[e - 1] : a.$.parentNode));
						l.length == o && a.remove();
						e && m(e, !0)
					}
				}));
				b("columnInsertBefore",
					d({
						requiredContent: "table",
						exec: function(a) {
							a = a.getSelection();
							k(a, !0)
						}
					}));
				b("columnInsertAfter", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						k(a)
					}
				}));
				b("cellDelete", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						t(a)
					}
				}));
				b("cellMerge", d({
					allowedContent: "td[colspan,rowspan]",
					requiredContent: "td[colspan,rowspan]",
					exec: function(a) {
						m(s(a.getSelection()), !0)
					}
				}));
				b("cellMergeRight", d({
					allowedContent: "td[colspan]",
					requiredContent: "td[colspan]",
					exec: function(a) {
						m(s(a.getSelection(),
							"right"), !0)
					}
				}));
				b("cellMergeDown", d({
					allowedContent: "td[rowspan]",
					requiredContent: "td[rowspan]",
					exec: function(a) {
						m(s(a.getSelection(), "down"), !0)
					}
				}));
				b("cellVerticalSplit", d({
					allowedContent: "td[rowspan]",
					requiredContent: "td[rowspan]",
					exec: function(a) {
						m(w(a.getSelection()))
					}
				}));
				b("cellHorizontalSplit", d({
					allowedContent: "td[colspan]",
					requiredContent: "td[colspan]",
					exec: function(a) {
						m(x(a.getSelection()))
					}
				}));
				b("cellInsertBefore", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						u(a, !0)
					}
				}));
				b("cellInsertAfter", d({
					requiredContent: "table",
					exec: function(a) {
						a = a.getSelection();
						u(a)
					}
				}));
				e.addMenuItems && e.addMenuItems({
					tablecell: {
						label: c.cell.menu,
						group: "tablecell",
						order: 1,
						getItems: function() {
							var a = e.getSelection(),
								b = p(a);
							return {
								tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablecell_delete: CKEDITOR.TRISTATE_OFF,
								tablecell_merge: s(a, null, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_merge_right: s(a, "right", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_merge_down: s(a, "down", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_split_vertical: w(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_split_horizontal: x(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_properties: 0 < b.length ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
							}
						}
					},
					tablecell_insertBefore: {
						label: c.cell.insertBefore,
						group: "tablecell",
						command: "cellInsertBefore",
						order: 5
					},
					tablecell_insertAfter: {
						label: c.cell.insertAfter,
						group: "tablecell",
						command: "cellInsertAfter",
						order: 10
					},
					tablecell_delete: {
						label: c.cell.deleteCell,
						group: "tablecell",
						command: "cellDelete",
						order: 15
					},
					tablecell_merge: {
						label: c.cell.merge,
						group: "tablecell",
						command: "cellMerge",
						order: 16
					},
					tablecell_merge_right: {
						label: c.cell.mergeRight,
						group: "tablecell",
						command: "cellMergeRight",
						order: 17
					},
					tablecell_merge_down: {
						label: c.cell.mergeDown,
						group: "tablecell",
						command: "cellMergeDown",
						order: 18
					},
					tablecell_split_horizontal: {
						label: c.cell.splitHorizontal,
						group: "tablecell",
						command: "cellHorizontalSplit",
						order: 19
					},
					tablecell_split_vertical: {
						label: c.cell.splitVertical,
						group: "tablecell",
						command: "cellVerticalSplit",
						order: 20
					},
					tablecell_properties: {
						label: c.cell.title,
						group: "tablecellproperties",
						command: "cellProperties",
						order: 21
					},
					tablerow: {
						label: c.row.menu,
						group: "tablerow",
						order: 1,
						getItems: function() {
							return {
								tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablerow_delete: CKEDITOR.TRISTATE_OFF
							}
						}
					},
					tablerow_insertBefore: {
						label: c.row.insertBefore,
						group: "tablerow",
						command: "rowInsertBefore",
						order: 5
					},
					tablerow_insertAfter: {
						label: c.row.insertAfter,
						group: "tablerow",
						command: "rowInsertAfter",
						order: 10
					},
					tablerow_delete: {
						label: c.row.deleteRow,
						group: "tablerow",
						command: "rowDelete",
						order: 15
					},
					tablecolumn: {
						label: c.column.menu,
						group: "tablecolumn",
						order: 1,
						getItems: function() {
							return {
								tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablecolumn_delete: CKEDITOR.TRISTATE_OFF
							}
						}
					},
					tablecolumn_insertBefore: {
						label: c.column.insertBefore,
						group: "tablecolumn",
						command: "columnInsertBefore",
						order: 5
					},
					tablecolumn_insertAfter: {
						label: c.column.insertAfter,
						group: "tablecolumn",
						command: "columnInsertAfter",
						order: 10
					},
					tablecolumn_delete: {
						label: c.column.deleteColumn,
						group: "tablecolumn",
						command: "columnDelete",
						order: 15
					}
				});
				e.contextMenu && e.contextMenu.addListener(function(a, b, c) {
					return (a = c.contains({
						td: 1,
						th: 1
					}, 1)) && !a.isReadOnly() ? {
						tablecell: CKEDITOR.TRISTATE_OFF,
						tablerow: CKEDITOR.TRISTATE_OFF,
						tablecolumn: CKEDITOR.TRISTATE_OFF
					} : null
				})
			},
			getSelectedCells: p
		};
		CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
	})();
	CKEDITOR.tools.buildTableMap = function(p) {
		for (var p = p.$.rows, o = -1, q = [], r = 0; r < p.length; r++) {
			o++;
			!q[o] && (q[o] = []);
			for (var k = -1, u = 0; u < p[r].cells.length; u++) {
				var t = p[r].cells[u];
				for (k++; q[o][k];) k++;
				for (var m = isNaN(t.colSpan) ? 1 : t.colSpan, t = isNaN(t.rowSpan) ? 1 : t.rowSpan, v = 0; v < t; v++) {
					q[o + v] || (q[o + v] = []);
					for (var s = 0; s < m; s++) q[o + v][k + s] = p[r].cells[u]
				}
				k += m - 1
			}
		}
		return q
	};
	(function() {
		function g(a) {
			this.editor = a;
			this.reset()
		}
		CKEDITOR.plugins.add("undo", {
			init: function(a) {
				function c(a) {
					b.enabled && !1 !== a.data.command.canUndo && b.save()
				}

				function d() {
					b.enabled = a.readOnly ? !1 : "wysiwyg" == a.mode;
					b.onChange()
				}
				var b = a.undoManager = new g(a),
					e = a.addCommand("undo", {
						exec: function() {
							b.undo() && (a.selectionChange(), this.fire("afterUndo"))
						},
						startDisabled: !0,
						canUndo: !1
					}),
					f = a.addCommand("redo", {
						exec: function() {
							b.redo() && (a.selectionChange(), this.fire("afterRedo"))
						},
						startDisabled: !0,
						canUndo: !1
					}),
					h = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90];
				a.setKeystroke([
					[h[0], "undo"],
					[h[1], "redo"],
					[h[2], "redo"]
				]);
				a.on("contentDom", function() {
					var b = a.editable();
					b.attachListener(b, "keydown", function(a) {
						-1 < CKEDITOR.tools.indexOf(h, a.data.getKeystroke()) && a.data.preventDefault()
					})
				});
				b.onChange = function() {
					e.setState(b.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
					f.setState(b.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
				};
				a.on("beforeCommandExec", c);
				a.on("afterCommandExec",
					c);
				a.on("saveSnapshot", function(a) {
					b.save(a.data && a.data.contentOnly)
				});
				a.on("contentDom", function() {
					a.editable().on("keydown", function(a) {
						a = a.data.getKey();
						(8 == a || 46 == a) && b.type(a, 0)
					});
					a.editable().on("keypress", function(a) {
						b.type(a.data.getKey(), 1)
					})
				});
				a.on("beforeModeUnload", function() {
					"wysiwyg" == a.mode && b.save(!0)
				});
				a.on("mode", d);
				a.on("readOnly", d);
				a.ui.addButton && (a.ui.addButton("Undo", {
					label: a.lang.undo.undo,
					command: "undo",
					toolbar: "undo,10"
				}), a.ui.addButton("Redo", {
					label: a.lang.undo.redo,
					command: "redo",
					toolbar: "undo,20"
				}));
				a.resetUndo = function() {
					b.reset();
					a.fire("saveSnapshot")
				};
				a.on("updateSnapshot", function() {
					b.currentImage && b.update()
				});
				a.on("lockSnapshot", function(a) {
					a = a.data;
					b.lock(a && a.dontUpdate, a && a.forceUpdate)
				});
				a.on("unlockSnapshot", b.unlock, b)
			}
		});
		CKEDITOR.plugins.undo = {};
		var f = CKEDITOR.plugins.undo.Image = function(a, c) {
				this.editor = a;
				a.fire("beforeUndoImage");
				var d = a.getSnapshot();
				CKEDITOR.env.ie && d && (d = d.replace(/\s+data-cke-expando=".*?"/g, ""));
				this.contents = d;
				c || (this.bookmarks = (d =
					d && a.getSelection()) && d.createBookmarks2(!0));
				a.fire("afterUndoImage")
			},
			i = /\b(?:href|src|name)="[^"]*?"/gi;
		f.prototype = {
			equalsContent: function(a) {
				var c = this.contents,
					a = a.contents;
				if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)) c = c.replace(i, ""), a = a.replace(i, "");
				return c != a ? !1 : !0
			},
			equalsSelection: function(a) {
				var c = this.bookmarks,
					a = a.bookmarks;
				if (c || a) {
					if (!c || !a || c.length != a.length) return !1;
					for (var d = 0; d < c.length; d++) {
						var b = c[d],
							e = a[d];
						if (b.startOffset != e.startOffset || b.endOffset !=
							e.endOffset || !CKEDITOR.tools.arrayCompare(b.start, e.start) || !CKEDITOR.tools.arrayCompare(b.end, e.end)) return !1
					}
				}
				return !0
			}
		};
		g.prototype = {
			type: function(a, c) {
				var d = !c && a != this.lastKeystroke,
					b = this.editor;
				if (!this.typing || c && !this.wasCharacter || d) {
					var e = new f(b),
						g = this.snapshots.length;
					CKEDITOR.tools.setTimeout(function() {
						var a = b.getSnapshot();
						CKEDITOR.env.ie && (a = a.replace(/\s+data-cke-expando=".*?"/g, ""));
						e.contents != a && g == this.snapshots.length && (this.typing = !0, this.save(!1, e, !1) || this.snapshots.splice(this.index +
							1, this.snapshots.length - this.index - 1), this.hasUndo = !0, this.hasRedo = !1, this.modifiersCount = this.typesCount = 1, this.onChange())
					}, 0, this)
				}
				this.lastKeystroke = a;
				(this.wasCharacter = c) ? (this.modifiersCount = 0, this.typesCount++, 25 < this.typesCount ? (this.save(!1, null, !1), this.typesCount = 1) : setTimeout(function() {
					b.fire("change")
				}, 0)) : (this.typesCount = 0, this.modifiersCount++, 25 < this.modifiersCount ? (this.save(!1, null, !1), this.modifiersCount = 1) : setTimeout(function() {
					b.fire("change")
				}, 0))
			},
			reset: function() {
				this.lastKeystroke =
					0;
				this.snapshots = [];
				this.index = -1;
				this.limit = this.editor.config.undoStackSize || 20;
				this.currentImage = null;
				this.hasRedo = this.hasUndo = !1;
				this.locked = null;
				this.resetType()
			},
			resetType: function() {
				this.typing = !1;
				delete this.lastKeystroke;
				this.modifiersCount = this.typesCount = 0
			},
			fireChange: function() {
				this.hasUndo = !!this.getNextImage(!0);
				this.hasRedo = !!this.getNextImage(!1);
				this.resetType();
				this.onChange()
			},
			save: function(a, c, d) {
				var b = this.editor;
				if (this.locked || "ready" != b.status || "wysiwyg" != b.mode) return !1;
				var e = b.editable();
				if (!e || "ready" != e.status) return !1;
				e = this.snapshots;
				c || (c = new f(b));
				if (!1 === c.contents) return !1;
				if (this.currentImage)
					if (c.equalsContent(this.currentImage)) {
						if (a || c.equalsSelection(this.currentImage)) return !1
					} else b.fire("change");
				e.splice(this.index + 1, e.length - this.index - 1);
				e.length == this.limit && e.shift();
				this.index = e.push(c) - 1;
				this.currentImage = c;
				!1 !== d && this.fireChange();
				return !0
			},
			restoreImage: function(a) {
				var c = this.editor,
					d;
				a.bookmarks && (c.focus(), d = c.getSelection());
				this.locked =
					1;
				this.editor.loadSnapshot(a.contents);
				a.bookmarks ? d.selectBookmarks(a.bookmarks) : CKEDITOR.env.ie && (d = this.editor.document.getBody().$.createTextRange(), d.collapse(!0), d.select());
				this.locked = 0;
				this.index = a.index;
				this.currentImage = this.snapshots[this.index];
				this.update();
				this.fireChange();
				c.fire("change")
			},
			getNextImage: function(a) {
				var c = this.snapshots,
					d = this.currentImage,
					b;
				if (d)
					if (a)
						for (b = this.index - 1; 0 <= b; b--) {
							if (a = c[b], !d.equalsContent(a)) return a.index = b, a
						} else
							for (b = this.index + 1; b < c.length; b++)
								if (a =
									c[b], !d.equalsContent(a)) return a.index = b, a;
				return null
			},
			redoable: function() {
				return this.enabled && this.hasRedo
			},
			undoable: function() {
				return this.enabled && this.hasUndo
			},
			undo: function() {
				if (this.undoable()) {
					this.save(!0);
					var a = this.getNextImage(!0);
					if (a) return this.restoreImage(a), !0
				}
				return !1
			},
			redo: function() {
				if (this.redoable() && (this.save(!0), this.redoable())) {
					var a = this.getNextImage(!1);
					if (a) return this.restoreImage(a), !0
				}
				return !1
			},
			update: function(a) {
				if (!this.locked) {
					a || (a = new f(this.editor));
					for (var c =
						this.index, d = this.snapshots; 0 < c && this.currentImage.equalsContent(d[c - 1]);) c -= 1;
					d.splice(c, this.index - c + 1, a);
					this.index = c;
					this.currentImage = a
				}
			},
			lock: function(a, c) {
				if (this.locked) this.locked.level++;
				else if (a) this.locked = {
					level: 1
				};
				else {
					var d = null;
					if (c) d = !0;
					else {
						var b = new f(this.editor, !0);
						this.currentImage && this.currentImage.equalsContent(b) && (d = b)
					}
					this.locked = {
						update: d,
						level: 1
					}
				}
			},
			unlock: function() {
				if (this.locked && !--this.locked.level) {
					var a = this.locked.update;
					this.locked = null;
					if (!0 === a) this.update();
					else if (a) {
						var c = new f(this.editor, !0);
						a.equalsContent(c) || this.update()
					}
				}
			}
		}
	})();
	CKEDITOR.config.wsc_removeGlobalVariable = !0;
	CKEDITOR.plugins.add("wsc", {
		requires: "dialog",
		parseApi: function(a) {
			a.config.wsc_onFinish = "function" === typeof a.config.wsc_onFinish ? a.config.wsc_onFinish : function() {};
			a.config.wsc_onClose = "function" === typeof a.config.wsc_onClose ? a.config.wsc_onClose : function() {}
		},
		parseConfig: function(a) {
			a.config.wsc_customerId = a.config.wsc_customerId || CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
			a.config.wsc_customDictionaryIds = a.config.wsc_customDictionaryIds ||
				CKEDITOR.config.wsc_customDictionaryIds || "";
			a.config.wsc_userDictionaryName = a.config.wsc_userDictionaryName || CKEDITOR.config.wsc_userDictionaryName || "";
			a.config.wsc_customLoaderScript = a.config.wsc_customLoaderScript || CKEDITOR.config.wsc_customLoaderScript;
			CKEDITOR.config.wsc_cmd = a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell";
			CKEDITOR.config.wsc_version = CKEDITOR.version + " | %Rev%"
		},
		init: function(a) {
			var b = CKEDITOR.env;
			this.parseConfig(a);
			this.parseApi(a);
			a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes = {
				wysiwyg: !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname && !(b.ie && (8 > b.version || b.quirks))
			};
			"undefined" == typeof a.plugins.scayt && a.ui.addButton && a.ui.addButton("SpellChecker", {
				label: a.lang.wsc.toolbar,
				click: function(a) {
					var b = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
					(b = b.replace(/\s/g, "")) ? a.execCommand("checkspell") : alert("Nothing to check!")
				},
				toolbar: "spellchecker,10"
			});
			CKEDITOR.dialog.add("checkspell", this.path +
				(CKEDITOR.env.ie && 7 >= CKEDITOR.env.version ? "dialogs/wsc_ie.js" : window.postMessage ? "dialogs/wsc.js" : "dialogs/wsc_ie.js"))
		}
	});
	CKEDITOR.config.plugins = 'dialogui,dialog,about,a11yhelp,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,resize,button,toolbar,elementspath,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,format,horizontalrule,htmlwriter,wysiwygarea,image,indent,indentlist,fakeobjects,link,list,magicline,maximize,pastetext,pastefromword,removeformat,showborders,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc';
	CKEDITOR.config.skin = 'moono';
	(function() {
		var setIcons = function(icons, strip) {
			var path = CKEDITOR.getUrl('plugins/' + strip);
			icons = icons.split(',');
			for (var i = 0; i < icons.length; i++) CKEDITOR.skin.icons[icons[i]] = {
				path: path,
				offset: -icons[++i],
				bgsize: icons[++i]
			};
		};
		if (CKEDITOR.env.hidpi) setIcons('about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,blockquote,168,,copy-rtl,192,,copy,216,,cut-rtl,240,,cut,264,,paste-rtl,288,,paste,312,,horizontalrule,336,,image,360,,indent-rtl,384,,indent,408,,outdent-rtl,432,,outdent,456,,anchor-rtl,480,,anchor,504,,link,528,,unlink,552,,bulletedlist-rtl,576,,bulletedlist,600,,numberedlist-rtl,624,,numberedlist,648,,maximize,672,,pastetext-rtl,696,,pastetext,720,,pastefromword-rtl,744,,pastefromword,768,,removeformat,792,,source-rtl,816,,source,840,,specialchar,864,,scayt,888,,table,912,,redo-rtl,936,,redo,960,,undo-rtl,984,,undo,1008,,spellchecker,1032,', 'icons_hidpi.png');
		else setIcons('about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,blockquote,168,auto,copy-rtl,192,auto,copy,216,auto,cut-rtl,240,auto,cut,264,auto,paste-rtl,288,auto,paste,312,auto,horizontalrule,336,auto,image,360,auto,indent-rtl,384,auto,indent,408,auto,outdent-rtl,432,auto,outdent,456,auto,anchor-rtl,480,auto,anchor,504,auto,link,528,auto,unlink,552,auto,bulletedlist-rtl,576,auto,bulletedlist,600,auto,numberedlist-rtl,624,auto,numberedlist,648,auto,maximize,672,auto,pastetext-rtl,696,auto,pastetext,720,auto,pastefromword-rtl,744,auto,pastefromword,768,auto,removeformat,792,auto,source-rtl,816,auto,source,840,auto,specialchar,864,auto,scayt,888,auto,table,912,auto,redo-rtl,936,auto,redo,960,auto,undo-rtl,984,auto,undo,1008,auto,spellchecker,1032,auto', 'icons.png');
	})();
	CKEDITOR.lang.languages = {
		"af": 1,
		"sq": 1,
		"ar": 1,
		"eu": 1,
		"bn": 1,
		"bs": 1,
		"bg": 1,
		"ca": 1,
		"zh-cn": 1,
		"zh": 1,
		"hr": 1,
		"cs": 1,
		"da": 1,
		"nl": 1,
		"en": 1,
		"en-au": 1,
		"en-ca": 1,
		"en-gb": 1,
		"eo": 1,
		"et": 1,
		"fo": 1,
		"fi": 1,
		"fr": 1,
		"fr-ca": 1,
		"gl": 1,
		"ka": 1,
		"de": 1,
		"el": 1,
		"gu": 1,
		"he": 1,
		"hi": 1,
		"hu": 1,
		"is": 1,
		"id": 1,
		"it": 1,
		"ja": 1,
		"km": 1,
		"ko": 1,
		"ku": 1,
		"lv": 1,
		"lt": 1,
		"mk": 1,
		"ms": 1,
		"mn": 1,
		"no": 1,
		"nb": 1,
		"fa": 1,
		"pl": 1,
		"pt-br": 1,
		"pt": 1,
		"ro": 1,
		"ru": 1,
		"sr": 1,
		"sr-latn": 1,
		"si": 1,
		"sk": 1,
		"sl": 1,
		"es": 1,
		"sv": 1,
		"tt": 1,
		"th": 1,
		"tr": 1,
		"ug": 1,
		"uk": 1,
		"vi": 1,
		"cy": 1
	};
}());