import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { ListingService } from '../../shared/services/listing.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from '../payment/payment.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  @Input() assets!: { street: string; city: string; state: string; zipcode: string; totalPrice: number; tokenPrice: number; rateOfInterest: number; compoundedInterest: number; interestEarnings: number; assetStatus: string; _id: string, ownerTranferStatus: string, assetOwner: string, numberOfTokensAvailable: number, soldout: boolean, createdAt: string }[]
  @Input() viewType!:string
  @Output() onAsset = new EventEmitter<any>()
  tokenDetails: any = {}
  generateForm!: FormGroup
  transferForm!: FormGroup
  purchaseForm!: FormGroup
  currentAsset: any = {}
  responsiveOptions:any = [];

  constructor(public listingService: ListingService,
    public auth: AuthService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService) { 
      this.responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 4,
            numScroll: 4
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    }

  ngOnInit(): void {
  }

  async generateToken() {
    try {
      console.log(this.generateForm.getRawValue(), 'raw value')
      const result: any = await this.listingService.generateToken(this.generateForm.getRawValue())
      console.log(result, 'result')
      this.updateAsset(this.currentAsset._id, {
        assetStatus: 'tokenized',
        tokenPrice: 1,
        contractAddress: result.contract_address,
        tokenName: this.generateForm.value.tokenName,
        tokenSymbol: this.generateForm.value.tokenSymbol,
        tokenSupply: this.generateForm.getRawValue().tokenSupply
      })
      this.toastr.success('Token Generated Successfully')
      this.onAsset.emit()
    } catch (e) {
      console.log(e, 'error')
    }
  }

  async transferToker() {
    //tranfer token 
    try {
      await this.listingService.tranferTokens(this.transferForm.getRawValue())
      this.toastr.success('Tranfer Successfully')
      this.updateAsset(this.currentAsset._id, {
        ownerWalletAddress: this.transferForm.value.ownerWalletAddress,
        ownerTranferStatus: true
      })
    } catch (e) {
      console.log(e, 'error')
    }

  }

  open(content: any, asset: any, type: string) {
    this.currentAsset = asset
    switch (type) {
      case 'generate':
        this.initGenerateForm(asset)
        this.modalService.open(content).result.then((result) => {
          if (result == 'Save') {
            this.generateToken()
          }
        });
        break;
      case 'transfer':
        this.initTransferForm(asset)
        this.modalService.open(content).result.then((result) => {
          if (result == 'Save') {
            this.transferToker()
          }
        });
        break;
      case 'buy':
        this.getBalanceOf(asset, content)
        break;
    }
  }

  async getBalanceOf(asset: any, content: any) {
    try {
      const data = { ownerWalletAddress: asset.ownerWalletAddress, contractAddress: asset.contractAddress }
      const result: any = await this.listingService.getBalanceOf(data)
      this.initPurchaseForm(asset, result.BalanceOf)
      this.modalService.open(content).result.then((result) => {
        console.log(result, 'result')
        if (result == 'Save') {
          this.openDialog()
        }
      });
    } catch (e) {
      console.log(e, 'error')
    }
  }

  async transferTokensToInvestor() {
    const value = this.purchaseForm.getRawValue()
    try {
      const result: any = await this.listingService.transferTokensToInvestor(value)
      if (result.isTransferred) {
        // this.toastr.success('Transfered Tokens Successfully')
        Swal.fire(
          {
            icon: 'success',
            title: 'Transfered Tokens Successfully',
            text: `Transfered ${value.numberOfTokensToBuy} Tokens`,
            footer: `Available Tokens: <b>${(value.numberOfTokensAvailable - value.numberOfTokensToBuy)}</b>`
          }
        )
        this.updateAsset(this.currentAsset._id, {
          numberOfTokensAvailable: (value.numberOfTokensAvailable - value.numberOfTokensToBuy),
          soldout: (value.numberOfTokensAvailable - value.numberOfTokensToBuy) == 0 ? true : false,
          investorReceiverWalletAddress: [...this.currentAsset.investorReceiverWalletAddress,
          {
            investorWalletAddress: value.investorReceiverWalletAddress,
            purchasedTokens: value.numberOfTokensToBuy,
            userId: this.auth.currentUserValue.user._id,
            investedDate: new Date()
          }
          ]
        })
      }
    } catch (e) {
      console.log(e, 'error')
    }
  }

  async updateAsset(id: string, data: object) {
    console.log('hit update')
    try {
      await this.listingService.updateAsset(id, data)
      this.toastr.success('Asset Updated Successfully')
      this.onAsset.emit()
    } catch (e) {
      console.log(e, 'error')
    }
  }

  async deleteAsset(id: string) {
    try {
      const result: any = await this.listingService.deleteAsset(id)
      this.toastr.success(result.message)
      this.onAsset.emit()
    } catch (e) {
      console.log(e, 'error')
    }
  }

  initGenerateForm(asset: any) {
    this.generateForm = this.fb.group({
      tokenName: ['', Validators.required],
      tokenSupply: [{ value: asset.totalPrice, disabled: true }],
      tokenSymbol: ['', Validators.required]
    })
  }

  initTransferForm(asset: any) {
    this.transferForm = this.fb.group({
      contractAddress: [asset.contractAddress, Validators.required],
      ownerWalletAddress: ['', Validators.compose([
        Validators.required,
        Validators.minLength(42),
        Validators.maxLength(42)
      ])],
      tokenSupply: [{ value: asset.tokenSupply, disabled: true }]
    })
  }

  initPurchaseForm(asset: any, balanceOf: number) {
    this.purchaseForm = this.fb.group({
      tokenName: [{ value: asset.tokenName, disabled: true }],
      tokenSupply: [{ value: asset.tokenSupply, disabled: true }],
      tokenSymbol: [{ value: asset.tokenSymbol, disabled: true }],
      tokenPrice: [{ value: asset.tokenPrice, disabled: true }],
      numberOfTokensToBuy: [null, Validators.compose([
        Validators.required,
        Validators.max(balanceOf)
      ])],
      contractAddress: [{ value: asset.contractAddress, disabled: true }],
      investorReceiverWalletAddress: ['', Validators.compose([
        Validators.required,
        Validators.minLength(42),
        Validators.maxLength(42)
      ])],
      numberOfTokensAvailable: [{ value: balanceOf, disabled: true }],
      ownerWalletAddress: [asset.ownerWalletAddress]
    })
  }


  get f() { return this.purchaseForm.controls; }
  get t() { return this.transferForm.controls; }

  openDialog() {
    const dialogRef = this.dialog.open(PaymentComponent, {
      data: { price: Number(this.purchaseForm.value.numberOfTokensToBuy), interest: 0 },
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transferTokensToInvestor()
      }
    });
  }

}
