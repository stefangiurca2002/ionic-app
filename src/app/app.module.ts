import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { MenuComponent } from './menu/menu.component';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FCM } from '@ionic-native/fcm/ngx';
//import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const fireConfig = {
  apiKey: "AIzaSyAUZb3q4GPpxrI8Y6myjOLm2B-SmTgV_RM",
  authDomain: "notifications-aee7f.firebaseapp.com",
  databaseURL: "https://notifications-aee7f.firebaseio.com",
  projectId: "notifications-aee7f",
  storageBucket: "notifications-aee7f.appspot.com",
  messagingSenderId: "518963214604",
  appId: "1:518963214604:web:46d53daf37841b865a3129",
  measurementId: "G-PHMYCZEVK9"
}
const config: SocketIoConfig = { url: 'http://192.168.1.8:4444', options: {} };
import * as firebase from 'firebase';

firebase.initializeApp(fireConfig);
@NgModule({
  declarations: [AppComponent, MenuComponent],
  entryComponents: [],
  imports: [BrowserModule, 
            HammerModule,
            HttpClientModule,
            AngularFireModule.initializeApp(fireConfig), 
            AngularFirestoreModule,
            SocketIoModule.forRoot(config),
            IonicModule.forRoot(), 
            ///LoginModule,
            AppRoutingModule],
  providers: [
    LocalNotifications,
    StatusBar,
    SplashScreen,
    Crop,
    Camera,
    File,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
