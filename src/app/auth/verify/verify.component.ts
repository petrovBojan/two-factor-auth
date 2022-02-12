import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  subscription = new Subscription();

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
  

  constructor(/* private authSrv: AuthService, */private location: Location,  private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

  }

  login() {
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


  goBack() {
    this.location.back();
  }


}
