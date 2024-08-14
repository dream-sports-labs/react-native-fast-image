# How is caching handled?

In the readme it says “Aggressively cache images.” What does that mean?

This library treats image URLs as immutable. That means it assumes the data located at a given URL will not change. This is ideal for performance.

The way this would work in practice for something like a user profile picture is:

1. Request user from API.
1. Receive JSON representing the user containing a `profilePicture` property that is the URL of the profile picture.
1. Display the profile picture.

So what happens if the user wants to change their profile picture?

1. User uploads a new profile picture, it gets a new URL on the backend.
1. Update a field in a database.

Next time the app is opened:

1. Display the cached profile picture immediately.
1. Request the user JSON again (this time it will have the new profile picture URL).
1. Display the new profile picture.

## How is the cache cleared?

As the app is used the cache fills up. When the cache reaches its maximum size the least frequently used images will be purged from the cache. You generally don’t need to manually manage the cache.
