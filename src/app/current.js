module.exports = {
  template: require('./current.html'),
  controller: CurrentCtrl,
  bindings: {
    weatherData: '<'
  }
};

class CurrentCtrl {
  constructor() {

  }
}
