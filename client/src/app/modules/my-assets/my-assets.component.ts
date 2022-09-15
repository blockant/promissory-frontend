import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from '../listings/payment/payment.component';
import { ListingService } from '../shared/services/listing.service';
import { InvestorsComponent } from './investors/investors.component';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyAssetsComponent implements OnInit {
  assets: any = [];
  p: number = 1;

  constructor(private listingService:ListingService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAssets()
  }

  async getAssets() {
    try {
      const result:any = await this.listingService.getAssets('myAssets')
      this.assets = result.assets
    } catch (e) {
      console.log(e, 'error')
    }
  }

  openDialog(asset:any) {
    const dialogRef = this.dialog.open(InvestorsComponent, {
      data:asset
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.openPayment(result.investor.purchasedTokens,result.asset.rateOfInterest)
        // this.transferTokensToInvestor()
      }
    });
  }

  openPayment(tokens:any,interest:number) {
    const dialogRef = this.dialog.open(PaymentComponent, {
      data: {price:tokens,interest:interest},
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.transferTokensToInvestor()
      }
    });
  }

}
