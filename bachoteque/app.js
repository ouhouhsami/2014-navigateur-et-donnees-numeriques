window.addEventListener('DOMContentLoaded', function() {


  // Init
  // ----

  // var track = document.getElementsByName('segments')[0];

 
  // track.addEventListener('load', function(){
    // create an instance of the chart on a d3 selection
    var _cnv = d3.select("#bachoteque-vis")
      .append("svg")
      .attr("height", 160)
      .attr("width", window.mainWidth);

    // init model and load the data
    // var cueList = Object.create(cueListModel).load({
    //   cues: track.track.cues
    // });

    // Second instantiation inside the same svg
    var mine2 = _cnv.chart("Segments")
      .cursor(true)
      .height(30)
      .colors(["#f00","#ff0"])
      .attr("transform", "translate(0, " + 40 + ")")
      .interp("interpolateHcl");
      
      mine2.draw(cueList);

    // third instantiation inside the same svg
    // this time as dots
    var mine3 = _cnv.chart("Dots")
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

    var player = document.getElementById('bachoteque-player');
    var echotime = null;
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

  // });

});