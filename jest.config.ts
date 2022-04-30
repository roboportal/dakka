import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ['playground', 'integration'],
  moduleNameMapper: {
    '^@/components(.*)$': '<rootDir>/src/panel/components$1',
    '^@/hooks(.*)$': '<rootDir>/src/panel/hooks$1',
    '^@/store(.*)$': '<rootDir>/src/panel/store$1',
  },
}

export default config
