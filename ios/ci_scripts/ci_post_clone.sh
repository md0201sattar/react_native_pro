#!/bin/sh

brew install node

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
export NO_FLIPPER=1
# Install CocoaPods using Homebrew.
brew install cocoapods

npm install --global yarn

cd ../..

yarn

cd ios

# Install dependencies you manage with CocoaPods.
pod install