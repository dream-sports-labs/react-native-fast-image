### ⚠️ This is a fork of [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image). All credit goes to the original author.

<h1 align="center">
  🚩 FastImage
</h1>

<div align="center">

Performant React Native image component.

[![Version][version-badge]][package]
[![Downloads][downloads-badge]][npmtrends]
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

</div>

<p align="center" >
  <kbd>
    <img
      src="https://github.com/dream-sports-labs/react-native-fast-image/blob/main/docs/assets/scroll.gif?raw=true"
      title="Scroll Demo"
      float="left"
    >
  </kbd>
  <kbd>
    <img
      src="https://github.com/dream-sports-labs/react-native-fast-image/blob/main/docs/assets/priority.gif?raw=true"
      title="Priority Demo"
      float="left"
    >
  </kbd>
  <br>
  <em>FastImage example app.</em>
</p>

React Native’s `Image` component handles image caching like browsers for the most part.

If the server is returning proper cache control headers for images you’ll generally get the sort of built in caching behavior you’d have in a browser.

Even so, many people have noticed:

- flickering,
- cache misses,
- low performance loading from cache, and
- low performance in general.

`FastImage` is an `Image` replacement that solves these issues.

`FastImage` is a wrapper around [SDWebImage (iOS)](https://github.com/rs/SDWebImage) and [Glide (Android)](https://github.com/bumptech/glide).

## Features

- [x] Aggressively cache images.
- [x] Add authorization headers.
- [x] Prioritize images.
- [x] Preload images.
- [x] GIF support.
- [x] Border radius.

## Usage

**Note: You must be using React Native 0.60.0 or higher to use the most recent version of `@d11/react-native-fast-image`.**

```bash
yarn add @d11/react-native-fast-image
cd ios && pod install
```

```jsx
import FastImage from "@d11/react-native-fast-image";
import * as React from "react";

const YourImage = (): React.ReactNode => (
  <FastImage
    resizeMode={FastImage.resizeMode.contain}
    style={{ height: 200, width: 200 }}
    source={{
      headers: { Authorization: "someAuthToken" },
      priority: FastImage.priority.normal,
      uri: "https://unsplash.it/400/400?image=1",
    }}
  />
);
```

## Are you using Glide already using an `AppGlideModule`?

- [Are you using Glide already using an `AppGlideModule`?](docs/app-glide-module.md) (you might have problems if you don'’t read this)

## Are you using ProGuard?

If you use [ProGuard](https://www.guardsquare.com/proguard) you’ll need to add these lines to `android/app/proguard-rules.pro`:

```pro
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
```

## Properties

### `source?: object`

Source for the remote image to load.

---

### `source.uri?: string`

Remote url to load the image from, e.g. `"https://unsplash.it/400/400?image=1"`.

---

### `source.headers?: Object`

Headers to load the image with, e.g. `{ Authorization: "someAuthToken" }`.

---

### `source.priority?: Priorities`

-   `FastImage.priority.low` – Low Priority.
-   `FastImage.priority.normal` **(Default)** – Normal Priority.
-   `FastImage.priority.high` – High Priority.

---

### `source.cache?: CacheControls`

-   `FastImage.cacheControl.immutable` – **(Default)** - Only updates if url changes.
-   `FastImage.cacheControl.web` – Use headers and follow normal caching procedures.
-   `FastImage.cacheControl.cacheOnly` – Only show images from cache, do not make any network requests.

---

### `defaultSource?: number`

-   An asset loaded with `require()` or `import`.
-   Note that like the built-in `Image` implementation, on Android `defaultSource` does not work in debug mode. This is due to the fact that assets are sent from the dev server, but RN’s functions only know how to load it from `res`.

---

### `resizeMode?: ResizeModes`

-   `FastImage.resizeMode.contain` – Scale the image uniformly (maintain the image's aspect ratio) so that both dimensions (width and height) of the image will be equal to or less than the corresponding dimension of the view (minus padding).
-   `FastImage.resizeMode.cover` **(Default)** – Scale the image uniformly (maintain the image's aspect ratio) so that both dimensions (width and height) of the image will be equal to or larger than the corresponding dimension of the view (minus padding).
-   `FastImage.resizeMode.stretch` – Scale width and height independently, This may change the aspect ratio of the src.
-   `FastImage.resizeMode.center` – Do not scale the image, keep centered.

---

### `onLoadStart?: () => void`

Called when the image starts to load.

---

### `onProgress?: (event: OnProgressEvent) => void`

Called when the image is loading.

```tsx
onProgress={event => console.log(event.nativeEvent.loaded, event.nativeEvent.total)}
```

---

### `onLoad?: (event: OnLoadEvent) => void`

Called on a successful image fetch. Called with the width and height of the loaded image.

```jsx
onLoad={event => console.log(event.nativeEvent.width, event.nativeEvent.height)}
```

---

### `onError?: () => void`

Called on an image fetching error or when source is malformed, i.e., empty or `null`.

---

### `onLoadEnd?: () => void`

Called when the image finishes loading, whether it was successful or an error.

---

### `style?: ViewStyle`

A React Native style. Supports using `borderRadius`.

---

### `fallback?: boolean`

If `true` it will fallback to using `Image`. The image will still be styled and laid out the same way as `FastImage`.

---

### `tintColor?: number | string`

If supplied, changes the color of all the non-transparent pixels to the given color.

---

### `testID?: string`

Optional ID for testing, e.g., via [`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer).

## Static Methods

### `FastImage.preload: (source[]) => void`

Preload images to display later.

```tsx
FastImage.preload([
  {
    uri: "https://unsplash.it/400/400?image=1",
    headers: { Authorization: "someAuthToken" },
  },
])
```

### `FastImage.clearMemoryCache: () => Promise<void>`

Clear all images from memory cache.

### `FastImage.clearDiskCache: () => Promise<void>`

Clear all images from disk cache.

## Troubleshooting

If you have any problems using this library try the steps in [troubleshooting](docs/troubleshooting.md) and see if they fix it.

## Development

[Follow these instructions to get the example app running.](docs/development.md)

## Supported React Native Versions

This project only aims to support the latest version of React Native. This simplifies the development and the testing of the project.

If you require new features or bug fixes for older versions you can fork this project.

## Credits

The idea for this modules came from [vovkasm’s](https://github.com/vovkasm) [react-native-web-image](https://github.com/vovkasm/react-native-web-image) package.

It also uses Glide and SDWebImage, but didn’t have some features I needed (priority, headers).

Thanks to [@mobinni](https://github.com/mobinni) for helping with the conceptualization.

## Licenses

- FastImage – MIT © [DreamSportsLabs](https://github.com/dream-sports-labs/)
- SDWebImage – MIT
- Glide – BSD, part MIT and Apache 2.0. See the [LICENSE](https://github.com/bumptech/glide/blob/master/LICENSE) file for details.

[build-badge]: https://github.com/dream-sports-labs/react-native-fast-image/workflows/CI/badge.svg
[build]: https://github.com/dream-sports-labs/react-native-fast-image/actions?query=workflow%3ACI
[coverage-badge]: https://img.shields.io/codecov/c/github/dream-sports-labs/react-native-fast-image.svg
[coverage]: https://codecov.io/github/dream-sports-labs/react-native-fast-image
[downloads-badge]: https://img.shields.io/npm/dm/react-native-fast-image.svg
[npmtrends]: http://www.npmtrends.com/@d11/react-native-fast-image
[package]: https://www.npmjs.com/package/@d11/react-native-fast-image
[version-badge]: https://img.shields.io/npm/v/@d11/react-native-fast-image.svg
[twitter]: https://twitter.com/home?status=Check%20out%20react-native-fast-image%20by%20%40atomarranger%20https%3A//github.com/dream-sports-labs/react-native-fast-image
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/dream-sports-labs/react-native-fast-image.svg?style=social
[github-watch-badge]: https://img.shields.io/github/watchers/dream-sports-labs/react-native-fast-image.svg?style=social
[github-watch]: https://github.com/dream-sports-labs/react-native-fast-image/watchers
[github-star-badge]: https://img.shields.io/github/stars/dream-sports-labs/react-native-fast-image.svg?style=social
[github-star]: https://github.com/dream-sports-labs/react-native-fast-image/stargazers
