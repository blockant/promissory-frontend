import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.css']
})
export class InvestorsComponent implements OnInit {
  c: number = 1;
  constructor( @Inject(MAT_DIALOG_DATA) public asset: any) { }

  ngOnInit(): void {
  }

}
