include(FetchContent)
FetchContent_Declare(libopencm3
  GIT_REPOSITORY https://github.com/libopencm3/libopencm3
  GIT_TAG master
)
FetchContent_MakeAvailable(libopencm3)
FetchContent_GetProperties(libopencm3)

add_custom_target(libopencm3 
  make TARGETS=stm32/f4 
  WORKING_DIRECTORY ${libopencm3_SOURCE_DIR})

# Create a specific CPU target with the appropriate options etc
add_library(stm32f765 STATIC IMPORTED)
set_property(TARGET stm32f765 
  PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${libopencm3_SOURCE_DIR}/include)

set_property(TARGET stm32f765 
  PROPERTY IMPORTED_LOCATION ${libopencm3_SOURCE_DIR}/lib/libopencm3_stm32f4.a)

add_dependencies(stm32f765 libopencm3)
target_link_directories(stm32f765 INTERFACE ${libopencm3_SOURCE_DIR}/lib)

target_compile_definitions(stm32f765 INTERFACE -DSTM32F7)

set(COMPILE_OPTIONS
  --static 
  -nostartfiles
  -fno-common
  -mcpu=cortex-m7
  -mthumb
  -mfloat-abi=hard
  -mfpu=fpv5-d16
)

target_compile_options(stm32f765 INTERFACE ${COMPILE_OPTIONS})
target_link_options(stm32f765 INTERFACE ${COMPILE_OPTIONS})


