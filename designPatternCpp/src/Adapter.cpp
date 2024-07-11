#include <iostream>
#include <uchar.h>

using namespace std;

// Hardware Sensor Interface
class IGasSensorHardware {
public:
  virtual bool WriteToRegister(char8_t value) = 0;
  virtual char8_t ReadFromRegister(char8_t address) = 0;
};

class NXPGasSensorHardware : public IGasSensorHardware {
public:
  bool WriteToRegister(char8_t value) override {
    cout << "-- Writing Spesific NXP Gas Sensor Register  " << (int)value
         << endl;
    return true;
  }
  char8_t ReadFromRegister(char8_t address) override {
    cout << "-- Reading Spesific NXP Gas Sensor Register at Address "
         << (int)address << endl;
    return 0xfa;
  }
};

class TIGasSensorHardware : public IGasSensorHardware {
public:
  bool WriteToRegister(char8_t value) override {
    cout << "-- Writing Spesific TI Gas Sensor Register " << (int)value << endl;
    return true;
  }
  char8_t ReadFromRegister(char8_t address) override {
    cout << "-- Reading Spesific TI Gas Sensor Register at Address "
         << (int)address << endl;
    return 0x11;
  }
};

// Software Sensor Interface
class IGasSensor {
public:
  virtual float GetFlow() = 0;
  virtual float GetIntensity() = 0;
};

class NXPGasSensor : public IGasSensor {

public:
  NXPGasSensor(IGasSensorHardware *hardware) {
    this->gasSensorHardwarePtr = hardware;
  }
  float GetFlow() override {
    auto rawValue = this->gasSensorHardwarePtr->ReadFromRegister(0x22);
    return (float)rawValue + 2;
  }

  float GetIntensity() override {
    auto rawValue = this->gasSensorHardwarePtr->ReadFromRegister(0x32);
    return (float)rawValue + 2;
  }

private:
  IGasSensorHardware *gasSensorHardwarePtr;
};

class TIGasSensor : public IGasSensor {};

int main(int argc, char *argv[]) {
  cout << "| Adapter Design Pattern |" << endl;

  IGasSensorHardware *gasSensorHardware = new NXPGasSensorHardware();
  IGasSensor *gasSensor = new NXPGasSensor(gasSensorHardware);

  cout << endl << "- gas Sensor Flow: " << endl << gasSensor->GetFlow();

  cout << endl
       << "- gas Sensor intensity: " << endl
       << gasSensor->GetIntensity();

  return 0;
}
