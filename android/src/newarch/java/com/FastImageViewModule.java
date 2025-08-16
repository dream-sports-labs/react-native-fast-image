package com.dylanvann.fastimage;

import java.util.HashMap;
import java.util.Map;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.imagehelper.ImageSource;
import com.facebook.react.bridge.Callback;

class FastImageViewModule extends NativeFastImageViewModuleSpec {

    FastImageViewModuleImplementation impl;

    FastImageViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        impl = new FastImageViewModuleImplementation(reactContext);
    }

    @Override
    public Map<String, Object> getConstants() {
        return impl.getConstants();
    }

    @NonNull
    @Override
    public String getName() {
        return impl.REACT_CLASS;
    }

    @Override
    public void preload(final ReadableArray sources, final Callback onComplete) {
        impl.preload(sources, onComplete);
    }

    @Override
    public void clearMemoryCache(final Promise promise) {
        impl.clearMemoryCache(promise);
    }

    @Override
    public void clearDiskCache(Promise promise) {
        impl.clearDiskCache(promise);
    }

    @ReactMethod
    public void addListener(String eventName) {
        impl.addListener(eventName);
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        impl.removeListeners(count);
    }
}
