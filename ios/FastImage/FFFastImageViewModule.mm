#import "FFFastImageViewModule.h"
#import "FFFastImageSource.h"

#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImagePrefetcher.h>
#import <SDWebImage/SDWebImageDownloader.h>

@implementation FFFastImageViewModule

static NSString *const FAST_IMAGE_PROGRESS_EVENT = @"FastImagePreloadProgress";

RCT_EXPORT_MODULE(FastImageViewModule)

RCT_EXPORT_METHOD(preload:(nonnull NSArray<FFFastImageSource *> *)sources
                onComplete:(RCTResponseSenderBlock)onComplete)
{
    NSMutableArray *urls = [NSMutableArray arrayWithCapacity:sources.count];

    [sources enumerateObjectsUsingBlock:^(FFFastImageSource * _Nonnull source, NSUInteger idx, BOOL * _Nonnull stop) {
        [source.headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString* header, BOOL *stop) {
            [[SDWebImageDownloader sharedDownloader] setValue:header forHTTPHeaderField:key];
        }];
        [urls setObject:source.url atIndexedSubscript:idx];
    }];

    [[SDWebImagePrefetcher sharedImagePrefetcher] prefetchURLs:urls 
        progress:^(NSUInteger loaded, NSUInteger total) {
            [self sendEventWithName:FAST_IMAGE_PROGRESS_EVENT
                            body:@{
                                @"loaded": @(loaded),
                                @"total": @(total)
                            }];
        }
        completed:^(NSUInteger finishedCount, NSUInteger skippedCount) {
            if (onComplete) {
                onComplete(@[@(finishedCount), @(skippedCount)]);
            }
    }];
}

RCT_EXPORT_METHOD(clearMemoryCache:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [SDImageCache.sharedImageCache clearMemory];
    resolve(NULL);
}

RCT_EXPORT_METHOD(clearDiskCache:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    [SDImageCache.sharedImageCache clearDiskOnCompletion:^(){
        resolve(NULL);
    }];
}

- (NSDictionary *)constantsToExport {
  return @{@"FAST_IMAGE_PROGRESS_EVENT": FAST_IMAGE_PROGRESS_EVENT};
}

- (NSArray<NSString *> *)supportedEvents {
  return @[FAST_IMAGE_PROGRESS_EVENT];
}


#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFastImageViewModuleSpecJSI>(params);
}
#endif

@end
