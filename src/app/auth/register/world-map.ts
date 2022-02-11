import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export class WorldMap {
  width;
  height;
  roomImage = new Image();
  image;
  scale;
  constructor( width, height, @Inject(DOCUMENT) private document ) {
    this.width = width;
    this.height = height;
    // map texture
    this.image = null;

  }

  generate(url) {
    this.roomImage.src = url;
    this.roomImage.crossOrigin = "Anonymous";
    this.image = new Image();

    let ctx = this.document.createElement('canvas').getContext('2d');
    ctx.canvas.width = this.width;
    ctx.canvas.height = this.height;

    this.roomImage.onload = () => {

      let hRatio = this.width  / (this.roomImage.width);
      let vRatio =  this.height / (this.roomImage.height);
      let ratio  = Math.max ( hRatio, vRatio );
      let centerShift_x =Math.round(( this.width - this.roomImage.width*ratio ) / 2);
      let centerShift_y = Math.round(( this.height - this.roomImage.height*ratio ) / 2);


      ctx.drawImage(this.roomImage, centerShift_x, centerShift_y, Math.round(this.roomImage.width * ratio),Math.round(this.roomImage.height * ratio));
      this.image.src = ctx.canvas.toDataURL('image/png');
      ctx = null;
    }
  }
  updateWorld(w,h) {
    this.width = w;
    this.height = h;

    let ctx = this.document.createElement('canvas').getContext('2d');
    ctx.canvas.width = this.width;
    ctx.canvas.height = this.height;

    let hRatio = this.width  / (this.roomImage.width);
    let vRatio =  this.height / (this.roomImage.height);
    let ratio  = Math.max ( hRatio, vRatio );
    let centerShift_x =Math.round(( this.width - this.roomImage.width*ratio ) / 2);
    let centerShift_y = Math.round(( this.height - this.roomImage.height*ratio ) / 2);

    ctx.drawImage(this.roomImage, centerShift_x, centerShift_y, Math.round(this.roomImage.width * ratio),Math.round(this.roomImage.height * ratio));
    this.image = null;
    this.image = new Image();
    this.image.src = ctx.canvas.toDataURL('image/png');
    ctx = null
  }

  draw(context, xView, yView) {

    let sx, sy, dx, dy;
    let sWidth, sHeight, dWidth, dHeight;



    // offset point to crop the image
    sx = xView;
    sy = yView;

    // dimensions of cropped image
    sWidth = context.canvas.width;
    sHeight = context.canvas.height;

    // if cropped image is smaller than canvas we need to change the source dimensions
    if (this.image.width - sx < sWidth) {
      sWidth = this.image.width - sx;
    }
    if (this.image.height - sy < sHeight) {
      sHeight = this.image.height - sy;
    }

    // location on canvas to draw the croped image
    dx = 0;
    dy = 0;
    // match destination with source to not scale the image
    dWidth = sWidth;
    dHeight = sHeight;

    context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  }

}
