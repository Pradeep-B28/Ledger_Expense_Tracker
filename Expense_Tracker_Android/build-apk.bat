@echo off
echo =======================================================
echo   Building Ledger Expense Tracker Android APK
echo =======================================================

set ANDROID_HOME=C:\Users\DELL\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\DELL\AppData\Local\Android\Sdk

echo 1. Building Vite web assets...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Web build failed.
    exit /b %errorlevel%
)

echo 2. Syncing Capacitor Android project...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [ERROR] Capacitor sync failed.
    exit /b %errorlevel%
)

echo 3. Compiling Android Debug APK with Gradle...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [ERROR] Gradle APK build failed.
    exit /b %errorlevel%
)

echo.
echo =======================================================
echo   BUILD SUCCESSFUL!
echo   APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo =======================================================
pause
