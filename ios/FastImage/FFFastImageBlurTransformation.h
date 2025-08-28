#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface FFFastImageBlurTransformation : NSObject

@property (nonatomic, readonly) CGFloat radius;

- (instancetype)initWithRadius:(CGFloat)radius;
- (UIImage *)transform:(UIImage *)image;

@end
