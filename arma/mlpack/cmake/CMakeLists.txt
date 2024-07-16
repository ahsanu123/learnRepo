cmake_minimum_required(VERSION 3.29 FATAL_ERROR)

project(external_deps_armadillo)
include(ExternalProject)

set(Armadillo_BUILD_DIR ${CMAKE_CURRENT_BINARY_DIR}/)
set(Armadillo_INSTALL_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../build/armadillo/)

ExternalProject_Add(
  armadillo
  URL https://sourceforge.net/projects/arma/files/armadillo-14.0.1.tar.xz
  DOWNLOAD_EXTRACT_TIMESTAMP on
  CONFIGURE_COMMAND ${CMAKE_COMMAND} -S ../armadillo/ -B .
  BUILD_COMMAND     ${CMAKE_COMMAND} --build .
  INSTALL_COMMAND   ${CMAKE_COMMAND} --install . --prefix ${Armadillo_INSTALL_DIR}
)
