import { Inject, Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface User {
  email: string;
  email_verified: number;
  provider: string
  jwtToken?: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;

  public loggedUser = new BehaviorSubject<User>(null);
  public loggedUser$ = this.loggedUser.asObservable();

  private errorMsg = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient,
    @Inject(Injector) private injector: Injector,
    private jwtHelper: JwtHelperService) {
      //this.loggedUser.next(JSON.parse(localStorage.getItem('user') || null));
    }

  public get router() {
    return this.injector.get(Router);
  }

  getErrorMsg(): Observable<string> {
    return this.errorMsg.asObservable();
  }

  get token() {
    return localStorage.getItem('jwt');

  }

  uploadImage(formData: FormData, userId): Observable<any> {
    const endpoint = `${this.baseUrl}/uploadPic/`;
    const queryParams = new HttpParams()
      .set('userID', encodeURIComponent(userId));

    return this.http.post<any>(endpoint, formData, { params: queryParams });
  }

  insertUser(form): Observable<any> {
    const endpoint = `${this.baseUrl}/InsertUser`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const body = JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password
    });
    const options = { headers: headers };
    return this.http.post<any>(endpoint, body, options);

  }

  savePoints(points, userId, imageID): Observable<any> {
    const endpoint = `${this.baseUrl}/saveCoordinates`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const body = JSON.stringify({
      points,
      userId,
      imageID
    });
    const options = { headers: headers };
    return this.http.post<any>(endpoint, body, options);

  }

  getUser(form): Observable<any> {
    const endpoint = `${this.baseUrl}/GetUserByID`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const body = JSON.stringify({
            email: form.email,
            password: form.password
    });
    const options = { headers: headers };
    return this.http.post<any>(endpoint, body, options);

  }
  getUserImage(userID) {
    return this.http.get(`${this.baseUrl}/getUserPicture`, {
      params: {
        userID
      }
    }).pipe(
      tap((data: any) =>{
        data;
        })
    );
  }
  

  loginFinally(points, userId, imageID): Observable<any> {
    const endpoint = `${this.baseUrl}/Auth`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const body = JSON.stringify({
      points,
      userId,
      imageID
    });
    const options = { headers: headers };
    return this.http.post<any>(endpoint, body, options).pipe(
      map((data: any) => {
         if(data){
          localStorage.setItem('user', JSON.stringify(data));
          localStorage.setItem('jwt', data.status);
        }
        return data;
        })
      );;

  }

  
}
