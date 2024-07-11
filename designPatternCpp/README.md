# Design Pattern In C++

## 🏛️ Builder

## 🔌 Adapter

Adapter is a structural design pattern, which allows incompatible objects to collaborate.
The Adapter acts as a wrapper between two objects. It catches calls for one object and transforms them to format and interface recognizable by the second object. [[Ref](https://refactoring.guru/design-patterns/adapter/cpp/example#example-1)]

```mermaid
---
title: Adapter (Use Gas Sensor As Example)
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

  cout << "| Adapter Design Pattern |" << endl;

  IGasSensorHardware *gasSensorHardware = new NXPGasSensorHardware();
  IGasSensor *gasSensor = new NXPGasSensor(gasSensorHardware);

  cout << endl
       << "- gas Sensor Flow: " << endl << gasSensor->GetFlow();

  cout << endl
       << "- gas Sensor intensity: " << endl
       << gasSensor->GetIntensity();
```
