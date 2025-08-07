#ifdef RCT_NEW_ARCH_ENABLED

#import <RNFastImageSpec/RNFastImageSpec.h>

@interface FFFastImageViewModule : NSObject <NativeFastImageViewModuleSpec>

#else

#import <React/RCTBridgeModule.h>

@interface FFFastImageViewModule : NSObject <RCTBridgeModule>

#endif

@end