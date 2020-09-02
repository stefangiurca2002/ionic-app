import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { MessagesService } from '../messages/messages.service';
import { AuthGuard } from '../auth.guard';
//import { Socket } from 'ngx-socket-io';

@Component({
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit, OnDestroy{
        title: string;
        userName$: Subscription;
        Subscribstions: Subscription = new Subscription();
        canNotify: boolean = false;
        notification = {};
        logoutTriggered: boolean = false;
        constructor(
                    private router: Router,
                    private userService: UserService,
                    private menuCtrl: MenuController,
                    private messageService: MessagesService,
                    private authGuard: AuthGuard
                    ){}

        ngOnInit(){
            let url: string[] = [];
         this.Subscribstions.add(this.router.events.subscribe(
              () => {
                   url = this.router.url ? this.router.url.split('?') : url;
                  if(url[0] === '/home'){
                          this.userService.getUserExplore()
                          .pipe(take(1))
                          .subscribe(
                             {
                                 next: usr => {
                                     this.title = usr;
                                    },
                                 error: err => console.log(err)
                             }
                          )
                  }
                  else if(url[0] === '/home/explore'){
                       this.title = 'explore';
                  }
                  else if(url[0] === '/home/tranding'){
                      this.title = 'tranding';
                  }
                  else if(url[0] === '/home/new'){
                      this.title = 'friends';
                  }
                  else if(url[0] === '/home/loby'){
                     this.title = 'loby';
                  }
                  else if(url[0] === '/home/loby/message'){
                      this.messageService.getUserTriggered()
                                         .pipe(take(1))
                                         .subscribe(
                                             data => this.title = data
                                         )
                  }
              }
          )
         );
         this.Subscribstions.add(
              this.messageService.getNotify()
                                 .subscribe(
                                     notify =>{
                                         console.log(url);
                                         if(url[0] !== '/home/loby/message' && notify){
                                             this.canNotify = true;
                                            this.notification = notify;
                                            setInterval(()=>{
                                                   this.canNotify = false;
                                            }, 5000);
                                         }
                                     }
                                 )
         )
        }

        ngOnDestroy(){
            this.Subscribstions.unsubscribe();
        }

        
        navigate(url: string){
            this.menuCtrl.close();
            this.router.navigate([url]);
                  }
        logout(){
           this.logoutTriggered = true;
           this.menuCtrl.close();
        }
        logoutConfirmation(valid){
            console.log(valid, 'clicked');
            if(valid){
                this.authGuard.loged = false;
                this.router.navigate(['/login']);
            }
            else{
                this.logoutTriggered = false;
            }
        }
}