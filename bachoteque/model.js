(function () {

  // Cues Model
  // -----------
  var cueListModel = window.cueListModel = {

    data: [],
    all: [],

    getCues: function() {
      return this.data;
    },

    getCueAt: function(time) {
      return _.findWhere(this.data, {
        "startTime": time
      });
    },

    getCueById: function(id) {
      return _.findWhere(this.data, {
        "id": id
      });
    },

    unsetNaN: function(num){
      if ((this[num] * 1) !== this[num]) delete this[num];
    },

    load: function(opts) {

      this.data = [].slice.call(opts.cues, 0);
      this.formatData();

      return this; // chainable™
    },

    ZSONparse: function(o, string) {
      var re = /"(\w+)":"([a-zA-Z0-9_\-.]+)"/ig;
      var match = string.match(re);
      if(match) {
        o = JSON.parse('{' + match.join(',') + '}');
      }
    },

    formatData: function() {
      // loops trough the data
      // and normalises it to our format
      var that = this,
          o = null,
          data = [];

      _.each(this.data, function(item, i) {

        // parse vtt json
        try {
          o = JSON.parse(item.text.replace(/\r\n+|\r+|\n+|\t+/i, ''));
        } catch (e) {
          // regex forceparse for incomplete data
          that.ZSONparse(o, item.text);
        }

        // 99% times we use duration for posX
        // so we store it here
        o.duration = item.endTime - item.startTime;

        _.extend(o, {
          "id": item.id,
          "title": o.title,
          "startTime": item.startTime,
          "endTime": item.endTime,
          "startTime-vtt": Wave.secsToTime(item.startTime),
          "endTime-vtt": Wave.secsToTime(item.endTime)
        });

        data.push(o);
      });

      this.data = data;
      return this; // assignable
    }

  };

})();