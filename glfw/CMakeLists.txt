cmake_minimum_required(VERSION 3.18)

project(glfw_exec LANGUAGES CXX)

find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIRS})

include(FetchContent)
# add_subdirectory(glfw)
cmake_policy(SET CMP0135 NEW)

FetchContent_Declare(
  glfw
  URL https://github.com/glfw/glfw/releases/download/3.4/glfw-3.4.zip
  )
FetchContent_MakeAvailable(glfw)

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

set(GLFW_PROJECT_SRC main.cpp)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(glfw_exec ${GLFW_PROJECT_SRC} ${GLAD_GL})
target_link_libraries(glfw_exec ${OPENGL_LIBRARIES} glfw)

