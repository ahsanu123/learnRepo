cmake_minimum_required(VERSION 3.29 FATAL_ERROR)

project(zozo)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(ROOT REQUIRED)

message("Found ROOT in ${ROOT_INCLUDE_DIRS}")
message("ROOT Include Dir: ${ROOT_INCLUDE_DIRS}")
message("Libraries: ${ROOT_LIBRARIES}")

set(SRCS
  src/main.cpp
  )

add_executable(zozo ${SRCS})
target_link_libraries(zozo PUBLIC ROOT::RIO ROOT::Net ${ROOT_LIBRARIES})

add_custom_target(
  copyCompileCommands
  ALL
  COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/compile_commands.json ${CMAKE_CURRENT_SOURCE_DIR}
  DEPENDS zozo
  COMMENT "Copying compile_command.json to main directory."
)

