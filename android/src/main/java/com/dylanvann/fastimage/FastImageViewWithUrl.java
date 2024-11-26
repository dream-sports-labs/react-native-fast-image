package com.dylanvann.fastimage;

import static com.dylanvann.fastimage.FastImageRequestListener.REACT_ON_ERROR_EVENT;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull; // Import NonNull annotation
import androidx.appcompat.widget.AppCompatImageView;

import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.RequestManager;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.request.Request;
import com.bumptech.glide.load.resource.bitmap.BitmapTransformation;
import com.bumptech.glide.load.engine.bitmap_recycle.BitmapPool;
import com.bumptech.glide.load.Transformation;
import com.bumptech.glide.integration.webp.decoder.WebpDrawable;
import com.bumptech.glide.integration.webp.decoder.WebpDrawableTransformation;
import com.facebook.react.bridge.ReadableMap;
import com.dylanvann.fastimage.events.FastImageErrorEvent;
import com.dylanvann.fastimage.events.FastImageLoadStartEvent;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

class FastImageViewWithUrl extends AppCompatImageView {
    private boolean mNeedsReload = false;
    private ReadableMap mSource = null;
    private Drawable mDefaultSource = null;
    public GlideUrl glideUrl;

    public FastImageViewWithUrl(Context context) {
        super(context);
    }

    public void setSource(@Nullable ReadableMap source) {
        mNeedsReload = true;
        mSource = source;
    }

    public void setDefaultSource(@Nullable Drawable source) {
        mNeedsReload = true;
        mDefaultSource = source;
    }

    private boolean isNullOrEmpty(final String url) {
        return url == null || url.trim().isEmpty();
    }

    @SuppressLint("CheckResult")
    public void onAfterUpdate(
            @NonNull FastImageViewManager manager,  // Corrected to @NonNull
            @Nullable RequestManager requestManager,
            @NonNull Map<String, List<FastImageViewWithUrl>> viewsForUrlsMap) {
        if (!mNeedsReload)
            return;

        if ((mSource == null ||
                !mSource.hasKey("uri") ||
                isNullOrEmpty(mSource.getString("uri"))) &&
                mDefaultSource == null) {

            // Cancel existing requests.
            clearView(requestManager);

            if (glideUrl != null) {
                FastImageOkHttpProgressGlideModule.forget(glideUrl.toStringUrl());
            }

            // Clear the image.
            setImageDrawable(null);

            ThemedReactContext context = (ThemedReactContext) getContext();
            EventDispatcher dispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, getId());
            int surfaceId = UIManagerHelper.getSurfaceId(this);
            FastImageErrorEvent event = new FastImageErrorEvent(surfaceId, getId(), mSource);
            if (dispatcher != null) {
                dispatcher.dispatchEvent(event);
            }
            return;
        }

        //final GlideUrl glideUrl = FastImageViewConverter.getGlideUrl(view.getContext(), mSource);
        final FastImageSource imageSource = FastImageViewConverter.getImageSource(getContext(), mSource);

        if (imageSource != null && imageSource.getUri().toString().length() == 0) {
            ThemedReactContext context = (ThemedReactContext) getContext();
            EventDispatcher dispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, getId());
            int surfaceId = UIManagerHelper.getSurfaceId(this);
            FastImageErrorEvent event = new FastImageErrorEvent(surfaceId, getId(), mSource);

            if (dispatcher != null) {
                dispatcher.dispatchEvent(event);
            }
            // Cancel existing requests.
            clearView(requestManager);

            if (glideUrl != null) {
                FastImageOkHttpProgressGlideModule.forget(glideUrl.toStringUrl());
            }
            // Clear the image.
            setImageDrawable(null);
            return;
        }

        // `imageSource` may be null and we still continue, if `defaultSource` is not null
        final GlideUrl glideUrl = imageSource == null ? null : imageSource.getGlideUrl();

        // Cancel existing request.
        this.glideUrl = glideUrl;
        clearView(requestManager);

        String key = glideUrl == null ? null : glideUrl.toStringUrl();

        if (glideUrl != null) {
            FastImageOkHttpProgressGlideModule.expect(key, manager);
            List<FastImageViewWithUrl> viewsForKey = viewsForUrlsMap.get(key);
            if (viewsForKey != null && !viewsForKey.contains(this)) {
                viewsForKey.add(this);
            } else if (viewsForKey == null) {
                List<FastImageViewWithUrl> newViewsForKeys = new ArrayList<>(Collections.singletonList(this));
                viewsForUrlsMap.put(key, newViewsForKeys);
            }
        }

        ThemedReactContext context = (ThemedReactContext) getContext();
        if (imageSource != null) {
            // This is an orphan even without a load/loadend when only loading a placeholder
            // This is an orphan event without a load/loadend when only loading a placeholder
            EventDispatcher dispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, getId());
            int surfaceId = UIManagerHelper.getSurfaceId(this);
            FastImageLoadStartEvent event = new FastImageLoadStartEvent(surfaceId, getId());

            if (dispatcher != null) {
                dispatcher.dispatchEvent(event);
            }
        }

        Transformation<Bitmap> transformation = new BitmapTransformation() {
            @Override
            protected Bitmap transform(@NonNull BitmapPool pool, @NonNull Bitmap toTransform, int outWidth, int outHeight) {
                return toTransform;
            }

            @Override
            public void updateDiskCacheKey(@NonNull MessageDigest messageDigest) {
            }
        };

        if (requestManager != null) {
            RequestBuilder<Drawable> builder =
                    requestManager
                            .load(imageSource == null ? null : imageSource.getSourceForLoad())
                            .optionalTransform(transformation) // Apply identity transformation
                            .optionalTransform(WebpDrawable.class, new WebpDrawableTransformation(transformation))
                            .apply(FastImageViewConverter
                                    .getOptions(context, imageSource, mSource)
                                    .placeholder(mDefaultSource) // show until loaded
                                    .fallback(mDefaultSource)); // null will not be treated as error

            if (key != null)
                builder.listener(new FastImageRequestListener(key));

            builder.into(this);
        }
    }

    public void clearView(@Nullable RequestManager requestManager) {
        if (requestManager != null && getTag() != null && getTag() instanceof Request) {
            requestManager.clear(this);
        }
    }
}
