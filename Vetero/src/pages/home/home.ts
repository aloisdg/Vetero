import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from 'ionic-angular';
import { Geolocation, Keyboard } from 'ionic-native';
import { Weather } from '../../providers/weather';
import { WeatherDetailPage } from '../weatherdetail/weatherdetail';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    degreeStr: string = ' ℃';
    currentLoc: any = {};
    currentWeatherItems: Array<any> = [];
    searchInput: string = '';
    currentMode: string = 'current';
    displayMode: string = this.currentMode;
    f_items: Array<any> = [];
    days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(
        public alertController: AlertController,
        public loadingCtrl: LoadingController,
        public nav: NavController,
        public platform: Platform,
        public weather: Weather
    ) {

    }

    ionViewDidLoad() {
        this.displayMode = this.currentMode

        this.platform.ready().then(() => {
            document.addEventListener('resume', () => {
                this.displayMode = this.currentMode
                this.getLocalWeather();
            });
            this.getLocalWeather();
        });
    }

    refreshPage() {
        if (this.displayMode === this.currentMode) {
            this.showCurrent();
        } else {
            this.showForecast();
        }
    }

    getLocalWeather() {
        Geolocation.getCurrentPosition({
            'maximumAge': 3000,
            'timeout': 5000,
            'enableHighAccuracy': true
        }).then(pos => {
            this.currentLoc = { 'lat': pos.coords.latitude, 'long': pos.coords.longitude };
            this.showCurrent();
        }).catch(e => {
            console.error('Unable to determine current location');
            if (e) {
                console.log('%s: %s', e.code, e.message);
                console.dir(e);
            }
        })
    }

    showCurrent() {
        this.currentWeatherItems = [];
        let loader = this.loadingCtrl.create({
            content: "Retrieving current conditions..."
        });
        loader.present();
        this.weather.getCurrent(this.currentLoc).then(
            data => {
                loader.dismiss();
                if (data) {
                    this.currentWeatherItems = this.formatWeatherData(data);
                } else {
                    console.error('Error retrieving weather data: Data object is empty');
                }
            },
            error => {
                loader.dismiss();
                console.error('Error retrieving weather data');
                console.dir(error);
                this.showAlert(error);
            }
        );
    }

    private formatWeatherData(data): any {
        let tmpArray = [];
        if (data.name) {
            tmpArray.push({ 'name': 'Location', 'value': data.name });
        }
        tmpArray.push({ 'name': '🌡 ', 'value': data.main.temp + this.degreeStr });
        tmpArray.push({ 'name': '🌡↓', 'value': data.main.temp_min + this.degreeStr });
        tmpArray.push({ 'name': '🌡↑', 'value': data.main.temp_max + this.degreeStr });
        tmpArray.push({ 'name': 'Humidity', 'value': data.main.humidity + '%' });
        tmpArray.push({ 'name': 'Pressure', 'value': data.main.pressure + ' hPa' });
        tmpArray.push({ 'name': 'Wind', 'value': data.wind.speed + ' mph' });
        if (data.visibility) {
            tmpArray.push({ 'name': 'Visibility', 'value': data.visibility + ' meters' });
        }
        if (data.sys.sunrise) {
            var sunriseDate = new Date(data.sys.sunrise * 1000);
            tmpArray.push({ 'name': '🌅 Sunrise', 'value': sunriseDate.toLocaleTimeString() });
        }
        if (data.sys.sunset) {
            var sunsetDate = new Date(data.sys.sunset * 1000);
            tmpArray.push({ 'name': '🌇 Sunset', 'value': sunsetDate.toLocaleTimeString() });
        }
        if (data.coord) {
            tmpArray.push({ 'name': 'Latitude', 'value': data.coord.lat });
            tmpArray.push({ 'name': 'Longitude', 'value': data.coord.lon });
        }
        return tmpArray;
    }

    showAlert(message: string) {
        let alert = this.alertController.create({
            title: 'Error',
            subTitle: 'Source: Weather Service',
            message: message,
            buttons: [{ text: 'Sorry' }]
        });
        alert.present();
    }

    setZipCode() {
        //Hide the keyboard if it's open, just in case
        Keyboard.close();
        this.currentLoc = { 'zip': this.searchInput };
        this.searchInput = '';
        this.displayMode = this.currentMode;
        this.showCurrent();
    }

    showForecast() {
        this.f_items = [];
        let loader = this.loadingCtrl.create({
            content: "Retrieving forecast..."
        });
        loader.present();
        this.weather.getForecast(this.currentLoc).then(
            data => {
                loader.dismiss();
                if (data) {
                    for (let period of data.list) {
                        let weatherValues: any = this.formatWeatherData(period);
                        let date = new Date(period.dt_txt);
                        let day = this.days[date.getDay()];
                        let time = date.toLocaleTimeString();
                        this.f_items.push({ 'period': day + ' at ' + time, 'values': weatherValues });
                    }
                } else {
                    console.error('Error displaying weather data: Data object is empty');
                }
            },
            error => {
                loader.dismiss();
                console.error("Error retrieving weather data");
                console.dir(error);
                this.showAlert(error);
            }
        );
    }

    viewForecast(item) {
        this.nav.push(WeatherDetailPage, { 'forecast': item });
    }
}
