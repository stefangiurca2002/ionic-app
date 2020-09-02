import { Component, OnInit, OnDestroy} from '@angular/core';
import { MessagesService } from './messages.service';
import { UserService } from '../user.service';
import { Socket } from 'ngx-socket-io';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    providers: [DatePipe]
})

export class MessagesComponent implements OnInit, OnDestroy{
   text: string = '';
   $messageSubscribtion: Subscription;
   messages = [];
   user;
   chunkData;
   unSeenIndex = -1;
   _unseen: boolean = false;

constructor(
    private messageService: MessagesService,
    private userService: UserService,
    private socket: Socket,
    private date: DatePipe
    ){
        this.chunkData = {
            limit: 10,
            offset: 0,
            user1: userService.userCode,
            user2: null
        }
    }
    ngOnInit(): void {
        this.messageService.getUserTriggered()
        .pipe(take(1))
        .subscribe(
            user => {
         this.chunkData.user2 = user;
        this.getOldMessages();
             this.user = user;
            //this.socket.emit('enterChat', this.room);
            this.messageService.message.next(null);
            }
        )
this.$messageSubscribtion =  this.messageService.getMessage()
        .subscribe(
           msg => {
               if(msg && msg.from == this.user){
               console.log(msg);
            //    if(!msg.date){
            //        let newdate = new Date();
            //        msg.date = this.date.transform(newdate, 'yyyy-MM-dd HH-mm-ss');
            //    }
               this.messageService.setMessageViewStatus({user1: this.userService.userName, user2: this.user});
               this.messages.unshift(msg);
               }
           }
        )
        
    }
    ngOnDestroy(): void {
        this.$messageSubscribtion.unsubscribe();
    }
    getOldMessages(){
        this.messageService.getOldMessages(this.chunkData)
        .pipe(take(1))
        .subscribe(
            msg => {
                 console.log(msg);
                if(msg.unSeenResult.length>0){
                this.messages = this.messages ? this.messages.concat(msg.unSeenResult) : msg.unSeenResult;
                this.chunkData.offset = msg.unSeenResult.pop().offset;
                this.unSeenIndex = this.messages.length-1;
                this.messageService.setMessageViewStatus({user1: this.userService.userName, user2: this.user});
                }
                if(msg.result.length>0){
                this.messages = this.messages ? this.messages.concat(msg.result) : msg.result;
                this.chunkData.offset = msg.result.pop().offset;
                console.log(this.messages);
                }
                
            }
        )
    }
    loadMessages(event){
          this.getOldMessages();
          event.target.complete();
    }
onSubmit(){
    let newdate = new Date();
    let date = this.date.transform(newdate, 'yyyy-MM-dd HH-mm-ss');
    let room = {
        user1: this.userService.userCode,
        user2: this.user,
        msg: this.text,
        date: date
    }
    this.messageService.PostMessage(room);
    this.messages.unshift({
        you: this.text,
        user: null,
        date: date
    });
        this.socket.emit('emitMessage', {code: this.userService.userCode, user: this.user, msg: this.text, date: date});
        this.text = '';
        this.unSeenIndex = -1;
}
 unSeen(msg){
    return msg === this.messages[this.unSeenIndex];
}
}