import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateAcountComponent } from './createAcount.compent';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: CreateAcountComponent,
                pathMatch: 'full'
            }
        ])
    ],
    declarations:[CreateAcountComponent]
})

export class CreateAcountModule{

}