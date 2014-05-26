//    geocens-chart.js 1.2.5

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($) {
  var root = this,
      chart,
      defaults;

  defaults = root.defaults = {
    chart: {},
    dataEvents: {}
  };

  chart = root.chart = function(element, options) {
    var settings = $.extend({}, defaults, options);

    var datasource = settings.observation || settings.datastream;

    if (datasource.seriesData().length === 0) {
      console.warn("Warning: trying to graph empty time series");
    }

    // Convert data format
    var seriesData = $.map(datasource.seriesData(), function(datapoint) {
      return [[datapoint.timestamp, datapoint.value]];
    });

    // Set out default chart options
    var chartDefaults = {
      chart: {
        renderTo: element
      },

      title: {
        text: datasource.name()
      },

      tooltip: {
          formatter: function () {
              var point = this.points[0];
              var series = point.series;
              var format = '%A, %b %e, %Y, %H:%M:%S';

              if (series.tooltipHeaderFormat) {
                  format = series.tooltipHeaderFormat;
              }

              return "<strong>" + Highcharts.dateFormat(format, this.x) +
                     "</strong><br>" + series.name + ": " +
                     Highcharts.numberFormat(point.y, 2) + " " +
                     datasource.units();
          }
      },

      rangeSelector: {
          enabled: true
      },

      series: [{
          name: datasource.name(),
          data: seriesData,
          events: settings.dataEvents
      }],

      xAxis: {
          ordinal: false,
          type: 'datetime'
      },

      yAxis: {
          offset: 50,
          title: {
              text: datasource.units()
          }
      }
    };

    var chartOptions = $.extend(true, {}, chartDefaults, settings.chart);
    var stockChart = new Highcharts.StockChart(chartOptions);

    return {
      chart: stockChart
    };
  };

  $.fn.GeocensChart = function () {
    var ret = [];
    var options = arguments[0];
    this.each(function () {
      ret.push(new chart(this, options));
    });

    if (ret.length === 1) {
      return ret[0];
    } else {
      return ret;
    }
  };

})(jQuery);
