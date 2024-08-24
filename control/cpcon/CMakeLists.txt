# FLTK Build Copied from this repo https://github.com/Albrecht-S/fltk-build/tree/master
# LIBUSB (use autotools as main build system) come from libusb-cmake https://github.com/libusb/libusb-cmake/tree/main
# Copy Right Ahsanu Amala 2024
cmake_minimum_required( VERSION 3.29)

project(cpcon)

include(FetchContent)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(FLTK_BUILD_TEST OFF CACHE BOOL " " FORCE)
if(UNIX AND NOT APPLE)
  set(OPTION_USE_PANGO ON CACHE BOOL " " FORCE)
endif()

FetchContent_Declare(
  matplotpp
  GIT_REPOSITORY      https://github.com/alandefreitas/matplotplusplus
  GIT_TAG             origin/master
)

FetchContent_Declare(
  FLTK
  GIT_REPOSITORY      https://github.com/fltk/fltk
  GIT_TAG             branch-1.3
)

FetchContent_Declare(
  libusb
  GIT_REPOSITORY      https://github.com/libusb/libusb-cmake
  GIT_TAG             main
)

FetchContent_MakeAvailable(
  matplotpp
  FLTK
  libusb
)

include(./cmake/libusb_example.cmake)

add_executable(
  main
  ./src/main.cpp
)
target_include_directories(main PRIVATE ${fltk_BINARY_DIR} ${fltk_SOURCE_DIR})
target_link_libraries(
  main
  PUBLIC
  matplot
  fltk
)
