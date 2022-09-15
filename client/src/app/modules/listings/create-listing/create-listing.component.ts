import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListingService } from '../../shared/services/listing.service';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})

export class CreateListingComponent implements OnInit {
  listingForm!: FormGroup
  standards: string[];
  constructor(private fb: FormBuilder,
    private listingService:ListingService,
    @Inject(MAT_DIALOG_DATA) public users: any) { 
      this.standards = this.listingService.standards
    }

  ngOnInit() {
    this.initListingForm()
  }

  initListingForm() {
    this.listingForm = this.fb.group({
      street: ['', Validators.required],
      city: [''],
      state: [''],
      zipcode: [''],
      county: [''],
      lat: [null],
      long: [null],
      totalPrice: [null, Validators.required],
      tokenPrice: [null],
      rateOfInterest: [null, Validators.required],
      compoundedInterest: [null],
      interestEarnings: [{ value: null, disabled: true }, Validators.required],
      ownerAccountAddress: [''],
      assetOwner: ['', Validators.required],
      standard:['', Validators.required]
    })
  }

  getAddress(address: any) {
    this.listingForm.patchValue({
      street: address.street,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      county: address.county,
      lat: address.lat,
      long: address.long
    })
  }

  onInputChange() {
    const a = this.listingForm.value.totalPrice
    const b = this.listingForm.value.rateOfInterest
    if (a && b) {
      this.listingForm.patchValue({
        interestEarnings: (a * b) / 100
      })
    }
  }

}
