#include <gtkmm.h>

class MainWindow : public Gtk::Window {
public:
  MainWindow();
  ~MainWindow() {}

protected:
  void on_button_clicked();
  Gtk::Button m_button1, m_button2;
  Gtk::Frame m_frame;
  Gtk::Box m_box;
};
