module.exports = {
    preset: "ts-jest",
    globals: {
        __DEV__: true,
    },
    coverageDirectory: "coverage",
    coverageReporters: ["html", "lcov", "text"],
    collectCoverageFrom: ["src/**/*.ts"],
    watchPathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "json", "vue"],
    rootDir: __dirname,
    testMatch: ["<rootDir>/src/**/__tests__/**/*spec.[jt]s?(x)"],
};
