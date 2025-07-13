package com.dylanvann.fastimage;

import android.app.Activity;
import android.content.Context;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.cache.DiskCache;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class FastImageViewModuleImplementation {
    ReactApplicationContext reactContext;
    private ExecutorService cacheExecutor;
    
    FastImageViewModuleImplementation(ReactApplicationContext reactContext){
        this.reactContext = reactContext;
    }

    private synchronized ExecutorService getCacheExecutor() {
        if (cacheExecutor == null) {
            cacheExecutor = Executors.newSingleThreadExecutor();
        }
        return cacheExecutor;
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

    public void getDiskCacheSize(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("GET_DISK_CACHE_SIZE_ERROR", "Activity is null");
            return;
        }

        getCacheExecutor().execute(() -> {
            try {
                Context context = activity.getApplicationContext();
                File cacheDir = new File(context.getCacheDir(), DiskCache.Factory.DEFAULT_DISK_CACHE_DIR);

                long totalSize = cacheDir.exists() ? calculateDirectorySize(cacheDir) : 0;
                double sizeInMB = totalSize / (1024.0 * 1024.0);

                WritableMap result = Arguments.createMap();
                result.putDouble("diskCacheSizeBytes", totalSize);
                result.putDouble("diskCacheSizeMB", sizeInMB);
                
                promise.resolve(result);
            } catch (Exception e) {
                promise.reject("GET_DISK_CACHE_SIZE_ERROR", "Failed to get disk cache size: " + e.getMessage(), e);
            }
        });
    }

    // Helper method to calculate directory size
    private long calculateDirectorySize(File directory) {
        long totalSize = 0;
        if (directory == null || !directory.exists()) return 0;

        Deque<File> stack = new ArrayDeque<>();
        stack.push(directory);

        while (!stack.isEmpty()) {
            File current = stack.pop();

            if (current.isFile()) {
                totalSize += current.length();
            } else {
                File[] files = current.listFiles();
                if (files != null) {
                    for (File file : files) {
                        stack.push(file);
                    }
                }
            }
        }

        return totalSize;
    }

}
