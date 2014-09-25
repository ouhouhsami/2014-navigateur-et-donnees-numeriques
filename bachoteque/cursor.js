d3.chart("Cursor", {
  
  initialize: function(pass) {

    // inherit from the cursor adopter
    var chart = pass.chart;
    var base = pass.base;

    // Cursor layer
    // ----------
   
    cursorClass = 'cursor';
    var cursor = {

      render: function(_curs) {
        var curs = _curs || this;
        
        if(chart.cursor()){
          return curs
              .attr("x1", function(d){
                return chart.crsScale(chart.cursorPos());
              })
              .attr("x2", function(d){
                return chart.crsScale(chart.cursorPos());
              })
              .attr("y2", chart.height())
              .attr("y1", 0);
        }  else {
          return curs;
        }
      },

      dataBind: function() {
        // use the base to render
        return base
          .selectAll('.' + cursorClass)
          .data(chart.cursorPos());

      },

      insert: function() {
        if(chart.cursor()){
          // use the base to render
          return base
            .append("line")
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .attr('class', cursorClass + ' crisp');
        } else {
            return base;
        }
      },

      events: {

        enter: function() {
          if(chart.cursor()){
            return cursor.render.apply(this);
          } else {
            return base;
          }
        }
      }

    };

    // we augment the cursor adopter
    // with the updateCursor capability
    chart.updateCursor = function(){
      cursor.render(base.select('.cursor'));
    };
    
    // d3.select(base) to have a valid selection 
    // since we will append to the main g
    this.layer("cursor", d3.select(base), cursor);

  }
  
});