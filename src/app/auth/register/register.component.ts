import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationPopupComponent } from 'src/app/notification-popup/notification-popup.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  model: any = {};
  hide = true;

  subscription = new Subscription();
  isEmailValid = true;
  registerForm: FormGroup;
  imgUrl = '';

  mouseCoords = {
    x: 0,
    y: 0
  }

  worldCoords = {
    width: 400,
    height: 200
  }
  bgUrl = '../../../assets/images/background.jpg';
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


  userId = 1;
  constructor(
    private authSrv: AuthService,
    private renderer: Renderer2, 
     @Inject(DOCUMENT) private document,  
     private router: Router, 
     private dialog: MatDialog, 
     private route: ActivatedRoute, 
     private fb: FormBuilder) { }

  ngOnInit() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.imgUrl='../../../assets/images/background.png';
    //this.errMsg = this.authSrv.getErrorMsg();
    // get return url from route parameters or defau lt to  '/'

    this.createForm();
  }

  ngAfterViewInit(): void {

  }

  createForm() {
    this.registerForm = this.fb.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]],
    });
  }
  get f() { return this.registerForm.controls; }

  getError(control: any) {
    switch (control) {
      case 'name':
        return this.registerForm.get('name').hasError('required') ? 'Enter a name' : '';
      case 'email':
          return this.registerForm.get('email').hasError('email') ? 'Enter valid email' :
            this.registerForm.get('email').hasError('required') ? 'Enter a email' : '';
      case 'password':
        return this.registerForm.get('password').hasError('required') ? 'Enter a password' : '';

    }
  }

  login(form:FormGroup) {
    if(form.valid){
      this.subscription.add(this.authSrv.insertUser(form.value).subscribe((data: any) => {
          data;
          let params = {
            userId: data.id
          }
          this.openDialog('registration is succesful');
          this.router.navigate(['/upload'], {queryParams : params});
      },
      (err) => {
        if (err) {
          this.openDialog('Something went wrong');
        }
      }
      )
    );
  }
  }

  goBack() {
    this.router.navigate(['/login']);
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
