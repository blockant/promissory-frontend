import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/services/auth.service';
import { ListingService } from '../shared/services/listing.service';
import { CreateListingComponent } from './create-listing/create-listing.component';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  active!: string
  assets: any = [];
  users: any = []
  viewType = 'card'
  constructor(private listingService: ListingService,
    public dialog: MatDialog,
    public auth: AuthService,
    private cd:ChangeDetectorRef,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.active = this.listingService.getActiveBaseOnRole()
    this.getAssets(this.active)
    this.getOwnerUsers()
  }

  async getAssets(status: string) {
    try {
      const result: any = await this.listingService.getAssets(status)
      this.assets = result.assets
    } catch (e) {
      console.log(e, 'error')
    }
  }

  async getOwnerUsers() {
    try {
      const result: any = await this.auth.getUserByRole('Owner')
      this.users = result.users
    } catch (e) {
      console.log(e, 'e')
    }
  }

  onNavChange(event: any) {
    this.getAssets(event.nextId)
  }


  openDialog() {
    const dialogRef = this.dialog.open(CreateListingComponent, {
      data: this.users
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createListing(result)
      }
    });
  }

  async createListing(listing: object) {
    try {
      const result: any = await this.listingService.createAsset(listing)
      this.toastr.success(result.message)
      this.getAssets(this.active)
    } catch (e) {
      console.log(e, 'error')
    }
  }

  changeView() {
    this.viewType == 'card' ? this.viewType = 'list' : this.viewType = 'card'
  }

}
