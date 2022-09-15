import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAssetsComponent } from './my-assets.component';
import { MyAssetsRoutingModule } from './my-assets-routing.module';
import { SharedModule } from '../shared/shared.module';
import { InvestorsComponent } from './investors/investors.component';



@NgModule({
  declarations: [
    MyAssetsComponent,
    InvestorsComponent
  ],
  imports: [
    CommonModule,
    MyAssetsRoutingModule,
    SharedModule
  ]
})
export class MyAssetsModule { }
