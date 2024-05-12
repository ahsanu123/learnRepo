
set(OATPP_VERSION 1.3.0)
set(oatpp_build_dir ${CMAKE_CURRENT_SOURCE_DIR}/oat/build)

execute_process(
  COMMAND ${CMAKE_COMMAND} -S ${CMAKE_CURRENT_SOURCE_DIR}/oat -B ${CMAKE_CURRENT_SOURCE_DIR}/oat/build
)
execute_process(
  COMMAND ${CMAKE_COMMAND} --build ${CMAKE_CURRENT_SOURCE_DIR}/oat/build
)

function(add_oatpp_module)

  set(options AMALGAMATION)
  set(oneValueArgs)
  set(multiValueArgs MODULE)
  cmake_parse_arguments(MOD "${options}" "${oneValueArgs}" "${multiValueArgs}" ${ARGN} )

  message("===================================================================")

  # Enable oatpp module by default
  message("Enabling: oatpp")
  set(oatpp_DIR             ${oatpp_build_dir}/lib/lib/cmake/oatpp-${OATPP_VERSION})
  include(${oatpp_DIR}/oatppConfig.cmake)

  foreach(mod ${MOD_MODULE})
    message("Enabling: oatpp-${mod}")
    set(oatpp-${mod}_DIR        ${oatpp_build_dir}/lib/lib/cmake/oatpp-${mod}-${OATPP_VERSION})
    include(${oatpp-${mod}_DIR}/oatpp-${mod}Config.cmake)
  endforeach()

  message("===================================================================\n")

endfunction()
