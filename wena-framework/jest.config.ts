import { JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset();

const jestConfig: JestConfigWithTsJest = {
  transform: {'^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(picocolors))'],
  moduleNameMapper: {'^wena-test-runner/(.*)$': '<rootDir>/packages/wena-test-runner/$1'}
  ,
  extensionsToTreatAsEsm: ['.ts'],
};

export default jestConfig