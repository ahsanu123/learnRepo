# Copyright (c) 2024 Ahsanu. All Rights Reserved.

cmake_minimum_required(VERSION 3.29)

set(project_name "woah")
project (${project_name})

include(FetchContent)

set(CMAKE_CXX_STANDARD 11)

execute_process(
  COMMAND ${CMAKE_COMMAND} -S ${CMAKE_CURRENT_SOURCE_DIR}/oat -B ${CMAKE_CURRENT_SOURCE_DIR}/oat/build
  # COMMAND ${CMAKE_COMMAND} --build ${CMAKE_CURRENT_SOURCE_DIR}/oat/build
  # WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/oat
)

message("--- Include Oatpp and Oatpp curl (find_package equivalent)")
include(${oatpp_DIR}/oatppConfig.cmake)
include(${oatpp-curl_DIR}/oatpp-curlConfig.cmake)

add_library(${project_name}-lib
        src/AsyncExample.hpp
        src/DemoApiClient.hpp
        src/DemoApiModels.hpp
        src/SimpleExample.hpp
        src/AsyncExample.cpp)

# link libs
target_link_libraries(${project_name}-lib
    PUBLIC oatpp::oatpp
    PUBLIC oatpp::oatpp-curl
)

target_include_directories(${project_name}-lib PUBLIC src)

# # add executables
add_executable(${project_name}-exe
        src/App.cpp
)
target_link_libraries(${project_name}-exe ${project_name}-lib)
add_dependencies(${project_name}-exe ${project_name}-lib)
