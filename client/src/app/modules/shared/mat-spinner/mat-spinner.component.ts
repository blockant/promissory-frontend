import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-mat-spinner',
  templateUrl: './mat-spinner.component.html',
  styleUrls: ['./mat-spinner.component.css']
})
export class MatSpinnerComponent implements OnInit {
  loading!: boolean;
  constructor(private loaderService: LoaderService) { 
    this.loaderService.isLoading.subscribe((v) => {
      console.log(v);
      this.loading = v;
    });
  }

  ngOnInit(): void {
  }

}
