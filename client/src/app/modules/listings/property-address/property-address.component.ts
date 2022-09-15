import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-address',
  templateUrl: './property-address.component.html',
  styleUrls: ['./property-address.component.css']
})
export class PropertyAddressComponent implements OnInit {
   @Input() asset:any = {}
  constructor() { }

  ngOnInit(): void {
  }

}
