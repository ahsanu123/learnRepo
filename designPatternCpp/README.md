# Design Pattern In C++

## 🩺 Adapter 
Adapter is a structural design pattern, which allows incompatible objects to collaborate.
The Adapter acts as a wrapper between two objects. It catches calls for one object and transforms them to format and interface recognizable by the second object. [[Ref](https://refactoring.guru/design-patterns/adapter/cpp/example#example-1)]

```mermaid
---
title: Adapter (Use Serial to Usb in Mcu as Anaolgy)
---
classDiagram
AvrProject --> TransferData
TransferData <|.. Serial2UsbAdapter
Serial2UsbAdapter --> USB

class TransferData {
    <<interface>>
    +Transfer(string Data) bool
}

class USB{
    +TransferToUSB(string Data) bool
}

note for Serial2UsbAdapter "impemented Transfer() will call usb->TransferToUsb(data)"
class Serial2UsbAdapter{
    -usb USB
    +Transfer(string Data) bool 
}

note for AvrProject "TransferSerialData() will call this->trasferData->Transfer(string Data)\n so based on pointer assigned to transferData \n AvrProject can transfer either to serial or to usb"
class AvrProject{
    -tranferData : TransferData
    +SetTransferDataPtr(TransferData transferData) void
    +TrasferSerialData(string serialData) bool 
}


```

## 🏛️ Builder

## 🌉 Bridge

Bridge is a structural design pattern that lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently of each other. [[Ref](https://refactoring.guru/design-patterns/bridge)]

```mermaid
---
title: Bridge (Use Gas Sensor As Example)
---
classDiagram

    IGasSensorHardware <|-- TIGasSensorHardware
    IGasSensorHardware <|-- NXPGasSensorHardware
    IGasSensorHardware <|-- OtherGasSensor
    IGasSensor ..> IGasSensorHardware
    Client ..> IGasSensor

    note for Client "client can read GasFloW or GasIntensity\n doesn't matter what hardware is"

    class IGasSensor {
      <<interface>>
      +GetGasFlow() float
      +GetGasIntensity() float
    }

    class IGasSensorHardware {
      <<interface>>
      +ReadFromRegister(char address) int
      +WriteToRegister(char address) bool
    }

    class TIGasSensorHardware{
      +ReadFromRegister(char address) int
      +WriteToRegister(char address) bool
      +SpecificSensorReading() 
    }

    class NXPGasSensorHardware{
      +ReadFromRegister(char address) int
      +WriteToRegister(char address) bool
      +SpecificSensorReading() 
    }

    class OtherGasSensor{
      +ReadFromRegister(char address) int
      +WriteToRegister(char address) bool
      +SpecificSensorReading() 
    }

    class Client{
      +GetGasFlow() float
      +GetGasIntensity() float
    }

```
```cpp

  cout << "| Bridge Design Pattern |" << endl;

  IGasSensorHardware *gasSensorHardware = new NXPGasSensorHardware();
  IGasSensor *gasSensor = new NXPGasSensor(gasSensorHardware);

  cout << endl
       << "- gas Sensor Flow: " << endl << gasSensor->GetFlow();

  cout << endl
       << "- gas Sensor intensity: " << endl
       << gasSensor->GetIntensity();
```
