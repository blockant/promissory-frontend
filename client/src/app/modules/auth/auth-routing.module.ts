import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full'
        },
        {
          path: 'login',
          component: LoginComponent,
          data: { returnUrl: window.location.pathname }
        },
        {
          path: 'register',
          component: RegisterComponent,
        },
        { path: '**', redirectTo: '', pathMatch: 'full' }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
