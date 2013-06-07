# GeoCENS JavaScript API

The GeoCENS JavaScript API can be used to retrieve geospatial sensor data from either the GeoCENS Data Service or OGC SOS compatible services, and display the information on a map or chart.

## Requirements

* jQuery 1.10.1 or newer

## Installation

For a web page, include the `geocens.js` file in a script tag:

		<script src="javascripts/geocens.js" type="text/javascript" charset="utf-8"></script>

## Getting Started

Here is a brief introduction on how to retrieve data from the GeoCENS Data Service, with an API Key. If you do not already have a key, please contact us at <info@geocens.ca> or use the JS API to load data from an OGC SOS compatible service.

In this example, we will retrieve data from a sensor. First, we connect to the Data Service and download the sensor information:

		var sensor = Geocens.DataService.getSensor({
			api_key: "your_32_character_api_key",
			sensor_id: "32_character_sensor_id",
			datastream_id: "32_character_datastream_id"
		});

This provides us with a `Sensor` object. We can retrieve properties for the Sensor:

		sensor.attributes();

Which returns an object with the properties:

		{
			datastream_id: "4e1552900482a04b8850e4c4b097b690",
			latitude: 51.000,
			longitude: -114.000,
			property: "airtemperature",
			sensor_id: "d0bcf2894edc50a5160c52a4015bc768",
			sensor_type: "DataService",
			service_url: "http://example.com/data_service",
			unit: "celcius",
			user: "bob@example.com",
			user_id: "4b9bb80620f03eb3719e0a061c14283d"
		}

We can also use the Sensor object to retrieve the latest time series observations:

		var series = sensor.getTimeSeries();

If no options are passed into `getTimeSeries()`, then it will default to retrieving the latest 24 hours of data, capped at 1000 points. See the USAGE section below for instructions on overriding this.

The `getTimeSeries()` method will cache the results in the Sensor object, and return an array of objects:

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

TODO: Explain the API

## Developing and Extending

TODO: Explain how to add features/fixes to the JS API

## Running Test

TODO: How to run the included test suite

## License

2013, James Badger, Geo Sensor Web Lab, All Rights Reserved.
