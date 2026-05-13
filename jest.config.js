module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'src/controllers/**/*.js',
        'src/routes/**/*.js',
        '!src/**/*.config.js'
    ],
    coverageDirectory: 'coverage',
    testTimeout: 10000,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};
