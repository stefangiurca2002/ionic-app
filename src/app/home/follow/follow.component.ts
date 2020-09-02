import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    templateUrl: './follow.component.html',
    styleUrls: ['./follow.component.scss']
})

export class FollowComponent implements OnInit{
    title: string;
    limit = 20;
    offset = 0;
    friends = [];
    constructor(
        private userService: UserService,
        private router: Router
    ){}
    ngOnInit(): void {
        this.userService.getFollowAction()
                        .pipe(take(1))
                        .subscribe(
                            data => {
                                console.log(data);
                                this.title = data.action;
                                let info = {
                                    userName: data.userName,
                                    user: this.userService.userName,
                                    action: data.action,
                                    limit: this.limit,
                                    offset: this.offset
                                }
                                this.getUsers(info);
                            }
                        )
    }

    getUsers(info){
        this.userService.getFollows(info)
                        .pipe(take(1))
                        .subscribe(
                            data => {
                                 console.log(data);
                                 this.friends = this.friends ? this.friends.concat(data) : data;
                            }
                        )
     this.offset += this.limit;
    }

    loadUsers(event){
        let info = {
            userName: this.userService.userName,
            limit: this.limit,
            offset: this.offset
        }
        this.getUsers(info);
        event.target.complete();
    }

    exploreUser(name: string){
        console.log(name, 'in explore usr');
       this.router.navigate(['/home'],{
           queryParams:{
               exploreUser: name
           }
       })
    }

    addFriend(friend){
        friend.friend = true;
        let friendShip = {
            userName: this.userService.userName,
            friend: friend.name
        }
        this.userService.addFriend(friendShip);
    }

    removeFriend(friend){
        friend.friend = false;
        let friendShip = {
            userName: this.userService.userName,
            friend: friend.name
        }
        this.userService.removeFriend(friendShip);
    }
      
}