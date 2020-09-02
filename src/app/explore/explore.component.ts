import { Component, OnInit} from '@angular/core';
import { IUserAccount } from '../user';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';


@Component({
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss']
})

export class ExploreComponent implements OnInit{
    usersAccounts: IUserAccount[];
    friendsrequest: boolean[] = [];
    SearchUser: string = '';
    info;
        constructor(
        private userService: UserService,
        private router: Router
        ){
            this.info = {
                userName: this.userService.userName,
                limit: 20,
                offset: 0,
                search: null
            }
        }

    ngOnInit(): void {
        this.getUsers(this.info);
    }

    SearchInputCahnged(value: string){
        console.log(value, 'value');
            this.info.offset = 0;
            this.usersAccounts = [];
        if(value.replace(/' '/g, '')){
            this.info.search = value;
            this.getUsers(this.info);
        }
        else{
            this.info.search = null;
            this.getUsers(this.info);
        }
    }

    getUsers(info){
        this.userService.getUsersName(info)
        .pipe(take(1))
        .subscribe(
            data => {
                console.log(data);
                this.usersAccounts = this.usersAccounts ? this.usersAccounts.concat(data.result) : data.result;
                this.info.offset = data.offset;
            },
            err => console.log(err),
            () => console.log('succes render users')
        )
    }

    loadUsers(event){
        this.getUsers(this.info);
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

    addFriend(usrName){
        console.log(usrName);
       this.friendsrequest[usrName] = true;
       let friendShip = {
           userName: this.userService.userName,
           friend: usrName
       }
       this.userService.addFriend(friendShip);
    }
    removeFriend(userName){
        this.friendsrequest[userName] = false;
        let friendShip = {
            userName: this.userService.userName,
            friend: userName
        }
        this.userService.removeFriend(friendShip);
    }
       
}