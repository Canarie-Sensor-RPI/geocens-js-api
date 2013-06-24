// Fixtures

window.Fixtures = {
  DataService: {
    Datastream: {
      uid: "ccc92c6fe57dff592ff687d99c4ebf70",
      id: "carbonMonoxide",
      sensor: "5C-86-4A-00-2C-9E",
      unit: "ppm",
      phenName: "airquality",
      user: "bob@example.com"
    },

    Sensor: {
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
    }
  },

  SOS: {
    Descriptions: [
    // 0
    '<?xml version="1.0" encoding="UTF-8"?><sml:SensorML xmlns="http://www.opengis.net/sensorML/1.0.1" xmlns:gml="http://www.opengis.net/gml" xmlns:sml="http://www.opengis.net/sensorML/1.0.1" xmlns:swe="http://www.opengis.net/swe/1.0.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.1" xsi:schemaLocation="http://www.opengis.net/sensorML/1.0.1 http://schemas.opengis.net/sensorML/1.0.1/sensorML.xsd"><sml:identification><sml:IdentifierList><sml:identifier name="URN"><sml:Term definition="urn:ogc:def:identifierType:OGC:uniqueID"><sml:value>urn:ogc:object:Sensor:universityofsaskatchewan:ip3:snr_0000001</sml:value></sml:Term></sml:identifier><sml:identifier name="longName"><sml:Term><sml:value>sensor snr_0000001 in ip3 simu db</sml:value></sml:Term></sml:identifier><sml:identifier name="shortName"><sml:Term><sml:value>snr_0000001</sml:value></sml:Term></sml:identifier><sml:identifier name="modelNumber"><sml:Term><sml:value>Vaisala HMP35CF</sml:value></sml:Term></sml:identifier><sml:identifier name="manufacturer"><sml:Term><sml:value>universityofsaskatchewan</sml:value></sml:Term></sml:identifier></sml:IdentifierList></sml:identification><sml:classification><sml:ClassifierList><sml:classifier name="intendedApplication"><sml:Term><sml:value>Sesnor Data Management</sml:value></sml:Term></sml:classifier><sml:classifier name="sensorType"><sml:Term><sml:value>AirTemp</sml:value></sml:Term></sml:classifier><sml:classifier name="phenomenon"><sml:Term><sml:value>airtemperature,runoff,relativehumidity,longwaveradiation,precipitation,solarradiation_2,solarradiation_1,specifichumidity,barometricpressure,windspeed</sml:value></sml:Term></sml:classifier></sml:ClassifierList></sml:classification><sml:member><sml:System xmlns:gml="http://www.opengis.net/gml" gml:id="snr_0000001"><sml:position name="actualPosition"><swe:Position fixed="false" referenceFrame="urn:ogc:crs:epsg:4326"><swe:location><swe:Vector><swe:coordinate name="x"><swe:Quantity><swe:value>-133.4405</swe:value></swe:Quantity></swe:coordinate><swe:coordinate name="y"><swe:Quantity><swe:value>68.73805</swe:value></swe:Quantity></swe:coordinate></swe:Vector></swe:location></swe:Position></sml:position><sml:inputs><sml:InputList><sml:input name="airtemperature"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:airtemperature" /></sml:input><sml:input name="runoff"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:runoff" /></sml:input><sml:input name="relativehumidity"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:relativehumidity" /></sml:input><sml:input name="longwaveradiation"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:longwaveradiation" /></sml:input><sml:input name="precipitation"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:precipitation" /></sml:input><sml:input name="solarradiation_2"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:solarradiation_2" /></sml:input><sml:input name="solarradiation_1"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:solarradiation_1" /></sml:input><sml:input name="specifichumidity"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:specifichumidity" /></sml:input><sml:input name="barometricpressure"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:barometricpressure" /></sml:input><sml:input name="windspeed"><swe:ObservableProperty definition="urn:ogc:def:property:universityofsaskatchewan:ip3:windspeed" /></sml:input></sml:InputList></sml:inputs><sml:outputs><sml:OutputList><sml:output name="airtemperature measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:airtemperature"><swe:uom code="celsius" /></swe:Quantity></sml:output><sml:output name="runoff measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:runoff"><swe:uom code="m?/s" /></swe:Quantity></sml:output><sml:output name="relativehumidity measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:relativehumidity"><swe:uom code="%" /></swe:Quantity></sml:output><sml:output name="longwaveradiation measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:longwaveradiation"><swe:uom code="N/A" /></swe:Quantity></sml:output><sml:output name="precipitation measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:precipitation"><swe:uom code="mm" /></swe:Quantity></sml:output><sml:output name="solarradiation_2 measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:solarradiation_2"><swe:uom code="W/m?" /></swe:Quantity></sml:output><sml:output name="solarradiation_1 measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:solarradiation_1"><swe:uom code="W/m?" /></swe:Quantity></sml:output><sml:output name="specifichumidity measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:specifichumidity"><swe:uom code="g/g" /></swe:Quantity></sml:output><sml:output name="barometricpressure measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:barometricpressure"><swe:uom code="kPa" /></swe:Quantity></sml:output><sml:output name="windspeed measurements"><swe:Quantity definition="urn:ogc:def:property:universityofsaskatchewan:ip3:windspeed"><swe:uom code="m/s" /></swe:Quantity></sml:output></sml:OutputList></sml:outputs></sml:System></sml:member></sml:SensorML>'
    ],

    Observations: [
    // 0
    {
      "observations": [
        {
          "serviceURI": "http://www.example.com/sos",
          "offeringIndex": "13",
          "propertyIndex": "48",
          "offeringName": "Temperature",
          "offeringID": "Temperature",
          "propertyName": "urn:ogc:def:property:noaa:ndbc:Water Temperature",
          "topleftLat": "90.0",
          "topleftLon": "-180.0",
          "bottomrightLat": "-90.0",
          "bottomrightLon": "180.0",
          "data": [
            {
              "id": "sensor_1",
              "lat": "51.07993",
              "lon": "-114.131802",
              "readings": [
                {
                  "time": "2013-06-19T18:00:00Z",
                  "value": "39.859"
                }
              ]
            }
          ],
          "unit": "Celcius"
        }
      ],
      "number_response_sensor": "1",
      "number_all_sensor": "85"
    }
    ],

    TimeSeries: [
    // 0
    "Pressure,urn:ogc:def:property:noaa:ndbc:Atmospheric Pressure,snr_32st0,-19.713,-85.585,mb,2011|12|22|4|0|0|0|1015.0*2011|12|22|7|0|0|0|1014.0*2011|12|22|13|0|0|0|1016.0*2011|12|22|19|0|0|0|1015.0*2011|12|23|1|0|0|0|1016.0*2011|12|23|4|0|0|0|1016.0"
    ]
  },

  TimeSeries: [
    // 0
    [{
      id: "2013-01-01T00:00:00",
      reading: "3.88"
    },
    {
      id: "2013-05-28T00:00:00",
      reading: "5.22"
    }],
    // 1
    [{
      id: "2012-01-01T00:00:00",
      reading: "2.88"
    },
    {
      id: "2012-05-28T00:00:00",
      reading: "4.22"
    }]
  ]
};
