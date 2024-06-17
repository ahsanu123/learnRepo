cmake_minimum_required(VERSION 3.29 FATAL_ERROR)

project(root_project)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)

FetchContent_Declare(
   armadillo
   URL https://sourceforge.net/projects/arma/files/armadillo-12.8.4.tar.xz
)

message("Fetching Armadillo")
FetchContent_MakeAvailable(
  armadillo
)

find_package(ROOT REQUIRED)

message("ROOT Include Dir: ${ROOT_INCLUDE_DIRS}")
message("Libraries: ${ROOT_LIBRARIES}")

execute_process(
  COMMAND root-config --glibs --cflags --libs
  OUTPUT_VARIABLE GENERATED_ROOT_CONFIG
  OUTPUT_STRIP_TRAILING_WHITESPACE
)
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${GENERATED_ROOT_CONFIG}")
# set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${GENERATED_ROOT_CONFIG}")
message("Root Definitions: ${ROOT_DEFINITIONS}")
message("ROOT-CONFIG: ${GENERATED_ROOT_CONFIG}")

set(SRCS
  src/main.cpp
  )

add_executable(root_project ${SRCS})
target_link_libraries(
  root_project
  PUBLIC
  ROOT::RIO
  ROOT::Net
  ROOT::Gui
  # ${ROOT_LIBRARIES}
  armadillo
)
target_compile_options(root_project PUBLIC ${GENERATED_ROOT_CONFIG})
target_link_options(root_project PUBLIC ${GENERATED_ROOT_CONFIG})

add_custom_target(
  copyCompileCommands
  ALL
  COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/compile_commands.json ${CMAKE_CURRENT_SOURCE_DIR}
  DEPENDS root_project
  COMMENT "Copying compile_command.json to main directory."
)


