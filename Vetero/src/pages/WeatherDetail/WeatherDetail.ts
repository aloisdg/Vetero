import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-weather-detail',
    templateUrl: 'weatherdetail.html'
})
export class WeatherDetailPage {

    forecast: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.forecast = this.navParams.get('forecast');
    }

    ionViewDidLoad() {
        console.log('Weather Detail page loaded');
    }
}
