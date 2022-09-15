import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
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
export class OrderRoutingModule { }
