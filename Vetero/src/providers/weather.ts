import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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

        if (loc.long) {
            uri += '?lat=' + loc.lat + '&lon=' + loc.long;
        } else {
            uri += '?zip=' + loc.zip + ",fr";
        }

        uri += '&units=metric';

        uri += '&APPID=' + this.weatherKey;
        return uri;
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private handleError(res: Response | any) {
        console.error('Entering handleError');
        console.dir(res);
        return Promise.reject(res.message || res);
    }
}
