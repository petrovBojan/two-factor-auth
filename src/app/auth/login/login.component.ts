import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationPopupComponent } from 'src/app/notification-popup/notification-popup.component';

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

  public logoErrorMessage: string = '';
  public logo: File = null;
  public logoName: string = '';
  public logoPath: string = '';
  @ViewChild('logoImg') logoImg: ElementRef;
  @ViewChild('logoInput') logoInput;

  mouseCoords = {
    x: 0,
    y: 0
  }

  worldCoords = {
    width: 400,
    height: 200
  }
  bgUrl = '../../../assets/images/pixel.png';
  room;
  canvasSize = {
    width: (400) * devicePixelRatio,
    height: (200) * devicePixelRatio
  }
  mouseHold = false;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('offsetCanvas') offsetCanvas: ElementRef;
  @ViewChild('viewportEl') viewportEl: ElementRef;
  context: CanvasRenderingContext2D;
  offsetContext: CanvasRenderingContext2D;
  

  constructor(private authSrv: AuthService,private location: Location,  private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.imgUrl='../assets/images/biofarmtrans.png';
    //this.errMsg = this.authSrv.getErrorMsg();
    // get return url from route parameters or defau lt to  '/'

    this.createForm();
  }


  createForm() {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
    });
  }
  get f() { return this.loginForm.controls; }

  getError(control: any) {
    switch (control) {
      case 'email':
          return this.loginForm.get('email').hasError('email') ? 'enter valid email' :
            this.loginForm.get('email').hasError('required') ? 'enter a email' : '';
      case 'password':
        return this.loginForm.get('password').hasError('required') ? 'enter a password' : '';

    }
  }
  login(form:FormGroup) {
    if(form.valid){
      this.subscription.add(this.authSrv.getUser(form.value).subscribe((data: any) => {
          data;
          if (data) {
            let params = {
              userId: data.userList.id
            }
            this.openDialog('User exists, proceed to confirm its you');
            this.router.navigate(['/verify'], {queryParams : params});
          }
      },
        (err) => {
          if (err) {
            this.openDialog('Something went wrong');          
          }
        })
    );
  }
  }

  goBack() {
    this.router.navigate(['/register']);
  }

  openDialog(message): void {
    setTimeout(() => this.dialog.open(NotificationPopupComponent, {
      width: '400px',
      data: message,
      panelClass: 'modalbox-purple'
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
