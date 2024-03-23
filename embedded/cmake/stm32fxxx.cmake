include(FetchContent)
FetchContent_Declare(libopencm3
  GIT_REPOSITORY https://github.com/libopencm3/libopencm3
  GIT_TAG master
)
FetchContent_MakeAvailable(libopencm3)
FetchContent_GetProperties(libopencm3)

add_custom_target(libopencm3 
  make "TARGETS=stm32/${auto_stm32_arch}"
  WORKING_DIRECTORY ${libopencm3_SOURCE_DIR})

# Create a specific CPU target with the appropriate options etc
add_library(auto_stm32 STATIC IMPORTED)
set_property(TARGET auto_stm32 
  PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${libopencm3_SOURCE_DIR}/include)

set_property(TARGET auto_stm32 
  PROPERTY IMPORTED_LOCATION ${libopencm3_SOURCE_DIR}/lib/libopencm3_stm32${auto_stm32_arch}.a)

add_dependencies(auto_stm32 libopencm3)
target_link_directories(auto_stm32 INTERFACE ${libopencm3_SOURCE_DIR}/lib)

# target_compile_definitions(auto_stm32 INTERFACE -DSTM32F7)

# set(COMPILE_OPTIONS
#   --static 
#   -nostartfiles
#   -fno-common
#   -mcpu=cortex-m7
#   -mthumb
#   -mfloat-abi=hard
#   -mfpu=fpv5-d16
# )
#
# target_compile_options(auto_stm32 INTERFACE ${COMPILE_OPTIONS})
# target_link_options(auto_stm32 INTERFACE ${COMPILE_OPTIONS})


