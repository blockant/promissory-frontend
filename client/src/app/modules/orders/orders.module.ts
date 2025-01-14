import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrderRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
