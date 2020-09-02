import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommentComponent } from './comment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsContentComponent } from './comments-content.component';

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: CommentComponent,
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [
        CommentComponent,
        CommentsContentComponent
    ]
})

export class ComponentModule{

}