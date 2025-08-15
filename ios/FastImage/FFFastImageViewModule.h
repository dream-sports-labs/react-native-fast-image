#ifdef RCT_NEW_ARCH_ENABLED

#import <RNFastImageSpec/RNFastImageSpec.h>

@interface FFFastImageViewModule : NSObject <NativeFastImageViewModuleSpec>

#else

#import <React/RCTEventEmitter.h>

@interface FFFastImageViewModule : RCTEventEmitter

#endif

@end
