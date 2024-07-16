cmake_minimum_required(VERSION 3.29 FATAL_ERROR)

project(LearnMachineLearning)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(ExternalProject)
include(FetchContent)
find_package(PkgConfig REQUIRED)

message("-- Installing Dependencies")
FetchContent_Declare(
  mlpack
  URL https://github.com/mlpack/mlpack/archive/refs/tags/4.4.0.zip
)
FetchContent_Declare(
  armadillo
  URL https://sourceforge.net/projects/arma/files/armadillo-14.0.1.tar.xz
)

# FetchContent_MakeAvailable(
# )


# message("\n\n-- Installing Armadillo..")
# set(Armadillo_INSTALL_PATH ${CMAKE_CURRENT_BINARY_DIR}/libarmadillo)
# message("-- CMAKE_INSTALL_PREFIX: ${CMAKE_INSTALL_PREFIX}")
execute_process(
  COMMAND ${CMAKE_COMMAND} -S ./cmake/ -B ./cmake/build
)
execute_process(
  COMMAND ${CMAKE_COMMAND} --build ./cmake/build/
)
# execute_process(
#   COMMAND ${CMAKE_COMMAND}
#           --install ${armadillo_BINARY_DIR}
#           --prefix ${Armadillo_INSTALL_PATH}
# )
# message("-- armadillo build Path: ${armadillo_BINARY_DIR}")

# FetchContent_MakeAvailable(
#   mlpack
# )

# add_executable(
#   main
#   ./src/main.cpp
# )
# target_link_libraries(
#   main PUBLIC mlpack
# )
