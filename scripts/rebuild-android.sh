#!/bin/bash

echo "🧹 Cleaning Android build..."
cd android
./gradlew clean
cd ..

echo "📱 Rebuilding Android app with Firebase configuration..."
eas build --platform android --clear-cache

echo "✅ Build completed! The Firebase initialization should now work properly."
echo "📋 Make sure to test push notifications on a physical device." 