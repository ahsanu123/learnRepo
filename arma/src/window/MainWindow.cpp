
#ifndef __MAIN_WINDOW__
#define __MAIN_WINDOW__

#include "MainWindow.h"
#include <iostream>

MainWindow::MainWindow()
    : m_button1("Hello1"), m_button2("Hello2"),
      m_box(Gtk::Orientation::HORIZONTAL, 10) {
  set_title("SORE - Dashboard");
  set_default_size(600, 480);

  auto pmap = Gtk::make_managed<Gtk::Image>("info.xpm");
  auto label = Gtk::make_managed<Gtk::Label>("Cool Button");
  label->set_expand(true);

  auto hbox = Gtk::make_managed<Gtk::Box>(Gtk::Orientation::HORIZONTAL, 5);
  hbox->append(*pmap);
  hbox->append(*label);

  m_box.set_margin(10);
  set_child(m_box);

  m_box.append(m_button1);
  m_button1.set_hexpand();

  m_box.append(m_button2);
  m_button2.set_hexpand();
};

void MainWindow::on_button_clicked() {
  std::cout << "Hello World" << std::endl;
}

#endif //__MAIN_WINDOW__
