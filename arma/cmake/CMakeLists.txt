cmake_minimum_required(VERSION 3.12 FATAL_ERROR)

project(gtkmm_plplot)
include(ExternalProject)

set(GTKMM_PLPLOT_DIR ${CMAKE_BINARY_DIR}/../gtkmm-plot)

ExternalProject_Add(
  gtkmm-plplot 
  URL https://github.com/tschoonj/gtkmm-plplot/archive/refs/tags/gtkmm-plplot-3.0.zip
  PREFIX "${GTKMM_PLPLOT_DIR}"
  DOWNLOAD_EXTRACT_TIMESTAMP on 
  WORKING_DIRECTORY "${GTKMM_PLPLOT_DIR}/src/gtkmm-plplot/"
  CONFIGURE_COMMAND mkdir ${GTKMM_PLPLOT_DIR}/src/gtkmm-plplot/build && 
                    cd ${GTKMM_PLPLOT_DIR}/src/gtkmm-plplot/build && 
                    meson setup -Dprefix=${GTKMM_PLPLOT_DIR}

  BUILD_COMMAND     cd ${GTKMM_PLPLOT_DIR}/src/gtkmm-plplot/build && 
                    ninja 

  INSTALL_COMMAND   cd ${GTKMM_PLPLOT_DIR}/src/gtkmm-plplot/build && 
                    ninja install
)

ExternalProject_Get_Property(
  gtkmm-plplot 
  install_dir
)

set(GTKMM_PLPLOT_INSTALL_DIR ${install_dir})
set(GTKMM_PLPLOT_INSTALL_DIR ${install_dir} PARENT_SCOPE)
set(ENV{PKG_CONFIG_PATH} "$ENV{PKG_CONFIG_PATH}:${GTKMM_PLPLOT_INSTALL_DIR}/lib/pkgconfig")

