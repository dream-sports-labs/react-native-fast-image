# Development

This is how to start the example app so you can test code with it.

```bash
Make sure you’re running on node 18+ and Java 21 
# This package Using Yarn 3.6.4
corepack enable

# Check (Should return 3.6.4)
yarn -v 
 
# If version listed is not 3.6.4  
corepack prepare yarn@3.6.4 --activate

# In the repo root folder.
# Install dependencies.
yarn

# Android
yarn example android

# iOS
# Install pod dependency
cd ReactNativeFastImageExample/ios
bundle install
pod install

# Go to root folder
cd ../..
yarn example ios
```
