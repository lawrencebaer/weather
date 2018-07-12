'use strict';
const moment = require('moment');
const apiKey = '8f7fefd1a8db51d01db19b8d1093a099';
const TYPE = {
  location: 0,
  city: 1,
  zipCode: 2
};

module.exports = airingsService;

function airingsService($http, $q) {

  function getWeatherData(type, data) {
    const deferred = $q.defer();
    let currentUrl, fiveDayUrl;

    switch (type) {
      case TYPE.location:
        currentUrl = '//api.openweathermap.org/data/2.5/weather?lat=' + data.latitude + '&lon=' + data.longitude + '&appid=' + apiKey;
        fiveDayUrl = '//api.openweathermap.org/data/2.5/forecast?lat=' + data.latitude + '&lon=' + data.longitude + '&appid=' + apiKey;
        break;
      case TYPE.city:
        currentUrl = '//api.openweathermap.org/data/2.5/weather?q=' + data.keyword + '&appid=' + apiKey;
        fiveDayUrl = '//api.openweathermap.org/data/2.5/forecast?q=' + data.keyword + '&appid=' + apiKey;
        break;
      case TYPE.zipCode:
        currentUrl = '//api.openweathermap.org/data/2.5/weather?&zip=' + data.keyword + '&appid=' + apiKey;
        fiveDayUrl = '//api.openweathermap.org/data/2.5/forecast?zip=' + data.keyword + '&appid=' + apiKey;
        break;
    }

    const currentCall = $http({
      method: 'GET',
      url: currentUrl
    });

    const fiveDayCall = $http({
      method: 'GET',
      url: fiveDayUrl
    });

    $q.all([currentCall, fiveDayCall]).then((result) => {
      deferred.resolve(mapToModel(result[0].data, result[1].data));
    }, (error) => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function mapToModel(currentData, fiveDayData) {

    // Gather summary data for current weather conditions
    // Prep an array for five-day data
    const data = {
      city: currentData.name,
      temp: kelvinToFahrenheit(currentData.main.temp),
      high: kelvinToFahrenheit(currentData.main.temp_max),
      low: kelvinToFahrenheit(currentData.main.temp_min),
      status: currentData.weather[0].main,
      statusIcon: currentData.weather[0].icon,
      forecast: []
    };

    // Parse five-day data
    let days = [];
    const today = new Date();
    const firstDay = new Date(fiveDayData.list[0].dt * 1000);

    for (var i=0; i<5; i++) {
      let date = new Date(new Date().setDate(firstDay.getDate() + i));

      // Split out the three-hour data into separate arrays by day
      let dailyData = fiveDayData.list.filter((item) => {
        return (new Date(item.dt * 1000)).getDay() === date.getDay();
      });

      // Gather the high and low from the three-hour data
      let highs = dailyData.map(x => x.main.temp_max);
      let lows = dailyData.map(x => x.main.temp_min);
      let high = kelvinToFahrenheit(highs.sort()[highs.length - 1]);
      let low = kelvinToFahrenheit(lows.sort()[0]);

      // Map summary data for each three-hour item
      let threeHourData = [];
      for (var j=0; j<dailyData.length; j++) {
        let time = new Date(dailyData[j].dt * 1000);
        threeHourData.push({
          time: moment(time).format('h a'),
          temp: kelvinToFahrenheit(dailyData[j].main.temp),
          status: dailyData[j].weather[0].main,
          statusIcon: dailyData[j].weather[0].icon
        });
      }

      data.forecast.push({
        day: moment(date).format('dddd'),
        date: moment(date),
        threeHourData: threeHourData,
        high: high,
        low: low
      });
    }

    // If the first forecast is today, replace the high/low with today's forecasted high/low
    // The summary data from today won't match the three-hour forecast data unless we have all of the day's three-hour data available
    // i.e.: fetching data late at night when we only have one or two hourly forecasts
    if (data.forecast[0].date.isSame(moment(today), 'd')) {
      data.forecast[0].high = data.high;
      data.forecast[0].low = data.low;
    }

    return data;
  }

  function kelvinToFahrenheit(value) {
    return (value * 9/5 - 459.67).toPrecision(2);
  }

  return {
    getWeatherData: getWeatherData
  };
}

