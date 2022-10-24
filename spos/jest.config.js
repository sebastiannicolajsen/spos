module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<root_dir>/node_modules/'],
    testPathIgnorePatterns: [
      "<rootDir>/build/"
    ],
  };