// Our bar chart
// --------------
d3.chart("timeChart").extend("Segments", {
  
  initialize: function() {
    // this -> Chart object
    var base = this.base.append("g");
    var chart = this;
    var color;

    // Segments layer
    // --------------

    var segmentsClass = 'seg';

    this.layer("segments", base, {
      
      dataBind: function(passed) {

        // call super
        chart.dataBind(passed);

        // this -> base
        this.attr('class', chart.name());

        return this
          .selectAll('.' + segmentsClass)
          .data(passed.data);

      },

      insert: function() {

        // call super
        chart.insert(base);

        // this -> [data[], _chart]
        return this
          .append("rect")
          .attr('class', segmentsClass + ' crisp')
          .attr('border', 0);
      },
      
      events: {

        enter: function() {
          
          // this -> [data[], _chart]
          chart.enter(this)
          .attr("x", function(d) {
            return chart.xScale(d[chart.mapX()]);
          })
          .attr("width", function(d) {
            return chart.wScale(d[chart.mapW()]);
          })
          .attr("y", function(d) {
            return chart.yPos(d[chart.mapH()]);
          })
          .attr("height", function(d) {
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