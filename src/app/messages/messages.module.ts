import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessagesComponent } from './messages.component';
// import { MessagesContentComponent } from './messages-content.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LobyComponent } from './loby.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: LobyComponent,
                pathMatch: 'full'
            },
            {
                path: 'message',
                component: MessagesComponent
            }
        ])
    ],
    declarations: [
        MessagesComponent,
        // MessagesContentComponent,
        LobyComponent
    ]
})

export class MessagesModule{

}