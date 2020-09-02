import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports:([
            CommonModule,
            FormsModule,
            RouterModule.forChild([
                {
                    path: '',
                    component: ExploreComponent,
                    pathMatch: 'full'
                }
            ])
        ]),
        declarations:[
            ExploreComponent
        ]
})

export class ExploreModule{

}