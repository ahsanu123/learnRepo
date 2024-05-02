cmake_minimum_required(VERSION 3.20)

project(Pyl VERSION 1.0 DESCRIPTION "audio plugin use DPF Framework")
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)
set(FETCHCONTENT_QUIET FALSE)

FetchContent_Declare(
  dpf
  GIT_REPOSITORY  https://github.com/DISTRHO/DPF.git
  GIT_TAG         1504e7d327bfe0eac6a889cecd199c963d35532f
  GIT_PROGRESS    TRUE
)

message("-- Cloning DPF...")
Fetchcontent_MakeAvailable(dpf)

add_custom_target(
  copyCompileCommand
  ALL
  COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/compile_commands.json ${CMAKE_CURRENT_SOURCE_DIR}
  DEPENDS Pyl
  COMMENT "Copying compile_command.json to main directory."
)

message("-- DPF Source Dir: ${dpf_SOURCE_DIR}")
add_subdirectory(${dpf_SOURCE_DIR})

dpf_add_plugin( Pyl
  TARGETS jack
  MONOLITHIC

  FILES_DSP
    "./src/PylPlugin.cpp"

  FILES_UI
    "./src/ui/PylUI.cpp"
)

target_include_directories(Pyl PUBLIC "./src/")

