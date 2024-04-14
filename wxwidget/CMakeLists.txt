cmake_minimum_required(VERSION 3.14 FATAL_ERROR)

project(Mbuh LANGUAGES CXX)

include(FetchContent)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(wxBUILD_SHARED OFF)

set(CMAKE_EXPORT_COMPILE_COMMANDS true)

message(STATUS "Fetching wxWidgets...")

FetchContent_Declare(
   wxWidgets
   GIT_REPOSITORY https://github.com/wxWidgets/wxWidgets.git
   GIT_SHALLOW ON
)
FetchContent_MakeAvailable(wxWidgets)

set(SRCS 
    src/main.cpp)

add_executable(main ${SRCS})
target_link_libraries(main PRIVATE wxcore wxnet)
