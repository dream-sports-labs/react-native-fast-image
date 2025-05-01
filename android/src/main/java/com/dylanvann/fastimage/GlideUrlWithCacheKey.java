package com.dylanvann.fastimage;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.Headers;

/**
 * A GlideUrl implementation that allows specifying a custom cache key.
 */
public class GlideUrlWithCacheKey extends GlideUrl {
    private final String mCacheKey;

    public GlideUrlWithCacheKey(@NonNull String url, @NonNull Headers headers, @NonNull String cacheKey) {
        super(url, headers);
        mCacheKey = cacheKey;
    }

    @Override
    public String getCacheKey() {
        return mCacheKey;
    }
} 