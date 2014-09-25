// Our dots chart
// --------------
d3.chart("timeChart").extend("Dots", {
  
  initialize: function() {
    
    var base = this.base.append("g");
    var chart = this;
    var color;
    var clss = 'dot';

    this.layer("dots", base, {
      
      dataBind: function(passed) {
        // call super
        chart.dataBind(passed);

        return this
          .selectAll('.' + clss)
          .data(passed.data);

      },

      insert: function() {
        // all super
        chart.insert(base);

        return this
          .append("circle")
          .attr('class', clss)
          .attr('border', 0)
          .attr('r', 2);
      },

      events: {
        "enter" : function() {

          chart.enter(this)
          .attr("cx", function(d) {
            return chart.xScale(d[chart.mapX()]);
          })
          .attr("cy", function(d) {
            return chart.hScale(d[chart.mapH()]);
          });
        }
      }
    });

    // Cursor layer
    // ----------

    var cursor = this.mixin("Cursor", base, { chart: this, base: base });
    this.on('cursorPos:changed', function(){
      this.updateCursor();
    });

  }
});