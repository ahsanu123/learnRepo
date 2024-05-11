cmake_minimum_required(VERSION 3.29 )

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

FetchContent_MakeAvailable(oatpp oatpp-swagger oatpp-postgresql)

set (CMAKE_EXPORT_COMPILE_COMMANDS ON)
set (CMAKE_CXX_STANDARD 11)

add_library(${project-name}-lib
      src/controller/UserController.hpp
      src/db/UserDb.hpp
      src/dto/ConfigDto.hpp
      src/dto/PageDto.hpp
      src/dto/StatusDto.hpp
      src/dto/UserDto.hpp
      src/service/UserService.cpp
      src/service/UserService.hpp
      src/AppComponent.hpp
      src/DatabaseComponent.hpp
      src/ErrorHandler.cpp
      src/ErrorHandler.hpp
      src/ServiceComponent.hpp
      src/SwaggerComponent.hpp
)

target_include_directories(${project-name}-lib PUBLIC src)
target_include_directories(${project-name}-lib PUBLIC oatpp_SOURCE_DIR)
target_include_directories(${project-name}-lib PUBLIC oatpp-swagger_SOURCE_DIR)
target_include_directories(${project-name}-lib PUBLIC oatpp-postgresql_SOURCE_DIR)


# find_package(oatpp              REQUIRED)
# find_package(oatpp-swagger      REQUIRED)
# find_package(oatpp-postgresql   REQUIRED)

target_link_libraries(${project-name}-lib
  PUBLIC oatpp
  PUBLIC oatpp-swagger
  PUBLIC oatpp-postgresql
  # PUBLIC oatpp::oatpp-test
)

add_definitions(
      # Path to swagger-ui resources #
      -DOATPP_SWAGGER_RES_PATH="${oatpp-swagger_INCLUDE_DIRS}/../bin/oatpp-swagger/res"

      # Path to config file #
      -DCONFIG_PATH="${CMAKE_CURRENT_LIST_DIR}/resources/config.json"

      # # Path to database migration scripts
      -DDATABASE_MIGRATIONS="${CMAKE_CURRENT_SOURCE_DIR}/sql"
)

add_executable(${project-name}-exe src/App.cpp)

target_link_libraries(${project-name}-exe ${project-name}-lib)
add_dependencies(${project-name}-exe ${project-name}-lib)

# enable testing form documentation postgresql
# enable_testing()
# add_test(project-tests ${project_name}-test)

