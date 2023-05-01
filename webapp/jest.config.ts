export default {
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    roots: ["<rootDir>/src/tests"],
    testEnvironment: 'jsdom',
}