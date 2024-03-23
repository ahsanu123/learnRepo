# cmake_minimum_required(VERSION 3.28 FATAL_ERROR)
# # set(CMAKE_TOOLCHAIN_FILE cmake/toolchain.cmake)
# project(blink VERSION 0.1.0 LANGUAGES CXX C ASM)
#
# include(cmake/toolchain.cmake)
# include(cmake/stm32f407.cmake)
#
# add_executable(blink src/blink.cpp)
# target_link_libraries(blink stm32f765)
# set_property(TARGET blink PROPERTY CXX_STANDARD 17)
# stm32_add_linker_script(blink PRIVATE src/generated.stm32f407vgt6.ld)
# stm32_add_flash_targets(blink)

#arm-none-eabi-gcc -E -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16 -DSTM32F4 -DSTM32F4CCM -DSTM32F407VGT6 -D_ROM=1024K -D_RAM=128K -D_CCM=64K -D_CCM_OFF=0x10000000 -D_ROM_OFF=0x08000000 -D_RAM_OFF=0x20000000 -P -E libopencm3/ld/linker.ld.S -o generated.stm32f407vgt6.ld







cmake_minimum_required(VERSION 3.28 FATAL_ERROR)

# set(CMAKE_TOOLCHAIN_FILE "./cmake/toolchain-arm-none-eabi-gcc.cmake")
project(blink VERSION 0.0.1 LANGUAGES CXX C ASM)

# ============================================
# THIS VALUE MUST BE SET BASED ON
# STM32 ARCHITECTURE AND
# DEVICE SERIES
# ============================================
set(auto_stm32_arch "f4")
set(auto_stm32_device "stm32f407vgt6")
# ============================================

include(cmake/toolchain-arm-none-eabi-gcc.cmake)

add_executable(blink src/blink.cpp)

target_link_libraries(blink auto_stm32)
set_property(TARGET blink PROPERTY CXX_STANDARD 17)
# stm32_add_linker_script(blink PRIVATE src/stm32f407vgt6.ld)

stm32_add_linker_script(blink PRIVATE "${ld_script_parent}")
# stm32_add_linker_script(blink PRIVATE src/basic.stm32.ld)

