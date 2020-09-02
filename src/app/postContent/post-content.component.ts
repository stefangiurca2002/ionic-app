import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './post-content.component.html',
    styleUrls: ['./post-content.component.scss']
})

export class PostContentComponent implements OnInit, OnDestroy {
    formContentPost: FormGroup;
    file;
    sendfile = false;
    userName: string ;
    Subscribstions: Subscription = new Subscription();
    
    constructor(private fb: FormBuilder,
        private userService: UserService,
        private router: Router
                ) { }
    ngOnInit(): void {
        this.formContentPost = this.fb.group({
            imageName: ''
        })
    }

    ngOnDestroy(){
        this.Subscribstions.unsubscribe();
    }
      /////
    SelectImage(file){
       this.formContentPost.get('imageName').setValue(file.target.files[0]);
    }
    onSubmit() {
        if (this.formContentPost.get('imageName').value && !this.sendfile) {
            this.sendfile = true;
            const file = this.formContentPost.get('imageName').value;
            
            const formData = new FormData();
            let userCode = this.userService.encodeUserName(this.userService.userCode);
            formData.append(userCode, file);
            console.log(formData);
           this.Subscribstions.add(this.userService.uploadFile(formData).subscribe(
                (res) => {
                    console.log(res);
                    this.userService.setNewFile(res.fileName);
                    this.router.navigate(['/home']);
                },
                (err) => {
                    console.log(err);
                }
            )
           );
        }
    }
}