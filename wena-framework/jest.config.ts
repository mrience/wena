import { JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset();

const jestConfig: JestConfigWithTsJest = {
  ...esmPreset
};

export default jestConfig
