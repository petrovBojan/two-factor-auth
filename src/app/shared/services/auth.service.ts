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
  private switchMode = new BehaviorSubject<string>('SignIn');
  private showVerifiedForm = new BehaviorSubject<boolean>(false);

  public loggedUser = new BehaviorSubject<User>(null);
  public loggedUser$ = this.loggedUser.asObservable();

  private loading = new BehaviorSubject<boolean>(false);
  private errorMsg = new BehaviorSubject<string>(null);

  body;
  constructor(
    private http: HttpClient,
    @Inject(Injector) private injector: Injector,
    private jwtHelper: JwtHelperService) {
      //this.loggedUser.next(JSON.parse(localStorage.getItem('user') || null));
    }

  public get router() {
    return this.injector.get(Router);
  }

  setLoader(loading: boolean) {
    this.loading.next(loading);
  }
  getLoader(): Observable<boolean> {
    return this.loading.asObservable();
  }
  setError(msg) {
    this.errorMsg.next(msg);
  }
  getErrorMsg(): Observable<string> {
    return this.errorMsg.asObservable();
  }
  setLoggedUser() {
    this.loggedUser.next(JSON.parse(localStorage.getItem('user') || null));
  }

  /* login(form) {
    const credentials = JSON.stringify(form.value);
      if(form.value.name ){
          
          localStorage.setItem('user', JSON.stringify('admin'));
          localStorage.setItem('jwt', 'data.token');
          return true;
        }
        
  } */
  login(form) {
    const credentials = JSON.stringify(form.value);
    return this.http.post(`${this.baseUrl}/auth/signin`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((data: any) => {
         if(data){
          this.loggedUser.next(data);

          localStorage.setItem('user', JSON.stringify(data));
          localStorage.setItem('jwt', data.email);
        }
        return data;
        }),
        catchError((err) => {
          this.loading.next(false);
          this.errorMsg.next(err.error.msg);
          return throwError(err.error);
        })
      );
  }

  get token() {
    return localStorage.getItem('jwt');

  }
  setToken(token) {
    localStorage.setItem('jwt', token);
  }
  getLoggedUserId() {
    return localStorage.getItem('jwt');
  }
  getLoggedUsername(){
    return this.loggedUser.getValue().email;
  }

  logout() {
    let state = this.router.routerState.snapshot;
    this.loggedUser.next(null);
    this.errorMsg.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
  }

  setTokens(data) {
    this.loggedUser.next(data);

    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('jwt', data);

  }
  

  getSwitchMode() {
    return this.switchMode;
  }
  resetSwitchMode() {
    this.switchMode.next(null);
  }
  setSwitchMode(mode) {
    this.switchMode.next(mode);
  }


  signUp(form) {
    const endpoint = `${this.baseUrl}/auth/signup`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const body = { 
      firstname: form.first_name,
      lastname: form.last_name,
      email: form.email,
      password: form.password,
    };
    const options = { headers: headers};
    return this.http.post<any>(endpoint, body, options).pipe(

      map((data: any) => {
        this.loading.next(false);
        this.switchMode.next('SignIn');
        this.showVerifiedForm.next(false);
        return data;
      }),
      catchError((err) => {
        this.showVerifiedForm.next(false);
        this.loading.next(false);
        this.errorMsg.next(err.error);
        return throwError(err.error);
      })
    );
  }

  setShowVerifiedForm(verified:boolean) {
    this.showVerifiedForm.next(verified);
  }
  getShowVerifiedForm(): Observable<boolean> {
    return this.showVerifiedForm.asObservable();
  }
  
  checkEmail(email: string, vId) {
    let params = new HttpParams().append('email', encodeURIComponent(email));
    if(vId){
       params = params.append('vendorId', vId);
     }
     return this.http.get(`${this.baseUrl}/auth/checkExistingUser`, {
       params
     })
   };

   confirmEmail(tokenId) {
    return this.http.post(`${this.baseUrl}/auth/confirmEmail`, {
      Token: tokenId
    }).pipe(
      map((data: any) => {
        this.loading.next(false);
        return data;
      }),
      catchError((err) => {
        this.loading.next(false);
        this.errorMsg.next('An error occured. Try again later.');
        return throwError('An error occured.Try again later.');
      })
    );
  }
  forgotPassword(form) {
    return this.http.post(`${this.baseUrl}/admin/forgot`, {
      ...form,
    }).pipe(
      map((data: any) => {
        this.loading.next(false);
        this.errorMsg.next(null);
        return data;
      }),
      catchError((err) => {
        this.loading.next(false);
        if (err.error.message) {
          this.errorMsg.next(err.error.message);
        }
        return throwError(err.error);
      })
    );
  }
  changePassword(form,systemUserId, tokenId) {
    return this.http.post(`${this.baseUrl}/auth/changePassword`, {
      newPassword: form.new_password,
      systemUserID: systemUserId,
      tokenId: tokenId
    }).pipe(
      map((data: any) => {
        if (data.status) {
          localStorage.removeItem('jwt');
        }
        return data;
      }),
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }
  getTokenInfo(tokenId) {
    return this.http.get(`${this.baseUrl}/admin/tokenInfo`, {
      params: {
        token: tokenId
      }
    });
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }
  closeQuickStart(){
    // return null;
  }


  registerWith(formData: FormData): Observable<any> {
    const endpoint = `${this.baseUrl}/admin/create`;
    return this.http.post<any>(endpoint, formData);
  }


  getMethod(id) {
    return this.http.get(`${this.baseUrl}/getmethod/name/${id}`, {
    }).pipe(
      tap((data: any) => {
        return data;
      })
    );
  }


  postMethod(form, other){
    return this.http.post(`${this.baseUrl}/getmethod/name`, {
      name: form.name,
      hosts: form.hosts,
      other
    }).pipe(
      tap((data: any) => {
        return data;
      })
    );
  }
}
