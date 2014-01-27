1.2.2 (January 27 2014)

* Allow custom interval for SOS `getTimeSeries`. This enables retrieval of recent data without an end date.

1.2.1 (December 2 2013)

* Add `getRawTimeSeries` function as an alternative to `getTimeSeries`
* Move format conversion functions to Geocens namespace

1.2.0 (November 29 2013)

* Removed `raw` callbacks from `getSensors` and `getDatastreams`. Use `getRawSensors` and `getRawDatastreams` instead

1.1.3 (November 25 2013)

* Deep merge user-specified chart init options with default GeoCENS chart options
* Support custom user events on data points

1.1.2 (October 30 2013)

* Fix GeoCENS Chart to return Chart objects when called via JQuery selector

1.1.1 (October 29 2013)

* Add support for retrieving all time series results for a datastream

1.1.0 (October 23 2013)

* Add support for retrieving metadata for a sensor
* Add support for retrieving list of datastreams for a sensor
* Add support for retrieving list of sensors for an API key

1.0.1 (June 28 2013)

* Fix bug where new popups would stop working after being closed
* Change name `popup` callback to `popupContent` in map module
* Add `popup` option to map module for custom popup options
* Fix numbers in chart tooltip to 2 decimal places

1.0.0 (June 26 2013)

* Add GeoCENS JS API map module, for adding markers with customizable popups to Leaflet maps

0.5.0 (June 25 2013)

* Add GeoCENS JS API chart module, for easily drawing time series using the HighStock library

0.4.1 (June 25 2013)

* Add support for custom start and end times for Data Service time series retrieval

0.4.0 (June 24 2013)

* Add support for retrieving data from OGC SOS compatible servers using the GeoCENS Translation Engine

0.3.0 (June 19 2013)

* Retrieve extra detail for time series records (bug fix)
* Change URL for time series retrieval
* Add skip and limit options for time series retrieval

0.2 (June 14 2013)

* Change semantics to use "Datastream" instead of "Sensor", reflecting GeoCENS Data Service REST API

0.1 (June 14 2013)

* Basic support for GeoCENS Data Service

alpha1 (June 7 2013)

* Initialized
