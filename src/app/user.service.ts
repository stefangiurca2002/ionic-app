import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserCreate, IPosts, IUserAccount } from './user';
import { Observable,  BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class UserService{
    url: string = "http://192.168.1.8/mediaApp-BackEnd";
    userName: string;
    userCode: string;
    file = new BehaviorSubject<string>('');
    UserExplore = new BehaviorSubject<string>('');
    post = new BehaviorSubject<any>('');
    displayFollowAction = new BehaviorSubject<any>('');
    constructor(
        private http: HttpClient
        ){}

    PostUser(usr): Observable<IUserCreate>{
        return this.http.post<IUserCreate>(`${this.url}/postUser.php`, usr)
               .pipe(
                   tap(data => console.log(JSON.stringify(data)))
               )
    }
 
     getUsersName(info): Observable<any>{
         return this.http.post(`${this.url}/getUsers.php`,info)
     }

     createUserProfile(userName: IUserAccount): Observable<IUserAccount>{
         return this.http.post<IUserAccount>(`${this.url}/CreateUserProfile.php`, userName)
                         .pipe(
                             tap(data => console.log(data, 'in tap'))
                         );
     }

     encodeUserName(userName: string): string{
        userName = btoa(userName);
        userName = userName.replace(/=/g,'_');
         return userName;
     }

     uploadFile(file): Observable<any>{
        return this.http.post<any>(`${this.url}/uploadContent.php`,file);
     }
     getNewFile(): Observable<string>{
         return this.file.asObservable();
     }
     setNewFile(fileName: string){
         this.file.next(fileName);
     }

    getProfileData(data): Observable<IPosts[]>{
        return this.http.post<IPosts[]>(`${this.url}/UserData.php`, data);
    }
    validUserName(usrName: string): Observable<{[key: string]: boolean}>{
      return this.http.post<{[key: string]: boolean}>(`${this.url}/validUserName.php`,{userName: usrName})
                      .pipe(
                          tap(data => console.log(data, 'in tappp'))
                      );
    }
    validateAccount(data): Observable<{[key: string]: boolean}>{
        return this.http.post<{[key: string]: boolean}>(`${this.url}/validateAccount.php`, data);
    } 
    getUserExplore(): Observable<string>{
            return this.UserExplore.asObservable();
    }
    setUserExplore(name: string){
        this.UserExplore.next(name);
    }
    RateProfile(rate): Observable<any>{
        return this.http.post(`${this.url}/RateProfile.php`, rate);
    }
    getImageData(data): Observable<any>{
        return this.http.post(`${this.url}/getImageData.php`,data);
    }
    getRate(userName): Observable<any>{
        return this.http.post(`${this.url}/rate/rate.php`, userName);
    }
    getProfileImage(user): Observable<string>{
        return this.http.post<string>(`${this.url}/ProfileImage/getProfileImage.php`, user);
    }
    setImageProfile(file): Observable<any>{
        return this.http.post(`${this.url}/ProfileImage/setProfileImage.php`, file);
    }
    setPostComments(post){
        this.post.next(post);
    }
    getPostComments(): Observable<any>{
        return this.post.asObservable();
    }
    publicComment(info): Observable<any>{
        return this.http.post(`${this.url}/comment/postComment.php`, info);
    }
    getComments(info): Observable<any>{
        return this.http.post(`${this.url}/comment/getComments.php`, info);
    }
    addFriend(firendShip){
         this.http.post(`${this.url}/friends/postFriend.php`,firendShip)
                  .pipe(take(1))
                  .subscribe({
                      next: data => console.log(data),
                      error: err => console.log(err)
                  })
    }
    removeFriend(firendShip){
        this.http.post(`${this.url}/friends/removeFriend.php`,firendShip)
                 .pipe(take(1))
                 .subscribe(
                     data => {
                         console.log(data);
                     }
                 )
    }
     getFriendsNumber(info): Observable<any>{
         return this.http.post(`${this.url}/friends/getFriendsNumber.php`, info);
     }
     getFollows(info): Observable<any>{
         return this.http.post(`${this.url}/friends/getFollows.php`, info);
     }
     setFollowAction(action){
         this.displayFollowAction.next(action);
     }
     getFollowAction(): Observable<any>{
         return this.displayFollowAction.asObservable();
     }
     getFriendsContent(info): Observable<any>{
      return this.http.post(`${this.url}/friends/getFriendsPosts.php`, info);
     }
}