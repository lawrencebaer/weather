module.exports = {
  template: require('./current.html'),
  controller: CurrentCtrl,
  bindings: {
    weatherData: '<',
    zipCode: '<'
  }
};

class CurrentCtrl {
  constructor() {

  }
}
