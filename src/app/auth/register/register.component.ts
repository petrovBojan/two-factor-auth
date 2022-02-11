import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImageUtils } from 'src/app/shared/utils/image.utils';

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

  mouseHold = false;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('offsetCanvas') offsetCanvas: ElementRef;
  @ViewChild('viewportEl') viewportEl: ElementRef;
  context: CanvasRenderingContext2D;

  constructor(/* private authSrv: AuthService, */  private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

    this.imgUrl='../assets/images/biofarmtrans.png';
    //this.errMsg = this.authSrv.getErrorMsg();
    // get return url from route parameters or defau lt to  '/'

    this.createForm();
  }

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
  }

  onMouseDown(event) {
    event;
    debugger;
  }

  createForm() {
    this.registerForm = this.fb.group({
      'email': ['', [Validators.required]],
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

    
    this.router.navigate(['/login']);

  }

}
