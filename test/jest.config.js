// jest.config.js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./test/setup.js"], // Optional setup file
};
