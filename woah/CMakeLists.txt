# Copyright (c) 2024 Ahsanu. All Rights Reserved.

cmake_minimum_required(VERSION 3.29)

set(project_name "woah")
project (${project_name})

include(FetchContent)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD 11)
set(OATPP_VERSION 1.3.0)
set(oatpp_build_dir ${CMAKE_CURRENT_SOURCE_DIR}/oat/build)

execute_process(
  COMMAND ${CMAKE_COMMAND} -S ${CMAKE_CURRENT_SOURCE_DIR}/oat -B ${CMAKE_CURRENT_SOURCE_DIR}/oat/build
)
execute_process(
  COMMAND ${CMAKE_COMMAND} --build ${CMAKE_CURRENT_SOURCE_DIR}/oat/build
)

set(oatpp_DIR         ${oatpp_build_dir}/lib/lib/cmake/oatpp-${OATPP_VERSION})
set(oatpp-curl_DIR    ${oatpp_build_dir}/lib/lib/cmake/oatpp-curl-${OATPP_VERSION})

include(${oatpp_DIR}/oatppConfig.cmake)
include(${oatpp-curl_DIR}/oatpp-curlConfig.cmake)

# ==========================================================
# ADD YOUR SOURCE
# ==========================================================
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
