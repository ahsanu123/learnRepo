# Design Pattern In C++

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
