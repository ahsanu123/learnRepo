## Introduction 
This is a Kotlin Multiplatform project targeting Android, iOS.

* `/composeApp` is for code that will be shared across your Compose Multiplatform applications.
  It contains several subfolders:
  - `commonMain` is for code that’s common for all targets.
  - Other folders are for Kotlin code that will be compiled for only the platform indicated in the folder name.
    For example, if you want to use Apple’s CoreCrypto for the iOS part of your Kotlin app,
    `iosMain` would be the right folder for such calls.

* `/iosApp` contains iOS applications. Even if you’re sharing your UI with Compose Multiplatform, 
  you need this entry point for your iOS app. This is also where you should add SwiftUI code for your project.


Learn more about [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)…

## Environment Setup (Kotlin Multiplatform tested on arch linux)
- setup android sdk (read more about setup [sdk without android studio](https://benshapi.ro/post/android-sdk-without-android-studio/))
- create new project with [wizard](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html?_gl=1%2Asve7ee%2A_ga%2AMjA1MjU5OTgzNC4xNzIxNjE0NjI3%2A_ga_9J976DJZ68%2AMTcyODU1ODc5OC45LjEuMTcyODU1ODg1Ni4xMi4wLjA.%2A_gcl_au%2ANjY4NjU5NTI5LjE3Mjg1NTg4MDg.#create-the-project-with-a-wizard), then extract in your root folder
- install `platform-tools` with `sdkmanager platform-tools` (then append to your path `/opt/android-sdk/platform-tools/`), do same thing to `build-tools`

```shell
//install all this `packages`, and accept the license (sure, choose latest version)
sdkmanager "platforms;android-33"
sdkmanager "platform-tools"
sdkmanager "build-tools;33.0.2"
sdkmanager "system-images;android-33;google_apis;x86_64"
sdkmanager --licenses
```

- enable developer mode on your phone, and turn on wireless debugging, 
- then pair with this command `adb pair 192.168.0.107:38303 408434` _ip port and paircode will diference_ `adb pair <ip:port> <paircode>`
- after pair _connect_ with your device `adb connect 192.168.0.107:43847` (sure change with correct ip and port)
- you can list all `tasks` with (linux may need sudo)

```shell
sudo gradle tasks
```
- accept all license with `sdkmanager --license`, if gradle not detecting accepted license (for example when build project) try to copy license folder from `ANDROID_SDK_ROOT` to your top build directory as described [here](https://developer.android.com/studio/intro/update#download-with-gradle)
- then you can try to install on wireless connected device with `sudo gradle installDebug`


## Notes 

- [android sdk without android studio](https://benshapi.ro/post/android-sdk-without-android-studio/)
- [aur android-sdk-cmdline-tools-latest](https://aur.archlinux.org/packages/android-sdk-cmdline-tools-latest)
- [adb from wsl2](https://stackoverflow.com/a/67097784/19270838)
- [medium wireless pair android device with adb](https://medium.com/@liwp.stephen/pairing-android-device-with-adb-from-command-line-11d71d94c441)
