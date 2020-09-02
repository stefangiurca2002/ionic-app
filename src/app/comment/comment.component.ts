import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { take } from 'rxjs/operators';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})

export class CommentComponent implements OnInit{
    MessageForm: FormGroup
    limit = 20;
    offset = 0;
    postName: string;
    comments = [];
     constructor(
         private userService: UserService,
         private _location: Location,
         private fb: FormBuilder
        ){}

    ngOnInit(): void {
        this.MessageForm = this.fb.group({
            'messageControl': ['', Validators.maxLength(250)]
        })
        
        this.userService.getPostComments()
                        .pipe(take(1))
                        .subscribe(
                            image =>{
                                console.log(image);
                                this.postName = image;
                                let info = {
                                    limit: this.limit,
                                    offset: this.offset,
                                    postName: this.postName
                                }
                                this.getComments(info);
                            }
                        )
    }

    getComments(info){
     this.userService.getComments(info)
                     .pipe(take(1))
                     .subscribe(
                         data => {
                             console.log(data);
                             this.comments = this.comments ? this.comments.concat(data) : data;
                         }
                     )
        this.offset += this.limit;
    }

    publicComment(){
        let comm = '';
        for(let i=0; i<this.MessageForm.get('messageControl').value.length; i++){
          if(this.MessageForm.get('messageControl').value[i] === ' ' && i>0 && this.MessageForm.get('messageControl').value[i-1] !==' '){
              comm += ' ';
          }
          else if(this.MessageForm.get('messageControl').value[i] !== ' '){
              comm += this.MessageForm.get('messageControl').value[i];
          }
        }
        if(comm){
        let info = {
            userName: this.userService.userName,
            postName: this.postName,
            comment: comm
        }
        this.MessageForm.reset();
        this.userService.publicComment(info)
                        .pipe(take(1))
                        .subscribe(
                            data =>{
                                console.log(data);
                                this.comments.push({
                                 'userName': this.userService.userName,
                                 'comment': data.comment
                                });
                            }
                        )
        }
        else{
            alert('invalid text');
        }
    }

    loadComments(event?){
      let info = {
          limit: this.limit,
          offset: this.offset,
          postName: this.postName
      }
      this.getComments(info);
      //event.target.complete();
    }

    back(){
        this._location.back();
    }

}