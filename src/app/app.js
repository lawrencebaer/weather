import angular from 'angular';
import wHeader from './header';
import wCurrent from './current';
import wForecastItem from './forecastItem';
import wThreeHourItem from './threeHourItem';
import service from './service';
import '../style/app.css';
import '../style/owfont-regular.min.css';

const MODULE_NAME = 'app';
const DEFAULT_ZIP_CODE = 60661;
const TYPE = {
  location: 0,
  city: 1,
  zipCode: 2
};

const app = {
  template: require('./app.html'),
  controller: AppCtrl,
};

function AppCtrl(service) {
  this.loading = true;
  this.valid = true;
  this.url = 'https://www.linkedin.com/in/lawrencebaer';

  const hours = (new Date()).getHours();
  this.isNight = hours < 5 || hours > 19;

  this.onClick = (keyword) => {
    if (keyword) {
      this.getData(isNaN(keyword) ? TYPE.city : TYPE.zipCode, {keyword});
    }
  };

  this.getData = (type, data) => {
    this.loading = true;
    service.getWeatherData(type, data).then((result) => {
      this.weatherData = result;
      this.valid = true;
      this.zipCode = type === TYPE.zipCode ? data.keyword : null;
    }, (error) => {
      this.valid = false;
      console.log('Failed retrieving weather data - error: ' + JSON.stringify(error, null, 4));
    }).finally(() => {
      this.loading = false;
    });
  }

  navigator.geolocation.getCurrentPosition((position) => {
    this.getData(TYPE.location, {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    this.getData(TYPE.zipCode, {
      keyword: DEFAULT_ZIP_CODE
    });
  });

}

angular.module(MODULE_NAME, [])
  .component('app', app)
  .component('wHeader', wHeader)
  .component('wCurrent', wCurrent)
  .component('wForecastItem', wForecastItem)
  .component('wThreeHourItem', wThreeHourItem)
  .factory('service', service);

export default MODULE_NAME;
