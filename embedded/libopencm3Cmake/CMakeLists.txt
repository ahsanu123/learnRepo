cmake_minimum_required(VERSION 3.22 FATAL_ERROR)

# set(CMAKE_TOOLCHAIN_FILE "./cmake/toolchain-arm-none-eabi-gcc.cmake")
project(blink VERSION 0.0.1 LANGUAGES CXX C ASM)

include(cmake/toolchain-arm-none-eabi-gcc.cmake)
include(cmake/stm32f765.cmake)

add_executable(blink src/blink.cpp)

target_link_libraries(blink stm32f765)
set_property(TARGET blink PROPERTY CXX_STANDARD 17)
stm32_add_linker_script(blink PRIVATE src/basic.stm32.ld)
generate_linker_script(stm32f407vgt6)
# stm32_add_flash_targets(blink)
#
# add_executable(timer src/timer.cpp)
# target_link_libraries(timer stm32f765)
# set_property(TARGET timer PROPERTY CXX_STANDARD 17)
# stm32_add_linker_script(timer PRIVATE src/stm32f7.ld)
# stm32_add_flash_targets(timer)
