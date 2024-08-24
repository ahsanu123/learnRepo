
set(LIBUSB_ROOT ${libusb_SOURCE_DIR})
set(EXAMPLES_ROOT ${LIBUSB_ROOT}/libusb/examples/)

message("LIBUSB ROOT: ${LIBUSB_ROOT}")

if(MSVC)
  add_library(getoptMSVC STATIC
        "${LIBUSB_ROOT}/../msvc/getopt/getopt.c"
        "${LIBUSB_ROOT}/../msvc/getopt/getopt.h"
        "${LIBUSB_ROOT}/../msvc/getopt/getopt1.c"
    )
  # Need to pass HAVE_CONFIG_H so getopt.h can load the config header
  target_compile_definitions(getoptMSVC PRIVATE HAVE_CONFIG_H)
  target_include_directories(getoptMSVC
        PUBLIC "${LIBUSB_ROOT}/../msvc/getopt/"
        PRIVATE "${LIBUSB_GEN_INCLUDES}"
    )
endif()

function(add_libusb_example TEST_NAME)
  set(SOURCES)
  foreach(SOURCE_NAME ${ARGN})
    list(APPEND SOURCES "${EXAMPLES_ROOT}/${SOURCE_NAME}")
  endforeach()
  add_executable("${TEST_NAME}" ${SOURCES})
  target_include_directories("${TEST_NAME}" PRIVATE "${LIBUSB_GEN_INCLUDES}")
  target_link_libraries("${TEST_NAME}" PRIVATE usb-1.0)
  target_compile_definitions("${TEST_NAME}" PRIVATE $<$<C_COMPILER_ID:MSVC>:_CRT_SECURE_NO_WARNINGS=1>)
endfunction()

add_libusb_example(listdevs "listdevs.c")
