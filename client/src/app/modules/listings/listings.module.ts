import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingsComponent } from './listings.component';
import { ListingsRoutingModule } from './listings-routing.module';
import { ViewListingComponent } from './view-listing/view-listing.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { PropertyAddressComponent } from './property-address/property-address.component';
import { AssetsComponent } from './assets/assets.component';
import { CreateListingComponent } from './create-listing/create-listing.component';



@NgModule({
  declarations: [
    ListingsComponent,
    ViewListingComponent,
    PropertyDetailsComponent,
    PropertyAddressComponent,
    AssetsComponent,
    CreateListingComponent,
  ],
  imports: [
    CommonModule,
    ListingsRoutingModule,
    SharedModule
  ]
})
export class ListingsModule { }
