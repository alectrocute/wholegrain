import { BLE } from '@ionic-native/ble';
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Refresher } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { DetailPage } from '../detail/detail';

// import uart config
import { uart } from '../detail/ble_config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  devices: any[] = [];
  statusMessage: string;
  service = uart.service;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private ble: BLE,
    private ngZone: NgZone) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  // scan
  scan() {
    this.setStatus('Searching the air for devices...');
    this.devices = [];  // clear list
    this.ble.scan([this.service], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error))
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
    this.setStatus('Discovered ' + device.name);
  }

  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Drag down this window to refresh!',
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  presentLoading() {
    this.loadingCtrl.create({
      content: 'Wiring you up!',
      spinner: 'crescent',
      duration: 3000,
      dismissOnPageChange: true
    }).present();
  }

  doRefresh(refresher: Refresher) {
    this.scan();
    refresher.complete();
  }

  deviceSelected(device) {
    this.navCtrl.push(DetailPage, {
      device: device
    });
    this.presentLoading();
  }

}