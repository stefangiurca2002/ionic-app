import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewComponent } from './new.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: NewComponent,
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [
        NewComponent
    ]
})

export class NewModule{

}