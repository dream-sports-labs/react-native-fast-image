# Removing `MyAppGlideModule` from `@d11/react-native-fast-image`

If you’re using Glide within your application using an `AppGlideModule` then you’ll need to prevent the inclusion of the `AppGlideModule` in this package.

To accomplish this you can add this to your `android/build.gradle`:

```gradle
project.ext {
    excludeAppGlideModule = true
}
```