import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FollowComponent } from './follow.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: FollowComponent,
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [
        FollowComponent
    ]
})

export class FollowModule{

}