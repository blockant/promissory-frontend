import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ListingService } from '../../shared/services/listing.service';

@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewListingComponent implements OnInit {
  disabled = false;
  assetId!: any
  images = [1, 2, 3, 4, 5, 6].map((n) => `assets/images/banner1-${n}.jpg`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;
  asset: any = {};

  constructor(private route: ActivatedRoute,private listingService:ListingService) { }
  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id')
    this.getAssetById(this.assetId)
  }

  async getAssetById(assetId:string){
     try{
     const result:any = await this.listingService.getAssetById(assetId)
     this.asset = result.asset
     console.log(this.asset,'asset')
     }catch(e){

     }
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  openUrl(contractAddress: string) {
    const base_URL = `https://${environment.testNetwork}.etherscan.io/address/` + contractAddress
    window.open(base_URL, '_blank')
  }

}
