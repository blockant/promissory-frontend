import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListingService } from '../../shared/services/listing.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  ethPrice = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public asset:any,
  private listingService:ListingService) { }

  ngOnInit() {
    this.getPayInEthPrice()
  }

  calc(total:number,interest:number){
    if(interest <=0) return Number(total)
    const a = total/interest
    const b = Number(total)+Number(a) 
    return b
  }

  getPayInEthPrice(){
    try{
        this.listingService.getPayInEthPrice({dollarValue:this.calc(this.asset.price,this.asset.interest)}).then((data:any)=>{
        this.ethPrice = data.PayInEther
      })
    }catch(e){
      console.log(e,'error')
    }
  }

}
