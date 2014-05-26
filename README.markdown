# GeoCENS JavaScript API

The GeoCENS JavaScript API can be used to retrieve geospatial sensor data from either the GeoCENS Data Service or OGC SOS compatible services, and display the information on a map or chart.

## Requirements

* jQuery 1.10.1 or newer

## Installation

For a web page, include the `geocens.js` file in a script tag:

	<script src="javascripts/geocens.js" type="text/javascript" charset="utf-8"></script>

### Alternate Install for Rails

For use with the Rails asset pipeline, try the [geocens-js-api-rails](https://github.com/Canarie-Sensor-RPI/geocens-js-api-rails) gem.

## Getting Started

Here is a brief introduction on how to retrieve data from the GeoCENS Data Service, with an API Key. If you do not already have a key, please contact us at <info@geocens.ca> or use the JS API to load data from an OGC SOS compatible service. An interactive demo is available in the `demo` directory, and the API Key from there can be used here.

In this example, we will go from an API Key to retrieving a time series for a Datastream. A Datastream is a set of data returned for a single observed property on a sensor.

First, we connect to the Data Service and download a list of sensors:

	Geocens.DataService.getSensors({
		api_key: api_key,
		done: function (sensors) {
			window.sensor = sensors[0];
		}
	});

This provides us with a `Sensor` object in the `done` callback. We can retrieve properties for the Sensor:

	sensor.metadata;

Which returns an object with the properties:

	{
		"id": "5C-86-4A-00-2C-9E",
		"user": "jamesbadger@gmail.com",
		"uid": "4ddecd5124661f9442cfca8be23f8dda",
		"altitude": 1100,
		"samplingrate": 0,
		"loc": [
			51,
			-114
		],
		"title": "Our first integration Testing",
		"height": 0,
		"nickName": "Alpha",
		"description": "",
		"last_time_online": "2012-09-18T21:04:40",
		"phens": [
			"airtemperature",
			"relatedhumidity",
			"airquality",
			"hydrogentest",
			"hydrogentest1Name"
		]
	}

We can also use the Sensor object to retrieve the list of datastreams:

	sensor.getDatastreams({
		done: function (datastreams) {
				window.datastream = datastreams[0];
		}
	});

With this `Datastream` object, we can now retrieve the time series data:

	datastream.getTimeSeries({
		done: function (seriesData) {
				window.seriesData = seriesData;
		}
	});

By default, `getTimeSeries()` will retrieve 24 hours of observation values from the Data Service.

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

Afterwards, the GeoCENS Map and GeoCENS Chart modules can be used to visualize the sensor and datastreams.

## Usage

Please see the `API REFERENCE.markdown` document for details about specific functions and usage.

## Running Test

There is a test suite for ensuring the JS API meets its requirements. The JS API is build with Behaviour Driven Development ([BDD](http://dannorth.net/introducing-bdd/)), which focuses on defining *requirements* before any code is written. This keeps new code clean and concise, only enough to satisfy the new behaviour.

The tests can be run in a web browser by opening the `test/index.html` file. They are based on [Qunit](http://qunitjs.com/).

Alternatively, the tests can be run from the command line if Node and NPM is installed.

	$ npm install -g grunt-cli
	$ npm install
	$ grunt qunit

See `Gruntfile.js` for more tasks that can be run from the command line.

## License

2013–2014, James Badger, Geo Sensor Web Lab, All Rights Reserved.
