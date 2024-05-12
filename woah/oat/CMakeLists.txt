cmake_minimum_required(VERSION 3.29)
project(setup_oatpp)

include(ExternalProject)
include(CMakeParseArguments)

set(OATPP_VERSION 1.3.0)
set(LIB_OATPP "${CMAKE_BINARY_DIR}/lib-oatpp")

function(add_external_oatpp_module)

  set(options )
  set(oneValueArgs)
  set(multiValueArgs MODULE)
  cmake_parse_arguments(MOD "${options}" "${oneValueArgs}" "${multiValueArgs}" ${ARGN} )

  set(INSTALL_DIR_OATPP           ${CMAKE_BINARY_DIR}/lib/src/oatpp-build)

  ExternalProject_Add(
    oatpp
    URL               https://github.com/oatpp/oatpp/archive/refs/tags/1.3.0-latest.zip
    PREFIX            ${CMAKE_BINARY_DIR}/lib
    INSTALL_COMMAND   cmake --install ${INSTALL_DIR_OATPP} --prefix ${CMAKE_BINARY_DIR}/lib
    CMAKE_ARGS        -DOATPP_BUILD_TESTS=OFF
  )
  set(
    oatpp_DIR
    ${CMAKE_BINARY_DIR}/lib/lib/cmake/oatpp-${OATPP_VERSION}
    CACHE INTERNAL ""
  )

  foreach(mod ${MOD_MODULE})

    message("Build oatpp-${mod}")
    set(INSTALL_DIR_OATPP_${mod}    ${CMAKE_BINARY_DIR}/lib/src/oatpp-${mod}-build)

    ExternalProject_Add(
      oatpp-${mod}
      URL               https://github.com/oatpp/oatpp-${mod}/archive/refs/tags/1.3.0-latest.zip
      PREFIX            ${CMAKE_BINARY_DIR}/lib
      INSTALL_COMMAND   cmake --install ${INSTALL_DIR_OATPP_${mod}} --prefix ${CMAKE_BINARY_DIR}/lib
      DEPENDS           oatpp
      CMAKE_ARGS        -DOATPP_BUILD_TESTS=OFF
                        -Doatpp_DIR=${oatpp_DIR}
    )
    set(
      oatpp-${mod}_DIR
      ${CMAKE_BINARY_DIR}/lib/lib/cmake/oatpp-${mod}-${OATPP_VERSION}
      CACHE INTERNAL ""
    )

  endforeach()

endfunction()

# add module you want to install here
# please make sure you type correct module name
add_external_oatpp_module(MODULE curl swagger sqlite)

