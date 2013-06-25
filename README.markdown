# GeoCENS JavaScript API

The GeoCENS JavaScript API can be used to retrieve geospatial sensor data from either the GeoCENS Data Service or OGC SOS compatible services, and display the information on a map or chart.

## Requirements

* jQuery 1.10.1 or newer

## Installation

For a web page, include the `geocens.js` file in a script tag:

		<script src="javascripts/geocens.js" type="text/javascript" charset="utf-8"></script>

## Getting Started

Here is a brief introduction on how to retrieve data from the GeoCENS Data Service, with an API Key. If you do not already have a key, please contact us at <info@geocens.ca> or use the JS API to load data from an OGC SOS compatible service. An interactive demo is available in the `demo` directory.

In this example, we will retrieve a datastream. First, we connect to the Data Service and download the datastream information:

		Geocens.DataService.getDatastream({
			api_key: api_key,
			sensor_id: sensor_id,
			datastream_id: datastream_id,
			done: function (datastream) {
				window.newDatastream = datastream;
			}
		});

This provides us with a `Datastream` object in the `done` callback. We can retrieve properties for the Datastream:

		datastream.attributes();

Which returns an object with the properties:

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

We can also use the Datastream object to retrieve the latest time series records:

		datastream.getTimeSeries({
			done: function (seriesData) {
				window.seriesData = seriesData;
			}
		});

By default, `getTimeSeries()` will retrieve all observation values from the Data Service. (Support for filters is coming soon.)

The `getTimeSeries()` method will cache the results in the Datastream object, and return an array of objects:

		[{
			timestamp: 1356998400000,
			value: 3.88
		},
		{
			timestamp: 1369699200000,
			value: 5.22
		}]

The returned objects contain timestamp and value properties. The timestamps correspond to the number of milliseconds since January 1, 1970, 00:00:00 UTC. They can be parsed with JavaScript's built-in Date library: `new Date(1356998400000)`.

## Usage

#### Geocens.noConflict

If you are using a variable that already is called `Geocens`, you can prevent the GeoCENS JS API from overwriting it. The `noConflict()` method will return the `Geocens` variable back to the previous owner/value.

		var GeocensAPI = Geocens.noConflict();
		var sosSource = GeocensAPI.SOS({…});

### Loading Data

The library can load data from either an [OGC SOS compatible service](http://www.opengeospatial.org/standards/sos), or from our GeoCENS Data Service.

#### Geocens.SOS

Define an OGC SOS object with the SOS URL:

		var sosSource = new Geocens.SOS({
			service_url: "http://www.example.com/sos"
		});

This object can be reused to use the same `service_url` for multiple `getObservation` invocations.

#### Geocens.SOS.getObservation

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

##### option: offering

The SOS Offering key. Can be used to filter into a logical group of observations. Is required.

##### option: property

The SOS Observed Property key. Can be used to filter observations by physical phenomena. Note that it is typically a [URN](http://en.wikipedia.org/wiki/Uniform_resource_name). Is required.

##### option: northwest

An optional pair of Float numbers representing the North West corner of the bounding box. Used in conjunction with `southeast`. Only observations inside the bounding box will be returned. Defaults to [90, -180] which is 90 degrees North, and 180 degrees West.

##### option: southeast

An optional pair of Float numbers representing the South East corner of the bounding box. Used in conjunction with `northwest`. Only observations inside the bounding box will be returned. Defaults to [-90, 180] which is 90 degrees South, and 180 degrees East.

If both `northwest` and `southeast` are not provided, then the bounding box will encompass the entire world.

##### option: done

An optional callback function that will return an array of Observation objects as the first parameter.

#### Observation.attributes

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

#### Observation.describe

For Observations, the [sensorML document](http://www.opengeospatial.org/standards/sensorml) can be retrieved for additional metadata. It is then possible to use [jQuery's traversal API](http://api.jquery.com/category/traversing/) to navigate the result.

		observation.describe({
			done: function (sensorML) {
				var intendedApp = sensorML.find("classifier[name~='intendedApplication']").text();
				// "water temperature monitoring"
			}
		});

Note that the sensorML document may or may not include the `classifier` element; it is up to the user to determine useful data from the sensorML document.

#### Observation.getTimeSeries

The time series records can be retrieved:

		observation.getTimeSeries({
			start: new Date("2013-01-01 00:00:00Z"),
			end:   new Date("2013-05-28 00:00:00Z"),
			done:  function (seriesData) {
				window.seriesData = seriesData;
			}
		});

##### option: start

An optional Date object specifying the start limit of the time series.

##### option: end

An optional Date object specifying the end limit of the time series.

##### option: done

An optional callback function that will return an array of Time Series objects as the first parameter. Example response:

		[{
			timestamp: 1356998400000,
			value: 3.88
		},
		{
			timestamp: 1369699200000,
			value: 5.22
		}] 

#### Observation.seriesData

Retrieve a sorted array of timeseries objects for an SOS Observation, based on data already retrieved by `getTimeSeries()` operations. If `getTimeSeries()` has not yet been called, `seriesData()` will return an empty array.


#### Translation Engine Customization

The Translation Engine URL is hard-coded into the library. It is a GeoCENS proxy service that retrieves data from OGC SOS and provides easily-consumed data. Users can optionally override it:

		Geocens.TranslationEngine.setPath("http://example.com/translation-engine/");

After override, all new requests will use the new Translation Engine path.

#### Geocens.DataService

Define a Data Service object with your Data Service API key:

		var dsSource = new Geocens.DataService({
			api_key: "your_32_character_api_key"
		});

#### Geocens.DataService.getDatastream

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

#### Datastream.attributes

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

#### Datastream.getTimeSeries

The time series observations can be retrieved:

		datastream.getTimeSeries({
			limit: 100,
			skip: 100,
			done: function (seriesData) {
				window.seriesData = seriesData;
			}
		});

Support for filtering based on start and end dates is coming soon.

#### done

This callback function will return the series data as the first parameter after it has been retrieved.

#### limit

The number of records retrieved can be limited to this integer value. The Data Service starts counting at the newest time/value pair, so setting a limit of "1" would return the *latest* value in a time range, not the *earliest*.

#### limit

Skip the latest *n* records returned from the Data Service (it sorts date *descending*). Can be used with `limit` to emulate pagination.

##### Result

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

#### Datastream.seriesData

Retrieve a sorted array of timeseries objects for a datastream, based on data already retrieved by `getTimeSeries()` operations. If `getTimeSeries()` has not yet been called, `seriesData()` will return an empty array.

#### Data Service Customization

The Data Service URL is hard-coded into the library. Users can optionally override it:

		Geocens.DataService.setPath("http://dataservice.example.com/");

After override, all new requests will use the new Data Service path.

### Chart Visualization

TODO: Add API documentation for the chart module

### Map Visualization

TODO: Add API documentation for the map module

## Developing and Extending

TODO: Explain how to add features/fixes to the JS API

## Running Test

There is a test suite for ensuring the JS API meets its requirements. The JS API is build with Behaviour Driven Development ([BDD](http://dannorth.net/introducing-bdd/)), which focuses on defining *requirements* before any code is written. This keeps new code clean and concise, only enough to satisfy the new behaviour.

The tests can be run in a web browser by opening the `test/index.html` file. They are based on [Qunit](http://qunitjs.com/).

Alternatively, the tests can be run from the command line if Node and NPM is installed.

		$ npm install -g grunt-cli
		$ npm install
		$ grunt qunit

See `Gruntfile.js` for more tasks that can be run from the command line.

## License

2013, James Badger, Geo Sensor Web Lab, All Rights Reserved.
