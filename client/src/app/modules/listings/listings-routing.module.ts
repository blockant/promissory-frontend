import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent } from './listings.component';
import { ViewListingComponent } from './view-listing/view-listing.component';

const routes: Routes = [
  {
    path: '',
    component: ListingsComponent,
  },
  {
    path: 'view/:id',
    component: ViewListingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListingsRoutingModule { }
