import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { HomeContentComponent } from './home-content/home-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    imports:[     
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
           {
             path: '',
             component: HomeComponent,
             pathMatch: 'full'
           },
           {
             path: 'explore',
             loadChildren: () => import('../explore/explore.module').then(m => m.ExploreModule)
           },
           {
             path: 'post',
             loadChildren: () => import('../postContent/post-content.module').then(m => m.PostContentModule)
           },
           {
             path: 'tranding',
             loadChildren: () => import('../tranding/tranding.module').then(m => m.TrandingModule)
           },
           {
            path: 'comment',
            loadChildren: () => import('../comment/comment.module').then(m => m.ComponentModule)
         },
         {
           path: 'follow',
           loadChildren: () => import("./follow/follow.module").then(m => m.FollowModule)
         },
         {
           path: 'new',
           loadChildren: () => import('../new/new.module').then(m => m.NewModule)
         },
         {
           path: 'loby',
           loadChildren: () => import('../messages/messages.module').then(m => m.MessagesModule)
         }
        ])
    ],
    declarations:[
      HomeComponent,
      HomeContentComponent
    ]
})

export class HomeModule{

}