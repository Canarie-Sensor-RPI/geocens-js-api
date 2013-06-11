//    GeoCENS.js alpha1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function() {

  // Reference to global object
  var root = this;

  // Save previous value of Geocens
  var previousGeocens = root.Geocens;

  // Set top-level namespace
  var Geocens;
  Geocens = root.Geocens = {};

  // Current library version
  Geocens.VERSION = 'alpha1';

  // Require jQuery into `$` variable
  Geocens.$ = root.jQuery || root.$;

  // Run Geocens in noConflict mode, which prevents Geocens from overwriting
  // whatever previously held the `Geocens` variable.
  Geocens.noConflict = function() {
    root.Geocens = previousGeocens;
    return this;
  };

  // Geocens.Sensor
  // --------------
  //
  var Sensor = Geocens.Sensor = function(options) {
    // Handle undefined options
    if (options === undefined) {
      options = {};
    }

    this._attributes = options;
  };

  // Extend Sensor object (actually function) prototype with new methods and
  // properties
  jQuery.extend(Sensor.prototype, {
    // Respond to call for attributes
    attributes: function() {
      return this._attributes;
    },

    getTimeSeries: function(options) {
      if (options === undefined) {
        options = {};
      }

      options.done = options.done || function() {};

      var path = this.service.path + "datastreams/" + this._attributes.datastream_id + "/records";

      $.ajax({
        url: path,
        type: 'GET',
        headers: {
          "x-api-key": options.api_key || this.service.api_key
        }
      }).done(function (data) {
        options.done(data);
      });

    },

    // Return sensorML documents
    metadata: function() {}
  });

  // Geocens.DataService
  // -------------------
  //
  var DataService = Geocens.DataService = function(options) {
    // Handle undefined options
    if (options === undefined) {
      options = {};
    }

    // Let user set api key once for data source
    this.api_key = options.api_key;
  };

  jQuery.extend(DataService, {
    // Default Data Service URL
    path: "http://dataservice.geocens.ca/api/",

    getSensor: function(options) {
      if (options === undefined) {
        options = {};
      }

      options.done = options.done || function() {};

      var service = this;
      var path = this.path + "sensors/" + options.sensor_id + "/datastreams/" + options.datastream_id;

      $.ajax({
        url: path,
        type: 'GET',
        headers: {
          "x-api-key": options.api_key || this.api_key
        }
      }).done(function (data) {
        var sensor = new Sensor(data);
        sensor.service = service;
        options.done(sensor);
      });

    },

    // Allow user to set a custom Data Service URL
    setPath: function(newPath) {
      this.path = newPath;
      return this;
    }
  });

  jQuery.extend(DataService.prototype, DataService);

}).call(this);
