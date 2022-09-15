import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { SharedModule } from '../modules/shared/shared.module';


@NgModule({
  declarations: [
    LayoutComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
