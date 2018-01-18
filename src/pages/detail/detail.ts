import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
// import {ToastController} from 'ionic-angular';
import {BLE} from '@ionic-native/ble';
import {uart} from './ble_config';
import {FormGroup, FormControl, Validators} from "@angular/forms";
@Component({selector: 'page-detail', templateUrl: 'detail.html'})
export class DetailPage {

  peripheral : any = {};
  // the UI string for displaying the dataIn contents...
  readMessage : string;
  // and status message...
  statusMessage : string;
  // initiate the string to hold the user-readable raw data
  dataIn = '';
  dataOut = '';
  //grab the uart config
  service = uart.service;
  char = uart.char;
  delim = uart.delim;

  // submit form FormGroup w/ validator
  submitForm = new FormGroup({
    submitMessage: new FormControl("", [
      Validators.required, Validators.min(1)
    ])
  })

  // setup page's plugins with constructors...
  constructor(public navCtrl : NavController, public navParams : NavParams, private ble : BLE, private ngZone : NgZone) {

    // get the device info array passed from homepage
    let device = navParams.get('device');
    // set the status UI (pre-connect)
    this.uiSetStatus('Connecting to ' + device.name || device.id);

    // initiate ble connection with the device, the promise initates one of two options.
    this
      .ble
      .connect(device.id)
      .subscribe(peripheral => this.onConnected(peripheral), peripheral => this.onDeviceDisconnected(peripheral))
  }
  // when it's connected, moving on:
  onConnected(peripheral) {
    this.peripheral = peripheral;

    // inform UI of successful connection
    this.uiSetStatus('Connected to ' + peripheral.name || peripheral.id);

    // connect and subscribe to RX!
    this.deviceStartRX();

  }

  // ui function for if disconnection occurs
  onDeviceDisconnected(peripheral) {
    this.uiSetStatus('Suddenly disconnected! Please contact support if this was not intentional.')
  }

  // disconnect when leaving page! console.log for debugging
  ionViewWillLeave() {
    this
      .ble
      .disconnect(this.peripheral.id)
      .then(() => this.uiSetStatus('Disconnected!'), () => this.uiSetStatus('Disconnected!'))
  }

  /*
 *              _____                    _____
 *             /\    \                  /\    \
 *            /::\____\                /::\    \
 *           /:::/    /                \:::\    \
 *          /:::/    /                  \:::\    \
 *         /:::/    /                    \:::\    \
 *        /:::/    /                      \:::\    \
 *       /:::/    /                       /::::\    \
 *      /:::/    /      _____    ____    /::::::\    \
 *     /:::/____/      /\    \  /\   \  /:::/\:::\    \
 *    |:::|    /      /::\____\/::\   \/:::/  \:::\____\
 *    |:::|____\     /:::/    /\:::\  /:::/    \::/    /
 *     \:::\    \   /:::/    /  \:::\/:::/    / \/____/
 *      \:::\    \ /:::/    /    \::::::/    /
 *       \:::\    /:::/    /      \::::/____/
 *        \:::\__/:::/    /        \:::\    \
 *         \::::::::/    /          \:::\    \
 *          \::::::/    /            \:::\    \
 *           \::::/    /              \:::\____\
 *            \::/____/                \::/    /
 *                                      \/____/
 *
 *
 *  Here's the UI methods and functions!
 *      -       -      -      -
 *  This function is called when the user
 *  hits the "submit" button when expecting
 *  to send raw data to the BLE device.
 */
  uiDataSubmit() {
    this.stringToSend(this.submitForm.get('submitMessage').value);
    this
      .submitForm
      .reset();
    return;
  }
  /*
This method updates the status view
with a string when it's called.
*/
  uiSetStatus(message) {
    console.log(message);
    this
      .ngZone
      .run(() => {
        this.statusMessage = message;
      });
  }
  /*
Allows user to clear the 'data in' box.
And it also clears the dataIn cache.
*/
  uiClearDataIn(click) {
    this.dataIn = '';
    this
      .ngZone
      .run(() => {
        this.readMessage = '';
      })
  }

  /*
 *         _____          ___                       ___
 *        /  /::\        /  /\          ___        /  /\
 *       /  /:/\:\      /  /::\        /  /\      /  /::\
 *      /  /:/  \:\    /  /:/\:\      /  /:/     /  /:/\:\
 *     /__/:/ \__\:|  /  /:/~/::\    /  /:/     /  /:/~/::\
 *     \  \:\ /  /:/ /__/:/ /:/\:\  /  /::\    /__/:/ /:/\:\
 *      \  \:\  /:/  \  \:\/:/__\/ /__/:/\:\   \  \:\/:/__\/
 *       \  \:\/:/    \  \::/      \__\/  \:\   \  \::/
 *        \  \::/      \  \:\           \  \:\   \  \:\
 *         \__\/        \  \:\           \__\/    \  \:\
 *                       \__\/                     \__\/
 *
 *  Here are the data functions!
 *    -      -      -     -
 *
 *   Connect and subscribe to BLE,
 *   and buffer in data through
 *   dataIn and readMessage for the UI.
 *   Had trouble seperating the UI methods
 *   for this one... Why? I don't know.
 */

  deviceStartRX() {
    // subscribe to rx/tx UART to see if any changes are happening... and it updates
    // the ui/dataIn via rawToString
    this
      .ble
      .startNotification(this.peripheral.id, this.service, this.char)
      .subscribe(buffer => {
        var s = this.arrayBufferToString(buffer);
        if (s.match(this.delim)) {
          this.dataIn = s;
          /*
This method updates the UI view
for data when it's recieved.
*/
          this
            .ngZone
            .run(() => {
              this.readMessage = this.dataIn;
            })
        } else {
          this.dataIn += s;
          this
            .ngZone
            .run(() => {
              this.readMessage = this.dataIn;
            })
        }
      })

    // read the rx/tx UART and send to DataIn stream.
    this
      .ble
      .read(this.peripheral.id, this.service, this.char)
      .then(buffer => {
        var s = this.arrayBufferToString(buffer);
        if (s.match(this.delim)) {
          this.dataIn = s;
          /*
This method updates the UI view
for data when it's recieved.
*/
          this
            .ngZone
            .run(() => {
              this.readMessage = this.dataIn;
            })
        } else {
          this.dataIn += s;
          this
            .ngZone
            .run(() => {
              this.readMessage = this.dataIn;
            })
        }
      })
  }

  /*
  * Take a simple Array and send it to our
  * BLE device. (TODO)
  */

  /*
   * Taking a string and sending it to our BLE device,
   * one bit at a time. Note a sleepFor(ms); allowing
   * our low energy hardware to keep up. This method
   * takes the string, breaks down each character,
   * converts it to an unsigned integer and transmits
   * it to the BLE device's RX pin.
   */
  stringToSend(string) {
    let tempArray = new Uint8Array(1);
    for (let a = 0, b = string.length; a < b; a++) {
      tempArray[0] = string.charCodeAt(a);
      this
        .ble
        .writeWithoutResponse(this.peripheral.id, this.service, this.char, tempArray.buffer);
      this.sleepFor(3);
    }
    return;
  }
  /*
   * A simple method that converts an ArrayBuffer
   * to a string, courtesy of Don Coleman (@don on github)
   * If he wouldn't have emailed me this little simple
   * bit, I would have stayed up for countless more
   * hours. Silly, I know - but this stumped me!
   */
  arrayBufferToString(ab) {
    var b = new Uint8Array(ab);
    return this.bytesToString(b);
  };
  /*
   * Converting a string to an ArrayBuffer, natively
   * included with cordova-plugin-ble-central.
   * Courtesy of Don Coleman (@don on github)
   */
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }
  /*
   * Converting a (more simple) ArrayBuffer to a string.
   * Natively included with cordova- plugin-ble-central.
   * Courtesy of Don Coleman (@don on github)
   */
  bytesToString(buffer) {
    return String
      .fromCharCode
      .apply(null, new Uint8Array(buffer));
  }
  /*
   * We're kicking it back old-school with this sleepFor(); function!
   * Since our BLE device can be easily overwhelmed, this brilliant
   * little method halts the software and waits for the hardware to
   * catch up. You can see it used in sendRawData();
   */
  sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {}
  }
}