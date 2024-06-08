cmake_minimum_required(VERSION 3.14 FATAL_ERROR)

project(ARMA LANGUAGES CXX)

include(FetchContent)

# find_package(Matplot++ REQUIRED)
find_package(glfw3 3.3 REQUIRED)
find_package(OpenGL REQUIRED)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

FetchContent_Declare(
   armadillo
   URL https://sourceforge.net/projects/arma/files/armadillo-12.8.4.tar.xz
)

FetchContent_Declare(
   matplot
   GIT_REPOSITORY https://github.com/alandefreitas/matplotplusplus.git
)

FetchContent_Declare(
   glad
   GIT_REPOSITORY https://github.com/Dav1dde/glad.git
)

set(MATPLOTPP_BUILD_EXPERIMENTAL_OPENGL_BACKEND ON)
FetchContent_MakeAvailable(
  glad
  matplot
)
message("Using Experimental Matplotpp OpenGL${MATPLOTPP_BUILD_EXPERIMENTAL_OPENGL_BACKEND}")

message("${matplot_BINARY_DIR}")

add_library(
  custom_matplotpp_opengl
  "${matplot_SOURCE_DIR}/source/matplot/backend/opengl_embed.h"
  "${matplot_SOURCE_DIR}/source/matplot/backend/opengl_embed.cpp"
  "${matplot_SOURCE_DIR}/source/matplot/backend/opengl.h"
  "${matplot_SOURCE_DIR}/source/matplot/backend/opengl.cpp"
)

target_include_directories(
  custom_matplotpp_opengl
  PUBLIC
  "${matplot_SOURCE_DIR}/source/"
  "${matplot_BINARY_DIR}/source/matplot"
)

target_link_libraries(custom_matplotpp_opengl glad)

set(SRCS
    src/main.cpp)

add_executable(main ${SRCS})
target_link_libraries(
  main
  PUBLIC
  glad
  glfw
  OpenGL::GL
  # Matplot++::matplot
  matplot
  custom_matplotpp_opengl
)
