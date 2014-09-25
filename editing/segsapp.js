(function () {

  // var collection = new Backbone.Collection([{
  //   "begin": 0,
  //   "duration": 4,
  //   "color": "#414FBA"
  // }, {
  //   "begin": 5,
  //   "duration": 7,
  //   "color": "#2A2E68"
  // }, {
  //   "begin": 18,
  //   "duration": 9,
  //   "color": "#5A281E"
  // }, {
  //   "begin": 30,
  //   "duration": 7,
  //   "color": "#BE7C7A"
  // }, {
  //   "begin": 16,
  //   "duration": 6,
  //   "color": "#BE7C7A"
  // }, {
  //   "begin": 8,
  //   "duration": 3,
  //   "color": "#2A2E68"
  // }, {
  //   "begin": 1,
  //   "duration": 4,
  //   "color": "#C52599"
  // }, {
  //   "begin": 63,
  //   "duration": 9,
  //   "color": "#CA56F4"
  // }, {
  //   "begin": 90,
  //   "duration": 9,
  //   "color": "#5A281E"
  // }, {
  //   "begin": 20,
  //   "duration": 6,
  //   "color": "#CA56F4"
  // }]);

  // Sample dataView tells us how to access the data
  var view = {
    // tell d3 which is our key for sorting
    sortIndex: function(d) {
      return d.get('cx');
    },
    // how to retrieve or set the value used as the start of the segment
    start: function(d, v) {
      // no value, we retrieve
      if (!v) return +d.get('cx');
      // yesvalue we set :)
      d.set('cx', v);
    },
    // how to retrieve or set the value used as the duration of the segment
    duration: function(d, v) {
      if (!v) return +d.get('cy');
      d.set('cy', v);
    },
    // how to retrieve or set the value used for the color of the segment
    color: function(d, v) {
      if (!v) return d.get('color');
      d.set('color', v);
    }
  };

  document.addEventListener('DOMContentLoaded', function() {

    // Timeline
    // --------
    var graphSegs = timeLine()
      .width(window.mainWidth)
      .height(150)
      .xDomain([0, 350]);

    // segments layer
    // --------------
    var seg = segmentEdit()
      .dataView(view)
      .data(collection.models)
      .name('segments')
      .opacity(0.5);

    var brush = brushVis().name('bruce2');
    // Brush interaction
    brush.on('brush', function(extent) {
      // loop trhough layers and for the selectable ones
      // perform the selection
      for (var ly in graphSegs.layers) {
        var layer = graphSegs.layers[ly];
        if (layer.brushItem) layer.brushItem(extent);
      }
    })
    .on('brushend', function() {
      this.clear();
    });

    graphSegs.layer(brush);
    graphSegs.layer(seg);

    collection.on('change', function(e) {
      graphE.update();
      graphSegs.update();
    });

    collection.on('add', function(e) {
      graphE.update();
      graphSegs.update();
    });

    collection.on('remove', function(e) {
      graphE.update();
      graphSegs.update();
    });



    d3.select('.timeline-editing-sg').call(graphSegs.draw);

    // function deleteSelected() {
    //   // find selected segments and delete each of them from the collection
    //   var selected = d3.selectAll('.layout .selected');
    //   selected.each(function(segment) {
    //     collection.remove(segment);
    //   });
    //   // pass again the modified data and call update
    //   seg.data(collection.models);
    //   graphSegs.update();
    // }

    // function addSegment() {
    //   // add one segment to the collection
    //   // collection.add({
    //   //   "begin": 40,
    //   //   "duration": 10,
    //   //   "color": "#174345"
    //   // });
    //   // // pass again the modified data and call update
    //   // seg.data(collection.models);
    //   graphSegs.update();
    // }

    document.querySelector('.add').addEventListener('click', addSegment);
    document.querySelector('.delete').addEventListener('click', deleteSelected);
  });

})(); 
