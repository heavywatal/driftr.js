//#region rolldown:runtime
var __defProp = Object.defineProperty;
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};

//#endregion
//#region node_modules/d3-array/src/ascending.js
function ascending$1(a, b) {
	return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

//#endregion
//#region node_modules/d3-array/src/descending.js
function descending(a, b) {
	return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

//#endregion
//#region node_modules/d3-array/src/bisector.js
function bisector(f) {
	let compare1, compare2, delta;
	if (f.length !== 2) {
		compare1 = ascending$1;
		compare2 = (d, x$1) => ascending$1(f(d), x$1);
		delta = (d, x$1) => f(d) - x$1;
	} else {
		compare1 = f === ascending$1 || f === descending ? f : zero$1;
		compare2 = f;
		delta = f;
	}
	function left$1(a, x$1, lo = 0, hi = a.length) {
		if (lo < hi) {
			if (compare1(x$1, x$1) !== 0) return hi;
			do {
				const mid = lo + hi >>> 1;
				if (compare2(a[mid], x$1) < 0) lo = mid + 1;
				else hi = mid;
			} while (lo < hi);
		}
		return lo;
	}
	function right$1(a, x$1, lo = 0, hi = a.length) {
		if (lo < hi) {
			if (compare1(x$1, x$1) !== 0) return hi;
			do {
				const mid = lo + hi >>> 1;
				if (compare2(a[mid], x$1) <= 0) lo = mid + 1;
				else hi = mid;
			} while (lo < hi);
		}
		return lo;
	}
	function center$1(a, x$1, lo = 0, hi = a.length) {
		const i = left$1(a, x$1, lo, hi - 1);
		return i > lo && delta(a[i - 1], x$1) > -delta(a[i], x$1) ? i - 1 : i;
	}
	return {
		left: left$1,
		center: center$1,
		right: right$1
	};
}
function zero$1() {
	return 0;
}

//#endregion
//#region node_modules/d3-array/src/number.js
function number$2(x$1) {
	return x$1 === null ? NaN : +x$1;
}

//#endregion
//#region node_modules/d3-array/src/bisect.js
const ascendingBisect = bisector(ascending$1);
const bisectRight = ascendingBisect.right;
const bisectLeft = ascendingBisect.left;
const bisectCenter = bisector(number$2).center;
var bisect_default = bisectRight;

//#endregion
//#region node_modules/d3-array/src/ticks.js
const e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
function tickSpec(start$1, stop, count) {
	const step = (stop - start$1) / Math.max(0, count), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
	let i1, i2, inc;
	if (power < 0) {
		inc = Math.pow(10, -power) / factor;
		i1 = Math.round(start$1 * inc);
		i2 = Math.round(stop * inc);
		if (i1 / inc < start$1) ++i1;
		if (i2 / inc > stop) --i2;
		inc = -inc;
	} else {
		inc = Math.pow(10, power) * factor;
		i1 = Math.round(start$1 / inc);
		i2 = Math.round(stop / inc);
		if (i1 * inc < start$1) ++i1;
		if (i2 * inc > stop) --i2;
	}
	if (i2 < i1 && .5 <= count && count < 2) return tickSpec(start$1, stop, count * 2);
	return [
		i1,
		i2,
		inc
	];
}
function ticks(start$1, stop, count) {
	stop = +stop, start$1 = +start$1, count = +count;
	if (!(count > 0)) return [];
	if (start$1 === stop) return [start$1];
	const reverse = stop < start$1, [i1, i2, inc] = reverse ? tickSpec(stop, start$1, count) : tickSpec(start$1, stop, count);
	if (!(i2 >= i1)) return [];
	const n = i2 - i1 + 1, ticks$1 = new Array(n);
	if (reverse) if (inc < 0) for (let i = 0; i < n; ++i) ticks$1[i] = (i2 - i) / -inc;
	else for (let i = 0; i < n; ++i) ticks$1[i] = (i2 - i) * inc;
	else if (inc < 0) for (let i = 0; i < n; ++i) ticks$1[i] = (i1 + i) / -inc;
	else for (let i = 0; i < n; ++i) ticks$1[i] = (i1 + i) * inc;
	return ticks$1;
}
function tickIncrement(start$1, stop, count) {
	stop = +stop, start$1 = +start$1, count = +count;
	return tickSpec(start$1, stop, count)[2];
}
function tickStep(start$1, stop, count) {
	stop = +stop, start$1 = +start$1, count = +count;
	const reverse = stop < start$1, inc = reverse ? tickIncrement(stop, start$1, count) : tickIncrement(start$1, stop, count);
	return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}

//#endregion
//#region node_modules/d3-axis/src/identity.js
function identity_default$1(x$1) {
	return x$1;
}

//#endregion
//#region node_modules/d3-axis/src/axis.js
var top = 1, right = 2, bottom = 3, left = 4, epsilon$1 = 1e-6;
function translateX(x$1) {
	return "translate(" + x$1 + ",0)";
}
function translateY(y$1) {
	return "translate(0," + y$1 + ")";
}
function number$1(scale) {
	return (d) => +scale(d);
}
function center(scale, offset) {
	offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
	if (scale.round()) offset = Math.round(offset);
	return (d) => +scale(d) + offset;
}
function entering() {
	return !this.__axis;
}
function axis(orient, scale) {
	var tickArguments = [], tickValues = null, tickFormat$1 = null, tickSizeInner = 6, tickSizeOuter = 6, tickPadding = 3, offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : .5, k = orient === top || orient === left ? -1 : 1, x$1 = orient === left || orient === right ? "x" : "y", transform$1 = orient === top || orient === bottom ? translateX : translateY;
	function axis$1(context) {
		var values = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues, format$1 = tickFormat$1 == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity_default$1 : tickFormat$1, spacing = Math.max(tickSizeInner, 0) + tickPadding, range = scale.range(), range0 = +range[0] + offset, range1 = +range[range.length - 1] + offset, position = (scale.bandwidth ? center : number$1)(scale.copy(), offset), selection$1 = context.selection ? context.selection() : context, path$1 = selection$1.selectAll(".domain").data([null]), tick = selection$1.selectAll(".tick").data(values, scale).order(), tickExit = tick.exit(), tickEnter = tick.enter().append("g").attr("class", "tick"), line = tick.select("line"), text = tick.select("text");
		path$1 = path$1.merge(path$1.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor"));
		tick = tick.merge(tickEnter);
		line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x$1 + "2", k * tickSizeInner));
		text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x$1, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));
		if (context !== selection$1) {
			path$1 = path$1.transition(context);
			tick = tick.transition(context);
			line = line.transition(context);
			text = text.transition(context);
			tickExit = tickExit.transition(context).attr("opacity", epsilon$1).attr("transform", function(d) {
				return isFinite(d = position(d)) ? transform$1(d + offset) : this.getAttribute("transform");
			});
			tickEnter.attr("opacity", epsilon$1).attr("transform", function(d) {
				var p = this.parentNode.__axis;
				return transform$1((p && isFinite(p = p(d)) ? p : position(d)) + offset);
			});
		}
		tickExit.remove();
		path$1.attr("d", orient === left || orient === right ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1);
		tick.attr("opacity", 1).attr("transform", function(d) {
			return transform$1(position(d) + offset);
		});
		line.attr(x$1 + "2", k * tickSizeInner);
		text.attr(x$1, k * spacing).text(format$1);
		selection$1.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");
		selection$1.each(function() {
			this.__axis = position;
		});
	}
	axis$1.scale = function(_) {
		return arguments.length ? (scale = _, axis$1) : scale;
	};
	axis$1.ticks = function() {
		return tickArguments = Array.from(arguments), axis$1;
	};
	axis$1.tickArguments = function(_) {
		return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis$1) : tickArguments.slice();
	};
	axis$1.tickValues = function(_) {
		return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis$1) : tickValues && tickValues.slice();
	};
	axis$1.tickFormat = function(_) {
		return arguments.length ? (tickFormat$1 = _, axis$1) : tickFormat$1;
	};
	axis$1.tickSize = function(_) {
		return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis$1) : tickSizeInner;
	};
	axis$1.tickSizeInner = function(_) {
		return arguments.length ? (tickSizeInner = +_, axis$1) : tickSizeInner;
	};
	axis$1.tickSizeOuter = function(_) {
		return arguments.length ? (tickSizeOuter = +_, axis$1) : tickSizeOuter;
	};
	axis$1.tickPadding = function(_) {
		return arguments.length ? (tickPadding = +_, axis$1) : tickPadding;
	};
	axis$1.offset = function(_) {
		return arguments.length ? (offset = +_, axis$1) : offset;
	};
	return axis$1;
}
function axisBottom(scale) {
	return axis(bottom, scale);
}
function axisLeft(scale) {
	return axis(left, scale);
}

//#endregion
//#region node_modules/d3-dispatch/src/dispatch.js
var noop = { value: () => {} };
function dispatch() {
	for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
		if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
		_[t] = [];
	}
	return new Dispatch(_);
}
function Dispatch(_) {
	this._ = _;
}
function parseTypenames$1(typenames, types) {
	return typenames.trim().split(/^|\s+/).map(function(t) {
		var name = "", i = t.indexOf(".");
		if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
		if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
		return {
			type: t,
			name
		};
	});
}
Dispatch.prototype = dispatch.prototype = {
	constructor: Dispatch,
	on: function(typename, callback) {
		var _ = this._, T = parseTypenames$1(typename + "", _), t, i = -1, n = T.length;
		if (arguments.length < 2) {
			while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
			return;
		}
		if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
		while (++i < n) if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
		else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
		return this;
	},
	copy: function() {
		var copy$1 = {}, _ = this._;
		for (var t in _) copy$1[t] = _[t].slice();
		return new Dispatch(copy$1);
	},
	call: function(type$1, that) {
		if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
		if (!this._.hasOwnProperty(type$1)) throw new Error("unknown type: " + type$1);
		for (t = this._[type$1], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	},
	apply: function(type$1, that, args) {
		if (!this._.hasOwnProperty(type$1)) throw new Error("unknown type: " + type$1);
		for (var t = this._[type$1], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	}
};
function get$1(type$1, name) {
	for (var i = 0, n = type$1.length, c; i < n; ++i) if ((c = type$1[i]).name === name) return c.value;
}
function set$1(type$1, name, callback) {
	for (var i = 0, n = type$1.length; i < n; ++i) if (type$1[i].name === name) {
		type$1[i] = noop, type$1 = type$1.slice(0, i).concat(type$1.slice(i + 1));
		break;
	}
	if (callback != null) type$1.push({
		name,
		value: callback
	});
	return type$1;
}
var dispatch_default$1 = dispatch;

//#endregion
//#region node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
	svg: "http://www.w3.org/2000/svg",
	xhtml,
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};

//#endregion
//#region node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
	var prefix = name += "", i = prefix.indexOf(":");
	if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	return namespaces_default.hasOwnProperty(prefix) ? {
		space: namespaces_default[prefix],
		local: name
	} : name;
}

//#endregion
//#region node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
	return function() {
		var document$1 = this.ownerDocument, uri = this.namespaceURI;
		return uri === xhtml && document$1.documentElement.namespaceURI === xhtml ? document$1.createElement(name) : document$1.createElementNS(uri, name);
	};
}
function creatorFixed(fullname) {
	return function() {
		return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	};
}
function creator_default(name) {
	var fullname = namespace_default(name);
	return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

//#endregion
//#region node_modules/d3-selection/src/selector.js
function none() {}
function selector_default(selector) {
	return selector == null ? none : function() {
		return this.querySelector(selector);
	};
}

//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function select_default$2(select) {
	if (typeof select !== "function") select = selector_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
		if ("__data__" in node) subnode.__data__ = node.__data__;
		subgroup[i] = subnode;
	}
	return new Selection$1(subgroups, this._parents);
}

//#endregion
//#region node_modules/d3-selection/src/array.js
function array(x$1) {
	return x$1 == null ? [] : Array.isArray(x$1) ? x$1 : Array.from(x$1);
}

//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function empty() {
	return [];
}
function selectorAll_default(selector) {
	return selector == null ? empty : function() {
		return this.querySelectorAll(selector);
	};
}

//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
	return function() {
		return array(select.apply(this, arguments));
	};
}
function selectAll_default$2(select) {
	if (typeof select === "function") select = arrayAll(select);
	else select = selectorAll_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		subgroups.push(select.call(node, node.__data__, i, group));
		parents.push(node);
	}
	return new Selection$1(subgroups, parents);
}

//#endregion
//#region node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
	return function() {
		return this.matches(selector);
	};
}
function childMatcher(selector) {
	return function(node) {
		return node.matches(selector);
	};
}

//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
	return function() {
		return find.call(this.children, match);
	};
}
function childFirst() {
	return this.firstElementChild;
}
function selectChild_default(match) {
	return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
	return Array.from(this.children);
}
function childrenFilter(match) {
	return function() {
		return filter.call(this.children, match);
	};
}
function selectChildren_default(match) {
	return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function filter_default$1(match) {
	if (typeof match !== "function") match = matcher_default(match);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
	return new Selection$1(subgroups, this._parents);
}

//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
	return new Array(update.length);
}

//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function enter_default() {
	return new Selection$1(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum$1) {
	this.ownerDocument = parent.ownerDocument;
	this.namespaceURI = parent.namespaceURI;
	this._next = null;
	this._parent = parent;
	this.__data__ = datum$1;
}
EnterNode.prototype = {
	constructor: EnterNode,
	appendChild: function(child) {
		return this._parent.insertBefore(child, this._next);
	},
	insertBefore: function(child, next) {
		return this._parent.insertBefore(child, next);
	},
	querySelector: function(selector) {
		return this._parent.querySelector(selector);
	},
	querySelectorAll: function(selector) {
		return this._parent.querySelectorAll(selector);
	}
};

//#endregion
//#region node_modules/d3-selection/src/constant.js
function constant_default$2(x$1) {
	return function() {
		return x$1;
	};
}

//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
	var i = 0, node, groupLength = group.length, dataLength = data.length;
	for (; i < dataLength; ++i) if (node = group[i]) {
		node.__data__ = data[i];
		update[i] = node;
	} else enter[i] = new EnterNode(parent, data[i]);
	for (; i < groupLength; ++i) if (node = group[i]) exit[i] = node;
}
function bindKey(parent, group, enter, update, exit, data, key) {
	var i, node, nodeByKeyValue = new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
	for (i = 0; i < groupLength; ++i) if (node = group[i]) {
		keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
		if (nodeByKeyValue.has(keyValue)) exit[i] = node;
		else nodeByKeyValue.set(keyValue, node);
	}
	for (i = 0; i < dataLength; ++i) {
		keyValue = key.call(parent, data[i], i, data) + "";
		if (node = nodeByKeyValue.get(keyValue)) {
			update[i] = node;
			node.__data__ = data[i];
			nodeByKeyValue.delete(keyValue);
		} else enter[i] = new EnterNode(parent, data[i]);
	}
	for (i = 0; i < groupLength; ++i) if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) exit[i] = node;
}
function datum(node) {
	return node.__data__;
}
function data_default(value, key) {
	if (!arguments.length) return Array.from(this, datum);
	var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
	if (typeof value !== "function") value = constant_default$2(value);
	for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
		var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
		bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
		for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) if (previous = enterGroup[i0]) {
			if (i0 >= i1) i1 = i0 + 1;
			while (!(next = updateGroup[i1]) && ++i1 < dataLength);
			previous._next = next || null;
		}
	}
	update = new Selection$1(update, parents);
	update._enter = enter;
	update._exit = exit;
	return update;
}
function arraylike(data) {
	return typeof data === "object" && "length" in data ? data : Array.from(data);
}

//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function exit_default() {
	return new Selection$1(this._exit || this._groups.map(sparse_default), this._parents);
}

//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
	var enter = this.enter(), update = this, exit = this.exit();
	if (typeof onenter === "function") {
		enter = onenter(enter);
		if (enter) enter = enter.selection();
	} else enter = enter.append(onenter + "");
	if (onupdate != null) {
		update = onupdate(update);
		if (update) update = update.selection();
	}
	if (onexit == null) exit.remove();
	else onexit(exit);
	return enter && update ? enter.merge(update).order() : update;
}

//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function merge_default$1(context) {
	var selection$1 = context.selection ? context.selection() : context;
	for (var groups0 = this._groups, groups1 = selection$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group0[i] || group1[i]) merge[i] = node;
	for (; j < m0; ++j) merges[j] = groups0[j];
	return new Selection$1(merges, this._parents);
}

//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function order_default() {
	for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) if (node = group[i]) {
		if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
		next = node;
	}
	return this;
}

//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
	if (!compare) compare = ascending;
	function compareNode(a, b) {
		return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	}
	for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
		for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group[i]) sortgroup[i] = node;
		sortgroup.sort(compareNode);
	}
	return new Selection$1(sortgroups, this._parents).order();
}
function ascending(a, b) {
	return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function call_default() {
	var callback = arguments[0];
	arguments[0] = this;
	callback.apply(null, arguments);
	return this;
}

//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
	return Array.from(this);
}

//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function node_default() {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
		var node = group[i];
		if (node) return node;
	}
	return null;
}

//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function size_default() {
	let size = 0;
	for (const node of this) ++size;
	return size;
}

//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function empty_default() {
	return !this.node();
}

//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) if (node = group[i]) callback.call(node, node.__data__, i, group);
	return this;
}

//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function attrRemove$1(name) {
	return function() {
		this.removeAttribute(name);
	};
}
function attrRemoveNS$1(fullname) {
	return function() {
		this.removeAttributeNS(fullname.space, fullname.local);
	};
}
function attrConstant$1(name, value) {
	return function() {
		this.setAttribute(name, value);
	};
}
function attrConstantNS$1(fullname, value) {
	return function() {
		this.setAttributeNS(fullname.space, fullname.local, value);
	};
}
function attrFunction$1(name, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.removeAttribute(name);
		else this.setAttribute(name, v);
	};
}
function attrFunctionNS$1(fullname, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
		else this.setAttributeNS(fullname.space, fullname.local, v);
	};
}
function attr_default$1(name, value) {
	var fullname = namespace_default(name);
	if (arguments.length < 2) {
		var node = this.node();
		return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
	}
	return this.each((value == null ? fullname.local ? attrRemoveNS$1 : attrRemove$1 : typeof value === "function" ? fullname.local ? attrFunctionNS$1 : attrFunction$1 : fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, value));
}

//#endregion
//#region node_modules/d3-selection/src/window.js
function window_default(node) {
	return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function styleRemove$1(name) {
	return function() {
		this.style.removeProperty(name);
	};
}
function styleConstant$1(name, value, priority) {
	return function() {
		this.style.setProperty(name, value, priority);
	};
}
function styleFunction$1(name, value, priority) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.style.removeProperty(name);
		else this.style.setProperty(name, v, priority);
	};
}
function style_default$1(name, value, priority) {
	return arguments.length > 1 ? this.each((value == null ? styleRemove$1 : typeof value === "function" ? styleFunction$1 : styleConstant$1)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
	return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
	return function() {
		delete this[name];
	};
}
function propertyConstant(name, value) {
	return function() {
		this[name] = value;
	};
}
function propertyFunction(name, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) delete this[name];
		else this[name] = v;
	};
}
function property_default(name, value) {
	return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
	return string.trim().split(/^|\s+/);
}
function classList(node) {
	return node.classList || new ClassList(node);
}
function ClassList(node) {
	this._node = node;
	this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
	add: function(name) {
		var i = this._names.indexOf(name);
		if (i < 0) {
			this._names.push(name);
			this._node.setAttribute("class", this._names.join(" "));
		}
	},
	remove: function(name) {
		var i = this._names.indexOf(name);
		if (i >= 0) {
			this._names.splice(i, 1);
			this._node.setAttribute("class", this._names.join(" "));
		}
	},
	contains: function(name) {
		return this._names.indexOf(name) >= 0;
	}
};
function classedAdd(node, names) {
	var list = classList(node), i = -1, n = names.length;
	while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
	var list = classList(node), i = -1, n = names.length;
	while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
	return function() {
		classedAdd(this, names);
	};
}
function classedFalse(names) {
	return function() {
		classedRemove(this, names);
	};
}
function classedFunction(names, value) {
	return function() {
		(value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	};
}
function classed_default(name, value) {
	var names = classArray(name + "");
	if (arguments.length < 2) {
		var list = classList(this.node()), i = -1, n = names.length;
		while (++i < n) if (!list.contains(names[i])) return false;
		return true;
	}
	return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function textRemove() {
	this.textContent = "";
}
function textConstant$1(value) {
	return function() {
		this.textContent = value;
	};
}
function textFunction$1(value) {
	return function() {
		var v = value.apply(this, arguments);
		this.textContent = v == null ? "" : v;
	};
}
function text_default$1(value) {
	return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction$1 : textConstant$1)(value)) : this.node().textContent;
}

//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
	this.innerHTML = "";
}
function htmlConstant(value) {
	return function() {
		this.innerHTML = value;
	};
}
function htmlFunction(value) {
	return function() {
		var v = value.apply(this, arguments);
		this.innerHTML = v == null ? "" : v;
	};
}
function html_default(value) {
	return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function raise() {
	if (this.nextSibling) this.parentNode.appendChild(this);
}
function raise_default() {
	return this.each(raise);
}

//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function lower() {
	if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
	return this.each(lower);
}

//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function append_default(name) {
	var create$1 = typeof name === "function" ? name : creator_default(name);
	return this.select(function() {
		return this.appendChild(create$1.apply(this, arguments));
	});
}

//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function constantNull() {
	return null;
}
function insert_default(name, before) {
	var create$1 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
	return this.select(function() {
		return this.insertBefore(create$1.apply(this, arguments), select.apply(this, arguments) || null);
	});
}

//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function remove() {
	var parent = this.parentNode;
	if (parent) parent.removeChild(this);
}
function remove_default$1() {
	return this.each(remove);
}

//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
	var clone = this.cloneNode(false), parent = this.parentNode;
	return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
	var clone = this.cloneNode(true), parent = this.parentNode;
	return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
	return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
	return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
	return function(event) {
		listener.call(this, event, this.__data__);
	};
}
function parseTypenames(typenames) {
	return typenames.trim().split(/^|\s+/).map(function(t) {
		var name = "", i = t.indexOf(".");
		if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
		return {
			type: t,
			name
		};
	});
}
function onRemove(typename) {
	return function() {
		var on = this.__on;
		if (!on) return;
		for (var j = 0, i = -1, m = on.length, o; j < m; ++j) if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) this.removeEventListener(o.type, o.listener, o.options);
		else on[++i] = o;
		if (++i) on.length = i;
		else delete this.__on;
	};
}
function onAdd(typename, value, options) {
	return function() {
		var on = this.__on, o, listener = contextListener(value);
		if (on) {
			for (var j = 0, m = on.length; j < m; ++j) if ((o = on[j]).type === typename.type && o.name === typename.name) {
				this.removeEventListener(o.type, o.listener, o.options);
				this.addEventListener(o.type, o.listener = listener, o.options = options);
				o.value = value;
				return;
			}
		}
		this.addEventListener(typename.type, listener, options);
		o = {
			type: typename.type,
			name: typename.name,
			value,
			listener,
			options
		};
		if (!on) this.__on = [o];
		else on.push(o);
	};
}
function on_default$1(typename, value, options) {
	var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
	if (arguments.length < 2) {
		var on = this.node().__on;
		if (on) {
			for (var j = 0, m = on.length, o; j < m; ++j) for (i = 0, o = on[j]; i < n; ++i) if ((t = typenames[i]).type === o.type && t.name === o.name) return o.value;
		}
		return;
	}
	on = value ? onAdd : onRemove;
	for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
	return this;
}

//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type$1, params) {
	var window$1 = window_default(node), event = window$1.CustomEvent;
	if (typeof event === "function") event = new event(type$1, params);
	else {
		event = window$1.document.createEvent("Event");
		if (params) event.initEvent(type$1, params.bubbles, params.cancelable), event.detail = params.detail;
		else event.initEvent(type$1, false, false);
	}
	node.dispatchEvent(event);
}
function dispatchConstant(type$1, params) {
	return function() {
		return dispatchEvent(this, type$1, params);
	};
}
function dispatchFunction(type$1, params) {
	return function() {
		return dispatchEvent(this, type$1, params.apply(this, arguments));
	};
}
function dispatch_default(type$1, params) {
	return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type$1, params));
}

//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) if (node = group[i]) yield node;
}

//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection$1(groups, parents) {
	this._groups = groups;
	this._parents = parents;
}
function selection() {
	return new Selection$1([[document.documentElement]], root);
}
function selection_selection() {
	return this;
}
Selection$1.prototype = selection.prototype = {
	constructor: Selection$1,
	select: select_default$2,
	selectAll: selectAll_default$2,
	selectChild: selectChild_default,
	selectChildren: selectChildren_default,
	filter: filter_default$1,
	data: data_default,
	enter: enter_default,
	exit: exit_default,
	join: join_default,
	merge: merge_default$1,
	selection: selection_selection,
	order: order_default,
	sort: sort_default,
	call: call_default,
	nodes: nodes_default,
	node: node_default,
	size: size_default,
	empty: empty_default,
	each: each_default,
	attr: attr_default$1,
	style: style_default$1,
	property: property_default,
	classed: classed_default,
	text: text_default$1,
	html: html_default,
	raise: raise_default,
	lower: lower_default,
	append: append_default,
	insert: insert_default,
	remove: remove_default$1,
	clone: clone_default,
	datum: datum_default,
	on: on_default$1,
	dispatch: dispatch_default,
	[Symbol.iterator]: iterator_default
};
var selection_default$1 = selection;

//#endregion
//#region node_modules/d3-selection/src/select.js
function select_default$1(selector) {
	return typeof selector === "string" ? new Selection$1([[document.querySelector(selector)]], [document.documentElement]) : new Selection$1([[selector]], root);
}

//#endregion
//#region node_modules/d3-selection/src/selectAll.js
function selectAll_default$1(selector) {
	return typeof selector === "string" ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement]) : new Selection$1([array(selector)], root);
}

//#endregion
//#region node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
	constructor.prototype = factory.prototype = prototype;
	prototype.constructor = constructor;
}
function extend(parent, definition) {
	var prototype = Object.create(parent.prototype);
	for (var key in definition) prototype[key] = definition[key];
	return prototype;
}

//#endregion
//#region node_modules/d3-color/src/color.js
function Color() {}
var darker = .7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
define_default(Color, color, {
	copy(channels) {
		return Object.assign(new this.constructor(), this, channels);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: color_formatHex,
	formatHex: color_formatHex,
	formatHex8: color_formatHex8,
	formatHsl: color_formatHsl,
	formatRgb: color_formatRgb,
	toString: color_formatRgb
});
function color_formatHex() {
	return this.rgb().formatHex();
}
function color_formatHex8() {
	return this.rgb().formatHex8();
}
function color_formatHsl() {
	return hslConvert(this).formatHsl();
}
function color_formatRgb() {
	return this.rgb().formatRgb();
}
function color(format$1) {
	var m, l;
	format$1 = (format$1 + "").trim().toLowerCase();
	return (m = reHex.exec(format$1)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format$1)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format$1)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format$1)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format$1)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format$1)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format$1)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format$1) ? rgbn(named[format$1]) : format$1 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
	return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
	if (a <= 0) r = g = b = NaN;
	return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
	if (!(o instanceof Color)) o = color(o);
	if (!o) return new Rgb();
	o = o.rgb();
	return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
	return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
	this.r = +r;
	this.g = +g;
	this.b = +b;
	this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
	brighter(k) {
		k = k == null ? brighter : Math.pow(brighter, k);
		return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	},
	darker(k) {
		k = k == null ? darker : Math.pow(darker, k);
		return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: rgb_formatHex,
	formatHex: rgb_formatHex,
	formatHex8: rgb_formatHex8,
	formatRgb: rgb_formatRgb,
	toString: rgb_formatRgb
}));
function rgb_formatHex() {
	return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
	return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
	const a = clampa(this.opacity);
	return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
	return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
	return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
	value = clampi(value);
	return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
	if (a <= 0) h = s = l = NaN;
	else if (l <= 0 || l >= 1) h = s = NaN;
	else if (s <= 0) h = NaN;
	return new Hsl(h, s, l, a);
}
function hslConvert(o) {
	if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	if (!(o instanceof Color)) o = color(o);
	if (!o) return new Hsl();
	if (o instanceof Hsl) return o;
	o = o.rgb();
	var r = o.r / 255, g = o.g / 255, b = o.b / 255, min$1 = Math.min(r, g, b), max$1 = Math.max(r, g, b), h = NaN, s = max$1 - min$1, l = (max$1 + min$1) / 2;
	if (s) {
		if (r === max$1) h = (g - b) / s + (g < b) * 6;
		else if (g === max$1) h = (b - r) / s + 2;
		else h = (r - g) / s + 4;
		s /= l < .5 ? max$1 + min$1 : 2 - max$1 - min$1;
		h *= 60;
	} else s = l > 0 && l < 1 ? 0 : h;
	return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
	return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
	this.h = +h;
	this.s = +s;
	this.l = +l;
	this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
	brighter(k) {
		k = k == null ? brighter : Math.pow(brighter, k);
		return new Hsl(this.h, this.s, this.l * k, this.opacity);
	},
	darker(k) {
		k = k == null ? darker : Math.pow(darker, k);
		return new Hsl(this.h, this.s, this.l * k, this.opacity);
	},
	rgb() {
		var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < .5 ? l : 1 - l) * s, m1 = 2 * l - m2;
		return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
	},
	clamp() {
		return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		const a = clampa(this.opacity);
		return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
	}
}));
function clamph(value) {
	value = (value || 0) % 360;
	return value < 0 ? value + 360 : value;
}
function clampt(value) {
	return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
	return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

//#endregion
//#region node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
	var t2 = t1 * t1, t3 = t2 * t1;
	return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
	var n = values.length - 1;
	return function(t) {
		var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
		return basis((t - i / n) * n, v0, v1, v2, v3);
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
	var n = values.length;
	return function(t) {
		var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
		return basis((t - i / n) * n, v0, v1, v2, v3);
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var constant_default$1 = (x$1) => () => x$1;

//#endregion
//#region node_modules/d3-interpolate/src/color.js
function linear$2(a, d) {
	return function(t) {
		return a + t * d;
	};
}
function exponential(a, b, y$1) {
	return a = Math.pow(a, y$1), b = Math.pow(b, y$1) - a, y$1 = 1 / y$1, function(t) {
		return Math.pow(a + t * b, y$1);
	};
}
function gamma(y$1) {
	return (y$1 = +y$1) === 1 ? nogamma : function(a, b) {
		return b - a ? exponential(a, b, y$1) : constant_default$1(isNaN(a) ? b : a);
	};
}
function nogamma(a, b) {
	var d = b - a;
	return d ? linear$2(a, d) : constant_default$1(isNaN(a) ? b : a);
}

//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y$1) {
	var color$1 = gamma(y$1);
	function rgb$1(start$1, end) {
		var r = color$1((start$1 = rgb(start$1)).r, (end = rgb(end)).r), g = color$1(start$1.g, end.g), b = color$1(start$1.b, end.b), opacity = nogamma(start$1.opacity, end.opacity);
		return function(t) {
			start$1.r = r(t);
			start$1.g = g(t);
			start$1.b = b(t);
			start$1.opacity = opacity(t);
			return start$1 + "";
		};
	}
	rgb$1.gamma = rgbGamma;
	return rgb$1;
}(1);
function rgbSpline(spline) {
	return function(colors) {
		var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color$1;
		for (i = 0; i < n; ++i) {
			color$1 = rgb(colors[i]);
			r[i] = color$1.r || 0;
			g[i] = color$1.g || 0;
			b[i] = color$1.b || 0;
		}
		r = spline(r);
		g = spline(g);
		b = spline(b);
		color$1.opacity = 1;
		return function(t) {
			color$1.r = r(t);
			color$1.g = g(t);
			color$1.b = b(t);
			return color$1 + "";
		};
	};
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function numberArray_default(a, b) {
	if (!b) b = [];
	var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
	return function(t) {
		for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
		return c;
	};
}
function isNumberArray(x$1) {
	return ArrayBuffer.isView(x$1) && !(x$1 instanceof DataView);
}

//#endregion
//#region node_modules/d3-interpolate/src/array.js
function genericArray(a, b) {
	var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x$1 = new Array(na), c = new Array(nb), i;
	for (i = 0; i < na; ++i) x$1[i] = value_default(a[i], b[i]);
	for (; i < nb; ++i) c[i] = b[i];
	return function(t) {
		for (i = 0; i < na; ++i) c[i] = x$1[i](t);
		return c;
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/date.js
function date_default(a, b) {
	var d = new Date();
	return a = +a, b = +b, function(t) {
		return d.setTime(a * (1 - t) + b * t), d;
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
	return a = +a, b = +b, function(t) {
		return a * (1 - t) + b * t;
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/object.js
function object_default(a, b) {
	var i = {}, c = {}, k;
	if (a === null || typeof a !== "object") a = {};
	if (b === null || typeof b !== "object") b = {};
	for (k in b) if (k in a) i[k] = value_default(a[k], b[k]);
	else c[k] = b[k];
	return function(t) {
		for (k in i) c[k] = i[k](t);
		return c;
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
	return function() {
		return b;
	};
}
function one(b) {
	return function(t) {
		return b(t) + "";
	};
}
function string_default(a, b) {
	var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
	a = a + "", b = b + "";
	while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
		if ((bs = bm.index) > bi) {
			bs = b.slice(bi, bs);
			if (s[i]) s[i] += bs;
			else s[++i] = bs;
		}
		if ((am = am[0]) === (bm = bm[0])) if (s[i]) s[i] += bm;
		else s[++i] = bm;
		else {
			s[++i] = null;
			q.push({
				i,
				x: number_default(am, bm)
			});
		}
		bi = reB.lastIndex;
	}
	if (bi < b.length) {
		bs = b.slice(bi);
		if (s[i]) s[i] += bs;
		else s[++i] = bs;
	}
	return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
		for (var i$1 = 0, o; i$1 < b; ++i$1) s[(o = q[i$1]).i] = o.x(t);
		return s.join("");
	});
}

//#endregion
//#region node_modules/d3-interpolate/src/value.js
function value_default(a, b) {
	var t = typeof b, c;
	return b == null || t === "boolean" ? constant_default$1(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object_default : number_default)(a, b);
}

//#endregion
//#region node_modules/d3-interpolate/src/round.js
function round_default(a, b) {
	return a = +a, b = +b, function(t) {
		return Math.round(a * (1 - t) + b * t);
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;
var identity$2 = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function decompose_default(a, b, c, d, e, f) {
	var scaleX, scaleY, skewX;
	if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	return {
		translateX: e,
		translateY: f,
		rotate: Math.atan2(b, a) * degrees,
		skewX: Math.atan(skewX) * degrees,
		scaleX,
		scaleY
	};
}

//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
	const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
	return m.isIdentity ? identity$2 : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
	if (value == null) return identity$2;
	if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	svgNode.setAttribute("transform", value);
	if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
	value = value.matrix;
	return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}

//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
	function pop(s) {
		return s.length ? s.pop() + " " : "";
	}
	function translate(xa, ya, xb, yb, s, q) {
		if (xa !== xb || ya !== yb) {
			var i = s.push("translate(", null, pxComma, null, pxParen);
			q.push({
				i: i - 4,
				x: number_default(xa, xb)
			}, {
				i: i - 2,
				x: number_default(ya, yb)
			});
		} else if (xb || yb) s.push("translate(" + xb + pxComma + yb + pxParen);
	}
	function rotate(a, b, s, q) {
		if (a !== b) {
			if (a - b > 180) b += 360;
			else if (b - a > 180) a += 360;
			q.push({
				i: s.push(pop(s) + "rotate(", null, degParen) - 2,
				x: number_default(a, b)
			});
		} else if (b) s.push(pop(s) + "rotate(" + b + degParen);
	}
	function skewX(a, b, s, q) {
		if (a !== b) q.push({
			i: s.push(pop(s) + "skewX(", null, degParen) - 2,
			x: number_default(a, b)
		});
		else if (b) s.push(pop(s) + "skewX(" + b + degParen);
	}
	function scale(xa, ya, xb, yb, s, q) {
		if (xa !== xb || ya !== yb) {
			var i = s.push(pop(s) + "scale(", null, ",", null, ")");
			q.push({
				i: i - 4,
				x: number_default(xa, xb)
			}, {
				i: i - 2,
				x: number_default(ya, yb)
			});
		} else if (xb !== 1 || yb !== 1) s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	}
	return function(a, b) {
		var s = [], q = [];
		a = parse(a), b = parse(b);
		translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
		rotate(a.rotate, b.rotate, s, q);
		skewX(a.skewX, b.skewX, s, q);
		scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
		a = b = null;
		return function(t) {
			var i = -1, n = q.length, o;
			while (++i < n) s[(o = q[i]).i] = o.x(t);
			return s.join("");
		};
	};
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

//#endregion
//#region node_modules/d3-timer/src/timer.js
var frame = 0, timeout = 0, interval = 0, pokeDelay = 1e3, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
	setTimeout(f, 17);
};
function now() {
	return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
	clockNow = 0;
}
function Timer() {
	this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
	constructor: Timer,
	restart: function(callback, delay, time) {
		if (typeof callback !== "function") throw new TypeError("callback is not a function");
		time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
		if (!this._next && taskTail !== this) {
			if (taskTail) taskTail._next = this;
			else taskHead = this;
			taskTail = this;
		}
		this._call = callback;
		this._time = time;
		sleep();
	},
	stop: function() {
		if (this._call) {
			this._call = null;
			this._time = Infinity;
			sleep();
		}
	}
};
function timer(callback, delay, time) {
	var t = new Timer();
	t.restart(callback, delay, time);
	return t;
}
function timerFlush() {
	now();
	++frame;
	var t = taskHead, e;
	while (t) {
		if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
		t = t._next;
	}
	--frame;
}
function wake() {
	clockNow = (clockLast = clock.now()) + clockSkew;
	frame = timeout = 0;
	try {
		timerFlush();
	} finally {
		frame = 0;
		nap();
		clockNow = 0;
	}
}
function poke() {
	var now$1 = clock.now(), delay = now$1 - clockLast;
	if (delay > pokeDelay) clockSkew -= delay, clockLast = now$1;
}
function nap() {
	var t0, t1 = taskHead, t2, time = Infinity;
	while (t1) if (t1._call) {
		if (time > t1._time) time = t1._time;
		t0 = t1, t1 = t1._next;
	} else {
		t2 = t1._next, t1._next = null;
		t1 = t0 ? t0._next = t2 : taskHead = t2;
	}
	taskTail = t0;
	sleep(time);
}
function sleep(time) {
	if (frame) return;
	if (timeout) timeout = clearTimeout(timeout);
	var delay = time - clockNow;
	if (delay > 24) {
		if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
		if (interval) interval = clearInterval(interval);
	} else {
		if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
		frame = 1, setFrame(wake);
	}
}

//#endregion
//#region node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
	var t = new Timer();
	delay = delay == null ? 0 : +delay;
	t.restart((elapsed) => {
		t.stop();
		callback(elapsed + delay);
	}, delay, time);
	return t;
}

//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default$1("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node, name, id$1, index, group, timing) {
	var schedules = node.__transition;
	if (!schedules) node.__transition = {};
	else if (id$1 in schedules) return;
	create(node, id$1, {
		name,
		index,
		group,
		on: emptyOn,
		tween: emptyTween,
		time: timing.time,
		delay: timing.delay,
		duration: timing.duration,
		ease: timing.ease,
		timer: null,
		state: CREATED
	});
}
function init(node, id$1) {
	var schedule = get(node, id$1);
	if (schedule.state > CREATED) throw new Error("too late; already scheduled");
	return schedule;
}
function set(node, id$1) {
	var schedule = get(node, id$1);
	if (schedule.state > STARTED) throw new Error("too late; already running");
	return schedule;
}
function get(node, id$1) {
	var schedule = node.__transition;
	if (!schedule || !(schedule = schedule[id$1])) throw new Error("transition not found");
	return schedule;
}
function create(node, id$1, self) {
	var schedules = node.__transition, tween;
	schedules[id$1] = self;
	self.timer = timer(schedule, 0, self.time);
	function schedule(elapsed) {
		self.state = SCHEDULED;
		self.timer.restart(start$1, self.delay, self.time);
		if (self.delay <= elapsed) start$1(elapsed - self.delay);
	}
	function start$1(elapsed) {
		var i, j, n, o;
		if (self.state !== SCHEDULED) return stop();
		for (i in schedules) {
			o = schedules[i];
			if (o.name !== self.name) continue;
			if (o.state === STARTED) return timeout_default(start$1);
			if (o.state === RUNNING) {
				o.state = ENDED;
				o.timer.stop();
				o.on.call("interrupt", node, node.__data__, o.index, o.group);
				delete schedules[i];
			} else if (+i < id$1) {
				o.state = ENDED;
				o.timer.stop();
				o.on.call("cancel", node, node.__data__, o.index, o.group);
				delete schedules[i];
			}
		}
		timeout_default(function() {
			if (self.state === STARTED) {
				self.state = RUNNING;
				self.timer.restart(tick, self.delay, self.time);
				tick(elapsed);
			}
		});
		self.state = STARTING;
		self.on.call("start", node, node.__data__, self.index, self.group);
		if (self.state !== STARTING) return;
		self.state = STARTED;
		tween = new Array(n = self.tween.length);
		for (i = 0, j = -1; i < n; ++i) if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) tween[++j] = o;
		tween.length = j + 1;
	}
	function tick(elapsed) {
		var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
		while (++i < n) tween[i].call(node, t);
		if (self.state === ENDING) {
			self.on.call("end", node, node.__data__, self.index, self.group);
			stop();
		}
	}
	function stop() {
		self.state = ENDED;
		self.timer.stop();
		delete schedules[id$1];
		for (var i in schedules) return;
		delete node.__transition;
	}
}

//#endregion
//#region node_modules/d3-transition/src/interrupt.js
function interrupt_default$1(node, name) {
	var schedules = node.__transition, schedule, active, empty$1 = true, i;
	if (!schedules) return;
	name = name == null ? null : name + "";
	for (i in schedules) {
		if ((schedule = schedules[i]).name !== name) {
			empty$1 = false;
			continue;
		}
		active = schedule.state > STARTING && schedule.state < ENDING;
		schedule.state = ENDED;
		schedule.timer.stop();
		schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
		delete schedules[i];
	}
	if (empty$1) delete node.__transition;
}

//#endregion
//#region node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default(name) {
	return this.each(function() {
		interrupt_default$1(this, name);
	});
}

//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id$1, name) {
	var tween0, tween1;
	return function() {
		var schedule = set(this, id$1), tween = schedule.tween;
		if (tween !== tween0) {
			tween1 = tween0 = tween;
			for (var i = 0, n = tween1.length; i < n; ++i) if (tween1[i].name === name) {
				tween1 = tween1.slice();
				tween1.splice(i, 1);
				break;
			}
		}
		schedule.tween = tween1;
	};
}
function tweenFunction(id$1, name, value) {
	var tween0, tween1;
	if (typeof value !== "function") throw new Error();
	return function() {
		var schedule = set(this, id$1), tween = schedule.tween;
		if (tween !== tween0) {
			tween1 = (tween0 = tween).slice();
			for (var t = {
				name,
				value
			}, i = 0, n = tween1.length; i < n; ++i) if (tween1[i].name === name) {
				tween1[i] = t;
				break;
			}
			if (i === n) tween1.push(t);
		}
		schedule.tween = tween1;
	};
}
function tween_default(name, value) {
	var id$1 = this._id;
	name += "";
	if (arguments.length < 2) {
		var tween = get(this.node(), id$1).tween;
		for (var i = 0, n = tween.length, t; i < n; ++i) if ((t = tween[i]).name === name) return t.value;
		return null;
	}
	return this.each((value == null ? tweenRemove : tweenFunction)(id$1, name, value));
}
function tweenValue(transition$1, name, value) {
	var id$1 = transition$1._id;
	transition$1.each(function() {
		var schedule = set(this, id$1);
		(schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	});
	return function(node) {
		return get(node, id$1).value[name];
	};
}

//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
	var c;
	return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}

//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function attrRemove(name) {
	return function() {
		this.removeAttribute(name);
	};
}
function attrRemoveNS(fullname) {
	return function() {
		this.removeAttributeNS(fullname.space, fullname.local);
	};
}
function attrConstant(name, interpolate, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = this.getAttribute(name);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	};
}
function attrConstantNS(fullname, interpolate, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = this.getAttributeNS(fullname.space, fullname.local);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	};
}
function attrFunction(name, interpolate, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0, value1 = value(this), string1;
		if (value1 == null) return void this.removeAttribute(name);
		string0 = this.getAttribute(name);
		string1 = value1 + "";
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	};
}
function attrFunctionNS(fullname, interpolate, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0, value1 = value(this), string1;
		if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
		string0 = this.getAttributeNS(fullname.space, fullname.local);
		string1 = value1 + "";
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	};
}
function attr_default(name, value) {
	var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
	return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
	return function(t) {
		this.setAttribute(name, i.call(this, t));
	};
}
function attrInterpolateNS(fullname, i) {
	return function(t) {
		this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
	};
}
function attrTweenNS(fullname, value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function attrTween(name, value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function attrTween_default(name, value) {
	var key = "attr." + name;
	if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	var fullname = namespace_default(name);
	return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function delayFunction(id$1, value) {
	return function() {
		init(this, id$1).delay = +value.apply(this, arguments);
	};
}
function delayConstant(id$1, value) {
	return value = +value, function() {
		init(this, id$1).delay = value;
	};
}
function delay_default(value) {
	var id$1 = this._id;
	return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id$1, value)) : get(this.node(), id$1).delay;
}

//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function durationFunction(id$1, value) {
	return function() {
		set(this, id$1).duration = +value.apply(this, arguments);
	};
}
function durationConstant(id$1, value) {
	return value = +value, function() {
		set(this, id$1).duration = value;
	};
}
function duration_default(value) {
	var id$1 = this._id;
	return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id$1, value)) : get(this.node(), id$1).duration;
}

//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function easeConstant(id$1, value) {
	if (typeof value !== "function") throw new Error();
	return function() {
		set(this, id$1).ease = value;
	};
}
function ease_default(value) {
	var id$1 = this._id;
	return arguments.length ? this.each(easeConstant(id$1, value)) : get(this.node(), id$1).ease;
}

//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id$1, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (typeof v !== "function") throw new Error();
		set(this, id$1).ease = v;
	};
}
function easeVarying_default(value) {
	if (typeof value !== "function") throw new Error();
	return this.each(easeVarying(this._id, value));
}

//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function filter_default(match) {
	if (typeof match !== "function") match = matcher_default(match);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
	return new Transition(subgroups, this._parents, this._name, this._id);
}

//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function merge_default(transition$1) {
	if (transition$1._id !== this._id) throw new Error();
	for (var groups0 = this._groups, groups1 = transition$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group0[i] || group1[i]) merge[i] = node;
	for (; j < m0; ++j) merges[j] = groups0[j];
	return new Transition(merges, this._parents, this._name, this._id);
}

//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function start(name) {
	return (name + "").trim().split(/^|\s+/).every(function(t) {
		var i = t.indexOf(".");
		if (i >= 0) t = t.slice(0, i);
		return !t || t === "start";
	});
}
function onFunction(id$1, name, listener) {
	var on0, on1, sit = start(name) ? init : set;
	return function() {
		var schedule = sit(this, id$1), on = schedule.on;
		if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
		schedule.on = on1;
	};
}
function on_default(name, listener) {
	var id$1 = this._id;
	return arguments.length < 2 ? get(this.node(), id$1).on.on(name) : this.each(onFunction(id$1, name, listener));
}

//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function removeFunction(id$1) {
	return function() {
		var parent = this.parentNode;
		for (var i in this.__transition) if (+i !== id$1) return;
		if (parent) parent.removeChild(this);
	};
}
function remove_default() {
	return this.on("end.remove", removeFunction(this._id));
}

//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function select_default(select) {
	var name = this._name, id$1 = this._id;
	if (typeof select !== "function") select = selector_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
		if ("__data__" in node) subnode.__data__ = node.__data__;
		subgroup[i] = subnode;
		schedule_default(subgroup[i], name, id$1, i, subgroup, get(node, id$1));
	}
	return new Transition(subgroups, this._parents, name, id$1);
}

//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default(select) {
	var name = this._name, id$1 = this._id;
	if (typeof select !== "function") select = selectorAll_default(select);
	for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		for (var children$1 = select.call(node, node.__data__, i, group), child, inherit$1 = get(node, id$1), k = 0, l = children$1.length; k < l; ++k) if (child = children$1[k]) schedule_default(child, name, id$1, k, children$1, inherit$1);
		subgroups.push(children$1);
		parents.push(node);
	}
	return new Transition(subgroups, parents, name, id$1);
}

//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Selection = selection_default$1.prototype.constructor;
function selection_default() {
	return new Selection(this._groups, this._parents);
}

//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
	var string00, string10, interpolate0;
	return function() {
		var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
	};
}
function styleRemove(name) {
	return function() {
		this.style.removeProperty(name);
	};
}
function styleConstant(name, interpolate, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = styleValue(this, name);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	};
}
function styleFunction(name, interpolate, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
		if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	};
}
function styleMaybeRemove(id$1, name) {
	var on0, on1, listener0, key = "style." + name, event = "end." + key, remove$1;
	return function() {
		var schedule = set(this, id$1), on = schedule.on, listener = schedule.value[key] == null ? remove$1 || (remove$1 = styleRemove(name)) : void 0;
		if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
		schedule.on = on1;
	};
}
function style_default(name, value, priority) {
	var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
	return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}

//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
	return function(t) {
		this.style.setProperty(name, i.call(this, t), priority);
	};
}
function styleTween(name, value, priority) {
	var t, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
		return t;
	}
	tween._value = value;
	return tween;
}
function styleTween_default(name, value, priority) {
	var key = "style." + (name += "");
	if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function textConstant(value) {
	return function() {
		this.textContent = value;
	};
}
function textFunction(value) {
	return function() {
		var value1 = value(this);
		this.textContent = value1 == null ? "" : value1;
	};
}
function text_default(value) {
	return this.tween("text", typeof value === "function" ? textFunction(tweenValue(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}

//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
	return function(t) {
		this.textContent = i.call(this, t);
	};
}
function textTween(value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function textTween_default(value) {
	var key = "text";
	if (arguments.length < 1) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	return this.tween(key, textTween(value));
}

//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function transition_default$1() {
	var name = this._name, id0 = this._id, id1 = newId();
	for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		var inherit$1 = get(node, id0);
		schedule_default(node, name, id1, i, group, {
			time: inherit$1.time + inherit$1.delay + inherit$1.duration,
			delay: 0,
			duration: inherit$1.duration,
			ease: inherit$1.ease
		});
	}
	return new Transition(groups, this._parents, name, id1);
}

//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function end_default() {
	var on0, on1, that = this, id$1 = that._id, size = that.size();
	return new Promise(function(resolve, reject) {
		var cancel = { value: reject }, end = { value: function() {
			if (--size === 0) resolve();
		} };
		that.each(function() {
			var schedule = set(this, id$1), on = schedule.on;
			if (on !== on0) {
				on1 = (on0 = on).copy();
				on1._.cancel.push(cancel);
				on1._.interrupt.push(cancel);
				on1._.end.push(end);
			}
			schedule.on = on1;
		});
		if (size === 0) resolve();
	});
}

//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id$1) {
	this._groups = groups;
	this._parents = parents;
	this._name = name;
	this._id = id$1;
}
function transition(name) {
	return selection_default$1().transition(name);
}
function newId() {
	return ++id;
}
var selection_prototype = selection_default$1.prototype;
Transition.prototype = transition.prototype = {
	constructor: Transition,
	select: select_default,
	selectAll: selectAll_default,
	selectChild: selection_prototype.selectChild,
	selectChildren: selection_prototype.selectChildren,
	filter: filter_default,
	merge: merge_default,
	selection: selection_default,
	transition: transition_default$1,
	call: selection_prototype.call,
	nodes: selection_prototype.nodes,
	node: selection_prototype.node,
	size: selection_prototype.size,
	empty: selection_prototype.empty,
	each: selection_prototype.each,
	on: on_default,
	attr: attr_default,
	attrTween: attrTween_default,
	style: style_default,
	styleTween: styleTween_default,
	text: text_default,
	textTween: textTween_default,
	remove: remove_default,
	tween: tween_default,
	delay: delay_default,
	duration: duration_default,
	ease: ease_default,
	easeVarying: easeVarying_default,
	end: end_default,
	[Symbol.iterator]: selection_prototype[Symbol.iterator]
};

//#endregion
//#region node_modules/d3-ease/src/linear.js
const linear$1 = (t) => +t;

//#endregion
//#region node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
	return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
	time: null,
	delay: 0,
	duration: 250,
	ease: cubicInOut
};
function inherit(node, id$1) {
	var timing;
	while (!(timing = node.__transition) || !(timing = timing[id$1])) if (!(node = node.parentNode)) throw new Error(`transition ${id$1} not found`);
	return timing;
}
function transition_default(name) {
	var id$1, timing;
	if (name instanceof Transition) id$1 = name._id, name = name._name;
	else id$1 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) schedule_default(node, name, id$1, i, group, timing || inherit(node, id$1));
	return new Transition(groups, this._parents, name, id$1);
}

//#endregion
//#region node_modules/d3-transition/src/selection/index.js
selection_default$1.prototype.interrupt = interrupt_default;
selection_default$1.prototype.transition = transition_default;

//#endregion
//#region node_modules/d3-brush/src/brush.js
const { abs, max, min } = Math;
function number1(e) {
	return [+e[0], +e[1]];
}
function number2(e) {
	return [number1(e[0]), number1(e[1])];
}
var X = {
	name: "x",
	handles: ["w", "e"].map(type),
	input: function(x$1, e) {
		return x$1 == null ? null : [[+x$1[0], e[0][1]], [+x$1[1], e[1][1]]];
	},
	output: function(xy) {
		return xy && [xy[0][0], xy[1][0]];
	}
};
var Y = {
	name: "y",
	handles: ["n", "s"].map(type),
	input: function(y$1, e) {
		return y$1 == null ? null : [[e[0][0], +y$1[0]], [e[1][0], +y$1[1]]];
	},
	output: function(xy) {
		return xy && [xy[0][1], xy[1][1]];
	}
};
var XY = {
	name: "xy",
	handles: [
		"n",
		"w",
		"e",
		"s",
		"nw",
		"ne",
		"sw",
		"se"
	].map(type),
	input: function(xy) {
		return xy == null ? null : number2(xy);
	},
	output: function(xy) {
		return xy;
	}
};
function type(t) {
	return { type: t };
}

//#endregion
//#region node_modules/d3-path/src/path.js
const pi = Math.PI, tau = 2 * pi, epsilon = 1e-6, tauEpsilon = tau - epsilon;
function append(strings) {
	this._ += strings[0];
	for (let i = 1, n = strings.length; i < n; ++i) this._ += arguments[i] + strings[i];
}
function appendRound(digits) {
	let d = Math.floor(digits);
	if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
	if (d > 15) return append;
	const k = 10 ** d;
	return function(strings) {
		this._ += strings[0];
		for (let i = 1, n = strings.length; i < n; ++i) this._ += Math.round(arguments[i] * k) / k + strings[i];
	};
}
var Path = class {
	constructor(digits) {
		this._x0 = this._y0 = this._x1 = this._y1 = null;
		this._ = "";
		this._append = digits == null ? append : appendRound(digits);
	}
	moveTo(x$1, y$1) {
		this._append`M${this._x0 = this._x1 = +x$1},${this._y0 = this._y1 = +y$1}`;
	}
	closePath() {
		if (this._x1 !== null) {
			this._x1 = this._x0, this._y1 = this._y0;
			this._append`Z`;
		}
	}
	lineTo(x$1, y$1) {
		this._append`L${this._x1 = +x$1},${this._y1 = +y$1}`;
	}
	quadraticCurveTo(x1, y1, x$1, y$1) {
		this._append`Q${+x1},${+y1},${this._x1 = +x$1},${this._y1 = +y$1}`;
	}
	bezierCurveTo(x1, y1, x2, y2, x$1, y$1) {
		this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x$1},${this._y1 = +y$1}`;
	}
	arcTo(x1, y1, x2, y2, r) {
		x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
		if (r < 0) throw new Error(`negative radius: ${r}`);
		let x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
		if (this._x1 === null) this._append`M${this._x1 = x1},${this._y1 = y1}`;
		else if (!(l01_2 > epsilon));
		else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) this._append`L${this._x1 = x1},${this._y1 = y1}`;
		else {
			let x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
			if (Math.abs(t01 - 1) > epsilon) this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
			this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
		}
	}
	arc(x$1, y$1, r, a0, a1, ccw) {
		x$1 = +x$1, y$1 = +y$1, r = +r, ccw = !!ccw;
		if (r < 0) throw new Error(`negative radius: ${r}`);
		let dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x$1 + dx, y0 = y$1 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
		if (this._x1 === null) this._append`M${x0},${y0}`;
		else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) this._append`L${x0},${y0}`;
		if (!r) return;
		if (da < 0) da = da % tau + tau;
		if (da > tauEpsilon) this._append`A${r},${r},0,1,${cw},${x$1 - dx},${y$1 - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
		else if (da > epsilon) this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x$1 + r * Math.cos(a1)},${this._y1 = y$1 + r * Math.sin(a1)}`;
	}
	rect(x$1, y$1, w, h) {
		this._append`M${this._x0 = this._x1 = +x$1},${this._y0 = this._y1 = +y$1}h${w = +w}v${+h}h${-w}Z`;
	}
	toString() {
		return this._;
	}
};
function path() {
	return new Path();
}
path.prototype = Path.prototype;

//#endregion
//#region node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default(x$1) {
	return Math.abs(x$1 = Math.round(x$1)) >= 1e21 ? x$1.toLocaleString("en").replace(/,/g, "") : x$1.toString(10);
}
function formatDecimalParts(x$1, p) {
	if ((i = (x$1 = p ? x$1.toExponential(p - 1) : x$1.toExponential()).indexOf("e")) < 0) return null;
	var i, coefficient = x$1.slice(0, i);
	return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x$1.slice(i + 1)];
}

//#endregion
//#region node_modules/d3-format/src/exponent.js
function exponent_default(x$1) {
	return x$1 = formatDecimalParts(Math.abs(x$1)), x$1 ? x$1[1] : NaN;
}

//#endregion
//#region node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
	return function(value, width) {
		var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
		while (i > 0 && g > 0) {
			if (length + g + 1 > width) g = Math.max(1, width - length);
			t.push(value.substring(i -= g, i + g));
			if ((length += g + 1) > width) break;
			g = grouping[j = (j + 1) % grouping.length];
		}
		return t.reverse().join(thousands);
	};
}

//#endregion
//#region node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
	return function(value) {
		return value.replace(/[0-9]/g, function(i) {
			return numerals[+i];
		});
	};
}

//#endregion
//#region node_modules/d3-format/src/formatSpecifier.js
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
	if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
	var match;
	return new FormatSpecifier({
		fill: match[1],
		align: match[2],
		sign: match[3],
		symbol: match[4],
		zero: match[5],
		width: match[6],
		comma: match[7],
		precision: match[8] && match[8].slice(1),
		trim: match[9],
		type: match[10]
	});
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
	this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
	this.align = specifier.align === void 0 ? ">" : specifier.align + "";
	this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
	this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
	this.zero = !!specifier.zero;
	this.width = specifier.width === void 0 ? void 0 : +specifier.width;
	this.comma = !!specifier.comma;
	this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
	this.trim = !!specifier.trim;
	this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
	return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

//#endregion
//#region node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s) {
	out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) switch (s[i]) {
		case ".":
			i0 = i1 = i;
			break;
		case "0":
			if (i0 === 0) i0 = i;
			i1 = i;
			break;
		default:
			if (!+s[i]) break out;
			if (i0 > 0) i0 = 0;
			break;
	}
	return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

//#endregion
//#region node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x$1, p) {
	var d = formatDecimalParts(x$1, p);
	if (!d) return x$1 + "";
	var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
	return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x$1, Math.max(0, p + i - 1))[0];
}

//#endregion
//#region node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x$1, p) {
	var d = formatDecimalParts(x$1, p);
	if (!d) return x$1 + "";
	var coefficient = d[0], exponent = d[1];
	return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

//#endregion
//#region node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
	"%": (x$1, p) => (x$1 * 100).toFixed(p),
	"b": (x$1) => Math.round(x$1).toString(2),
	"c": (x$1) => x$1 + "",
	"d": formatDecimal_default,
	"e": (x$1, p) => x$1.toExponential(p),
	"f": (x$1, p) => x$1.toFixed(p),
	"g": (x$1, p) => x$1.toPrecision(p),
	"o": (x$1) => Math.round(x$1).toString(8),
	"p": (x$1, p) => formatRounded_default(x$1 * 100, p),
	"r": formatRounded_default,
	"s": formatPrefixAuto_default,
	"X": (x$1) => Math.round(x$1).toString(16).toUpperCase(),
	"x": (x$1) => Math.round(x$1).toString(16)
};

//#endregion
//#region node_modules/d3-format/src/identity.js
function identity_default(x$1) {
	return x$1;
}

//#endregion
//#region node_modules/d3-format/src/locale.js
var map = Array.prototype.map, prefixes = [
	"y",
	"z",
	"a",
	"f",
	"p",
	"n",
	"µ",
	"m",
	"",
	"k",
	"M",
	"G",
	"T",
	"P",
	"E",
	"Z",
	"Y"
];
function locale_default(locale$1) {
	var group = locale$1.grouping === void 0 || locale$1.thousands === void 0 ? identity_default : formatGroup_default(map.call(locale$1.grouping, Number), locale$1.thousands + ""), currencyPrefix = locale$1.currency === void 0 ? "" : locale$1.currency[0] + "", currencySuffix = locale$1.currency === void 0 ? "" : locale$1.currency[1] + "", decimal = locale$1.decimal === void 0 ? "." : locale$1.decimal + "", numerals = locale$1.numerals === void 0 ? identity_default : formatNumerals_default(map.call(locale$1.numerals, String)), percent = locale$1.percent === void 0 ? "%" : locale$1.percent + "", minus = locale$1.minus === void 0 ? "−" : locale$1.minus + "", nan = locale$1.nan === void 0 ? "NaN" : locale$1.nan + "";
	function newFormat(specifier) {
		specifier = formatSpecifier(specifier);
		var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero$2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type$1 = specifier.type;
		if (type$1 === "n") comma = true, type$1 = "g";
		else if (!formatTypes_default[type$1]) precision === void 0 && (precision = 12), trim = true, type$1 = "g";
		if (zero$2 || fill === "0" && align === "=") zero$2 = true, fill = "0", align = "=";
		var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type$1) ? "0" + type$1.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type$1) ? percent : "";
		var formatType = formatTypes_default[type$1], maybeSuffix = /[defgprs%]/.test(type$1);
		precision = precision === void 0 ? 6 : /[gprs]/.test(type$1) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
		function format$1(value) {
			var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
			if (type$1 === "c") {
				valueSuffix = formatType(value) + valueSuffix;
				value = "";
			} else {
				value = +value;
				var valueNegative = value < 0 || 1 / value < 0;
				value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
				if (trim) value = formatTrim_default(value);
				if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;
				valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
				valueSuffix = (type$1 === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
				if (maybeSuffix) {
					i = -1, n = value.length;
					while (++i < n) if (c = value.charCodeAt(i), 48 > c || c > 57) {
						valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
						value = value.slice(0, i);
						break;
					}
				}
			}
			if (comma && !zero$2) value = group(value, Infinity);
			var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
			if (comma && zero$2) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
			switch (align) {
				case "<":
					value = valuePrefix + value + valueSuffix + padding;
					break;
				case "=":
					value = valuePrefix + padding + value + valueSuffix;
					break;
				case "^":
					value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
					break;
				default:
					value = padding + valuePrefix + value + valueSuffix;
					break;
			}
			return numerals(value);
		}
		format$1.toString = function() {
			return specifier + "";
		};
		return format$1;
	}
	function formatPrefix$1(specifier, value) {
		var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
		return function(value$1) {
			return f(k * value$1) + prefix;
		};
	}
	return {
		format: newFormat,
		formatPrefix: formatPrefix$1
	};
}

//#endregion
//#region node_modules/d3-format/src/defaultLocale.js
var locale;
var format;
var formatPrefix;
defaultLocale({
	thousands: ",",
	grouping: [3],
	currency: ["$", ""]
});
function defaultLocale(definition) {
	locale = locale_default(definition);
	format = locale.format;
	formatPrefix = locale.formatPrefix;
	return locale;
}

//#endregion
//#region node_modules/d3-format/src/precisionFixed.js
function precisionFixed_default(step) {
	return Math.max(0, -exponent_default(Math.abs(step)));
}

//#endregion
//#region node_modules/d3-format/src/precisionPrefix.js
function precisionPrefix_default(step, value) {
	return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3 - exponent_default(Math.abs(step)));
}

//#endregion
//#region node_modules/d3-format/src/precisionRound.js
function precisionRound_default(step, max$1) {
	step = Math.abs(step), max$1 = Math.abs(max$1) - step;
	return Math.max(0, exponent_default(max$1) - exponent_default(step)) + 1;
}

//#endregion
//#region node_modules/d3-random/src/defaultSource.js
var defaultSource_default = Math.random;

//#endregion
//#region node_modules/d3-random/src/normal.js
var normal_default = function sourceRandomNormal(source) {
	function randomNormal(mu, sigma) {
		var x$1, r;
		mu = mu == null ? 0 : +mu;
		sigma = sigma == null ? 1 : +sigma;
		return function() {
			var y$1;
			if (x$1 != null) y$1 = x$1, x$1 = null;
			else do {
				x$1 = source() * 2 - 1;
				y$1 = source() * 2 - 1;
				r = x$1 * x$1 + y$1 * y$1;
			} while (!r || r > 1);
			return mu + sigma * y$1 * Math.sqrt(-2 * Math.log(r) / r);
		};
	}
	randomNormal.source = sourceRandomNormal;
	return randomNormal;
}(defaultSource_default);

//#endregion
//#region node_modules/d3-random/src/bernoulli.js
var bernoulli_default = function sourceRandomBernoulli(source) {
	function randomBernoulli(p) {
		if ((p = +p) < 0 || p > 1) throw new RangeError("invalid p");
		return function() {
			return Math.floor(source() + p);
		};
	}
	randomBernoulli.source = sourceRandomBernoulli;
	return randomBernoulli;
}(defaultSource_default);

//#endregion
//#region node_modules/d3-random/src/geometric.js
var geometric_default = function sourceRandomGeometric(source) {
	function randomGeometric(p) {
		if ((p = +p) < 0 || p > 1) throw new RangeError("invalid p");
		if (p === 0) return () => Infinity;
		if (p === 1) return () => 1;
		p = Math.log1p(-p);
		return function() {
			return 1 + Math.floor(Math.log1p(-source()) / p);
		};
	}
	randomGeometric.source = sourceRandomGeometric;
	return randomGeometric;
}(defaultSource_default);

//#endregion
//#region node_modules/d3-random/src/gamma.js
var gamma_default = function sourceRandomGamma(source) {
	var randomNormal = normal_default.source(source)();
	function randomGamma(k, theta) {
		if ((k = +k) < 0) throw new RangeError("invalid k");
		if (k === 0) return () => 0;
		theta = theta == null ? 1 : +theta;
		if (k === 1) return () => -Math.log1p(-source()) * theta;
		var d = (k < 1 ? k + 1 : k) - 1 / 3, c = 1 / (3 * Math.sqrt(d)), multiplier = k < 1 ? () => Math.pow(source(), 1 / k) : () => 1;
		return function() {
			do {
				do
					var x$1 = randomNormal(), v = 1 + c * x$1;
				while (v <= 0);
				v *= v * v;
				var u = 1 - source();
			} while (u >= 1 - .0331 * x$1 * x$1 * x$1 * x$1 && Math.log(u) >= .5 * x$1 * x$1 + d * (1 - v + Math.log(v)));
			return d * v * multiplier() * theta;
		};
	}
	randomGamma.source = sourceRandomGamma;
	return randomGamma;
}(defaultSource_default);

//#endregion
//#region node_modules/d3-random/src/beta.js
var beta_default = function sourceRandomBeta(source) {
	var G = gamma_default.source(source);
	function randomBeta(alpha, beta) {
		var X$1 = G(alpha), Y$1 = G(beta);
		return function() {
			var x$1 = X$1();
			return x$1 === 0 ? 0 : x$1 / (x$1 + Y$1());
		};
	}
	randomBeta.source = sourceRandomBeta;
	return randomBeta;
}(defaultSource_default);

//#endregion
//#region node_modules/d3-random/src/binomial.js
var binomial_default = function sourceRandomBinomial(source) {
	var G = geometric_default.source(source), B = beta_default.source(source);
	function randomBinomial(n, p) {
		n = +n;
		if ((p = +p) >= 1) return () => n;
		if (p <= 0) return () => 0;
		return function() {
			var acc = 0, nn = n, pp = p;
			while (nn * pp > 16 && nn * (1 - pp) > 16) {
				var i = Math.floor((nn + 1) * pp), y$1 = B(i, nn - i + 1)();
				if (y$1 <= pp) {
					acc += i;
					nn -= i;
					pp = (pp - y$1) / (1 - y$1);
				} else {
					nn = i - 1;
					pp /= y$1;
				}
			}
			var sign = pp < .5, pFinal = sign ? pp : 1 - pp, g = G(pFinal);
			for (var s = g(), k = 0; s <= nn; ++k) s += g();
			return acc + (sign ? k : nn - k);
		};
	}
	randomBinomial.source = sourceRandomBinomial;
	return randomBinomial;
}(defaultSource_default);

//#endregion
//#region node_modules/d3-scale/src/init.js
function initRange(domain, range) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(domain);
			break;
		default:
			this.range(range).domain(domain);
			break;
	}
	return this;
}

//#endregion
//#region node_modules/d3-scale/src/constant.js
function constants(x$1) {
	return function() {
		return x$1;
	};
}

//#endregion
//#region node_modules/d3-scale/src/number.js
function number(x$1) {
	return +x$1;
}

//#endregion
//#region node_modules/d3-scale/src/continuous.js
var unit = [0, 1];
function identity$1(x$1) {
	return x$1;
}
function normalize(a, b) {
	return (b -= a = +a) ? function(x$1) {
		return (x$1 - a) / b;
	} : constants(isNaN(b) ? NaN : .5);
}
function clamper(a, b) {
	var t;
	if (a > b) t = a, a = b, b = t;
	return function(x$1) {
		return Math.max(a, Math.min(b, x$1));
	};
}
function bimap(domain, range, interpolate) {
	var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
	if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
	else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
	return function(x$1) {
		return r0(d0(x$1));
	};
}
function polymap(domain, range, interpolate) {
	var j = Math.min(domain.length, range.length) - 1, d = new Array(j), r = new Array(j), i = -1;
	if (domain[j] < domain[0]) {
		domain = domain.slice().reverse();
		range = range.slice().reverse();
	}
	while (++i < j) {
		d[i] = normalize(domain[i], domain[i + 1]);
		r[i] = interpolate(range[i], range[i + 1]);
	}
	return function(x$1) {
		var i$1 = bisect_default(domain, x$1, 1, j) - 1;
		return r[i$1](d[i$1](x$1));
	};
}
function copy(source, target) {
	return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
	var domain = unit, range = unit, interpolate = value_default, transform$1, untransform, unknown, clamp = identity$1, piecewise, output, input;
	function rescale() {
		var n = Math.min(domain.length, range.length);
		if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
		piecewise = n > 2 ? polymap : bimap;
		output = input = null;
		return scale;
	}
	function scale(x$1) {
		return x$1 == null || isNaN(x$1 = +x$1) ? unknown : (output || (output = piecewise(domain.map(transform$1), range, interpolate)))(transform$1(clamp(x$1)));
	}
	scale.invert = function(y$1) {
		return clamp(untransform((input || (input = piecewise(range, domain.map(transform$1), number_default)))(y$1)));
	};
	scale.domain = function(_) {
		return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
	};
	scale.range = function(_) {
		return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
	};
	scale.rangeRound = function(_) {
		return range = Array.from(_), interpolate = round_default, rescale();
	};
	scale.clamp = function(_) {
		return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
	};
	scale.interpolate = function(_) {
		return arguments.length ? (interpolate = _, rescale()) : interpolate;
	};
	scale.unknown = function(_) {
		return arguments.length ? (unknown = _, scale) : unknown;
	};
	return function(t, u) {
		transform$1 = t, untransform = u;
		return rescale();
	};
}
function continuous() {
	return transformer()(identity$1, identity$1);
}

//#endregion
//#region node_modules/d3-scale/src/tickFormat.js
function tickFormat(start$1, stop, count, specifier) {
	var step = tickStep(start$1, stop, count), precision;
	specifier = formatSpecifier(specifier == null ? ",f" : specifier);
	switch (specifier.type) {
		case "s": {
			var value = Math.max(Math.abs(start$1), Math.abs(stop));
			if (specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value))) specifier.precision = precision;
			return formatPrefix(specifier, value);
		}
		case "":
		case "e":
		case "g":
		case "p":
		case "r": {
			if (specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start$1), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
			break;
		}
		case "f":
		case "%": {
			if (specifier.precision == null && !isNaN(precision = precisionFixed_default(step))) specifier.precision = precision - (specifier.type === "%") * 2;
			break;
		}
	}
	return format(specifier);
}

//#endregion
//#region node_modules/d3-scale/src/linear.js
function linearish(scale) {
	var domain = scale.domain;
	scale.ticks = function(count) {
		var d = domain();
		return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	};
	scale.tickFormat = function(count, specifier) {
		var d = domain();
		return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
	};
	scale.nice = function(count) {
		if (count == null) count = 10;
		var d = domain();
		var i0 = 0;
		var i1 = d.length - 1;
		var start$1 = d[i0];
		var stop = d[i1];
		var prestep;
		var step;
		var maxIter = 10;
		if (stop < start$1) {
			step = start$1, start$1 = stop, stop = step;
			step = i0, i0 = i1, i1 = step;
		}
		while (maxIter-- > 0) {
			step = tickIncrement(start$1, stop, count);
			if (step === prestep) {
				d[i0] = start$1;
				d[i1] = stop;
				return domain(d);
			} else if (step > 0) {
				start$1 = Math.floor(start$1 / step) * step;
				stop = Math.ceil(stop / step) * step;
			} else if (step < 0) {
				start$1 = Math.ceil(start$1 * step) / step;
				stop = Math.floor(stop * step) / step;
			} else break;
			prestep = step;
		}
		return scale;
	};
	return scale;
}
function linear() {
	var scale = continuous();
	scale.copy = function() {
		return copy(scale, linear());
	};
	initRange.apply(scale, arguments);
	return linearish(scale);
}

//#endregion
//#region node_modules/d3-shape/src/constant.js
function constant_default(x$1) {
	return function constant() {
		return x$1;
	};
}

//#endregion
//#region node_modules/d3-shape/src/path.js
function withPath(shape) {
	let digits = 3;
	shape.digits = function(_) {
		if (!arguments.length) return digits;
		if (_ == null) digits = null;
		else {
			const d = Math.floor(_);
			if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
			digits = d;
		}
		return shape;
	};
	return () => new Path(digits);
}

//#endregion
//#region node_modules/d3-shape/src/array.js
var slice = Array.prototype.slice;
function array_default(x$1) {
	return typeof x$1 === "object" && "length" in x$1 ? x$1 : Array.from(x$1);
}

//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function Linear(context) {
	this._context = context;
}
Linear.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
		this._line = 1 - this._line;
	},
	point: function(x$1, y$1) {
		x$1 = +x$1, y$1 = +y$1;
		switch (this._point) {
			case 0:
				this._point = 1;
				this._line ? this._context.lineTo(x$1, y$1) : this._context.moveTo(x$1, y$1);
				break;
			case 1: this._point = 2;
			default:
				this._context.lineTo(x$1, y$1);
				break;
		}
	}
};
function linear_default(context) {
	return new Linear(context);
}

//#endregion
//#region node_modules/d3-shape/src/point.js
function x(p) {
	return p[0];
}
function y(p) {
	return p[1];
}

//#endregion
//#region node_modules/d3-shape/src/line.js
function line_default(x$1, y$1) {
	var defined = constant_default(true), context = null, curve = linear_default, output = null, path$1 = withPath(line);
	x$1 = typeof x$1 === "function" ? x$1 : x$1 === void 0 ? x : constant_default(x$1);
	y$1 = typeof y$1 === "function" ? y$1 : y$1 === void 0 ? y : constant_default(y$1);
	function line(data) {
		var i, n = (data = array_default(data)).length, d, defined0 = false, buffer;
		if (context == null) output = curve(buffer = path$1());
		for (i = 0; i <= n; ++i) {
			if (!(i < n && defined(d = data[i], i, data)) === defined0) if (defined0 = !defined0) output.lineStart();
			else output.lineEnd();
			if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
		}
		if (buffer) return output = null, buffer + "" || null;
	}
	line.x = function(_) {
		return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant_default(+_), line) : x$1;
	};
	line.y = function(_) {
		return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant_default(+_), line) : y$1;
	};
	line.defined = function(_) {
		return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default(!!_), line) : defined;
	};
	line.curve = function(_) {
		return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	};
	line.context = function(_) {
		return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	};
	return line;
}

//#endregion
//#region node_modules/d3-zoom/src/transform.js
function Transform(k, x$1, y$1) {
	this.k = k;
	this.x = x$1;
	this.y = y$1;
}
Transform.prototype = {
	constructor: Transform,
	scale: function(k) {
		return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	},
	translate: function(x$1, y$1) {
		return x$1 === 0 & y$1 === 0 ? this : new Transform(this.k, this.x + this.k * x$1, this.y + this.k * y$1);
	},
	apply: function(point) {
		return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	},
	applyX: function(x$1) {
		return x$1 * this.k + this.x;
	},
	applyY: function(y$1) {
		return y$1 * this.k + this.y;
	},
	invert: function(location) {
		return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	},
	invertX: function(x$1) {
		return (x$1 - this.x) / this.k;
	},
	invertY: function(y$1) {
		return (y$1 - this.y) / this.k;
	},
	rescaleX: function(x$1) {
		return x$1.copy().domain(x$1.range().map(this.invertX, this).map(x$1.invert, x$1));
	},
	rescaleY: function(y$1) {
		return y$1.copy().domain(y$1.range().map(this.invertY, this).map(y$1.invert, y$1));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var identity = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
	while (!node.__zoom) if (!(node = node.parentNode)) return identity;
	return node.__zoom;
}

//#endregion
//#region src/genetics.ts
var genetics_exports = {};
__export(genetics_exports, {
	heterozygoteAdvantage: () => heterozygoteAdvantage,
	moranHaploid: () => moranHaploid,
	wrightFisher: () => wrightFisher,
	wrightFisherDiploid: () => wrightFisherDiploid,
	wrightFisherHaploid: () => wrightFisherHaploid
});
function wrightFisher(N, s, q0, T, qPrime, maxHistory) {
	let qt = q0;
	const trajectory = [[0, q0]];
	const step = Math.max(Math.ceil(T / maxHistory), 1);
	for (let t = 1; t <= T; ++t) {
		qt = binomial_default(N, qPrime(qt, s))() / N;
		if (t % step === 0 || t === T) trajectory.push([t, qt]);
	}
	return trajectory;
}
function wrightFisherHaploid(N, s, q0, T, maxHistory) {
	function qPrime(q, s$1) {
		const sq = s$1 * q;
		return (q + sq) / (1 + sq);
	}
	return wrightFisher(N, s, q0, T, qPrime, maxHistory);
}
function wrightFisherDiploid(N, s, q0, T, maxHistory) {
	const h = .5;
	function qPrime(q, s$1) {
		const sq = s$1 * q;
		const hsq = h * sq;
		const sq2 = sq * q;
		return (q + hsq - hsq * q + sq2) / (1 + 2 * hsq - 2 * hsq * q + sq2);
	}
	return wrightFisher(N, s, q0, T, qPrime, maxHistory);
}
function heterozygoteAdvantage(N, s, q0, T, maxHistory) {
	function qPrime(q, s$1) {
		const spq = s$1 * (1 - q) * q;
		return (q + spq) / (1 + 2 * spq);
	}
	return wrightFisher(N, s, q0, T, qPrime, maxHistory);
}
function moranHaploid(N, s, q0, T, maxHistory) {
	const s1 = s + 1;
	let Nq = Math.round(N * q0);
	const trajectory = [[0, q0]];
	const step = Math.max(Math.ceil(T / maxHistory), 1);
	for (let t = 1; t <= T * N; ++t) {
		const pMutRep = s1 * Nq / (s1 * Nq + (N - Nq));
		if (bernoulli_default(Nq / N)()) {
			if (!bernoulli_default(pMutRep)()) --Nq;
		} else if (bernoulli_default(pMutRep)()) ++Nq;
		if (t % (step * N) === 0 || t === T * N) trajectory.push([t / N, Nq / N]);
	}
	return trajectory;
}

//#endregion
//#region src/parameters.ts
var parameters_default = [
	{
		label: "Population size (<var>N</var>)",
		name: "popsize",
		min: 10,
		max: 1e4,
		step: 10,
		value: 1e3
	},
	{
		label: "Selection coefficient (<var>s<var>)",
		name: "selection",
		min: -.03,
		max: .03,
		step: .001,
		value: 0
	},
	{
		label: "Initial frequency (<var>Nq<sub>0</sub></var>)",
		name: "frequency",
		min: 1,
		max: 1e3,
		step: 1,
		value: 100
	},
	{
		label: "Observation period",
		name: "observation",
		min: 100,
		max: 4e4,
		step: 100,
		value: 1e3
	},
	{
		label: "Number of replicates",
		name: "replicates",
		min: 1,
		max: 100,
		step: 1,
		value: 10
	}
];

//#endregion
//#region src/form.ts
function form_default(params) {
	select_default$1("main").append("form");
	const inputItems = select_default$1("form").selectAll("dl").data(params).enter().append("dl").attr("id", function(d) {
		return d.name;
	}).attr("class", "parameter");
	inputItems.append("label").attr("class", "value").attr("for", function(d) {
		return d.name;
	}).text(function(d) {
		return d.value;
	});
	inputItems.append("dt").append("label").attr("class", "name").attr("for", function(d) {
		return d.name;
	}).html(function(d) {
		return d.label;
	});
	const inputRanges = inputItems.append("dd").attr("class", "param_range");
	inputRanges.append("input").attr("type", "range").attr("name", function(d) {
		return d.name;
	}).attr("min", function(d) {
		return d.min;
	}).attr("max", function(d) {
		return d.max;
	}).attr("step", function(d) {
		return d.step;
	}).attr("value", function(d) {
		return d.value;
	}).on("input", function(event, d) {
		select_default$1("#" + this.name + " label.value").text(this.value);
		d.value = Number(this.value);
		if (this.name === "popsize") {
			select_default$1("#frequency input").attr("max", d.value);
			select_default$1("#frequency label.max").text(d.value);
			if (d.value < params[2].value) {
				params[2].value = d.value;
				select_default$1("#frequency label.value").text(d.value);
			}
		}
	});
	inputRanges.append("label").attr("class", "min").attr("for", function(d) {
		return d.name;
	}).text(function(d) {
		return d.min;
	});
	inputRanges.append("label").attr("class", "max").attr("for", function(d) {
		return d.name;
	}).text(function(d) {
		return d.max;
	});
	const inputModel = select_default$1("form").append("dl").attr("class", "parameter");
	inputModel.append("dt").append("label").attr("class", "name").text("Model");
	inputModel.append("dd").each(function() {
		select_default$1(this).append("input").attr("type", "radio").attr("name", "model").attr("value", "wrightFisherHaploid").attr("id", "wrightFisherHaploid").property("checked", true);
		select_default$1(this).append("label").attr("class", "radio").attr("for", "wrightFisherHaploid").text("Wright-Fisher haploid");
		select_default$1(this).append("br");
		select_default$1(this).append("input").attr("type", "radio").attr("name", "model").attr("value", "wrightFisherDiploid").attr("id", "wrightFisherDiploid");
		select_default$1(this).append("label").attr("class", "radio").attr("for", "wrightFisherDiploid").text("Wright-Fisher diploid (h=0.5)");
		select_default$1(this).append("br");
		select_default$1(this).append("input").attr("type", "radio").attr("name", "model").attr("value", "heterozygoteAdvantage").attr("id", "heterozygoteAdvantage");
		select_default$1(this).append("label").attr("class", "radio").attr("for", "heterozygoteAdvantage").text("Wright-Fisher heterozygote advantage");
		select_default$1(this).append("br");
		select_default$1(this).append("input").attr("type", "radio").attr("name", "model").attr("value", "moranHaploid").attr("id", "moranHaploid");
		select_default$1(this).append("label").attr("class", "radio").attr("for", "moranHaploid").text("Moran haploid");
	});
	select_default$1("form").append("button").attr("type", "button").attr("class", "start button").text("START!");
}

//#endregion
//#region src/main.ts
(function() {
	form_default(parameters_default);
	const svgPadding = {
		top: 20,
		right: 30,
		bottom: 60,
		left: 80
	};
	select_default$1("main").append("div").attr("class", "plot");
	const svg = select_default$1(".plot").append("svg");
	const fixationDivs = select_default$1(".plot").append("div").attr("class", "fixation").selectAll("label").data([
		"fixed",
		"polymorphic",
		"lost"
	]).enter().append("div").attr("id", function(d) {
		return d;
	});
	fixationDivs.append("label").attr("class", function() {
		return "name";
	}).text(function(d) {
		return d;
	});
	fixationDivs.append("label").attr("class", function() {
		return "value";
	});
	const panelHeight = parseInt(svg.style("height")) - svgPadding.top - svgPadding.bottom;
	const plot = svg.append("g").attr("class", "plot").attr("transform", "translate(" + svgPadding.left + "," + svgPadding.top + ")");
	plot.append("rect").attr("class", "panel_background").attr("height", panelHeight);
	plot.append("g").attr("class", "panel");
	const scaleX = linear().domain([0, parameters_default[3].value]);
	const scaleY = linear().domain([0, 1]).range([panelHeight, 0]);
	const axisX = axisBottom(scaleX);
	const axisY = axisLeft(scaleY);
	plot.append("g").attr("class", "axis x").attr("transform", "translate(0," + panelHeight + ")").call(axisX);
	plot.append("g").attr("class", "axis y").call(axisY);
	plot.append("text").attr("class", "title x").attr("text-anchor", "middle").text("Time (generations)");
	plot.append("text").attr("class", "title y").attr("text-anchor", "middle").text("Derived Allele Frequency (q)").attr("transform", "translate(-50," + panelHeight / 2 + ") rotate(-90)");
	const line = line_default().x(function(d) {
		return scaleX(d[0]);
	}).y(function(d) {
		return scaleY(d[1]);
	});
	function updateWidth() {
		const plotWidth = parseInt(select_default$1(".plot").style("width"));
		svg.attr("width", plotWidth - parseInt(svg.style("padding-right")));
		const svgWidth = parseInt(svg.attr("width"));
		const panelWidth = svgWidth - svgPadding.left - svgPadding.right;
		svg.select(".panel_background").attr("width", panelWidth);
		scaleX.range([0, panelWidth]);
		axisX.scale(scaleX);
		svg.select(".x").call(axisX);
		svg.select(".title.x").attr("transform", "translate(" + panelWidth / 2 + "," + (panelHeight + 50) + ")");
		svg.selectAll(".panel path").remove();
		for (let i = 0; i < results.length; ++i) svg.select(".panel").append("path").attr("d", line(results[i]));
	}
	function animation(trajectory, replDelay) {
		function len() {
			return this.getTotalLength();
		}
		svg.select(".panel").append("path").attr("d", line(trajectory)).attr("stroke-dasharray", len).attr("stroke-dashoffset", len).transition().delay(replDelay).duration(2e3).ease(linear$1).attr("stroke-dashoffset", 0);
		const qT = trajectory.slice(-1)[0][1];
		if (qT === 1) fixationIncrement("#fixed");
		else if (qT === 0) fixationIncrement("#lost");
		else fixationIncrement("#polymorphic");
	}
	function fixationIncrement(id$1) {
		const label = select_default$1(id$1 + " label.value");
		label.text(parseInt(label.text()) + 1);
	}
	let maxHistory = 250;
	if (window.navigator.userAgent.match(/Chrome|Firefox/)) maxHistory = 1e3;
	let results = [];
	function start$1() {
		results = [];
		svg.select(".panel").selectAll("path").remove();
		selectAll_default$1(".fixation label.value").text(0);
		const N = parameters_default[0].value;
		const s = parameters_default[1].value;
		const q0 = parameters_default[2].value / N;
		const T = parameters_default[3].value;
		const rep = parameters_default[4].value;
		const model = select_default$1("input[name=\"model\"]:checked").attr("value");
		svg.select(".axis.x").call(axisX.scale(scaleX.domain([0, T])));
		for (let i = 0; i < rep; ++i) {
			const trajectory = genetics_exports[model](N, s, q0, T, maxHistory);
			const replDelay = T / 100 + 600 * i / rep;
			animation(trajectory, replDelay);
			results.push(trajectory);
		}
	}
	const footer = select_default$1("footer");
	const downloadJson = footer.append("a").attr("class", "button").attr("download", "driftr_result.json").text("Save results");
	downloadJson.on("click", function() {
		const json = JSON.stringify(results);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		downloadJson.attr("href", url);
	});
	footer.append("a").attr("class", "button").attr("href", "https://github.com/heavywatal/driftr.js/releases/latest").text("Download driftr.js");
	footer.append("a").attr("class", "button").attr("href", "https://github.com/heavywatal/driftr.js/issues").text("Send feedback");
	updateWidth();
	select_default$1(window).on("resize", updateWidth);
	select_default$1(".start").on("click", start$1);
})();

//#endregion