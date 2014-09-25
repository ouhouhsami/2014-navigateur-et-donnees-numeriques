(function () {

  // Init
  // ----

  var track = document.getElementsByName('segments')[0];

  track.addEventListener('load', function(){

    // create an instance of the chart on a d3 selection
    var cnv = d3.select("#canvas")
      .append("svg")
      .attr("height", 160)
      .attr("width", 920);

    // init model and load the data
    var cueList = Object.create(cueListModel).load({
      cues: track.track.cues
    });

    // we can pass a setup object
    // with all the defaults
    // or individually set the values
    // with setters
    // i.e.
    // svg.chart("MyChart")
    //  .setup({height: 10})
    // or
    // svg.chart("MyChart")
    //  height(10)

    var mine = cnv.chart("Segments")
      .setup({
        height: 30,
        cursor: true
      })
      .on('click', function(e){
      // listen for clicks on our segments
        console.log(e);
      });

      mine.draw(cueList); // draw cuts the chain :(

    // Second instantiation inside the same svg
    var mine2 = cnv.chart("Segments")
      .cursor(true)
      .height(30)
      .colors(["#f00","#ff0"])
      .attr("transform", "translate(0, " + 40 + ")")
      .interp("interpolateHcl");
      
      mine2.draw(cueList);

    // third instantiation inside the same svg
    // this time as dots
    var mine3 = cnv.chart("Dots")
      .cursor(true)
      .attr("height", 50) // override the hight
      .attr('class', 'dots') // the group class
      .colors(["#100","#f00"])
      // .width(913)
      .attr("transform",
        "translate(0, " + 90 + ")"
      )
      .interp("interpolateHcl");

    mine3.draw(cueList);

    var player = document.getElementsByName('player')[0];


    // TODO:
    // look into d3js timer
    // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_timer
    // custome framerate vars

    var now, delta,
        fps = 30,
        then = Date.now(),
        interval = 1000/fps;

    function animloop(){
      annimation = requestAnimationFrame(animloop);

      now = Date.now();
      delta = now - then;
      
      // only update at our framerate
      // to keep the cpu at ease
      if (delta > interval) {
        then = now - (delta % interval);
        mine.update('cursorPos', player.currentTime);
        mine2.update('cursorPos', player.currentTime);
        mine3.update('cursorPos', player.currentTime);
      }
    }

    player.addEventListener('play', function() {
       animloop();
    });

    player.addEventListener('ended', function() {
       cancelAnimationFrame(annimation);
    });

    player.addEventListener('pause', function() {
       cancelAnimationFrame(annimation);
    });

  });

})();
