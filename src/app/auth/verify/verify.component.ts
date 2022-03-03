import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationPopupComponent } from 'src/app/notification-popup/notification-popup.component';

export interface Point {
  order: number,
  x: number,
  y: number
}

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

  points: Point[] = [];
  order = 1;
  maxPoints = false;


  bgUrl;
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
  
  userId;
  imageId
  imageUrl;
  staticUrl = 'IPAddress' //for save load images

  constructor(private authSrv: AuthService, 
    private location: Location,  
    private router: Router, 
    private dialog: MatDialog, 
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute, 
    private fb: FormBuilder) { }

  ngOnInit() {

    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    
    this.userId = this.route.snapshot.queryParams.userId;
    this.subscription.add(this.authSrv.getUserImage(this.userId).subscribe((data: any) => {
      data;
      this.bgUrl = data.url;
      const splitEndTime = (this.bgUrl).split('\\');
      let lastElement = splitEndTime.slice(-1);
      this.imageUrl = this.staticUrl + lastElement;
      this.imageId = data.imageID;
      this.userId = data.userID;
      
  })
);

  }
  onMouseDown(event) {
    event;
    if (this.order < 4) {
      this.points.push({
        order: this.order++,
        x: event.layerX,
        y: event.layerY
  
      });
      console.log(event.layerX);
    console.log(event.layerY);
    console.log(this.order);
    console.log('-----------');
    } else {
      
      console.log('-----------');
    }
    if (this.order === 4) {
      this.maxPoints = true;
    }
    
  }

  login() {
    if(this.maxPoints){
      this.subscription.add(this.authSrv.loginFinally(this.points, this.userId, this.imageId).subscribe((data: any) => {
        data;
        if (data.status) {
          this.openDialog(data.msg);
          this.router.navigate(['/home'],);
        } else {
          this.openDialog(data.msg);
          this.maxPoints = false;
          this.order = 1;
          this.points = [];
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
