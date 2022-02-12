import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private authSrv: AuthService, private router: Router) {
  }
  canActivate(activatedRoute: ActivatedRouteSnapshot) {
    const token = this.authSrv.token;
    if (!token ) {
      return true;
    } else {
      this.router.navigate(['/home'])
      return false;
    }
  }
}
