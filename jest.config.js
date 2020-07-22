module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  transform: { '^.+\\.tsx?$': 'ts-jest', '^.+\\.vue$': 'vue-jest' },
  globals: { 'ts-jest': { packageJson: 'package.json', tsConfig: { target: 'es6' } } },
  testMatch: ['<rootDir>/__tests__/*.(spec|test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*.vue',
    '<rootDir>/__tests__/*.[jt]s?(x)',
    '<rootDir>/__tests__/*.vue',
    '!**/*.d.ts',
    '!**/.eslintrc.js',
  ],
}
