cmake_minimum_required(VERSION 3.29)

set(project-name woah)
project (${project-name})

include(FetchContent)

FetchContent_Declare(
  oatpp
  URL https://github.com/oatpp/oatpp/archive/refs/tags/1.3.0-latest.zip
  OVERRIDE_FIND_PACKAGE
)

FetchContent_Declare(
  oatpp-swagger
  URL https://github.com/oatpp/oatpp-swagger/archive/refs/tags/1.3.0-latest.zip
  OVERRIDE_FIND_PACKAGE
)

FetchContent_Declare(
  oatpp-postgresql
  URL https://github.com/oatpp/oatpp-postgresql/archive/refs/tags/1.3.0-latest.zip
  OVERRIDE_FIND_PACKAGE
)

FetchContent_Declare(
  oatpp-curl
  URL https://github.com/oatpp/oatpp-curl/archive/refs/tags/1.3.0-latest.zip
  OVERRIDE_FIND_PACKAGE
)

FetchContent_MakeAvailable(oatpp-curl)

set(OATPP_MODULES_LOCATION EXTERNAL)

set(CMAKE_CXX_STANDARD 11)

add_library(${project_name}-lib
        src/AsyncExample.hpp
        src/DemoApiClient.hpp
        src/DemoApiModels.hpp
        src/SimpleExample.hpp
        src/AsyncExample.cpp)

# # link libs

find_package(oatpp      1.3.0 REQUIRED)
find_package(oatpp-curl 1.3.0 REQUIRED)

target_link_libraries(${project_name}-lib
    PUBLIC oatpp::oatpp
    PUBLIC oatpp::oatpp-curl
    # PUBLIC oatpp::oatpp-test
)

target_include_directories(${project_name}-lib PUBLIC src)

# # add executables

add_executable(${project_name}-exe
        src/App.cpp
)
target_link_libraries(${project_name}-exe ${project_name}-lib)
add_dependencies(${project_name}-exe ${project_name}-lib)

# add_executable(${project_name}-test
#         test/tests.cpp
# )
# target_link_libraries(${project_name}-test ${project_name}-lib)
# add_dependencies(${project_name}-test ${project_name}-lib)
#
# enable_testing()
# add_test(project-tests ${project_name}-test)
