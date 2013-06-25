//    geocens-chart.js 0.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($) {
  var root = this,
      chart,
      defaults;

  defaults = root.defaults = {
    chart: {}
  };

  chart = root.chart = function(element, options) {
    var settings = $.extend({}, defaults, options);

    var datasource = settings.observation || settings.datastream;

    if (datasource.seriesData().length === 0) {
      console.warn("Warning: trying to graph empty time series");
    }

    var seriesData = $.map(datasource.seriesData(), function(datapoint) {
      return [[datapoint.timestamp, datapoint.value]];
    });

    var stockChart = new Highcharts.StockChart({
      chart: {
         renderTo: element
      },

      title: {
       text: datasource._attributes.id
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
                     "</strong><br>" + series.name + ":" + point.y + " " +
                     datasource._attributes.unit;
          }
      },

      rangeSelector: {
          enabled: false
      },

      series: [{
          name: datasource._attributes.id,
          data: seriesData
      }],

      xAxis: {
          type: 'datetime'
      },

      yAxis: {
          offset: 50,
          title: {
              text: datasource._attributes.unit
          }
      }
    });

    return stockChart;
  };

  $.fn.GeocensChart = function () {
    var options = arguments[0];
    this.each(function () {
      return new chart(this, options);
    });
  };

})(jQuery);
