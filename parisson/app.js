(function() { "use strict";
  var data = [], max;

  var json = window['paris-son-data'];

  var timeData = json.data_object.time.numpyArray;
  var valueData = json.data_object.value.numpyArray;
  var length = timeData.length;
  max = json.audio_metadata.duration;

  for (var i = 0; i < length; i++) {
    data.push({
      begin: timeData[i],
      value: valueData[i]
    });
  }

  draw();

  function draw() { 
    var dest = d3.select('.paris-son');

    var maxY = d3.max(data, function(d) {
      return d.value;
    });

    var area = areaVis()
      .data(data)
      .name('area')
      .opacity(0.5);

    var myGraph = timeLine()
      .width(window.mainWidth)
      .height(250)
      .xDomain([0, max])
      .margin({
        top: 0,
        right: 0,
        bottom: 20,
        left: 50
      })

    .layer(area).draw(dest);
  }
})();