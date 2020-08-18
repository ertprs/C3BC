import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CanEnterHomeGuard } from '../guards/home/can-enter-home.guard';
import { CanEnterLoginGuard } from '../guards/login/can-enter-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [CanEnterHomeGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [CanEnterLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
