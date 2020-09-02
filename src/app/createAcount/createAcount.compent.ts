import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthGuard } from '../auth.guard';
import { IUserAccount } from '../user';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './createAcount.component.html',
    styleUrls: ['./createAcount.component.scss']
})

export class CreateAcountComponent implements OnInit, OnDestroy {
    createAcountForm: FormGroup;
    FormSubmited: boolean = false;
    invalidUserName: boolean;
    Subscribstions: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private authGuard: AuthGuard
    ) { }

    ngOnInit(): void {
        this.createAcountForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            secondary: this.fb.array([this.buildName()]),
            userName: ['', [Validators.required, Validators.minLength(3)]],
            emailAddress: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3)]],
            notify: [{ value: true }],
            country: ['',Validators.required]
        })
        this.invalidUserName = false;
    }

    ngOnDestroy(){
        this.Subscribstions.unsubscribe();
    }

    get secondary(): FormArray {
        return <FormArray>this.createAcountForm.get('secondary');
    }

    buildName(): FormGroup {
        return this.fb.group(
            {
                secondaryName: ['', [Validators.required, Validators.minLength(3)]]
            }
        )
    }
    addName() {
        this.secondary.push(this.buildName());
    }

    onSubmit(): void {
        console.log(this.createAcountForm.valid)
        if (this.createAcountForm.valid) {
            this.Subscribstions.add(this.userService.validUserName(this.createAcountForm.value.userName)
                .subscribe
                (
                    (isValid) => {
                        if (isValid.valid) {
                            let UserName: string = this.createAcountForm.value.userName;
                            let usrName: IUserAccount = {
                                userName: this.userService.encodeUserName(UserName)
                            };
                                        this.Subscribstions.add(this.userService.PostUser(this.createAcountForm.value)
                                            .subscribe(
                                                data => console.log(data),
                                                err => console.log(err),
                                                () => console.log('user insert succesful')
                                            )
                                        );
                                        this.authGuard.loged = true;
                                        this.router.navigate(['/home']);
                                        this.userService.userName = this.createAcountForm.value.userName;
                        }
                        else {
                            this.FormSubmited = true;
                            this.invalidUserName = true;
                        }
                    }
                )
            );
        }
        else{
            this.FormSubmited = true;
        }
    }

    changeEmailStatus() {
        let status: boolean = this.createAcountForm.get('notify').value;
        console.log(status);
        if (!status) {
            console.log(status);
            this.createAcountForm.get('emailAddress').setValidators([Validators.required, Validators.email]);
        }
        else {
            console.log(status);
            this.createAcountForm.get('emailAddress').clearValidators();
        }
        this.createAcountForm.get('emailAddress').updateValueAndValidity();
    }
    canAddName(): boolean {
        return this.secondary.length < 3;
    }

    loadData(event) {
        setTimeout(() => {
            console.log('Done');
            event.target.complete();
            if (event.length == 1000) {
                event.target.disabled = true;
            }
        }, 500);
    }
}