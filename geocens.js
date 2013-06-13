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
    this._data = [];
  };

  // Extend Sensor object (actually function) prototype with new methods and
  // properties
  jQuery.extend(Sensor.prototype, {
    // Respond to call for attributes
    attributes: function() {
      return this._attributes;
    },

    // Merge an array into currently cached time series data for the sensor
    cache: function(data) {
      this._data = this._data.concat(data);

      // sort by timestamp
      this._data.sort(function(a, b) {
        if (a.timestamp < b.timestamp) {
          return -1;
        } else if (a.timestamp > b.timestamp) {
          return 1;
        } else {
          return 0;
        }
      });

      return this._data;
    },

    // Retrieve time series data for the sensor
    getTimeSeries: function(options) {
      var sensor = this;

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
        var convertedData = $.map(data, function(value, index) {
          return {
            timestamp: Date.parse(value.id),
            value: parseFloat(value.reading)
          };
        });

        sensor.cache(convertedData);
        options.done(convertedData);
      });

    },

    // Return sensorML documents
    metadata: function() {},

    // Return cached time series data
    seriesData: function() {
      return this._data;
    }
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

    ajax: {
      // Retrieve just the resource
      get: function(options) {
        var service = this;

        return $.ajax({
          url: options.path,
          type: 'GET',
          headers: {
            "x-api-key": options.api_key
          }
        });
      }
    },

    getSensor: function(options) {
      if (options === undefined) {
        options = {};
      }
      var service = this;

      options.done = options.done || function() {};
      options.api_key = options.api_key || service.api_key;

      var sensor_path = this.path + "sensors/" + options.sensor_id;
      var datastream_path = sensor_path + "/datastreams/" + options.datastream_id;

      // Retrieve sensor resource
      service.ajax.get({
        path: sensor_path,
        api_key: options.api_key
      }).done(function (sensorData) {

        // Retrieve datastream resource
        service.ajax.get({
          path: datastream_path,
          api_key: options.api_key
        }).done(function (datastreamData) {
          // Merge data responses
          $.extend(sensorData, datastreamData);
          var sensor = new Sensor(sensorData);
          sensor.service = service;
          options.done(sensor);
        });
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
