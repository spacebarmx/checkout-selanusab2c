module.exports = {
  displayName: 'kuesky-commerce-integration',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: false,
    }],
},
  setupFilesAfterEnv: ['../../jest-setup.ts'],
  coverageDirectory: '../../coverage/packages/kuesky-commerce-integration'
};
