import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ['testPlayground'],
  moduleNameMapper: {
    '^@/components(.*)$': '<rootDir>/src/panel/components$1',
    '^@/constants(.*)$': '<rootDir>/src/panel/constants$1',
    '^@/hooks(.*)$': '<rootDir>/src/panel/hooks$1',
    '^@/store(.*)$': '<rootDir>/src/panel/store$1',
    '^@/utils(.*)$': '<rootDir>/src/panel/utils$1',
  },
}

export default config
