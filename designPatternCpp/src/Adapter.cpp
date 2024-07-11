#include <filesystem>
#include <iostream>
using namespace std;

class RowingBoat {
public:
  virtual void row() = 0;
};

class OldRowingBoat : public RowingBoat {
public:
  void row() override { cout << "Captain Rowing With Old Boat" << endl; }
};

class SailBoat {
private:
  string name;

public:
  SailBoat(string name) { this->name = name; }
  void sail() { cout << "sailing" << endl; }
};

class Captain {
private:
  RowingBoat *boat;

public:
  Captain(RowingBoat *boat) { this->boat = boat; }
  void rowing() { this->boat->row(); }
};

class SailBoatAdapter : public RowingBoat {

private:
  SailBoat sailBoat;

public:
  SailBoatAdapter(SailBoat boat) : sailBoat(boat) {}
  void row() override { this->sailBoat.sail(); }
};

// ------------------------
//
// ------------------------

class McuUsb {
public:
  bool RequestFromUsb(int address) {
    cout << "request From usb " << endl;
    return true;
  }
};

class Mcu {
public:
  virtual bool RequestData(int address) = 0;
};

class SerialTransfer : public Mcu {
  bool RequestData(int address) override {
    cout << "Request Data From Serial" << endl;
    return true;
  }
};

class MyAvrProject {
private:
  Mcu *mcu;

public:
  void SetMcu(Mcu *mcu) { this->mcu = mcu; }
  bool RequestData() { return this->mcu->RequestData(2); }
};

class McuUsbAdapter : public Mcu {
private:
  McuUsb usb;

public:
  McuUsbAdapter(McuUsb usb) { this->usb = usb; }
  bool RequestData(int address) override {
    return this->usb.RequestFromUsb(address);
  }
};

int main(int argc, char *argv[]) {

  auto avrProject = new MyAvrProject();
  avrProject->SetMcu(new SerialTransfer());
  avrProject->RequestData();

  avrProject->SetMcu(new McuUsbAdapter(*new McuUsb()));
  avrProject->RequestData();

  // only one old rowing boat
  auto oldboat = new OldRowingBoat();
  auto fishingBoat = new SailBoat("Fishing Boat");

  auto captain1 = new Captain(oldboat);
  auto captain2 = new Captain(new SailBoatAdapter(*fishingBoat));

  captain1->rowing();
  captain2->rowing();

  return 0;
}
