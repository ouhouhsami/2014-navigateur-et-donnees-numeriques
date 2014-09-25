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

        // DEMO HACK!!!
        var maxDur = d3.max(this[0].map(function(item){
          return item.__data__.duration;
        }));


        chart.hScale.domain([0, maxDur]);
        chart.xScale.domain([0, document.getElementById('bachoteque-player').duration])
        
        /// END HACK

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
            return chart.xScale(d['start']);
          })
          .attr("width", function(d) {
            return chart.xScale(d['duration']);
          })
          .attr("y", function(d) {
            return chart.height()-chart.hScale(d['duration']);//chart.yPos(chart.height);
          })
          .attr("height", function(d) {
            return chart.hScale(d['duration']);
            // return chart.hScale(d[chart.mapH()]);
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