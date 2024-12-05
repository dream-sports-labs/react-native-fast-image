package com.dylanvann.fastimage;

import android.util.Log;

import java.net.MalformedURLException;
import java.net.URL;

public class FastImageUrlUtils {
    private static final String TAG = "FastImageUrlUtils";

    /**
     * Extracts the file extension from a URL, ignoring query parameters.
     *
     * @param urlString The URL string to extract the extension from.
     * @return The file extension in lowercase (e.g., "gif", "avif"), or null if no extension is found.
     * @throws IllegalArgumentException if the URL is malformed or invalid.
     */
    public static String getFileExtensionFromUrl(String urlString) {
        try {
            // Parse the URL
            URL url = new URL(urlString);
            String path = url.getPath(); // Get the path part of the URL

            // Find the last period in the path
            int lastDotIndex = path.lastIndexOf('.');
            if (lastDotIndex == -1 || lastDotIndex == path.length() - 1) {
                // No extension found
                return null;
            }

            // Extract and return the extension
            return path.substring(lastDotIndex + 1).toLowerCase();
        } catch (MalformedURLException e) {
            // Handle invalid URL
            Log.e(TAG, "Malformed URL: Unable to parse URL '" + urlString + "'", e);
            return null;
        }
    }
}
