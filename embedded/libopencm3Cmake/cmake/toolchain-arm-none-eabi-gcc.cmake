set(CMAKE_SYSTEM_NAME                 Generic)
set(CMAKE_SYSTEM_PROCESSOR            arm)

# Toolchain prefix
set(TOOLCHAIN_PREFIX "arm-none-eabi")

# toolchain list
set(CMAKE_AR                          ${TOOLCHAIN_PREFIX}-ar)
set(CMAKE_ASM_COMPILER                ${TOOLCHAIN_PREFIX}-gcc)
set(CMAKE_C_COMPILER                  ${TOOLCHAIN_PREFIX}-gcc)
set(CMAKE_CXX_COMPILER                ${TOOLCHAIN_PREFIX}-g++)
set(CMAKE_LINKER                      ${TOOLCHAIN_PREFIX}-ld)
set(CMAKE_OBJCOPY                     ${TOOLCHAIN_PREFIX}-objcopy)
set(CMAKE_SIZE                        ${TOOLCHAIN_PREFIX}-size)
set(CMAKE_RANLIB                      ${TOOLCHAIN_PREFIX}-ranlib)
set(CMAKE_STRIP                       ${TOOLCHAIN_PREFIX}-strip)

# flag list
set(CMAKE_C_FLAGS                   "-Wno-psabi --specs=nosys.specs -fdata-sections -ffunction-sections -Wl,--gc-sections" CACHE INTERNAL "")
set(CMAKE_CXX_FLAGS                 "${CMAKE_C_FLAGS} -fno-exceptions" CACHE INTERNAL "")

set(CMAKE_C_FLAGS                     ${FLAGS})
set(CMAKE_CXX_FLAGS                   ${CPP_FLAGS})

# cmake flag debug/release list
set(CMAKE_C_FLAGS_DEBUG               "-Os -g" CACHE INTERNAL "")
set(CMAKE_C_FLAGS_RELEASE             "-Os -DNDEBUG" CACHE INTERNAL "")
set(CMAKE_CXX_FLAGS_DEBUG             "${CMAKE_C_FLAGS_DEBUG}" CACHE INTERNAL "")   
set(CMAKE_CXX_FLAGS_RELEASE           "${CMAKE_C_FLAGS_RELEASE}" CACHE INTERNAL "") 


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

# set this for compile into static library instead executable 
set(CMAKE_TRY_COMPILE_TARGET_TYPE     STATIC_LIBRARY)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# function to add custom linker to project 

function(stm32_add_linker_script TARGET VISIBILITY SCRIPT)
  set(path ${SCRIPT})
  
  cmake_path(
    ABSOLUTE_PATH path
    NORMALIZE
    OUTPUT_VARIABLE RELATIVE_SCRIPT)

  message("${TARGET} ${VISIBILITY} -T ${RELATIVE_SCRIPT}")

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

function(generate_linker_script DEVICE)
  set(DEVICE_DATA "${libopencm3_SOURCE_DIR}/ld/devices.data")

  message("Generating Linker Script For ${DEVICE}")

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

  message("- Generated Genlink 
    \t Family   :  ${GENLINK_FAMILY}
    \t Subfamily:  ${GENLINK_SUBFAMILY}
    \t CPU      :  ${GENLINK_CPU}
    \t FPU      :  ${GENLINK_FPU}
    \t CppFlags :  ${GENLINK_CPPFLAGS}" 
    )

  string(APPEND CMAKE_CXX_FLAGS  " ${GENLINK_CPPFLAGS}")

  set(ARCH_FLAGS "-mcpu${GENLINK_CPU}")
  
  #==========================================================================
  if("${GENLINK_FPU}" STREQUAL "soft")
    string(APPEND ARCH_FLAGS " -msoft-float")

  elseif("${GENLINK_FPU}" STREQUAL "hard-fpv4-sp-d16")
    string(APPEND ARCH_FLAGS " -mfloat-abi=hard -mfpu=fpv4-sp-d16 ")

  elseif("${GENLINK_FPU}" STREQUAL "hard-fpv5-d16")
    string(APPEND ARCH_FLAGS " -mfloat-abi=hard -mfpu=fpv4-sp-d16 ")

  elseif("${GENLINK_FPU}" STREQUAL "hard-fpv5-sp-d16")
    string(APPEND ARCH_FLAGS " -mfloat-abi=hard -mfpu=fpv5-sp-d16")

  else()
    message(WARNING "warning No match for the FPU flags")
  endif()

  #============================== ============================================
  if("${GENLINK_FAMILY}" STREQUAL "")
    message(WARNING "warning ${DEVICE} not found in ${DEVICE_DATA}")
  endif()

endfunction()
