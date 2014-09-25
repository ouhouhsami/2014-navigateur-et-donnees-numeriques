(function() {
  var radius = 5;
  var color = 'lightblue';
  var states = [{
    cx: 43,
    cy: 67,
    r: radius,
    color: 'green'
  }, {
    cx: 50,
    cy: 250,
    r: radius,
    // color: color
  }, {
    cx: 90,
    cy: 170,
    r: radius,
    // color: color
  }, {
    cx: 200,
    cy: 250,
    r: radius,
    // color: color
  }, {
    cx: 300,
    cy: 320,
    r: radius,
    // color: color
  }, {
    cx: 340,
    cy: 150,
    r: radius,
    // color: color
  }];

  var collection = new Backbone.Collection(states);

  var bkpView = {
    sortIndex: function(d) {
      return +d.get('cx');
    },
    cx: function(d, v) {
      if (!v) return +d.get('cx') || 0;
      d.set('cx', (+v));
    },
    cy: function(d, v) {
      if (!v) return +d.get('cy') || 1;
      d.set('cy', (+v));
    },
    r: function(d, v) {
      if (!v) return +d.get('r') || 5;
      d.set('r', (+v));
    }
  };

  // var seg = segmentVis()
  //   .data(collection.models)
  //   .name('segments')
  //   .dataView(view);
  // console.log(collection.models)
  // var bkp = breakpointVis()
  var bkp = breakpointEdit()
    .data(collection.models)
    .dataView(bkpView)
    .name('breakpoints')
    .lineColor(color)
    .color('red')
    .interpolate('linear')
    // .interpolate('bundle')
    // .interpolate('basis')
    // .interpolate('step-before')
    // .interpolate('step-after')
    // .interpolate('cardinal')
    // .interpolate('monotone')
    .opacity(1);

  var graphE = timeLine()
    .width(window.mainWidth)
    .height(150)
    .xDomain([0, 350])
    .yDomain([0, 350]);


  var brush = brushVis().name('bruce');
  // Brush interaction
  brush.on('brush', function(extent) {
    // loop trhough layers and for the selectable ones
    // perform the selection
    for (var ly in graphE.layers) {
      var layer = graphE.layers[ly];
      if (layer.brushItem) layer.brushItem(extent);
    }
  })
    .on('brushend', function() {
      this.clear();
    });


  // we add layers
  // graphE.layer(seg);
  graphE.layer(brush);
  graphE.layer(bkp);


  // Zoom behaviour/layer
  // ---------------------
  var zoomr = zoomer()
    .graph(graphE)
    .on('mousemove', function(evt) {
      // sends evt {anchor: zx, factor: zFactor, delta: {x: deltaX, y: deltaY}}
      graphE.xZoom(evt);
      d3.select('.xaxis-editing').call(xAxisEdit); // redraw axis
    })
    .on('mouseup', function(evt) {
      graphE.xZoomSet();
      xAxisEdit.scale(graphE.xScale);
      d3.select('.xaxis-editing').call(xAxisEdit); // redraw axis
    });

  d3.select('.soom-editing')
    .append('svg')
    .attr('width', window.mainWidth)
    .attr('height', 30)
    .call(zoomr.draw.bind(zoomr));

  // draw
  // -----
  // we pass in the drawing method from our timeline object
  d3.select('.timeline-editing').call(graphE.draw);

  // axis for the zoom
  // ------------------
  var xAxisEdit = d3.svg.axis()
    .scale(graphE.xScale)
    .tickSize(1);
  // .tickFormat(function(d){
  //   var date = new Date(d);
  //   var format = d3.time.format("%M:%S");
  //   return format(date);
  // });

  d3.select('.soom-editing svg')
    .append('g')
    .attr('class', 'xaxis-editing')
    .attr("transform", "translate(0,0)")
    .attr('fill', '#555').call(xAxisEdit);

  // Adding / deletting
  // ------------------

  function deleteSelected() {
    // find selected segments and delete each of them from the collection
    var selected = d3.selectAll('.layout .selected');
    selected.each(function(item) {
      collection.remove(item);
    });
    // pass again the modified data and call update
    bkp.data(collection.models);
    bkp.update();
  }

  function addItem() {
    // add one segment to the collection
    collection.add({
      cx: 250,
      cy: 100,
      r: radius,
      color: 'blue'
    });

    // console.dir(collection.models);
    // pass again the modified data and call update
    bkp.data(collection.models);
    bkp.update();
  }

  document.querySelector('.add').addEventListener('click', addItem);
  document.querySelector('.delete').addEventListener('click', deleteSelected);

})();