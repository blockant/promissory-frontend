import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from 'src/app/pages/material-module';
/* new form imports */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSpinnerComponent } from './mat-spinner/mat-spinner.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxMaskModule } from 'ngx-mask';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { DateAgoPipe } from 'src/app/_helpers/date-pipe-ago';
import { PaymentComponent } from '../listings/payment/payment.component';
import {NgxPaginationModule} from 'ngx-pagination';

import {CarouselModule} from 'primeng/carousel';



@NgModule({
  declarations: [
    MatSpinnerComponent,
    LoaderComponent,
    AutoCompleteComponent,
    DateAgoPipe,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAP_API_KEY,
      libraries: ['places', 'drawing']
    }),
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    CarouselModule
  ],
  exports:[
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatSpinnerComponent,
    HttpClientModule,
    NgbModule,
    AgmCoreModule,
    LoaderComponent,
    NgxMaskModule,
    AutoCompleteComponent,
    DateAgoPipe,
    PaymentComponent,
    NgxPaginationModule,
    CarouselModule
  ]
})
export class SharedModule { }
