cmake_minimum_required(VERSION 3.29 FATAL_ERROR)

project(pattern_cpp)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(
  builder
 ./src/Builder.cpp
)

add_executable(
   bridge
  ./src/Bridge.cpp
)

add_executable(
  adapter
  ./src/Adapter.cpp
)
