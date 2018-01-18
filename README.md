# wholegrain 🌾

*wholegrain* is a mobile cross-platform low-energy Bluetooth 4.0 UART serial app with a wide variety of use. It is built on the [Ionic Framework (native)](https://ionicframework.com/docs/) with [Cordova](https://cordova.apache.org/), utilizing [Angular](https://angular.io/) and [@don](https://github.com/don)'s [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central).

#### Current development status [1.0.0]
As of January, 2018 - we're currently in very early development. You are free to play around with the source of wholegrain under the [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html) license but **please note** a large majority of this source code is likely to be overwritten or heavily modified on a day-to-day basis. At the current moment, we do not reccomend using this in any product headed to production.

##### Current 'Fresh Install' Features

  - Scan and connect to an HM10 module
  - Subscribe, read and parse unlimited bytes to the BLE UART serial output
  - Custom delimiter to stop BLE UART output stream
  - Write to the BLE UART serial input, unlimited bytes


##### Smartphone Compatability

Since we're in very early development, many devices and OS versions are untested. The current development test phone is an iPhone 6 Plus running iOS 11.2.2.

| Device | Notes |
| ------ | ------ |
| iOS 11.2.2 | Tested and working |
| Android (all) | Currently untested |
| Windows Phone | Currently untested |

We're likely to grab some Android and Windows dev test phones in the near future, but any help testing via these untested platforms would be greatly appreciated.

##### BLE Device Compatability

The configuration is currently setup for an HM10 module. We highly reccomend this cheap, accessable brilliant BLE UART module, produced by Chinese developer  [JNHuaMao](http://www.jnhuamao.cn/bluetooth.asp). **BEWARE** of [knock-off HM10's](http://fab.cba.mit.edu/classes/863.15/doc/tutorials/programming/bluetooth/bluetooth40_en.pdf) being sold and marketed as authentic, which are also widely used/traded under that impression. Here's an [Amazon link (no affiliate code)](https://www.amazon.com/DSD-TECH-Bluetooth-iBeacon-Arduino/dp/B06WGZB2N4/ref=sr_1_1?s=electronics&ie=UTF8&qid=1516232542&sr=1-1&keywords=hm10) to the authentic module.

| BLE Device | Firmware Version | Status | Characteristics (main/rxtx) | Notes |
| ------ | ------ | ------ | ------ | ------ |
| HM10¹ | [HM10, 2541, V603](http://www.jnhuamao.cn/rom/HMSoft-10-2541-V603.zip) (latest) | Tested, working and proven | `ffe0` `ffe1` | 🌾
| HM11¹ | [HM11, 2541, V603](http://www.jnhuamao.cn/rom/HMSoft-11-2541-V603.zip) (latest) | Tested, working but not proven | `ffe0` `ffe1` | Since it's the same as the HM10 but has a smaller form factor, there shouldn't be any complications with an HM11¹.
| BluefruitLE² | [0.7.0](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware/tree/master/0.7.7) (latest) | Untested, unknown and not proven | `?` `?` | Use at own risk.

¹ Authentic module produced by JNHuaMao

² Authentic module produced by Adafruit

More devices to be added, tested and proved soon.

#### Getting Started

wholegrain requires and suggests developer familiarity with [Node.js (with npm)](https://nodejs.org/), [Ionic](https://ionicframework.com/docs/) with [Cordova](https://cordova.apache.org/), [Angular](https://angular.io/) and [@don](https://github.com/don)'s [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central). Please note this source is licensed under [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html) – please be familiar with this license and what it enforces. Simply put, anything that uses wholegrain🌾 , commercial or otherwise, must also be open-source. You may not use any of this code and then close the source -- that wouldn't be cool.

Getting the dependencies:

```sh
$ cd wholegrain
$ npm install --save
```

In `/src/pages/detail/ble_config.ts`:

```
export class uart {
    public static get service(): string { return "your_service"; }
    public static get char(): string { return "your_rxtx_characteristic"; }
    public static get delim(): string { return "your_delimiter"; }
}
```

`your_service` is the main service string, eg. `ffe0` (the default).

`your_rxtx_characteristic` is your read/write uart characteristic string, eg. `ffe1` (the default).

`your_delimiter` is the default delimiter string (the string which `deviceStartRX();` watches out for, in case you want to recieving to end early, eg. `//END//` (the default).


**Note:** Since wholegrain uses @ionic/native, you will be required to run/test/debug it on a real device.

Build for platform of your choice:

```sh
$ cd [root wholegrain folder]
$ ionic cordova build ios
$ ionic cordova build android
```


#### Development Help

Want to help 🌾 ? Your dev [@al-ec](http://github.com/al-ec) appreciates it! Go right ahead, contribute! We are open to any changes, improvements, etc. Critique is also highly encouraged.
- During this early development stage, while it may increase file size, we are doing our best to make sure almost every line of code is commented and explained. We encourage but do not require any other contributors to do the same!
- We are licensed under [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html), to ensure your code is never to be closed. We believe in free, open-source software to encourage better development and accessable programming education through modification.

### [@al-ec](http://github.com/al-ec)'s to-dos

 - FormBuilder for sending data, specifically for e-bike controllers which require a 64-bit Array with clamped Uint8's in a specific order for setting configuration. This includes an XOR checksum. Here's the [guide to building this specific array](https://docs.google.com/document/d/1_j1sQXE_mUbxM1kt8uC3dCofh9ERctOILo7Q009rxnY).
 - Build out the UI, since it's currently in 'debug mode' -- essentially just a terminal-like interface for testing the rx/tx capabilities.
 - Configure AT settings via UI, allowing user to configure their BLE module from the app itself instead of using some RS232 USB converter directly to the module.

Who made this possible
----

- [West Coast Electrics](https://westcoastelectrics.com/) for help during early development and insisting that this source code be made open. Without WCE and Barent, this github page you're reading wouldn't exist right now. West Coast Electrics is proud to support the DIY, open-source e-bike community and encourage new technology.
- [@don](https://github.com/don) who developed the amazing plugin cordova-plugin-ble-central. He's an amazing developer and without his open-source contributions to BLE technology, we'd be years behind. Anybody who has worked with Bluetooth 4.0 knows this dude's a legend. Oh, and he contributed code to this project when we were hitting a brick wall.
- [Alan Hord](http://www.hordsoffun.com/) for help with those pesky checksums and assistance when writing a method just gets a little too complicated; requiring old-school brilliance and in-depth C+ knowledge.

##### More special thanks
- [Andrew Zabolotny](https://sourceforge.net/p/xpd-ebike/wiki/Home/) for his work figuring out the array order and conversions for serial communication / config flashing Infineon 4 MCU clones. These clones are widely used in Chinese e-bike controllers and are notorious for being cryptic. His open-source work over the past 5 years is highly appreciated.


![logo](https://i.imgur.com/MUPegO6.jpg)
Open source development supported by [West Coast Electrics](https://westcoastelectrics.com/)

Licensed under [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html)
