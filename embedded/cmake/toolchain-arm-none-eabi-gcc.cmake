set(CMAKE_SYSTEM_NAME                 Generic)
set(CMAKE_SYSTEM_PROCESSOR            arm)

# Toolchain prefix
set(TOOLCHAIN_PREFIX arm-none-eabi)

# CC		:= $(PREFIX)-gcc
# CXX		:= $(PREFIX)-g++
# LD		:= $(PREFIX)-gcc
# AR		:= $(PREFIX)-ar
# AS		:= $(PREFIX)-as
# OBJCOPY		:= $(PREFIX)-objcopy
# OBJDUMP		:= $(PREFIX)-objdump
# GDB		:= $(PREFIX)-gdb
# SIZE		:= $(PREFIX)-size
# toolchain list
set(CMAKE_C_COMPILER                  ${TOOLCHAIN_PREFIX}-gcc)
set(CMAKE_CXX_COMPILER                ${TOOLCHAIN_PREFIX}-g++)
set(CMAKE_ASM_COMPILER                ${TOOLCHAIN_PREFIX}-as)
set(CMAKE_OBJCOPY                     ${TOOLCHAIN_PREFIX}-objcopy)
set(CMAKE_SIZE                        ${TOOLCHAIN_PREFIX}-size)

# flag list
set(CMAKE_C_FLAGS                     "-Wno-psabi --specs=nosys.specs -fdata-sections -ffunction-sections -Wl,--gc-sections" CACHE INTERNAL "")
set(CMAKE_CXX_FLAGS                   "${CMAKE_C_FLAGS} -fno-exceptions " CACHE INTERNAL "")

set(CMAKE_C_FLAGS_DEBUG               "-Os -g" CACHE INTERNAL "")
set(CMAKE_C_FLAGS_RELEASE             "-Os -DNDEBUG" CACHE INTERNAL "")
set(CMAKE_CXX_FLAGS_DEBUG             "${CMAKE_C_FLAGS_DEBUG}" CACHE INTERNAL "")
set(CMAKE_CXX_FLAGS_RELEASE           "${CMAKE_C_FLAGS_RELEASE}" CACHE INTERNAL "")

# set this for compile into static library instead executable
set(CMAKE_TRY_COMPILE_TARGET_TYPE     STATIC_LIBRARY)

set(CMAKE_EXECUTABLE_SUFFIX_C         .elf)
set(CMAKE_EXECUTABLE_SUFFIX_CXX       .elf)
set(CMAKE_EXECUTABLE_SUFFIX_ASM       .elf)

# used to custom root path
# if CMAKE_FIND_ROOT_PATH is set then
# function like find_program, find_library etc
# will search through its.
#
# this variable use to control if listed program
# above will search through it or not
# ref: https://cmake.org/cmake/help/latest/variable/CMAKE_FIND_ROOT_PATH_MODE_LIBRARY.html
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)


set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if(NOT WIN32)
  string(ASCII 27 Esc)
  set(ColourReset "${Esc}[m")
  set(ColourBold  "${Esc}[1m")
  set(Red         "${Esc}[31m")
  set(Green       "${Esc}[32m")
  set(Yellow      "${Esc}[33m")
  set(Blue        "${Esc}[34m")
  set(Magenta     "${Esc}[35m")
  set(Cyan        "${Esc}[36m")
  set(White       "${Esc}[37m")
  set(BoldRed     "${Esc}[1;31m")
  set(BoldGreen   "${Esc}[1;32m")
  set(BoldYellow  "${Esc}[1;33m")
  set(BoldBlue    "${Esc}[1;34m")
  set(BoldMagenta "${Esc}[1;35m")
  set(BoldCyan    "${Esc}[1;36m")
  set(BoldWhite   "${Esc}[1;37m")
endif()

function(stm32_add_linker_script TARGET VISIBILITY SCRIPT)
  set(path ${SCRIPT})

  cmake_path(
    ABSOLUTE_PATH path
    NORMALIZE
    OUTPUT_VARIABLE RELATIVE_SCRIPT)

  target_link_options(${TARGET} ${VISIBILITY} -T ${RELATIVE_SCRIPT})

endfunction()

function(stm32_add_flash_targets TARGET)
  add_custom_target(${TARGET}-stlink-flash
      bash -c "openocd -f /usr/share/openocd/scripts/interface/stlink-v2.cfg \
                -f /usr/share/openocd/scripts/target/stm32f7x.cfg \
                -c 'reset_config none; program ${TARGET}.elf verify reset exit'"
      WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
      DEPENDS ${TARGET}
      VERBATIM
    )
endfunction()

macro(generate_linker_script DEVICE)
  set(DEVICE_DATA "${libopencm3_SOURCE_DIR}/ld/devices.data")

  message("-- Generating Linker Script For ${DEVICE}")

  execute_process(
    COMMAND "python" "${libopencm3_SOURCE_DIR}/scripts/genlink.py" ${DEVICE_DATA} ${DEVICE} "FAMILY"
    OUTPUT_VARIABLE GENLINK_FAMILY)

  execute_process(
    COMMAND "python" "${libopencm3_SOURCE_DIR}/scripts/genlink.py" ${DEVICE_DATA} ${DEVICE} "SUBFAMILY"
    OUTPUT_VARIABLE GENLINK_SUBFAMILY)

  execute_process(
    COMMAND "python" "${libopencm3_SOURCE_DIR}/scripts/genlink.py" ${DEVICE_DATA} ${DEVICE} "CPU"
    OUTPUT_VARIABLE GENLINK_CPU)

  execute_process(
    COMMAND "python" "${libopencm3_SOURCE_DIR}/scripts/genlink.py" ${DEVICE_DATA} ${DEVICE} "FPU"
    OUTPUT_VARIABLE GENLINK_FPU)

  execute_process(
    COMMAND "python" "${libopencm3_SOURCE_DIR}/scripts/genlink.py" ${DEVICE_DATA} ${DEVICE} "CPPFLAGS"
    OUTPUT_VARIABLE GENLINK_CPPFLAGS)

  execute_process(
    COMMAND "python" "${libopencm3_SOURCE_DIR}/scripts/genlink.py" ${DEVICE_DATA} ${DEVICE} "DEFS"
    OUTPUT_VARIABLE GENLINK_DEFS)

  message("-- ${BoldGreen}Generated Genlink ${ColourReset}
    \t Family   :  ${GENLINK_FAMILY}
    \t Subfamily:  ${GENLINK_SUBFAMILY}
    \t CPU      :  ${GENLINK_CPU}
    \t FPU      :  ${GENLINK_FPU}
    \t CppFlags :  ${GENLINK_CPPFLAGS}
    \t Defs     :  ${GENLINK_DEFS}"
    )

  list(APPEND ARCH_FLAGS  -mcpu=${GENLINK_CPU})

  if(${GENLINK_CPU} MATCHES "(cortex-m0|cortex-m0plus|cortex-m3|cortex-m4|cortex-m7)")
    list(APPEND ARCH_FLAGS  -mthumb)
  endif()

  #==========================================================================
  if("${GENLINK_FPU}" STREQUAL "soft")
    list(APPEND ARCH_FLAGS  -msoft-float)

  elseif("${GENLINK_FPU}" STREQUAL "hard-fpv4-sp-d16")
    list(APPEND ARCH_FLAGS  -mfloat-abi=hard -mfpu=fpv4-sp-d16)

  elseif("${GENLINK_FPU}" STREQUAL "hard-fpv5-d16")
    list(APPEND ARCH_FLAGS -mfloat-abi=hard -mfpu=fpv4-sp-d16)

  elseif("${GENLINK_FPU}" STREQUAL "hard-fpv5-sp-d16")
    list(APPEND ARCH_FLAGS -mfloat-abi=hard -mfpu=fpv5-sp-d16)

  else()
    message(WARNING "warning No match for the FPU flags")
  endif()

  #==========================================================================
  if("${GENLINK_FAMILY}" STREQUAL "")
    message(WARNING "warning ${DEVICE} not found in ${DEVICE_DATA}")
  endif()

  #==========================================================================
  string(TOLOWER ${DEVICE} DEVICE_LOWER)
  set(linker_s ${libopencm3_SOURCE_DIR}/ld/linker.ld.S)
  set(custom_ld_script ${libopencm3_SOURCE_DIR}/ld/generated.${DEVICE_LOWER}.ld)
  message("${BoldGreen}\n-- Generating linker script for ${DEVICE_LOWER}....${ColourReset}
    \t output: ${custom_ld_script}")

  message("${BoldGreen}-- Command To Generate Linker Script${ColourReset}")
  string(REPLACE " " ";" GENLINK_DEFS_LIST ${GENLINK_DEFS})
  execute_process(
    COMMAND ${CMAKE_C_COMPILER} ${ARCH_FLAGS}  ${GENLINK_DEFS_LIST}  -P   -E  ${linker_s}  -o  ${custom_ld_script}
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    COMMAND_ECHO  STDOUT)

  #==========================================================================
  set_property(TARGET auto_stm32
    PROPERTY INTERFACE_INCLUDE_DIRECTORIES ${libopencm3_SOURCE_DIR}/include)

  set_property(TARGET auto_stm32
    PROPERTY IMPORTED_LOCATION ${libopencm3_SOURCE_DIR}/lib/libopencm3_${GENLINK_FAMILY}.a)

  add_dependencies(auto_stm32 libopencm3)
  target_link_directories(auto_stm32 INTERFACE ${libopencm3_SOURCE_DIR}/lib)

  #==========================================================================
  # if(EXISTS "${libopencm3_SOURCE_DIR}/lib/libopencm3_${GENLINK_FAMILY}.a")
  #   set_property(TARGET auto_stm32
  #     PROPERTY IMPORTED_LOCATION ${libopencm3_SOURCE_DIR}/lib/libopencm3_${GENLINK_FAMILY}.a)
  #
  # elseif(EXISTS "${libopencm3_SOURCE_DIR}/lib/libopencm3_${GENLINK_SUBFAMILY}.a")
  #   set_property(TARGET auto_stm32
  #     PROPERTY IMPORTED_LOCATION ${libopencm3_SOURCE_DIR}/lib/libopencm3_${GENLINK_SUBFAMILY}.a)
  #
  # else()
  #   message(WARNING "warning ${libopencm3_SOURCE_DIR}/lib/libopencm3_${GENLINK_SUBFAMILY}.a library variant for the selected device does not exist.")
  #
  # endif()

  #==========================================================================

  list(APPEND ARCH_FLAGS --static -nostartfiles -fno-common)

  target_compile_definitions(auto_stm32 INTERFACE ${GENLINK_CPPFLAGS})
  target_compile_options(auto_stm32 INTERFACE  ${ARCH_FLAGS})
  target_link_options(auto_stm32 INTERFACE ${ARCH_FLAGS})

endmacro()

#==========================================================================
#
# ADD NEW LIBRARY FROM LIBOPENCM3 AND GENERATE LINKER SCRIPT
#
#==========================================================================
message("${BoldGreen}-- Fetching libopencm3....${ColourReset}")

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

message("${BoldGreen}========================================================================= ${ColourReset}")
generate_linker_script(${auto_stm32_device})
message("${BoldGreen}========================================================================= ${ColourReset}")

