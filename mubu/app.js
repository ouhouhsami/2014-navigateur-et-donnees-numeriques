(function() { "use strict";
  window.addEventListener('DOMContentLoaded', function() {
    // createBufferLoader()
    // .load('/'+ path + '/snd/mindbox.mp3').then(function(b) {
    //   loaded(b.getChannelData(0));
    // }, err, function(progress){});

    var request = new XMLHttpRequest();
    request.open("GET", 'snd/mindbox.wav', true);
    request.responseType = "arraybuffer";
    request.addEventListener('load', function() {
      audioContext.decodeAudioData(this.response, function(b) {
        var bdata = b.getChannelData(0);
        bdata.sampleRate = b.sampleRate;
        bdata.duration = b.duration;
        loaded(bdata);
      }, function err(e) {
        console.error('Error decoding', e);
      });
    });
    request.send();

    function loaded(buffer) {

      var basexDomain = [0, buffer.duration * 1000];

      // Timeline
      // --------
      var graph = timeLine()
        .width(window.mainWidth)
        .height(150)
        .data(model.data)
        .xDomain(basexDomain)
        .margin({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }); // segment editor layer

      // expose
      // expose('graph', graph);

      // brush layer
      // ------------
      // var brush = brushVis().name('bruce');
      // graph.layer(brush);
      // // Brush interaction
      // brush.on('brush', function(extent) {
      //   // manually applying brush per layer
      //   // var ly = graph.layers['segments'];
      //   // if(ly.hasOwnProperty('brushItem')) ly.brushItem(extent, 'x');
      // })
      // .on('brushend', function(){
      //   this.clear();
      // });

      // segments layer
      // --------------
      var seg = // segmentVis()
        segmentVis()
        .xDomain(basexDomain)
        .data(model.data)
        .dataView(model.view)
        .name('segments')
        // .top(15)
        // .color('#fff')
        .opacity(0.50);

      graph.layer(seg);

      // waveform layer
      // --------------
      graph.layer(waveformVis()
        .name('waveform')
        .data(buffer)
        .precision(16384)
        // .precision(4096)
        // .precision(2048)
        // .precision(1024)
        // .precision(512) // samples per pixel
        // .precision(128)
        .xDomain(basexDomain)
        // .yDomain([-1, 1])
        .yDomain([1, -1])
        .color('#1F77B4')
      );


      // Zoom behaviour/layer
      // ---------------------
      var zoomr = zoomer()
        .graph(graph)
        .on('mousemove', function(evt) {
          // sends evt {anchor: zx, factor: zFactor, delta: {x: deltaX, y: deltaY}}
          graph.xZoom(evt);
          d3.select('.xaxis-mubu').call(xAxisMubu); // redraw axis
        })
        .on('mouseup', function(evt) {
          graph.xZoomSet();
          xAxisMubu.scale(graph.xScale);
          d3.select('.xaxis-mubu').call(xAxisMubu); // redraw axis
        });

      d3.select('.soom-mubu')
        .append('svg')
        .attr('width', window.mainWidth)
        .attr('height', 30)
        .call(zoomr.draw.bind(zoomr));

      // draw
      // -----
      d3.select('.timeline-mubu').call(graph.draw);

      // axis for the zoom
      // ------------------
      var xAxisMubu = d3.svg.axis()
        .scale(graph.xScale)
        .tickSize(1)
        .tickFormat(function(d) {
          var date = new Date(d);
          var format = d3.time.format("%M:%S");
          return format(date);
        });

      d3.select('.soom-mubu svg')
        .append('g')
        .attr('class', 'xaxis-mubu')
        .attr("transform", "translate(0,0)")
        .attr('fill', '#555').call(xAxisMubu);

      // document.querySelector('.keep-selection').addEventListener('click', function(){
      //   var selected = d3.selectAll('.layout .selected');
      //   var ids = _.pluck(selected.data(), 'id');
      //   model.data = _.reject(model.data, function(d){ return ids.indexOf(d.id) != -1; });

      //   seg.data(model.data);
      //   seg.update();
      // });

      // // Data manipulation interactions
      // // ------------------------------

      // collection.on('add', function(e){
      //   seg.update();
      //   console.log('added', e.toJSON());
      // });

      // var rem;
      // collection.on('remove', function(e){
      //   console.log('rem');
      //   rem = e;
      //   seg.update();
      //   console.log('removed', e.toJSON());
      // });

    }

  });
})();