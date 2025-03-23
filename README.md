# Heladeria App - React Native Web

This project is a cross-platform application for an ice cream shop, built with React Native Web. It allows the app to run on both web and mobile platforms (iOS and Android) with a shared codebase.

## Features

- Browse ice cream products by categories and subcategories
- View product details
- Add products to cart with quantity selection
- Customer selection
- Order confirmation
- Payment processing
- Smooth screen transitions with native animations

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- For iOS: macOS, Xcode
- For Android: Android Studio, Android SDK

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Running the App

### Web

To run the app in the web browser:

```bash
npm run start:web
# or
yarn start:web
```

This will start the app at http://localhost:3000

### Android

To run the app on an Android device or emulator:

```bash
npm run start:android
# or
yarn start:android
```

Make sure you have an Android emulator running or a device connected.

### iOS

To run the app on an iOS simulator:

```bash
npm run start:ios
# or
yarn start:ios
```

This requires macOS and Xcode installed.

## Project Structure

- `/src`: Source code
  - `/assets`: Images and other static assets
  - `/components`: Reusable UI components
  - `/context`: React Context for state management
  - `/data`: Mock data for the app
  - `/models`: TypeScript type definitions
  - `/screens`: Screen components for React Native
  - `/pages`: Page components for web
  - `/styles`: CSS styles for web

## Technology Stack

- React / React Native
- React Native Web
- React Navigation
- TypeScript
- React Context API for state management

## Animation and Transitions

### Mobile (React Native)
The app uses React Navigation's built-in animation capabilities to provide smooth transitions between screens:

- Horizontal slide transitions for most screen navigations
- Fade-in from bottom for quantity selection screen
- Modal-style presentation for payment screen
- Gesture-enabled navigation (swipe to go back)

These animations are optimized using the native driver for better performance on mobile devices, resulting in smoother transitions with no stuttering.

### Web
For the web version, the app uses Framer Motion to create fluid, direction-aware transitions:

- Direction-aware animations that slide in from the right when moving forward in the flow and from the left when going back
- Custom animations for specific screens:
  - Product detail pages slide in vertically
  - Quantity selection slides up from the bottom
  - Payment screen uses a subtle 3D rotation effect
- Spring physics for natural, responsive motion
- Hardware-accelerated animations with CSS transforms

The web animations are enhanced with 3D perspective, backface visibility, and will-change optimizations for smooth performance across browsers.

## Building for Production

### Web

```bash
npm run build
# or
yarn build
```

This will create a production build in the `build` folder.

### Mobile

For mobile builds, refer to the React Native documentation for generating APK/AAB (Android) or IPA (iOS) files.
