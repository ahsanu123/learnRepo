cmake_minimum_required(VERSION 3.25)

project(learn-faust)

set(FAUST_BASEDDIR ./faust)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

message("-- Searching Faust File In: ${FAUST_BASEDDIR}/*.dsp")
file(
  GLOB
  FAUST_FILE
  RELATIVE ${CMAKE_CURRENT_SOURCE_DIR}

  "${FAUST_BASEDDIR}/*.dsp"
)

message("-- Faust File: ${FAUST_FILE}")

execute_process(
  COMMAND faust -includedir
  OUTPUT_VARIABLE FAUST_INCLUDE_DIR
  OUTPUT_STRIP_TRAILING_WHITESPACE
)

set(FAUST_INCLUDE_DIR "${FAUST_INCLUDE_DIR}/faust")

foreach(file IN LISTS FAUST_FILE)
  message("-- Faust File: ${file}")
endforeach()

file(
  GLOB
  MAIN_INCLUDES
  ./src/include/*.hpp
)

add_executable(
  main
  ./src/main.cpp
  ${MAIN_INCLUDES}
)

target_include_directories(
  main
  PUBLIC
  ${FAUST_INCLUDE_DIR}
  ./src/include/
)


