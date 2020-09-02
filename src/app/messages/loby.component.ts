import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    templateUrl: './loby.component.html',
    styleUrls: ['./loby.component.scss']
})

export class LobyComponent implements OnInit{
    lobbys = [];
    info;
    constructor(
        private userService: UserService,
        private messageService: MessagesService,
        private router: Router
        ){
            this.info = {
                limit: 10,
                offset: 0,
                userCode: userService.userCode
            }
        }
    ngOnInit(): void {
    this.getLobys();
    }
    getLobys(){
        console.log(this.info);
        this.messageService.getLobbys(this.info)
        .pipe(take(1))
        .subscribe(
            data => {
                console.log(data);
                this.lobbys = this.lobbys ? this.lobbys.concat(data) : data;
            }
        )
        this.info.offset += this.info.limit;
    }
    navigate(url: string, user: string){
        this.messageService.setUserTriggered(user);
       this.router.navigate([url]);
    }
    loadData(event){
        this.getLobys();
        event.target.complete();
    }
}