package com.dylanvann.fastimage;

import android.content.Context;
import android.content.res.Resources;
import android.net.Uri;
import android.text.TextUtils;

import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.Headers;

import javax.annotation.Nullable;

public class FastImageSource {
    private static final String DATA_SCHEME = "data";
    private static final String LOCAL_RESOURCE_SCHEME = "res";
    private static final String ANDROID_RESOURCE_SCHEME = "android.resource";
    private static final String ANDROID_CONTENT_SCHEME = "content";
    private static final String LOCAL_FILE_SCHEME = "file";
    private final String mSource;
    private final double mWidth;
    private final double mHeight;
    private final Headers mHeaders;
    private Uri mUri;

    public static boolean isBase64Uri(Uri uri) {
        return DATA_SCHEME.equals(uri.getScheme());
    }

    public static boolean isLocalResourceUri(Uri uri) {
        return LOCAL_RESOURCE_SCHEME.equals(uri.getScheme());
    }

    public static boolean isResourceUri(Uri uri) {
        return ANDROID_RESOURCE_SCHEME.equals(uri.getScheme());
    }

    public static boolean isContentUri(Uri uri) {
        return ANDROID_CONTENT_SCHEME.equals(uri.getScheme());
    }

    public static boolean isLocalFileUri(Uri uri) {
        return LOCAL_FILE_SCHEME.equals(uri.getScheme());
    }

    public FastImageSource(Context context, String source) {
        this(context, source, null, 0.0d, 0.0d);
    }

    public FastImageSource(Context context, String source, @Nullable Headers headers) {
        this(context, source, headers, 0.0d, 0.0d);
    }

    public FastImageSource(Context context, String source, @Nullable Headers headers, double width, double height) {
        mSource = source;
        mWidth = width;
        mHeight = height;
        mHeaders = headers == null ? Headers.DEFAULT : headers;

        mUri = Uri.parse(source);
        if (isResource() && TextUtils.isEmpty(mUri.toString())) {
                throw new Resources.NotFoundException("Local Resource Not Found. Resource: '" + source + "'.");
        }

        if (isLocalResourceUri(mUri)) {
            // Convert res:/ scheme to android.resource:// so
            // glide can understand the uri.
            mUri = Uri.parse(mUri.toString().replace("res:/", ANDROID_RESOURCE_SCHEME + "://" + context.getPackageName() + "/"));
        }
    }


    public boolean isBase64Resource() {
        return mUri != null && FastImageSource.isBase64Uri(mUri);
    }

    public boolean isResource() {
        return mUri != null && FastImageSource.isResourceUri(mUri);
    }

    public boolean isLocalFile() {
        return mUri != null && FastImageSource.isLocalFileUri(mUri);
    }

    public boolean isContentUri() {
        return mUri != null && FastImageSource.isContentUri(mUri);
    }

    public Object getSourceForLoad() {
        if (isContentUri() || isBase64Resource()) {
            return mSource;
        }
        if (isResource()) {
            return getUri();
        }
        if (isLocalFile()) {
            return getUri().toString();
        }
        return getGlideUrl();
    }

    public Uri getUri() {
        if (mUri == null) {
                throw new IllegalStateException("URI is null for the source: " + mSource);
        }
        return mUri;
    }

    public Headers getHeaders() {
        return mHeaders;
    }

    public GlideUrl getGlideUrl() {
        return new GlideUrl(getUri().toString(), getHeaders());
    }

    public String getSource() {
        return mSource;
    }

    public double getWidth() {
        return mWidth;
    }

    public double getHeight() {
         return mHeight;
    }
}
