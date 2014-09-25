d3.chart("timeChart", {

  // defaults
  _name: "segments",
  _unified: false,
  _mapX: "start",
  _mapW: "duration",
  _mapH: "loudness",
  _mapC: "loudness",
  _align: "bottom",
  _interp: "interpolateHcl",
  _colors: ["#555","#fff"],
  _cursor: false,
  _cursorPos: 0,

  // getter/setter helper
  // returns a gettersetter function
  // for the specified property
  getSet: function(_prop){
    var prop = '_' + _prop;

    return function(value){
      if (!value) {
        return this[prop];
      }

      this[prop] = value;
      return this;
    };
  },

  update: function(param, value) {
    this[param](value);
    this.trigger(param + ':changed');
  },

  attrs: {}, // our attributes handler
  attr: function(tp, val){
    this.attrs[tp] = val;
    return this;
  },

  yPos : function(_y){

    var height = this.height();
    var y = this.hScale(_y);

    switch (this.align()) {

      case 'center':
        return (height * 0.5) - (y * 0.5);

      case 'top':
        return 0;

      case 'bottom':
        return height - y;
    }

  },

  presume: function(o, param, prop) {

    // if (!this[param][o.id]) {
    //   this[param][o.id] = o[prop];
    // }

    // o[prop] = this[param][o.id];

    // return o; // assignable
  },

  calcBoundries: function(desired, data){
    var getBoundries = _.uniq(desired);
    var boundries = {};

    // loop cues to retrieve boundries 
    data.map(function(cue){

      // loop desired propertis
      // and accumulate the values
      getBoundries.forEach(function(prop){
        if(boundries[prop]){
          boundries[prop].values.push(parseFloat(cue[prop]));
        } else {
          boundries[prop] = {};
          boundries[prop].values = [];
        }
      });

    });

    getBoundries.forEach(function(prop){
      boundries[prop]['sum'] = d3.sum(boundries[prop].values);
      boundries[prop]['min'] = d3.min(boundries[prop].values);
      boundries[prop]['max'] = d3.max(boundries[prop].values);
      boundries[prop]['total'] = boundries[prop].values.length;
    });
    return boundries;
  },

  // global option setter 
  setup: function(options){
    for (var prop in options) {
      this[prop](options[prop]);
    }
    return this;
  },

  initialize: function(pass) {

    var chart = this;

    // getters/setters
    this.name      = this.getSet('name');
    this.width     = this.getSet('width');
    this.height    = this.getSet('height');
    this.mapX      = this.getSet('mapX');
    this.mapW      = this.getSet('mapW');
    this.mapH      = this.getSet('mapH');
    this.mapC      = this.getSet('mapC');
    this.align     = this.getSet('align');
    this.unified   = this.getSet('unified');
    this.interp    = this.getSet('interp');
    this.colors    = this.getSet('colors');
    this.xPos      = this.getSet('xPos');
    this.cursor    = this.getSet('cursor');
    this.cursorPos = this.getSet('cursorPos');

    // Dimentions
    var width = this.width() || this.base.attr('width');
    var height = this.height() || this.base.attr('height');

    // (re)set
    this.width(width);
    this.height(height);
    
    // scales
    this.xScale = d3.scale.linear();
    this.wScale = d3.scale.linear();
    this.hScale = d3.scale.linear();
    this.cScale = d3.scale.linear();
    this.crsScale = d3.scale.linear();

  },

  insert: function(base){ // called by child
    // Update ranges

    base.attr('class', this.name());

    // apply attributes
    for(var att in this.attrs){
      // if we have our own setters
      // use those
      if(this.hasOwnProperty(att)) {
        this[att](this.attrs[att]);
      } else {
        // otherwise we fallback to svg ones
        base.attr(att, this.attrs[att]);
      }
    }

    this.xScale
      .range([0, this.width()]);
   
    this.wScale
      .range([0, this.width()]);

    this.hScale
      .range([0, this.height()]);

    this.cScale
      .range(this.colors())
      .interpolate(d3[this.interp()]);

    this.crsScale
      .range([0, this.width()]);

  },

  dataBind: function(model){ // called by child

    // pass the data along to modify
    var data = this.data = model.data;

    // retreive necessary mapping settings
    var mapX = this.mapX();
    var mapW = this.mapW();
    var mapH = this.mapH();
    var mapC = this.mapC();
    
    var boundries = this.calcBoundries([mapX, mapW, mapH, mapC], data);

    // set our domains
    this.xScale
      .domain([boundries[mapX]['min'], boundries[mapX]['max']]);

    this.wScale
      .domain([0, boundries[mapW]['sum']]);

    this.crsScale
      .domain([0, boundries[mapW]['sum']]);

    this.hScale
      .domain([boundries[mapH]['min'], boundries[mapH]['max']]);

    this.cScale
      .domain([boundries[mapC]['min'], boundries[mapC]['max']]);

  },

  enter : function(item) {
    var chart = this;
    
    return item
    .style("fill", function(d, i) {
      color = chart.cScale(d[chart.mapC()]);
      // assign current color to data
      chart.data[i].color = color;
      return color;
    })
    .on("click", function(d) {
      chart.trigger('click', d);
    });
  }

});
