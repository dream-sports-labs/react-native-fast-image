#if !defined(RCT_NEW_ARCH_ENABLED) || RCT_NEW_ARCH_ENABLED == 0

#import <React/RCTViewManager.h>

@interface FFFastImageViewManager : RCTViewManager

#else

#import <RNFastImageSpec/RNFastImageSpec.h>

@interface FFFastImageViewManager : NSObject <NativeFastImageViewSpec>

@end

#endif