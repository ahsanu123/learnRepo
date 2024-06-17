#include "window/MainWindow.h"
#include <gtkmm.h>

int main(int argc, char *argv[]) {

  auto app = Gtk::Application::create("org.ahahterror.base");
  return app->make_window_and_run<MainWindow>(argc, argv);
}
