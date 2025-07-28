import React, { forwardRef, memo } from 'react'
import {
    View,
    Image,
    NativeModules,
    StyleSheet,
    FlexStyle,
    LayoutChangeEvent,
    ShadowStyleIOS,
    StyleProp,
    TransformsStyle,
    ImageRequireSource,
    Platform,
    AccessibilityProps,
    ViewProps,
    ColorValue,
    ImageResolvedAssetSource,
    requireNativeComponent,
    ImageURISource,
    ImageSourcePropType,
} from 'react-native'

const isFabricEnabled = (global as any)?.nativeFabricUIManager != null
const isTurboModuleEnabled = (global as any).__turboModuleProxy != null
const FastImageViewModule = isTurboModuleEnabled
    ? require('./NativeFastImageView').default
    : NativeModules.FastImageView

const FastImageView = isFabricEnabled
    ? require('./FastImageViewNativeComponent').default
    : requireNativeComponent('FastImageView')

export type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center'

const resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
} as const

export type Priority = 'low' | 'normal' | 'high'

const priority = {
    low: 'low',
    normal: 'normal',
    high: 'high',
} as const

type Cache = 'immutable' | 'web' | 'cacheOnly'

const cacheControl = {
    // Ignore headers, use uri as cache key, fetch only if not in cache.
    immutable: 'immutable',
    // Respect http headers, no aggressive caching.
    web: 'web',
    // Only load from cache.
    cacheOnly: 'cacheOnly',
} as const

export type Source = {
    uri?: string
    headers?: { [key: string]: string }
    priority?: Priority
    cache?: Cache
}

export interface OnLoadEvent {
    nativeEvent: {
        width: number
        height: number
    }
}

export interface OnProgressEvent {
    nativeEvent: {
        loaded: number
        total: number
    }
}

export interface ImageStyle extends FlexStyle, TransformsStyle, ShadowStyleIOS {
    backfaceVisibility?: 'visible' | 'hidden'
    borderBottomLeftRadius?: number
    borderBottomRightRadius?: number
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    borderRadius?: number
    borderTopLeftRadius?: number
    borderTopRightRadius?: number
    overlayColor?: string
    opacity?: number
}

export interface FastImageProps extends AccessibilityProps, ViewProps {
    source?: Source | ImageRequireSource

    /**
     * A string representing the resource identifier for the image. Similar to
     * src from HTML.
     *
     * See https://reactnative.dev/docs/image#src
     */
    src?: string

    /**
     * A string indicating which referrer to use when fetching the resource.
     * Similar to referrerpolicy from HTML.
     *
     * See https://reactnative.dev/docs/image#referrerpolicy
     */
    referrerPolicy?:
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url'

    /**
     * Adds the CORS related header to the request.
     * Similar to crossorigin from HTML.
     *
     * See https://reactnative.dev/docs/image#crossorigin
     */
    crossOrigin?: 'anonymous' | 'use-credentials'

    /**
     * Height of the image component.
     *
     * See https://reactnative.dev/docs/image#height
     */
    height?: number

    /**
     * Width of the image component.
     *
     * See https://reactnative.dev/docs/image#width
     */
    width?: number

    defaultSource?: ImageRequireSource
    resizeMode?: ResizeMode
    fallback?: boolean

    onLoadStart?(): void

    onProgress?(event: OnProgressEvent): void

    onLoad?(event: OnLoadEvent): void

    onError?(): void

    onLoadEnd?(): void

    /**
     * onLayout function
     *
     * Invoked on mount and layout changes with
     *
     * {nativeEvent: { layout: {x, y, width, height}}}.
     */
    onLayout?: (event: LayoutChangeEvent) => void

    /**
     *
     * Style
     */
    style?: StyleProp<ImageStyle>

    /**
     * TintColor
     *
     * If supplied, changes the color of all the non-transparent pixels to the given color.
     */

    tintColor?: ColorValue

    /**
     * A unique identifier for this element to be used in UI Automation testing scripts.
     */
    testID?: string

    /**
     * Render children within the image.
     */
    children?: React.ReactNode
}

// Based on: https://github.com/facebook/react-native/blob/4718b35259135b3503033a0061ae84e15d4eb450/packages/react-native/Libraries/Image/ImageSourceUtils.js#L22
function getImageSourceFromImageProps(
    props: FastImageProps,
): Omit<ImageURISource, 'cache'> | undefined {
    const { crossOrigin, referrerPolicy, source, src, width, height } = props

    const headers: Record<string, string> = {}
    if (crossOrigin === 'use-credentials') {
        headers['Access-Control-Allow-Credentials'] = 'true'
    }
    if (referrerPolicy != null) {
        headers['Referrer-Policy'] = referrerPolicy
    }

    if (src != null) {
        return { uri: src, headers, width, height }
    }

    if (source == null) {
        return undefined
    }

    const resolvedSource = Image.resolveAssetSource(
        source as ImageSourcePropType,
    )

    if (resolvedSource?.uri && Object.keys(headers).length > 0) {
        return { ...resolvedSource, headers }
    }

    return resolvedSource
}

const resolveDefaultSource = (
    defaultSource?: ImageRequireSource,
): string | number | null => {
    if (!defaultSource) {
        return null
    }
    if (Platform.OS === 'android') {
        // Android receives a URI string, and resolves into a Drawable using RN's methods.
        const resolved = Image.resolveAssetSource(
            defaultSource as ImageRequireSource,
        )

        if (resolved) {
            return resolved.uri
        }

        return null
    }
    // iOS or other number mapped assets
    // In iOS the number is passed, and bridged automatically into a UIImage
    return defaultSource
}

function FastImageBase({
    source,
    src,
    defaultSource,
    tintColor,
    onLoadStart,
    onProgress,
    onLoad,
    onError,
    onLoadEnd,
    style,
    fallback,
    children,
    resizeMode = 'cover',
    forwardedRef,
    crossOrigin,
    referrerPolicy,
    height,
    width,
    ...props
}: FastImageProps & { forwardedRef: React.Ref<any> }) {
    const sizeProps = {
        ...(width != null && { width }),
        ...(height != null && { height }),
    }

    if (fallback) {
        const cleanedSource = { ...(source as any) }
        delete cleanedSource.cache
        const resolvedSource = Image.resolveAssetSource(cleanedSource)

        return (
            <View style={[styles.imageContainer, style]} ref={forwardedRef}>
                <Image
                    {...props}
                    style={[StyleSheet.absoluteFill, sizeProps, { tintColor }]}
                    source={resolvedSource}
                    defaultSource={defaultSource}
                    onLoadStart={onLoadStart}
                    onProgress={onProgress}
                    onLoad={onLoad as any}
                    onError={onError}
                    onLoadEnd={onLoadEnd}
                    resizeMode={resizeMode}
                />
                {children}
            </View>
        )
    }

    // @ts-ignore non-typed property
    const FABRIC_ENABLED = !!global?.nativeFabricUIManager

    // this type differs based on the `source` prop passed
    const resolvedSource = getImageSourceFromImageProps({
        ...props,
        source,
        src,
        crossOrigin,
        referrerPolicy,
        height,
        width,
    }) as ImageResolvedAssetSource & { headers: any }

    let modifiedSource = resolvedSource
    if (
        resolvedSource?.headers &&
        (FABRIC_ENABLED || Platform.OS === 'android')
    ) {
        // we do it like that to trick codegen
        const headersArray: { name: string; value: string }[] = []
        Object.keys(resolvedSource.headers).forEach((key) => {
            headersArray.push({ name: key, value: resolvedSource.headers[key] })
        })
        modifiedSource = { ...resolvedSource, headers: headersArray }
    }

    const resolvedDefaultSource = resolveDefaultSource(defaultSource)
    const resolvedDefaultSourceAsString =
        resolvedDefaultSource !== null ? String(resolvedDefaultSource) : null

    return (
        <View
            style={[styles.imageContainer, style, sizeProps]}
            ref={forwardedRef}
        >
            <FastImageView
                {...props}
                tintColor={tintColor}
                style={StyleSheet.absoluteFill}
                source={modifiedSource}
                defaultSource={resolvedDefaultSourceAsString}
                onFastImageLoadStart={onLoadStart}
                onFastImageProgress={onProgress}
                onFastImageLoad={onLoad}
                onFastImageError={onError}
                onFastImageLoadEnd={onLoadEnd}
                resizeMode={resizeMode}
            />
            {children}
        </View>
    )
}

const FastImageMemo = memo(FastImageBase)

const FastImageComponent: React.ComponentType<FastImageProps> = forwardRef(
    (props: FastImageProps, ref: React.Ref<any>) => (
        <FastImageMemo forwardedRef={ref} {...props} />
    ),
)

FastImageComponent.displayName = 'FastImage'

export interface FastImageStaticProperties {
    resizeMode: typeof resizeMode
    priority: typeof priority
    cacheControl: typeof cacheControl
    preload: (sources: Source[]) => void
    clearMemoryCache: () => Promise<void>
    clearDiskCache: () => Promise<void>
}

const FastImage: React.ComponentType<FastImageProps> &
    FastImageStaticProperties = FastImageComponent as any

FastImage.resizeMode = resizeMode

FastImage.cacheControl = cacheControl

FastImage.priority = priority

FastImage.preload = (sources: Source[]) => FastImageViewModule.preload(sources)

FastImage.clearMemoryCache = () => FastImageViewModule.clearMemoryCache()

FastImage.clearDiskCache = () => FastImageViewModule.clearDiskCache()

const styles = StyleSheet.create({
    imageContainer: {
        overflow: 'hidden',
    },
})

export default FastImage
