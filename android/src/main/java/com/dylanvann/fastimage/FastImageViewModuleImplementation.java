package com.dylanvann.fastimage;

import android.app.Activity;
import java.io.File;

import androidx.annotation.NonNull;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.imagehelper.ImageSource;
import com.facebook.react.bridge.ReactApplicationContext;

class FastImageViewModuleImplementation {
    ReactApplicationContext reactContext;
    FastImageViewModuleImplementation(ReactApplicationContext reactContext){

    this.reactContext = reactContext;
    }

    public static final String REACT_CLASS = "FastImageView";

    private Activity getCurrentActivity(){
        return reactContext.getCurrentActivity();
    }

    public void preload(final ReadableArray sources) {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < sources.size(); i++) {
                    final ReadableMap source = sources.getMap(i);
                    final FastImageSource imageSource = FastImageViewConverter.getImageSource(activity, source);
                    if (source == null || !source.hasKey("uri") || source.getString("uri").isEmpty()) {
                            System.out.println("Source is null or URI is empty");
                            continue;
                          }
                    Glide
                            .with(activity.getApplicationContext())
                            // This will make this work for remote and local images. e.g.
                            //    - file:///
                            //    - content://
                            //    - res:/
                            //    - android.resource://
                            //    - data:image/png;base64
                            .load(
                                    imageSource.isBase64Resource() ? imageSource.getSource() :
                                    imageSource.isResource() ? imageSource.getUri() : imageSource.getGlideUrl()
                            )
                            .apply(FastImageViewConverter.getOptions(activity, imageSource, source))
                            .preload();
                }
            }
        });
    }

    public void clearMemoryCache(final Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.resolve(null);
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Glide.get(activity.getApplicationContext()).clearMemory();
                promise.resolve(null);
            }
        });
    }
    public void clearDiskCache(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.resolve(null);
            return;
        }

        Glide.get(activity.getApplicationContext()).clearDiskCache();
        promise.resolve(null);
    }

    public void getCachePath(final ReadableMap source, final Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.resolve(null);
            return;
        }

        final FastImageSource imageSource = FastImageViewConverter.getImageSource(activity, source);
        if (imageSource == null || imageSource.getUri() == null) {
            promise.resolve(null);
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    GlideUrl glideUrl = imageSource.getGlideUrl();
                    String key = glideUrl.toStringUrl();
                    File cacheFile = Glide.get(activity.getApplicationContext())
                            .getDiskCache()
                            .get(key);
                    
                    if (cacheFile != null && cacheFile.exists()) {
                        promise.resolve(cacheFile.getAbsolutePath());
                    } else {
                        promise.resolve(null);
                    }
                } catch (Exception e) {
                    promise.resolve(null);
                }
            }
        });
    }

    public void getCacheSize(final Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.resolve(0);
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    File cacheDir = Glide.get(activity.getApplicationContext())
                            .getDiskCache()
                            .getDirectory();
                    
                    long totalSize = 0;
                    if (cacheDir != null && cacheDir.exists()) {
                        File[] files = cacheDir.listFiles();
                        if (files != null) {
                            for (File file : files) {
                                if (file.isFile()) {
                                    totalSize += file.length();
                                }
                            }
                        }
                    }
                    promise.resolve(totalSize);
                } catch (Exception e) {
                    promise.resolve(0);
                }
            }
        });
    }
}
