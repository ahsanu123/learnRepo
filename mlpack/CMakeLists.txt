cmake_minimum_required(VERSION 3.6)
project(learnMlPack C CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_library(libarmadillo_location NAMES  libarmadillo.so )
message("-- ARMADILLO: ${libarmadillo_location}")

add_library(armadillo STATIC IMPORTED )
set_target_properties(armadillo PROPERTIES IMPORTED_LOCATION ${libarmadillo_location})


add_executable(
  main 
  ./src/main.cpp
)

target_link_libraries(
  main 
  armadillo
)
target_link_options(
  main 
  PUBLIC 
  -fopenmp
)




