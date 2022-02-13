import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ImageUtils } from 'src/app/shared/utils/image.utils';
import { AuthService } from 'src/app/shared/services/auth.service';

export interface Point {
  order: number,
  x: number,
  y: number
}

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

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

  points: Point[] = [];
  order = 0;
  maxPoints;

  bgUrl;
  room;
  canvasSize = {
    width: (800) * devicePixelRatio,
    height: (700) * devicePixelRatio
  }
  mouseHold = false;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('offsetCanvas') offsetCanvas: ElementRef;
  @ViewChild('viewportEl') viewportEl: ElementRef;
  context: CanvasRenderingContext2D;
  offsetContext: CanvasRenderingContext2D;
  
  userId;
  imageID;

  constructor(private authSrv: AuthService,private location: Location,  private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

    this.userId = this.route.snapshot.queryParams.userId;
  }



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

    const formData = new FormData();
    formData.append('file', this.logo, this.logo.name);
    this.subscription.add(this.authSrv.uploadImage(formData, this.userId).subscribe((data: any) => {
      data;
      this.imageID = data.imu.imageID;
  }))

  }
  
  onMouseDown(event) {
    event;
    if (this.order < 3 && this.logo) {
      this.order = this.order +1;
      this.points.push({
        order: this.order,
        x: event.layerX,
        y: event.layerY
  
      });
      console.log(event.layerX);
    console.log(event.layerY);
    console.log(this.order);
    console.log('-----------');
    } else {
      this.maxPoints = true;
      console.log('-----------');
    }
    
  }

  register() {
    debugger;
    if(this.maxPoints){
      this.subscription.add(this.authSrv.savePoints(this.points, this.userId, this.imageID).subscribe((data: any) => {
        data;
        if (data.userList) {
          this.router.navigate(['/login'],);
        }

    })
  );
    }
    
  }


  goBack() {
    this.location.back();
  }

}
