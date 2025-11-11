// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  // Ubicaciones de tests
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
  // Soporte TS
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  moduleNameMapper: {
    // Ignora estilos y assets en imports
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1', // Si usas alias @ -> "./"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  clearMocks: true,
};

export default config;