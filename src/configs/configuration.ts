const configuration = () => ({
    port: parseInt(process.env?.PORT || '8080', 10),
    baseUrlApi: process.env.BASE_URL_API,
    authentication: {
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
        jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
});

export default configuration;
