
cmake_minimum_required(VERSION 3.28 FATAL_ERROR)

message("\
================================================\
  libopencm3 cmake                              \
  for stm32                                     \
  with automatic arch setting                   \
  and linker script generator                   \
================================================\
")

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
include(FetchContent)

FetchContent_Declare(
  fatFs
  URL     http://elm-chan.org/fsw/ff/arc/ff15.zip
)

FetchContent_MakeAvailable(fatFs)

# ============================================
# CHANGE YOUR TARGET BASED ON YOUR PROJECT
# ============================================

add_executable(blink src/blink.cpp)
target_link_libraries(blink auto_stm32)
stm32_add_linker_script(blink PRIVATE "${custom_ld_script}")
