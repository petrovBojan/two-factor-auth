import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EventModel } from 'src/app/shared/utils/event.model';
import { ImageUtils } from 'src/app/shared/utils/image.utils';
import { WorldMap } from './world-map';

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

  /* getError(control: any) {
    switch (control) {
      case 'email':
          return this.registerForm.get('email').hasError('pattern') ? 'enter valid email' :
            this.registerForm.get('email').hasError('required') ? 'enter a email' : '';
      case 'password':
        return this.registerForm.get('password').hasError('required') ? 'enter a password' : '';

    }
  } */

  onUploadLogoClick(): void {
    this.logoInput.nativeElement.click();
  }
 
  onLogoSelect(event): void {
    this.logoErrorMessage = '';
    const files = event.target.files;
    if (files.length == 0) {
      return;
    }
    const file = files[0];
    if (!ImageUtils.isOfTypeImage(file.type) || !ImageUtils.hasValidExtension(file.name)) {
      this.logoErrorMessage = 'Invalid image type';
      return;
    }

    let maxSize = ImageUtils.maxEventLogoSize;
    if (file.size > maxSize) {
      let sizeDiff = ImageUtils.convertBytesToMB(file.size - maxSize);
      sizeDiff = +Number.parseFloat(sizeDiff.toString()).toFixed(2);
      maxSize = ImageUtils.convertBytesToMB(maxSize);
      this.logoErrorMessage = `Image size cannot exceed ${maxSize} MB`;
      return;
    }

    this.logo = file;
    this.logoName = ImageUtils.truncate(file.name, 36);
    ImageUtils.displayUploadedImage(file, this.logoImg);
  }
  
  onMouseDown(event) {
    event;
    console.log(event.layerX);
    console.log(event.layerY);
    console.log('-----------');
  }

  login(form:FormGroup) {
    if(form.valid){
      this.subscription.add(this.authSrv.insertUser(form.value).subscribe((data: any) => {
          data;
          let params = {
            userId: data.id
          }
          this.router.navigate(['/upload'], {queryParams : params});
      })
    );
  }
  }
}
