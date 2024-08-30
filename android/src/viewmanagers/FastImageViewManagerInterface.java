/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaInterface.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReadableMap;

public interface FastImageViewManagerInterface<T extends View> {
  void setSource(T view, @Nullable ReadableMap value);
  void setDefaultSource(T view, @Nullable String value);
  void setResizeMode(T view, @Nullable String value);
  void setTintColor(T view, @Nullable Integer value);
}
