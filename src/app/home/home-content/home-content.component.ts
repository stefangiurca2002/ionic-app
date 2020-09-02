import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { IPosts } from 'src/app/user';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Comment } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-content',
    templateUrl: './home-content.component.html',
    styleUrls: ['./home-content.component.scss']
})

export class HomeContentComponent implements OnInit, OnDestroy {
    // @Input() verticalView: boolean;
    @Output() sendProfileRating: EventEmitter<number> = new EventEmitter<number>();
    @Output() sendProfilePostsNumber: EventEmitter<number> = new EventEmitter<number>();
    imagesUrl: IPosts[] = null;
    EmptyAccount: string;
    userName: string;
    Subscribstions: Subscription = new Subscription();
    LoadedImage: boolean[] = [];
    liked: boolean[] = [];
    disliked: boolean[] = [];
    rating: number = 0;
    NOposts: number = 0;
    limit: number = 3;
    offset: number = 0;
    MessageForm: FormGroup;
    index: number = 0;
    displayComments: boolean[] = [];
    commentsOffset: number = 0;
    commentsLimit: number = 5;
    comments = [];

    imageIndex: number = 0;
    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.Subscribstions.add(this.userService.getUserExplore().subscribe(
            curentName => {
                this.offset = 0;
                this.liked = [];
                this.disliked = [];
                this.imagesUrl = null;
                this.userName = this.userService.encodeUserName(curentName);
                let info = {
                    userName: this.userName,
                    limit: this.limit,
                    offset: this.offset
                };

                this.getProfileData(info);

                this.Subscribstions.add(
                    this.userService.getRate({ userName: this.userName }).subscribe(
                        rate => {
                            console.log(rate);
                            this.rating = rate.rate;
                            this.NOposts = rate.NOposts;
                            this.sendProfileRating.emit(this.aprox(this.rating));
                            this.sendProfilePostsNumber.emit(this.NOposts);
                        },
                        err => console.log(err)
                    )
                )

                this.Subscribstions.add(this.userService.getNewFile()
                    .subscribe(
                        newImg => {
                            if (newImg && this.userName === this.userService.userName) {
                                this.imagesUrl.unshift({
                                    id: this.imagesUrl.length,
                                    url: newImg,
                                    likes: 0,
                                    dislikes: 0,
                                    Rating: 0
                                });
                                this.sendProfilePostsNumber.emit(this.imagesUrl.length);
                            }
                        }
                    )
                );
            }
        )
        );

       this.MessageForm = this.fb.group({
          'messageInput': this.fb.array([])
       })

    }
   get messageInput(){
       return <FormArray>this.MessageForm.get('messageInput');
   }
    ngOnDestroy() {
        console.log('in ondestroy');
        this.Subscribstions.unsubscribe();
    }

    getIndex(): number{
        return 6;
    }

    loadData(event) {
        this.offset += this.limit;
        let getMoreData = {
            userName: this.userName,
            limit: this.limit,
            offset: this.offset
        };
        this.getProfileData(getMoreData);
        console.log('Done');
        console.log(event);
        event.target.complete();
    }

    getProfileData(infoChunk) {
        this.userService.getProfileData(infoChunk)
            .pipe(take(1))
            .subscribe(
                data => {
                    console.log(data);
                    for(let i=0; i<data.length; i++){
                        this.messageInput.push(new FormControl('', Validators.maxLength(250)));
                    }
                    this.imagesUrl = this.imagesUrl ? this.imagesUrl.concat(data) : data;
                    this.userService.getImageData({ images: data, user: this.userService.encodeUserName(this.userService.userName) })
                        .pipe(take(1))
                        .subscribe(
                            rate => {
                                console.log(rate);
                                for (let i = 0; i < rate.length; i++) {
                                    this.liked[rate[i].PostName] = rate[i].like;
                                    this.disliked[rate[i].PostName] = rate[i].dislike;
                                }
                            }
                        )
                }
            )
    }

    rate(img, like: number, dislike: number) {
        console.log(img);
        this.liked[img.url] = like == 1;
        this.disliked[img.url] = dislike == 1;
        let UserNameEncoded: string = this.userService.encodeUserName(this.userService.userName);
        this.Subscribstions.add(
            this.userService.RateProfile(
                {
                    userName: UserNameEncoded,
                    userRated: this.userName,
                    postName: img.url,
                    like: like,
                    dislike: dislike
                }
            ).subscribe(
                data => {
                    console.log({ 'data': data , 'noPosts': this.NOposts});
                    img.likes = data.NOlikes;
                    img.dislikes = data.NOdislikes;
                    img.score = data.score;
                    img.Rating = data.rate;
                    this.sendProfileRating.emit(this.aprox(data.newRate));
                },
                err => console.log(err)
            )
        );
    }
    aprox(value: number): number {
        return Math.round(value * 100) / 100;
    }

    newRow(value: number): boolean {

        return value % 3 == 0;
    }
    hideLoader(url: string) {
        console.log(url);
        this.LoadedImage[url] = true;
    }
    isImageFormat(url: string): boolean {
        let format: string = url.split('.').pop().toLocaleLowerCase();
        return format === 'jpg' || format === 'jpeg' || format === 'jfif';
    }
    hideComments(url){
       this.displayComments[url] = false;
       this.commentsOffset = 0;
    }
    showComments(image){
    let postUrl = this.userName + '/' + image.url;
    this.userService.setPostComments(postUrl);
    this.router.navigate(['home/comment']);
}
}