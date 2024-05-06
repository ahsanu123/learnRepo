cmake_minimum_required(VERSION 3.20) 
project(learnCCallback LANGUAGES CXX C)

set(CMAKE_EXPORT_COMPILE_COMMANDS true)

add_executable(learnCCallback 
  src/main.c
  )
