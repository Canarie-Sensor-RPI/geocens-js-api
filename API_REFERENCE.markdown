# API Reference Guide

## Table of Contents

1. [Geocens.noConflict](#noConflict)
2. [Loading Data](#loadingData)
3. [Chart Visualization](#chartVisualization)
4. [Map Visualization](#mapVisualization)

<a name="noConflict"></a>
## Geocens.noConflict

If you are using a variable that already is called `Geocens`, you can prevent the GeoCENS JS API from overwriting it. The `noConflict()` method will return the `Geocens` variable back to the previous owner/value.

	var GeocensAPI = Geocens.noConflict();
	var sosSource = GeocensAPI.SOS({…});

<a name="loadingData"></a>
## Loading Data

The library can load data from either an [OGC SOS compatible service](http://www.opengeospatial.org/standards/sos), or from our GeoCENS Data Service.

### Geocens.SOS

Define an OGC SOS object with the SOS URL:

	var sosSource = new Geocens.SOS({
		service_url: "http://www.example.com/sos"
	});

This object can be reused to use the same `service_url` for multiple `getObservation` invocations.

### Geocens.SOS.getObservation

Use an OGC SOS object to retrieve SOS observation data, as set out by the [Observation and Measurement specification](http://www.opengeospatial.org/standards/om). Results returned are procedure-observation pairs that exist within the filter criteria. Procedures that have no data within the filter will not be returned. Results are filtered by SOS Offering (required), Observed Property (required), and bounding box (optional).

	sosSource.getObservation({
		offering: "sos_offering",
		property: "sos_property",
		northwest: [51, -114],
		southeast: [-51, 114],
		done: function (observations) {
			window.observations = observations;
		}
	});

These can be combined:

	Geocens.SOS.getObservation({
		service_url: "http://www.example.com/sos",
		offering: "sos_offering",
		property: "sos_property",
		northwest: [51, -114],
		southeast: [-51, 114],
		done: function (observations) {
			window.observations = observations;
		}
	});

#### option: offering

The SOS Offering key. Can be used to filter into a logical group of observations. Is required.

#### option: property

The SOS Observed Property key. Can be used to filter observations by physical phenomena. Note that it is typically a [URN](http://en.wikipedia.org/wiki/Uniform_resource_name). Is required.

#### option: northwest

An optional pair of Float numbers representing the North West corner of the bounding box. Used in conjunction with `southeast`. Only observations inside the bounding box will be returned. Defaults to [90, -180] which is 90 degrees North, and 180 degrees West.

#### option: southeast

An optional pair of Float numbers representing the South East corner of the bounding box. Used in conjunction with `northwest`. Only observations inside the bounding box will be returned. Defaults to [-90, 180] which is 90 degrees South, and 180 degrees East.

If both `northwest` and `southeast` are not provided, then the bounding box will encompass the entire world.

#### option: done

An optional callback function that will return an array of Observation objects as the first parameter.

### Observation.attributes

With an Observation object, the basic metadata properties can be retrieved:

	observation.attributes();

Example attributes for an observation from an OGC SOS:

	{
		latitude: 51.000,
		longitude: -114.000,
		offering: "temperature",
		property: "urn:ogc:def:property:noaa:ndbc:water temperature",
		sensor_id: "snr_301",
		sensor_type: "SOS",
		service_url: "http://example.com/sos",
		unit: "celcius"
	}

### Observation.describe

For Observations, the [sensorML document](http://www.opengeospatial.org/standards/sensorml) can be retrieved for additional metadata. It is then possible to use [jQuery's traversal API](http://api.jquery.com/category/traversing/) to navigate the result.

	observation.describe({
		done: function (sensorML) {
			var intendedApp = sensorML.find("classifier[name~='intendedApplication']").text();
			// "water temperature monitoring"
		}
	});

Note that the sensorML document may or may not include the `classifier` element; it is up to the user to determine useful data from the sensorML document.

### Observation.getTimeSeries

The time series records can be retrieved:

	observation.getTimeSeries({
		start: new Date("2013-01-01 00:00:00Z"),
		end:   new Date("2013-05-28 00:00:00Z"),
		done:  function (seriesData) {
			window.seriesData = seriesData;
		}
	});

If you only need recent data, try this:

	observation.getTimeSeries({
		interval: 168,
		done:  function (seriesData) {
			window.seriesData = seriesData;
		}
	});

This will retrieve the most recent 168 hours of data, regardless of start or end date.

#### option: start

An optional Date object specifying the start limit of the time series.

#### option: end

An optional Date object specifying the end limit of the time series.

#### option: interval

The number of hours of data to retrieve from the SOS. Ignored if both `start` and `end` are set. If used without `start` and `end` set (or set to `null`) then then most recent *n* hours of observations will be retrieved, regardless of start or end date.

#### option: done

An optional callback function that will return an array of Time Series objects as the first parameter. Example response:

	[{
		timestamp: 1356998400000,
		value: 3.88
	},
	{
		timestamp: 1369699200000,
		value: 5.22
	}]

The array is presorted on the server side in ascending timestamp order.

### Observation.getRawTimeSeries

An alternative is available that **skips** the caching function for an observation.

	observation.getRawTimeSeries({
		start: new Date("2013-01-01 00:00:00Z"),
		end:   new Date("2013-05-28 00:00:00Z"),
		done:  function (seriesData) {
			window.seriesData = seriesData;
		}
	});

If you only need recent data, try this:

	observation.getRawTimeSeries({
		interval: 168,
		done:  function (seriesData) {
			window.seriesData = seriesData;
		}
	});

This will retrieve the most recent 168 hours of data, regardless of start or end date.

#### option: start

An optional Date object specifying the start limit of the time series.

#### option: end

An optional Date object specifying the end limit of the time series.

#### option: interval

The number of hours of data to retrieve from the SOS. Ignored if both `start` and `end` are set. If used without `start` and `end` set (or set to `null`) then then most recent *n* hours of observations will be retrieved, regardless of start or end date.

#### option: done

An optional callback function that will return an array of Time Series objects as the first parameter. Example response:

	[{
		timestamp: 1356998400000,
		value: 3.88
	},
	{
		timestamp: 1369699200000,
		value: 5.22
	}]

The array is presorted on the server side in ascending timestamp order. Data will not be cached and will not be accessible in `seriesData`.

### Observation.seriesData

Retrieve a sorted array of timeseries objects for an SOS Observation, based on data already retrieved by `getTimeSeries()` operations. If `getTimeSeries()` has not yet been called, `seriesData()` will return an empty array.


### Translation Engine Customization

The Translation Engine URL is hard-coded into the library. It is a GeoCENS proxy service that retrieves data from OGC SOS and provides easily-consumed data. Users can optionally override it:

	Geocens.TranslationEngine.setPath("http://example.com/translation-engine/");

After override, all new requests will use the new Translation Engine path.

### Geocens.DataService

Define a Data Service object with your Data Service API key:

	var dsSource = new Geocens.DataService({
		api_key: "your_32_character_api_key"
	});

### Geocens.DataService.getApiKeyStatus

To check if an API Key is valid, the following asynchronous function can be used.

	dsSource.getApiKeyStatus({
		api_key: "your_32_character_api_key",
		done: function(status) {
			// Key exists. `status` is true if key has write access,
			// false if key is read-only.
		},
		fail: function(error) {
			// Key does not exist, and is invalid.
		}
	});

In the case that the API Key is known to the Data Service, the `done` handler will be called with an argument that is `true` for when the API Key has write-access to the GeoCENS Data Service, or `false` when the key is read-only.

If the key is not known to the Data Service, the `done` handler will not be called, and `fail` will be called instead. `fail` will also be called in the case the Data Service is unreachable. The `fail` handler will have an argument with the string value of the error message, which may be one of the following:

* "Not Found"
	* Will be returned when the API Key is not valid.
* "Unprocessable Entity"
	* Will be returned when the API Key to check was not sent to the server.
* "Service Unavailable"
	* Will be returned when the Data Service is unavailable. Retrying the request is recommended.

### Geocens.DataService.getSensors

An API Key gives access to certain sensors for a user in the GeoCENS Data Service. This method can be used to get a list of sensors for an API Key.

	dsSource.getSensors({
		done: function (sensors) {
			window.sensors = sensors;
		}
	});

When the sensors have been retrieved from the server, the `done` callback will be called. The `sensors` parameter will contain an array of zero or more Sensor objects. From there, each of the Sensor objects can be used to load their datastreams or metadata.

### Geocens.DataService.getRawSensors

Similar to `getSensors`, but will return the JSON objects from the GeoCENS Data Service without being formatted as Sensor objects.

	dsSource.getRawSensors({
		done: function (sensors) {
			window.sensors = sensors;
		}
	});

This function was formerly specified as a separate callback in `getSensors`.

### Geocens.DataService.getSensor

Use a Data Service object to retrieve a single sensor with its sensor ID:

	dsSource.getSensor({
		sensor_id: "32_character_sensor_id",
		done: function (sensor) {
			window.sensor = sensor;
		}
	});

These can be combined:

	Geocens.DataService.getSensor({
		api_key: "your_32_character_api_key",
		sensor_id: "32_character_sensor_id",
		done: function (sensor) {
			window.sensor = sensor;
		}
	});

The `done` option will return the Sensor object as the first parameter after the metadata has been retrieved.

### Sensor.metadata

With a Sensor object, the basic metadata properties can be retrieved:

	sensor.metadata;

Example attributes for a sensor from GeoCENS Data Service:

	{
		id: "radio-1",
		uid: "2c8df396cf668a78b643ccf6ed7a5947",
		title: "Demonstration Sensor Radio-1",
		contact_email: "james@geocens.ca",
		description: "lorem ipsum",
		contact_name: "James Badger",
		loc: [
			51.08125,
			-114.13412
		],
		user: "demo@geocens.ca",
		phens: [
			"airquality"
		]
	}

### Sensor.getDatastreams

With a Sensor object, an array of Datastream objects for that sensor can be retrieved:

	sensor.getDatastreams({
		done: function (datastreams) {
			window.datastreams = datastreams;
		}
	});

When the datastreams have been retrieved from the server, the `done` callback will be called. The `datastreams` parameter will contain an array of zero or more Datastream objects. From there, each of the Datastream objects can be used to load their time series or attributes.

### Sensor.getRawDatastreams

Similar to `getDatastreams`, but will return the JSON objects from the GeoCENS Data Service without being formatted as Datastream objects.

	sensor.getDatastreams({
		done: function (data) {
			window.datastreamJSON = data;
		}
	});

This function was formerly specified as a separate callback in `getDatastreams`.


### Sensor.datastreams

Return an array of Datastream objects for this Sensor. If the datastreams for this sensor have not been downloaded from GeoCENS using `Sensor.getDatastreams()`, then `null` will be returned. If the datastream sensors have been downloaded, then an array of datastreams will be returned. If the datastream information for the sensor has been retrieved and there are no datastreams for this sensor, then an empty array will be returned.

Example usage:

	var streamsList = sensor.datastreams;

### Geocens.DataService.getDatastream

Use a Data Service object to retrieve a singular datastream with its sensor ID and datastream ID:

	dsSource.getDatastream({
		sensor_id: "32_character_sensor_id",
		datastream_id: "32_character_datastream_id",
		done: function (datastream) {
			window.datastream = datastream;
		}
	});

These can be combined:

	Geocens.DataService.getDatastream({
		api_key: "your_32_character_api_key",
		sensor_id: "32_character_sensor_id",
		datastream_id: "32_character_datastream_id",
		done: function (datastream) {
			window.datastream = datastream;
		}
	});

The `done` option will return the Datastream object as the first parameter after the metadata has been retrieved.

### Datastream.attributes

With a Datastream object, the basic metadata properties can be retrieved:

	datastream.attributes();

Example attributes for a datastream from GeoCENS Data Service:

	{
		uid: "ccc92c6fe57dff592ff687d99c4ebf70",
		id: "carbonMonoxide",
		sensor: {
			id: "5C-86-4A-00-2C-9E",
			user: "bob@example.com",
			uid: "4ddecd5124661f9442cfca8be23f8dda",
			altitude: 1100,
			samplingrate: 0,
			loc: [51,-114],
			title: "Our first integration Testing",
			height: 0,
			nickName: "Alpha",
			description: "",
			last_time_online: "2012-09-18T21:04:40",
			phens: [
				"airtemperature",
				"relatedhumidity",
				"airquality",
				"hydrogentest",
				"hydrogentest1Name"
			]
		},
		unit: "ppm",
		phenName: "airquality",
		user: "bob@example.com"
	}

### Datastream.getTimeSeries

The time series observations can be retrieved:

	datastream.getTimeSeries({
		limit:  100,
		skip:   100,
		start:  new Date("2013-01-01 00:00:00Z"),
		end:    new Date("2013-05-28 00:00:00Z"),
		recent: false,
		done:   function (seriesData) {
			window.seriesData = seriesData;
		}
	});

#### option: start

An optional Date object specifying the start limit of the time series. If left empty, will default to 24 hours ago.

Ignored if `recent` is set to `true`.

#### option: end

An optional Date object specifying the end limit of the time series. If left empty, will default to current date.

Ignored if `recent` is set to `true`.

### option: done

This callback function will return the series data as the first parameter after it has been retrieved.

### option: limit

The number of records retrieved can be limited to this integer value. The Data Service starts counting at the newest time/value pair, so setting a limit of "1" would return the *latest* value in a time range, not the *earliest*.

If left empty, no limit will be applied to the number of records returned by the Data Service.

### option: skip

Skip the latest *n* records returned from the Data Service (it sorts date *descending*). Can be used with `limit` to emulate pagination.

If left empty, no time series records will be skipped.

### option: recent

If `recent` is `true`, then the `start` and `end` date options will be ignored and **all** data points in the time series will be returned. For performance reasons, it is recommended that the `limit` option is specified to reduce the potential size of the response from the GeoCENS Data Service.

For example, specifying `recent` as `true` and `limit` as `200` will return the 200 most recent time series results, regardless of start/end date.

If left empty, will default to `false`.

(There is no support currently for the opposite use case, retrieving the oldest *n* results.)

#### Result

The `getTimeSeries` method will return an array of time series objects:

	[{
		timestamp: 1356998400000,
		value: 3.88
	},
	{
		timestamp: 1369699200000,
		value: 5.22
	}]

The returned objects contain timestamp and value properties. The timestamps correspond to the number of milliseconds since January 1, 1970, 00:00:00 UTC. They can be parsed with JavaScript's built-in Date library: `new Date(1356998400000)`.

If the `getTimeSeries` method is called multiple times (with the same or different options) then the results will be merged and can be retrieved with `datastream.seriesData()`.

### Datastream.getRawTimeSeries

Similarly, the time series observations can be retrieved **without** being cached in the datastream object:

	datastream.getRawTimeSeries({
		limit:  100,
		skip:   100,
		start:  new Date("2013-01-01 00:00:00Z"),
		end:    new Date("2013-05-28 00:00:00Z"),
		recent: false,
		done:   function (seriesData) {
			window.seriesData = seriesData;
		}
	});

#### option: start

An optional Date object specifying the start limit of the time series. If left empty, will default to 24 hours ago.

Ignored if `recent` is set to `true`.

#### option: end

An optional Date object specifying the end limit of the time series. If left empty, will default to current date.

Ignored if `recent` is set to `true`.

### option: done

This callback function will return the series data as the first parameter after it has been retrieved. See below for the result format.

### option: limit

The number of records retrieved can be limited to this integer value. The Data Service starts counting at the newest time/value pair, so setting a limit of "1" would return the *latest* value in a time range, not the *earliest*.

If left empty, no limit will be applied to the number of records returned by the Data Service.

### option: skip

Skip the latest *n* records returned from the Data Service (it sorts date *descending*). Can be used with `limit` to emulate pagination.

If left empty, no time series records will be skipped.

### option: recent

If `recent` is `true`, then the `start` and `end` date options will be ignored and **all** data points in the time series will be returned. For performance reasons, it is recommended that the `limit` option is specified to reduce the potential size of the response from the GeoCENS Data Service.

For example, specifying `recent` as `true` and `limit` as `200` will return the 200 most recent time series results, regardless of start/end date.

If left empty, will default to `false`.

(There is no support currently for the opposite use case, retrieving the oldest *n* results.)

#### Result

The `getRawTimeSeries` method will return an array of time series objects:

	[{
		timestamp: 1356998400000,
		value: 3.88
	},
	{
		timestamp: 1369699200000,
		value: 5.22
	}]

The returned objects contain timestamp and value properties. The timestamps correspond to the number of milliseconds since January 1, 1970, 00:00:00 UTC. They can be parsed with JavaScript's built-in Date library: `new Date(1356998400000)`.

Unlike `getTimeSeries`, the data values are **not** cached in the Datastream object, and will not be accessible by `seriesData`.

### Datastream.seriesData

Retrieve a sorted array of timeseries objects for a datastream, based on data already retrieved by `getTimeSeries()` operations. If `getTimeSeries()` has not yet been called, `seriesData()` will return an empty array.

### Data Service Customization

The Data Service URL is hard-coded into the library. Users can optionally override it:

	Geocens.DataService.setPath("http://dataservice.example.com/");

After override, all new requests will use the new Data Service path.

<a name="chartVisualization"></a>
## Chart Visualization

The GeoCENS JS API has an optional module for drawing simple charts. It requires the HighStock 1.3.2 or newer library to be installed. For a web page, include the `geocens-chart.js` file in a script tag, **after** the main `geocens.js` file.

	<script src="javascripts/highstock.js" type="text/javascript" charset="utf-8"></script>
	<script src="javascripts/geocens.js" type="text/javascript" charset="utf-8"></script>
	<script src="javascripts/geocens-chart.js" type="text/javascript" charset="utf-8"></script>

Using the chart API is intended to be an easier alternative to interfacing with HighStock yourself, because the options are pre-configured.

A quick example with a Data Service datastream source:

	// Draw the chart after time series is returned
	var drawChart = function(seriesData, datastream) {
		var chart = $("#chart").GeocensChart({
			datastream: datastream
		});
	};

	// Retrieve the time series after datastream is returned
	var getSeries = function(datastream) {
		datastream.getTimeSeries({
			done: drawChart
		});
	};

	// Retrieve the datastream
	Geocens.DataService.getDatastream({
		api_key: "your_32_character_api_key",
		sensor_id: "32_character_sensor_id",
		datastream_id: "32_character_datastream_id",
		done: getSeries
	});

In the above example, the callback chain works in reverse. It first retrieves the datastream and passes it to the second function, which retrieves the time series and passes it to the first function. The first function then draws the chart with all the series data for the datastream.

This means that if multiple `getTimeSeries` requests are made, all the cached data for that datastream will be used for drawing the time series chart.

Using the chart API with OGC SOS observations is also short:

	// Draw the chart after time series is returned
	var drawChart = function(seriesData, observation) {
		var chart = $("#chart").GeocensChart({
			observation: observation
		});
	};

	// Retrieve the time series after observations is returned (note plural)
	var getSeries = function(observations) {
		observations[0].getTimeSeries({
			done: drawChart
		});
	};

	// Retrieve the observations
	Geocens.SOS.getObservation({
		service_url: "http://www.example.com/sos",
		offering: "sos_offering",
		property: "sos_property",
		done: getSeries
	});

This example works in an identical manner to the Data Service example. As with the other example, in the case that multiple `getTimeSeries` requests are made, all the cached data for that observation will be used for drawing the time series chart.

#### option: observation

Pass in a OGC SOS observation object to the chart, which will draw the time series using the cached time series data. If specified with `datastream`, will take precedence.

#### option: datastream

Pass in a Data Service datastream object to the chart, which will draw the time series using the cached time series data. If specified with `observation`, it will not be used.

#### option: chart

A JavaScript object with HighStock compatible configuration options. These options will be passed to the chart when it is created, overriding defaults set by the GeoCENS JS API chart module. Note that certain properties may not be overridden.

#### options: dataEvents

A JavaScript object with event callbacks that will be applied to the data series in the Highstock chart. Will default to an empty object if left blank. As the callbacks will be passed to Highstock, `this` will be bound to the point the user triggers the event upon.

<a name="mapVisualization"></a>
## Map Visualization

The GeoCENS JS API has an optional module for mapping datastreams and/or observations. It requires the [Leaflet](http://leafletjs.com/) 0.6.0 or newer library to be installed. For a web page, include the `geocens-map.js` file in a script tag, **after** the main `geocens.js` file. It can be included with the `geocens-chart.js` module without conflict.

	<script src="javascripts/jquery.js" type="text/javascript" charset="utf-8"></script>
	<script src="javascripts/leaflet.js" type="text/javascript" charset="utf-8"></script>
	<script src="javascripts/geocens.js" type="text/javascript" charset="utf-8"></script>
	<script src="javascripts/geocens-map.js" type="text/javascript" charset="utf-8"></script>

The Map API makes it easy to draw map markers on a map without having to customize the markers and popups yourself. Getting started is as easy as [getting started with the Leaflet Library](http://leafletjs.com/examples/quick-start.html). An interactive demo is available in the `demo` directory.

1. Include the Leaflet CSS files
2. Include the Leaflet JS file
3. Add a div element for the map
4. Set the height on the div element
5. Set up the map (see following code example)

		$(document).ready(function() {
			var map = L.map('map', {
				center: [51.07993, -114.131802],
				zoom: 3
			});

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			// Add SOS Observations to the map
			var mapObservations = function(observations) {
				// Returns a Leaflet FeatureGroup containing the markers.
				var markerGroup = L.geocens(observations, {
					// Custom marker options.
					// See Leaflet Marker Options documentation.
					marker: {
						clickable: true // note: setting clickable to false will disable popups
					},

					// Return custom HTML content for marker popups.
					// `datasource` refers to the datastream/observation for
					// the popup. `event` is the click event that activated
					// the popup, and `marker` is the one the user clicked.
					popupContent: function(datasource, event, marker) {
						return datasource.name();
					}
				});

				markerGroup.addTo(map);
			};

			// Retrieve the observations
			Geocens.SOS.getObservation({
			  service_url: "http://app.geocens.ca:8171/sos",
			  offering: "Temperature",
			  property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
			  done: mapObservations
			});

		}());

In the above example, a group of observations from an OGC SOS server are added to a map. Each marker on the map corresponds to a observation/procedure from the SOS, and displays a popup with the observed property/procedure id.

### L.geocens

This is a Leaflet function that is designed to add data from GeoCENS JS API data sources. It can be used on multiple input types:

	// A single OGC SOS observation
	L.geocens(observation);

	// An array of OGC SOS observations
	L.geocens(observations);

	// A single GeoCENS Data Service datastream
	L.geocens(datastream);

	// An array of GeoCENS Data Service datastreams
	L.geocens(datastreams);

All instances will return a Leaflet FeatureGroup.

The function also supports an options input, allowing the markers and popups to be customized. Modifying these will override the defaults.

	L.geocens(observations, {
		marker: {
			clickable: true
		},

		popupContent: function(datasource, event, marker) {
			return datasource.name();
		}
	});

#### option: marker

Custom Leaflet Marker options, applied to every marker generated from the input data. See the [Leaflet Marker option documentation](http://leafletjs.com/reference.html#marker-options) for options.

By default, it will apply no customization to the markers and they will appear as the Leaflet default markers.

#### option: popup

Custom Leaflet Popup options, applied to the popup that is displayed when a marker is clicked. See the [Leaflet Marker option documentation](http://leafletjs.com/reference.html#popup-options) for options.

#### option: popupContent

Custom content to be inserted into popups. Whenever a user clicks on a marker, it will trigger this function to determine what HTML content will be displayed in the popup for the marker. The function will return the `datasource`, `event` and `marker`. The `datasource` is the observation or datastream for the marker; it can be queried using their respective APIs. The `event` is the [Leaflet click event](http://leafletjs.com/reference.html#mouse-event) for the popup. The `marker` is the [Leaflet marker](http://leafletjs.com/reference.html#marker) the user clicked on.

Note that if click events are disabled for the marker (in the marker options), then the popup will not be displayed.
