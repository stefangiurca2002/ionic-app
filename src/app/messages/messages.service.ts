import { Injectable } from '@angular/core';
 import { Socket } from 'ngx-socket-io';
import { Observable, BehaviorSubject } from 'rxjs';
import {  HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';
 @Injectable({
     providedIn: 'root'
 })
export class MessagesService{
    url: string = "http://192.168.1.8/mediaApp-BackEnd"
    message: BehaviorSubject<any> = new BehaviorSubject<any>('');
    userTriggered: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    notify: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    $canEmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
     constructor(
         //private socket: Socket,
         private http: HttpClient,
         private socket: Socket
         ){
             this.socket.on('NewMessage', (msg)=>{
                   this.message.next({
                       you: null,
                       user: msg.msg,
                       from: msg.from,
                       date: msg.date
                   })
             })
         }
    setMessageViewStatus(room){
        this.http.post(`${this.url}/messages/setMessageViewStatus.php`,room)
                 .pipe(take(1))
                 .subscribe(
                     data => {
                         console.log(data);
                     }
                 )
    }
    getNotify(): Observable<string>{
        return this.notify.asObservable();
    }
       getMessage(): Observable<any>{
           return this.message.asObservable();
       }
       getLobbys(user): Observable<any>{
           return this.http.post(`${this.url}/messages/getLobbys.php`,user);
       }
       PostMessage(room){
            this.http.post(`${this.url}/messages/postMessange.php`,room)
                     .pipe(take(1))
                     .subscribe(
                         data => console.log(data)
                     );
       }
       getOldMessages(chunk): Observable<any>{
           return this.http.post(`${this.url}/messages/getOldMessages.php`, chunk);
       }
       setUserTriggered(user: string){
           this.userTriggered.next(user);
       }
       getUserTriggered(): Observable<string>{
           return this.userTriggered.asObservable();
       }
       setCanEmit(){
           this.$canEmit.next(true);
       }
       getCanEmit(): Observable<boolean>{
           return this.$canEmit.asObservable();
       }
}