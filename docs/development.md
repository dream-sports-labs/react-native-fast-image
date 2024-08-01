# Development

This is how to start the example app so you can test code with it.

```bash
Make sure you are running on  node 18+ and java 21 
# This package Using Yarn3.6.4
corepack enable

# check (Should return 3.6.4)
 yarn -v 
 
# If version listed is not 3.6.4  
corepack prepare yarn@3.6.4 --activate

# In the repo root folder.
# Install dependencies.
yarn

# Android
yarn example android

# IOS
# Install pod dependency
cd ReactNativeFastImageExample/ios
bundle install
pod install


# Got to root folder
cd ../..
yarn example ios
```
