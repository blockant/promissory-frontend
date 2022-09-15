import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../shared/services/listing.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  propertyDetails: [string, string][];


  constructor(private lisitingService:ListingService) { 
   this.propertyDetails = Object.entries(this.lisitingService.properties_details)
  }

  ngOnInit(): void {
  }

}
