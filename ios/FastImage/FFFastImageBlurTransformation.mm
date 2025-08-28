#import "FFFastImageBlurTransformation.h"
#import <CoreImage/CoreImage.h>

@implementation FFFastImageBlurTransformation

- (instancetype)initWithRadius:(CGFloat)radius {
    self = [super init];
    if (self) {
        _radius = [self normalizeBlurRadius:radius];
    }
    return self;
}

- (UIImage *)transform:(UIImage *)image {
    CIContext *context = [CIContext contextWithOptions:nil];
    CIImage *input = [CIImage imageWithCGImage:image.CGImage];

    CIFilter *filter = [CIFilter filterWithName:@"CIGaussianBlur"];
    [filter setValue:input forKey:kCIInputImageKey];
    [filter setValue:@(_radius) forKey:kCIInputRadiusKey];
    CIImage *output = filter.outputImage;

    if (output) {
        CGFloat w = image.size.width;
        CGFloat h = image.size.height;
        
        // Crop edges to remove extra blur caused by the radius.
        CGRect rect = CGRectMake(_radius * 2, _radius * 2, w - _radius * 4, h - _radius * 4);
        CGImageRef outputRef = [context createCGImage:output fromRect:rect];
        if (outputRef) {
            UIImage *outputBlurred = [UIImage imageWithCGImage:outputRef];
            CGImageRelease(outputRef);
            return outputBlurred;
        }
    }

    return image;
}

// Clamp user-provided radius to 0.1–10.
// Then scale to a maximum of 25 for the blur effect.
- (CGFloat)normalizeBlurRadius:(CGFloat)radius {
    CGFloat clamped = fmax(0.1, fmin(radius, 10.0));
    return fmin(25.0, ((clamped / 10.0) * 25.0) / 2.5);
}

@end
