# 📱 **Android Development with Kotlin + Neovim (No Android Studio)**

_Arch Linux / Linux General Setup - Kotlin Multiplatform Compatible_

----------

## 🔧 **Environment Setup**

### 1. **Install Android SDK (Command Line Tools Only)**

You **don't** need Android Studio! Download **Command Line Tools** directly from Google:

-   **Download link**:  
    👉 [Android SDK Command-Line Tools](https://developer.android.com/tools/releases/cmdline-tools)
    
-   **Extract and move to `/opt` (optional):**
        
    ```shell
    sudo mkdir -p /opt/android-sdk/cmdline-tools/latest
    sudo unzip commandlinetools-linux-*.zip -d /opt/android-sdk/cmdline-tools/latest
    ``` 
    
-   **Set environment variables** (add these to your `.bashrc` / `.zshrc`):
  
    
    ```shell
    export ANDROID_SDK_ROOT=/opt/android-sdk
    export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH
    export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH
    export PATH=$ANDROID_SDK_ROOT/build-tools/33.0.2:$PATH
    ` 
    

----------

### 2. **Install Required SDK Packages**

Make sure you have `sdkmanager` (inside `cmdline-tools/latest/bin`).

```shell
sdkmanager --update

sdkmanager "platform-tools" \
           "build-tools;33.0.2" \
           "platforms;android-33" \
           "system-images;android-33;google_apis;x86_64"
``` 

#### Accept Licenses:

`sdkmanager --licenses` 

----------

### 3. **Kotlin Multiplatform Project Setup**

#### Option 1: **Use Kotlin Wizard (Optional)**

Use JetBrains Kotlin Wizard to generate the project (if you want a template): 👉 [Kotlin Multiplatform Wizard](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)


```shell
curl -s https://get.sdkman.io | bash
sdk install kotlin
``` 

Extract or move the generated project to your working folder.

#### Option 2: **Manual Gradle Init**

Or start a minimal Kotlin project manually and add Android targets in Gradle.

----------

### 4. **Connect Your Android Device (Wireless ADB)**

-   Enable **Developer Options** → **Wireless Debugging** on your Android phone.
-   Pair device:
    
    `adb pair <ip:port> <pairing-code>` 
    
    Example:    
    `adb pair 192.168.0.107:38303 408434` 
    
-   Connect: 
    `adb connect 192.168.0.107:43847` 
    

#### Confirm connection: 

`adb devices` 

----------

### 5. **Building and Installing the App**

Run Gradle tasks to build and install the app:


```shell
./gradlew tasks   # View available tasks
./gradlew assembleDebug
./gradlew installDebug
```

Wireless-connected devices will receive the app directly.

#### Hot Reload (Optional Continuous Build):
 

`./gradlew installDebug --continuous` 

It will automatically install new builds when files change.

----------

### 6. **Fix License Issues (If Gradle Complains)**

If you get license errors like:
 
`You have not accepted the license agreements of the following SDK components` 

#### Fix 1: Accept licenses manually:
 

`sdkmanager --licenses` 

#### Fix 2: Manually copy licenses (sometimes required by Gradle):
 

`cp -r $ANDROID_SDK_ROOT/licenses ./licenses` 

Put it in the **project root** where Gradle can find it.

----------

## 📝 **Notes & Resources**

-   ✅ [Android SDK without Android Studio](https://benshapi.ro/post/android-sdk-without-android-studio/) _(mirror or archive recommended!)_
-   ✅ [AUR Package: android-sdk-cmdline-tools-latest](https://aur.archlinux.org/packages/android-sdk-cmdline-tools-latest)
-   ✅ [ADB over WSL2](https://stackoverflow.com/a/67097784/19270838)
-   ✅ [Pair Android Device over Wireless ADB](https://medium.com/@liwp.stephen/pairing-android-device-with-adb-from-command-line-11d71d94c441)

----------

## ✅ **Recommended Tools (Optional)**

-   **Emulators (Optional)**
    
 
    
    ```shell
    sdkmanager "emulator"
    avdmanager create avd -n test -k "system-images;android-33;google_apis;x86_64"
    emulator -avd test
    ```
    

----------

## 🔥 **TL;DR Step-by-Step**

```shell
# Download & extract command-line tools
sudo mkdir -p /opt/android-sdk/cmdline-tools/latest
sudo unzip commandlinetools-linux-*.zip -d /opt/android-sdk/cmdline-tools/latest

# Set environment variables
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH

# Install SDK components
sdkmanager --update
sdkmanager "platform-tools" "build-tools;33.0.2" "platforms;android-33"
sdkmanager --licenses

# Wireless debugging
adb pair <ip:port> <pairing-code>
adb connect <ip:port>

# Build & install app
./gradlew installDebug --continuous
```

## 🚀 Jetpack Visual Hierarchy Overview

```shell
├── Architecture
│   ├── Lifecycle (Manages activity/fragment lifecycle)
│   ├── LiveData (Observable data holder)
│   ├── ViewModel (Holds UI-related data)
│   ├── Room (SQLite object mapping)
│   └── WorkManager (Background work)
│
├── UI
│   ├── Jetpack Compose (Declarative UI)
│   │   ├── UI Toolkit (Layout, Material components)
│   │   ├── Animation (Motion and transitions)
│   │   └── Tooling (Preview, Debugging)
│   ├── AppCompat (Backward compatibility)
│   └── Fragment (UI modularity)
│
├── Behavior
│   ├── Notifications (Alerts and messaging)
│   ├── Permissions (Runtime permissions)
│   └── Sharing (Content sharing between apps)
│
└── Foundation
    ├── Android KTX (Kotlin extensions for Android APIs)
    ├── App Startup (Initialize components quickly)
    └── Test (JUnit extensions, Espresso, etc.)
```
