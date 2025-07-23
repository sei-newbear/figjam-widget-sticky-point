/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
  transform: {
    '^.+\.tsx?': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/test/tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    // CSS/SCSSファイルのモック (もしあれば)
    '\.(css|less|scss|sass)$ ': 'identity-obj-proxy',
  },
  verbose: true,
};
