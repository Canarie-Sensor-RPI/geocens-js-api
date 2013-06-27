//    geocens-map.js 0.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($, L) {

  L.Geocens = L.FeatureGroup.extend({

    options: {
      popup: function(datasource, event, marker) {
        return datasource.name();
      }
    },

    initialize: function(data, options) {
      var self = this;
      console.log("initializing", data, options);

      L.Util.setOptions(this, options);

      this._datasource = data;
      this._layers = {};
      var markers = this._markers = [];
      var markerOptions = this.options.marker;
      var popup = L.popup();

      // Create markers from datasource(s)
      if (data instanceof Array) {
        $.each(data, function(index) {
          var marker = L.marker(this.location(), markerOptions);
          marker.datasource = this;

          marker.on("click", function(e) {
            if (self._map !== undefined) {
              self._map.closePopup(popup);
            }

            popup.setLatLng(e.latlng)
                 .setContent(self.options.popup(marker.datasource), e, marker);

            marker.bindPopup(popup);
          });

          markers.push(marker);
        });
      } else {
        var marker = L.marker(data.location(), markerOptions);
        markers.push(marker);
      }

      var markerGroup = L.featureGroup(markers);
      var id = L.stamp(markerGroup);
      this._layers[id] = markerGroup;
    },

    datasource: function () {
      return this._datasource;
    }
  });

  L.geocens = function (data, options) {
    return new L.Geocens(data, options);
  };

})(jQuery, L);
