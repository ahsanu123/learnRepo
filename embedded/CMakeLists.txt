
cmake_minimum_required(VERSION 3.28 FATAL_ERROR)

message("
 ██████╗███╗   ███╗ █████╗ ██╗  ██╗███████╗
██╔════╝████╗ ████║██╔══██╗██║ ██╔╝██╔════╝
██║     ██╔████╔██║███████║█████╔╝ █████╗      █████╗
██║     ██║╚██╔╝██║██╔══██║██╔═██╗ ██╔══╝      ╚════╝
╚██████╗██║ ╚═╝ ██║██║  ██║██║  ██╗███████╗
 ╚═════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
██╗     ██╗██████╗  ██████╗ ██████╗ ███████╗███╗   ██╗ ██████╗███╗   ███╗██████╗
██║     ██║██╔══██╗██╔═══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝████╗ ████║╚════██╗
██║     ██║██████╔╝██║   ██║██████╔╝█████╗  ██╔██╗ ██║██║     ██╔████╔██║ █████╔╝    █████╗
██║     ██║██╔══██╗██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║██║     ██║╚██╔╝██║ ╚═══██╗    ╚════╝
███████╗██║██████╔╝╚██████╔╝██║     ███████╗██║ ╚████║╚██████╗██║ ╚═╝ ██║██████╔╝
╚══════╝╚═╝╚═════╝  ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚═╝     ╚═╝╚═════╝
")

# ============================================
# THIS VALUE MUST BE SET BASED ON
# STM32 ARCHITECTURE AND
# DEVICE SERIES
# ============================================
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(auto_stm32_arch "f4")
set(auto_stm32_device "stm32f407vgt6")
set(jlink_stm32_device "stm32f407vg")

include(cmake/toolchain-arm-none-eabi-gcc.cmake)
include(FetchContent)

project(blink VERSION 0.0.2 LANGUAGES CXX C ASM)

set(CMAKE_BUILD_TYPE Debug)
message("${BoldGreen}-- Use ${CMAKE_BUILD_TYPE} Build, Change Setting in CMakeList.txt${ColourReset}\n")
# ============================================

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

configure_file(${CMAKE_BINARY_DIR}/../uploadBinary.jlink ${CMAKE_BINARY_DIR}/uploadBinary.jlink)

add_custom_target(
  flash
  COMMAND JLinkExe -device ${jlink_stm32_device} -speed 4000 -if SWD -NoGui 1 -autoconnect 1 -CommandFile ${CMAKE_BINARY_DIR}/uploadBinary.jlink
  DEPENDS ${CMAKE_BINARY_DIR}/${CMAKE_PROJECT_NAME}.elf
  COMMENT "Flashing with JLinkExe"
)

# TODO: create custom target to start jlink gdb server and connect it to nvim lldb
# JLinkGDBServer -select USB=0 -device STM32F407VG -endian little -if SWD -speed 4000 -noir -LocalhostOnly -nologtofile -port 2331 -SWOPort 2332 -TelnetPort 2333

set(jlinkGdbServer_arg
   -select USB=0
   -device STM32F407VG
   -endian little
   -if SWD
   -speed 4000
   -noir
   -LocalhostOnly
   -nologtofile
   -port 2331
   -SWOPort 2332
   -TelnetPort 2333
   # -silent
    &
  )

add_custom_target(
  startGdb
  COMMAND JLinkGDBServerExe ${jlinkGdbServer_arg}
  COMMAND echo "Now You Can Start gdb and connect to JLinkGDBServerExe - arm-none-eabi-gdb -x .gdbinit"
  COMMENT "Start JLinkGDBServer"
  )

















