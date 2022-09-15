import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(private http: HttpClient) { }

  listings = [
    {
      address: "13245 Monica St, Detroit, MI 48238",
      totalPrice: "$100,000",
      tokenPrice: "$51.34",
      rateOfInterest: "15%",
      compoundedInterest: "$2500/Year",
      interestEarnings: "$208/Month",
      banner: "assets/images/banner1.jpg",
      screens: ['assets/images/banner1-1.jpg',
        'assets/images/banner1-2.jpg',
        'assets/images/banner1-3.jpg',
        'assets/images/banner1-4.jpg',
        'assets/images/banner1-5.jpg',
        'assets/images/banner1-6.jpg',
      ]
    },
    {
      address: "1907 Ottawa Dr, Toledo, OH 43606",
      totalPrice: "$363,090",
      tokenPrice: "$51.34",
      rateOfInterest: "15%",
      compoundedInterest: "$2500/Year",
      interestEarnings: "$208/Month",
      banner: "assets/images/banner2.jpg",
      screens: ['assets/images/banner1-1.jpg',
        'assets/images/banner1-2.jpg',
        'assets/images/banner1-3.jpg',
        'assets/images/banner1-4.jpg',
        'assets/images/banner1-5.jpg',
        'assets/images/banner1-6.jpg',
      ]
    },
    {
      address: "19144 Riopelle, Highland, MI 48203",
      totalPrice: "$77,445",
      tokenPrice: "$51.63",
      rateOfInterest: "15%",
      compoundedInterest: "$2500/Year",
      interestEarnings: "$208/Month",
      banner: "assets/images/banner3.jpg",
      screens: ['assets/images/banner1-1.jpg',
        'assets/images/banner1-2.jpg',
        'assets/images/banner1-3.jpg',
        'assets/images/banner1-4.jpg',
        'assets/images/banner1-5.jpg',
        'assets/images/banner1-6.jpg',
      ]
    },
    {
      address: "18668 St Louis St, Detroit, MI 48234",
      totalPrice: "$51,560",
      tokenPrice: "$51.56",
      rateOfInterest: "15%",
      compoundedInterest: "$2500/Year",
      interestEarnings: "$208/Month",
      banner: "assets/images/banner4.jpg",
      screens: ['assets/images/banner1-1.jpg',
        'assets/images/banner1-2.jpg',
        'assets/images/banner1-3.jpg',
        'assets/images/banner1-4.jpg',
        'assets/images/banner1-5.jpg',
        'assets/images/banner1-6.jpg',
      ]
    }
  ]

  properties_details = {
    "Property_type": "Multi Family",
    "construction_year": "1941",
    "neighborhood": "Ottawa",
    "bedroom": "4x2, 5x1 Bed",
    "bath": "9 Bath",
    "total_units": "9 Units",
    "rental_type": "Long-term",
    "rented": "Fully Rented"
  }

  standards = ['ERC20', 'ERC721']

  getC(status: string, soldOut: boolean) {
    if (soldOut) return '#dc3545'
    switch (status) {
      case 'pending':
        return '#6c757d'
      case 'approved':
        return '#28a745'
      case 'tokenized':
        return '#007bff'
      default:
        return '#6c757d'
    }
  }

  createAsset(data: object) {
    return this.http.post(environment.API_URL + 'asset', data, { headers: this.jwt() }).toPromise()
  }

  generateToken(data: object) {
    return this.http.post(environment.API_URL + 'generateTokens', data, { headers: this.jwt() }).toPromise()
  }

  tranferTokens(data: object) {
    return this.http.post(environment.API_URL + 'transferTokens', data, { headers: this.jwt() }).toPromise()
  }

  getAssets(status: string) {
    return this.http.get(environment.API_URL + `asset?assetStatus=${status}`, { headers: this.jwt() }).toPromise()
  }

  getAssetById(id: string) {
    return this.http.get(environment.API_URL + `asset/${id}`, { headers: this.jwt() }).toPromise()
  }

  updateAsset(id: string, data: object) {
    return this.http.patch(environment.API_URL + `asset/${id}`, data, { headers: this.jwt() }).toPromise()
  }

  deleteAsset(id: string) {
    return this.http.delete(environment.API_URL + `asset/${id}`, { headers: this.jwt() }).toPromise()
  }

  getBalanceOf(data: object) {
    return this.http.post(environment.API_URL + `getBalanceOf`, data, { headers: this.jwt() }).toPromise()
  }

  transferTokensToInvestor(data: object) {
    return this.http.post(environment.API_URL + `transferTokensToInvestor`, data, { headers: this.jwt() }).toPromise()
  }

  getPortfolios() {
    return this.http.get(environment.API_URL + `investorAssets`, { headers: this.jwt() }).toPromise()
  }

  getPayInEthPrice(data: object) {
    return this.http.post(environment.API_URL + `getAndPayInEtherPrice`, data, { headers: this.jwt() }).toPromise()
  }

  getActiveBaseOnRole() {
    switch (this.getCurrentUser().user.role) {
      case 'Promissory':
        return 'pending'
      case 'Owner':
        return 'myAssets'
      case 'SA':
        return 'pending'
      case 'Investor':
        return 'tokenized'
      default:
        return ''
    }
  }

  jwt(): any {
    if (this.getCurrentUser() && this.getCurrentUser().token) {
      return new HttpHeaders({ 'Authorization': 'Bearer ' + this.getCurrentUser().token })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    }
  }

  getCurrentUser() {
    let currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      return JSON.parse(currentUser)
    } else {
      return false
    }
  }

}
