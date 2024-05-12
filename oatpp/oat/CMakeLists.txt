cmake_minimum_required(VERSION 3.29)
project(setup_oatpp)

include(ExternalProject)

set(OATPP_VERSION 1.3.0)
set(LIB_OATPP "${CMAKE_BINARY_DIR}/lib-oatpp")

set(INSTALL_DIR_OATPP ${CMAKE_BINARY_DIR}/lib/src/oatpp-build)
set(INSTALL_DIR_OATPP_CURL ${CMAKE_BINARY_DIR}/lib/src/oatpp-curl-build)

ExternalProject_Add(
  oatpp
  URL               https://github.com/oatpp/oatpp/archive/refs/tags/1.3.0-latest.zip
  PREFIX            ${CMAKE_BINARY_DIR}/lib
  INSTALL_COMMAND   cmake --install ${INSTALL_DIR_OATPP} --prefix ${CMAKE_BINARY_DIR}/lib
  CMAKE_ARGS        -DOATPP_BUILD_TESTS=OFF
)
set(oatpp_DIR ${CMAKE_BINARY_DIR}/lib/lib/cmake/oatpp-${OATPP_VERSION})

ExternalProject_Add(
  oatpp-curl
  URL               https://github.com/oatpp/oatpp-curl/archive/refs/tags/1.3.0-latest.zip
  PREFIX            ${CMAKE_BINARY_DIR}/lib
  INSTALL_COMMAND   cmake --install ${INSTALL_DIR_OATPP_CURL} --prefix ${CMAKE_BINARY_DIR}/lib
  DEPENDS           oatpp
  CMAKE_ARGS        -DOATPP_BUILD_TESTS=OFF
                    -Doatpp_DIR=${oatpp_DIR}
)
set(oatpp-curl_DIR ${CMAKE_BINARY_DIR}/lib/lib/cmake/oatpp-curl-${OATPP_VERSION})

ExternalProject_Get_Property(oatpp INSTALL_DIR)
message("--- Oatpp install dir: ${INSTALL_DIR}")
ExternalProject_Get_Property(oatpp-curl INSTALL_DIR)
message("--- Oatpp curl install dir: ${INSTALL_DIR}")
