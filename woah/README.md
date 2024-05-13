[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
<p align="center">
 <img src="./WOAH(1).png" alt="WOAH" />
</p>

## Introduction 

my setup to build oat++ web framework.

## Setup

setup doesn't force to install `oatpp` on your environment, but only inside build folder.
`oat` folder will save all oatpp dependecies like `oatpp, oatpp-curl, oatpp-swagger, etc...`.
then you can install additional oatpp [module](https://oatpp.io/docs/modules/oatpp/) as follow, 
```shell
# to add additional module update function
add_external_oatpp_module(MODULE xxx xxx xxx ) # inside src/oat/CMakeLists.txt

# and use it in your project
add_oatpp_module(MODULE xxx xxx xxx ) # inside src/CMakeLists.txt

```

## Note

Reference: [Oat++ main web page](https://oatpp.io/)

<sub><sup> Sunday 12 may 00:13 2024 in the morning, Made with ♥️ by AH...</sup></sub>

