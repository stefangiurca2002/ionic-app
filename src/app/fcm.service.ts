import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import { FCM } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/ionic/FCM';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  isRegistered: boolean = false;
  constructor(
    private platform: Platform, 
    public http: HttpClient,
    private userService: UserService
   ) {}

// Get permission from the user
async getToken() {
let token;

if (this.platform.is('android')) {
token = await FCM.getToken()
}

if (this.platform.is('ios')) {
token = await FCM.getAPNSToken();
//await FCM.grantPermission();
}
// Post the token to your node server
this.http.post("http://192.168.1.8/mediaApp-BackEnd/storeToken/postToken.php", {token: token, userName: this.userService.userName})
.subscribe(data => {
console.log(data, 'from post token: ', token);
}, error => {
  console.log("err");
  console.log(JSON.stringify(error));
});
}

async checkToken(): Promise<string>{
  let token = await FCM.getToken();
  return token
}

// Listen to incoming FCM messages
listenToNotifications() {
     return FCM.onNotification()
}


}
