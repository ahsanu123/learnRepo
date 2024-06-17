cmake_minimum_required(VERSION 3.29 FATAL_ERROR)

project(dlib_project)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)

FetchContent_Declare(
   dlib
   URL https://github.com/davisking/dlib/archive/refs/tags/v19.24.4.zip
)

message("Fetching Dlib")
FetchContent_MakeAvailable(
  dlib
)

set(SRCS
  src/main.cpp
  )

add_executable(main ${SRCS})
target_link_libraries(
  main
  PUBLIC
  dlib
)

add_custom_target(
  copyCompileCommands
  ALL
  COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/compile_commands.json ${CMAKE_CURRENT_SOURCE_DIR}
  DEPENDS main
  COMMENT "Copying compile_command.json to main directory."
)


