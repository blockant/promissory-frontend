import { Injectable } from '@angular/core';
import Web3 from "web3";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    web3: any
    ethereum: MetaMaskInpageProvider;
  }
}
@Injectable({
  providedIn: 'root'
})
export class MetamaskService {

  constructor() { }
  async connectAccount() {
    console.log('Web3 Object is', window.web3)
    if (window?.ethereum) {
      window.web3 = new Web3(<any>window.ethereum);
      await window.ethereum.enable();
    }
    if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        return window.alert("Please install MetaMask!");
    }
    const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[]
    console.log('Accounts are ', accounts)
    const metaMask: any={
      isConnected: true,
      connected_account:accounts[0]
    }
    localStorage.setItem('metaMask', JSON.stringify(metaMask))
  }
  getAccountDetails(): any{
    const metaMaskString = localStorage.getItem('metaMask')
    if (metaMaskString){
      return JSON.parse(metaMaskString);
    }
    return {
      isConnected: false
    };
  }
}
