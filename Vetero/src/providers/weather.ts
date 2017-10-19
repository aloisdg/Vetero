import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the Weather provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Weather {

    private weatherEndpoint = 'http://api.openweathermap.org/data/2.5/';
    private weatherKey = 'e768deb35e99dfdd1688f645f825481f';

    constructor(public http: Http) { }

    getCurrent(loc: any): Promise<any> {
        let url: string = this.makeDataURL(loc, 'weather');
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getForecast(loc: any): Promise<any> {
        let url: string = this.makeDataURL(loc, 'forecast');
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private makeDataURL(loc: any, command: string): string {
        let uri = this.weatherEndpoint + command;

        //uri += "?lat=" + 48.8534100 + '&lon=' + 2.3488000;
        //Do we have a location?
        if (loc.long) {
            //then use the 'geographical coordinates' version of the API
            uri += '?lat=' + loc.lat + '&lon=' + loc.long;
        } else {
            //Otherwise, use the zip code
            uri += '?zip=' + loc.zip;
        }

        uri += '&units=metric';

        uri += '&APPID=' + this.weatherKey;
        return uri;
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private extractData(res: Response) {
        let body = res.json();
        //Return the data (or nothing)
        return body || {};
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private handleError(res: Response | any) {
        console.error('Entering handleError');
        console.dir(res);
        return Promise.reject(res.message || res);
    }
}