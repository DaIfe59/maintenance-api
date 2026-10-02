module.exports = {
  testEnvironment: "node",

  testMatch: [
    "**/tests/**/*.test.js"
  ],

  collectCoverageFrom: [
    "src/services/**/*.js",
    "src/middlewares/**/*.js"
  ],

  coverageDirectory: "coverage",

  coverageReporters: [
    "text",
    "text-summary",
    "lcov"
  ],

  clearMocks: true
};