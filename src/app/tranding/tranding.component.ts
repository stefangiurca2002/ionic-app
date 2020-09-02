import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { TrandingService } from './tranding.service';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';
import { IPosts } from '../user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    templateUrl: './tranding.component.html',
    styleUrls: ['./tranding.component.scss']
})

export class TrandingComponent implements OnInit{
    limit: number = 1;
    offset: number = 0;
    Content: IPosts[] = [];
    url: SafeUrl;
    id = -1;

    constructor(
        private trandingService: TrandingService,
        private userService: UserService,
        private sanitizer: DomSanitizer,
    ){
    }

    ngOnInit(): void {
        console.log(this.userService.userName);
      let ContentInfo = {
          userName: this.userService.userName,
          limit: this.limit,
          offset: this.offset
        };
        this.getContent(ContentInfo);
    }

    getContent(info){
        console.log(info);
        this.trandingService.getContent(info)
                            .pipe(take(1))
                            .subscribe(
                                data =>{
                                    if(data.userName){
                                    console.log(data, 'in tranding');
                                    this.Content = this.Content ? this.Content.concat(data) : data;
                                    this.url = this.sanitizer.bypassSecurityTrustUrl('http://192.168.1.8/mediaApp-BackEnd/uploads/' + data.url);
                                    this.offset = data.offset+1;
                                    this.id++;
                                    console.log(this.Content, this.id);                                    
                                    }
                                }
                            )
    }
    onSwipeLeft(){
        console.log('in swipe left');
        let ContentInfo = {
            userName: this.userService.userName,
            limit: this.limit,
            offset: this.offset
          };
          if(this.Content[this.id+1]){
                 this.id++;
                 this.url = this.sanitizer.bypassSecurityTrustUrl('http://192.168.1.8/mediaApp-BackEnd/uploads/'+this.Content[this.id].url);
          }
          else
          this.getContent(ContentInfo);
    }
    onSwipeRight(){
        console.log('in swipe right');
        if(this.id>0){
         this.id--;
         this.url = this.sanitizer.bypassSecurityTrustUrl('http://192.168.1.8/mediaApp-BackEnd/uploads/' + this.Content[this.id].url);
         console.log(this.url, this.id, this.Content[this.id].url);
        }
    }
}