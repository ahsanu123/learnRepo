#include "gui/UI.h"

class UIBase : public UIReal<FAUSTFLOAT> {

  UIBase();
  ~UIBase();

public:
  void declare(FAUSTFLOAT *, const char *, const char *) override {}

  void openTabBox(const char *label) override {}
  void openHorizontalBox(const char *label) override {}
  void openVerticalBox(const char *label) override {}
  void closeBox() override {}

  // -- active widgets

  void addButton(const char *label, FAUSTFLOAT *zone) override {}
  void addCheckButton(const char *label, FAUSTFLOAT *zone) override {}
  void addVerticalSlider(const char *label, FAUSTFLOAT *zone, FAUSTFLOAT init,
                         FAUSTFLOAT min, FAUSTFLOAT max,
                         FAUSTFLOAT step) override {}
  void addHorizontalSlider(const char *label, FAUSTFLOAT *zone, FAUSTFLOAT init,
                           FAUSTFLOAT min, FAUSTFLOAT max,
                           FAUSTFLOAT step) override {}
  void addNumEntry(const char *label, FAUSTFLOAT *zone, FAUSTFLOAT init,
                   FAUSTFLOAT min, FAUSTFLOAT max, FAUSTFLOAT step) override {}

  // -- passive widgets

  void addHorizontalBargraph(const char *label, FAUSTFLOAT *zone,
                             FAUSTFLOAT min, FAUSTFLOAT max) override {}
  void addVerticalBargraph(const char *label, FAUSTFLOAT *zone, FAUSTFLOAT min,
                           FAUSTFLOAT max) override {}

  // -- soundfiles

  void addSoundfile(const char *label, const char *filename,
                    Soundfile **sf_zone) override {}

  // -- metadata declarations

  // To be used by LLVM client
  int sizeOfFAUSTFLOAT() override { return sizeof(FAUSTFLOAT); }
};
