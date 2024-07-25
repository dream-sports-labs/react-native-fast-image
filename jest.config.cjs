module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        '<rootDir>/jest.setup.js',
    ],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/','/dist/','/.rollup.cache/'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    coveragePathIgnorePatterns: [
        'ReactNativeFastImageExample*',
        'ReactNativeFastImageExampleServer*',
         '/node_modules/', '/.rollup.cache/','/dist/' // Ignore dist folder for coverage

],
    modulePathIgnorePatterns: [
        'ReactNativeFastImageExample*',
        'ReactNativeFastImageExampleServer*',
    ],
};
