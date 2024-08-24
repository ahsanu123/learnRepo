set(ARMA_ROOT ${armadillo_SOURCE_DIR})
message("ARMADILLO ROOT: ${ARMA_ROOT}")


add_executable(
  armadillo_example
  ${ARMA_ROOT}/examples/example1.cpp
)
target_link_libraries(armadillo_example armadillo)
