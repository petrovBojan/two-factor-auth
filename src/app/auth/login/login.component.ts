import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  onMouseDown(event) {
    event;
    debugger;
    console.log(event.layerX);
    console.log(event.layerY);
    console.log('-----------');
  }

}
