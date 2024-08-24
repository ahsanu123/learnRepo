#include "FL/Fl_Box.H"
#include "FL/Fl_Window.H"
#include <FL/Fl.H>
#include <cmath>
#include <matplot/matplot.h>

using namespace matplot;

int main(int argc, char **argv) {
  fplot([](double x) { return exp(x); }, std::array<double, 2>{-3, 0}, "b");
  hold(on);
  fplot([](double x) { return cos(x); }, std::array<double, 2>{0, 3}, "b");
  hold(off);
  grid(on);

  show();

  auto *window = new Fl_Window(300, 180);
  Fl_Box *box = new Fl_Box(20, 40, 260, 100, "Hello, World!");
  box->box(FL_UP_BOX);
  box->labelsize(36);
  box->labelfont(FL_BOLD + FL_ITALIC);
  box->labeltype(FL_SHADOW_LABEL);
  window->end();
  window->show(argc, argv);
  return Fl::run();
  return 0;
}
