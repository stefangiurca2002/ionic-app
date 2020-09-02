import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostContentComponent } from './post-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: PostContentComponent,
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [
        PostContentComponent
    ]
})

export class PostContentModule{

}