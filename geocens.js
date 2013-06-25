//    GeoCENS.js 0.3.0

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
  Geocens.VERSION = '0.3.0';

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
        params.limit = options.limit;
      }

      if (options.skip !== undefined && isFinite(options.skip)) {
        params.skip = options.skip;
      }

      var path = this.service.path + "sensors/" + this.sensor_id +
                  "/datastreams/" + this.datastream_id + "/records";

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
      var datastream_path = sensor_path + "/datastreams/" +
                            options.datastream_id;

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
  // -------------------
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

    // Merge an array into currently cached time series data for the observation
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

    // Convert Translation Engine output to array of values.
    // Example Series Data:
    //   "Offering,ObservedProperty,ProcedureID,Latitude,Longitude,Unit,Year|Month|Day|Hour|Minute|Second|Offset|Value*Year|Month|Day|Hour|Minute|Second|Offset|Value*Year|Month|Day|Hour|Minute|Second|Offset|Value"
    convertSeriesData: function(data) {
      parts = data.split(',');

      if (parts.length !== 7) {
        console.warn("Series data may be malformed", data);
      }

      this._attributes.unit = parts[5];

      // Split into raw observation pairs
      var rawObservations = parts[6].split('*');

      return $.map(rawObservations, function(observationSet) {
        var pieces = observationSet.split('|');
        var observation = {
          year:   pieces[0],
          month:  pieces[1] - 1,
          day:    pieces[2],
          hour:   pieces[3] - 1,
          minute: pieces[4],
          second: pieces[5],
          zone:   pieces[6],
          value:  parseFloat(pieces[7])
        };

        var date = Date.UTC(observation.year, observation.month,
                            observation.day, observation.hour,
                            observation.minute, observation.second);

        return {
          timestamp: date,
          value:     observation.value
        };
      });
    },

    describe: function(options) {
      var observation = this;

      if (options === undefined) {
        options = {};
      }

      jQuery.ajax({
        type: 'post',
        data: {
          service:     observation.service.service_url,
          offeringID:  observation.offering,
          procedureID: observation._attributes.procedure_id,
          lat:         observation._attributes.latitude,
          lon:         observation._attributes.longitude
        },
        url: observation.service.path + "DescribeSensor",
        dataType: 'text'
      }).done(function (sensorML) {
        options.done(sensorML);
      });
    },

    getTimeSeries: function(options) {
      var observation = this;
      var time, traceHours;

      if (options === undefined) {
        options = {};
      }

      function ISODateString(d) {
        function pad(n) { return n < 10 ? '0' + n : n; }
        return d.getUTCFullYear()    + '-' +
            pad(d.getUTCMonth() + 1) + '-' +
            pad(d.getUTCDate())      + 'T' +
            pad(d.getUTCHours())     + ':' +
            pad(d.getUTCMinutes())   + ':' +
            pad(d.getUTCSeconds())   + 'Z';
      }

      options.done = options.done || function() {};

      if (options.end !== undefined) {
        time = ISODateString(options.end);
      } else {
        options.end = new Date();
        time = ISODateString(new Date());
      }

      if (options.start !== undefined) {
        traceHours = (options.end - options.start) / (1000 * 3600);
      } else {
        traceHours = 24;
      }

      $.ajax({
        url: observation.service.path + "GetTimeSeries",
        type: 'GET',
        dataType: 'text',
        data: {
          lat:          observation._attributes.latitude,
          lon:          observation._attributes.longitude,
          offeringID:   observation.offering,
          procedureID:  observation._attributes.procedure_id,
          propertyName: observation.property,
          service:      observation.service.service_url,
          time:         time,
          traceHours:   traceHours
        }
      }).done(function (data) {
        var convertedData = observation.convertSeriesData(data);
        observation.cache(convertedData);
        options.done(convertedData);
      });
    },

    // Return most recent reading
    latest: function() {
      return this._data[this._data.length - 1];
    },

    // Return cached time series data
    seriesData: function() {
      return this._data;
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
          value:     parseFloat(reading.value)
        };
      });
    },

    // Convert Translation Engine output to Objects
    decode: function(data) {
      var service         = this;
      var observations    = data.observations[0];
      var observationData = observations.data;

      var obs = $.map(observationData, function (data) {
        return new Geocens.Observation({
          latitude:     data.lat,
          longitude:    data.lon,
          offering:     observations.offeringID,
          procedure_id: data.id,
          property:     observations.propertyName,
          readings:     service.convertReadings(data.readings),
          service:      service
        });
      });

      return obs;
    },

    getObservation: function(options) {
      var service = this;

      if (options === undefined) {
        options = {};
      }

      options.done        = options.done || function() {};
      options.service_url = options.service_url || service.service_url;
      options.northwest   = options.northwest || [90, -180];
      options.southeast   = options.southeast || [-90, 180];

      // Retrieve sensor resource
      $.ajax({
        type: 'GET',
        url: this.path + "GetObservations",
        data: {
          maxReturn:      10000,
          offeringID:     options.offering,
          propertyName:   options.property,
          service:        options.service_url,
          topleftLat:     options.northwest[0],
          topleftLon:     options.northwest[1],
          bottomrightLat: options.southeast[0],
          bottomrightLon: options.southeast[1]
        }
      }).done(function (data) {
        var converted = service.decode(data);
        options.done(converted);
      });
    },

    // Allow user to set a custom Translation Engine URL
    setPath: function(newPath) {
      this.path = newPath;
      return this;
    }
  });

  jQuery.extend(SOS.prototype, SOS);

}).call(this);
