import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CanEnterHomeGuard } from './guards/home/can-enter-home.guard';
import { CanEnterLoginGuard } from './guards/login/can-enter-login.guard';
import { CreateAnswerComponent } from './pages/create-answer/create-answer.component';
import { CreateCategoryComponent } from './pages/create-category/create-category.component';
import { EditAnswerComponent } from './pages/edit-answer/edit-answer.component';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'create-answer',
        component: CreateAnswerComponent
      },
      {
        path: 'edit-answer',
        component: EditAnswerComponent
      },
      {
        path: 'create-category',
        component: CreateCategoryComponent
      },
      {
        path: 'edit-category',
        component: EditCategoryComponent
      },
    ],
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
