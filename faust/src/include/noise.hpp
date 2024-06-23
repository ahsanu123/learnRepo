/* ------------------------------------------------------------
author: "Grame"
copyright: "(c)GRAME 2009"
license: "BSD"
name: "Noise"
version: "1.1"
Code generated with Faust 2.72.14 (https://faust.grame.fr)
Compilation options: -lang cpp -ct 1 -es 1 -mcd 16 -mdd 1024 -mdy 33 -single
-ftz 0
------------------------------------------------------------ */

#ifndef _NoiseDsp_
#define _NoiseDsp_

#ifndef FAUSTFLOAT
#define FAUSTFLOAT float
#endif

#ifndef FAUSTCLASS
#define FAUSTCLASS mydsp
#endif

#if defined(_WIN32)
#define RESTRICT __restrict
#else
#define RESTRICT __restrict__
#endif

#include <dsp/dsp.h>
#include <gui/UI.h>
#include <gui/meta.h>

class NoiseDsp : public dsp {

private:
  int iRec0[2];
  FAUSTFLOAT fVslider0;
  int fSampleRate;

public:
  NoiseDsp() {}

  void metadata(Meta *m) {
    m->declare("author", "Grame");
    m->declare(
        "compile_options",
        "-lang cpp -ct 1 -es 1 -mcd 16 -mdd 1024 -mdy 33 -single -ftz 0");
    m->declare("copyright", "(c)GRAME 2009");
    m->declare("filename", "noise.dsp");
    m->declare("license", "BSD");
    m->declare("name", "Noise");
    m->declare("version", "1.1");
  }

  virtual int getNumInputs() { return 0; }
  virtual int getNumOutputs() { return 1; }

  static void classInit(int sample_rate) {}

  virtual void instanceConstants(int sample_rate) { fSampleRate = sample_rate; }

  virtual void instanceResetUserInterface() { fVslider0 = FAUSTFLOAT(0.5f); }

  virtual void instanceClear() {
    for (int l0 = 0; l0 < 2; l0 = l0 + 1) {
      iRec0[l0] = 0;
    }
  }

  virtual void init(int sample_rate) {
    classInit(sample_rate);
    instanceInit(sample_rate);
  }

  virtual void instanceInit(int sample_rate) {
    instanceConstants(sample_rate);
    instanceResetUserInterface();
    instanceClear();
  }

  virtual NoiseDsp *clone() { return new NoiseDsp(); }

  virtual int getSampleRate() { return fSampleRate; }

  virtual void buildUserInterface(UI *ui_interface) {
    ui_interface->openVerticalBox("Noise");
    ui_interface->declare(&fVslider0, "acc", "0 0 -10 0 10");
    ui_interface->declare(&fVslider0, "style", "knob");
    ui_interface->addVerticalSlider("Volume", &fVslider0, FAUSTFLOAT(0.5f),
                                    FAUSTFLOAT(0.0f), FAUSTFLOAT(1.0f),
                                    FAUSTFLOAT(0.1f));
    ui_interface->closeBox();
  }

  virtual void compute(int count, FAUSTFLOAT **RESTRICT inputs,
                       FAUSTFLOAT **RESTRICT outputs) {
    FAUSTFLOAT *output0 = outputs[0];
    float fSlow0 = 4.656613e-10f * float(fVslider0);
    for (int i0 = 0; i0 < count; i0 = i0 + 1) {
      iRec0[0] = 1103515245 * iRec0[1] + 12345;
      output0[i0] = FAUSTFLOAT(fSlow0 * float(iRec0[0]));
      iRec0[1] = iRec0[0];
    }
  }
};

#endif
