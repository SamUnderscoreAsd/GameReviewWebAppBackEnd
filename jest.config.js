const baseDir = '<rootDir>/Project_Structure/'

const config = {
    verbose : true,    
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/*`
    ]
}

export default config