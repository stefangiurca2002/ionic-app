import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FcmService } from './fcm.service';
@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{
    loged: boolean = false;
    constructor(
        private router: Router,
        private fcm: FcmService
        ){}
    canActivate(): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        console.log('in guard', this.loged, this.fcm.isRegistered);
        if(!this.loged && !this.fcm.isRegistered){
        this.router.navigate(['/login']);
        return false;
       }
        return true;
    }

}