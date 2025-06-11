#import "FFFastImageViewManager.h"
#import "FFFastImageView.h"
#import "RCTConvert+FFFastImage.h"

#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImagePrefetcher.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import <RNFastImageSpec/RNFastImageSpec.h>
#endif

@implementation FFFastImageViewManager {
    dispatch_queue_t _cacheQueue;
}

- (dispatch_queue_t)cacheQueue {
    if (!_cacheQueue) {
        _cacheQueue = dispatch_queue_create("com.fastimage.cache", DISPATCH_QUEUE_SERIAL);
    }
    return _cacheQueue;
}

RCT_EXPORT_MODULE(FastImageView)

- (FFFastImageView*)view {
  return [[FFFastImageView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(source, FFFastImageSource)
RCT_EXPORT_VIEW_PROPERTY(defaultSource, UIImage)
RCT_EXPORT_VIEW_PROPERTY(resizeMode, RCTResizeMode)
RCT_EXPORT_VIEW_PROPERTY(onFastImageLoadStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastImageProgress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastImageError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastImageLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastImageLoadEnd, RCTDirectEventBlock)
RCT_REMAP_VIEW_PROPERTY(tintColor, imageColor, UIColor)

RCT_EXPORT_METHOD(preload:(nonnull NSArray<FFFastImageSource *> *)sources)
{
    NSMutableArray *urls = [NSMutableArray arrayWithCapacity:sources.count];

    [sources enumerateObjectsUsingBlock:^(FFFastImageSource * _Nonnull source, NSUInteger idx, BOOL * _Nonnull stop) {
        [source.headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString* header, BOOL *stop) {
            [[SDWebImageDownloader sharedDownloader] setValue:header forHTTPHeaderField:key];
        }];
        [urls setObject:source.url atIndexedSubscript:idx];
    }];

    [[SDWebImagePrefetcher sharedImagePrefetcher] prefetchURLs:urls];
}

RCT_EXPORT_METHOD(clearMemoryCache:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [[SDImageCache sharedImageCache] clearMemory];
    resolve(NULL);
}

RCT_EXPORT_METHOD(clearDiskCache:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [[SDImageCache sharedImageCache] clearDiskOnCompletion:^{
        resolve(NULL);
    }];
}

RCT_EXPORT_METHOD(getDiskCacheSize:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(self.cacheQueue, ^{
        @try {
            SDImageCache *cache = [SDImageCache sharedImageCache];
            NSString *cachePath = cache.diskCachePath;

            if (!cachePath || cachePath.length == 0) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    reject(@"CACHE_PATH_ERROR", @"Cache path is empty or nil", nil);
                });
                return;
            }

            NSURL *cacheURL = [NSURL fileURLWithPath:cachePath isDirectory:YES];
            NSFileManager *fileManager = [NSFileManager defaultManager];
            NSArray *keys = @[NSURLIsRegularFileKey, NSURLFileSizeKey];

            NSDirectoryEnumerator *enumerator = [
                                                 fileManager enumeratorAtURL:cacheURL
                                                 includingPropertiesForKeys:keys
                                                 ptions:NSDirectoryEnumerationSkipsHiddenFiles
                                                 errorHandler:nil
                                                ];

            unsigned long long totalSize = 0;

            for (NSURL *fileURL in enumerator) {
                @autoreleasepool {
                    NSNumber *isRegularFile = nil;
                    if ([fileURL getResourceValue:&isRegularFile forKey:NSURLIsRegularFileKey error:nil] &&
                        [isRegularFile boolValue]) {

                        NSNumber *fileSize = nil;
                        if ([fileURL getResourceValue:&fileSize forKey:NSURLFileSizeKey error:nil]) {
                            totalSize += fileSize.unsignedLongLongValue;
                        }
                    }
                }
            }

            double sizeInMB = totalSize / (1024.0 * 1024.0);

            dispatch_async(dispatch_get_main_queue(), ^{
                resolve(@{
                    @"diskCacheSizeBytes": @(totalSize),
                    @"diskCacheSizeMB": @(sizeInMB),
                });
            });

        } @catch (NSException *exception) {
            dispatch_async(dispatch_get_main_queue(), ^{
                reject(@"GET_DISK_CACHE_SIZE_ERROR",
                       [NSString stringWithFormat:@"Failed to get disk cache size: %@", exception.reason],
                       nil);
            });
        }
    });
}


- (void)dealloc {
    if (_cacheQueue) {
        _cacheQueue = nil;
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFastImageViewSpecJSI>(params);
}
#endif

@end
