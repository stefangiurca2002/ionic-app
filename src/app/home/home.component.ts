import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { take } from 'rxjs/operators';
import { MessagesService } from '../messages/messages.service';
import { Socket } from 'ngx-socket-io';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  RatingValue = 0;
  follow: number;
  followers: number;
  PostsNumber: number;
  userName: string;
  ImageProfile: string;
  Subscribstions: Subscription = new Subscription();
  croppedImagepath = "";
  isLoading = false;
  isBrowser: boolean;
  canChangeProfileImage: boolean;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(
     private route: ActivatedRoute,
     private router: Router,
     private userService: UserService,
     private messageService: MessagesService,
     private camera: Camera,
     private crop: Crop,
     public actionSheetController: ActionSheetController,
     private fileCrop: File,
     private platform: Platform,
     private socket: Socket
             ){
               this.isBrowser = this.platformBrowser();
             }

   ngOnInit(){
     console.log('codul este ', this.userService.userCode);
                this.socket.emit('inApp', {
                  code: this.userService.userCode
              })
       this.userName = this.userService.userName;
       console.log('in homeInit', this.userName);
      this.Subscribstions.add(this.route.queryParams.subscribe(
         usr => {
           if(usr.exploreUser){
             this.userName = usr.exploreUser;
             this.canChangeProfileImage = false;
           }
           else{
             this.userName = this.userService.userName;
             this.canChangeProfileImage = true;
           }
           this.userService.setUserExplore(this.userName);
         }
       )
      )
      
      this.Subscribstions.add(
        this.userService.getUserExplore()
                        .subscribe(
                          userName => {
                            if(userName){
                             this.userService.getProfileImage({userName: userName})
                             .pipe(take(1))
                             .subscribe(
                              img => {
                                console.log(img);
                               this.ImageProfile = 'http://192.168.1.8/mediaApp-BackEnd/uploads/ProfileImages/' + img;
                              }
                           )
                           this.userService.getFriendsNumber({userName: userName})
                                           .pipe(take(1))
                                           .subscribe(
                                             data => {
                                               console.log(data)
                                               this.follow = data.follow;
                                               this.followers = data.followers;
                                             }
                                           )
                          }
                        }
                        )
      )
   }

   ngOnDestroy(){
     this.Subscribstions.unsubscribe();
   }
   platformBrowser(){
     return !(this.platform.is('android') || this.platform.is('ios'));
   }

   pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: 2
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cropImage(imageData)
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 100 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.fileCrop.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
      this.Subscribstions.add(
        this.userService.setImageProfile({image: this.croppedImagepath, userCode: this.userService.userCode})
                        .subscribe(
                          data => {
                            this.ImageProfile = 'http://192.168.1.8/mediaApp-BackEnd/uploads/ProfileImages/' + data.userName;
                          },
                          err => {
                            console.log(err);
                          }
                        )
      )
      this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }
   
  UpdateRating(value: number){
    this.RatingValue = value;
  }
  getProfilePostsNumber(value: number){
    this.PostsNumber = value;
  }
  changeProfileImage(event){
    let file = event.target.files[0];
    const formData = new FormData();
    var code = this.userService.encodeUserName(this.userService.userCode);
    formData.append(code, file);
    console.log(file, this.userService.userCode);
    this.Subscribstions.add(
      this.userService.setImageProfile(formData)
                      .subscribe(
                        data => {
                          console.log(data);
                          this.ImageProfile = 'http://192.168.1.8/mediaApp-BackEnd/uploads/ProfileImages/' + data.userName;
                        },
                        err => console.log(err)
                      )
    )
  }
  displayFollows(){
    let action = {
      action: 'follow',
      userName: this.userName
    }
    this.userService.setFollowAction(action);
    this.router.navigate(['home/follow'])
  }
  displayFollowers(){
    let action = {
      action: 'followers',
      userName: this.userName
    }
    this.userService.setFollowAction(action);
    this.router.navigate(['home/follow'])
  }
  setUserTrigerred(){
    this.messageService.setUserTriggered(this.userName);
  }
}