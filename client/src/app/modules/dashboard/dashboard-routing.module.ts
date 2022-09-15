import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // children: [
    //     {
    //       path: 'profile',
    //       component: PersonalInfoComponent,
    //     },
        
    //     {
    //       path: '',
    //       redirectTo: 'profile',
    //       pathMatch: 'full',
    //     },
    //   ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
