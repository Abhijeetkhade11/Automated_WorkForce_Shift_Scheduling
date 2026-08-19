#!/bin/sh
# ----------------------------------------------------------------------------
# Maven Wrapper startup shell script for Unix
# ----------------------------------------------------------------------------

WRAPPER_JAR="$(dirname "$0")/.mvn/wrapper/maven-wrapper.jar"
WRAPPER_PROPERTIES="$(dirname "$0")/.mvn/wrapper/maven-wrapper.properties"

# Ensure wrapper jar is downloaded
if [ ! -f "$WRAPPER_JAR" ]; then
    echo "Downloading Maven wrapper jar..."
    mkdir -p "$(dirname "$WRAPPER_JAR")"
    if command -v curl >/dev/null 2>&1; then
        curl -sSLo "$WRAPPER_JAR" https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
    elif command -v wget >/dev/null 2>&1; then
        wget -qO "$WRAPPER_JAR" https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
    else
        echo "ERROR: Could not find curl or wget to download Maven wrapper."
        exit 1
    fi
fi

# Locate java
if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
else
    JAVACMD="java"
fi

if ! command -v "$JAVACMD" >/dev/null 2>&1; then
    echo "ERROR: java command not found. Please install Java or set JAVA_HOME."
    exit 1
fi

exec "$JAVACMD" -classpath "$WRAPPER_JAR" org.apache.maven.wrapper.MavenWrapperMain "$@"
