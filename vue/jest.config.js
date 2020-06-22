module.exports = {
    preset: "ts-jest",
    globals: {
        __DEV__: true,
        __LOGGING__: false,
    },
    coverageDirectory: "coverage",
    coverageReporters: ["html", "lcov", "text"],
    collectCoverageFrom: ["src/**/*.ts"],
    watchPathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "json", "vue"],
    rootDir: __dirname,
    testMatch: ["<rootDir>/**/__tests__/**/*spec.[jt]s?(x)"],
};
