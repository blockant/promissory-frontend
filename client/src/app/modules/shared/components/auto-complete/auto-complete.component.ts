import { Component, ViewChild, EventEmitter, Output, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
declare var google: any;
@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit, AfterViewInit {
  @Input() adressType!: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  // @ViewChild('', { static: true }) addresstext: any;
  @ViewChild('addresstext', { static: false })
  public addresstext!: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  getPlaceAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        {
          componentRestrictions: { country: 'US' },
          types: [this.adressType]
        });
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.invokeEvent(place);
      });
    })

  }

  getStreetNumber(place: any) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getAddrComponent(place: any, componentTemplate: any) {
    let result;
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  getStreet(place: any) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place: any) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place: any) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  invokeEvent(place: any) {
    var full_address;
    if (this.getStreetNumber(place)) {
      full_address = [this.getStreetNumber(place), this.getStreet(place)].join(' ');
    } else {
      full_address = this.getStreet(place)
    }
    const address = {
      street: full_address,
      city: this.getCity(place),
      state: this.getState(place),
      zipcode: this.getPostCode(place),
      county: this.getDistrict(place),
      lat: place.geometry.location.lat(),
      long: place.geometry.location.lng()
    }
    this.setAddress.emit(address);
  }

  getDistrict(place: any) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getPostCode(place: any) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }
}