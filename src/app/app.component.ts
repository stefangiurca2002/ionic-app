import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { FcmService } from './fcm.service';
// import { Firebase } from '@ionic-native/firebase/ngx';
import { tap, take } from 'rxjs/operators';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent{
  files: Observable<any>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private userService: UserService,
    private router: Router,
    private authGuard: AuthGuard,
    private http: HttpClient,
    private toastCtrl: ToastController  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('now platform is ready');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // // Listen to incoming messages
        if(this.platform.is('android') || this.platform.is('ios')){
      this.fcm.listenToNotifications().pipe(
        tap(async msg => {
          // show a toast
          const toast = this.toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          (await toast).present();
        })
      )
        .subscribe();
        
        GooglePlus.trySilentLogin({
      'webClientId': '518963214604-cslceeunq8bhpvsgm0m67a57q3cf6m6v.apps.googleusercontent.com', 
      'offline': false
        }).then( obj =>{
          this.sendRequest(obj.accessToken);
          console.log( obj.accessToken);
          var interval = setInterval(()=>{
            this.sendRequest(obj.accessToken,interval);
          },1000);
        }).catch(
          err => {
            console.log({error: err});
            this.router.navigate(['/login', { replaceUrl: true }]);
          }
        )

      }
      else{
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }
  sendRequest(token, interval?){
    this.http.post<any>('http://192.168.1.8/mediaApp-BackEnd/googleSign/auth.php', {token: token})
    .subscribe(
        data => {
            if(data){
               this.authGuard.loged = true;
               this.userService.userName = data.userName;
               this.userService.userCode = data.code;
               clearInterval(interval);
               this.router.navigate(['/home'], { replaceUrl: true });
            }
          }
    )
  }
}