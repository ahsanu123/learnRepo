[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
<p align="center">
 <img src="./WOAH(1).png" alt="WOAH" />
</p>

## Introduction 

my setup to build oat++ backend framework.

## Setup

setup doesn't force to install oatpp on your environment, but only inside build folder.
`oat` folder will save all oatpp dependecies like `oatpp, oatpp-curl, oatpp-swagger, etc...`.
then you can install additional oatpp [module](https://oatpp.io/docs/modules/oatpp/), to add additional module 
create new `ExternalProject` inside `oat/CMakeLists.txt`, then include `oatpp-xxxxConfig.cmake` into main `CMakeLists.txt`


## Note

Reference: [Oat++ main web page](https://oatpp.io/)



