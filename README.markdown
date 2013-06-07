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

### Loading Data

The library can load data from either an [OGC SOS compatible service](http://www.opengeospatial.org/standards/sos), or from our GeoCENS Data Service.

#### Geocens.SOS

Define an SOS service object:

		var sosSource = Geocens.SOS({
			service_url: "http://example.com/sos"
		});

#### Geocens.SOS.getSensors

Use an SOS service object to retrieve an array of Sensors for a given Offering and Observed Property:

		var sosSensors = sosSource.getSensors({
			offering: "temperature",
			property: "urn:ogc:def:property:noaa:ndbc:water temperature"
		});

These can be combined:

		var sosSensors = Geocens.SOS.getSensors({
			service_url: "http://example.com/sos",
			offering: "temperature",
			property: "urn:ogc:def:property:noaa:ndbc:water temperature"
		});

#### Geocens.DataService

Define a Data Service object with your Data Service API key:

		var dsSource = Geocens.DataService({
			api_key: "your_32_character_api_key"
		});

#### Geocens.DataService.getSensor

Use a Data Service object to retrieve a singular sensor with its sensor ID and datastream ID:

		var sensor = dsSource.getSensor({
			sensor_id: "32_character_sensor_id",
			datastream_id: "32_character_datastream_id"
		});

These can be combined:

		var sensor = Geocens.DataService.getSensor({
			api_key: "your_32_character_api_key",
			sensor_id: "32_character_sensor_id",
			datastream_id: "32_character_datastream_id"
		});

#### Sensor.attributes

With a Sensor object, the basic metadata properties can be retrieved:

		sensor.attributes();

Example attributes for a sensor from OGC SOS:

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

Example attributes for a sensor from GeoCENS Data Service:

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

#### Sensor.metadata

For SOS Sensors, the [sensorML document](http://www.opengeospatial.org/standards/sensorml) can be retrieved for additional metadata. It is then possible to use [jQuery's traversal API](http://api.jquery.com/category/traversing/) to navigate the result.

		var sensorMetadata = sensor.metadata();
		var intendedApp = sensorMetadata.find("classifier[name~='intendedApplication']").text();
		// "water temperature monitoring"

Note that the sensorML document may or may not include the `classifier` element; it is up to the user to determine useful data from the sensorML document.

For Data Service Sensors, the method is a no-op:

		var sensorMetadata = sensor.metadata();
		// null

#### Sensor.getTimeSeries

For all Sensors, the time series observations can be retrieved:

		var series = sensor.getTimeSeries({
			start: new Date("2013-01-01 00:00:00Z"),
			end:   new Date("2013-05-28 00:00:00Z"),
			limit: 1000
		});

There are three options that can be specified.

##### start

The start date is the earliest point to retrieve observation data. Only data after this date will be retrieved. If the property is omitted, it will default to 24 hours before the current time.

Major warning: Be very mindful of timezones. By default, a Date object will default to the current browser's time zone. Parsing an [RFC2822 or ISO8601 formatted string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) is recommended.

##### end

The end date is the latest point to retrieve observation data. Only data before this date will be retrieved. If the property is omitted, it will default to the current time.

##### limit

The maximum number of results to return. Will default to 1000 if omitted. For SOS sensors, this setting will be ignored.

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

If the `getTimeSeries` method is called multiple times (with the same or different options) then the results will be merged and can be retrieved with `Sensor.seriesData()`.

#### Sensor.seriesData

Retrieve a sorted array of timeseries objects for a Sensor, based on data already retrieved by `getTimeSeries()` operations. If `getTimeSeries()` has not yet been called, `seriesData()` will return an empty array.

#### Translation Engine Customization

The Translation Engine URL is hard-coded into the library. It is a GeoCENS proxy service that retrieves data from OGC SOS and provides easily-consumed data. Users can optionally override it:

		Geocens.TranslationEngine.setPath("http://example.com/translation-engine/");

After override, all new requests will use the new Translation Engine path.

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

## License

2013, James Badger, Geo Sensor Web Lab, All Rights Reserved.
