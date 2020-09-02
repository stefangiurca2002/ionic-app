import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';


@NgModule({
    imports:[
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([
           {
               path: '',
               component: LoginComponent,
               pathMatch: 'full'
           }
        ])
    ],
    declarations:[
        LoginComponent
    ]
})

export class LoginModule{

}