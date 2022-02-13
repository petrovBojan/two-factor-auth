import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UploadImageComponent } from './auth/upload-image/upload-image.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { HomeComponent } from './home/home.component';
import { NoAuthGuard } from './shared/services/no-auth-guard.service';

const routes: Routes = [

  { path: 'home', canActivate: [NoAuthGuard], component: HomeComponent },
  { path: 'login', /* canActivate: [NoAuthGuard], */ component: LoginComponent },
  { path: 'register', /* canActivate: [NoAuthGuard], */ component: RegisterComponent },
  { path: 'verify', /* canActivate: [NoAuthGuard], */ component: VerifyComponent },
  { path: 'upload', /* canActivate: [NoAuthGuard], */ component: UploadImageComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  //{ path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
