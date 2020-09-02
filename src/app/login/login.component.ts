import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { FcmService } from '../fcm.service';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
    FormSubmited: boolean = false;
    customerForm: FormGroup;
    Subscribstions: Subscription = new Subscription();
    createAccount: boolean = false;
    invalidUserName: boolean = false;
    createUserName: string;
    userCode: string;
    constructor(
        private router: Router,
        private authGuard: AuthGuard,
        private userService: UserService,
        private fcm: FcmService,
        private platform: Platform,
        private http : HttpClient
        ) { }

    ngOnInit(): void {
        let that = this;
        window.addEventListener("beforeunload", ()=>{
            that.unfinalizateAccount();
        });
    }

    ngOnDestroy(){
        this.Subscribstions.unsubscribe();
    }

    unfinalizateAccount(){
        let verifyUser = this.http.post('http://192.168.1.8/mediaApp-BackEnd/googleSign/deleteUnfinalizateUser.php',{
            code: this.userCode
        })
        .subscribe(
            () =>{
                console.log('sters');
                verifyUser.unsubscribe();
            }
        )
    }
    signupWithGoogle(){
        if(this.platform.is('android') || this.platform.is('ios')){
        GooglePlus.login({
            'webClientId': '518963214604-cslceeunq8bhpvsgm0m67a57q3cf6m6v.apps.googleusercontent.com',
            'offline': true
          }).then( res => {
            firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
              .then( () => {
                  console.log(res.accessToken);
                  this.fcm.checkToken().then(divaceToken =>{
                    this.http.post<any>('http://192.168.1.8/mediaApp-BackEnd/googleSign/auth.php', {token: res.accessToken, divaceToken: divaceToken})
                    .pipe(take(1))
                    .subscribe(
                        data => {
                            console.log(data, 'in loginnnnnnnn');
                            if(data.userName){
                               this.authGuard.loged = true;
                               this.userService.userCode = data.code;
                               this.userService.userName = data.userName;
                               this.router.navigate(['/home', { replaceUrl: true }]);
                            }
                            else
                            this.createAccount = true;
                        }
                    )
                  })
              })
              .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
            }).catch(err => console.error("Error: ", err));
        }else{
            var provider = new firebase.auth.GoogleAuthProvider();
            var that = this;
            firebase.auth().signInWithPopup(provider).then(function(result) {
                const credential = result.credential as firebase.auth.OAuthCredential;
                const token = credential.accessToken;
                 console.log(token);
                that.http.post<any>('http://192.168.1.8/mediaApp-BackEnd/googleSign/auth.php', {token: token})
                .pipe(take(1))
                .subscribe(
                    data => {
                        console.log(data);
                          if(data.userName){
                                that.authGuard.loged = true;
                                that.userService.userName = data.userName;
                                that.userService.userCode = data.code;
                                that.router.navigate(['/home', { replaceUrl: true }]);
                          }
                          else{
                           that.createAccount = true;
                           that.userCode = data.code;
                          }
                    }
                )
              })
        }
    }
    verifyUserName(){
            this.userService.validateAccount({userName: this.createUserName})
            .pipe(take(1))
            .subscribe(
                data => {
                    if(data.valid){
                        if(this.platform.is('android') || this.platform.is('ios')){
                        this.fcm.checkToken().then(token => {
                           this.postUser(token);
                        })
                        }
                        else{
                            this.postUser(null);
                        }
                    }
                    else{
                     this.invalidUserName = true;
                    }
                }
            )
    }
  postUser(token){
  this.userService.userName = this.createUserName;
  this.userService.userCode = this.userCode + this.createUserName;
  this.userService.PostUser({
      userName: this.createUserName,
      code: this.userCode,
      token: token
  }).pipe(take(1))
      .subscribe(
              res => console.log(res)
      )
      this.authGuard.loged = true;
      this.router.navigate(['/home', { replaceUrl: true }]);
  }
}