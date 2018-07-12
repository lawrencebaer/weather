module.exports = {
  template: require('./forecastItem.html'),
  controller: ForecastItemCtrl,
  bindings: {
    dailyData: '<'
  }
};

function ForecastItemCtrl() {

}
