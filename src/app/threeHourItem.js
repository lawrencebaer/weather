module.exports = {
  template: require('./threeHourItem.html'),
  controller: ForecastItemCtrl,
  bindings: {
    threeHourData: '<'
  }
};

function ForecastItemCtrl() {

}
