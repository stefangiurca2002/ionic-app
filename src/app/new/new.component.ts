import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    templateUrl : './new.component.html',
    styleUrls: ['./new.component.scss']
})

export class NewComponent implements OnInit{
    info;
    friendsPosts = [];
    MessageForm: FormGroup;
    liked: boolean[] = [];
    disliked: boolean[] = [];
    LoadedImage: boolean[] = [];
    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router
    ){
        this.info = {
            userName: userService.userName,
            limit: 3
        }
    }
    ngOnInit(): void {
        console.log(this.info);
        this.MessageForm = this.fb.group({
            'messageInput': this.fb.array([])
         })
        this.getFriendsPosts(this.info);           
    }
    getFriendsPosts(info){
        this.userService.getFriendsContent(info)
                        .pipe(take(1)) 
                        .subscribe(
                            data =>{
                                console.log(data);
                                if(data[0])
                                this.friendsPosts = this.friendsPosts ? this.friendsPosts.concat(data) : data;
                            }
                        )     
    }
    hideLoader(url: string) {
        console.log(url);
        this.LoadedImage[url] = true;
    }
    rate(img, like: number, dislike: number) {
        console.log(img);
        this.liked[img.PostName] = like == 1;
        this.disliked[img.PostName] = dislike == 1;
        let UserNameEncoded: string = this.userService.encodeUserName(this.userService.userName);
            this.userService.RateProfile(
                {
                    userName: UserNameEncoded,
                    userRated: img.userName,
                    postName: img.PostName,
                    like: like,
                    dislike: dislike
                }
            ).pipe(take(1))
             .subscribe(
                data => {
                    console.log(data);
                    img.likes = data.NOlikes;
                    img.dislikes = data.NOdislikes;
                    img.rate = data.rate;
                },
                err => console.log(err)
            )
    }
    loadData(event) {
        this.getFriendsPosts(this.info);
        console.log('Done');
        console.log(event);
        event.target.complete();
    }
    isImageFormat(url: string): boolean {
        let format: string = url.split('.').pop().toLocaleLowerCase();
        return format === 'jpg' || format === 'jpeg' || format === 'jfif';
    }
    showComments(image){
        let postUrl = image.userName + '/' + image.url;
        this.userService.setPostComments(postUrl);
        this.router.navigate(['home/comment']);
    }
}