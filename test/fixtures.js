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
