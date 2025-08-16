package com.dylanvann.fastimage;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import android.app.Activity;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.target.Target;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.imagehelper.ImageSource;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

class FastImageViewModuleImplementation {
    ReactApplicationContext reactContext;
    FastImageViewModuleImplementation(ReactApplicationContext reactContext){

    this.reactContext = reactContext;
    }

    public static final String REACT_CLASS = "FastImageViewModule";

    public static final String PROGRESS_EVENT_NAME = "FastImagePreloadProgress";


    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("FAST_IMAGE_PROGRESS_EVENT", PROGRESS_EVENT_NAME);
        return constants;
    }

    public void addListener(String eventName) {}

    public void removeListeners(Integer count) {}

    private Activity getCurrentActivity(){
        return reactContext.getCurrentActivity();
    }

    private void sendPreloadProgressEvent(int loaded, int total) {

        WritableMap eventData = Arguments.createMap();
        eventData.putInt("loaded", loaded);
        eventData.putInt("total", total);

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(PROGRESS_EVENT_NAME, eventData);
    }

    public void preload(final ReadableArray sources, final Callback onComplete) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            if (onComplete != null) {
                onComplete.invoke(0, 0);
            }
            sendPreloadProgressEvent(0, 0);
            return;
        }
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {

                final AtomicInteger remainingTasks = new AtomicInteger(sources.size());
                final AtomicInteger successfulTasks = new AtomicInteger(0);
                final AtomicInteger skippedTasks = new AtomicInteger(0);

                if (remainingTasks.get() == 0) {
                    if (onComplete != null) {
                        onComplete.invoke(0, 0);
                    }
                    sendPreloadProgressEvent(0, 0);
                    return;
                }

                for (int i = 0; i < sources.size(); i++) {
                    final ReadableMap source = sources.getMap(i);
                    final FastImageSource imageSource = FastImageViewConverter.getImageSource(activity, source);
                    if (source == null || !source.hasKey("uri") || source.getString("uri").isEmpty()) {
                        System.out.println("Source is null or URI is empty");

                        skippedTasks.incrementAndGet();

                        sendPreloadProgressEvent(successfulTasks.get()+skippedTasks.get(), sources.size());

                        if (remainingTasks.decrementAndGet() <= 0) {
                            if (onComplete != null) {
                                onComplete.invoke(successfulTasks.get(), skippedTasks.get());
                            }
                        }

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
                            .listener(new RequestListener<Drawable>() {
                                @Override
                                public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<Drawable> target, boolean isFirstResource) {
                                    skippedTasks.incrementAndGet();

                                    sendPreloadProgressEvent(successfulTasks.get()+skippedTasks.get(), sources.size());

                                    if (remainingTasks.decrementAndGet() <= 0 && onComplete != null) {
                                        onComplete.invoke(successfulTasks.get(), skippedTasks.get());
                                    }
                                    return false;
                                }

                                @Override
                                public boolean onResourceReady(Drawable resource, Object model, Target<Drawable> target, DataSource dataSource, boolean isFirstResource) {
                                    successfulTasks.incrementAndGet();

                                    sendPreloadProgressEvent(successfulTasks.get()+skippedTasks.get(), sources.size());

                                    if (remainingTasks.decrementAndGet() <= 0 && onComplete != null) {
                                        onComplete.invoke(successfulTasks.get(), skippedTasks.get());
                                    }
                                    return false;
                                }
                            })
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
}
