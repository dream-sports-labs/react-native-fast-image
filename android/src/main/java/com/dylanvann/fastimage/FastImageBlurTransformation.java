package com.dylanvann.fastimage;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.RenderEffect;
import android.graphics.Shader;
import android.os.Build;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatImageView;

import com.bumptech.glide.load.engine.bitmap_recycle.BitmapPool;
import com.bumptech.glide.load.resource.bitmap.BitmapTransformation;

import java.nio.ByteBuffer;
import java.security.MessageDigest;

public class FastImageBlurTransformation extends BitmapTransformation {

    private static final String ID = "com.dylanvann.fastimage.FastImageBlurTransformation";
    private static final byte[] ID_BYTES = ID.getBytes(CHARSET);

    private final Context context;
    private final float radius;
    private final AppCompatImageView view;

    public FastImageBlurTransformation(@NonNull Context context, float radius, AppCompatImageView view) {
        this.context = context.getApplicationContext();
        this.radius = normalizeBlurRadius(radius);
        this.view = view;
    }

    // For Android API >= 31, blur is applied using RenderEffect directly on the View.
    // For Android API < 31, blur is applied using RenderScript on the Bitmap.
    // This ensures compatibility with both legacy and future Android versions.
    @Override
    protected Bitmap transform(@NonNull BitmapPool pool, @NonNull Bitmap toTransform, int outWidth, int outHeight) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return blurWithRenderEffect(context, toTransform, radius, view);
        } else {
            return blurWithRenderScript(context, toTransform, radius);
        }
    }

    @Override
    public boolean equals(@Nullable Object o) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return false;
        }

        if (o instanceof FastImageBlurTransformation other) {
            return radius == other.radius;
        }

        return false;
    }

    @Override
    public int hashCode() {
        return ID.hashCode() + Float.valueOf(radius).hashCode();
    }

    @Override
    public void updateDiskCacheKey(@NonNull MessageDigest messageDigest) {
        messageDigest.update(ID_BYTES);
        messageDigest.update(ByteBuffer.allocate(4).putFloat(radius).array());
    }

    private Bitmap blurWithRenderEffect(Context context, Bitmap src, float radius, AppCompatImageView view) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            view.setRenderEffect(RenderEffect.createBlurEffect(radius, radius, Shader.TileMode.CLAMP));
            view.invalidate();
        }

        return src;
    }

    @SuppressWarnings("deprecation")
    private Bitmap blurWithRenderScript(Context context, Bitmap src, float radius) {
        Bitmap.Config config = src.getConfig() != null ? src.getConfig() : Bitmap.Config.ARGB_8888;
        Bitmap bitmap = src.copy(config, true);

        RenderScript rs = null;
        Allocation input = null;
        Allocation output = null;
        ScriptIntrinsicBlur blur = null;

        try {
            rs = RenderScript.create(context);
            input = Allocation.createFromBitmap(rs, bitmap);
            output = Allocation.createTyped(rs, input.getType());
            blur = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));

            blur.setRadius(radius);
            blur.setInput(input);
            blur.forEach(output);
            output.copyTo(bitmap);

        } catch (Exception e) {
            return src;
        } finally {
            if (blur != null) blur.destroy();
            if (input != null) input.destroy();
            if (output != null) output.destroy();
            if (rs != null) rs.destroy();
        }

        return bitmap;
    }

    // Clamp user-provided radius to 0.1–10.
    // Then scale to a maximum of 25 for the blur effect.
    private float normalizeBlurRadius(float radius) {
        float clamped = Math.min(10f, Math.max(0.1f, radius));
        return Math.min(25f, (clamped / 10f) * 25f);
    }
}
