import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root', // Optional: Register the service in the root injector
  })

export class UserService {
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
            // .pipe(tap((response) => console.log('response from backend:getUsers', response)));
    }


}