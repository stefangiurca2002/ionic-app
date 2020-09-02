import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrandingComponent } from './tranding.component';
import { CommonModule } from '@angular/common';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: TrandingComponent,
                pathMatch: 'full'
            }
        ])
    ],
    declarations: [
        TrandingComponent
    ]
})

export class TrandingModule{

}