//    GeoCENS.js 0.3

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
  Geocens.VERSION = '0.3';

  // Require jQuery into `$` variable
  Geocens.$ = root.jQuery || root.$;

  // Run Geocens in noConflict mode, which prevents Geocens from overwriting
  // whatever previously held the `Geocens` variable.
  Geocens.noConflict = function() {
    root.Geocens = previousGeocens;
    return this;
  };

  // Geocens.Datastream
  // ------------------
  //
  var Datastream = Geocens.Datastream = function(options) {
    // Handle undefined options
    if (options === undefined) {
      options = {};
    }

    this._attributes = options;
    this.sensor_id = options.sensor_id;
    this.datastream_id = options.datastream_id;
    this._data = [];
  };

  // Extend Datasteam object (actually function) prototype with new methods and
  // properties
  jQuery.extend(Datastream.prototype, {
    // Respond to call for attributes
    attributes: function() {
      return this._attributes;
    },

    // Merge an array into currently cached time series data for the datastream
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

    // Retrieve time series data for the datastream
    getTimeSeries: function(options) {
      var datastream = this;

      if (options === undefined) {
        options = {};
      }

      options.done = options.done || function() {};

      var params = {
        "detail": true
      };

      if (options.limit !== undefined && isFinite(options.limit)) {
        params["limit"] = options.limit;
      }

      if (options.skip !== undefined && isFinite(options.skip)) {
        params["skip"] = options.skip;
      }

      var path = this.service.path + "sensors/" + this.sensor_id + "/datastreams/" + this.datastream_id + "/records";

      $.ajax({
        url: path,
        type: 'GET',
        headers: {
          "x-api-key": options.api_key || this.service.api_key
        },
        data: params
      }).done(function (data) {
        var convertedData = $.map(data, function(value, index) {
          return {
            timestamp: Date.parse(value.id),
            value: parseFloat(value.reading)
          };
        });

        datastream.cache(convertedData);
        options.done(convertedData);
      });

    },

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

    getDatastream: function(options) {
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
          $.extend(sensorData, datastreamData, {
            datastream_id: options.datastream_id,
            sensor_id:     options.sensor_id
          });
          var datastream = new Datastream(sensorData);
          datastream.service = service;
          options.done(datastream);
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

  // Geocens.Observation
  // ------------------
  //
  var Observation = Geocens.Observation = function(options) {
    // Handle undefined options
    if (options === undefined) {
      options = {};
    }

    this._attributes = options;
    this.service     = options.service;
    this.offering    = options.offering;
    this.property    = options.property;
    this._data       = options.readings || [];
  };

  // Extend Observation object (actually function) prototype with new methods
  // and properties
  jQuery.extend(Observation.prototype, {
    // Respond to call for attributes
    attributes: function() {
      return this._attributes;
    },

    // Convert Translation Engine output to array of values
    convertSeriesData: function(data) {
      return [];
    },

    getTimeSeries: function(options) {
      var observation = this;

      if (options === undefined) {
        options = {};
      }

      options.done = options.done || function() {};

      $.ajax({
        url: observation.service.path + "GetTimeSeries",
        type: 'GET',
        data: {
          service: observation.service.service_url
        }
      }).done(function (data) {
        options.done(observation.convertSeriesData(data));
      });
    },

    // Return most recent reading
    latest: function() {
      return this._data[this._data.length - 1];
    }
  });

  // Geocens.SOS
  // -------------------
  //
  var SOS = Geocens.SOS = function(options) {
    // Handle undefined options
    if (options === undefined) {
      options = {};
    }

    // Let user set service url once for data source
    this.service_url = options.service_url;
  };

  jQuery.extend(SOS, {
    // Default Translation Engine URL
    path: "http://dataservice.geocens.ca/translation_engine/",

    // Convert Translation Engine Readings format
    convertReadings: function(readings) {
      return $.map(readings, function(reading) {
        var time = new Date(reading.time);
        return {
          timestamp: time.getTime(),
          value: parseFloat(reading.value)
        };
      });
    },

    // Convert Translation Engine output to Objects
    decode: function(data) {
      var service = this;
      var observations = data.observations[0];

      var observationData = observations.data;

      var obs = $.map(observationData, function (data) {
        return new Geocens.Observation({
          latitude: data.lat,
          longitude: data.lon,
          offering: observations.offeringID,
          procedure_id: data.id,
          property: observations.propertyName,
          readings: service.convertReadings(data.readings),
          service: service
        });
      });

      return obs;
    },

    getObservation: function(options) {
      if (options === undefined) {
        options = {};
      }
      var service = this;

      options.done = options.done || function() {};
      options.service_url = options.service_url || service.service_url;
      options.northwest = options.northwest || [];
      options.southeast = options.southeast || [];

      // Retrieve sensor resource
      $.ajax({
        type: 'GET',
        url: this.path + "GetObservations",
        data: {
          maxReturn: 10000,
          offeringID: options.offering,
          propertyName: options.property,
          service: options.service_url,
          topleftLat:     options.northwest[0],
          topleftLon:     options.northwest[1],
          bottomrightLat: options.southeast[0],
          bottomrightLon: options.southeast[1]
        }
      }).done(function (data) {
        var converted = service.decode(data);
        options.done(converted);
      });
    }
  });

  jQuery.extend(SOS.prototype, SOS);

}).call(this);
