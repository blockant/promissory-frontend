import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { MetamaskService } from 'src/app/modules/web3/services/metamask.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  public isCollapsed = true;
  constructor(public auth:AuthService, public metaMask: MetamaskService) { }

  ngOnInit(): void {
  }

}
