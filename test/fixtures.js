// Fixtures

window.Fixtures = {
  DataService: {
    Sensor: {
      datastream_id: "4e1552900482a04b8850e4c4b097b690",
      latitude: 51.000,
      longitude: -114.000,
      property: "airquality",
      sensor_id: "d0bcf2894edc50a5160c52a4015bc768",
      sensor_type: "DataService",
      service_url: "http://example.com/data_service",
      unit: "ppm",
      user: "bob@example.com",
      user_id: "4b9bb80620f03eb3719e0a061c14283d"
    }
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
