Thanks for submitting a pull request! We appreciate you spending the time to work on these changes. Please provide enough information so that others can review your pull request. The three fields below are mandatory.

## Summary:

Explain the **motivation** for making this change. What existing problem does the pull request solve?

Example: This PR improves cache handling for FastImage by implementing proper invalidation when source URLs change with the same cache key. This solves the issue where stale images would continue to display after content updates.

## Changelog:

Help reviewers and the release process by writing your own changelog entry.

Pick one each for the category and type tags:

[ANDROID|GENERAL|IOS|INTERNAL] [BREAKING|ADDED|CHANGED|DEPRECATED|REMOVED|FIXED|SECURITY] - Message

Example: 
- [ANDROID] [FIXED] - Fixed memory leak when rapidly changing FastImage sources

## Test Plan:

Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes the user interface.

Example:
- Tested image loading with PNG, JPEG, GIF formats
- Verified cache behavior with `FastImage.preload()` 
- Tested on iOS 14 and Android 10
- Command: `cd example && yarn ios/android`