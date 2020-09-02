import { NgModule} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotfound } from './404/404.component';
import { MenuComponent } from './menu/menu.component';
import { AuthGuard } from './auth.guard';
import { FirstNavigationComponent } from './firstNavigation/firstNavigation.component';

const routes: Routes = [
  {
   path: '',
   component: FirstNavigationComponent,
   pathMatch:'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'create',
    loadChildren: './createAcount/createAcount.module#CreateAcountModule'
  },
   {
  
       path: 'home',
       canActivate: [AuthGuard],
       component: MenuComponent,
       loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
   },
 {
   path: '**',
   component: PageNotfound
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
