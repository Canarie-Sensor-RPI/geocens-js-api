//    GeoCENS.js 1.1.3

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function () {

  // Reference to global object
  var root = this;

  // Save previous value of Geocens
  var previousGeocens = root.Geocens;

  // Set top-level namespace
  var Geocens;
  Geocens = root.Geocens = {};

  // Current library version
  Geocens.VERSION = '1.1.3';

  // Run Geocens in noConflict mode, which prevents Geocens from overwriting
  // whatever previously held the `Geocens` variable.
  Geocens.noConflict = function () {
    root.Geocens = previousGeocens;
    return this;
  };

  // Utility Functions
  // ------------------
  //

  var ISODateString = function(d) {
    function pad(n) { return n < 10 ? '0' + n : n; }
    return d.getUTCFullYear()  + '-' +
      pad(d.getUTCMonth() + 1) + '-' +
      pad(d.getUTCDate())      + 'T' +
      pad(d.getUTCHours())     + ':' +
      pad(d.getUTCMinutes())   + ':' +
      pad(d.getUTCSeconds())   + 'Z';
  };

  // Geocens.Sensor
  // ------------------
  //
  var Sensor = Geocens.Sensor = function(options) {
    // Handle undefined options
    options || (options = {});

    this.metadata = options;
    this.sensor_id = options.uid || options.sensor_id;
  };

  // Extend Sensor object (actually function) prototype with new methods and
  // properties
  jQuery.extend(Sensor.prototype, {
    // Retrieve datastreams for the sensor
    getDatastreams: function(options) {
      var self = this,
          params,
          path;

      options || (options = {});
      options.raw || (options.raw = function () {});
      options.done || (options.done = function () {});

      // Always send detail parameter to retrieve extra attributes
      params = {
        "detail": true
      };

      path = this.service.path + "sensors/" + this.sensor_id + "/datastreams";

      $.ajax({
        url: path,
        type: 'GET',
        headers: {
          "x-api-key": options.api_key || this.service.api_key
        },
        data: params
      }).done(function (data) {
        var datastreams = $.map(data, function(value) {
          var datastream = new Geocens.Datastream(value);
          datastream.sensor_id = self.sensor_id;
          datastream.service = self.service;
          return datastream;
        });

        self.datastreams = datastreams;
        options.raw(data, self);
        options.done(datastreams, self);
      });

    }
  });

  // Geocens.Datastream
  // ------------------
  //
  var Datastream = Geocens.Datastream = function(options) {
    // Handle undefined options
    options || (options = {});

    this._attributes = options;
    this.sensor_id = options.sensor_id;
    this.datastream_id = options.datastream_id || options.uid;
    this._data = [];
  };

  // Extend Datasteam object (actually function) prototype with new methods and
  // properties
  jQuery.extend(Datastream.prototype, {
    // Respond to call for attributes
    attributes: function () {
      return this._attributes;
    },

    // Merge an array into currently cached time series data for the datastream
    _cache: function(data) {
      this._data = this._data.concat(data);

      // sort by timestamp
      this._data.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      });

      return this._data;
    },

    // Retrieve time series data for the datastream
    getTimeSeries: function(options) {
      var self = this,
          params,
          path;

      options || (options = {});
      options.done || (options.done || function () {});

      params = {
        "detail": true
      };

      if (options.limit !== undefined && isFinite(options.limit)) {
        params.limit = options.limit;
      }

      if (options.skip !== undefined && isFinite(options.skip)) {
        params.skip = options.skip;
      }

      if (options.end !== undefined) {
        params.end = ISODateString(options.end);
      } else {
        params.end = ISODateString(new Date());
      }

      if (options.start !== undefined) {
        params.start = ISODateString(options.start);
      } else {
        var d = new Date();
        params.start = ISODateString(new Date(d - (24 * 3600 * 1000)));
      }

      if (options.recent) {
        delete params.start;
        delete params.end;
      }

      path = this.service.path + "sensors/" + this.sensor_id +
              "/datastreams/" + this.datastream_id + "/records";

      $.ajax({
        url: path,
        type: 'GET',
        headers: {
          "x-api-key": options.api_key || this.service.api_key
        },
        data: params
      }).done(function (data) {
        var convertedData = $.map(data, function(value) {
          return {
            timestamp: Date.parse(value.id),
            value: parseFloat(value.reading)
          };
        });

        self._cache(convertedData);
        options.done(convertedData, self);
      });

    },

    location: function () {
      return this._attributes.loc;
    },

    name: function () {
      return this._attributes.phenName + ": " + this._attributes.id;
    },

    // Return cached time series data
    seriesData: function () {
      return this._data;
    },

    units: function () {
      return this._attributes.unit;
    }
  });

  // Geocens.DataService
  // -------------------
  //
  var DataService = Geocens.DataService = function(options) {
    // Handle undefined options
    options || (options = {});

    // Let user set api key once for data source
    this.api_key = options.api_key;
  };

  jQuery.extend(DataService, {
    // Default Data Service URL
    path: "http://dataservice.geocens.ca/api/",

    _ajax: {
      // Retrieve just the resource
      get: function(options) {
        return $.ajax({
          url: options.path,
          type: 'GET',
          data: options.data,
          headers: {
            "x-api-key": options.api_key
          }
        });
      }
    },

    getDatastream: function(options) {
      var self = this,
          sensor_path,
          datastream_path;

      options || (options = {});
      options.done || (options.done = function () {});
      options.api_key || (options.api_key = self.api_key);
      self.api_key || (self.api_key = options.api_key);

      sensor_path = this.path + "sensors/" + options.sensor_id;
      datastream_path = sensor_path + "/datastreams/" + options.datastream_id;

      // Retrieve sensor resource
      self._ajax.get({
        path: sensor_path,
        api_key: options.api_key
      }).done(function (sensorData) {

        // Retrieve datastream resource
        self._ajax.get({
          path: datastream_path,
          api_key: options.api_key
        }).done(function (datastreamData) {
          // Merge data responses
          $.extend(sensorData, datastreamData, {
            datastream_id: options.datastream_id,
            sensor_id:     options.sensor_id
          });
          var datastream = new Datastream(sensorData);
          datastream.service = self;
          options.done(datastream);
        });
      });
    },

    getSensor: function(options) {
      var self = this,
          sensor_path;

      options || (options = {});
      options.done || (options.done = function () {});
      options.api_key || (options.api_key = self.api_key);
      self.api_key || (self.api_key = options.api_key);

      sensor_path = this.path + "sensors/" + options.sensor_id;

      // Retrieve sensor resource
      self._ajax.get({
        path: sensor_path,
        api_key: options.api_key
      }).done(function (sensorData) {
        var sensor = new Sensor(sensorData);
        sensor.service = self;
        options.done(sensor);
      });
    },

    getSensors: function(options) {
      var params,
          self = this,
          sensors_path;

      options || (options = {});
      options.done || (options.done = function () {});
      options.raw || (options.raw = function () {});
      options.api_key || (options.api_key = self.api_key);
      self.api_key || (self.api_key = options.api_key);

      sensors_path = this.path + "sensors";

      params = {
        "detail": true
      };

      // Retrieve sensors resource
      self._ajax.get({
        path: sensors_path,
        api_key: options.api_key,
        data: params
      }).done(function (sensorData) {
        var sensors = $.map(sensorData, function(value) {
          var sensor = new Geocens.Sensor(value);
          sensor.service = self;
          return sensor;
        });

        options.raw(sensorData);
        options.done(sensors);
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
    options || (options = {});

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
    attributes: function () {
      return this._attributes;
    },

    // Merge an array into currently cached time series data for the observation
    _cache: function(data) {
      this._data = this._data.concat(data);

      // sort by timestamp
      this._data.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      });

      return this._data;
    },

    // Convert Translation Engine output to array of values.
    // Example Series Data:
    //   "Offering,ObservedProperty,ProcedureID,Latitude,Longitude,Unit,Year|Month|Day|Hour|Minute|Second|Offset|Value*Year|Month|Day|Hour|Minute|Second|Offset|Value*Year|Month|Day|Hour|Minute|Second|Offset|Value"
    _convertSeriesData: function(data) {
      var parts = data.split(',');

      if (parts.length !== 7) {
        console.warn("Series data may be malformed", data);
      }

      this._attributes.unit = parts[5];

      // Split into raw observation pairs
      var rawObservations = parts[6].split('*');

      return $.map(rawObservations, function(observationSet) {
        var pieces,
            observation,
            date;

        pieces = observationSet.split('|');
        observation = {
          year:   pieces[0],
          month:  pieces[1] - 1,
          day:    pieces[2],
          hour:   pieces[3] - 1,
          minute: pieces[4],
          second: pieces[5],
          zone:   pieces[6],
          value:  parseFloat(pieces[7])
        };

        date = Date.UTC(observation.year, observation.month,
                        observation.day, observation.hour,
                        observation.minute, observation.second);

        return {
          timestamp: date,
          value:     observation.value
        };
      });
    },

    describe: function(options) {
      var self = this;

      options || (options = {});

      jQuery.ajax({
        type: 'post',
        data: {
          service:     self.service.service_url,
          offeringID:  self.offering,
          procedureID: self._attributes.procedure_id,
          lat:         self._attributes.latitude,
          lon:         self._attributes.longitude
        },
        url: self.service.path + "DescribeSensor",
        dataType: 'text'
      }).done(function (sensorML) {
        options.done(sensorML);
      });
    },

    getTimeSeries: function(options) {
      var self = this,
          time, traceHours;

      options || (options = {});
      options.done || (options.done = function () {});

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
        url: self.service.path + "GetTimeSeries",
        type: 'GET',
        dataType: 'text',
        data: {
          lat:          self._attributes.latitude,
          lon:          self._attributes.longitude,
          offeringID:   self.offering,
          procedureID:  self._attributes.procedure_id,
          propertyName: self.property,
          service:      self.service.service_url,
          time:         time,
          traceHours:   traceHours
        }
      }).done(function (data) {
        var convertedData = self._convertSeriesData(data);
        self._cache(convertedData);
        options.done(convertedData, self);
      });
    },

    // Return most recent reading
    latest: function () {
      return this._data[this._data.length - 1];
    },

    location: function () {
      return [this._attributes.latitude, this._attributes.longitude];
    },

    name: function () {
      return this.shortProperty() + ": " + this._attributes.procedure_id;
    },

    // Return cached time series data
    seriesData: function () {
      return this._data;
    },

    shortProperty: function () {
      var parts = this.property.split(':');
      return parts[parts.length - 1];
    },

    units: function () {
      return this._attributes.unit;
    }
  });

  // Geocens.SOS
  // -------------------
  //
  var SOS = Geocens.SOS = function(options) {
    // Handle undefined options
    options || (options = {});

    // Let user set service url once for data source
    this.service_url = options.service_url;
  };

  jQuery.extend(SOS, {
    // Default Translation Engine URL
    path: "http://dataservice.geocens.ca/translation_engine/",

    // Convert Translation Engine Readings format
    _convertReadings: function(readings) {
      return $.map(readings, function(reading) {
        var time = new Date(reading.time);

        return {
          timestamp: time.getTime(),
          value:     parseFloat(reading.value)
        };
      });
    },

    // Convert Translation Engine output to Objects
    _decode: function(data) {
      var self            = this,
          observations    = data.observations[0],
          observationData = observations.data;

      return $.map(observationData, function (data) {
        return new Geocens.Observation({
          latitude:     data.lat,
          longitude:    data.lon,
          offering:     observations.offeringID,
          procedure_id: data.id,
          property:     observations.propertyName,
          readings:     self._convertReadings(data.readings),
          service:      self
        });
      });
    },

    getObservation: function(options) {
      var self = this;

      options || (options = {});
      options.done || (options.done = function () {});
      self.service_url || (self.service_url = options.service_url);
      options.service_url || (options.service_url = self.service_url);
      options.northwest || (options.northwest = [90, -180]);
      options.southeast || (options.southeast = [-90, 180]);

      // Retrieve observation resource
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
        var converted = self._decode(data);
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
