import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  myWindow: any

  constructor() { }

  ngOnInit(): void {
  }


  open(event:Event) {
    this.myWindow = window.open('', '_blank', 'left=0,top=0,width=900,height=900');
    this.focusParent(event)
  }

  focusParent(event:Event) {
    event.preventDefault();
    console.log(event,'event')
    var goBack = window.open('', window.opener.name);
    goBack?.focus();
  }


  onBlur() {
    this.myWindow?.blur()
  }

  onFocus() {
    this.myWindow?.focus()
  }

  close() {
    this.myWindow?.close()
  }

  resize() {
    this.myWindow?.resizeTo(1, 1)
    this.onFocus()
  }

  minimize() {
    console.log('hit')
    this.myWindow?.moveTo(-100000, -100000);
    this.onBlur()
    //  BrowserWindow.getFocusedWindow()?.minimize()
  }

}
