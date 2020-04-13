module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN || '7ce9c738-34ba-11ea-aec2-2e728ce88125',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:password@localhost/setup',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin:password@localhost/test_setup',
    JWT_SECRET: process.env.JWT_SECRET || `b3c6ddc13c6d300d7b23f8361fabe9b993d960337cbe59be2a0752ad2639fb12da2e50a976761f96abef72413d57b40e8fa6a78b2b52f86064dc0a5782baeb66`,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '5h',
};