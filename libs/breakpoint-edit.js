!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.breakpointEdit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* global d3 */
"use strict";

var breakpoint = _dereq_('breakpoint-vis');
var makeEditable = _dereq_('make-editable');
var extend = _dereq_('extend');

// exports an augmented breakpoint
// -------------------------------

module.exports = function breakpointEditor() {
  var bkpt = breakpoint();

  // logic performed to select an item from the brush
  Object.defineProperty(bkpt, 'brushItem', {
    enumerable: true, value: function(extent, mode) {
      mode = mode || 'xy'; // default tries to match both
      var that = this;
      var dv = extend(this.defaultDataView(), this.dataView());
      var modex = mode.indexOf('x') >= 0;
      var modey = mode.indexOf('y') >= 0;
      var matchX = false, matchY = false;

      this.g.selectAll('.selectable').classed('selected', function(d, i) {

        // var offsetTop = (that.top() || 0) + (that.base.margin().top || 0);
        // var offsetLeft = (that.left || 0) + (that.base.margin().left || 0);
        var halfR = dv.r(d) * 0.5;
        // X match
        if( modex ) {
          var x1 = dv.cx(d) - halfR;
          var x2 = dv.cx(d) + halfR;

          //            begining sel               end sel
          var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
          var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

          matchX = (matchX1 || matchX2);
        } else {
          matchX = true;
        }

        // Y match
        if( modey ) {
          var y1 = dv.cy(d) - halfR;
          var y2 = dv.cy(d) + halfR;
          //            begining sel               end sel
          var matchY1 = extent[0][1] <= y1 && y2 < extent[1][1];
          var matchY2 = extent[0][1] <= y2 && y1 <= extent[1][1];
          matchY = (matchY1 || matchY2);
        } else {
          matchY = true;
        }

        return matchX && matchY;
      });

    }
  });

  // checks if the clicked item is one of our guys
  Object.defineProperty(bkpt, 'clicked', {
    value: function(item) {
      return item.classList.contains('bkpt');
    }
  });

  // mouse drag ev switcher depending on drag (left|right|block) levels
  Object.defineProperty(bkpt, 'onDrag', {
    value: function(res) {
      if (!this.base.brushing()) {
        var d = res.d;
        var delta = res.event;
        var item = res.target;
        var base = this.base;

        var dv = extend(this.defaultDataView(), this.dataView());
        var xScale = base.xScale;
        var yScale = base.yScale;
        var cx = xScale(dv.cx(d));
        var cy = yScale(dv.cy(d));

        // has to be the svg because the group is virtually not there :(
        base.svg.classed('handle-drag', true);

        this.sortData();

        // update positions
        // ----------------

        cx += delta.dx;
        dv.cx(d, xScale.invert(cx));

        cy += delta.dy;
        dv.cy(d, yScale.invert(cy));

        // redraw visualization
        // --------------------
        // update myself
        this.draw(d3.select(item));
        // tell the timeline to update the rest except me
        base.drawLayers(this.name);

      }
    }
  });


  return makeEditable(bkpt);
};
},{"breakpoint-vis":2,"extend":5,"make-editable":6}],2:[function(_dereq_,module,exports){
/* global d3 */

"use strict";

var getSet = _dereq_('get-set');
var extend = _dereq_('extend');

var bkptDesc = {

  unitClass: { writable: true },
  base: { writable: true },
  g: { writable: true },
  xBaseDomain: { writable: true },
  line: { writable: true },
 
  // "inherit" events,
  on: { enumerable: true, writable: true},
  trigger: {writable: true},
  
  init: {
    value: function() {

      // getters(setters) to be added
      getSet(this)([
        'name', 'height', 'top', 'data', 'opacity',
        'color', 'lineColor',
        'dataView', 'xDomain', 'xRange', 'yDomain', 'yRange', 'interpolate'
      ]);
      
      // defaults
      this.selectable = false;
      this.height(0);
      this.opacity(0.70);
      this.line = d3.svg.line();
      this.interpolate('linear');

      return this;
    }
  },

  // default dataView to be overriden by the user's
  defaultDataView: {
    value: function() {
      var that = this;
      return {
        cx: function(d, v) {
          if(!v) return +d.cx || 0;
          d.cx = (+v);
        },
        cy: function(d, v) {
          if(!v) return +d.cy || 1;
          d.cy = (+v);
        },
        r: function(d, v) {
          if(!v) return +d.r || 5;
          d.r = (+v);
        },
        color: function(d, v) {
          if(!v) return d.color || that.color() || '#000';
          d.color = v;
        },
        lineColor: function(d) {
          return that.lineColor() || that.color() || '#000';
        }
      };
    }
  },

  load: {
    enumerable: true, configurable: true, value: function(base){
      this.base = base; // bind the baseTimeLine
      this.unitClass = this.name() + '-item';
    }
  },

  bind: {
    value: function(g) {
      this.g = g;
      this.update();
    }
  },

  sortData: {
    value: function() {
      var dv = extend(this.defaultDataView(), this.dataView());
      this.data().sort(function(a, b) {
        return dv.cx(a) - dv.cx(b);
      });
    }
  },

  xZoom: {
    enumerable: true, value: function(val) {

      // var xScale = this.base.xScale;
      // var min = xScale.domain()[0],
      //     max = xScale.domain()[1];

      // // var nuData = [];
      // var dv = extend(this.defaultDataView(), this.dataView());
      // var that = this;

      // this.data().forEach(function(d, i) {
      //   var start = dv.xc(d);
      //   var duration = dv.duration(d);
      //   var end = start + duration;

      //   // rethink when feeling smarter
      //   if((start > min && end < max) || (start < min && end < max && end > min) || (start > min && start < max && end > max) || (end > max && start < min)) nuData.push(d);
      // });
      this.update();
    }
  },

  update: {
    enumerable: true, value: function(data) {

      data = data || this.data() || this.base.data();
      // this.data(data);
      var that = this;

      var xScale = this.base.xScale;
      var yScale = this.base.yScale;
      var dv = extend(this.defaultDataView(), this.dataView());

      this.sortData();

      // line logic
      if(this.data().length > 0){
        var path =  this.g.select('.bkpt-line');
        if(!path.node()) path = this.g.append("path");

        path.attr("class", 'bkpt-line')
          .attr('stroke-opacity', this.opacity());

        this.line.interpolate(this.interpolate());
      }

      var sel = this.g.selectAll('.' + this.unitClass)
            .data(data, dv.sortIndex || null);

      var g = sel.enter()
      .append('g')
        .attr("class", this.unitClass)
        .attr('id', function(d, i) {
          return d.id || that.unitClass + '-' + i;
        });

      g.append("circle")
        .attr("class", 'bkpt')
        .attr('fill-opacity', this.opacity());
      
      sel.exit().remove();
      this.draw();
    }
  },

  draw: {
    enumerable: true, configurable: true, value: function(el) {
      el = el || this.g.selectAll('.' + this.unitClass);

      var dv = extend(this.defaultDataView(), this.dataView());
      var base = this.base;
      var xScale = base.xScale;
      var yScale = base.yScale;
      
      var cx = function(d) { return xScale(dv.cx(d)); };
      var cy = function(d) { return yScale(dv.cy(d)); };
    
      this.line
        .x(cx)
        .y(cy);

      var ln = this.g.selectAll('.bkpt-line');
      if(this.data().length > 0){
          ln.attr("d", this.line(this.data()))
          .attr("stroke", dv.lineColor)
          .attr("stroke-width", 1)
          .attr("fill", "none");
      } else {
        ln.remove();
      }
      
      el.selectAll('.bkpt')
        .attr('fill', dv.color)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr("stroke-width", 1)
        .attr('r', dv.r);

    }
  }

};

module.exports = function breakpointVis(options){
  var breakpoint = Object.create({}, bkptDesc);
  return breakpoint.init();
};
},{"extend":5,"get-set":3}],3:[function(_dereq_,module,exports){

"use strict";

var events = _dereq_('events');
var ee = new events.EventEmitter();

module.exports = getSet;


function add(obj, prop, triggers) {

  var _prop = '_' + prop;

    // does it trigger on change?
    triggers = triggers || false;

    // define private properties
    Object.defineProperty(obj, _prop, { // defaults
      configurable: true,
      writable: true
    });

    // d3/jquery getter(setter) paradigm
    Object.defineProperty(obj, prop, {
      enumerable: true, configurable: true, value: function(val) {

        if (arguments.length === 0) return obj[_prop];
        obj[_prop] = val;

        // bind events if
        if (triggers) {
          if (!obj.hasOwnProperty('on')) obj.on = ee.on;
          if (!obj.hasOwnProperty('emit')) obj.trigger = ee.emit;
          obj.trigger(prop + ':changed', val);
        }

        return obj;
      }
    });
}

function getSet(obj) {

  return function (prop, triggers) {

    if (Array.isArray(prop)) {
      
      prop.forEach(function (p) {
        add(obj, p, triggers);
      });

    } else {
      add(obj, prop, triggers);
    }

    return add;
  };
}
},{"events":4}],4:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],5:[function(_dereq_,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	"use strict";
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	"use strict";
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== "object" && typeof target !== "function" || target == undefined) {
			target = {};
	}

	for (; i < length; ++i) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],6:[function(_dereq_,module,exports){

/* global d3 */
"use strict";

module.exports = function makeEditable(graph){

  // a visualiser to decorate
  var edit = graph;

  // keep old methods to override
  var defaultDraw = edit.draw;
  var defaultLoad = edit.load;

  // overrides load to add editing capablilities
  Object.defineProperty(edit, 'load', {
    value: function(base) {

      // default load
      defaultLoad.call(this, base);
      var id = base.id();
      var g = base.g;

      // edition events handling
      // base.on(id + ':mousedown', this.mouseDown.bind(this));
      base.on(id + ':drag', this.onDrag.bind(this));
      base.on(id + ':mouseup', this.mouseUp.bind(this));
      base.on(id + ':mouseout', this.base.xZoomSet.bind(this.base));
      
      // clicking anywhere ouside or inside the container deselects
      document.body.addEventListener('mousedown', this.mouseDown.bind(this));

      return this;
    }
  });
 
  Object.defineProperty(edit, 'draw', {
    enumerable: true, value: function(el) {
      // add css for cursors
      this.g.selectAll('.' + this.unitClass).classed('selectable', true);
      defaultDraw.call(this, el);
    }
  });

  Object.defineProperty(edit, 'mouseUp', {
    value: function (ev) {

        // has to be the svg because the group is virtually not there :(
        this.base.svg.classed('handle-resize', false);
        this.base.svg.classed('handle-drag', false);
      }
  });

  // mouse down ev handler
  Object.defineProperty(edit, 'mouseDown', {
    value: function(ev) {
      if(ev.button === 0) {

        var item = ev.target;

        if(this.clicked(item)) {
          this.itemMousedown(ev);
        } else {
          if(!item.classList.contains('keep-selection')) this.unselectAll();
        }

      }
    }
  });

  // mouse down on the svg element deselects
  Object.defineProperty(edit, 'unselectAll', {
    value: function svgMousedown() {
      this.base.svg.selectAll('.selected').classed('selected', false);
    }
  });

  // mousedown on the segments selects them and should trigger an event
  Object.defineProperty(edit, 'itemMousedown', {
    value: function itemMousedown(ev) {

      var g = this.g;
      var item = ev.target.parentNode; // containing g
      var selects = g.node().querySelectorAll('.selected');
      var isFound = [].indexOf.call(selects, item) >= 0;
      var isSelectable = item.classList.contains('selectable');
      var isSelected = d3.select(item).classed('selected');

      // move selected item to the front
      this.base.toFront(item);

      // we click away or in some other block without shift
      if((selects.length < 1 || !isFound) && !ev.shiftKey){
        this.unselectAll();
      }

      // shift + was selected: deselect
      if(ev.shiftKey && isSelected){
        d3.select(item).classed('selected', false);
      } else {
        if(isSelectable) d3.select(item).classed('selected', true);
      }

    }
  });

  return edit;
};
},{}]},{},[1])
(1)
});