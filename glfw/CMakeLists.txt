cmake_minimum_required(VERSION 3.18)

project(glfw_exec LANGUAGES CXX)

find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIRS})

# include module section
# =======================================================
include(FetchContent)
cmake_policy(SET CMP0135 NEW)

# needed package section
# =======================================================

message("=================================")
message("  Downloading Requied Package....")
message("=================================")

FetchContent_Declare(
  glfw
  URL https://github.com/glfw/glfw/releases/download/3.4/glfw-3.4.zip
  )
FetchContent_Declare(
  imgui_glfw
  GIT_REPOSITORY https://github.com/ocornut/imgui.git
  GIT_TAG c6aa051629753f0ef0d26bf775a8b6a92aa213b2
  )
FetchContent_MakeAvailable(glfw imgui_glfw)

# add library section
# =======================================================
# imgui add_library reference from:https://github.com/cmmw/imgui-glfw-glad-glm/blob/master/CMakeLists.txt

file(
  GLOB
  imgui_glfw_SRC
  ${imgui_glfw_SOURCE_DIR}/*.cpp
  ${imgui_glfw_SOURCE_DIR}/*.h
  )

add_library(
  imgui_glfw
  ${imgui_glfw_SRC}
  ${imgui_glfw_SOURCE_DIR}/backends/imgui_impl_opengl3.cpp
  ${imgui_glfw_SOURCE_DIR}/backends/imgui_impl_opengl3.h
  ${imgui_glfw_SOURCE_DIR}/backends/imgui_impl_glfw.cpp
  ${imgui_glfw_SOURCE_DIR}/backends/imgui_impl_glfw.h
  )

# option for package section
# =======================================================

# glfw
set(GLFW_BUILD_DOCS OFF CACHE BOOL "GLFW lib only" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(GLFW_INSTALL OFF CACHE BOOL "GLFW lib only")
set(GLAD_GL "")

option(GLFW-USE-GLAD "use GLAD from GLFW" ON)

if(GLFW-USE-GLAD)
  include_directories("${GLFW_SOURCE_DIR}/deps")
  set(GLAD_GL "${GLFW_SOURCE_DIR}/deps/glad/gl.h")
endif()


# target section
# =======================================================

set(CMAKE_EXPORT_COMPILE_COMMANDS ON CACHE INTERNAL "")
set(
  GLFW_PROJECT_SRC
  src/main.cpp
  src/style/game_engine_style.cpp
  )

add_executable(glfw_exec
  ${GLFW_PROJECT_SRC}
  ${GLAD_GL}
  )

target_link_libraries(glfw_exec
  ${OPENGL_LIBRARIES}
  glfw
  imgui_glfw
  )

target_include_directories(
  imgui_glfw
  PUBLIC
  ${imgui_glfw_SOURCE_DIR}
  ${imgui_glfw_SOURCE_DIR}/backends
  )
