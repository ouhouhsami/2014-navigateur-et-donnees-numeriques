/**
 * Wave.utils
 *
 * a collection of utilities for the Wave library
 */

(function(root) {

  // The top-level namespace. All public classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Wave;
  if (typeof exports !== 'undefined') {
    Wave = exports;
  } else {
    Wave = root.Wave = {};
  }

  // VTT functions
  // -------------
  Wave.pad = function(i) {
    return (i < 10) ? '0' + i : '' + i;
  };

  Wave.scale = function(opts) {
    var istart = opts.domain[0],
      istop = opts.domain[1],
      ostart = opts.range[0],
      ostop = opts.range[1];

    return function scale(value) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    };
  };

  Wave.msTosecs = function(ms) {
    return (ms * 0.001).toFixed(3);
  };

  Wave.secsToTime = function(_secs) {

    function pad(i) {
      return (i < 10) ? ('0' + i) : i;
    }
    var scs = parseFloat(_secs).toFixed(3); // vtt requires ms to be of precision 3
    var subs = scs.split('.');
    var msecs = subs[1];
    var secs = subs[0];

    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    return Wave.pad(hours) + ':' + Wave.pad(minutes) + ':' + Wave.pad(seconds) + '.' + msecs;
  };

  // vanilla js getters/setters d3 compliant
  // ---------------------------------------

  Wave.hasGetSet = {
    getSet: function(_prop, opts) {
      var prop = '_' + _prop;
      return function(value) {

        if (arguments.length === 0) {
          return this[prop];
        }

        if (opts.set.hasOwnProperty(_prop)) {
          opts.set[_prop].call(this, value);
        } else {
          this[prop] = value;
        }

        this.trigger(_prop + ':change', value);
        return value;
      };
    },

    addGettSetters: function(opts) {
      for (var prop in this) {
        if (prop.indexOf('_') >= 0 && prop !== '_events') {
          var pr = prop.substring(1);
          this[pr] = this.getSet(pr, opts);
        }
      }
    },

    initValues: function(opts) {
      for (var prop in opts) {
        if (this.hasOwnProperty(prop)) {
          this[prop](opts[prop]);
        }
      }
    }
  };

  // newer em5 version
  // -----------------

  Wave.addAccessors = function addAccessors(opts) {

    var obj = opts.obj;
    var accs = opts.accs || [];
    var combined = opts.combined ||  false;
    var globTriggers = opts.triggers || false;

    accs.forEach(function(propObj) {
      var prop = propObj.prop;
      var _prop = '_' + prop;
      var triggers = propObj.triggers || globTriggers;
      var descriptor = propObj.descriptor || {
        // our defaults
        configurable: false,
        enumerable: false,
        writable: true
      };

      if ((globTriggers || triggers) && typeof Backbone === 'undefined') {
        console.error('Backbone is not defined: your events wont be triggered');
        triggers = false;
      }

      // define private properties
      Object.defineProperty(obj, _prop, descriptor);

      // define getter/setters
      if (combined) {

        // d3/jquery getter(setter) paradigm
        Object.defineProperty(obj, prop, {
          enumerable: true,
          value: function(val) {
            if (arguments.length === 0) {
              return obj[_prop];
            }

            obj[_prop] = val;
            if (triggers) {
              if (!obj.trigger) _.extend(obj, Backbone.Events);
              obj.trigger(prop + ':change', val);
            }
            return obj;
          }
        });
      } else {
        // NON d3 compliant 

        // if we pass in get or set it will override defaults
        var _get = propObj.get || function() {
            return obj[_prop];
          };

        var _set = propObj.set || function(value) {
            obj[_prop] = value;
          };

        Object.defineProperty(obj, prop, {
          configurable: true,
          get: _get, // pass parent getter
          set: function(val) {
            // call parent setter
            _set.call(obj, val);
            // have our default behaviour too
            if (triggers) {
              if (!obj.trigger) _.extend(obj, Backbone.Events);
              obj.trigger(prop + ':change', val);
            }
            return obj;
          }
        });
      }


    });

  };

  // our own data-bind lib!
  // ----------------------

  Wave.bind = function(_obj) {
    var obj = _obj;
    var defaults = {};

    // helpers
    var forEach = Array.prototype.forEach;

    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function addDescriptor(to, type, val, _el, _id) {
      var el = _el || 'span';
      var nd = document.createElement(el);
      if (_id) {
        var id = 'ctrl-' + _id;
        if (el === 'label') nd.setAttribute("for", id);
      }
      nd.className = 'ui ref-' + to;
      nd.innerHTML = val;
      to.appendChild(nd);
    }

    function cast(attr, val) {
      if (attr === 'value') val = parseFloat(val);
      if (attr === 'checked') val = !! val;
      return val;
    }

    function toString(val) {
      if (parseFloat(val)) {
        val = parseFloat(val).toFixed(2, 10);
      }
      return val.toString();
    }

    var inputs = document.querySelectorAll('.ref');
    var atts, frag, val, param, unit;

    forEach.call(inputs, function(_input) {
      frag = document.createDocumentFragment();
      attrs = _input.attributes;
      param = attrs['data-param'].value;
      unit = attrs['data-unit'].value;

      var methAtr = attrs['data-bind'].value.split(':');
      var method = methAtr[0].trim();
      var attr = methAtr[1].trim();
      val = cast(attr, _input[attr]);

      addDescriptor(frag, 'val', toString(val), 'label', param);
      addDescriptor(frag, 'unit', unit);
      addDescriptor(frag, 'param', param);

      if (attrs['data-bind']) {

        // set defaults
        defaults[_.str.camelize(param.replace(' ', '-'))] = cast(attr, val);
        insertAfter(_input, frag);

        obj.on(method + ':change', function(pass) {
          if (val !== pass) {
            _input[attr] = pass;
            _input.nextSibling.innerHTML = toString(pass);
          }
        });
      var ev = 'input';
        if (_input.type === 'checkbox') ev = 'change';
        _input.addEventListener(ev, function(e) {
          val = cast(attr, this[attr]);
          this.nextSibling.innerHTML = toString(val);

          if (obj[method]) {
            obj[method](val);
          }
        });
      }
    });

    return defaults;
  };

  // our own data-bind lib!
  // ----------------------

  Wave.uiBind = function(_obj) {
    var obj = _obj;
    // object has to be able to pub
    if(!obj.hasOwnProperty('on')) _.extend(obj, Backbone.Events);
    var defaults = {};

    // helpers
    var forEach = Array.prototype.forEach;

    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function addDescriptor(to, type, val, _el, _id) {
      var el = _el || 'span';
      var nd = document.createElement(el);
      if (_id) {
        var id = 'ctrl-' + _id;
        if (el === 'label') nd.setAttribute("for", id);
      }
      nd.className = 'ui ref-' + to;
      nd.innerHTML = val;
      to.appendChild(nd);
    }

    function cast(attr, val) {
      if (attr === 'value') val = parseFloat(val);
      if (attr === 'checked') val = !! val; // bool cast
      if (attr === null) val = null;
      return val;
    }

    function toString(val) {
      if (parseFloat(val)) {
        val = parseFloat(val).toFixed(2, 10);
      }
      return val.toString();
    }

    var inputs = document.querySelectorAll('.ref');
    var atts, frag, val = null, param, unit;

    forEach.call(inputs, function(_input) {
      frag = document.createDocumentFragment();
      attrs = _input.attributes;
      param = attrs['data-param'] ? attrs['data-param'].value : attrs['data-label'].value;

      // param = attrs['data-param'].value || attrs['data-label'].value;
      unit = attrs['data-unit'].value;

      // disabled="disabled"
      var method, attr;
      var dataBind = attrs['data-bind'].value;
      if (dataBind.indexOf(":") > 0) {
        var methAtr = dataBind.split(':');
        method = methAtr[0].trim();
        attr = methAtr[1].trim();
      } else { // button case
        method = dataBind;
        attr = null;
      }
      val = cast(attr, _input[attr]);

      if (val !== null) { // skip for buttons
        if(!!!_input.attributes['readonly']) addDescriptor(frag, 'val', toString(val), 'label', param);
        addDescriptor(frag, 'unit', "<em>" + unit + "</em>");
        addDescriptor(frag, 'param', param);
      }

      if (attrs['data-bind']) {

        // set defaults
        defaults[_.str.camelize(param.replace(' ', '-'))] = cast(attr, val);
        insertAfter(_input, frag);

        // update the ui when the value is really new (loop safe)
        obj.on(method + ':change', function(pass) {
          if (_input[attr] !== pass) {
            _input[attr] = pass;
            if(!!!_input.attributes['readonly']) _input.nextSibling.innerHTML = toString(pass);
          }
        });

        var addListener = function addListener(e) {
          val = cast(attr, this[attr]);
          this.nextSibling.innerHTML = toString(val);
          if (obj.hasOwnProperty(method)) {
            obj[method] = val;
          }
        };
        var evt = "change";
        if (_input.type === 'button') {
          evt = "click";
          addListener = function addListener(e) {
            if (obj.hasOwnProperty(method)) {
              obj[method]();
            }
          };
        }
        _input.addEventListener(evt, addListener);
      }
    });

    return defaults;
  };

})(this);