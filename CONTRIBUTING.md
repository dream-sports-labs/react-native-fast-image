# Contributing to @d11/react-native-fast-image

Thank you for considering contributing to `@d11/react-native-fast-image`! This document outlines the process for contributing to this project and how to get started as a contributor.

## Code of Conduct

We expect all contributors to follow our [code of conduct](CODE_OF_CONDUCT.md). Please be respectful and considerate of others when contributing to this project.

## Getting Started

### Fork and Clone the Repository

1. Fork the repository on GitHub by clicking the "Fork" button at the top right of the repository page.
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/react-native-fast-image.git
cd react-native-fast-image
```
3. Add the upstream repository as a remote:
```bash
git remote add upstream https://github.com/dream-sports-labs/react-native-fast-image.git
```

### Development Environment Setup

To set up your development environment:

```bash
# Verify Yarn version (should be 3.6.4)
yarn -v
```

### Running the Example App

The repository includes an example app and a server to test your changes:

#### 1. Start the Example Server:
```bash
# Navigate to the server directory
cd ReactNativeFastImageExampleServer

# Install server dependencies
yarn

# Start the server
yarn start
```

#### 2. Run the Example App:

In a new terminal:

```bash
# Navigate to the example app directory
cd ReactNativeFastImageExample

# Install dependencies
yarn

# For Android:
yarn android

# For iOS:
cd ios
bundle install
bundle exec pod install
cd ..
yarn ios
```

## Making Changes

1. Create a new branch from the main branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and ensure they follow the project's code style (use `yarn lint` to check).

3. Write tests for your changes if applicable:
```bash
yarn test
```

## Submitting Changes

1. Commit your changes with a descriptive commit message:
```bash
git commit -m "Add feature: description of your changes"
```

2. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

3. Create a pull request from your fork to the original repository:
   - Go to the [original repository](https://github.com/dream-sports-labs/react-native-fast-image)
   - Click "Pull Requests" and then "New Pull Request"
   - Click "compare across forks" and select your fork and branch
   - Click "Create Pull Request"

4. Fill in the pull request template with details about your changes.

## Signing the CLA (Contributor License Agreement)

Before your contribution can be accepted, you will need to sign our Contributor License Agreement (CLA). The CLA bot will automatically comment on your PR with instructions when you create it.

## Review and address feedback

Keep an eye on any comments and review feedback left on your pull request on GitHub. Maintainers will do their best to provide constructive, actionable feedback to help get your changes ready to be merged into the @d11/react-native-fast-image repository.