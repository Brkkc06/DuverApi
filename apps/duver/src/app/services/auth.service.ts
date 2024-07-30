import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;


  constructor(private http: HttpClient) { }

  registerUser(user: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:3000/users/register', user, { headers: headers })
      .pipe(tap((response) => console.log('response from backend:registerUser', response)));
  }

  getUsers() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.get<any>('http://localhost:3000/users/getUsers', { headers: headers })
      .pipe(tap((response) => console.log('response from backend:getUsers', response)));
  }
  getUserInStatistic() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.get<any>('http://localhost:3000/statistic/getUserInStatistic', { headers: headers })
      .pipe(tap((response) => console.log('response from backend : getUserInStatistic', response)));
  }

  authenticateUser(user: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:3000/users/authenticate', user, { headers: headers })
      // .pipe(
      //   tap((response) => console.log(response)));
  }
  getProfile() {
    this.loadToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authToken);
    return this.http.get<any>('http://localhost:3000/users/profile', { headers: headers })
      // .pipe(
      //   tap((response) => console.log(response)));
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    this.loadToken();
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(localStorage.getItem('id_token'));
    return isExpired;
  }
  storeUserData(token: any, user: any) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user
  }
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  matchIds() {
    let localName;
    let statisticName;
    // localhost:8080/getStatisticByUserId/u123ugquywegty12y3
    this.getProfile().subscribe((profile) => {
      localName = profile.user.name
      console.log(localName);
      this.getUserInStatistic().subscribe(data => {
        const statisticUser = data.usersInStatistic;
        statisticUser.forEach((element:any) => {
          statisticName = element.name;
          console.log(statisticName)
        });
        
      });
    });

  }
}
