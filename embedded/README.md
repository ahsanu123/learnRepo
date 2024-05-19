<p >
  <a href="">
    <img alt="npm version" src="https://badgen.net/github/commits/ahsanu123/learnRepo/">
  </a>
  <a href="">
    <img alt="npm" src="https://badgen.net/github/contributors/ahsanu123/learnRepo/">
  </a>
  <a href="">
    <img alt="npm" src="https://badgen.net/github/branches/ahsanu123/learnRepo/">
  </a>
  <a href="https://github.com/ahsanu123/erpPlanner/blob/main/LICENSE">
    <img alt="licence" src="https://badgen.net/github/license/ahsanu123/learnRepo/">
  </a>
</p>

<h1 align="center">Libopencm3 CMake</h1>
<p align="center">  
   <img src="./resource/vbat.png" alt="vbat">
</p>
<p align="center">cmake configuration for stm32 libopencm3, with automatic linker script generator</p>



# Introduction 

cmake configuration for stm32 libopencm3, with automatic linker script generator

### 🔨 Build Step
clone this repo and change directory to this folder then...
```shell
cmake -S . -B build
cd build
make
```

you also can generate documentation by

```shell
cd build/_deps/libopencm3-src/doc
make
```

## 📦 Uploading Step

Configuration included to upload `binary` file to MCU currently only with segger jlink, you can run command 
below to upload binary use jlink
```shell
# make sure you build project with
cmake -S . -B build
cmake --build build 

# then upload it with
cmake --build build --target flash
```
`cmake --build build --target flash` this command will automatic copying `uplodBinary.jlink` into 
binary directory in this case is build dir, then cmake will configure `uplodBinary.jlink` to upload 
binary based on project name.

## 🐛 Debugging 

### Use gdb + gdb-dashboard + gdb-dashboard-svd 

before start make sure use `.gdbinit` config.

Debug with gdb (arm-none-eabi-gdb) and segger jlink with following step: 
1. start `JLinkGDBServerExe&` then choose interface speed and device on displayed dialog
2. run `arm-none-eabi-gdb -x ./current-workdir/.gdbinit`, then type following command in `gdb` shell
  ```shell
  file ./path/to/binary/file.elf
  target remote localhost:2331

  # add svd file 
  dashboard svd load ./STM32F407.svd
  ```
3. you can get svd file from [cmsis-svd](https://github.com/cmsis-svd/cmsis-svd-data/tree/main/data)
4. now you can use `gdb` feature to Debugging (see this for [svd-dashboard](https://github.com/ccalmels/gdb-dashboard-svd/tree/main?tab=readme-ov-file))
  ```shell
  # add/remove GPIO IDR to gdb dashboard
  dashboard svd add GPIOA IDR
  dashboard svd remove GPIOA IDR

  # add peripheral with binary separator
  # -> GPIOA IDR (0x40020010): 0b0000_0000_0000_0000_1101_1111_1100_0011
  dashboard svd add GPIOA IDR /_t

  # get info of peripheral
  svd info GPIOA
  
  ```

5. you can add additional gdb init step like `dashboard svd add PERIPHERAL REGISTER....` inside `.gdbinit` file (place your setting after dashboard start)

  ```shell
  # Start ------------------------------------------------------------------------
  python Dashboard.start()

  dashboard svd load ./STM32F407.svd
  dashboard svd add GPIOA IDR /_t
  file ./build/blink.elf
  target remote localhos:2331 # default segger jlink gdb server

  # rest of your setting
  ```

### Use Segger Ozone

another alternative you can use with jlink is, use ozone [more information](https://www.segger.com/products/development-tools/ozone-j-link-debugger/)

## 📖 Reference 

most of cmake configuration come from official libopencm3 documentation, cmake documentation and
- https://github.com/plusk01/stm32-libopencm3-cmake-blink : copied basic structure
- https://github.com/libopencm3/libopencm3/blob/master/mk/genlink-config.mk : converting this configuration makefiles to cmake function


<sub><sup> Sunday about 06:00 2024 in the morning, Made with ♥️ by AH...</sup></sub>
