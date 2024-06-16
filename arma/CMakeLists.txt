cmake_minimum_required(VERSION 3.12 FATAL_ERROR)

project(Arma)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(ExternalProject)
find_package(PkgConfig REQUIRED)

# ===========================================
# VTK LIBRARIES
# ===========================================

find_package(VTK COMPONENTS 
  CommonColor
  CommonCore
  FiltersSources
  InteractionStyle
  RenderingContextOpenGL2
  RenderingCore
  RenderingFreeType
  RenderingGL2PSOpenGL2
  RenderingOpenGL2
)

if (NOT VTK_FOUND)
  message(FATAL_ERROR "VTK_ERROR: Unable to find the VTK build folder.")
endif()


# Prevent a "command line is too long" failure in Windows.
set(CMAKE_NINJA_FORCE_RESPONSE_FILE "ON" CACHE BOOL "Force Ninja to use response files.")

# ===========================================
# GTKMM LIBRARIES
# ===========================================

# Copied from : 
# https://github.com/gammasoft71/Examples_Gtkmm/blob/master/src/Form/CMakeLists.txt

if (NOT VCPKG_TOOLCHAIN)
  find_package(PkgConfig)
  pkg_check_modules(GTKMM gtkmm-4.0)
  include_directories(${GTKMM_INCLUDE_DIRS})
  link_directories(${GTKMM_LIBRARY_DIRS})
  link_libraries(${GTKMM_LIBRARIES})
else()
  find_library(ATKMM_LIBRARY atkmm)
  link_libraries(${ATKMM_LIBRARY})
  find_library(CAIROMM_LIBRARY cairomm-1.0)
  link_libraries(${CAIROMM_LIBRARY})
  find_library(GDKMM_LIBRARY gdkmm)
  link_libraries(${GDKMM_LIBRARY})
  find_library(GIOMM_LIBRARY giomm)
  link_libraries(${GIOMM_LIBRARY})
  find_library(GLIBMM_LIBRARY glibmm)
  link_libraries(${GLIBMM_LIBRARY})
  find_library(GTKMM_LIBRARY gtkmm)
  link_libraries(${GTKMM_LIBRARY})
  find_library(PANGOMM_LIBRARY pangomm)
  link_libraries(${PANGOMM_LIBRARY})
  find_library(SIGC_LIBRARY sigc-3.0)
  link_libraries(${SIGC_LIBRARY})
  find_path(GTKMM_INCLUDE_DIRS gtkmm.h)
  include_directories(${GTKMM_INCLUDE_DIRS})
endif()

if (MSVC)
  set(GUI_OPTION WIN32)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /wd4250")
  set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} /ENTRY:mainCRTStartup")
elseif (APPLE)
  set(GUI_OPTION MACOSX_BUNDLE)
endif ()

# ===========================================
# GTKMM-PLPLOT LIBRARIES
# ===========================================

execute_process(
  COMMAND ${CMAKE_COMMAND} -S cmake/ -B build/gtkmm-plplot-3
)

execute_process(
  COMMAND ${CMAKE_COMMAND} --build build/gtkmm-plplot-3 
)

set(GTKMM_PLPLOT_INSTALL_DIR ${CMAKE_BINARY_DIR}/gtkmm-plot)
message("${GTKMM_PLPLOT_INSTALL_DIR}")
set(ENV{PKG_CONFIG_PATH} "$ENV{PKG_CONFIG_PATH}:${GTKMM_PLPLOT_INSTALL_DIR}/lib/pkgconfig")

pkg_check_modules(GTKMM_PLPLOT gtkmm-plplot-3.0 REQUIRED)

if(GTKMM_PLPLOT_FOUND)
  message("GTKMM_PLPLOT FOUND")
else()
  message("GTKMM_PLPLOT NOT FOUND")
endif()

# ===========================================
# TARGET
# ===========================================

add_executable(
  main 
  ${GUI_OPTION}
  ./src/main.cpp
)

target_link_libraries(
  main 
  PRIVATE ${VTK_LIBRARIES}
  PUBLIC ${GTKMM_PLPLOT_LIBRARIES} ${GTKMM_PLPLOT_LINK_LIBRARIES}
)

target_link_options(
  main 
  PUBLIC ${GTKMM_PLPLOT_LDFLAGS}
)

target_include_directories(
  main 
  PUBLIC
  ${GTKMM_PLPLOT_INCLUDE_DIRS}
)

target_compile_options(
  main 
  PUBLIC 
  ${GTKMM_PLPLOT_CFLAGS}
)

# vtk_module_autoinit is needed
vtk_module_autoinit(
  TARGETS main
  MODULES ${VTK_LIBRARIES}
)

