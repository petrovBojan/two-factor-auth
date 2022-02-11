import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  hide = true;

  subscription = new Subscription();
  isEmailValid = true;
  loginForm: FormGroup;
  imgUrl = '';

  constructor(/* private authSrv: AuthService, */  private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

    this.imgUrl='../assets/images/biofarmtrans.png';
    //this.errMsg = this.authSrv.getErrorMsg();
    // get return url from route parameters or defau lt to  '/'

    this.createForm();
  }


  createForm() {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }
  get f() { return this.loginForm.controls; }

  /* getError(control: any) {
    switch (control) {
      case 'email':
          return this.loginForm.get('email').hasError('pattern') ? 'enter valid email' :
            this.loginForm.get('email').hasError('required') ? 'enter a email' : '';
      case 'password':
        return this.loginForm.get('password').hasError('required') ? 'enter a password' : '';

    }
  } */
  login(form:FormGroup) {
    /* if(form.valid){
      this.authSrv.setLoader(true);
      this.authSrv.login(form).subscribe(data => {
        this.authSrv.setLoader(false);
        if (data ) {
          // login successful - redirect to return url
          this.router.navigate(['/home']);
        }
        else {
          this.authSrv.setLoader(false);
        }
      })
    } */

    this.router.navigate(['/home']);

  }

  /* openDialog(message): void {
    setTimeout(() => this.dialog.open(NotificationPopupComponent, {
      width: '400px',
      data: message,
      panelClass: 'modalbox-purple'
    }));
  } */

}
