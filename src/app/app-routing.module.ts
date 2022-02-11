import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'login', /* canActivate: [NoAuthGuard], */ component: LoginComponent },
  { path: 'register', /* canActivate: [NoAuthGuard], */ component: RegisterComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  //{ path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
