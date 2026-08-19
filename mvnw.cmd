@echo off
@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script for Windows
@REM ----------------------------------------------------------------------------

set ERROR_CODE=0

@REM To isolate internal variables from possible macro expansion, we use setlocal
setlocal

@REM Assist JVM-embedded systems to find the maven-wrapper.jar
set WRAPPER_JAR="%~dp0.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_PROPERTIES="%~dp0.mvn\wrapper\maven-wrapper.properties"

@REM Find Java
if not "%JAVA_HOME%" == "" goto OkJHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto RunLauncher

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
goto error

:OkJHome
set JAVA_EXE="%JAVA_HOME%\bin\java.exe"

:RunLauncher
@REM Downloader code
if exist %WRAPPER_JAR% goto RunMaven

echo Downloading Maven wrapper...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR:"=%')"
if not "%ERRORLEVEL%" == "0" goto error

:RunMaven
@REM Retrieve distributionUrl
for /f "tokens=2 delims==" %%i in ('findstr /i "distributionUrl" %WRAPPER_PROPERTIES%') do set DIST_URL=%%i

%JAVA_EXE% -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%CD%" org.apache.maven.wrapper.MavenWrapperMain %*
if not "%ERRORLEVEL%" == "0" goto error

goto end

:error
set ERROR_CODE=1

:end
@REM Local cleanups
set WRAPPER_JAR=
set WRAPPER_PROPERTIES=
set JAVA_EXE=

exit /b %ERROR_CODE%
