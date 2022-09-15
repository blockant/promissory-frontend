import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { ListingService } from '../shared/services/listing.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PortfolioComponent implements OnInit {
  assets: any = [];

  constructor(private listingService: ListingService, public auth: AuthService) { }

  ngOnInit(): void {
    this.getPortfolios()
  }

  async getPortfolios() {
    try {
      const result: any = await this.listingService.getPortfolios()
      this.assets = result.assets
    } catch (e) {
      console.log(e, 'error')
    }
  }

  openUrl(investorAddress: string) {
    const base_URL = `https://${environment.testNetwork}.etherscan.io/address/` + investorAddress + '#tokentxns'
    window.open(base_URL, '_blank')
  }

}
