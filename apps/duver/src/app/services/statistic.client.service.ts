import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root', // Optional: Register the service in the root injector
  })

export class statisticService {
  authToken: any;
    constructor(private http: HttpClient) {}

    getUserInStatistic() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        return this.http.get<any>('http://localhost:3000/statistic/getUserInStatistic', { headers: headers })
          .pipe(tap((response) => console.log('response from backend : getUserInStatistic', response)));
      }
      loadToken() {
        const token = localStorage.getItem('id_token');
        this.authToken = token;
      }
      getStatistic() {
        this.loadToken();
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
        return this.http.get<any>('http://localhost:3000/statistic/getStatistic', { headers: headers })
          // .pipe(
          //   tap((response) => console.log(response)));
      }
}