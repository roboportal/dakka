import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ['playground', 'integration'],
  moduleNameMapper: {
    '^@/components(.*)$': '<rootDir>/src/panel/components$1',
    '^@/hooks(.*)$': '<rootDir>/src/panel/hooks$1',
    '^@/store(.*)$': '<rootDir>/src/panel/store$1',

    '^@roboportal/constants(.*)$': '<rootDir>/packages/constants$1',
    '^@roboportal/export_processors(.*)$':
      '<rootDir>/packages/exportProcessors$1',
    '^@roboportal/types(.*)$': '<rootDir>/packages/types$1',
    '^@roboportal/utils(.*)$': '<rootDir>/packages/utils$1',
  },
  transformIgnorePatterns: ['/(?!(packages)/)'],
}

export default config
